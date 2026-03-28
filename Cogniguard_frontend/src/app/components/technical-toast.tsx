import { CheckCircle2, AlertCircle, Shield, Lock } from "lucide-react";
import { toast } from "sonner";

interface FileAnalysisResult {
  fileName: string;
  sensitivity: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  entropy: number;
}

export const showFileAnalyzedToast = (result: FileAnalysisResult) => {
  const sensitivityConfig = {
    LOW: {
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      message: `File analyzed by ML: ${result.sensitivity} sensitivity detected`,
    },
    MEDIUM: {
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      message: `File analyzed by ML: ${result.sensitivity} sensitivity detected`,
    },
    HIGH: {
      icon: Shield,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      message: `File analyzed by ML: ${result.sensitivity} sensitivity detected`,
    },
  };

  const config = sensitivityConfig[result.sensitivity];
  const Icon = config.icon;

  toast.custom(
    (t) => (
      <div className={`${config.bg} ${config.border} border-2 rounded-xl p-4 shadow-lg max-w-md`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${config.color}`} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-sm ${config.color} mb-1`}>
              {config.message}
            </h4>
            <p className="text-xs text-gray-700 font-semibold mb-2 truncate">
              {result.fileName}
            </p>
            <div className="space-y-1.5 text-xs text-gray-600" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              <div className="flex items-center justify-between">
                <span>ML Confidence:</span>
                <span className="font-bold">{result.confidence}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shannon Entropy:</span>
                <span className="font-bold">{result.entropy.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                <Lock className="w-3 h-3 text-green-600" strokeWidth={1.5} />
                <span className="font-semibold text-green-700">AES-256 encryption applied</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration: 5000,
    }
  );
};

export const showUploadSuccessToast = (fileName: string, fileCount: number = 1) => {
  toast.custom(
    (t) => (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 shadow-lg max-w-md">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-green-700 mb-1">
              Upload Complete
            </h4>
            <p className="text-xs text-gray-700 mb-2">
              {fileCount === 1 ? fileName : `${fileCount} files`} successfully uploaded
            </p>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              Encrypted with AES-256 • RSA-4096 key exchange • Ready for secure storage
            </p>
          </div>
        </div>
      </div>
    ),
    {
      duration: 4000,
    }
  );
};

export const showEncryptionToast = () => {
  toast.custom(
    (t) => (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg max-w-md">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Lock className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm text-blue-700 mb-1">
              Encryption in Progress
            </h4>
            <p className="text-xs text-gray-600" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              Applying AES-256 encryption • CBC mode • PKCS#7 padding
            </p>
          </div>
        </div>
      </div>
    ),
    {
      duration: 2000,
    }
  );
};
