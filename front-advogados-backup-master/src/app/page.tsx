
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LogoIcon from '@/components/icons/LogoIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen-content bg-background text-center p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen-content bg-gradient-to-br from-background via-muted to-background text-center p-6 overflow-hidden">
      <div className="relative z-10">
        <LogoIcon className="h-28 w-28 md:h-32 md:w-32 text-primary mb-8 animate-pulse drop-shadow-lg" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-primary mb-6 drop-shadow-sm">
          Advogados Solidários
        </h1>
        <p className="text-lg sm:text-xl text-foreground/90 mb-12 max-w-2xl mx-auto">
          Conectando cidadãos a advogados voluntários para um acesso à justiça mais igualitário e humano.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row items-center justify-center">
          <Button 
            asChild 
            size="lg" 
            className="bg-primary hover:bg-primary/85 text-primary-foreground shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out w-full sm:w-auto group rounded-lg"
          >
            <Link href="/login">
              Entrar Agora <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out w-full sm:w-auto rounded-lg"
          >
            <Link href="/register/user">Quero me Registrar</Link>
          </Button>
        </div>
        <p className="text-sm text-foreground/70 mt-16 max-w-xl mx-auto">
          Nossa missão é facilitar o encontro entre quem precisa de auxílio jurídico e profissionais dispostos a ajudar pro bono. Juntos, podemos fazer a diferença.
        </p>
      </div>
      {/* Optional: Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/10 rounded-full opacity-50 translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none"></div>
    </div>
  );
}
