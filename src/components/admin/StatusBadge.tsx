import { CheckCircle2, Clock, XCircle } from 'lucide-react';

const STATUS_STYLES: Record<
  string,
  { label: string; className: string; Icon: React.ComponentType<{ size?: number | string; className?: string }> }
> = {
  pending: {
    label: 'Pending',
    className: 'border-[#c2850c] bg-[#fef0d8] text-[#855b06]',
    Icon: Clock,
  },
  approved: {
    label: 'Approved',
    className: 'border-[#2e8540] bg-[#e7f4e4] text-[#1a4480]',
    Icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    className: 'border-[#d83933] bg-[#fde0de] text-[#8b0000]',
    Icon: XCircle,
  },
};

export default function StatusBadge({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' }) {
  const { label, className, Icon } = STATUS_STYLES[status] ?? STATUS_STYLES.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${className} ${
        size === 'sm' ? 'px-2 py-0.5 text-[0.68rem]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Icon size={size === 'sm' ? 11 : 13} />
      {label}
    </span>
  );
}
