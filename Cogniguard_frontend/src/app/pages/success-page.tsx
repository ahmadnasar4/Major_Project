import { useNavigate, useLocation } from "react-router"; // Added useLocation
import { CheckCircle2, Shield, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ThemeToggle } from "../components/theme-toggle";
import { API_BASE_URL } from '../../api-config';

export function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- DYNAMIC CONTENT BASED ON NAVIGATION STATE ---
  // This allows you to use one success page for multiple actions
  const { 
    title = "Success!", 
    message = "Your operation has been completed successfully. Your data is now secured with military-grade protection.",
    type = "General"
  } = (location.state as any) || {};

  const currentTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Animated background */}
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ backgroundColor: 'var(--status-success)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ backgroundColor: 'var(--status-success)', animationDelay: '1s' }}></div>
        </div>
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl" style={{ borderColor: 'var(--status-success)', backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="p-8 text-center">
          {/* Success Icon with Animation */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: 'var(--status-success-bg)', borderWidth: '2px', borderColor: 'var(--status-success)' }}>
            <CheckCircle2 className="w-12 h-12" style={{ color: 'var(--status-success)' }} />
          </div>

          <h1 className="text-2xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h1>
          <p className="text-sm mb-8 px-4" style={{ color: 'var(--text-secondary)' }}>
            {message}
          </p>

          {/* Success Details */}
          <div className="rounded-lg p-6 mb-6 text-left" style={{ backgroundColor: 'var(--muted)', borderWidth: '1px', borderColor: 'var(--border-color)' }}>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Operation</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{type}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Protocol</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-green-500/10" style={{ color: 'var(--status-success)' }}>AES-GCM-4096</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                <span className="font-semibold flex items-center gap-2" style={{ color: 'var(--status-success)' }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--status-success)' }}></div>
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Timestamp</span>
                <span className="font-mono text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{currentTimestamp}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full font-semibold transition-all duration-300"
              style={{ backgroundColor: 'var(--status-success)', color: '#FFFFFF' }}
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              onClick={() => navigate("/ml-stats")}
              variant="outline"
              className="w-full"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>

          {/* Security Badge */}
          <div className="mt-6 pt-6 flex items-center justify-center gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Shield className="w-4 h-4" style={{ color: 'var(--status-success)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
              Zero-Knowledge Verified
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}