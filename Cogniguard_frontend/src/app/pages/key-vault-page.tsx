import { useNavigate } from "react-router";
import { Key, ArrowLeft, Shield, RefreshCw, CheckCircle2, Copy, Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ThemeToggle } from "../components/theme-toggle";
import { API_BASE_URL } from '../../api-config';

export function KeyVaultPage() {
  const navigate = useNavigate();
  const [keys, setKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  // --- 1. FETCH REAL KEY METADATA FROM BACKEND ---
  const fetchKeys = async () => {
    try {
      // Added API_ENDPOINTS and credentials for session-based auth
      const response = await fetch(`${API_BASE_URL}/api/vault/keys`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setKeys(data);
      }
    } catch (error) {
      console.error("Vault connection failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  // --- 2. KEY ROTATION LOGIC ---
  const handleRotate = async (keyId: string | number) => {
    const confirmMessage = "Rotating this key will generate a new RSA-4096 pair. Proceed?";
    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/vault/rotate/${keyId}`, { 
        method: 'POST',
        credentials: 'include' 
      });
      if (response.ok) {
        alert("Key rotation successful. New fingerprint generated.");
        fetchKeys();
      }
    } catch (error) {
      alert("Failed to rotate key. System integrity protected.");
    }
  };

  const handleCopy = (id: string | number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- 3. EXPORT PUBLIC KEY LOGIC ---
const handleExport = async (level: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/vault/export/${level}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `public_key_${level}.pub`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert("Export failed: Key not found on server.");
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] opacity-20" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[150px] opacity-10" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="sm"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Cryptographic Key Vault</h1>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>
                  Secure RSA-4096 Key Management
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--brand-primary)' }} />
            <p className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>Decrypting Vault Metadata...</p>
          </div>
        ) : (
          <>
            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="backdrop-blur-xl rounded-lg p-6 border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Active Key Pairs</p>
                <p className="text-3xl font-semibold mt-1">{keys.length}</p>
              </div>
              <div className="backdrop-blur-xl rounded-lg p-6 border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Encryption Standard</p>
                <p className="text-3xl font-semibold mt-1" style={{ color: 'var(--status-success)' }}>FIPS-Compliant</p>
              </div>
              <div className="backdrop-blur-xl rounded-lg p-6 border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Key Isolation</p>
                <p className="text-3xl font-semibold mt-1">Hardware Level</p>
              </div>
            </div>

            {/* Keys List */}
            <div className="space-y-4">
              {keys.map((key) => (
                <Card
                  key={key.id}
                  className="backdrop-blur-xl"
                  style={{ 
                    backgroundColor: 'var(--bg-surface)', 
                    borderWidth: '1px', 
                    borderColor: 'var(--brand-primary)' 
                  }}
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <div className="flex items-start gap-4 flex-1 w-full">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--brand-primary-light)', border: '1px solid var(--brand-primary)' }}>
                          <Key className="w-6 h-6" style={{ color: 'var(--brand-primary)' }} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{key.name}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-tertiary">Algorithm</p>
                              <p className="text-sm font-mono">{key.type}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs mb-1 text-tertiary">Public Key Fingerprint (SHA-256)</p>
                              <div className="flex items-center gap-2 rounded-lg p-2 border" style={{ backgroundColor: 'var(--muted)' }}>
                                <code className="text-[10px] sm:text-xs flex-1 break-all font-mono" style={{ color: 'var(--brand-primary)' }}>
                                  {key.fingerprint}
                                </code>
                                <button onClick={() => handleCopy(key.id, key.fingerprint)} className="p-1.5">
                                  {copiedId === key.id ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2 w-full md:w-auto">
                      {/* <Button variant="outline" size="sm" onClick={() => handleRotate(key.id)}>
                        <RefreshCw className="w-4 h-4 mr-2" /> Rotate
                      </Button> */}
                      
                      <Button variant="outline" size="sm" onClick={() => handleExport(key.id)}>
                        <Download className="w-4 h-4 mr-2" /> Export Public
                      </Button>
                    </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        
        {/* Security Best Practices */}
        
        <div className="mt-8 rounded-lg p-6 border" style={{ background: 'linear-gradient(to right, var(--brand-primary-light), transparent)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-brand-primary" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Security Architecture</h3>
              <p className="text-sm text-secondary">Your private keys are generated and stored in a secure environment. We utilize RSA-4096 for asymmetric encryption, ensuring that even with quantum computing advancements, your data remains mathematically protected.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}