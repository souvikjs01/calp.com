'use server'

import { prisma } from "@/lib/db"
import { nylas } from "@/lib/nylas";
import { redirect } from "next/navigation";

export async function CreateMeetingAction(formData: FormData) {
    const getUserData = await prisma.user.findUnique({
        where: {
            userName: formData.get('username') as string
        },
        select: {
            grantEmail: true,
            grantId: true,
        }
    })
    if(!getUserData) {
        throw new Error('User not found');
    }

    const eventTypeData = await prisma.eventType.findUnique({
        where: {
            id: formData.get('eventTypeId') as string,
        },
        select: {
            title: true,
            description: true,
        }
    });

    const fromTime = formData.get('fromTime') as string;
    const eventDate = formData.get('eventDate') as string;
    const meetingLength = Number(formData.get('meetingLength'));
    const provider = formData.get('provider') as string;

    const startDateTime = new Date(`${eventDate}T${fromTime}:00`)
    const endDateTime = new Date(startDateTime.getTime() + meetingLength*60000); // to convert in mili sec

    await nylas.events.create({
        identifier: getUserData.grantId as string,
        requestBody: {
            title: eventTypeData?.title,
            description: eventTypeData?.description,
            when: {
                startTime: Math.floor(startDateTime.getTime() / 1000),
                endTime: Math.floor(endDateTime.getTime() / 1000),
            },
            conferencing: {
                autocreate: {}, 
                provider: provider as any,
            },
            participants: [
                {
                    name: formData.get('name') as string,
                    email: formData.get('email') as string,
                    status: 'yes',
                }
            ]
        },
        queryParams: {
            calendarId: getUserData.grantEmail as string,
            notifyParticipants: true,
        }
    })

    return redirect('/success');
}

