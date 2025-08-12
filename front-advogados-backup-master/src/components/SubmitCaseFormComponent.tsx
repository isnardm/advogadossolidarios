
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const submitCaseSchema = z.object({
  title: z.string().min(5, { message: "Título deve ter no mínimo 5 caracteres." }).max(100, { message: "Título deve ter no máximo 100 caracteres." }),
  description: z.string().min(20, { message: "Descrição deve ter no mínimo 20 caracteres." }).max(2000, { message: "Descrição deve ter no máximo 2000 caracteres." }),
});

type SubmitCaseFormValues = z.infer<typeof submitCaseSchema>;

export function SubmitCaseFormComponent() {
  const { token } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SubmitCaseFormValues>({
    resolver: zodResolver(submitCaseSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(data: SubmitCaseFormValues) {
    setIsLoading(true);
    if (!token) {
      toast({ variant: "destructive", title: "Erro de autenticação", description: "Faça login para submeter um caso." });
      setIsLoading(false);
      router.push('/login');
      return;
    }

    const payload = {
      titulo: data.title,
      descricao: data.description,
      status: "ABERTA", // Set status to "ABERTA" as per backend requirement
    };

    try {
      const response = await fetch(`${API_BASE_URL}/causas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload), // Use the transformed payload
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Falha ao submeter caso.");
      }

      toast({
        title: "Caso Submetido!",
        description: "Seu caso foi enviado com sucesso e será analisado por advogados voluntários.",
      });
      form.reset(); // Reset form fields
      // Optionally redirect, e.g., to a "My Cases" page or back to dashboard
      router.push("/dashboard"); 
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao submeter caso",
        description: (error as Error).message || "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Título do Caso</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Problema com contrato de aluguel" {...field} className="text-base"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Descrição Detalhada do Caso</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva sua situação com o máximo de detalhes possível, mas sem incluir informações pessoais identificáveis nesta fase."
                  className="min-h-[200px] text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Enviar Caso
        </Button>
      </form>
    </Form>
  );
}
