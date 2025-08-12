import AuthFormWrapper from '@/components/AuthFormWrapper';
import { LoginFormComponent } from '@/components/LoginFormComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Advogados Solidários',
  description: 'Acesse sua conta na plataforma Advogados Solidários.',
};

export default function LoginPage() {
  return (
    <AuthFormWrapper
      title="Acessar Conta"
      description="Entre com suas credenciais para continuar."
    >
      <LoginFormComponent />
    </AuthFormWrapper>
  );
}
