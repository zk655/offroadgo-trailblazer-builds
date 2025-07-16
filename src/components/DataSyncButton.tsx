import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, Shield, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DataSyncButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const { toast } = useToast();

  const syncData = async () => {
    setIsLoading(true);
    try {
      // Run both sync functions in parallel
      const [insuranceResult, rallyResult] = await Promise.all([
        supabase.functions.invoke('sync-insurance-data'),
        supabase.functions.invoke('sync-rally-data')
      ]);

      if (insuranceResult.error) {
        console.error('Insurance sync error:', insuranceResult.error);
        throw new Error('Failed to sync insurance data');
      }

      if (rallyResult.error) {
        console.error('Rally sync error:', rallyResult.error);
        throw new Error('Failed to sync rally data');
      }

      setLastSync(new Date().toLocaleString());
      toast({
        title: "Data Synced Successfully!",
        description: "Insurance quotes and rally events have been updated with live data.",
      });

      // Refresh the page to show new data
      window.location.reload();
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Failed",
        description: "There was an error syncing the data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Database className="w-5 h-5 text-primary" />
          <span className="font-medium text-sm">Live Data Sync</span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Insurance
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            Rally Events
          </Badge>
        </div>

        <Button 
          onClick={syncData} 
          disabled={isLoading}
          size="sm" 
          className="w-full"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Syncing...' : 'Sync Live Data'}
        </Button>

        {lastSync && (
          <p className="text-xs text-muted-foreground mt-2">
            Last sync: {lastSync}
          </p>
        )}
      </div>
    </div>
  );
};

export default DataSyncButton;