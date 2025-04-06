
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';
import EmailSignupForm from '@/components/auth/EmailSignupForm';
import PasswordSignupForm from '@/components/auth/PasswordSignupForm';
import LoginForm from '@/components/auth/LoginForm';

const Auth = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupStep, setSignupStep] = useState<'email' | 'password'>('email');
  
  // If user is already logged in, redirect to home
  if (session) {
    return <Navigate to="/feed" replace />;
  }

  const handleEmailSubmit = (values: { email: string }) => {
    setSignupEmail(values.email);
    setSignupStep('password');
  };

  const handleSignUp = async (values: { password: string }) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: values.password,
      });

      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Check your email for a confirmation link.",
        });
        navigate("/feed");
      }
    } catch (error) {
      toast({
        title: "Error signing up",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignIn = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast({
          title: "Error logging in",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/feed");
      }
    } catch (error) {
      toast({
        title: "Error logging in",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8">
      <h1 className="text-3xl font-outfit font-bold text-primary-coral mb-8">forkful</h1>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signup">
            {signupStep === 'email' ? (
              <EmailSignupForm onSubmit={handleEmailSubmit} />
            ) : (
              <PasswordSignupForm 
                onSubmit={handleSignUp} 
                onBack={() => setSignupStep('email')}
                isLoading={isLoading}
              />
            )}
          </TabsContent>
          
          <TabsContent value="login">
            <LoginForm onSubmit={handleSignIn} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
