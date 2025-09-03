"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ChatModal from './ChatModal';

interface Bid {
  id: number;
  valor: number;
  causaId: number;
  causaTitulo: string;
  advogadoId: number;
  advogadoNome: string;
  status: string;
  chatId: number;
}

export default function BidHistoryList() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [bids, setBids] = useState<Bid[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBids = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/lances/historico`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Erro ao carregar histórico de propostas');
        const data: Bid[] = await res.json();
        setBids(data);
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Erro', description: err.message });
      }
    };
    fetchBids();
  }, [token, toast]);

  return (
    <div className="space-y-6">
      {bids.length > 0 && (
        <h2 className="text-xl font-headline text-primary">Histórico de Propostas</h2>
      )}
      {bids.map(bid => (
        <Card key={bid.id} className="bg-card shadow-card-modern rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">{bid.causaTitulo}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>Status:</strong> {bid.status}</p>
            <p><strong>Valor:</strong> R$ {bid.valor.toFixed(2)}</p>
          </CardContent>
          <CardFooter>
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
