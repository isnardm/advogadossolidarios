"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ChatModalProps {
  chatId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: number;
  conteudo: string;
  remetente: string;
}

export default function ChatModal({ chatId, open, onOpenChange }: ChatModalProps) {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      if (!token || !chatId || !open) return;
      try {
        const res = await fetch(`${API_BASE_URL}/chats/${chatId}/mensagens`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Falha ao carregar mensagens');
        const data: Message[] = await res.json();
        setMessages(data);
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Erro', description: err.message });
      }
    };
    fetchMessages();
  }, [chatId, open, token, toast]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newMessage.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${chatId}/mensagens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ conteudo: newMessage }),
      });
      if (!res.ok) throw new Error('Falha ao enviar mensagem');
      const data: Message = await res.json();
      setMessages(prev => [...prev, data]);
      setNewMessage('');
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chat</DialogTitle>
        </DialogHeader>
        <div className="mb-4 max-h-64 overflow-y-auto space-y-2 text-sm">
          {messages.map(msg => (
            <div key={msg.id} className={msg.remetente === (user?.role === 'ADVOGADO' ? 'ADVOGADO' : 'USUARIO') ? 'text-right' : 'text-left'}>
              <span className="font-medium">
                {msg.remetente === 'ADVOGADO' ? 'Advogado' : 'Você'}:
              </span> {msg.conteudo}
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex space-x-2">
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1" placeholder="Mensagem" />
          <Button type="submit">Enviar</Button>
        </form>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
