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
}

interface LanceResponse {
  id: number;
  valor: number;
  causaId: number;
  advogadoId: number;
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
        const res = await fetch(`${API_BASE_URL}/lances/pendentes`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao carregar lances pendentes');
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
    try {
      const res = await fetch(`${API_BASE_URL}/lances/${id}/aprovar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Falha ao aprovar o lance');
      }
      const data: LanceResponse = await res.json();
      setBids(prev => prev.filter(b => b.id !== id));
      setChatId(data.chatId);
      setChatOpen(true);
      toast({ title: 'Lance aprovado', description: 'Chat iniciado com o advogado.' });
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
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleApprove(bid.id)}>Aprovar</Button>
          </CardFooter>
        </Card>
      ))}
      <ChatModal chatId={chatId ?? 0} open={chatOpen} onOpenChange={setChatOpen} />
    </div>
  );
}
