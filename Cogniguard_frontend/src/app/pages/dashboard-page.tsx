import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  Shield, FileText, BarChart3, Upload, Sparkles, 
  Lock, AlertCircle, Activity, UserCheck
} from "lucide-react";

// Component Imports
import { Button } from "../components/ui/button";
import { FileList } from "../components/file-list";
import { ShareModal } from "../components/share-modal";
import { MobileShareDrawer } from "../components/mobile-share-drawer";
import { FileAnalyzingState } from "../components/file-analyzing-state";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { Sidebar } from "../components/sidebar";
import { MobileNav } from "../components/mobile-nav";
import { QuickUploadCard } from "../components/quick-upload-card";
import { ThemeToggle } from "../components/theme-toggle";
import PerformanceDashboard from "../components/PerformanceDashboard";

export function DashboardPage() {
  const navigate = useNavigate();
  
  // --- REAL DATA STATES ---
  const [files, setFiles] = useState<any[]>([]); 
  const [stats, setStats] = useState({
    totalFiles: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    encrypted: "0.00 MB",
  });

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [mobileShareOpen, setMobileShareOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [uploadingFile, setUploadingFile] = useState({ name: "", size: "" });

  // --- 1. DATA FETCHING (UNIFIED LOAD) ---
  // DashboardPage.tsx mein loadData ko aise update karo:
// DashboardPage.tsx mein loadData ko aise update karo:
const loadData = async () => {
  try {
    const [filesRes, statsRes] = await Promise.all([
      fetch('/api/files', { credentials: 'include' }),
      fetch('/api/profile', { credentials: 'include' })
    ]);

    if (filesRes.ok && statsRes.ok) {
      const filesData = await filesRes.json();
      const statsData = await statsRes.json();

      // FIX: Dono arrays ko merge karo taaki Table mein dono dikhein
      const combinedFiles = [
        ...(filesData.owned_files || []),
        ...(filesData.shared_files || [])
      ];
      
      setFiles(combinedFiles); // Ab 'files' state mein dono data hain
      
      const s = statsData.stats || {}; 
      setStats({
        totalFiles: s.filesEncrypted || 0,
        // Dashboard counters ke liye combined list use karo
        highRisk: combinedFiles.filter((f: any) => f.sensitivity === 'HIGH').length || 0,
        mediumRisk: combinedFiles.filter((f: any) => f.sensitivity === 'MEDIUM').length || 0,
        lowRisk: combinedFiles.filter((f: any) => f.sensitivity === 'LOW').length || 0,
        encrypted: s.totalStorage || "0.00 MB",
      });
    }
  } catch (error) {
    console.error("Dashboard connection failed:", error);
  }
};
  useEffect(() => {
    loadData();
  }, []);

  // --- 2. ACTION HANDLERS ---
  const handleShare = (file: any) => {
    setSelectedFile({
      id: file.id,
      name: file.name,
      sensitivity: file.sensitivity
    });
    if (window.innerWidth < 1024) {
      setMobileShareOpen(true);
    } else {
      setShareModalOpen(true);
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingFile({ 
        name: file.name, 
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
      });
      setShowAnalyzer(true);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
           setTimeout(() => {
               setShowAnalyzer(false);
               loadData(); 
           }, 2000);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setShowAnalyzer(false);
      }
    };
    input.click();
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-app)' }}>
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        <header className="sticky top-0 z-10" style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Secure File Vault</h1>
              <p className="text-xs sm:text-sm mt-1 text-secondary font-mono italic">
                AES-256 encrypted • Random Forest ML classifier • Multi-Tenant
              </p>
            </div>
            <div className="flex items-center gap-3">
               <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/10">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-semibold text-green-500 uppercase">MFA: Active</span>
               </div>
               <ThemeToggle />
            </div>
          </div>
        </header>
        
        <div className="p-4 sm:p-8 space-y-8">
          {/* Quick Upload Section */}
          <QuickUploadCard onUploadComplete={loadData} />

          {/* Performance Monitoring Section */}
          <div className="p-6 rounded-2xl border shadow-sm bg-surface">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-brand-primary" />
              <h2 className="text-lg font-bold">System Performance Metrics</h2>
            </div>
            <PerformanceDashboard />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard label="Total Objects" value={stats.totalFiles} subtext={stats.encrypted} icon={<FileText />} />
            <StatCard label="High Risk" value={stats.highRisk} color="text-red-500" progress={stats.totalFiles > 0 ? (stats.highRisk / stats.totalFiles) * 100 : 0} />
            <StatCard label="Medium Risk" value={stats.mediumRisk} color="text-yellow-500" progress={stats.totalFiles > 0 ? (stats.mediumRisk / stats.totalFiles) * 100 : 0} />
            <StatCard label="Low Risk" value={stats.lowRisk} color="text-green-500" progress={stats.totalFiles > 0 ? (stats.lowRisk / stats.totalFiles) * 100 : 0} />
          </div>

          {/* Main Vault Content */}
          <div className="rounded-2xl shadow-sm border bg-surface overflow-hidden">
            <div className="px-6 py-6 border-b flex items-center justify-between bg-muted/30">
              <div>
                <h2 className="text-lg font-bold">Encrypted Objects</h2>
                <p className="text-xs text-secondary font-mono mt-1">Real-time threat detection active</p>
              </div>
              <Button onClick={handleUploadClick} className="bg-brand-primary text-white font-semibold">
                <Upload className="w-4 h-4 mr-2" /> New Object
              </Button>
            </div>
            
          
<FileList 
    files={files.map(f => ({
        id: f.id,
        name: f.original_filename, // Backend key use karo
        size: (f.file_size / 1024).toFixed(1) + " KB",
        sensitivity: f.sensitivity,
        confidence: Math.round((f.ml_confidence || 0.85) * 100),
       uploadDate: f.uploaded_at,
        isShared: f.is_shared,
        sharedBy: f.shared_by || "You"
    }))} 
    onShare={handleShare} 
    onRefresh={loadData} 
/>
          </div>
        </div>
      </main>

      <MobileNav />

      {/* Overlays */}
      {selectedFile && (
        <>
          <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} file={selectedFile} />
          <MobileShareDrawer open={mobileShareOpen} onOpenChange={setMobileShareOpen} file={selectedFile} />
        </>
      )}

      <Dialog open={showAnalyzer} onOpenChange={setShowAnalyzer}>
        <DialogContent className="max-w-2xl bg-transparent border-0 shadow-none p-0">
          <FileAnalyzingState 
            fileName={uploadingFile.name} 
            fileSize={uploadingFile.size}
            onComplete={() => setShowAnalyzer(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value, subtext, color = "text-primary", progress, icon }: any) {
  return (
    <div className="p-6 rounded-xl border bg-surface/50 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-secondary uppercase tracking-wider">{label}</p>
          <h4 className={`text-2xl sm:text-3xl font-bold mt-1 ${color}`}>{value}</h4>
        </div>
        <div className="p-2 rounded-lg bg-brand-primary/5 text-brand-primary border border-brand-primary/10">
          {icon || <Shield className="w-5 h-5" />}
        </div>
      </div>
      {progress !== undefined ? (
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-500 ${color.replace('text', 'bg')}`} style={{ width: `${progress || 0}%` }} />
        </div>
      ) : (
        <p className="text-xs text-tertiary font-mono italic">{subtext}</p>
      )}
    </div>
  );
}