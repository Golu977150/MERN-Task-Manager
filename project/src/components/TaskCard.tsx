import { useState } from 'react';
import { Calendar, Tag, Trash2, CreditCard as Edit2, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { Task, TaskStatus } from '../lib/supabase';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const priorityConfig = {
  low: { label: 'Low', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  medium: { label: 'Medium', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  high: { label: 'High', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
};

const statusConfig = {
  todo: { icon: Circle, color: 'text-slate-400', next: 'in_progress' as TaskStatus },
  in_progress: { icon: Clock, color: 'text-blue-400', next: 'completed' as TaskStatus },
  completed: { icon: CheckCircle2, color: 'text-emerald-400', next: 'todo' as TaskStatus },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, overdue: true };
  if (diff === 0) return { label: 'Due today', overdue: false, today: true };
  if (diff === 1) return { label: 'Due tomorrow', overdue: false };
  return { label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), overdue: false };
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [deleting, setDeleting] = useState(false);
  const priority = priorityConfig[task.priority];
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  const dateInfo = task.due_date ? formatDate(task.due_date) : null;

  async function handleDelete() {
    setDeleting(true);
    await onDelete(task.id);
  }

  return (
    <div className={`group bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 ${task.status === 'completed' ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Status toggle */}
        <button
          onClick={() => onStatusChange(task.id, status.next)}
          className={`mt-0.5 flex-shrink-0 ${status.color} hover:scale-110 transition-transform`}
          title="Change status"
        >
          <StatusIcon className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={`font-medium text-sm leading-snug ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-slate-400 text-xs mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {/* Priority badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${priority.bg} ${priority.text} ${priority.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>

            {/* Due date */}
            {dateInfo && (
              <span className={`inline-flex items-center gap-1 text-xs ${dateInfo.overdue ? 'text-red-400' : dateInfo.today ? 'text-amber-400' : 'text-slate-400'}`}>
                {dateInfo.overdue ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                {dateInfo.label}
              </span>
            )}
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <Tag className="w-3 h-3 text-slate-500" />
              {task.tags.slice(0, 3).map(tag => (
                <span key={tag} className="bg-slate-700/60 text-slate-400 text-xs px-1.5 py-0.5 rounded-md">
                  {tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="text-slate-500 text-xs">+{task.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
