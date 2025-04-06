
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Email schema
const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type EmailSignupFormProps = {
  onSubmit: (values: { email: string }) => void;
};

const EmailSignupForm = ({ onSubmit }: EmailSignupFormProps) => {
  const emailForm = useForm<{ email: string }>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  return (
    <div>
      <h2 className="text-xl font-medium mb-4 text-charcoal-gray">Create an account</h2>
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-primary-coral hover:bg-primary-coral/90"
          >
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EmailSignupForm;
