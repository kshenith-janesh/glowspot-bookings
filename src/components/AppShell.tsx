import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export const AppShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-hero">
    <div className="max-w-md mx-auto pb-24 relative">{children}</div>
    <BottomNav />
  </div>
);
