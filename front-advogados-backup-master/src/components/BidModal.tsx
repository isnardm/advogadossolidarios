"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BidModalProps {
  caseId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBidSubmitted?: () => void;
}

export default function BidModal({ caseId, open, onOpenChange, onBidSubmitted }: BidModalProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [value, setValue] = useState('');

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*(\.\d{0,2})?$/.test(val)) {
      setValue(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Autenticação necessária.' });
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/lances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          causaId: caseId,
          valor: parseFloat(value),
          comentario: comment,
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Falha ao enviar o lance');
      }

      toast({ title: 'Lance enviado', description: 'Seu lance foi registrado com sucesso.' });
      setComment('');
      setValue('');
      onOpenChange(false);
      onBidSubmitted?.();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dar Lance</DialogTitle>
          <DialogDescription>Informe o valor e um comentário sobre o lance.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Comentário"
            value={comment}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            autoComplete="off"
            required
          />
          <Input
            placeholder="Valor"
            value={value}
            onChange={handleValueChange}
            autoComplete="off"
            required
          />
          <DialogFooter>
            <Button type="submit" disabled={comment.length === 0 || value.length === 0}>
              Enviar Lance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
