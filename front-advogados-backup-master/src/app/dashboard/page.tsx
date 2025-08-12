
"use client";

import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, User, AlertTriangle, Loader2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import CaseList from '@/components/CaseList'; // Import CaseList

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuthRedirect({ requiredAuth: true });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen-content p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-foreground">Carregando painel...</p>
      </div>
    );
  }

  if (!user) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen-content p-6 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive mb-2">Erro ao carregar dados</h1>
        <p className="text-muted-foreground mb-6">Não foi possível carregar os dados do usuário. Tente fazer login novamente.</p>
        <Button asChild>
          <Link href="/login">Ir para Login</Link>
        </Button>
      </div>
    );
  }

  const welcomeMessage = user.name ? `Bem-vindo(a) de volta, ${user.name.split(' ')[0]}!` : "Bem-vindo(a)!";

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 min-h-screen-content">
      <Card className="mb-8 lg:mb-12 bg-card shadow-card-modern rounded-xl overflow-hidden border-primary/20 border-l-4">
        <CardHeader className="p-6 md:p-8">
          <div className="flex items-center space-x-4">
            <User className="h-10 w-10 md:h-12 md:w-12 text-primary flex-shrink-0" />
            <div>
              <CardTitle className="text-2xl md:text-3xl font-headline text-primary">{welcomeMessage}</CardTitle>
              <CardDescription className="text-md text-muted-foreground mt-1">Seu painel personalizado da plataforma Advogados Solidários.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {user.role === 'USUARIO' && (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <Card className="bg-card rounded-xl shadow-card-modern hover:shadow-card-modern-hover transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <CardHeader className="p-6">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="h-7 w-7 text-accent" />
                <CardTitle className="text-xl md:text-2xl font-headline text-primary">Meus Pedidos de Auxílio</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">Crie e acompanhe seus pedidos de auxílio jurídico.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-muted-foreground mb-6 text-sm">
                Precisa de ajuda com uma questão legal? Submeta seu caso para que advogados voluntários possam analisá-lo.
              </p>
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/85 text-accent-foreground transform hover:scale-102 transition-transform duration-150 group">
                <Link href="/submit-case">Submeter Novo Caso <ExternalLink className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100"/></Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-card rounded-xl shadow-card-modern hover:shadow-card-modern-hover transition-all duration-300 ease-in-out transform hover:-translate-y-1 md:col-span-1">
            <CardHeader className="p-6">
               <CardTitle className="text-xl md:text-2xl font-headline text-primary">Nossa Missão Solidária</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                <Image 
                  src="https://placehold.co/600x338.png" 
                  alt="Advocacia solidária, justiça e colaboração" 
                  width={600} 
                  height={338} 
                  className="rounded-lg object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  data-ai-hint="collaboration justice"
                />
              </div>
              <p className="text-muted-foreground text-sm">
                Acreditamos no poder da colaboração para promover o acesso à justiça. Advogados Solidários é uma plataforma que une pessoas que precisam de orientação legal com advogados dispostos a oferecer seu tempo e conhecimento de forma voluntária. Juntos, construímos uma sociedade mais justa e igualitária.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {user.role === 'ADVOGADO' && (
        <div className="space-y-8">
          <Card className="shadow-card-modern bg-card rounded-xl border-l-4 border-primary/30">
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

          <Card className="bg-card rounded-xl shadow-card-modern hover:shadow-card-modern-hover transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <CardHeader className="p-6">
               <CardTitle className="text-xl md:text-2xl font-headline text-primary">Nossa Missão Solidária</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                <Image 
                  src="https://placehold.co/600x338.png" 
                  alt="Advocacia solidária, justiça e colaboração" 
                  width={600} 
                  height={338} 
                  className="rounded-lg object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  data-ai-hint="collaboration justice"
                />
              </div>
              <p className="text-muted-foreground text-sm">
                Acreditamos no poder da colaboração para promover o acesso à justiça. Advogados Solidários é uma plataforma que une pessoas que precisam de orientação legal com advogados dispostos a oferecer seu tempo e conhecimento de forma voluntária. Juntos, construímos uma sociedade mais justa e igualitária.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
