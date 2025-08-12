
"use client";

import type React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import LogoIcon from '@/components/icons/LogoIcon'; // Assuming you have a logo icon

interface AuthFormWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const AuthFormWrapper: React.FC<AuthFormWrapperProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen-content bg-gradient-to-br from-muted via-background to-muted p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md bg-card rounded-xl shadow-card-modern hover:shadow-card-modern-hover transition-shadow duration-300">
        <CardHeader className="text-center p-6 sm:p-8">
          <div className="mx-auto mb-4">
            <LogoIcon className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline text-primary">{title}</CardTitle>
          <CardDescription className="text-muted-foreground pt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 pt-0">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthFormWrapper;
