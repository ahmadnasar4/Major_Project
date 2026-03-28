import { useNavigate } from "react-router";
import { AlertTriangle, LogIn, ArrowLeft } from "lucide-react"; // Updated icons
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ThemeToggle } from "../components/theme-toggle";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Animated background */}
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ backgroundColor: 'var(--sensitivity-high-bg)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ backgroundColor: 'var(--brand-primary)', animationDelay: '1s' }}></div>
        </div>
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl" style={{ borderColor: 'var(--sensitivity-high-border)', backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="p-8 text-center">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: 'var(--sensitivity-high-bg)', borderWidth: '2px', borderColor: 'var(--sensitivity-high-border)' }}>
            <AlertTriangle className="w-12 h-12" style={{ color: 'var(--sensitivity-high-text)' }} />
          </div>

          {/* Error Code */}
          <div className="mb-4">
            <h1 className="text-6xl font-bold mb-2" style={{ color: 'var(--sensitivity-high-text)', fontFamily: 'JetBrains Mono, monospace' }}>
              404
            </h1>
            <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Access Denied</h2>
          </div>

          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            The requested resource could not be found within the secure perimeter. 
            Please verify the endpoint or re-authenticate to continue.
          </p>

          {/* Error Details */}
          <div className="rounded-lg p-4 mb-6 text-left" style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--border-color)' }}>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--sensitivity-high-text)' }}></div>
                <span>Error: NULL_PATH_EXCEPTION</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--sensitivity-high-text)' }}></div>
                <span>Security Status: Protocol Verified</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* UPDATED: Login Page Button instead of Dashboard */}
            <Button 
              onClick={() => navigate("/")}
              className="w-full font-semibold transition-all duration-300"
              style={{ backgroundColor: 'var(--brand-primary)', color: '#FFFFFF', boxShadow: 'var(--shadow-md)' }}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Return to Login
            </Button>

            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Security Incident? Contact system admin at{" "}
              <a href="mailto:admin@cyber-sentinel.com" className="transition-colors" style={{ color: 'var(--brand-primary)' }}>
                admin@cyber-sentinel.com
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}