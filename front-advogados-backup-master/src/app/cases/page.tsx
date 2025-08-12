
"use client";

import CaseList from '@/components/CaseList';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CasesPage() {
  const { user, isLoading, isAuthenticated } = useAuthRedirect({ requiredAuth: true, allowedRoles: ['ADVOGADO'] });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen-content p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isAuthenticated && user?.role !== 'ADVOGADO') {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen-content p-6 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground mb-6">Esta página é exclusiva para advogados.</p>
        <Button asChild>
          <Link href="/dashboard">Voltar ao Painel</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen-content">
      <Card className="mb-8 lg:mb-12 shadow-card-modern bg-card rounded-xl border-l-4 border-primary/30">
        <CardHeader className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl font-headline text-primary">Casos Disponíveis para Atuação</CardTitle>
              <CardDescription className="text-md text-muted-foreground mt-1">
                Revise os casos submetidos e escolha aqueles em que pode oferecer sua ajuda voluntária.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      <CaseList />
    </div>
  );
}
