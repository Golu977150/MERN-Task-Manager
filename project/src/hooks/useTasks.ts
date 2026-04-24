import { useState, useEffect, useCallback } from 'react';
import { supabase, Task, TaskFormData, TaskStatus, TaskPriority } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface TaskFilters {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  search: string;
}

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFilters>({ status: 'all', priority: 'all', search: '' });

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (!error && data) setTasks(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function createTask(formData: TaskFormData) {
    if (!user) return { error: 'Not authenticated' };
    const tags = formData.tags
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const { data, error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      due_date: formData.due_date || null,
      tags,
    }).select().single();

    if (!error && data) setTasks(prev => [data, ...prev]);
    return { error: error?.message ?? null };
  }

  async function updateTask(id: string, formData: Partial<TaskFormData & { status: TaskStatus }>) {
    const tags = typeof formData.tags === 'string'
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : undefined;

    const updateData: Partial<Task> = {
      ...(formData.title !== undefined && { title: formData.title }),
      ...(formData.description !== undefined && { description: formData.description }),
      ...(formData.status !== undefined && { status: formData.status }),
      ...(formData.priority !== undefined && { priority: formData.priority }),
      ...(formData.due_date !== undefined && { due_date: formData.due_date || null }),
      ...(tags !== undefined && { tags }),
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setTasks(prev => prev.map(t => t.id === id ? data : t));
    }
    return { error: error?.message ?? null };
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) setTasks(prev => prev.filter(t => t.id !== id));
    return { error: error?.message ?? null };
  }

  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        task.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return { tasks: filteredTasks, allTasks: tasks, loading, filters, setFilters, createTask, updateTask, deleteTask, refetch: fetchTasks, stats };
}
