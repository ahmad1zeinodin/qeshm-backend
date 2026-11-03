const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-stone-100 text-stone-600',
  disputed: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'در انتظار',
  accepted: 'پذیرفته شده',
  in_progress: 'در حال انجام',
  completed: 'انجام شده',
  cancelled: 'لغو شده',
  disputed: 'اختلاف',
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  const fallback = status.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const label = statusLabels[status] || fallback;
  return <span className={`badge ${statusColors[status] || 'bg-stone-100 text-stone-700'}`}>{label}</span>;
}