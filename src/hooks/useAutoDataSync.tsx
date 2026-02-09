import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SyncOptions {
  enabled?: boolean;
  syncOnMount?: boolean;
  syncInterval?: number; // in milliseconds
}

export const useAutoDataSync = (options: SyncOptions = {}) => {
  const {
    enabled = true,
    syncOnMount = true,
    syncInterval = 30 * 60 * 1000, // 30 minutes default
  } = options;

  const { toast } = useToast();
  const hasSyncedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const syncData = async (showToast: boolean = false) => {
    try {
      // Only sync if user is authenticated and has admin role
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.log('Data sync skipped - not authenticated');
        return;
      }

      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (!userRole || userRole.role !== 'admin') {
        console.log('Data sync skipped - not admin');
        return;
      }

      // Check if data was synced recently (within last 30 minutes)
      const lastSyncTime = localStorage.getItem('lastDataSync');
      const now = Date.now();
      
      if (lastSyncTime && (now - parseInt(lastSyncTime)) < syncInterval) {
        console.log('Data sync skipped - recent sync found');
        return;
      }

      console.log('Starting automatic data sync...');
      
      // Run both sync functions in parallel
      const [insuranceResult, rallyResult] = await Promise.all([
        supabase.functions.invoke('sync-insurance-data'),
        supabase.functions.invoke('sync-rally-data')
      ]);

      let hasErrors = false;

      if (insuranceResult.error) {
        console.error('Insurance sync error:', insuranceResult.error);
        hasErrors = true;
      }

      if (rallyResult.error) {
        console.error('Rally sync error:', rallyResult.error);
        hasErrors = true;
      }

      if (!hasErrors) {
        localStorage.setItem('lastDataSync', now.toString());
        
        if (showToast) {
          toast({
            title: "Data Updated",
            description: "Latest insurance quotes and rally events loaded.",
          });
        }
        
        console.log('Data sync completed successfully');
      } else if (showToast) {
        toast({
          title: "Sync Warning",
          description: "Some data may not be current. Check your connection.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Auto sync error:', error);
      
      if (showToast) {
        toast({
          title: "Sync Failed",
          description: "Unable to update data. Using cached information.",
          variant: "destructive"
        });
      }
    }
  };

  useEffect(() => {
    if (!enabled) return;

    if (syncOnMount && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      setTimeout(() => syncData(false), 2000);
    }

    if (syncInterval > 0) {
      intervalRef.current = setInterval(() => {
        syncData(false);
      }, syncInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, syncOnMount, syncInterval]);

  const manualSync = () => syncData(true);

  return { manualSync };
};