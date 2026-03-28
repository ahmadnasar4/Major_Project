import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Shield, ArrowLeft, User, Mail, Key, Settings, LogOut, 
  Clock, ListRestart, Loader2, Activity, FileSpreadsheet, 
  HardDrive, Zap, ChevronRight 
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { ThemeToggle } from "../components/theme-toggle";

export function ProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // --- REAL DATA STATES ---
  const [userInfo, setUserInfo] = useState<any>(null);
  const [securityStats, setSecurityStats] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, logsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/logs')
        ]);

        if (profileRes.ok && logsRes.ok) {
          const profileData = await profileRes.json();
          const logsData = await logsRes.json();
          
          setUserInfo(profileData.user);
          setSecurityStats(profileData.stats);
          setAuditLogs(logsData);
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleExportCSV = (type: 'upload' | 'download') => {
    const url = `http://localhost:5000/download/report/${type}_metrics`;
    window.open(url, '_blank');
  };

  // --- YAHAN PASTE KAREIN ---
const handleDeleteAccount = async () => {
  if (window.confirm("Do you want to delete your account? This action cannot be undone.")) {
    try {
      const response = await fetch('/auth/delete-account', {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        alert("Account deleted successfully.");
        navigate("/login");
        // window.location.href = "/login";
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  }
};

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--bg-app)' }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--brand-primary)' }} />
        <p className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>Decrypting Security Profile...</p>
      </div>
    );
  }

 
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] opacity-20" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[150px] opacity-10" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate("/dashboard")} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <h1 className="text-xl font-semibold">Security Profile</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button onClick={() => navigate("/")} variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: User Info & Actions */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border bg-surface/50 backdrop-blur-md">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 border-4 mb-4" style={{ borderColor: 'var(--brand-primary)' }}>
                  <AvatarFallback className="text-3xl bg-brand-primary-light text-brand-primary">
                    {userInfo?.name ? userInfo.name[0] : 'U'}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{userInfo?.name}</h2>
                <p className="text-xs font-mono text-brand-primary uppercase mt-1 tracking-widest">{userInfo?.role}</p>
                
                <div className="w-full mt-6 space-y-3 text-sm text-secondary">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <Mail className="w-4 h-4 text-brand-primary" />
                    <span className="truncate">{userInfo?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <User className="w-4 h-4 text-brand-primary" />
                    <span>Member since {userInfo?.memberSince}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions & Metrics */}
            <Card className="p-6 bg-surface border">
              <h3 className="text-xs font-bold uppercase mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-primary" /> Management Hub
              </h3>
              <div className="space-y-2">
                <Button 
  onClick={() => navigate("/change-password")} 
  variant="outline" 
  className="w-full justify-between group"
>
  <div className="flex items-center">
    <Key className="w-4 h-4 mr-2 text-brand-primary" /> 
    Password
  </div>
  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
</Button>
                
                <Button onClick={() => navigate("/performance")} variant="outline" className="w-full justify-between border-blue-500/30 text-blue-500 hover:bg-blue-500/10">
                  <div className="flex items-center"><Activity className="w-4 h-4 mr-2" /> Performance Hub</div>
                  <Zap className="w-3 h-3 fill-current" />
                </Button>

                <div className="pt-4 mt-4 border-t">
                  <p className="text-[10px] font-bold text-tertiary uppercase mb-3">Compliance Data Export</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="ghost" size="sm" className="text-[10px] h-9 justify-start" onClick={() => handleExportCSV('upload')}>
                      <FileSpreadsheet className="w-3 h-3 mr-2" /> Uploads.csv
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[10px] h-9 justify-start" onClick={() => handleExportCSV('download')}>
                      <FileSpreadsheet className="w-3 h-3 mr-2" /> Downloads.csv
                    </Button>
                  </div>
                </div>
                {/* --- DANGER ZONE SECTION YAHAN DALO --- */}
                <div className="mt-6 pt-6 border-t border-red-500/20">
                  <h3 className="text-[10px] font-bold text-red-500 uppercase mb-3">Danger Zone</h3>
                  <Button 
                    onClick={handleDeleteAccount}
                    variant="outline" 
                    className="w-full text-xs h-9 border-red-500/30 text-red-500 hover:bg-red-500/10"
                  >
                    <LogOut className="w-3 h-3 mr-2" /> Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Stats & Logs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 bg-surface border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-4 h-4 text-brand-primary" />
                  <span className="text-[10px] font-bold uppercase text-tertiary">Encrypted Files</span>
                </div>
                <p className="text-2xl font-bold">{securityStats?.filesEncrypted}</p>
              </Card>
              <Card className="p-4 bg-surface border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <HardDrive className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] font-bold uppercase text-tertiary">Vault Storage</span>
                </div>
                <p className="text-2xl font-bold">{securityStats?.totalStorage}</p>
              </Card>
              <Card className="p-4 bg-surface border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-[10px] font-bold uppercase text-tertiary">Security Score</span>
                </div>
                <p className="text-2xl font-bold text-brand-primary">{securityStats?.securityScore}%</p>
              </Card>
            </div>

            {/* Audit Logs Section */}
            <Card className="bg-surface border overflow-hidden flex flex-col">
              <div className="p-6 border-b flex items-center justify-between bg-muted/20">
                <h3 className="text-sm font-bold uppercase flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-primary" /> Security Audit Timeline
                </h3>
                <ListRestart className="w-4 h-4 text-tertiary cursor-pointer hover:rotate-180 transition-transform duration-500" />
              </div>
              <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                {auditLogs.length > 0 ? auditLogs.map((log: any) => (
                  <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${log.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-tertiary font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-secondary mt-1">{log.details}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-1 h-1 rounded-full bg-brand-primary"></div>
                      <p className="text-[9px] text-tertiary font-mono">Origin: {log.ip}</p>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-tertiary text-sm italic">
                    No security events captured in this cycle.
                  </div>
                )}
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}