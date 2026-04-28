import { useEffect, useState, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Trash2, Eye } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';

type Contact = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const ContactsManager = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Contact[]>('/contacts', token);
      setContacts(data);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les messages', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleView = async (contact: Contact) => {
    setSelected(contact);
    if (!contact.is_read) {
      await api.put(`/contacts/${contact.id}/read`, {}, token!);
      setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, is_read: true } : c));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      await api.delete(`/contacts/${id}`, token!);
      setContacts(prev => prev.filter(c => c.id !== id));
      toast({ title: 'Supprimé', description: 'Message supprimé avec succès' });
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de supprimer', variant: 'destructive' });
    }
  };

  const unreadCount = contacts.filter(c => !c.is_read).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold">Messages de contact</h2>
        {unreadCount > 0 && (
          <Badge className="bg-red-500 text-white">{unreadCount} non lu{unreadCount > 1 ? 's' : ''}</Badge>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Chargement...</p>
      ) : contacts.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun message reçu.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Statut</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map(contact => (
              <TableRow key={contact.id} className={!contact.is_read ? 'font-semibold bg-blue-50' : ''}>
                <TableCell>
                  {contact.is_read
                    ? <Badge variant="outline" className="text-gray-400">Lu</Badge>
                    : <Badge className="bg-blue-500 text-white">Nouveau</Badge>
                  }
                </TableCell>
                <TableCell>{contact.first_name} {contact.last_name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell className="max-w-[180px] truncate">{contact.subject}</TableCell>
                <TableCell className="text-sm text-gray-500">
                  {new Date(contact.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleView(contact)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(contact.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.subject}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div><span className="font-medium">Nom : </span>{selected.first_name} {selected.last_name}</div>
                <div><span className="font-medium">Email : </span>{selected.email}</div>
                {selected.phone && <div><span className="font-medium">Tél : </span>{selected.phone}</div>}
                <div><span className="font-medium">Date : </span>{new Date(selected.created_at).toLocaleString('fr-FR')}</div>
              </div>
              <hr />
              <p className="whitespace-pre-wrap text-gray-800">{selected.message}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsManager;
