import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export const StatCard = ({ title, value, icon: Icon, trend, status = 'info' }: StatCardProps) => {
  const statusColors = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-destructive',
    info: 'text-primary',
  };

  const glowClass = {
    success: 'glow-success',
    warning: '',
    error: 'glow-error',
    info: 'glow-primary',
  };

  return (
    <Card className={glowClass[status]}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            )}
          </div>
          <div className={`p-3 rounded-full bg-${status}/10`}>
            <Icon className={`h-6 w-6 ${statusColors[status]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
