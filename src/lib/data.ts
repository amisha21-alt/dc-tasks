// ============================================================
// DC Tasks — Shared Data Source
// Seed data plus pure derivation functions. The live, mutable
// copies of these arrays are held in AppProvider (see store.tsx);
// everything below is stateless and operates on whatever arrays
// are passed in, so every view stays in sync with the same data.
// ============================================================

// -------------------- TYPES --------------------

export interface User {
  id: string;
  name: string;
  role: "Admin" | "Member";
  active: boolean;
  joined: string;
}

export interface Resource {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
}

export interface Post {
  id: string;
  author: string;
  time: string;
  text: string;
  state: string | null;
  comments: Comment[];
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskName?: string;
}

export interface Subtask {
  id: string;
  name: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
}

export interface ManagerNote {
  author: string;
  date: string;
  note: string;
}

export interface Task {
  id: string;
  name: string;
  projectId: string;
  leadId: string;
  state: string;
  dueDate: string | null;
  overdue?: boolean;
  completedDate?: string;
  subtasks: Subtask[];
  timeline: Post[];
  managerNotes: ManagerNote[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  targetEndDate: string;
  status: string;
  resources: Resource[];
  timeline: Post[];
}

export const TASK_STATES = [
  "To Do",
  "In Progress",
  "Waiting",
  "Review",
  "Done",
  "Cancelled",
] as const;

// -------------------- SEED: USERS --------------------

export const INITIAL_USERS: User[] = [
  { id: "m1", name: "Amisha", role: "Member", active: true, joined: "Jan 15, 2022" },
  { id: "m2", name: "Founder", role: "Admin", active: true, joined: "Founding Member" },
  { id: "m3", name: "Rahul", role: "Member", active: true, joined: "Mar 10, 2022" },
  { id: "m4", name: "Neha", role: "Member", active: true, joined: "Aug 05, 2022" },
  { id: "m5", name: "Accounts", role: "Admin", active: true, joined: "Nov 20, 2021" },
  { id: "m6", name: "Intern", role: "Member", active: true, joined: "Sep 01, 2023" },
];

// -------------------- SEED: PROJECTS --------------------

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Collection Development",
    description:
      "Developing the new summer collection incorporating natural indigo dyeing and traditional Kasuti embroidery on Ajrakh base fabrics.",
    startDate: "Sep 1, 2023",
    targetEndDate: "Nov 30, 2023",
    status: "Active",
    resources: [
      { id: "r1", name: "Costing Sheet", url: "#", type: "Google Sheets" },
      { id: "r2", name: "Collection Moodboard", url: "#", type: "Figma" },
      { id: "r3", name: "Exhibition Photos", url: "#", type: "Google Drive" },
    ],
    timeline: [],
  },
  {
    id: "p2",
    name: "Mumbai Store",
    description:
      "Retail setup for the new Mumbai location with VM layout, shelf planning, and inventory display.",
    startDate: "Oct 1, 2023",
    targetEndDate: "Dec 15, 2023",
    status: "Active",
    resources: [
      { id: "r1", name: "VM Layout", url: "#", type: "Figma" },
      { id: "r2", name: "Store Budget", url: "#", type: "Google Sheets" },
    ],
    timeline: [],
  },
  {
    id: "p3",
    name: "Website",
    description:
      "Online store revamp with new collection photos, product descriptions, and updated CMS.",
    startDate: "Aug 15, 2023",
    targetEndDate: "Oct 31, 2023",
    status: "Active",
    resources: [
      { id: "r1", name: "Photo Assets", url: "#", type: "Google Drive" },
      { id: "r2", name: "Product Copy", url: "#", type: "Google Sheets" },
    ],
    timeline: [],
  },
  {
    id: "p4",
    name: "Social Media",
    description: "Daily content creation and scheduling across Instagram and newsletter.",
    startDate: "Ongoing",
    targetEndDate: "Ongoing",
    status: "Active",
    resources: [
      { id: "r1", name: "Content Calendar", url: "#", type: "Google Sheets" },
    ],
    timeline: [
      {
        id: "p4-post1",
        author: "Neha",
        time: "Yesterday",
        text: "New collection reel drafted",
        state: null,
        comments: [],
      },
      {
        id: "p4-post2",
        author: "Amisha",
        time: "2 days ago",
        text: "Scheduled posts for the week",
        state: null,
        comments: [],
      },
    ],
  },
  {
    id: "p5",
    name: "Exhibition",
    description:
      "Preparation for the Crafts Council exhibition including booth layout and sample inventory.",
    startDate: "Nov 1, 2023",
    targetEndDate: "Nov 5, 2023",
    status: "Active",
    resources: [
      { id: "r1", name: "Booth Layout", url: "#", type: "Figma" },
      { id: "r2", name: "Inventory List", url: "#", type: "Google Sheets" },
    ],
    timeline: [
      {
        id: "p5-post1",
        author: "Rahul",
        time: "Yesterday",
        text: "Inventory list shared in Google Sheets",
        state: null,
        comments: [],
      },
      {
        id: "p5-post2",
        author: "Founder",
        time: "3 days ago",
        text: "Booth layout finalized",
        state: null,
        comments: [],
      },
    ],
  },
  {
    id: "p6",
    name: "General",
    description: "Studio operations and miscellaneous administrative tasks.",
    startDate: "Ongoing",
    targetEndDate: "Ongoing",
    status: "Active",
    resources: [],
    timeline: [],
  },
];

// -------------------- SEED: TASKS --------------------

export const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    name: "Finalize saree costing",
    projectId: "p1",
    leadId: "m2",
    state: "In Progress",
    dueDate: "Oct 12, 2023",
    overdue: true,
    subtasks: [
      {
        id: "st1",
        name: "Confirm zari and thread rates with supplier",
        completed: true,
        completedBy: "Accounts",
        completedAt: "3 days ago",
      },
      {
        id: "st2",
        name: "Add weaving and finishing charges",
        completed: true,
        completedBy: "Amisha",
        completedAt: "1 day ago",
      },
      { id: "st3", name: "Review margin with Founder", completed: false },
      { id: "st4", name: "Share final costing sheet with accounts", completed: false },
    ],
    timeline: [
      {
        id: "t1-post1",
        author: "Accounts",
        time: "1 day ago",
        text: "Costing completed and shared with accounts. A couple of the Ajrakh sarees are running slightly over the target price.",
        state: "Review",
        comments: [
          {
            id: "t1-post1-c1",
            author: "Founder",
            text: "Let's review the margin together tomorrow morning.",
          },
        ],
      },
      {
        id: "t1-post2",
        author: "Amisha",
        time: "4 days ago",
        text: "Starting the costing sheet for the new saree line. Using the revised rates from the weaving cluster.",
        state: null,
        comments: [],
      },
    ],
    managerNotes: [
      {
        author: "Founder",
        date: "Oct 11, 2023",
        note: "Wants an update by Friday. If the margin doesn't work on the Ajrakh pieces, we may need to revisit the retail pricing for that sub-collection.",
      },
    ],
  },
  {
    id: "t2",
    name: "Review Kasuti samples",
    projectId: "p1",
    leadId: "m1",
    state: "Review",
    dueDate: "Oct 15, 2023",
    subtasks: [
      {
        id: "st1",
        name: "Collect samples from Kasuti artisan cluster",
        completed: true,
        completedBy: "Amisha",
        completedAt: "5 days ago",
      },
      {
        id: "st2",
        name: "Shortlist 3 motif variations",
        completed: true,
        completedBy: "Amisha",
        completedAt: "2 days ago",
      },
      { id: "st3", name: "Pair shortlisted motifs with Ajrakh fabric", completed: false },
    ],
    timeline: [
      {
        id: "t2-post1",
        author: "Amisha",
        time: "2 days ago",
        text: "Waiting for revised Ajrakh samples before we can finalize the Kasuti pairing. Motif shortlist is ready though.",
        state: "Review",
        comments: [
          {
            id: "t2-post1-c1",
            author: "Neha",
            text: "I can help pull reference photos for the pairing once samples arrive.",
          },
          {
            id: "t2-post1-c2",
            author: "Amisha",
            text: "Thanks Neha, will loop you in.",
          },
        ],
      },
    ],
    managerNotes: [
      {
        author: "Founder",
        date: "Oct 14, 2023",
        note: "Keep an eye on artisan turnaround time. We may need to reorder Ajrakh yardage if we go with more than 3 pairings.",
      },
    ],
  },
  {
    id: "t3",
    name: "Visit Ajrakh artisan",
    projectId: "p1",
    leadId: "m1",
    state: "Waiting",
    dueDate: "Oct 18, 2023",
    subtasks: [
      {
        id: "st1",
        name: "Confirm visit date with artisan cluster",
        completed: true,
        completedBy: "Amisha",
        completedAt: "4 days ago",
      },
      { id: "st2", name: "Prepare list of dye and motif references", completed: false },
      { id: "st3", name: "Arrange travel to Ajrakhpur", completed: false },
    ],
    timeline: [
      {
        id: "t3-post1",
        author: "Amisha",
        time: "2h ago",
        text: "Visited artisan today and discussed natural indigo dyeing. Samples expected in about two weeks.",
        state: "Waiting",
        comments: [
          {
            id: "t3-post1-c1",
            author: "Founder",
            text: "Great, let's plan the next visit once samples arrive.",
          },
        ],
      },
    ],
    managerNotes: [
      {
        author: "Founder",
        date: "Oct 16, 2023",
        note: "If the indigo samples come back inconsistent, we should consider a second artisan cluster as backup.",
      },
    ],
  },
  {
    id: "t4",
    name: "Approve VM layout",
    projectId: "p2",
    leadId: "m3",
    state: "Review",
    dueDate: "Oct 10, 2023",
    overdue: true,
    subtasks: [
      {
        id: "st1",
        name: "Share layout mockup with Founder",
        completed: true,
        completedBy: "Rahul",
        completedAt: "2 days ago",
      },
      { id: "st2", name: "Confirm shelf placement for new collection", completed: false },
    ],
    timeline: [
      {
        id: "t4-post1",
        author: "Rahul",
        time: "4h ago",
        text: "VM layout ready for review. Setup can begin at the store this weekend once approved.",
        state: "Review",
        comments: [],
      },
    ],
    managerNotes: [
      {
        author: "Founder",
        date: "Oct 9, 2023",
        note: "Make sure the new collection is placed near the entrance for visibility during the festive season.",
      },
    ],
  },
  {
    id: "t5",
    name: "Upload website photos",
    projectId: "p3",
    leadId: "m4",
    state: "Review",
    dueDate: "Oct 10, 2023",
    subtasks: [
      {
        id: "st1",
        name: "Select final shots from photoshoot",
        completed: true,
        completedBy: "Neha",
        completedAt: "1 day ago",
      },
      { id: "st2", name: "Resize and optimize images", completed: false },
      { id: "st3", name: "Upload to website CMS", completed: false },
    ],
    timeline: [
      {
        id: "t5-post1",
        author: "Neha",
        time: "Yesterday",
        text: "Photos uploaded to Google Drive. The lighting on the new collection shots came out well.",
        state: "Review",
        comments: [
          {
            id: "t5-post1-c1",
            author: "Amisha",
            text: "These look great, approved for the website.",
          },
        ],
      },
    ],
    managerNotes: [
      {
        author: "Founder",
        date: "Oct 9, 2023",
        note: "Confirm with Neha that product descriptions are ready before the photos go live.",
      },
    ],
  },
  {
    id: "t10",
    name: "Draft collection story",
    projectId: "p1",
    leadId: "m4",
    state: "Review",
    dueDate: "Oct 20, 2023",
    subtasks: [
      {
        id: "st1",
        name: "Write narrative around indigo and Ajrakh craft",
        completed: true,
        completedBy: "Neha",
        completedAt: "2 days ago",
      },
      { id: "st2", name: "Share draft with Founder for review", completed: false },
    ],
    timeline: [
      {
        id: "t10-post1",
        author: "Neha",
        time: "2 days ago",
        text: "First draft of the collection story is ready for review.",
        state: "Review",
        comments: [],
      },
    ],
    managerNotes: [
      {
        author: "Founder",
        date: "Oct 19, 2023",
        note: "Keep the story short enough to use across both the website and exhibition signage.",
      },
    ],
  },
  {
    id: "t11",
    name: "Create moodboard",
    projectId: "p1",
    leadId: "m1",
    state: "Done",
    dueDate: "Sep 20, 2023",
    completedDate: "Sep 20, 2023",
    subtasks: [
      {
        id: "st1",
        name: "Collect fabric and motif references",
        completed: true,
        completedBy: "Amisha",
        completedAt: "2 weeks ago",
      },
      {
        id: "st2",
        name: "Build moodboard in Figma",
        completed: true,
        completedBy: "Amisha",
        completedAt: "2 weeks ago",
      },
    ],
    timeline: [
      {
        id: "t11-post1",
        author: "Amisha",
        time: "2 weeks ago",
        text: "Collection moodboard finalized and shared with the team in Figma.",
        state: "Done",
        comments: [],
      },
    ],
    managerNotes: [
      { author: "Amisha", date: "Sep 20, 2023", note: "No open items." },
    ],
  },
  {
    id: "t12",
    name: "Initial fabric sourcing",
    projectId: "p1",
    leadId: "m2",
    state: "Done",
    dueDate: "Sep 15, 2023",
    completedDate: "Sep 15, 2023",
    subtasks: [
      {
        id: "st1",
        name: "Shortlist fabric suppliers",
        completed: true,
        completedBy: "Founder",
        completedAt: "3 weeks ago",
      },
      {
        id: "st2",
        name: "Order base fabric samples",
        completed: true,
        completedBy: "Founder",
        completedAt: "3 weeks ago",
      },
    ],
    timeline: [
      {
        id: "t12-post1",
        author: "Founder",
        time: "3 weeks ago",
        text: "Base fabric sourcing wrapped up, samples approved for the collection.",
        state: "Done",
        comments: [],
      },
    ],
    managerNotes: [
      { author: "Founder", date: "Sep 15, 2023", note: "No open items." },
    ],
  },
  {
    id: "t13",
    name: "Cancel screen print trials",
    projectId: "p1",
    leadId: "m1",
    state: "Cancelled",
    dueDate: null,
    completedDate: "Sep 10, 2023",
    subtasks: [
      {
        id: "st1",
        name: "Notify printing vendor of cancellation",
        completed: true,
        completedBy: "Amisha",
        completedAt: "1 week ago",
      },
    ],
    timeline: [
      {
        id: "t13-post1",
        author: "Amisha",
        time: "1 week ago",
        text: "Decided to go with hand block printing instead, cancelling the screen print trials.",
        state: "Cancelled",
        comments: [],
      },
    ],
    managerNotes: [
      { author: "Amisha", date: "1 week ago", note: "No open items." },
    ],
  },
  {
    id: "t14",
    name: "Finalize exhibition inventory",
    projectId: "p5",
    leadId: "m6",
    state: "To Do",
    dueDate: "Oct 28, 2023",
    subtasks: [
      { id: "st1", name: "Count sample stock by category", completed: false },
      { id: "st2", name: "Print inventory sheet for booth", completed: false },
    ],
    timeline: [],
    managerNotes: [],
  },
];

// -------------------- DEFAULTS --------------------

export const defaultTask: Task = {
  id: "default",
  name: "Studio Task",
  projectId: "p6",
  leadId: "",
  state: "Waiting",
  dueDate: null,
  subtasks: [],
  timeline: [],
  managerNotes: [],
};

// -------------------- SMALL HELPERS --------------------

export function byId<T extends { id: string }>(list: T[]): Record<string, T> {
  return list.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<string, T>);
}

const timePriority: Record<string, number> = {
  "Just now": -1,
  "2h ago": 0,
  "4h ago": 1,
  "1 day ago": 2,
  Yesterday: 3,
  "2 days ago": 4,
  "3 days ago": 5,
  "1 week ago": 6,
  "2 weeks ago": 7,
  "3 weeks ago": 8,
};

function sortByTime(a: { time: string }, b: { time: string }): number {
  return (timePriority[a.time] ?? 99) - (timePriority[b.time] ?? 99);
}

function isTaskOpen(t: Task): boolean {
  return t.state !== "Done" && t.state !== "Cancelled";
}

// ============================================================
// DERIVED VIEWS — all take live arrays, none hold their own state
// ============================================================

// --- Home: Needs Attention (open tasks in Waiting/Review, or overdue) ---

export function getNeedsAttention(tasks: Task[], projects: Project[]) {
  const projectsMap = byId(projects);
  return tasks
    .filter((t) => t.overdue || t.state === "Review" || t.state === "Waiting")
    .slice(0, 6)
    .map((t) => ({
      id: t.id,
      name: t.name,
      project: projectsMap[t.projectId]?.name || "General",
      state: t.state,
    }));
}

// --- Home: Recent Updates feed (across tasks + project-level posts) ---

export function getRecentUpdates(tasks: Task[], projects: Project[]) {
  const projectsMap = byId(projects);
  const allPosts: {
    id: string;
    author: string;
    time: string;
    project: string;
    task: string | null;
    taskId: string | null;
    text: string;
    state: string | null;
    comments: number;
  }[] = [];

  tasks.forEach((task) => {
    task.timeline.forEach((post) => {
      allPosts.push({
        id: post.id,
        author: post.author,
        time: post.time,
        project: projectsMap[task.projectId]?.name || "General",
        task: task.name,
        taskId: task.id,
        text: post.text,
        state: post.state,
        comments: post.comments.length,
      });
    });
  });

  projects.forEach((project) => {
    project.timeline.forEach((post) => {
      allPosts.push({
        id: post.id,
        author: post.author,
        time: post.time,
        project: project.name,
        task: post.taskName || null,
        taskId: post.taskId || null,
        text: post.text,
        state: post.state,
        comments: post.comments.length,
      });
    });
  });

  allPosts.sort(sortByTime);
  return allPosts.slice(0, 6);
}

// --- Home: five most recently active projects ---

export function getActiveProjects(projects: Project[], tasks: Task[]) {
  return projects
    .map((project) => {
      const projectPosts = [
        ...project.timeline,
        ...tasks
          .filter((t) => t.projectId === project.id)
          .flatMap((t) => t.timeline.map((post) => ({ text: post.text, time: post.time }))),
      ];
      projectPosts.sort(sortByTime);
      const updates = projectPosts.slice(0, 2).map((p) => p.text);
      return {
        id: project.id,
        name: project.name,
        rank: projectPosts.length > 0 ? (timePriority[projectPosts[0].time] ?? 99) : 999,
        updates: updates.length > 0 ? updates : ["No recent updates"],
      };
    })
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 5)
    .map(({ rank, ...rest }) => rest);
}

// --- Home: People with their last two updates ---

export function getTeamMembers(users: User[], tasks: Task[], projects: Project[]) {
  return users
    .filter((u) => u.active)
    .map((u) => {
      const posts = [
        ...tasks.flatMap((t) => t.timeline.filter((p) => p.author === u.name).map((p) => ({ text: p.text, time: p.time }))),
        ...projects.flatMap((p) => p.timeline.filter((post) => post.author === u.name).map((p2) => ({ text: p2.text, time: p2.time }))),
      ];
      posts.sort(sortByTime);
      const updates = posts.slice(0, 2).map((p) => p.text);
      return {
        id: u.id,
        name: u.name,
        updates: updates.length > 0 ? updates : ["No updates yet"],
      };
    });
}

// --- Projects list ---

export function getProjectsList(projects: Project[], tasks: Task[]) {
  return projects.map((p) => {
    const projectTasks = tasks.filter((t) => t.projectId === p.id);
    const activeTaskCount = projectTasks.filter(isTaskOpen).length;
    const allPosts = [...p.timeline, ...projectTasks.flatMap((t) => t.timeline)];
    const sorted = [...allPosts].sort(sortByTime);
    const lastUpdated = sorted.length > 0 ? sorted[0].time : "No updates yet";

    return {
      id: p.id,
      name: p.name,
      status: p.status,
      lastUpdated,
      activeTasks: activeTaskCount,
    };
  });
}

// --- Project detail ---

export function getProjectDetail(projects: Project[], tasks: Task[], projectId: string) {
  const projectsMap = byId(projects);
  const project = projectsMap[projectId];
  if (!project) return null;

  const projectTasks = tasks.filter((t) => t.projectId === projectId);

  const timeline = [
    ...project.timeline.map((post) => ({
      ...post,
      projectName: project.name,
      taskName: post.taskName || null,
      taskId: post.taskId || null,
    })),
    ...projectTasks.flatMap((task) =>
      task.timeline.map((post) => ({
        ...post,
        projectName: project.name,
        taskName: task.name,
        taskId: task.id,
      })),
    ),
  ].sort(sortByTime);

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    startDate: project.startDate,
    targetEndDate: project.targetEndDate,
    status: project.status,
    resources: project.resources,
    timeline,
    tasks: projectTasks.map((t) => ({ id: t.id, name: t.name, status: t.state })),
  };
}

// --- People list ---

export function getPeopleList(users: User[], tasks: Task[], projects: Project[]) {
  return users.map((u) => {
    const personTasks = tasks.filter((t) => t.leadId === u.id);
    const activeTaskCount = personTasks.filter(isTaskOpen).length;
    const allPosts = [
      ...personTasks.flatMap((t) => t.timeline),
      ...projects.flatMap((p) => p.timeline.filter((post) => post.author === u.name)),
    ];
    const sorted = [...allPosts].sort(sortByTime);
    const lastUpdated = sorted.length > 0 ? sorted[0].time : "No updates yet";

    return {
      id: u.id,
      name: u.name,
      role: u.role,
      active: u.active,
      lastUpdated,
      activeTasks: activeTaskCount,
    };
  });
}

// --- Person profile ---

export function getPersonProfile(users: User[], tasks: Task[], projects: Project[], personId: string) {
  const usersMap = byId(users);
  const user = usersMap[personId];
  if (!user) {
    return {
      id: personId,
      name: "Unknown Person",
      role: "Member" as const,
      joined: "N/A",
      activeTasks: [] as any[],
      completedTasks: [] as any[],
      posts: [] as any[],
    };
  }

  const projectsMap = byId(projects);
  const personTasks = tasks.filter((t) => t.leadId === personId);

  const activeTasks = personTasks.filter(isTaskOpen).map((t) => ({
    id: t.id,
    name: t.name,
    project: projectsMap[t.projectId]?.name || "General",
    state: t.state,
  }));

  const completedTasks = personTasks
    .filter((t) => !isTaskOpen(t))
    .map((t) => ({
      id: t.id,
      name: t.name,
      completedDate: t.completedDate || t.dueDate || "N/A",
    }));

  const posts: {
    id: string;
    author: string;
    time: string;
    project: string;
    task: string | null;
    taskId: string | null;
    text: string;
    state: string | null;
    comments: Comment[];
  }[] = [];

  tasks.forEach((task) => {
    task.timeline.forEach((post) => {
      if (post.author === user.name) {
        posts.push({
          id: post.id,
          author: post.author,
          time: post.time,
          project: projectsMap[task.projectId]?.name || "General",
          task: task.name,
          taskId: task.id,
          text: post.text,
          state: post.state,
          comments: post.comments,
        });
      }
    });
  });

  projects.forEach((project) => {
    project.timeline.forEach((post) => {
      if (post.author === user.name) {
        posts.push({
          id: post.id,
          author: post.author,
          time: post.time,
          project: project.name,
          task: post.taskName || null,
          taskId: post.taskId || null,
          text: post.text,
          state: post.state,
          comments: post.comments,
        });
      }
    });
  });

  posts.sort(sortByTime);

  return {
    id: user.id,
    name: user.name,
    role: user.role,
    joined: user.joined,
    activeTasks,
    completedTasks,
    posts,
  };
}

// --- Weekly review: computed live from actual task states, never fake numbers ---

export function getWeeklyReview(tasks: Task[]) {
  return {
    completed: tasks.filter((t) => t.state === "Done").length,
    active: tasks.filter((t) => t.state === "In Progress" || t.state === "To Do").length,
    waiting: tasks.filter((t) => t.state === "Waiting").length,
    review: tasks.filter((t) => t.state === "Review").length,
    overdue: tasks.filter((t) => !!t.overdue).length,
  };
}

// --- Search: tasks + projects + people ---

export function searchAll(
  tasks: Task[],
  projects: Project[],
  users: User[],
  query: string,
) {
  const q = query.trim().toLowerCase();

  if (!q) {
    return {
      tasks: [] as Task[],
      projects: [] as Project[],
      people: [] as User[],
    };
  }

  return {
    tasks: tasks.filter((t) => t.name.toLowerCase().includes(q)).slice(0, 6),
    projects: projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6),
    people: users.filter(
      (u) =>
        u.active &&
        (u.name.toLowerCase().includes(q) ||
         u.role.toLowerCase().includes(q))
    ).slice(0,6),
  };
}
