import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/AuthGuard';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { Server, Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  serviceId: string;
  status: string;
}

interface CircuitEvent {
  id: string;
  serviceId: string;
  serviceName: string;
  state: string;
  timestamp: string;
}

const DashboardContent = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [events, setEvents] = useState<CircuitEvent[]>([]);
  const { on, off } = useSocket();

  useEffect(() => {
    fetchServices();

    const handleCircuitChange = (event: CircuitEvent) => {
      setEvents((prev) => [
        { ...event, id: Date.now().toString(), timestamp: new Date().toISOString() },
        ...prev.slice(0, 9),
      ]);
    };

    on('circuit:state-change', handleCircuitChange);

    return () => {
      off('circuit:state-change', handleCircuitChange);
    };
  }, [on, off]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const healthyServices = services.filter((s) => s.status === 'healthy').length;
  const totalServices = services.length;
  const openCircuits = services.filter((s) => s.status === 'circuit-open').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Services"
            value={totalServices}
            icon={Server}
            status="info"
          />
          <StatCard
            title="Healthy Services"
            value={healthyServices}
            icon={CheckCircle}
            status="success"
          />
          <StatCard
            title="Open Circuits"
            value={openCircuits}
            icon={AlertCircle}
            status={openCircuits > 0 ? 'error' : 'success'}
          />
          <StatCard
            title="Active Monitors"
            value={totalServices}
            icon={Activity}
            status="info"
          />
        </div>

        {/* Live Event Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary animate-pulse" />
              Live Event Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No recent events. Waiting for circuit state changes...
              </p>
            ) : (
              <div className="space-y-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          event.state === 'OPEN'
                            ? 'destructive'
                            : event.state === 'HALF_OPEN'
                            ? 'outline'
                            : 'default'
                        }
                      >
                        {event.state}
                      </Badge>
                      <span className="font-medium">{event.serviceName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Health Overview */}
        <Card>
          <CardHeader>
            <CardTitle>System Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Health</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success transition-all duration-300"
                      style={{
                        width: `${totalServices > 0 ? (healthyServices / totalServices) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {totalServices > 0
                      ? Math.round((healthyServices / totalServices) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export const Dashboard = () => {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
};

export default Dashboard;
