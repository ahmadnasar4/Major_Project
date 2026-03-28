import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { ThemeToggle } from "../components/theme-toggle";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMFA, setShowMFA] = useState(false);
  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- CONNECTED BACKEND LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!showMFA) {
        // STEP 1: Initial Credentials Check
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.mfa_required) {
          setShowMFA(true);
        } else {
          setError(data.error || "Invalid email or password.");
        }
      } else {
        // STEP 2: MFA Code Verification
        const fullCode = mfaCode.join("");
        const response = await fetch('/auth/verify-mfa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code: fullCode }),
        });

        const data = await response.json();

        if (response.ok) {
          // Success! Backend has now set the session cookie
          navigate("/dashboard");
        } else {
          setError(data.error || "Invalid verification code.");
        }
      }
    } catch (err) {
      setError("Could not connect to the security server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMFAInput = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...mfaCode];
      newCode[index] = value;
      setMfaCode(newCode);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`mfa-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Animated background */}
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '1s' }}></div>
        </div>
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--brand-primary-light)', borderWidth: '1px', borderColor: 'var(--brand-primary)' }}>
              <Shield className="w-8 h-8" style={{ color: 'var(--brand-primary)' }} />
            </div>
            <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Cyber-Sentinel</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Secure Authentication Portal</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg flex items-center gap-3 text-xs border" style={{ backgroundColor: 'var(--status-error-bg)', borderColor: 'var(--status-error)', color: 'var(--status-error)' }}>
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {!showMFA ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: 'var(--text-primary)' }}>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: 'var(--text-primary)' }}>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full font-semibold"
                style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
              </Button>

              {/* --- GOOGLE LOGIN BUTTON START --- */}
              <div className="mt-4">
                <div className="relative flex items-center justify-center mb-4">
                  <div className="w-full border-t" style={{ borderColor: 'var(--border-color)' }}></div>
                  <span className="px-2 text-[10px] uppercase tracking-widest absolute" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-tertiary)' }}>OR</span>
                </div>
                <Button type="button" onClick={() => window.location.href = "http://localhost:5000/auth/google/login"} variant="outline" className="w-full font-semibold border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', backgroundColor: 'transparent' }}>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4 mr-2" alt="Google" />
                  Continue with Google
                </Button>
              </div>

              <div className="text-center space-y-2">
                <button type="button" onClick={() => navigate("/forgot-password")} className="text-sm block w-full" style={{ color: 'var(--text-secondary)' }}>Forgot password?</button>
                <button type="button" onClick={() => navigate("/register")} className="text-sm" style={{ color: 'var(--brand-primary)' }}>Don't have an account? Register</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                <Label style={{ color: 'var(--text-primary)' }}>Enter 2FA Code</Label>
                <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>A verification code was sent to your email.</p>
                <div className="flex gap-2 justify-center">
                  {mfaCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`mfa-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleMFAInput(index, e.target.value)}
                      className="w-10 h-12 text-center text-lg font-mono rounded-lg border focus:ring-2 ring-blue-500 outline-none"
                      style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full font-semibold"
                style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Login"}
              </Button>

              <button type="button" onClick={() => setShowMFA(false)} className="w-full text-sm" style={{ color: 'var(--brand-primary)' }}>Back to credentials</button>
            </form>
          )}

          <div className="mt-6 pt-6 flex items-center justify-center gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Shield className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>Argon2 Protected</span>
          </div>
        </div>
      </Card>
    </div>
  );
}