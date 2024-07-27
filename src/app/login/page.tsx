"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";


export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();


  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const result = await login(formData);
        console.log("Login result:", result);

        if (result.error) {
          toast({
            title: "Login Failed",
            description: result.error,
            variant: "destructive",
          });
        } else if (result.success) {
          toast({
            title: "Login Successful",
            description: "You have been logged in successfully.",
          });
          router.push("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast({
          title: "Login Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    });
  }


  

  if (isLoading || isPending) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2 text-gray-700">Logging in...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={handleSubmit} className="flex flex-col gap-12">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Webcatalogue Login</h1>
          <p className="text-balance text-muted-foreground">
            Enter your given credentials below
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </form>
    </main>
  );
}

