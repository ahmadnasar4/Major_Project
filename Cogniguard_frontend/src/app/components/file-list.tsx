import { FileText, Share2, Download, Trash2, User2 } from "lucide-react"; 
import { SensitivityBadge } from "./sensitivity-badge";
import { API_BASE_URL } from '../../api-config';

type FileItem = {
  id: number;
  name: string;
  size: string;
  sensitivity: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  uploadDate: string;
  isShared?: boolean;
  sharedBy?: string;
  mlReason?: string;
};

interface FileListProps {
  files: FileItem[];
  onShare: (file: FileItem) => void;
  onRefresh?: () => void;
}

const mlReasons = {
  HIGH: "High entropy detected • Cryptographic patterns identified • Potential sensitive data structures",
  MEDIUM: "Structured data patterns • Moderate entropy score • Standard document encryption applied",
  LOW: "Standard document format • Low entropy detected • Public-safe content patterns verified",
};

export function FileList({ files, onShare, onRefresh }: FileListProps) {
  
  // --- REAL DOWNLOAD LOGIC (ZINDA KIYA HAI) ---
// src/app/components/file-list.tsx (Line 35 ke paas)
const handleDownload = async (fileId: number, fileName: string) => {
  try {
    // Yahan API_BASE_URL add karein taaki sahi backend hit ho
    const response = await fetch(`${API_BASE_URL}/api/download/${fileId}`, {
      method: 'GET',
      credentials: 'include', // Cookies ke liye ye zaroori hai
    });

    if (!response.ok) {
      alert("Download failed. Unauthorized or file missing.");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
  }
};

  const handleDelete = async (fileId: number, fileName: string) => {
  if (!window.confirm(`Permanently delete "${fileName}"?`)) return;

  try {
    // Yahan API_BASE_URL lagana zaroori hai
    const response = await fetch(`${API_BASE_URL}/api/delete/${fileId}`, {
      method: 'DELETE',
      credentials: 'include', // Cookies ke liye ye sahi hai
    });

    if (response.ok) {
      if (onRefresh) onRefresh(); 
    } else {
      alert("Delete failed.");
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
};

  return (
    <div style={{ borderTop: '1px solid var(--border-color)' }}>
      {files.map((file) => (
        <div 
          key={file.id} 
          className="px-4 sm:px-8 py-5 sm:py-6 transition-colors group"
          style={{ 
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: file.isShared ? 'rgba(59, 130, 246, 0.03)' : 'transparent' 
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" 
                 style={{ backgroundColor: 'var(--brand-primary-light)', borderColor: 'var(--brand-primary)', borderWidth: '1px' }}>
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: 'var(--brand-primary)' }} strokeWidth={1.5} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm sm:text-base font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{file.name}</h3>
                    {file.isShared && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase">Shared</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-secondary">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span className="font-semibold text-brand-primary font-mono">{file.confidence}% confidence</span>
                    <span>•</span>
                    <span className="font-mono text-tertiary">{file.uploadDate}</span>
                    {file.isShared && (
                      <div className="flex items-center gap-1 text-blue-500 font-medium">
                        <User2 className="w-3 h-3" />
                        <span>From: {file.sharedBy}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  {!file.isShared && (
                    <button onClick={() => onShare(file)} className="p-2 rounded-lg hover:bg-muted"><Share2 className="w-4 h-4" /></button>
                  )}
                  <button onClick={() => handleDownload(file.id, file.name)} className="p-2 rounded-lg hover:bg-muted"><Download className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(file.id, file.name)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-2 mt-3">
                <SensitivityBadge level={file.sensitivity} />
                <p className="text-xs leading-relaxed flex-1 text-tertiary font-mono">{file.mlReason || mlReasons[file.sensitivity]}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}