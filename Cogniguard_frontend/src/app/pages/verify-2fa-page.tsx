import { useState } from "react";
import { useNavigate, useLocation } from "react-router"; // Added useLocation
import { Shield, ArrowLeft, Loader2, AlertCircle } from "lucide-react"; 
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ThemeToggle } from "../components/theme-toggle";
import { API_ENDPOINTS } from '../../api-config';

export function Verify2FAPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the email passed from the Login or Register page
  const email = location.state?.email;

  const [mfaCode, setMfaCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !mfaCode[index] && index > 0) {
      const prevInput = document.getElementById(`mfa-${index - 1}`);
      prevInput?.focus();
    }
  };

  // --- CONNECTED BACKEND VERIFICATION LOGIC ---
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const fullCode = mfaCode.join("");

    try {
      // 1. Updated to use Production API_ENDPOINTS
      const response = await fetch(`${API_ENDPOINTS}/auth/verify-mfa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Vital for the backend to verify the pending session
        body: JSON.stringify({ 
          email: email, 
          code: fullCode 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Backend has now fully authorized the session
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid verification code. Please try again.");
        setMfaCode(["", "", "", "", "", ""]); 
        document.getElementById('mfa-0')?.focus();
      }
    } catch (err) {
      setError("Security server connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const isCodeComplete = mfaCode.every(digit => digit !== "");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* ... (Keep your animated background and ThemeToggle) ... */}

      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-brand-primary-light border-2 border-brand-primary">
              <Shield className="w-8 h-8 text-brand-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Two-Step Verification</h1>
            <p className="text-sm text-secondary">
              Enter the 6-digit code for <span className="text-brand-primary font-mono">{email || 'your account'}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg flex items-center gap-3 text-xs border bg-red-500/10 border-red-500/50 text-red-500">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
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
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                  className="w-11 h-14 text-center text-xl font-bold rounded-xl border-2 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                  style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)' }}
                />
              ))}
            </div>

            <Button 
              type="submit" 
              disabled={!isCodeComplete || isLoading}
              className="w-full h-12 font-semibold"
              style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Verify & Authorize"}
            </Button>

            {/* ... (Keep your "Back to login" button) ... */}
          </form>
        </div>
      </Card>
    </div>
  );
}