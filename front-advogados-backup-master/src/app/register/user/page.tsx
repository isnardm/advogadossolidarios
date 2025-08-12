import AuthFormWrapper from '@/components/AuthFormWrapper';
import { UserRegisterFormComponent } from '@/components/UserRegisterFormComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro de Usuário | Advogados Solidários',
  description: 'Crie sua conta de usuário na plataforma Advogados Solidários.',
};

export default function UserRegisterPage() {
  return (
    <AuthFormWrapper
      title="Criar Conta de Usuário"
      description="Preencha os campos abaixo para se registrar."
    >
      <UserRegisterFormComponent />
    </AuthFormWrapper>
  );
}
