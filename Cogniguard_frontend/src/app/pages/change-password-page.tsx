import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Lock, ArrowLeft, Loader2 } from "lucide-react"; 
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { ThemeToggle } from "../components/theme-toggle";
// import ko file ke top par add karo
import { API_BASE_URL } from '../../api-config';

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- UPDATED BACKEND LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-side validation: Matching passwords
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      // 2. Perform API request to Flask backend
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // DHAYAN DO: Backend ye exact keys mang raha hai
          old_password: currentPassword, 
          new_password: newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Success handling
        alert("Password updated successfully across the vault.");
        navigate("/profile"); // Password change ke baad profile pe wapas bhejo
      } else {
        // 4. Error handling (e.g., incorrect current password)
        alert(data.error || "Failed to update password.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Security server is unreachable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Animated background styling */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] opacity-20" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[150px] opacity-10" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
      </div>

      <header className="relative z-10 backdrop-blur-xl" style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/profile")}
                variant="outline"
                size="sm"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Change Password</h1>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>
                  Update your account security
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="backdrop-blur-xl" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" style={{ color: 'var(--text-primary)' }}>Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10"
                    style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="pt-6 space-y-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" style={{ color: 'var(--text-primary)' }}>New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" style={{ color: 'var(--text-primary)' }}>Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      style={{ backgroundColor: 'var(--input-background)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => navigate("/profile")}
                  variant="outline"
                  className="flex-1"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 font-semibold transition-all duration-300 text-white"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 flex items-center justify-center gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
              <Shield className="w-4 h-4" style={{ color: 'var(--brand-primary)' }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>
                System-wide Encryption Update
              </span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}