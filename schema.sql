PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Member' CHECK (role IN ('Admin', 'Member')),
  active INTEGER NOT NULL DEFAULT 1,
  joined TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL DEFAULT '',
  target_end_date TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  project_id TEXT NOT NULL,
  lead_id TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'To Do',
  due_date TEXT,
  overdue INTEGER NOT NULL DEFAULT 0,
  completed_date TEXT,
  manager_notes TEXT NOT NULL DEFAULT '[]',
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (lead_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS subtasks (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  name TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  completed_by TEXT,
  completed_at TEXT,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS updates (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  project_name TEXT,
  task_id TEXT,
  task_name TEXT,
  author TEXT NOT NULL,
  time TEXT NOT NULL DEFAULT 'Just now',
  text TEXT NOT NULL DEFAULT '',
  state TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  update_id TEXT NOT NULL,
  author TEXT NOT NULL,
  text TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (update_id) REFERENCES updates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'Link',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_lead_id ON tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_tasks_state ON tasks(state);
CREATE INDEX IF NOT EXISTS idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_updates_project_id ON updates(project_id);
CREATE INDEX IF NOT EXISTS idx_updates_task_id ON updates(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_update_id ON comments(update_id);
CREATE INDEX IF NOT EXISTS idx_resources_project_id ON resources(project_id);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
