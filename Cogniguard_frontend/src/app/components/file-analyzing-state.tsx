import { motion } from "motion/react";
import { Shield, FileSearch, Lock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { showFileAnalyzedToast } from "./technical-toast";

interface FileAnalyzingStateProps {
  fileName: string;
  fileSize: string;
  onComplete?: () => void;
}

type ScanPhase = "entropy" | "classification" | "encryption" | "complete";

export function FileAnalyzingState({ fileName, fileSize, onComplete }: FileAnalyzingStateProps) {
  const [phase, setPhase] = useState<ScanPhase>("entropy");
  const [progress, setProgress] = useState(0);
  const [detectedSensitivity, setDetectedSensitivity] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [mlConfidence, setMlConfidence] = useState(0);
  const [entropyScore, setEntropyScore] = useState(0);

  useEffect(() => {
    const phases: ScanPhase[] = ["entropy", "classification", "encryption", "complete"];
    let currentPhaseIndex = 0;
    let progressInterval: number;

    // Simulate ML detection
    const randomSensitivity = Math.random();
    const sensitivity: "LOW" | "MEDIUM" | "HIGH" = 
      randomSensitivity > 0.7 ? "HIGH" : randomSensitivity > 0.4 ? "MEDIUM" : "LOW";
    setDetectedSensitivity(sensitivity);
    
    const confidence = Math.floor(Math.random() * 15) + 85; // 85-99%
    setMlConfidence(confidence);
    
    const entropy = parseFloat((Math.random() * 2 + 6.5).toFixed(2)); // 6.5-8.5
    setEntropyScore(entropy);

    const phaseInterval = setInterval(() => {
      currentPhaseIndex++;
      if (currentPhaseIndex < phases.length) {
        setPhase(phases[currentPhaseIndex]);
        setProgress(currentPhaseIndex * 33);
      } else {
        clearInterval(phaseInterval);
        clearInterval(progressInterval);
        setProgress(100);
        
        // Show toast with results
        setTimeout(() => {
          showFileAnalyzedToast({
            fileName,
            sensitivity,
            confidence,
            entropy,
          });
          onComplete?.();
        }, 800);
      }
    }, 1200);

    progressInterval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + Math.random() * 3;
        return nextProgress >= (currentPhaseIndex + 1) * 33 
          ? (currentPhaseIndex + 1) * 33 
          : nextProgress;
      });
    }, 100);

    return () => {
      clearInterval(phaseInterval);
      clearInterval(progressInterval);
    };
  }, [fileName, onComplete]);

  const phaseInfo = {
    entropy: {
      icon: FileSearch,
      title: "Analyzing file entropy",
      detail: "Scanning byte distribution patterns and randomness metrics",
      technical: `Shannon entropy calculation • ${fileSize} data analyzed`,
    },
    classification: {
      icon: Shield,
      title: "ML classification in progress",
      detail: "Random Forest model evaluating sensitivity patterns",
      technical: "Feature extraction • Pattern matching • Confidence scoring",
    },
    encryption: {
      icon: Lock,
      title: "Applying AES-256 encryption",
      detail: "Generating cryptographic keys and encrypting payload",
      technical: "256-bit key derivation • CBC mode • PKCS#7 padding",
    },
    complete: {
      icon: CheckCircle2,
      title: "Analysis complete",
      detail: "File secured and classified",
      technical: "Ready for secure storage",
    },
  };

  const currentPhase = phaseInfo[phase];
  const Icon = currentPhase.icon;

  return (
    <div 
      className="w-full max-w-2xl mx-auto rounded-lg p-8" 
      style={{ 
        backgroundColor: 'var(--bg-surface)', 
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
          style={{
            backgroundColor: phase === "complete" ? 'var(--status-success-bg)' : 'var(--brand-primary-light)',
            borderWidth: '2px',
            borderColor: phase === "complete" ? 'var(--status-success)' : 'var(--brand-primary)'
          }}
          animate={{
            scale: phase === "complete" ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Icon 
            className="w-10 h-10" 
            style={{ color: phase === "complete" ? 'var(--status-success)' : 'var(--brand-primary)' }}
            strokeWidth={1.5}
          />
        </motion.div>
        
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {currentPhase.title}
        </h2>
        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
          {currentPhase.detail}
        </p>
        <p 
          className="text-xs mt-3" 
          style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}
        >
          {currentPhase.technical}
        </p>
      </div>

      {/* File Info */}
      <div 
        className="rounded-lg p-4 mb-6" 
        style={{ 
          backgroundColor: 'var(--muted)', 
          border: '1px solid var(--border-color)' 
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold truncate max-w-md" style={{ color: 'var(--text-primary)' }}>
              {fileName}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>
              Size: {fileSize}
            </p>
          </div>
          <div 
            className="text-2xl font-bold" 
            style={{ color: 'var(--brand-primary)', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 rounded-full overflow-hidden mb-6" style={{ backgroundColor: 'var(--muted)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'linear-gradient(to right, var(--brand-primary), var(--brand-primary))' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Entropy Score</div>
          <div 
            className="text-lg font-bold"
            style={{ 
              color: phase === "entropy" || phase === "classification" || phase === "encryption" || phase === "complete" 
                ? 'var(--brand-primary)' 
                : 'var(--text-tertiary)',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            {phase === "entropy" || phase === "classification" || phase === "encryption" || phase === "complete" ? entropyScore.toFixed(2) : "—"}
          </div>
        </div>

        <div className="text-center" style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>ML Confidence</div>
          <div 
            className="text-lg font-bold"
            style={{ 
              color: phase === "classification" || phase === "encryption" || phase === "complete" 
                ? 'var(--sensitivity-medium-text)' 
                : 'var(--text-tertiary)',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            {phase === "classification" || phase === "encryption" || phase === "complete" ? `${mlConfidence}%` : "—"}
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Encryption</div>
          <div 
            className="text-lg font-bold"
            style={{ 
              color: phase === "encryption" || phase === "complete" 
                ? 'var(--status-success)' 
                : 'var(--text-tertiary)',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            {phase === "encryption" || phase === "complete" ? "AES-256" : "—"}
          </div>
        </div>
      </div>

      {/* Phase Indicators */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {["entropy", "classification", "encryption", "complete"].map((p, index) => (
          <div
            key={p}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: ["entropy", "classification", "encryption", "complete"].indexOf(phase) >= index
                ? 'var(--brand-primary)'
                : 'var(--muted)',
              width: ["entropy", "classification", "encryption", "complete"].indexOf(phase) >= index ? '48px' : '32px'
            }}
          />
        ))}
      </div>
    </div>
  );
}