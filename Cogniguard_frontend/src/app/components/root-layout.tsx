import { Outlet } from "react-router";
import { Toaster } from "./ui/sonner";

export function RootLayout() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Outlet />
      <Toaster position="top-right" />
    </div>
  );
}