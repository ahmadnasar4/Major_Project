import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router"; // Added search params
import { Shield, Lock, Loader2, AlertCircle } from "lucide-react"; 
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { ThemeToggle } from "../components/theme-toggle";
import { API_BASE_URL } from '../../api-config';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); // New success state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setIsLoading(true);

    try {
      // Updated to use production 
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => navigate("/"), 4000); 
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("Security server connection lost");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="p-8">
          
          {/* SUCCESS UI */}
          {isSuccess ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 mb-2">
                <Shield className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-green-500">Password Changed!</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Your security credentials have been successfully updated.
              </p>
              <div className="pt-4">
                <p className="text-xs animate-pulse" style={{ color: 'var(--brand-primary)' }}>
                  Redirecting to login portal...
                </p>
              </div>
              <Button 
                onClick={() => navigate("/")} 
                className="w-full mt-4" 
                style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
              >
                Go to Login Now
              </Button>
            </div>
          ) : (
            /* FORM UI */
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--brand-primary-light)', borderWidth: '1px', borderColor: 'var(--brand-primary)' }}>
                  <Lock className="w-8 h-8" style={{ color: 'var(--brand-primary)' }} />
                </div>
                <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Reset Password</h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Create a new secure password</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg flex items-center gap-3 text-xs border bg-red-500/10 border-red-500/50 text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full font-semibold"
                  style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}