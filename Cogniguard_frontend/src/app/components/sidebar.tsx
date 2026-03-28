import { useNavigate, useLocation } from "react-router";
import { Shield, Files, BarChart3, Key, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

const navigation = [
  { name: "Vault", href: "/dashboard", icon: Files },
  { name: "ML Insights", href: "/ml-stats", icon: BarChart3 },
  { name: "Shared Keys", href: "/key-vault", icon: Key },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-20 lg:w-64 bg-[#0B0E14] border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-[#00F0FF]" strokeWidth={1.5} />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-base font-bold text-white">CogniGuard</h1>
            <p className="text-xs text-white/50" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              v2.4.1
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "text-sm font-medium",
                isActive
                  ? "bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
              <span className="hidden lg:inline">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-medium"
        >
          <User className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
          <span className="hidden lg:inline">Profile</span>
        </button>
        
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
}