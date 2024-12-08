import React from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface iAppProps {
    text: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    className?: string;
    loading: boolean;
}
export default function SubmitButton({text, variant, className, loading}: iAppProps) {
    const { pending } = useFormStatus();
  return (
    <>
        {loading ? (
            <Button 
                type='submit' 
                variant={variant} 
                className={cn("w-fit", className)}
            >
                <Loader2 className=' size-4 mr-2 animate-spin'/> Please Wait
            </Button>
        ) : (
            <Button
              type='submit' 
              variant={variant} 
              className={cn("w-fit", className)}
            >
                {text}
            </Button>
        )}
    </>
  )
}
