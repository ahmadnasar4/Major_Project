import { useState } from "react";
import { Shield, Key, ArrowRight, CheckCircle2, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerOverlay,
  DrawerPortal,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface MobileShareDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: {
    id: number;
    name: string;
    sensitivity: string;
  };
}

export function MobileShareDrawer({ open, onOpenChange, file }: MobileShareDrawerProps) {
  const [recipientKey, setRecipientKey] = useState("");
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    setShared(true);
    setTimeout(() => {
      setShared(false);
      onOpenChange(false);
      setRecipientKey("");
    }, 2000);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/40 z-50" />
        <DrawerContent className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
          {/* Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 pt-4 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Secure Sharing</h2>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Zero-knowledge encryption
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-sm font-semibold text-gray-900 truncate">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">End-to-end encrypted file transfer</p>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Encryption Flow */}
            <div className="bg-gradient-to-br from-blue-50 to-transparent border border-blue-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Encryption Flow</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
                    <Key className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Your Private Key</p>
                    <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      RSA-4096 decryption
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 border border-blue-300 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Re-Encryption</p>
                    <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      AES-256 CBC mode
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center flex-shrink-0">
                    <Key className="w-6 h-6 text-green-600" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Recipient's Public Key</p>
                    <p className="text-xs text-gray-600 mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      RSA-4096 encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Key Input */}
            <div className="space-y-3">
              <Label htmlFor="recipientKey" className="text-gray-900 font-semibold">
                Recipient's RSA Public Key
              </Label>
              <Textarea
                id="recipientKey"
                value={recipientKey}
                onChange={(e) => setRecipientKey(e.target.value)}
                placeholder="-----BEGIN PUBLIC KEY-----&#10;MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...&#10;-----END PUBLIC KEY-----"
                className="bg-gray-50 border-gray-200 text-gray-900 text-xs h-32 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>

            {/* Security Features */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xs text-gray-700">End-to-end encryption with RSA-4096 + AES-256</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xs text-gray-700">Zero-knowledge architecture - server never sees plaintext</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" strokeWidth={1.5} />
                <p className="text-xs text-gray-700">Perfect forward secrecy with ephemeral keys</p>
              </div>
            </div>
          </div>

          {/* Footer - Fixed at Bottom */}
          <div className="px-6 py-6 border-t border-gray-200 bg-white space-y-4">
            <Button
              onClick={handleShare}
              disabled={!recipientKey || shared}
              className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {shared ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" strokeWidth={1.5} />
                  Shared Successfully
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" strokeWidth={1.5} />
                  Share Securely
                </>
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-3.5 h-3.5 text-blue-600" strokeWidth={1.5} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Zero-Knowledge Verified
              </span>
            </div>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}