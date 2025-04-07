import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/auth';

const formSchema = z.object({
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
};

const Profile = () => {
  const { user, setUserProfileData } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      firstName: "",
      lastName: "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
        form.reset({
          displayName: data.display_name || "",
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: user.email || "",
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: "Unable to load your profile information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, form, toast]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: values.displayName,
          first_name: values.firstName,
          last_name: values.lastName,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setProfile(prev => prev ? {
        ...prev,
        display_name: values.displayName,
        first_name: values.firstName,
        last_name: values.lastName
      } : null);
      
      setUserProfileData({
        firstName: values.firstName,
        lastName: values.lastName,
        displayName: values.displayName
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Unable to update your profile information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmail = async () => {
    if (!user || !form.getValues().email) return;
    
    setEmailUpdateLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: form.getValues().email,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Verification email sent",
        description: "Please check your email to confirm the update.",
      });
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        title: "Error updating email",
        description: error.message || "Unable to update your email address.",
        variant: "destructive",
      });
    } finally {
      setEmailUpdateLoading(false);
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return '?';
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-center text-charcoal-gray">Your Profile</h1>
      
      <div className="flex flex-col items-center mb-8">
        <Avatar className="h-24 w-24 mb-4 bg-primary-coral/10">
          <AvatarFallback className="text-primary-coral text-xl">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} className="rounded-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} className="rounded-full" />
                    </FormControl>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={updateEmail}
                      disabled={emailUpdateLoading}
                      className="whitespace-nowrap rounded-full"
                    >
                      {emailUpdateLoading ? "Updating..." : "Update Email"}
                    </Button>
                  </div>
                  <FormMessage />
                  <p className="text-xs text-gray-500 mt-1">
                    Email changes require verification
                  </p>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center">
            <Button 
              type="submit" 
              className="bg-primary-coral hover:bg-primary-coral/90 rounded-full px-10"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
