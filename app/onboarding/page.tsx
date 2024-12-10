"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from '@/components/ui/input'
import { z } from "zod"
import { onboardingSchema, onboardingSchemaType } from '@/lib/zodSchemas'
import SubmitButton from '@/components/submitButton/SubmitButton'
import { OnboardingAction } from '@/actions/user'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'


export default function Onboarding() {    
    const form = useForm<z.infer<typeof onboardingSchema>>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
          fullName: "",
          userName: "",
        }, 
    })
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const onSubmit = async (data: onboardingSchemaType) => {
        setLoading(true)
        const response = await OnboardingAction(data);
        if(response?.error){
            toast({
                title: response?.error
            })
        } else{
            setLoading(false);
            toast({
                title: 'Updated Successfully'
            })
            form.reset();
            router.push('/dashboard/grant-id');
        }
        setLoading(false);      
    }
  return (
    <div className=' min-h-screen w-screen flex items-center justify-center'>
      <Card>
        <CardHeader>
            <CardTitle>
                Welcome to CalPro
            </CardTitle>
            <CardDescription>
                We need the following information to set up your profile!
            </CardDescription>
        </CardHeader>
        <CardContent className=' flex flex-col gap-y-4'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Kathrena Strecy" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="kath-01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SubmitButton loading={loading} className='w-full' text='Submit' />
                </form>
            </Form>
        </CardContent>
      </Card>

    </div>
  )
}
