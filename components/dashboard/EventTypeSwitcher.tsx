'use client'

import React, { useEffect, useTransition } from 'react'
import { Switch } from '../ui/switch'
import { useFormState } from 'react-dom'
import { UpdateEventTypeStatusAction } from '@/actions/switchAction'
import { toast } from 'sonner';

export default function MenuActiveSwitch({ initialChecked, eventTypeId }: {
    initialChecked: boolean,
    eventTypeId: string,
}) {
    const [isPending, startTransition] = useTransition();

    const [state, action] = useFormState(UpdateEventTypeStatusAction, undefined);
   

    useEffect(() => {
        if(state?.status === "success") {
            console.log('success');
            
            toast(state.message);
            // toast.success(state.message);
        }
        else if(state?.status === "error") {
            console.log('fail');
            
            toast.error(state.message);
        }
    }, [state])
    return (
        <Switch 
            disabled={isPending} 
            defaultChecked={initialChecked} 
            onCheckedChange={(isChecked) => {
                startTransition(() => {
                    action({
                        eventTypeId: eventTypeId,
                        isChecked: isChecked,
                    })
                })
            }}
        />
    )
}
