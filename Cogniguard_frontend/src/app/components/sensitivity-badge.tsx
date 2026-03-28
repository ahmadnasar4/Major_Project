import { cn } from "./ui/utils";

// Update this to handle potential lowercase values from the database
type SensitivityLevel = "LOW" | "MEDIUM" | "HIGH" | "low" | "medium" | "high";

interface SensitivityBadgeProps {
  level: SensitivityLevel;
  className?: string;
}

export function SensitivityBadge({ level, className }: SensitivityBadgeProps) {
  // Normalize the level to uppercase for the text display
  const displayLevel = level.toUpperCase() as "LOW" | "MEDIUM" | "HIGH";

  const styles = {
    LOW: "sensitivity-badge-low",
    MEDIUM: "sensitivity-badge-medium",
    HIGH: "sensitivity-badge-high",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
        styles[displayLevel],
        className
      )}
      style={{
        // We use displayLevel.toLowerCase() to match your CSS variables
        backgroundColor: `var(--sensitivity-${displayLevel.toLowerCase()}-bg)`,
        color: `var(--sensitivity-${displayLevel.toLowerCase()}-text)`,
        borderColor: `var(--sensitivity-${displayLevel.toLowerCase()}-border)`,
      }}
    >
      {displayLevel}
    </span>
  );
}