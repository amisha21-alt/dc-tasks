# DC Tasks

DC Tasks is an internal project management application built for the Design Craft team.

It is designed to help the team manage projects, tasks, people, updates, comments and resources in one place while keeping the interface simple and focused.

---

# Purpose

DC Tasks was created because existing project management software introduced unnecessary complexity for a small creative team.

The goal is to provide a lightweight system that:

- tracks ongoing projects
- assigns ownership of work
- records project updates
- keeps discussions attached to tasks
- stores important project resources
- provides a simple admin/member workflow

---

# Current Features

## Dashboard

- Project overview
- Task overview
- Team overview
- Activity feed

## Projects

- Create projects
- Edit projects
- Archive projects
- Timeline updates
- Resources

## Tasks

- Create tasks
- Edit tasks
- Assign leads
- Due dates
- Status tracking
- Manager notes
- Subtasks
- Timeline
- Comments

## People

- Team directory
- Admin and Member roles
- Active / inactive users

## Search

- Search projects
- Search tasks
- Search people

---

# Technology Stack

Frontend

- React
- TypeScript
- Vite

Backend

- Cloudflare Pages Functions

Database

- Cloudflare D1 (SQLite)

Hosting

- Cloudflare Pages

Source Control

- Git
- GitHub

---

# Project Structure

```
functions/
    api/
        _shared.ts
        bootstrap.ts
        task.ts
        project.ts
        person.ts
        update.ts
        search.ts

src/
    components/
    hooks/
    lib/
    pages/

schema.sql
seed.sql
README.md
```

---

# Architecture

```
React App
      │
      ▼
Cloudflare Pages
      │
      ▼
Pages Functions
      │
      ▼
Cloudflare D1 Database
```

---

# Database

The database currently contains the following tables:

- users
- projects
- tasks
- subtasks
- updates
- comments
- resources

Database schema is defined in:

```
schema.sql
```

Initial development data is loaded using:

```
seed.sql
```

---

# Local Development

Install dependencies

```bash
npm install
```

Run locally

```bash
npm run dev
```

Build

```bash
npm run build
```

---

# Deployment

The application is automatically deployed through Cloudflare Pages.

Deployment flow:

```
VS Code
      │
      ▼
Git Commit
      │
      ▼
GitHub
      │
      ▼
Cloudflare Pages
      │
      ▼
Production
```

---

# Current Status

Current implementation includes:

- React frontend
- Cloudflare Pages deployment
- Cloudflare D1 integration
- Bootstrap API
- Local state mutations
- Automatic deployment from GitHub

Database writes will progressively move from local state into D1-backed APIs.

---

# Roadmap

## Backend

- D1-backed mutations
- Validation
- Transactions
- Error handling

## User Experience

- Notifications
- Dashboard improvements
- Filters
- Calendar views
- File uploads

## Administration

- Authentication
- Permissions
- Audit log

## Future

- Team notifications
- Reporting
- Mobile optimisation
- Offline support

---

# Design Philosophy

DC Tasks is intentionally minimal.

The application prioritises:

- clarity over complexity
- speed over excessive features
- collaborative work
- low maintenance
- long-term stability

Every new feature should improve the team's workflow without making the interface more difficult to use.
