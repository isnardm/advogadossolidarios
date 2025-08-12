"use client";

import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/config/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CaseDetails {
  id: number;
  titulo: string;
  descricao: string;
  usuarioNome: string;
  status: string;
}

export default function CaseDetailsPage() {
  const { user, isLoading, isAuthenticated } = useAuthRedirect({ requiredAuth: true, allowedRoles: ['ADVOGADO'] });
  const { token } = useAuth();
  const params = useParams();
  const caseId = params?.id as string;
  const [caseData, setCaseData] = useState<CaseDetails | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loadingCase, setLoadingCase] = useState(true);

  useEffect(() => {
    const fetchCase = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/causas/${caseId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erro ao carregar detalhes do caso');
        }
        const data: CaseDetails = await response.json();
        setCaseData(data);
      } catch (err) {
        setFetchError((err as Error).message);
      } finally {
        setLoadingCase(false);
      }
    };
    fetchCase();
  }, [caseId, token]);

  if (isLoading || !isAuthenticated || loadingCase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen-content p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-foreground">Carregando detalhes do caso...</p>
      </div>
    );
  }

  if (fetchError || !caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen-content p-6 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Erro ao carregar detalhes</h1>
        <p className="text-muted-foreground mb-6">{fetchError || 'Caso não encontrado.'}</p>
        <Button asChild>
          <Link href="/cases">Voltar</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen-content">
      <Card className="shadow-card-modern bg-card rounded-xl border-l-4 border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">{caseData.titulo}</CardTitle>
          <CardDescription className="text-muted-foreground">Submetido por: {caseData.usuarioNome}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground/80 whitespace-pre-line">{caseData.descricao}</p>
          <p className="text-sm text-muted-foreground">Status: {caseData.status}</p>
        </CardContent>
      </Card>
    </div>
  );
}
