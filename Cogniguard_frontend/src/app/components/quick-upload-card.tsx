import { Upload } from "lucide-react";
import { useState } from "react";
import { FileAnalyzingState } from "./file-analyzing-state";
import { Dialog, DialogContent } from "./ui/dialog";

interface QuickUploadCardProps {
  onUploadComplete?: () => void;
}

// FIX: Add { onUploadComplete } inside the parentheses here
// QuickUploadCard.tsx mein line 11
export function QuickUploadCard({ onUploadComplete }: QuickUploadCardProps) { 
    // Isse variable mil jayega
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [mockFile, setMockFile] = useState({ name: "", size: "" });

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      setMockFile({ name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` });
      setShowAnalyzer(true);

      const formData = new FormData();
      formData.append('file', file);

      try {
        // Send to Flask
        const response = await fetch('/api/upload', { 
          method: 'POST', 
          body: formData, 
          credentials: 'include' 
        });
        if (response.ok && onUploadComplete) {
          onUploadComplete(); // Ye dashboard ko reload karega
      }
      } 
      catch (error) {
        console.error("Upload failed:", error);
      }
    };
    input.click();
  };

  const handleAnalysisComplete = () => {
    setShowAnalyzer(false);
    
    // This will now find the variable because it's destructured above
    if (onUploadComplete) {
      onUploadComplete();
    }
  };

  return (
    <>
      <div className="lg:hidden mb-6">
        <button
          onClick={handleFileSelect}
          className="w-full border-2 border-dashed rounded-2xl p-8 transition-all group active:scale-[0.98]"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <div 
              className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-all" 
              style={{
                borderColor: 'var(--border-color)',
                backgroundColor: 'var(--muted)'
              }}
            >
              <Upload className="w-8 h-8 transition-colors" style={{ color: 'var(--text-tertiary)' }} strokeWidth={1.5} />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Upload & Analyze
              </h3>
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                Tap to select a file for ML classification
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>
                AES-256 • Random Forest ML • 48px touch target
              </p>
            </div>
          </div>
        </button>
      </div>

      <Dialog open={showAnalyzer} onOpenChange={setShowAnalyzer}>
        <DialogContent className="max-w-2xl bg-transparent border-0 shadow-none p-0 sm:p-6">
          <FileAnalyzingState
            fileName={mockFile.name}
            fileSize={mockFile.size}
            onComplete={handleAnalysisComplete}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}