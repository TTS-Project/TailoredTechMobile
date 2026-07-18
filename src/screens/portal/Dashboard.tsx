import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface ServicePurchased {
  id: string;
  service_name: string;
  status: 'active' | 'completed' | 'cancelled';
  current_stage: 'discovery' | 'build' | 'review' | 'delivered';
  stage_notes: string | null;
  purchased_at: string;
}

const STAGE_LABELS: Record<ServicePurchased['current_stage'], string> = {
  discovery: 'Discovery',
  build: 'Build',
  review: 'Review',
  delivered: 'Delivered',
};

export default function Dashboard() {
  const [services, setServices] = useState<ServicePurchased[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('services_purchased')
        .select('id, service_name, status, current_stage, stage_notes, purchased_at')
        .order('purchased_at', { ascending: false });

      if (error) {
        console.error('Failed to load services:', error.message);
      } else {
        setServices(data as ServicePurchased[]);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>Loading your projects…</p>;
  if (services.length === 0) {
    return <p>No active projects yet. Once a purchase completes, it'll appear here.</p>;
  }

  return (
    <div>
      <h1>Project Status</h1>
      {services.map((s) => (
        <div key={s.id} style={{ marginBottom: '1.5rem' }}>
          <h2>{s.service_name}</h2>
          <p>Stage: {STAGE_LABELS[s.current_stage]}</p>
          <p>Status: {s.status}</p>
          {s.stage_notes && <p>Notes: {s.stage_notes}</p>}
        </div>
      ))}
    </div>
  );
}
