import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

export function DatabaseStatus() {
  const [status, setStatus] = useState<{mode: string; mongoConnected: boolean; message: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        if (data.success) {
          setStatus(data.data);
        }
      } catch (error) {
        console.error('Failed to check database status:', error);
        setStatus({
          mode: 'Error',
          mongoConnected: false,
          message: 'Unable to check database status'
        });
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return <span className="text-muted-foreground">Checking...</span>;
  }

  if (!status) {
    return <span className="text-red-500">Error</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={status.mongoConnected ? "default" : "secondary"}>
        {status.mode}
      </Badge>
      <span className="text-xs text-muted-foreground">
        {status.mongoConnected ? "✅ Database connected" : "🔄 Using fallback storage"}
      </span>
    </div>
  );
}
