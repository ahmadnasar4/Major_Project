from flask import Blueprint, request, redirect, url_for, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User, AuditLog
from datetime import datetime
import re
import pyotp 
import os  
from flask_mail import Message

auth_bp = Blueprint('auth', __name__)

# --- HELPERS ---
def log_audit(action, user_id=None, details=None, success=True):
    try:
        effective_user_id = user_id or (current_user.id if current_user.is_authenticated else None)
        log = AuditLog(
            user_id=effective_user_id,
            action=action,
            details=details,
            ip_address=request.remote_addr,
            success=success
        )
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        print(f"Audit log error: {e}")

def validate_password(password):
    if len(password) < 8: return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password): return False, "Missing uppercase letter"
    if not re.search(r'\d', password): return False, "Missing a digit"
    return True, "Valid"

# --- API ROUTES FOR REACT ---

@auth_bp.route('/register', methods=['POST'])
def register():
    """API for React RegisterPage.tsx"""
    data = request.json # React sends JSON
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    try:
        user = User(
            username=username or email.split('@')[0],
            email=email,
            otp_secret=pyotp.random_base32()
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        session['pre_2fa_user_id'] = user.id 
        
        # Key Generation for CogniGuard Architecture
        from crypto_utils_adaptive import adaptive_crypto
        from key_storage import key_storage
        for sensitivity in ['LOW', 'MEDIUM', 'HIGH']:
            pub, priv, _ = adaptive_crypto.generate_key_pair(sensitivity)
            key_storage.store_user_keys(pub, priv, user.username, sensitivity)

        log_audit('REGISTER_SUCCESS', user_id=user.id)
        return jsonify({"message": "Registration successful", "email": email}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """API for React LoginPage.tsx"""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        # We don't log them in yet; we require 2FA
        # In a real SPA, we'd issue a temporary JWT or session flag
        session['pre_2fa_user_id'] = user.id
        return jsonify({
            "mfa_required": True,
            "setup_required": user.last_login is None,
            "email": email
        }), 200
    
    log_audit('LOGIN_FAILED', details=f"Failed attempt for {email}", success=False)
    return jsonify({"error": "Invalid email or password"}), 401

import urllib.parse

@auth_bp.route('/setup-2fa-data', methods=['GET'])
def setup_2fa_api():
    # DEBUG: Terminal mein check karein session aa raha hai ya nahi
    user_id = session.get('pre_2fa_user_id')
    print(f"DEBUG Setup 2FA: Session user_id is {user_id}") 
    
    if not user_id: 
        return jsonify({"error": "Unauthorized - No session found"}), 401
    
    user = db.session.get(User, user_id)
    
    # Secret ensure karein
    if not user.otp_secret:
        user.otp_secret = pyotp.random_base32()
        db.session.commit()

    otp_uri = pyotp.totp.TOTP(user.otp_secret).provisioning_uri(
        name=user.email, issuer_name="CogniGuard"
    )
    
    # URL Encoding zaroori hai
    encoded_uri = urllib.parse.quote(otp_uri)
    qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={encoded_uri}"
    
    return jsonify({
        "secret": user.otp_secret,
        "qr_url": qr_url
    })

import pyotp
from flask import request, session, jsonify
from flask_login import login_user
from models import db, User

@auth_bp.route('/verify-mfa', methods=['POST'])
def verify_2fa_api():
    """Enhanced Debugging Route for 2FA Verification"""
    data = request.json
    
    # 1. DEBUG: Check Session Content
    user_id = session.get('pre_2fa_user_id')
    print(f"\n--- 2FA DEBUG START ---")
    print(f"DEBUG: Session 'pre_2fa_user_id': {user_id}")
    
    if not user_id:
        print("DEBUG ERROR: Session user_id is missing. (Cookie/CORS issue?)")
        return jsonify({"error": "Session expired. Please login again."}), 401
    
    # 2. DEBUG: Verify User and Secret in DB
    user = db.session.get(User, user_id)
    if not user:
        print(f"DEBUG ERROR: No user found in database for ID {user_id}")
        return jsonify({"error": "User not found."}), 404
        
    token = data.get('code')
    print(f"DEBUG: User found: {user.username}")
    print(f"DEBUG: User Secret in DB: {user.otp_secret}")
    print(f"DEBUG: Code received from React: {token}")

    if not token:
        return jsonify({"error": "Verification code is required"}), 400

    # 3. DEBUG: Mathematical TOTP Comparison
    if not user.otp_secret:
        print("DEBUG ERROR: user.otp_secret is NULL in database.")
        return jsonify({"error": "2FA not configured for this account."}), 400

    totp = pyotp.TOTP(user.otp_secret)
    expected_now = totp.now()
    
    # Check if the code matches current, previous, or next window (to account for time drift)
    # valid_window=1 allows for a 30-second buffer on either side
    is_valid = user.verify_totp(token) 
    
    print(f"DEBUG: Server 'Expected' Code: {expected_now}")
    print(f"DEBUG: Verification Result: {is_valid}")
    print(f"--- 2FA DEBUG END ---\n")

    if is_valid:
        # 4. Finalize Login
        login_user(user) # Formally authenticate the session
        
        # Cleanup temporary session variables
        session.pop('pre_2fa_user_id', None)
        
        # Update user metadata if helper exists
        if hasattr(user, 'update_last_login'):
            user.update_last_login() # Resets failed attempts
            
        return jsonify({"success": True, "message": "Authentication successful"}), 200
    else:
        return jsonify({"error": "Invalid verification code. Ensure your phone time is synced."}), 400

    

from flask_mail import Message

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password_api():
    data = request.json
    email = data.get('email', '').strip().lower()
    user = User.query.filter_by(email=email).first()
    
    if user:
        token = user.generate_reset_token()
        db.session.commit()
        
        # Point the link back to your React Frontend URL
        frontend_url = "http://localhost:5173" 
        reset_url = f"{frontend_url}/reset-password?token={token}"
        
        msg = Message("Password Reset Request - Cyber-Sentinel",
                      recipients=[email])
        msg.body = f"To reset your password, visit the following link: {reset_url}"
        
        try:
            from app_with_auth import mail
            mail.send(msg)
            # Log the security event
            log_audit('PASSWORD_RESET_REQUESTED', user_id=user.id, details=f'Email sent to {email}')
            return jsonify({"message": "Reset email sent"}), 200
        except Exception as e:
            print(f"Mail Error: {e}")
            return jsonify({"error": "Failed to send email"}), 500
            
    # Generic success to prevent email enumeration
    return jsonify({"message": "If that email is registered, a link has been sent."}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password_api():
    """API for ResetPasswordPage.tsx"""
    data = request.json
    token = data.get('token')
    new_password = data.get('password')
    
    user = User.query.filter_by(password_reset_token=token).first()
    if not user or user.password_reset_expires < datetime.utcnow():
        return jsonify({"error": "Invalid or expired token"}), 400
    
    user.set_password(new_password)
    user.password_reset_token = None
    db.session.commit()
    return jsonify({"message": "Password updated"}), 200

@auth_bp.route('/logout', methods=['POST', 'GET'])
@login_required
def logout():
    log_audit('LOGOUT', user_id=current_user.id)
    logout_user()
    return jsonify({"success": True}), 200

# --- KEEPING OAUTH FOR GOOGLE ---
# --- GOOGLE AUTH ROUTES ---
# auth.py ke end mein dalo

@auth_bp.route('/google/login')
def trigger_google_login(): # Naam unique rakha hai taaki conflict na ho
    from app_with_auth import google
    # external=True zaroori hai taaki sahi URL bane
    redirect_uri = url_for('auth.google_callback_handler', _external=True)
    return google.authorize_redirect(redirect_uri)

import os

# Frontend ka URL dynamic uthao
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

@auth_bp.route('/google/callback')
def google_callback_handler():
    from app_with_auth import google
    try:
        token = google.authorize_access_token()
        user_info = token.get('userinfo')
        
        if not user_info:
            return redirect(f"{FRONTEND_URL}/login?error=no_user_info")

        user = User.query.filter_by(email=user_info['email']).first()
        if not user:
            # ... (tera user creation logic same rahega) ...
            
            # Naye user ke liye keys generation
            from key_storage import key_storage
            for sens in ['LOW', 'MEDIUM', 'HIGH']:
                key_storage.generate_user_keys(user.username, sens) # Direct helper use karo

        login_user(user)
        # Dashboard par sahi redirect
        return redirect(f"{FRONTEND_URL}/dashboard")
        
    except Exception as e:
        print(f"Google Auth Error: {e}")
        return redirect(f"{FRONTEND_URL}/login?error=auth_failed")

# auth.py mein add karein
@auth_bp.route('/delete-account', methods=['DELETE'])
@login_required
def delete_account():
    try:
        user = current_user
        user_id = user.id
        
        # 1. User ki saari files dhoondo aur delete karo (Database se)
        from models import EncryptedFile, SharedKey
        EncryptedFile.query.filter_by(user_id=user_id).delete()
        SharedKey.query.filter_by(user_id=user_id).delete()
        
        # 2. Audit log mein entry dalo
        log_audit('ACCOUNT_DELETED', user_id=user_id, details=f"User {user.email} deleted their account")
        
        # 3. User ko delete karo
        db.session.delete(user)
        db.session.commit()
        
        # 4. Session clear karo
        logout_user()
        
        return jsonify({"success": True, "message": "Account and all associated data deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500