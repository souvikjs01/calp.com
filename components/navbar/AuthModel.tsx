import React from 'react'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTrigger 
} from '../ui/dialog'
import { Button } from '../ui/button'
import Image from 'next/image'
import Logo from "@/public/logo.png"
import { signIn } from '@/lib/auth'
import GoogleAuthButton from '../loader/SubmitButton'


export default function AuthModel() {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button>Try for free</Button>
        </DialogTrigger>
        <DialogContent className=' sm:max-w-[360px]'>
            <DialogHeader className=' flex flex-row justify-center items-center gap-2'>
                <Image src={Logo} alt='logo' className=' size-10'/>
                <h4 className=' text-3xl font-semibold'>
                    Cal<span>Pro</span>
                </h4>
            </DialogHeader>
            <div>
                <form action={async () => {
                    "use server"
                    await signIn("google");
                }}>
                    <GoogleAuthButton />
                </form>
            </div>
        </DialogContent>
    </Dialog>
  )
}
