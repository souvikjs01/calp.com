"use client"
import React from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button';
import GoogleLogo from "@/public/google.svg"
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function GoogleAuthButton() {
    const { pending } = useFormStatus();
  return (
    <>
        {pending ? (
            <Button disabled variant='outline' className=' w-full'>
                <Loader2 className=' size-4 mr-2 animate-spin'/> Please wait
            </Button>
        ) : (
            <Button variant='outline' className=' w-full'>
                <Image src={GoogleLogo} alt='glogo' className=' size-4 mr-2' />
                Sign in with Google
            </Button>
        )}
    </>
  )
}
