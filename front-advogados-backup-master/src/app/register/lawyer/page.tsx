import AuthFormWrapper from '@/components/AuthFormWrapper';
import { LawyerRegisterFormComponent } from '@/components/LawyerRegisterFormComponent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro de Advogado | Advogados Solidários',
  description: 'Crie sua conta de advogado na plataforma Advogados Solidários.',
};

export default function LawyerRegisterPage() {
  return (
    <AuthFormWrapper
      title="Criar Conta de Advogado"
      description="Preencha os campos abaixo para se registrar como advogado voluntário."
    >
      <LawyerRegisterFormComponent />
    </AuthFormWrapper>
  );
}
