
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/auth';
import ErrorAlert from '@/components/auth/ErrorAlert';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { SignUpFormValues } from '@/components/auth/SignUpForm';

const Auth = () => {
  const { session, error: authError, clearError, signInWithPassword, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("login");
  
  useEffect(() => {
    // Clear errors when component mounts
    clearError();
    setFormError(null);
  }, [clearError]);
  
  if (session) {
    return <Navigate to="/" replace />;
  }

  // Clear error when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFormError(null);
    clearError();
  };

  const handleSignUp = async (values: SignUpFormValues) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      const { error } = await signUp(
        values.email, 
        values.password, 
        { firstName: values.firstName, lastName: values.lastName }
      );

      if (error) {
        setFormError(error);
        
        toast({
          title: "Error signing up",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your account has been created. You can now sign in.",
        });
        
        // Reset form and switch to login tab
        setActiveTab("login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: { email: string, password: string }) => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      const { error } = await signInWithPassword(values.email, values.password);

      if (error) {
        setFormError(error);
        
        toast({
          title: "Error signing in",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8">
      <h1 className="text-3xl font-outfit font-bold text-primary-coral mb-8">forkful</h1>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <Tabs defaultValue="login" value={activeTab} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <ErrorAlert message={formError || authError} />
          
          <TabsContent value="signup">
            <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
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
