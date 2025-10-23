import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Activity, AlertCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  serviceId: string;
  targetUrl: string;
  status: string;
}

interface Log {
  id: string;
  level: string;
  message: string;
  timestamp: string;
  serviceId: string;
}

interface CircuitEvent {
  state: string;
  timestamp: string;
}

const ServiceDetailContent = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [recentEvents, setRecentEvents] = useState<CircuitEvent[]>([]);
  const { on, off } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    if (serviceId) {
      fetchService();
      fetchLogs();
    }
  }, [serviceId]);

  useEffect(() => {
    const handleCircuitChange = (event: any) => {
      if (event.serviceId === serviceId) {
        setRecentEvents((prev) => [
          { state: event.state, timestamp: new Date().toISOString() },
          ...prev.slice(0, 9),
        ]);
      }
    };

    on('circuit:state-change', handleCircuitChange);

    return () => {
      off('circuit:state-change', handleCircuitChange);
    };
  }, [serviceId, on, off]);

  const fetchService = async () => {
    try {
      const response = await api.get(`/services/${serviceId}`);
      setService(response.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to fetch service',
        description: 'Could not load service details.',
      });
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await api.get(`/logs?serviceId=${serviceId}`);
      setLogs(response.data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'destructive';
      case 'warn':
        return 'outline';
      case 'info':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (!service) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/services')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{service.name}</h2>
            <p className="text-sm text-muted-foreground font-mono">{service.serviceId}</p>
          </div>
          <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'}>
            {service.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Target URL</span>
                <span className="font-mono text-sm">{service.targetUrl}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'}>
                  {service.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Recent Circuit Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent events</p>
              ) : (
                <div className="space-y-2">
                  {recentEvents.map((event, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                      <Badge variant={event.state === 'OPEN' ? 'destructive' : 'default'}>
                        {event.state}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No logs available for this service.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getLevelBadgeVariant(log.level)}>
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.message}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export const ServiceDetail = () => {
  return (
    <AuthGuard>
      <ServiceDetailContent />
    </AuthGuard>
  );
};

export default ServiceDetail;
