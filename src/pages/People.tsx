import { Link } from "wouter";
import { useApp } from "@/lib/store";
import { getPeopleList } from "@/lib/data";

const StateBadge = ({ state }: { state: string | null }) => {
  if (!state) return null;
  return (
    <span className="inline-block px-2 py-0.5 border border-black text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
      {state}
    </span>
  );
};

export default function People() {
  const { users, tasks, projects } = useApp();
  const peopleList = getPeopleList(users, tasks, projects);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 lg:px-8 space-y-16 animate-in fade-in duration-500 pb-32">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <h1 className="text-3xl font-normal tracking-tight text-black leading-tight">
          People
        </h1>
      </header>

      <section>
        <div className="flex flex-col border-t border-black">
          {peopleList.map((person) => (
            <Link key={person.id} href={`/people/${person.id}`}>
              <div className={`group flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors gap-4 px-2 ${!person.active ? 'opacity-50' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <span className="font-medium text-black group-hover:underline underline-offset-4 decoration-1">
                    {person.name}
                  </span>
                  {!person.active && <span className="text-xs text-muted-foreground italic">Deactivated</span>}
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <span className="text-sm text-muted-foreground w-20 text-right">
                    {person.activeTasks} task{person.activeTasks !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm text-muted-foreground w-24 text-right hidden sm:inline-block">
                    {person.lastUpdated}
                  </span>
                  <div className="w-16 text-right flex justify-end">
                    <StateBadge state={person.role} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
