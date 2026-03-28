import { useNavigate, useLocation } from "react-router";
import { Files, BarChart3, Key } from "lucide-react";
import { cn } from "./ui/utils";

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "Vault", icon: Files, href: "/dashboard" },
    { name: "Insights", icon: BarChart3, href: "/ml-stats" },
    { name: "Keys", icon: Key, href: "/key-vault" },
  ];

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg safe-area-bottom z-50" 
      style={{ 
        backgroundColor: 'var(--bg-surface)', 
        borderTop: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.href;
          
          return (
            <button
              key={tab.name}
              onClick={() => navigate(tab.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-xl transition-all min-w-[44px] min-h-[44px]",
                isActive && "bg-blue-50"
              )}
              style={{
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--brand-primary-light)' : 'transparent'
              }}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-xs font-semibold">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}