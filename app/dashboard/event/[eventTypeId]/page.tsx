import EditEventTypeForm from '@/components/editEvent/EditEventTypeForm';
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation';
import React from 'react'

async function getData(eventTypeId: string) {
  const data = await prisma.eventType.findUnique({
    where: {
      id: eventTypeId
    },
    select: {
      title: true,
      description: true,
      videoCallSoftware: true,
      duration: true,
      url: true,
      id: true,
    }
  });

  if(!data) {
    return notFound()
  }
  return data;
}

export default async function EditRoute({params}: {params: { eventTypeId: string}}) {
  const data = await getData(params.eventTypeId);

  return (
    <EditEventTypeForm />
  )
}
