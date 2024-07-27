"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button 
      size="sm" 
      variant="outline" 
      className="bg-background hover:bg-muted/40 text-muted-foreground mb-4" 
      onClick={() => router.back()}
    >
      <ChevronLeft className="h-4 w-4 mr-2" />
      Back
    </Button>
  );
}