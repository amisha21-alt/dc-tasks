import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

export default function Sidebar() {
  const [location] = useLocation();
  const { role } = useApp();

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/people", label: "People" },
    ...(role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex-shrink-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="font-medium tracking-tight text-foreground uppercase text-sm">DC Tasks</span>
      </div>
      <nav className="flex-1 py-6 px-4 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = location === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm tracking-wide transition-colors",
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
