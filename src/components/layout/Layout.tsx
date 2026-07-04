import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto bg-background p-10 md:p-16 lg:p-24">
          <div className="max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
