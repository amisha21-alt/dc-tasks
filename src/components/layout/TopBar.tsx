import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useApp } from "@/lib/store";
import { searchAll } from "@/lib/data";

export default function TopBar() {
  const { tasks, projects, users, role, setRole, actingUser } = useApp();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = searchAll(tasks, projects, users, query);
  const hasResults = results.tasks.length > 0 || results.projects.length > 0 || results.people.length > 0;

  const goTo = (path: string) => {
    setLocation(path);
    setQuery("");
    setOpen(false);
  };

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-background flex-shrink-0">
      <div className="flex-1 max-w-md relative" ref={boxRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
          placeholder="Search tasks, projects and people"
          className="w-full bg-transparent border-b border-border py-1 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
        />
        {open && query.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-background border border-black z-50 max-h-80 overflow-y-auto">
            {!hasResults ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">No matches for "{query}"</div>
            ) : (
              <>
                {results.projects.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Projects
                    </div>
                    {results.projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => goTo(`/projects/${p.id}`)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-black"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}
                {results.tasks.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Tasks
                    </div>
                    {results.tasks.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => goTo(`/tasks/${t.id}`)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-black"
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}
                {results.people.length > 0 && (
                  <div>
                    <div className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      People
                    </div>
                    {results.people.map((person) => (
                      <button
                        key={person.id}
                        onClick={() => goTo(`/people/${person.id}`)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-black"
                      >
                        {person.name}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setRole(role === "member" ? "admin" : "member")}
          title="Demo control — swaps which person is signed in, since there's no login yet"
          className="text-[10px] font-mono text-muted-foreground hover:text-black uppercase tracking-wider border-b border-transparent hover:border-black transition-colors"
        >
          Viewing as: {actingUser.name} ({role})
        </button>
        <div className="w-6 h-6 bg-muted border border-border flex items-center justify-center">
          <span className="text-xs font-medium text-muted-foreground">{actingUser.name.charAt(0)}</span>
        </div>
      </div>
    </header>
  );
}
