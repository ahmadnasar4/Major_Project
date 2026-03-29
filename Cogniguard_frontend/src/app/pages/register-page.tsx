import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Lock, Mail, User, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { ThemeToggle } from "../components/theme-toggle";
import { API_ENDPOINTS } from '../../api-config';

export function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- CONNECTED BACKEND REGISTRATION LOGIC ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Client-side Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Updated to use Production API_ENDPOINTS
      const response = await fetch(`${API_ENDPOINTS}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Navigate to 2FA Setup
        navigate("/setup-2fa", { state: { email: email } });
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Security server connection lost.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Theme Toggle */}
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
            <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Join Cyber-Sentinel</p>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-3 rounded-lg flex items-center gap-3 text-xs border" style={{ backgroundColor: 'var(--status-error-bg)', borderColor: 'var(--status-error)', color: 'var(--status-error)' }}>
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: 'var(--text-primary)' }}>Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" style={{ color: 'var(--text-primary)' }}>Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full font-semibold transition-all duration-300"
              style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-sm transition-colors"
                style={{ color: 'var(--brand-primary)' }}
              >
                Already have an account? Login
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 flex items-center justify-center gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Shield className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
              Argon2 Protected
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}