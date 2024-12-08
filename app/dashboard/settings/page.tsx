import SettingsForm from '@/components/settings/SettingsForm'
import { prisma } from '@/lib/db'
import requireUser from '@/lib/hooks';
import { notFound } from 'next/navigation';
import React from 'react'


async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      email: true,
      image: true,
    }
  });

  if(!data) {
    return notFound();
  }
  return data;
}

export default async function Settingsroute() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string) 
  return (
    <SettingsForm fullName={data.name as string} email={data.email} profileImage={data.image as string}  />
  )
}
