import { useEffect, useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { Globe, Monitor } from 'lucide-react';

type Visitor = {
  id: number;
  ip: string;
  country: string | null;
  city: string | null;
  user_agent: string | null;
  last_visited_at: string;
  visit_count: number;
  created_at: string;
};

const VisitorsManager = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Visitor[]>('/visitors', token);
      setVisitors(data);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les visiteurs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const totalVisits = visitors.reduce((sum, v) => sum + v.visit_count, 0);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold">Visiteurs</h2>
        <Badge variant="outline" className="gap-1">
          <Globe className="w-3 h-3" />
          {visitors.length} IP unique{visitors.length > 1 ? 's' : ''}
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Monitor className="w-3 h-3" />
          {totalVisits} visite{totalVisits > 1 ? 's' : ''} au total
        </Badge>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Chargement...</p>
      ) : visitors.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun visiteur enregistré.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP</TableHead>
              <TableHead>Pays</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Visites</TableHead>
              <TableHead>Première visite</TableHead>
              <TableHead>Dernière visite</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.map(visitor => (
              <TableRow key={visitor.id}>
                <TableCell className="font-mono text-sm">{visitor.ip}</TableCell>
                <TableCell>{visitor.country ?? '—'}</TableCell>
                <TableCell>{visitor.city ?? '—'}</TableCell>
                <TableCell>
                  <Badge className={visitor.visit_count > 5 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}>
                    {visitor.visit_count}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(visitor.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(visitor.last_visited_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default VisitorsManager;
