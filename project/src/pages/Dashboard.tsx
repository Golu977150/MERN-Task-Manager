import { useState } from 'react';
import {
  Plus, CheckSquare, LogOut, LayoutGrid, List,
  CheckCircle2, Clock, Circle, TrendingUp, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskFiltersBar from '../components/TaskFilters';
import { Task, TaskStatus, TaskFormData } from '../lib/supabase';

type ViewMode = 'list' | 'grid';

export default function Dashboard() {
  const { profile, signOut } = useAuth();
  const { tasks, loading, filters, setFilters, createTask, updateTask, deleteTask, stats } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showUserMenu, setShowUserMenu] = useState(false);

  async function handleCreate(data: TaskFormData) {
    return createTask(data);
  }

  async function handleEdit(data: TaskFormData) {
    if (!editingTask) return { error: 'No task selected' };
    return updateTask(editingTask.id, data);
  }

  async function handleStatusChange(id: string, status: TaskStatus) {
    await updateTask(id, { status });
  }

  async function handleDelete(id: string) {
    await deleteTask(id);
  }

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar + main layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-slate-900/80 border-r border-slate-800 p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/30">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">TaskFlow</span>
          </div>

          {/* Stats */}
          <div className="space-y-2 mb-8">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">Overview</p>
            {[
              { icon: Circle, label: 'To Do', count: stats.todo, color: 'text-slate-400', bg: 'bg-slate-700' },
              { icon: Clock, label: 'In Progress', count: stats.in_progress, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { icon: CheckCircle2, label: 'Completed', count: stats.completed, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            ].map(({ icon: Icon, label, count, color, bg }) => (
              <button
                key={label}
                onClick={() => setFilters({ ...filters, status: label.toLowerCase().replace(' ', '_') as TaskStatus | 'all' })}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-800 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
                </div>
                <span className={`text-sm font-semibold ${color}`}>{count}</span>
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="bg-slate-800/60 rounded-xl p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-xs">Completion</span>
              <span className="text-white text-sm font-bold">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-slate-500 text-xs mt-2">{stats.completed} of {stats.total} tasks done</p>
          </div>

          <div className="mt-auto">
            {/* User */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                {profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{profile?.full_name || 'User'}</p>
                <p className="text-slate-500 text-xs truncate">@{profile?.username}</p>
              </div>
              <button onClick={signOut} className="text-slate-500 hover:text-red-400 transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Top nav (mobile) */}
          <header className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">TaskFlow</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                  {profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-10 bg-slate-800 border border-slate-700 rounded-xl p-2 shadow-xl min-w-[140px]">
                    <button onClick={() => { signOut(); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-lg transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="p-4 lg:p-8 max-w-4xl mx-auto">
            {/* Page header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
                  <span className="text-blue-400">{profile?.full_name?.split(' ')[0] || 'there'}</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  {stats.in_progress > 0
                    ? `You have ${stats.in_progress} task${stats.in_progress > 1 ? 's' : ''} in progress.`
                    : stats.todo > 0
                    ? `You have ${stats.todo} task${stats.todo > 1 ? 's' : ''} to do.`
                    : 'All caught up! Great work.'}
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-3">
                {/* View toggle */}
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 gap-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-blue-500/30 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Task
                </button>
              </div>
            </div>

            {/* Stats row (mobile) */}
            <div className="grid grid-cols-3 gap-3 mb-6 lg:hidden">
              {[
                { label: 'To Do', count: stats.todo, color: 'text-slate-300' },
                { label: 'In Progress', count: stats.in_progress, color: 'text-blue-400' },
                { label: 'Completed', count: stats.completed, color: 'text-emerald-400' },
              ].map(({ label, count, color }) => (
                <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-center">
                  <p className={`text-xl font-bold ${color}`}>{count}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Summary cards (desktop) */}
            <div className="hidden lg:grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Tasks', count: stats.total, icon: TrendingUp, color: 'text-white', iconBg: 'bg-slate-700', iconColor: 'text-slate-300' },
                { label: 'To Do', count: stats.todo, icon: Circle, color: 'text-white', iconBg: 'bg-slate-700', iconColor: 'text-slate-400' },
                { label: 'In Progress', count: stats.in_progress, icon: Clock, color: 'text-blue-400', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
                { label: 'Completed', count: stats.completed, icon: CheckCircle2, color: 'text-emerald-400', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
              ].map(({ label, count, icon: Icon, color, iconBg, iconColor }) => (
                <div key={label} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-slate-400 text-xs font-medium">{label}</p>
                    <div className={`w-7 h-7 ${iconBg} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                    </div>
                  </div>
                  <p className={`text-2xl font-bold ${color}`}>{count}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="mb-5">
              <TaskFiltersBar filters={filters} onChange={setFilters} />
            </div>

            {/* Tasks */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm">Loading tasks...</p>
                </div>
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                  <CheckSquare className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-white font-semibold mb-1">
                  {filters.status !== 'all' || filters.priority !== 'all' || filters.search
                    ? 'No matching tasks'
                    : 'No tasks yet'}
                </h3>
                <p className="text-slate-500 text-sm mb-4">
                  {filters.status !== 'all' || filters.priority !== 'all' || filters.search
                    ? 'Try adjusting your filters'
                    : 'Create your first task to get started'}
                </p>
                {!(filters.status !== 'all' || filters.priority !== 'all' || filters.search) && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Task
                  </button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}>
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={task => { setEditingTask(task); }}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* FAB mobile */}
      <button
        onClick={() => setShowForm(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-20"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      {showForm && (
        <TaskForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}
      {editingTask && (
        <TaskForm task={editingTask} onSubmit={handleEdit} onClose={() => setEditingTask(null)} />
      )}
    </div>
  );
}
