# 📋 TaskFlow - MERN Task Manager Project
## Complete Project Documentation & Interview Preparation Guide

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture & Flow](#architecture--flow)
4. [Project Structure](#project-structure)
5. [Key Components Explained](#key-components-explained)
6. [Database Schema](#database-schema)
7. [Authentication Flow](#authentication-flow)
8. [How Features Work](#how-features-work)
9. [State Management](#state-management)
10. [Interview Q&A](#interview-qa)
11. [Key Concepts](#key-concepts)

---

## Project Overview

**TaskFlow** is a modern task management application built with React, TypeScript, and Supabase. It helps users organize, track, and manage their daily tasks with an intuitive and beautiful UI.

### Key Features:
- ✅ User Authentication (Sign up / Sign in)
- ✅ Create, Read, Update, Delete (CRUD) tasks
- ✅ Task filtering (by status, priority, search)
- ✅ Task prioritization (Low, Medium, High)
- ✅ Task status tracking (To Do, In Progress, Completed)
- ✅ Due date management with visual indicators
- ✅ Task tagging system
- ✅ Real-time statistics dashboard
- ✅ Responsive design (Mobile & Desktop)
- ✅ Dark theme UI with modern styling

---

## Tech Stack

### Frontend:
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **UI Icons**: Lucide React 0.344.0
- **Post Processing**: PostCSS 8.4.35

### Backend/Database:
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (JWT-based)
- **Real-time**: Supabase Real-time subscriptions
- **Client Library**: @supabase/supabase-js 2.57.4

### Development:
- **Linting**: ESLint 9.9.1
- **Type Checking**: TypeScript Compiler
- **Package Manager**: npm

---

## Architecture & Flow

### High-Level Architecture Diagram:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  AuthPage    │  │  Dashboard   │  │  Components  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                  ↓                    ↓            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Context API (AuthContext)                  │   │
│  │  - User authentication state                        │   │
│  │  - User profile data                                │   │
│  └─────────────────────────────────────────────────────┘   │
│         ↓                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Custom Hooks (useTasks)                  │   │
│  │  - Task CRUD operations                             │   │
│  │  - Task filtering logic                             │   │
│  │  - Local state management                           │   │
│  └─────────────────────────────────────────────────────┘   │
│         ↓                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       Supabase Client (lib/supabase.ts)            │   │
│  │  - Database queries                                 │   │
│  │  - Authentication                                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────────────┐
│              Supabase Backend (Cloud)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Service │  │  PostgreSQL  │  │   RLS Policies   │ │
│  │ (JWT Token)  │  │  Database    │  │  (Security)  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow (Request/Response):

```
User Action (Click Create Task)
         ↓
TaskForm Component
         ↓
handleCreate() function
         ↓
useTasks Hook - createTask()
         ↓
Supabase Client - insert query
         ↓
Database Server - INSERT row
         ↓
Database returns new task with ID
         ↓
useTasks updates local state (setTasks)
         ↓
Component re-renders with new task
         ↓
UI shows new task in the list
```

---

## Project Structure

```
project/
├── .env                                  # Environment variables (API keys)
├── .gitignore                            # Git ignore rules
├── package.json                          # Dependencies & scripts
├── tsconfig.json                         # TypeScript config
├── tsconfig.app.json                     # App-specific TS config
├── tsconfig.node.json                    # Node TS config
├── vite.config.ts                        # Vite build config
├── tailwind.config.js                    # Tailwind styling config
├── postcss.config.js                     # PostCSS config
├── eslint.config.js                      # ESLint rules
├── index.html                            # HTML entry point
│
├── src/
│   ├── main.tsx                          # React app entry point
│   ├── App.tsx                           # Root component (routing logic)
│   ├── index.css                         # Global styles
│   ├── vite-env.d.ts                     # Vite type definitions
│   │
│   ├── pages/                            # Page components
│   │   ├── AuthPage.tsx                  # Sign in / Sign up page
│   │   └── Dashboard.tsx                 # Main task management page
│   │
│   ├── components/                       # Reusable UI components
│   │   ├── TaskCard.tsx                  # Individual task display
│   │   ├── TaskForm.tsx                  # Create/Edit task form
│   │   └── TaskFilters.tsx               # Filter controls
│   │
│   ├── context/                          # React Context
│   │   └── AuthContext.tsx               # User authentication state
│   │
│   ├── hooks/                            # Custom React hooks
│   │   └── useTasks.ts                   # Task management logic
│   │
│   └── lib/                              # Utilities & configurations
│       └── supabase.ts                   # Supabase client & types
│
└── supabase/
    └── migrations/
        └── 20260424203200_create_task_manager_schema.sql  # DB schema
```

### What Each File Does:

#### `src/App.tsx`
- **Purpose**: Main application router
- **Logic**: Checks if user is logged in
- **Flow**: If logged in → shows Dashboard, else → shows AuthPage
- **Key**: Uses AuthContext to check authentication state

#### `src/pages/AuthPage.tsx`
- **Purpose**: Authentication page
- **Features**: 
  - Toggle between Sign In and Sign Up modes
  - Email/Password input validation
  - Show/Hide password toggle
  - Error message display
  - Loading states
- **Logic**: Calls `signIn()` or `signUp()` from AuthContext

#### `src/pages/Dashboard.tsx`
- **Purpose**: Main task management interface
- **Features**:
  - Sidebar with statistics
  - Task list/grid view toggle
  - Create new task button
  - Task filters
  - User profile menu
  - Completion rate progress bar
- **Logic**: Uses `useTasks` hook to manage tasks

#### `src/components/TaskCard.tsx`
- **Purpose**: Displays individual task
- **Features**:
  - Status toggle button (todo → in_progress → completed)
  - Priority badge (Low/Medium/High)
  - Due date with color indicators
  - Tags display
  - Delete button
  - Edit functionality
- **Logic**: Renders task data with interactive buttons

#### `src/components/TaskForm.tsx`
- **Purpose**: Create or edit a task
- **Fields**:
  - Title (required)
  - Description
  - Status dropdown
  - Priority selection
  - Due date picker
  - Tags (comma-separated)
- **Validation**: Title is required, shows error messages

#### `src/components/TaskFilters.tsx`
- **Purpose**: Filter tasks by status, priority, or search text
- **Features**: Status filter, priority filter, search input

#### `src/context/AuthContext.tsx`
- **Purpose**: Global authentication state management
- **Provides**:
  - `user`: Current logged-in user object
  - `session`: Auth session object
  - `profile`: User profile information
  - `loading`: Auth state loading indicator
  - `signUp()`: Register new user
  - `signIn()`: Login user
  - `signOut()`: Logout user
- **How it works**: 
  1. On mount, checks if user has existing session
  2. Sets up listener for auth state changes
  3. Fetches user profile from database
  4. Provides all data to child components

#### `src/hooks/useTasks.ts`
- **Purpose**: Custom hook for task management
- **Key Functions**:
  - `fetchTasks()`: Get all user's tasks from database
  - `createTask()`: Insert new task
  - `updateTask()`: Modify existing task
  - `deleteTask()`: Remove task
  - `filteredTasks`: Computed array of tasks based on filters
  - `stats`: Counts (todo, in_progress, completed, total)
- **State**:
  - `tasks`: Array of all tasks
  - `loading`: Fetch state
  - `filters`: Current filter settings
- **Features**:
  - Auto-fetches tasks when user logs in
  - Optimistic updates (updates state immediately)
  - Real-time filtering on client side

#### `src/lib/supabase.ts`
- **Purpose**: Supabase configuration and type definitions
- **Exports**:
  - `supabase`: Configured Supabase client
  - TypeScript interfaces: `Task`, `Profile`, `TaskFormData`
  - Type unions: `TaskStatus`, `TaskPriority`
- **Usage**: Imported in all files that need database/auth access

---

## Database Schema

### Tables Overview:

#### 1. **profiles** table
```sql
id              uuid (PK) - References auth.users
username        text (UNIQUE)
full_name       text
avatar_url      text
created_at      timestamptz (auto)
updated_at      timestamptz (auto)
```

**Purpose**: Store user profile information  
**Why separate from auth.users**: Allows additional user data without modifying Supabase auth table

#### 2. **tasks** table
```sql
id              uuid (PK) - Auto-generated
user_id         uuid (FK) - References profiles(id)
title           text (NOT NULL)
description     text
status          text - Values: 'todo' | 'in_progress' | 'completed'
priority        text - Values: 'low' | 'medium' | 'high'
due_date        date
tags            text[] - Array of strings
created_at      timestamptz (auto)
updated_at      timestamptz (auto)
```

**Purpose**: Store user's tasks  
**Constraints**: Status and priority are limited to specific values

### Security: Row Level Security (RLS)

RLS is a database feature that enforces row-level access control.

#### profiles table policies:
```sql
SELECT - auth.uid() = id              ← User can only see their own profile
INSERT - auth.uid() = id              ← User can only create their own profile
UPDATE - auth.uid() = id              ← User can only update their own profile
```

#### tasks table policies:
```sql
SELECT - auth.uid() = user_id         ← User can only see their own tasks
INSERT - auth.uid() = user_id         ← User can only create their own tasks
UPDATE - auth.uid() = user_id         ← User can only update their own tasks
DELETE - auth.uid() = user_id         ← User can only delete their own tasks
```

**Why RLS?**: Even if someone gets a user's ID, they can't access another user's data at the database level. It's a critical security feature.

### Indexes:
```sql
tasks_user_id_idx       - Fast queries by user
tasks_status_idx        - Fast filtering by status
tasks_priority_idx      - Fast filtering by priority
tasks_created_at_idx    - Fast sorting by creation date
```

**Why indexes?**: Databases are slow when scanning every row. Indexes speed up queries.

### Triggers:
```sql
tasks_updated_at        - Auto-updates 'updated_at' when task is modified
profiles_updated_at     - Auto-updates 'updated_at' when profile is modified
```

**Why triggers?**: Automatically maintain timestamp accuracy without manual updates in code.

---

## Authentication Flow

### Sign Up Flow:
```
User enters email, password, full name
              ↓
Form validation (email valid, password >= 6 chars)
              ↓
Call authContext.signUp(email, password, fullName)
              ↓
Supabase creates new user in auth.users table
              ↓
Create new profile row with user ID
              ↓
On success: Redirect to Dashboard (automatic via session listener)
On error: Show error message
```

### Sign In Flow:
```
User enters email, password
              ↓
Form validation
              ↓
Call authContext.signIn(email, password)
              ↓
Supabase validates credentials
              ↓
If valid: Generate JWT token, create session
              ↓
Session listener detects change → user state updated
              ↓
Fetch user profile from database
              ↓
Redirect to Dashboard
```

### JWT Token (What is it?):
- **JWT** = JSON Web Token
- It's a signed token that proves the user is authenticated
- Stored in browser (session management)
- Sent with every request to Supabase to prove identity
- Supabase verifies token, then applies RLS policies

### Sign Out Flow:
```
User clicks Sign Out
              ↓
Call authContext.signOut()
              ↓
Supabase invalidates session
              ↓
Session listener detects logout
              ↓
User state → null
              ↓
Redirect to AuthPage
```

### Session Persistence:
```
User opens app → Check if session exists
              ↓
If session exists: Set user state, fetch profile
              ↓
If no session: Show login page
              ↓
Even after page refresh: User stays logged in (session recovered)
```

---

## How Features Work

### 1. Creating a Task

**Step-by-step:**

```tsx
// 1. User fills form in TaskForm component
{
  title: "Buy groceries",
  description: "Milk, eggs, bread",
  status: "todo",
  priority: "high",
  due_date: "2026-04-26",
  tags: "shopping, urgent"
}

// 2. User clicks "Create" button
// 3. handleCreate() calls useTasks.createTask(formData)

// 4. In useTasks hook:
const createTask = async (formData) => {
  // Parse tags from string to array
  const tags = formData.tags.split(',').map(t => t.trim());
  
  // Insert into database
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,          // Current user
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      due_date: formData.due_date || null,
      tags: tags
    })
    .select()                     // Return inserted row
    .single();                    // Expect single row
  
  // 5. If successful, update local state
  if (!error && data) {
    setTasks(prev => [data, ...prev]);  // Add to top of list
  }
}

// 6. Component re-renders, user sees new task
```

**Key Points:**
- `user_id` is automatically set from current user (via AuthContext)
- Tags are parsed from comma-separated string to array
- `due_date` is optional (nullable)
- Database returns new task with auto-generated ID
- New task added to top of local array for instant feedback

---

### 2. Editing a Task

**Step-by-step:**

```tsx
// 1. User clicks "Edit" on TaskCard
// 2. Pass task to TaskForm component
// 3. Form pre-fills with existing task data

const updateTask = async (id, formData) => {
  // Only update fields that changed
  const updateData = {};
  if (formData.title !== undefined) updateData.title = formData.title;
  if (formData.status !== undefined) updateData.status = formData.status;
  // ... etc for other fields
  
  // Update in database
  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', id)                 // WHERE id = id
    .select()
    .single();
  
  // Update local state
  if (!error && data) {
    setTasks(prev => prev.map(t => 
      t.id === id ? data : t      // Replace old task with new
    ));
  }
}

// 4. Database updates record
// 5. Trigger automatically updates 'updated_at' field
// 6. UI updates with new values
```

**Key Points:**
- Only changed fields are sent to database (optimization)
- ID is used to identify which row to update
- Local state updates immediately (optimistic update)
- Database triggers automatically handle `updated_at`

---

### 3. Deleting a Task

**Step-by-step:**

```tsx
const deleteTask = async (id) => {
  // Delete from database
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);                // WHERE id = id
  
  // Update local state
  if (!error) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }
}

// 1. User clicks delete button
// 2. Task removed from database
// 3. Task removed from local state
// 4. UI updates (task disappears from list)
```

---

### 4. Filtering Tasks

**How it works in useTasks hook:**

```tsx
// Filter state in useTasks
const [filters, setFilters] = useState({
  status: 'all',           // 'all' | 'todo' | 'in_progress' | 'completed'
  priority: 'all',         // 'all' | 'low' | 'medium' | 'high'
  search: ''               // Any text string
});

// Filtered array - computed from all tasks
const filteredTasks = tasks.filter(task => {
  // Check status filter
  if (filters.status !== 'all' && task.status !== filters.status) 
    return false;
  
  // Check priority filter
  if (filters.priority !== 'all' && task.priority !== filters.priority) 
    return false;
  
  // Check search filter (searches title, description, tags)
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const matchesSearch = 
      task.title.toLowerCase().includes(q) ||
      task.description.toLowerCase().includes(q) ||
      task.tags.some(tag => tag.toLowerCase().includes(q));
    if (!matchesSearch) return false;
  }
  
  return true;  // Passes all filters
});
```

**Key Points:**
- Filters are applied on the client (all tasks already fetched)
- Multiple filters work together (AND logic)
- Search works across title, description, and tags
- No database query needed when filtering

---

### 5. Task Statistics

**How stats are calculated:**

```tsx
// In useTasks hook
const stats = {
  total: tasks.length,
  todo: tasks.filter(t => t.status === 'todo').length,
  in_progress: tasks.filter(t => t.status === 'in_progress').length,
  completed: tasks.filter(t => t.status === 'completed').length,
};

// Displayed in sidebar
// Example: "3 of 7 tasks done" = stats.completed / stats.total
```

---

## State Management

### React Context vs Redux

This project uses **React Context** (not Redux) for state management:

```
┌────────────────────────────────┐
│   AuthContext (Global State)   │
├────────────────────────────────┤
│ - user                         │
│ - session                      │
│ - profile                      │
│ - loading                      │
└────────────────────────────────┘
         ↓
    Provided to all components via Provider

┌────────────────────────────────┐
│ useTasks Hook (Custom Hook)    │
├────────────────────────────────┤
│ - tasks (local state)          │
│ - filters (local state)        │
│ - loading (local state)        │
│ - Functions (CRUD operations)  │
└────────────────────────────────┘
         ↓
    Used in Dashboard component
```

### Why Context instead of Redux?

| Context | Redux |
|---------|-------|
| Simpler, less boilerplate | More complex setup |
| Built into React | External library |
| Good for moderate complexity | Better for large apps |
| Good for authentication state | Good for complex state trees |

**For this project**: Context is sufficient because:
- Auth state is global (shared by all components)
- Task state is only used in Dashboard
- No complex state transformations needed

---

## Interview Q&A

### Q1: How is this a "MERN" app? I see React, but where's Node/Express/MongoDB?

**Answer:**
Good question! This is actually **NOT a traditional MERN** stack. The project uses:
- **React** ✅ (Frontend framework)
- **TypeScript** (Type safety)
- ❌ **Node/Express** (replaced with Supabase)
- ❌ **MongoDB** (replaced with PostgreSQL)

Instead, it uses **Supabase** as a Backend-as-a-Service (BaaS):
- Provides authentication (instead of custom Node auth)
- Provides PostgreSQL database (instead of MongoDB)
- Handles API endpoints automatically
- Handles real-time subscriptions
- Handles security (RLS policies)

So it's more accurate to call it a **React + Supabase** project, which is actually **more modern** than traditional MERN because:
- No need to build and deploy your own backend
- Automatic scalability
- Built-in security features
- Faster development

---

### Q2: How does authentication work? Where are passwords stored?

**Answer:**
Passwords are **NOT stored in the database**. Here's how it works:

1. User submits email + password to Supabase
2. Supabase hashes the password using bcrypt
3. Hashed password stored in `auth.users` table (separate from our `profiles` table)
4. Supabase generates JWT token
5. Frontend stores JWT token (in browser session)
6. Every request to Supabase includes JWT token
7. Supabase verifies token and applies RLS policies

**Key Security Points:**
- Passwords never sent to frontend
- Passwords hashed server-side
- JWT tokens are time-limited
- RLS policies prevent unauthorized data access

---

### Q3: What is RLS (Row Level Security)?

**Answer:**
RLS is a PostgreSQL feature that enforces access control at the **row level** in the database.

**Without RLS:**
```sql
SELECT * FROM tasks WHERE id = 'task-123'  ← Anyone can query any task
```

**With RLS:**
```sql
SELECT * FROM tasks WHERE id = 'task-123' AND auth.uid() = user_id
      -- This is automatically applied by Supabase/PostgreSQL
```

Example:
- User 1 tries to access Task owned by User 2
- Database checks: `auth.uid() = user_id`
- `123 = 456`? No! ❌ Access denied
- Returns error: "No rows returned"

**Why it matters:**
- Security at database level (not just application level)
- Even if there's a bug in your app, data stays protected
- Prevents unauthorized access

---

### Q4: Why use TypeScript instead of JavaScript?

**Answer:**
TypeScript adds **static type checking**:

```tsx
// JavaScript (error found at runtime)
function createTask(title) {
  return { title, status: 'todo' };
}
createTask(123);  // Bug! Should be string, but accepted

// TypeScript (error found before running)
function createTask(title: string): Task {
  return { title, status: 'todo' };
}
createTask(123);  // ❌ Error: Argument of type 'number' is not assignable to 'string'
```

**Benefits:**
- Catch bugs before runtime
- Better IDE autocomplete
- Self-documenting code (types are documentation)
- Easier refactoring

---

### Q5: How do you handle loading states?

**Answer:**
```tsx
// In AuthContext
const [loading, setLoading] = useState(true);

useEffect(() => {
  const initAuth = async () => {
    const session = await supabase.auth.getSession();
    setLoading(false);  // Done loading
  };
  initAuth();
}, []);

// In App.tsx
if (loading) return <LoadingScreen />;
return user ? <Dashboard /> : <AuthPage />;

// In useTasks
const [loading, setLoading] = useState(true);
const fetchTasks = async () => {
  setLoading(true);
  const { data } = await supabase.from('tasks').select();
  setLoading(false);
};
```

**Pattern:**
1. Show loading state (`loading = true`)
2. Make async request
3. Update state with data
4. Hide loading state (`loading = false`)
5. UI shows data

---

### Q6: How does real-time sync work in Supabase?

**Note**: Current project fetches tasks once on load. But Supabase supports real-time subscriptions:

```tsx
// Example (not in current code, but how it would work)
useEffect(() => {
  const subscription = supabase
    .from('tasks')
    .on('*', payload => {
      // Called when any task changes (insert/update/delete)
      if (payload.eventType === 'INSERT') {
        setTasks(prev => [payload.new, ...prev]);
      }
    })
    .subscribe();
  
  return () => subscription.unsubscribe();
}, []);
```

This would keep tasks in sync across browser tabs/devices automatically.

---

### Q7: What is an optimistic update?

**Answer:**
Optimistic update = Update UI immediately, then sync with server.

```tsx
// Without optimistic update
setLoading(true);
const { data, error } = await supabase.from('tasks').insert(newTask);
if (!error) {
  setTasks(prev => [data, ...prev]);
  setLoading(false);
}
// User waits for server response

// With optimistic update (current code)
setTasks(prev => [newTask, ...prev]);  // Update immediately
const { data, error } = await supabase.from('tasks').insert(newTask);
if (error) {
  setTasks(prev => prev.filter(t => t.id !== newTask.id));  // Revert
}
// User sees task immediately (feels fast)
```

**Benefits:**
- Feels instant to user
- Better UX
- Network latency hidden

---

### Q8: How would you add a feature to share tasks with other users?

**Answer:**
Current design: Tasks are **private** (only user can see their own).

To add **sharing**:

1. Create new table:
```sql
CREATE TABLE task_shares (
  id uuid PRIMARY KEY,
  task_id uuid REFERENCES tasks(id),
  shared_with_user_id uuid REFERENCES profiles(id),
  permission text ('view' | 'edit'),
  created_at timestamptz
);
```

2. Update RLS policy:
```sql
-- Users can see their own tasks OR tasks shared with them
CREATE POLICY "Users can view shared tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM task_shares 
      WHERE task_id = id AND shared_with_user_id = auth.uid()
    )
  );
```

3. Add share button in UI:
```tsx
const shareTask = (taskId, email, permission) => {
  // Find user by email
  // Insert into task_shares table
};
```

---

### Q9: How would you add task due date notifications?

**Answer:**
Options:

**Option 1: Client-side (Browser)**
```tsx
useEffect(() => {
  const checkDueDates = () => {
    tasks.forEach(task => {
      const dueDateObj = new Date(task.due_date);
      const today = new Date();
      if (dueDateObj.toDateString() === today.toDateString()) {
        // Notify user
        new Notification(`Task due: ${task.title}`);
      }
    });
  };
  
  const interval = setInterval(checkDueDates, 60000);  // Check every minute
  return () => clearInterval(interval);
}, [tasks]);
```

**Option 2: Server-side (Better)**
- Use a cron job (e.g., AWS Lambda, Supabase Edge Functions)
- Checks tasks every hour
- Sends email notifications
- More reliable (doesn't depend on user having app open)

---

### Q10: How would you add dark/light theme switching?

**Answer:**
```tsx
// Create ThemeContext
const ThemeContext = createContext('dark');

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// In component
const { theme, setTheme } = useContext(ThemeContext);

// Toggle button
<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? '☀️' : '🌙'}
</button>
```

With Tailwind, you can use `dark:` prefix for styles:
```tsx
<div className="bg-white dark:bg-slate-900">
  Light mode: white, Dark mode: slate-900
</div>
```

---

## Key Concepts

### 1. **React Hooks**

**useState**: Manage component-level state
```tsx
const [tasks, setTasks] = useState([]);
setTasks([...tasks, newTask]);  // Update state
```

**useEffect**: Side effects (data fetching, subscriptions)
```tsx
useEffect(() => {
  fetchTasks();  // Run on component mount
}, []);  // Empty dependency array = run once

useEffect(() => {
  console.log(tasks);  // Run whenever tasks changes
}, [tasks]);
```

**useCallback**: Memoize functions
```tsx
const fetchTasks = useCallback(async () => {
  // Only recreated if dependencies change
}, [user]);
```

**useContext**: Access context values
```tsx
const { user, signOut } = useAuth();
```

---

### 2. **TypeScript Interfaces**

Define shape of data:
```tsx
interface Task {
  id: string;
  user_id: string;
  title: string;
  status: TaskStatus;
  // ...
}

type TaskStatus = 'todo' | 'in_progress' | 'completed';
// TaskStatus can ONLY be one of these values
```

Benefits:
- Type checking
- IDE autocomplete
- Documentation
- Refactoring safety

---

### 3. **Tailwind CSS**

Utility-first CSS framework:
```tsx
<div className="flex items-center gap-3 p-4 bg-blue-500 rounded-lg">
  // flex = display: flex
  // items-center = align-items: center
  // gap-3 = gap: 0.75rem
  // p-4 = padding: 1rem
  // bg-blue-500 = background-color: #3b82f6
  // rounded-lg = border-radius: 0.5rem
</div>
```

Benefits:
- Faster development
- Consistent design system
- Smaller CSS bundle
- No naming conflicts

---

### 4. **Custom Hooks**

Reusable logic:
```tsx
// Extract logic into hook
function useTasks() {
  const [tasks, setTasks] = useState([]);
  
  const createTask = async (data) => { /* ... */ };
  const updateTask = async (id, data) => { /* ... */ };
  const deleteTask = async (id) => { /* ... */ };
  
  return { tasks, createTask, updateTask, deleteTask };
}

// Use in multiple components
const { tasks, createTask } = useTasks();
```

Benefits:
- DRY (Don't Repeat Yourself)
- Logic reuse
- Cleaner components

---

### 5. **Context API**

Global state without prop drilling:

```tsx
// Without Context (prop drilling)
<Parent user={user}>
  <Child user={user}>
    <GrandChild user={user} />  {/* Many props passed down */}
  </Child>
</Parent>

// With Context
<AuthProvider>
  <Parent>
    <Child>
      <GrandChild />  {/* Access user anywhere with useAuth() */}
    </Child>
  </Parent>
</AuthProvider>
```

---

### 6. **Async/Await**

Handle asynchronous operations:
```tsx
async function fetchTasks() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*');
    
    if (error) throw error;
    setTasks(data);
  } catch (err) {
    setError(err.message);
  }
}
```

- `await`: Wait for promise to resolve
- `try/catch`: Handle errors
- Cleaner than `.then()` chains

---

### 7. **Array Methods**

Operations on task arrays:
```tsx
// Map: Transform each item
tasks.map(t => t.title)  // [title1, title2, ...]

// Filter: Keep items matching condition
tasks.filter(t => t.status === 'completed')

// Find: Get first matching item
tasks.find(t => t.id === 'abc')

// Some: Check if any item matches
tasks.some(t => t.priority === 'high')

// Reduce: Combine into single value
tasks.reduce((total, t) => total + 1, 0)  // Count
```

---

### 8. **Conditional Rendering**

Show/hide elements:
```tsx
// If/else
{user ? <Dashboard /> : <AuthPage />}

// Ternary
{loading ? <Spinner /> : <Content />}

// &&
{tasks.length > 0 && <TaskList />}

// Switch
{status === 'todo' && <TodoIcon />}
{status === 'in_progress' && <ProgressIcon />}
```

---

### 9. **Event Handling**

Respond to user interactions:
```tsx
// Click
<button onClick={() => deleteTask(id)}>Delete</button>

// Form submit
<form onSubmit={handleSubmit}>...</form>

// Input change
<input onChange={e => setTitle(e.target.value)} />

// Double click
<div onDoubleClick={handleEdit}>...</div>
```

---

### 10. **Responsive Design**

Mobile-first with Tailwind:
```tsx
{/* Hidden on mobile, visible on large screens */}
<aside className="hidden lg:flex">Sidebar</aside>

{/* Different sizes */}
<h1 className="text-xl md:text-2xl lg:text-3xl">Title</h1>

{/* Conditional state for mobile menu */}
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

---

## Summary - How to Explain This Project in an Interview

### **Elevator Pitch (30 seconds)**
"I built TaskFlow, a modern web application for managing tasks. It's built with React and TypeScript on the frontend, and uses Supabase for the backend. Users can sign up, create tasks with priority and due dates, filter and search them, and track progress. The app uses real-time authentication and has RLS policies to ensure data security."

### **Technical Highlights (2 minutes)**
1. **Frontend**: React with TypeScript for type safety
2. **Styling**: Tailwind CSS for responsive design
3. **Backend**: Supabase (managed PostgreSQL + Auth)
4. **Authentication**: JWT-based with session persistence
5. **Security**: Row Level Security policies at database level
6. **State Management**: React Context + Custom Hooks
7. **Data Validation**: TypeScript interfaces + form validation

### **Architecture Explanation (3 minutes)**
- **Pages**: AuthPage (login/signup), Dashboard (main app)
- **Components**: TaskCard, TaskForm, TaskFilters
- **Context**: AuthContext for global auth state
- **Hooks**: useTasks for CRUD operations and filtering
- **Database**: Two tables (profiles, tasks) with RLS policies

### **Challenges Overcome**
1. Managing async operations (loading states)
2. Real-time filtering on client side
3. Optimistic updates for better UX
4. Implementing RLS for data security

### **What You'd Do Differently (Optional)**
1. Add real-time subscriptions for multi-device sync
2. Implement notifications for due dates
3. Add task categories/projects
4. Add team collaboration features
5. Add offline support with service workers

---

## Running the Project

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_ANON_KEY=your_key

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

**Good luck with your interviews! 🚀**

Remember:
- Understand the **why** behind each decision
- Be ready to explain trade-offs
- Practice explaining it out loud
- Think about edge cases and improvements
- Ask questions during interviews!
