import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Shield, Key, Copy, CheckCircle2, Loader2 } from "lucide-react"; 
// --- FIXED: ADDED MISSING IMPORTS ---
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ThemeToggle } from "../components/theme-toggle";
import { API_ENDPOINTS } from '../../api-config';

export function Setup2FAPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- REAL DATA STATES ---
  const [secretKey, setSecretKey] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    const fetch2FAData = async () => {
      try {
        // 1. Corrected URL to use API_ENDPOINTS
        const response = await fetch(`${API_ENDPOINTS}/auth/setup-2fa-data`, {
          credentials: 'include' 
        });

        if (response.ok) {
          const data = await response.json();
          setSecretKey(data.secret);
          
          // 2. Ensure QR URL is absolute so it loads from Render
          const absoluteQrUrl = data.qr_url.startsWith('http') 
            ? data.qr_url 
            : `${API_ENDPOINTS}${data.qr_url}`;
            
          setQrCodeUrl(absoluteQrUrl);
        }
      } catch (error) {
        console.error("Failed to fetch 2FA setup data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetch2FAData();
  }, []);
  

  const handleCopy = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Animated Background */}
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
              <Key className="w-8 h-8" style={{ color: 'var(--brand-primary)' }} />
            </div>
            <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Setup 2FA</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Secure your account with TOTP</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center py-10 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
              <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>Generating Secure Token...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg p-6 text-center" style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--border-color)' }}>
                <div className="w-48 h-48 mx-auto bg-white rounded-lg p-2 mb-4 overflow-hidden border">
                  {/* REAL QR CODE FROM BACKEND */}
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-full object-contain" />
                </div>
                
                <div className="rounded-lg p-3 flex items-center justify-between gap-2" style={{ backgroundColor: 'var(--bg-surface)', borderWidth: '1px', borderColor: 'var(--border-color)' }}>
                  <code className="text-xs flex-1 break-all" style={{ color: 'var(--brand-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                    {secretKey}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded transition-colors"
                    style={{ backgroundColor: copied ? 'var(--brand-primary-light)' : 'transparent' }}
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xs">1</span>
                  <p>Scan the QR code with Google Authenticator or Authy.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xs">2</span>
                  <p>Alternatively, enter the secret key manually.</p>
                </div>
              </div>

              <Button 
                onClick={() => navigate("/")}
                className="w-full font-semibold"
                style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF' }}
              >
                Complete Setup
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}