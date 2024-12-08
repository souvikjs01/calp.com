import { DeleteEventTypeAction } from '@/actions/deleteAction'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

export default function DeleteEventType({params}: {params: {
    eventTypeId: string
}}) {
  return (
    <div className=' flex flex-1 items-center justify-center'>
      <Card className=' max-w-[450px] w-full'>
        <CardHeader>
            <CardTitle>Delete Event Type</CardTitle>
            <CardDescription>Are you sure you want to delete this event?</CardDescription>
        </CardHeader>
        <CardFooter className=' w-full flex justify-between'>
            <Button asChild variant='secondary'>
                <Link href='/dashboard'>Cancel</Link>
            </Button>
            <form action={DeleteEventTypeAction}>
                <input type="hidden" name='id' value={params.eventTypeId}/>
                <Button variant='destructive'>
                    Delete
                </Button>
            </form>
        </CardFooter>
      </Card>
    </div>
  )
}
