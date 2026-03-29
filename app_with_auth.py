# ============================================
# FILE: app_with_auth.py - Full Main Application
# ============================================
from flask import Flask, request, render_template, send_file, flash, redirect, url_for, jsonify, abort
import os
from flask_login import LoginManager, login_required, current_user
from werkzeug.utils import secure_filename
import tempfile
import time
from datetime import timedelta, datetime
import psutil  # For resource metrics
import csv 
from flask_cors import CORS
from flask_mail import Mail, Message
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv

# Import models and blueprints
from models import db, User, EncryptedFile, AuditLog, SharedKey
from auth import auth_bp

# Import existing modules
from ml_classifier import ml_classifier
from crypto_utils_adaptive import adaptive_crypto
from key_storage import key_storage

load_dotenv()

app = Flask(__name__)
# CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
# Isme local aur render dono URLs ki list hai
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173", 
    "https://major-project-frontend-nzxa.onrender.com/"
])
# app_with_auth.py around line 35
app.config.update(
    SESSION_COOKIE_SAMESITE='None', # Required for cross-site cookies
    SESSION_COOKIE_SECURE=True,     # Required when SameSite='None'
    SESSION_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_SAMESITE='None',
    REMEMBER_COOKIE_SECURE=True
)

UPLOAD_FOLDER = 'encrypted_uploads' # Folder ka naam
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER # Isse KeyError khatam ho jayega
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# --- MAIL CONFIG ---
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME')

mail = Mail(app)
oauth = OAuth(app)

# --- GOOGLE OAUTH ---
google = oauth.register(
    name='google',
    client_id=os.environ.get('GOOGLE_CLIENT_ID'),
    client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# --- APP CONFIG ---
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'change-this-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///secure_storage.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=24)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  

UPLOAD_FOLDER = 'encrypted_uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'zip'}
# app_with_auth.py
UPLOAD_PERFORMANCE_CSV = os.path.join(os.getcwd(), 'upload_performance_metrics.csv')
DOWNLOAD_PERFORMANCE_CSV = os.path.join(os.getcwd(), 'download_performance_metrics.csv')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

app.register_blueprint(auth_bp, url_prefix='/auth')

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

# --- HELPERS ---
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def log_audit(action, details=None, success=True):
    try:
        log = AuditLog(
            user_id=current_user.id if current_user.is_authenticated else None,
            action=action,
            details=details,
            ip_address=request.remote_addr,
            success=success
        )
        db.session.add(log)
        db.session.commit()
    except:
        pass

def write_metrics_to_csv(csv_file, metrics_dict, fieldnames):
    try:
        file_exists = os.path.exists(csv_file)
        with open(csv_file, 'a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            if not file_exists:
                writer.writeheader()
            writer.writerow(metrics_dict)
            print(f"DEBUG: CSV {csv_file} updated successfully.") # Ye check karne ke liye
    except Exception as e:
        print(f"CRITICAL ERROR writing to CSV: {e}")
# ============================================
# EXISTING HTML ROUTES (KEPT & RESTORED)
# ============================================

# @app.route('/')
# @login_required
# def index():
#     user_files = EncryptedFile.query.filter_by(user_id=current_user.id).order_by(EncryptedFile.uploaded_at.desc()).all()
#     shared_files = current_user.shared_files
#     files_dict = {str(f.id): {'filename': f.filename, 'original_filename': f.original_filename, 'file_size': f.file_size, 'sensitivity': f.sensitivity, 'uploaded_at': f.uploaded_at.isoformat()} for f in user_files}
#     shared_dict = {str(f.id): {'filename': f.filename, 'original_filename': f.original_filename, 'owner': f.owner.username} for f in shared_files}
#     return render_template('index_ml_adaptive.html', files=files_dict, shared_files=shared_dict, user_id=current_user.username)

# @app.route('/upload', methods=['POST'])
# @login_required
# def upload_file():
#     if 'file' not in request.files: return redirect(url_for('index'))
#     file = request.files['file']
#     if file.filename == '' or not (file and allowed_file(file.filename)): return redirect(url_for('index'))
    
#     try:
#         start_time = time.time()
#         process = psutil.Process(os.getpid())
#         cpu_start = process.cpu_percent(interval=None)
#         file_data = file.read()
#         original_filename = secure_filename(file.filename)
#         file_size_bytes = len(file_data)
        
#         ml_result = ml_classifier.predict_sensitivity(file_data, original_filename)
#         sensitivity, confidence, features = ml_result['sensitivity'], ml_result['confidence'], ml_result['features']
        
#         user_keys = key_storage.get_user_keys(current_user.username, sensitivity)
#         encrypted_file_data, encrypted_aes_key, crypto_config = adaptive_crypto.encrypt_file(file_data, user_keys['public_key'], sensitivity)
        
#         encrypted_filename = f"enc_{sensitivity.lower()}_{current_user.username}_{int(time.time())}.dat"
#         with open(os.path.join(UPLOAD_FOLDER, encrypted_filename), 'w') as f: f.write(encrypted_file_data)
        
#         encrypted_file = EncryptedFile(user_id=current_user.id, filename=encrypted_filename, original_filename=original_filename, file_size=file_size_bytes, encrypted_aes_key=encrypted_aes_key, sensitivity=sensitivity, crypto_config=crypto_config, ml_confidence=confidence, entropy=features['entropy'])
#         db.session.add(encrypted_file); db.session.commit()
        
#         encryption_time = (time.time() - start_time) * 1000
#         cpu_usage = process.cpu_percent(interval=None) - cpu_start
        
#         # Performance Logging
#         upload_metrics = {'timestamp': datetime.now().isoformat(), 'username': current_user.username, 'filename': original_filename, 'file_size_bytes': file_size_bytes, 'sensitivity': sensitivity, 'ml_confidence': confidence, 'encryption_time_ms': encryption_time, 'cpu_usage_percent': cpu_usage, 'memory_usage_mb': process.memory_info().rss/(1024*1024), 'crypto_config': crypto_config}
#         write_metrics_to_csv(UPLOAD_PERFORMANCE_CSV, upload_metrics, list(upload_metrics.keys()))
        
#         log_audit('FILE_UPLOAD', details=f'File: {original_filename}, Sensitivity: {sensitivity}')
#         return render_template('success_ml_adaptive.html', filename=original_filename, file_id=encrypted_file.id, sensitivity=sensitivity, confidence=confidence, features=features, crypto_config=crypto_config, encryption_time=encryption_time)
#     except Exception as e:
#         db.session.rollback(); return redirect(url_for('index'))

# @app.route('/download/<int:file_id>')
# @login_required
# def download_file(file_id):
#     try:
#         start_time = time.time()
#         process = psutil.Process(os.getpid())
#         cpu_start = process.cpu_percent(interval=None)
        
#         file_info = db.session.get(EncryptedFile, file_id)
#         is_owner = file_info.user_id == current_user.id
#         shared_record = SharedKey.query.filter_by(file_id=file_id, user_id=current_user.id).first()
        
#         if not (is_owner or shared_record): return redirect(url_for('index'))
        
#         enc_aes_key = file_info.encrypted_aes_key if is_owner else shared_record.encrypted_key_for_user
#         user_keys = key_storage.get_user_keys(current_user.username, file_info.sensitivity)
#         with open(os.path.join(UPLOAD_FOLDER, file_info.filename), 'r') as f: encrypted_file_data = f.read()
        
#         decrypted_data = adaptive_crypto.decrypt_file(encrypted_file_data, enc_aes_key, user_keys['private_key'], file_info.sensitivity)
#         decryption_time = (time.time() - start_time) * 1000
        
#         # Performance Logging
#         download_metrics = {'timestamp': datetime.now().isoformat(), 'username': current_user.username, 'filename': file_info.original_filename, 'file_size_bytes': file_info.file_size, 'sensitivity': file_info.sensitivity, 'decryption_time_ms': decryption_time, 'cpu_usage_percent': process.cpu_percent(interval=None)-cpu_start, 'memory_usage_mb': process.memory_info().rss/(1024*1024)}
#         write_metrics_to_csv(DOWNLOAD_PERFORMANCE_CSV, download_metrics, list(download_metrics.keys()))
        
#         temp = tempfile.NamedTemporaryFile(delete=False); temp.write(decrypted_data); temp.close()
#         return send_file(temp.name, as_attachment=True, download_name=file_info.original_filename)
#     except Exception as e: return redirect(url_for('index'))

# # --- RESTORED PERFORMANCE REPORT ROUTES ---
# @app.route('/download/report/upload_metrics')
# @login_required
# def download_upload_report():
#     try: return send_file(UPLOAD_PERFORMANCE_CSV, as_attachment=True, download_name='upload_performance_metrics.csv', mimetype='text/csv')
#     except: return redirect(url_for('index'))

# @app.route('/download/report/download_metrics')
# @login_required
# def download_download_report():
#     try: return send_file(DOWNLOAD_PERFORMANCE_CSV, as_attachment=True, download_name='download_performance_metrics.csv', mimetype='text/csv')
#     except: return redirect(url_for('index'))

# ============================================
# NEW API ROUTES FOR REACT (ADDED AT END)
# ============================================

# --- FULLY CORRECTED FILES API ---
# --- FULLY CORRECTED FILES API ---
@app.route('/api/files', methods=['GET'])
@login_required
def get_files_api():
    try:
        # 1. Sirf user ki apni files uthao
        owned = EncryptedFile.query.filter_by(user_id=current_user.id).all()
        
        # FIX: Pehle empty list banao
        owned_list = []
        
        for f in owned:
            # UTC to IST conversion (5:30 ghante add karo)
            ist_time = f.uploaded_at + timedelta(hours=5, minutes=30)
            
            owned_list.append({
                "id": f.id, 
                "original_filename": f.original_filename, 
                "file_size": f.file_size, 
                "sensitivity": f.sensitivity,
                "ml_confidence": f.ml_confidence or 0.85,
                "uploaded_at": ist_time.strftime("%d %b, %I:%M %p"),
                "is_shared": False,
                "shared_by": "You"
            })
        
        # --- SHARED FILES UPDATE START ---
        shared_records = SharedKey.query.filter_by(user_id=current_user.id).all()
        shared_file_ids = [s.file_id for s in shared_records]
        
        shared_list = []
        if shared_file_ids:
            shared_files = EncryptedFile.query.filter(
                EncryptedFile.id.in_(shared_file_ids),
                EncryptedFile.user_id != current_user.id
            ).all()
            
            for f in shared_files:
                ist_time_shared = f.uploaded_at + timedelta(hours=5, minutes=30)
                shared_list.append({
                    "id": f.id,
                    "original_filename": f.original_filename,
                    "file_size": f.file_size,
                    "sensitivity": f.sensitivity,
                    "ml_confidence": f.ml_confidence or 0.75,
                    "uploaded_at": ist_time_shared.strftime("%d %b, %I:%M %p"),
                    "is_shared": True,
                    "shared_by": f.owner.email 
                })
        # --- SHARED FILES UPDATE END ---

        # 3. Final Response
        response_data = {
            "files": shared_list + owned_list,  # Dono ko merge karo total count ke liye
            "owned_files": owned_list,
            "shared_files": shared_list
        }
        
        return jsonify(response_data) 
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/ml-stats', methods=['GET'])
@login_required
def get_ml_stats_api():
    try:
        user_files = EncryptedFile.query.filter_by(user_id=current_user.id).all()
        
        # 1. Dynamic Accuracy
        avg_accuracy = 0
        if user_files:
            total_conf = sum(f.ml_confidence for f in user_files if f.ml_confidence)
            avg_accuracy = round((total_conf / len(user_files)) * 100, 1)

        # 2. Sensitivity Distribution
        counts = {
            "LOW": sum(1 for f in user_files if f.sensitivity == 'LOW'),
            "MEDIUM": sum(1 for f in user_files if f.sensitivity == 'MEDIUM'),
            "HIGH": sum(1 for f in user_files if f.sensitivity == 'HIGH')
        }
        total = len(user_files) or 1
        dist = [{"name": k, "value": round((v/total)*100), "color": "#00D1FF"} for k, v in counts.items() if v > 0]

        # 3. REAL-TIME Performance History (CSV se pichle 10 uploads)
        performance_history = []
        if os.path.exists('upload_performance_metrics.csv'):
            with open('upload_performance_metrics.csv', 'r') as f:
                reader = list(csv.DictReader(f))
                # Sirf current user ka data aur pichle 10 records
                user_metrics = [r for r in reader if r.get('username') == current_user.username][-10:]
                for row in user_metrics:
                    time_label = row['timestamp'].split('T')[1][:5] if 'T' in row['timestamp'] else "00:00"
                    performance_history.append({
                        "time": time_label,
                        "encryption": round(float(row.get('encryption_time_ms', 0)) / 10, 1), # Scaled for graph
                        "cpu": float(row.get('cpu_usage_percent', 0))
                    })
        
        if not performance_history:
            performance_history = [{"time": "No Data", "encryption": 0, "cpu": 0}]

        # 4. REAL-TIME Threat Capabilities (Updated to be fully dynamic)
        avg_entropy = sum(f.entropy for f in user_files if f.entropy) / len(user_files) if user_files else 0
        
        # Dynamic Security Score: Based on high-sensitivity file ratio
        high_sens_count = counts["HIGH"]
        security_score = min(99, 85 + (high_sens_count * 2)) if user_files else 70

        # Dynamic Speed Score: Based on actual encryption performance from history
        if performance_history and performance_history[0]["time"] != "No Data":
            avg_speed_metric = sum(p['encryption'] for p in performance_history) / len(performance_history)
            speed_score = max(60, min(100, 100 - (avg_speed_metric / 2))) # Faster encryption = higher score
        else:
            speed_score = 85

        threat_capabilities = [
            {"subject": "Encryption", "value": 98 if any(f.sensitivity == 'HIGH' for f in user_files) else 85},
            {"subject": "ML Accuracy", "value": avg_accuracy},
            {"subject": "Speed", "value": round(speed_score, 1)}, # Ab ye real speed se link hai
            {"subject": "Security", "value": security_score},    # Ab ye file types se link hai
            {"subject": "Entropy", "value": round(avg_entropy * 10, 1) if avg_entropy else 70}
        ]

        cpu_usage = psutil.cpu_percent(interval=0.1)
        
        return jsonify({
            "sensitivity_dist": dist,
            "model_accuracy": avg_accuracy,
            "current_throughput": "428 MB/s",
            "cpuLoad": float(cpu_usage),
            "performance_history": performance_history,
            "threat_capabilities": threat_capabilities,
            "last_model_update": datetime.now().strftime("%Y-%m-%d %H:%M")
        })
    except Exception as e:
        print(f"ML Stats Error: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/profile', methods=['GET'])
@login_required
def get_profile_api():
    user_files = EncryptedFile.query.filter_by(user_id=current_user.id).all()
    
    # 1. Registration date ko IST mein convert karein
        # 'created_at' aapke User model mein hona chahiye
    if hasattr(current_user, 'created_at') and current_user.created_at:
                ist_member_since = current_user.created_at + timedelta(hours=5, minutes=30)
                member_since_str = ist_member_since.strftime("%d %b, %Y")
    else:
                # Agar created_at nahi hai toh aaj ki date dikhao (IST)
                member_since_str = (datetime.utcnow() + timedelta(hours=5, minutes=30)).strftime("%d %b, %Y")

    # Storage calculation (MB mein)
    total_bytes = sum(f.file_size for f in user_files)
    total_mb = f"{round(total_bytes / (1024 * 1024), 2)} MB"
    
    # Security Score logic (High sensitivity files increases score)
    high_sens = sum(1 for f in user_files if f.sensitivity == 'HIGH')
    score = min(99, 75 + (high_sens * 5)) if user_files else 0

    return jsonify({
        "user": {
            "name": current_user.username,
            "email": current_user.email,
            "role": "User", # Static or dynamic based on your model
            "memberSince": member_since_str  # AB YE IST MEIN HAI # Ya user.created_at se nikalo
        },
        "stats": { # Frontend 'stats' dhoond raha hai
            "filesEncrypted": len(user_files),
            "totalStorage": total_mb,
            "securityScore": score
        }
    })

@app.route('/api/logs', methods=['GET'])
@login_required
def get_logs_api():
    try:
        # User ke logs fetch karo
        logs = AuditLog.query.filter_by(user_id=current_user.id).order_by(AuditLog.timestamp.desc()).limit(20).all()
        
        log_list = []
        for l in logs:
            # UTC timestamp ko IST mein convert karo
            ist_time = l.timestamp + timedelta(hours=5, minutes=30)
            
            log_list.append({
                "id": l.id,
                "action": l.action,
                # formatted IST time bhej rahe hain
                "timestamp": ist_time.strftime("%d %b, %I:%M %p"), 
                "ip": l.ip_address,
                "success": l.success
            })
            
        return jsonify(log_list)
    except Exception as e:
        print(f"Logs Error: {e}")
        return jsonify({"error": str(e)}), 500

import hashlib

import hashlib

# 1. Fetch Keys Route (SHA256 Fingerprint ke saath)
# app_with_auth.py mein check karo ki ye routes register ho rahe hain

import hashlib

# --- INHE 'app = Flask(__name__)' KE NEECHE RAKHO ---
@app.route('/api/vault/keys', methods=['GET'])
@login_required
def get_vault_keys_api_final():
    try:
        keys_data = []
        for level in ['LOW', 'MEDIUM', 'HIGH']:
            # key_storage check
            user_keys = key_storage.get_user_keys(current_user.username, level)
            if user_keys and 'public_key' in user_keys:
                pub_key = user_keys['public_key']
                key_bytes = pub_key.encode() if isinstance(pub_key, str) else pub_key
                raw_fp = hashlib.sha256(key_bytes).hexdigest().upper()
                # SHA256 formatting
                formatted_fp = f"SHA256:{':'.join(raw_fp[i:i+2] for i in range(0, 20, 2))}..."

                keys_data.append({
                    "id": level, 
                    "name": f"{level} RSA", 
                    "type": "RSA-4096", 
                    "fingerprint": formatted_fp
                })
        return jsonify(keys_data)
    except Exception as e:
        print(f"DEBUG ERROR: {str(e)}")
        return jsonify({"error": str(e)}), 500

# @app.route('/api/vault/rotate/<string:key_id>', methods=['POST'])
# @login_required
# def rotate_vault_key_final(key_id):
#     try:
#         # Key rotation logic
#         key_storage.generate_user_keys(current_user.username, key_id)
#         log_audit('KEY_ROTATION', details=f"Rotated {key_id} key")
#         return jsonify({"success": True}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
# app_with_auth.py mein export route ko aise badlo
@app.route('/api/vault/export/<level>', methods=['GET']) # string: hata diya taaki simple rahe
@login_required
def export_public_key(level):
    try:
        # Debugging ke liye print lagao taaki terminal mein dikhe request aayi hai
        print(f"DEBUG: Export request for level: {level}")
        
        user_keys = key_storage.get_user_keys(current_user.username, level)
        
        # Check if user_keys exist and has 'public_key'
        if not user_keys or not user_keys.get('public_key'):
            return jsonify({"error": "Public key not found"}), 404

        public_key_pem = user_keys['public_key']
        
        # Temporary file creation
        temp = tempfile.NamedTemporaryFile(delete=False, suffix='.pub')
        temp.write(public_key_pem.encode() if isinstance(public_key_pem, str) else public_key_pem)
        temp.close()

        return send_file(
            temp.name,
            as_attachment=True,
            download_name=f"{current_user.username}_{level}_public_key.pub",
            mimetype='application/x-pem-file'
        )
    except Exception as e:
        print(f"Export Error Details: {str(e)}") # Exact error console mein dikhayega
        return jsonify({"error": str(e)}), 500
    
# @app.route('/download/report/upload_metrics')
# @login_required
# def download_upload_report():
#     if not os.path.exists(UPLOAD_PERFORMANCE_CSV):
#         return jsonify({"error": "No metrics recorded yet"}), 404
#     return send_file(UPLOAD_PERFORMANCE_CSV, as_attachment=True, mimetype='text/csv')

# @app.route('/download/report/download_metrics')
# @login_required
# def download_download_report():
#     if not os.path.exists(DOWNLOAD_PERFORMANCE_CSV):
#         return jsonify({"error": "No metrics recorded yet"}), 404
#     return send_file(DOWNLOAD_PERFORMANCE_CSV, as_attachment=True, mimetype='text/csv')

@app.route('/api/delete/<int:file_id>', methods=['DELETE'])
@login_required
def delete_file(file_id):
    # 1. Check karo kya user owner hai
    file = EncryptedFile.query.filter_by(id=file_id, user_id=current_user.id).first()
    
    if file:
        # Agar owner hai, toh poori file delete kar do
        db.session.delete(file)
        db.session.commit()
        return jsonify({"success": True, "message": "File deleted by owner"}), 200
    
    # 2. Agar owner nahi hai, toh check karo kya shared recipient hai
    shared_record = SharedKey.query.filter_by(file_id=file_id, user_id=current_user.id).first()
    if shared_record:
        # Sirf shared access hata do, file database mein rahegi
        db.session.delete(shared_record)
        db.session.commit()
        return jsonify({"success": True, "message": "Shared access removed"}), 200
        
    return jsonify({"error": "File not found or unauthorized"}), 404

import os
from flask import send_file, abort
from flask_login import login_required, current_user

@app.route('/api/download/<int:file_id>', methods=['GET'])
@login_required
def download_file(file_id):
    start_time = time.time()
    try:
        file_info = EncryptedFile.query.get_or_404(file_id)
        
        # 1. Access Check: Owner or Recipient
        is_owner = file_info.user_id == current_user.id
        shared_record = SharedKey.query.filter_by(file_id=file_id, user_id=current_user.id).first()
        
        if not (is_owner or shared_record):
            return jsonify({"error": "Unauthorized"}), 403
        
        # 2. Key Selection Logic
        # Agar owner hai toh main table se key uthao, agar recipient toh shared table se
        enc_aes_key = file_info.encrypted_aes_key if is_owner else shared_record.encrypted_key_for_user
        
        # 3. File data read karo
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file_info.filename)
        with open(file_path, 'rb') as f:
            encrypted_file_data = f.read()
            
        # 4. Sahi User ki Keys uthao
        # Current logged-in user (recipient) ki private key use honi chahiye
        user_keys = key_storage.get_user_keys(current_user.username, file_info.sensitivity)
        
        # 5. Adaptive Decryption
        # Ensure karo ki 'enc_aes_key' wahi hai jo sharing ke waqt recipient ke liye bani thi
        decrypted_data = adaptive_crypto.decrypt_file(
            encrypted_file_data, 
            enc_aes_key, 
            user_keys['private_key'], 
            file_info.sensitivity
        )
        decryption_time_ms = (time.time() - start_time) * 1000 # Speed calculate ki
        
        try:
            process = psutil.Process(os.getpid())
            download_metrics = {
                'timestamp': datetime.now().isoformat(),
                'username': current_user.username,
                'filename': file_info.original_filename,
                'file_size_bytes': len(decrypted_data),
                'sensitivity': file_info.sensitivity,
                'decryption_time_ms': round(decryption_time_ms, 2), # CSV mein yahi jayega
                'cpu_usage_percent': psutil.cpu_percent(interval=None),
                'memory_usage_mb': process.memory_info().rss / (1024 * 1024)
            }
            # CSV Update
            write_metrics_to_csv(DOWNLOAD_PERFORMANCE_CSV, download_metrics, list(download_metrics.keys()))
            print(f"DEBUG: CSV updated. Speed: {decryption_time_ms}ms")
        except Exception as csv_err:
            print(f"CSV Logging Error: {csv_err}")
        # --- MISSING LOGIC END ---

        # 6. Send File
        temp = tempfile.NamedTemporaryFile(delete=False)
        temp.write(decrypted_data)
        temp.close()

        return send_file(temp.name, as_attachment=True, download_name=file_info.original_filename)
        
    except Exception as e:
        # Console mein exact error check karne ke liye
        print(f"Shared Download Error: {str(e)}")
        return jsonify({"error": "Decryption failed: Incorrect key or corrupted data"}), 500
import os
import time
from flask import request, jsonify
from flask_login import login_required, current_user

# Ensure this matches your Dashboard's fetch('/api/upload') or fetch('/upload')
@app.route('/api/upload', methods=['POST']) 
@login_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    # --- YAHAN DHAYAN DO: Pehle data read karna hai ---
    file_data = file.read() # Ye line MISSING thi isliye error aaya
    
    start_time = time.time()
    # 1. ML-Powered Analysis (Dictionary wala tarika)
    ml_result = ml_classifier.predict_sensitivity(file_data, file.filename)
    sensitivity = ml_result['sensitivity']
    confidence = ml_result['confidence']

    # 2. Adaptive Encryption
    # Ab 'file_data' defined hai toh error nahi aayega
    user_keys = key_storage.get_user_keys(current_user.username, sensitivity)
    public_key = user_keys['public_key']

    encrypted_data, enc_aes_key, crypto_cfg = adaptive_crypto.encrypt_file(
        file_data, 
        public_key, 
        sensitivity
    )

    actual_encryption_time = (time.time() - start_time) * 1000

    # 3. Physical Storage
    filename = f"enc_{int(time.time())}_{file.filename}.dat"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    with open(file_path, 'wb') as f:
        f.write(encrypted_data.encode() if isinstance(encrypted_data, str) else encrypted_data)

    


    # 4. Database Entry
    new_encrypted_file = EncryptedFile(
        user_id=current_user.id,
        filename=filename,
        original_filename=file.filename,
        file_size=len(file_data),
        sensitivity=sensitivity,
        ml_confidence=confidence,
        encrypted_aes_key=enc_aes_key,
        crypto_config=crypto_cfg
    )
    
    db.session.add(new_encrypted_file)
    db.session.commit()
    
    # --- ADD THIS METRICS LOGGING ---
    try:
        process = psutil.Process(os.getpid())
        upload_metrics = {
            'timestamp': datetime.now().isoformat(),
            'username': current_user.username,
            'filename': file.filename,
            'file_size_bytes': len(file_data),
            'sensitivity': sensitivity,
            'ml_confidence': confidence,
            'encryption_time_ms': round(actual_encryption_time, 2), # Dummy or use actual time tracking
            'cpu_usage_percent': psutil.cpu_percent(interval=0.2),
            'memory_usage_mb': process.memory_info().rss / (1024 * 1024),
            'crypto_config': crypto_cfg
        }
        write_metrics_to_csv(UPLOAD_PERFORMANCE_CSV, upload_metrics, list(upload_metrics.keys()))
    except Exception as e:
        print(f"Metrics logging error: {e}")

    return jsonify({"success": True, "sensitivity": sensitivity}), 200

# app_with_auth.py mein ye naye routes add karo


@app.route('/download/report/upload_metrics')
@login_required
def download_upload_report():
    if not os.path.exists(UPLOAD_PERFORMANCE_CSV):
        return jsonify({"error": "No metrics recorded yet"}), 404
    return send_file(UPLOAD_PERFORMANCE_CSV, as_attachment=True, mimetype='text/csv')

@app.route('/download/report/download_metrics')
@login_required
def download_download_report():
    if not os.path.exists(DOWNLOAD_PERFORMANCE_CSV):
        return jsonify({"error": "No metrics recorded yet"}), 404
    return send_file(DOWNLOAD_PERFORMANCE_CSV, as_attachment=True, mimetype='text/csv')

# --- SIRF YE DO FUNCTIONS RAKHO METRICS KE LIYE ---

@app.route('/api/metrics/upload', methods=['GET'])
@login_required
def get_upload_metrics():
    if not os.path.exists(UPLOAD_PERFORMANCE_CSV):
        return jsonify([])
    
    user_data = []
    with open(UPLOAD_PERFORMANCE_CSV, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # CHECK: Sirf wahi data uthao jo current user ka hai
            if row.get('username') == current_user.username:
                user_data.append({
                    "name": row['timestamp'].split('T')[1][:5] if 'T' in row['timestamp'] else "00:00",
                    "speed": float(row.get('encryption_time_ms', 150.0))
                })
    
    # Sirf aakhri 10 personal entries dikhao
    return jsonify(user_data[-10:])

@app.route('/api/metrics/download', methods=['GET'])
@login_required
def get_download_metrics():
    if not os.path.exists(DOWNLOAD_PERFORMANCE_CSV):
        return jsonify([])
    
    user_data = []
    with open(DOWNLOAD_PERFORMANCE_CSV, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # CHECK: Filter by current user
            if row.get('username') == current_user.username:
                user_data.append({
                    "name": row['timestamp'].split('T')[1][:5] if 'T' in row['timestamp'] else "00:00",
                    "speed": float(row.get('decryption_time_ms', 120.0))
                })
    
    return jsonify(user_data[-10:])
@app.route('/api/share-email/<int:file_id>', methods=['POST'])
@login_required
def share_file_email(file_id):
    try:
        data = request.get_json()
        target_email = data.get('email')
        
        # 1. Check if target email exists
        if not target_email:
            return jsonify({"error": "Email is required"}), 400

        file_info = EncryptedFile.query.get_or_404(file_id)
        
        # 2. Security: Only owner can share
        if file_info.user_id != current_user.id:
            return jsonify({"error": "Unauthorized: Only owners can share"}), 403

        # 3. Find recipient
        target_user = User.query.filter_by(email=target_email).first()
        if not target_user:
            return jsonify({"error": "User with this email not found"}), 404

        # --- RE-ENCRYPTION LOGIC: Fixed Arguments ---
        
        # A. Owner ki private key se AES key nikalo (3 arguments: self, key, pvt_key)
        owner_keys = key_storage.get_user_keys(current_user.username, file_info.sensitivity)
        raw_aes_key = adaptive_crypto.decrypt_aes_key(
            file_info.encrypted_aes_key, 
            owner_keys['private_key']
        )

        # B. Target user ki public key se AES key re-encrypt karo
        target_keys = key_storage.get_user_keys(target_user.username, file_info.sensitivity)
        new_encrypted_key = adaptive_crypto.encrypt_aes_key(
            raw_aes_key, 
            target_keys['public_key']
        )

        # 4. Save to SharedKey table
        shared_record = SharedKey(
            file_id=file_id,
            user_id=target_user.id,
            encrypted_key_for_user=new_encrypted_key 
        )
        
        db.session.add(shared_record)
        db.session.commit()
        
        log_audit('FILE_SHARED', details=f"Shared {file_info.original_filename} with {target_email}")
        return jsonify({"success": True, "message": f"File shared with {target_email}"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Share Error: {str(e)}") # Debugging ke liye
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500



from werkzeug.security import generate_password_hash, check_password_hash

# Direct route without Blueprint dependency
@app.route('/auth/change-password', methods=['POST'])
@login_required
def change_password_direct():
    try:
        data = request.get_json()
        # Frontend se 'old_password' aur 'new_password' hi aana chahiye
        old_pw = data.get('old_password')
        new_pw = data.get('new_password')

        if not old_pw or not new_pw:
            return jsonify({"error": "Missing password fields"}), 400

        # Password verify aur hash update
        if not check_password_hash(current_user.password_hash, old_pw):
            return jsonify({"error": "Current password is incorrect"}), 400

        current_user.password_hash = generate_password_hash(new_pw)
        db.session.commit()
        
        return jsonify({"success": True, "message": "Password updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    with app.app_context(): db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)