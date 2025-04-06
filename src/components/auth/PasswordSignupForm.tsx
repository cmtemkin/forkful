
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Password schema
const passwordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordSignupFormProps = {
  onSubmit: (values: { password: string; confirmPassword: string }) => void;
  onBack: () => void;
  isLoading: boolean;
};

const PasswordSignupForm = ({ onSubmit, onBack, isLoading }: PasswordSignupFormProps) => {
  const passwordForm = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  return (
    <div>
      <h2 className="text-xl font-medium mb-4 text-charcoal-gray">Choose a password</h2>
      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={passwordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-primary-coral hover:bg-primary-coral/90"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>

          <Button 
            type="button" 
            variant="outline"
            className="w-full mt-2"
            onClick={onBack}
          >
            Back
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PasswordSignupForm;
