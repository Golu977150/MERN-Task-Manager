import { Search, X } from 'lucide-react';
import { TaskFilters } from '../hooks/useTasks';
import { TaskStatus, TaskPriority } from '../lib/supabase';

interface TaskFiltersProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

const statusOptions: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const priorityOptions: { value: TaskPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export default function TaskFiltersBar({ filters, onChange }: TaskFiltersProps) {
  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.search;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          placeholder="Search tasks, tags..."
          className="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700 rounded-xl p-1">
        {statusOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange({ ...filters, status: opt.value })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              filters.status === opt.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Priority filter */}
      <select
        value={filters.priority}
        onChange={e => onChange({ ...filters, priority: e.target.value as TaskPriority | 'all' })}
        className="bg-slate-800/60 border border-slate-700 text-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      >
        {priorityOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={() => onChange({ status: 'all', priority: 'all', search: '' })}
          className="flex items-center gap-1.5 px-3 py-2.5 text-slate-400 hover:text-white bg-slate-800/60 border border-slate-700 hover:border-slate-600 rounded-xl text-sm transition-all whitespace-nowrap"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}
