import { useState } from "react";
import { Shield, Key, ArrowRight, CheckCircle2, Mail, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: {
    id: number;
    name: string;
    sensitivity: string;
  };
}

export function ShareModal({ open, onOpenChange, file }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [shared, setShared] = useState(false);

  // --- CONNECTED BACKEND LOGIC ---
  const handleShare = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/share-email/${file.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        setShared(true);
        // Reset and close after showing success state
        setTimeout(() => {
          setShared(false);
          onOpenChange(false);
          setEmail("");
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(`Sharing failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network error during sharing:", error);
      alert("Could not connect to the security server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0B0E14] border-[#00F0FF]/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#00F0FF]" />
            </div>
            Zero-Knowledge File Sharing
          </DialogTitle>
          <p className="text-sm text-white/60 mt-2">
            Share "{file.name}" with end-to-end encryption via Email
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Encryption Flow Diagram */}
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-white/90 mb-4">Encryption Flow</h3>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center mb-2">
                  <Key className="w-8 h-8 text-[#00F0FF]" />
                </div>
                <p className="text-xs text-white/70">Owner's Private Key</p>
                <p className="text-xs text-[#00F0FF] font-mono mt-1">RSA-4096</p>
              </div>

              <ArrowRight className="w-6 h-6 text-[#00F0FF]" />

              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-[#00F0FF]/20 to-[#FF3B3B]/20 border border-[#00F0FF]/30 flex items-center justify-center mb-2 animate-pulse">
                  <Shield className="w-8 h-8 text-[#00F0FF]" />
                </div>
                <p className="text-xs text-white/70">Re-Encryption</p>
                <p className="text-xs text-[#00F0FF] font-mono mt-1">AES-256</p>
              </div>

              <ArrowRight className="w-6 h-6 text-[#00F0FF]" />

              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto rounded-lg bg-[#00D1FF]/10 border border-[#00D1FF]/30 flex items-center justify-center mb-2">
                  <Mail className="w-8 h-8 text-[#00D1FF]" />
                </div>
                <p className="text-xs text-white/70">Recipient's Email</p>
                <p className="text-xs text-[#00D1FF] font-mono mt-1">SMTP Secure</p>
              </div>
            </div>
          </div>

          {/* Email Input Field */}
          <div className="space-y-2">
            <Label htmlFor="recipientEmail" className="text-white/90">
              Recipient's Email Address
            </Label>
            <Input
              id="recipientEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user's email address..."
              className="bg-white/5 border-white/10 text-white focus:border-[#00F0FF] focus:ring-[#00F0FF]/50"
            />
          </div>

          {/* Security Features */}
          <div className="bg-[#00F0FF]/5 border border-[#00F0FF]/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
              </div>
              <div className="flex-1 space-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]"></div>
                  <p>End-to-end encryption with RSA-4096 + AES-256</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]"></div>
                  <p>Zero-knowledge architecture - server never sees decrypted data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Zero-Knowledge Badge */}
          <div className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#00F0FF]/10 via-[#00F0FF]/5 to-[#00F0FF]/10 border border-[#00F0FF]/20 rounded-lg">
            <Shield className="w-5 h-5 text-[#00F0FF]" />
            <span className="text-sm font-semibold text-[#00F0FF]">
              Zero-Knowledge Verified
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-white/20 text-white/70 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={!email || loading || shared}
              className="flex-1 bg-[#00F0FF] text-[#0B0E14] hover:bg-[#00D1FF] shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : shared ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Invitation Sent
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Share Securely
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}