"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ChatModal from './ChatModal';

interface PendingBid {
  id: number;
  valor: number;
  causaId: number;
  causaTitulo: string;
  advogadoId: number;
  advogadoNome: string;
  status: string;
  chatId: number;
}

export default function PendingBidsList() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [bids, setBids] = useState<PendingBid[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/lances/recebidas`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao carregar propostas');
        const data: PendingBid[] = await res.json();
        setBids(data);
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Erro', description: err.message });
      }
    };
    fetchBids();
  }, [token, toast]);

  const handleApprove = async (id: number) => {
    if (!token) return;
    if (!window.confirm('Deseja aprovar esta proposta?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/lances/${id}/aprovar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Falha ao aprovar a proposta');
      }
      const data: { chatId: number } = await res.json();
      setBids(prev => prev.map(b => b.id === id ? { ...b, status: 'APROVADA', chatId: data.chatId } : b));
      toast({ title: 'Proposta aprovada' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message });
    }
  };

  const handleReject = async (id: number) => {
    if (!token) return;
    if (!window.confirm('Deseja recusar esta proposta?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/lances/${id}/recusar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Falha ao recusar a proposta');
      }
      setBids(prev => prev.map(b => b.id === id ? { ...b, status: 'RECUSADA' } : b));
      toast({ title: 'Proposta recusada' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {bids.length > 0 && (
        <h2 className="text-xl font-headline text-primary">Propostas Recebidas</h2>
      )}
      {bids.map(bid => (
        <Card key={bid.id} className="bg-card shadow-card-modern rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">{bid.causaTitulo}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>Advogado:</strong> {bid.advogadoNome}</p>
            <p><strong>Valor:</strong> R$ {bid.valor.toFixed(2)}</p>
            <p><strong>Status:</strong> {bid.status}</p>
          </CardContent>
          <CardFooter className="space-x-2">
            {bid.status === 'PENDENTE' && (
              <>
                <Button onClick={() => handleApprove(bid.id)}>Aprovar</Button>
                <Button variant="destructive" onClick={() => handleReject(bid.id)}>Recusar</Button>
              </>
            )}
            {bid.status === 'APROVADA' && (
              <Button onClick={() => { setChatId(bid.chatId); setChatOpen(true); }}>Chat</Button>
            )}
          </CardFooter>
        </Card>
      ))}
      <ChatModal chatId={chatId ?? 0} open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
