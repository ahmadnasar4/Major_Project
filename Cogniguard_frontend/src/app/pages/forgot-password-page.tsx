import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Mail, ArrowLeft, Loader2 } from "lucide-react"; // Added Loader2
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { ThemeToggle } from "../components/theme-toggle";
import { API_BASE_URL } from '../../api-config';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- CONNECTED BACKEND LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Call the Flask Auth Blueprint endpoint using the central config
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      // 2. Security Best Practice: prevent email enumeration
      if (response.ok || response.status === 404) {
        setSent(true);
      } else {
        alert("Server error. Please try again later.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the security server.");
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
            <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Forgot Password</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {sent ? "Check your email" : "Reset your account password"}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: 'var(--text-primary)' }}>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 transition-all duration-300"
                    style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  We'll send you a secure link to reset your password
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full font-semibold transition-all duration-300"
                style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Send Reset Link"}
              </Button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-2 text-sm transition-colors"
                style={{ color: 'var(--brand-primary)' }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--brand-primary-light)', borderWidth: '1px', borderColor: 'var(--brand-primary)' }}>
                <p className="text-sm text-center" style={{ color: 'var(--text-primary)' }}>
                  We've sent a password reset link to <span className="font-mono" style={{ color: 'var(--brand-primary)' }}>{email}</span>
                </p>
              </div>

              <div className="text-center space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <p>Please check your email and click the link to reset your password.</p>
                <p>The link will expire in 1 hour.</p>
              </div>

              <Button 
                onClick={() => navigate("/")}
                className="w-full font-semibold transition-all duration-300"
                style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
              >
                Return to Login
              </Button>
            </div>
          )}

          <div className="mt-6 pt-6 flex items-center justify-center gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Shield className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
              Zero-Knowledge Recovery
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}