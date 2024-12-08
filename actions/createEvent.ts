'use server'
import { prisma } from "@/lib/db";
import requireUser from "@/lib/hooks";
import { eventSchemaType } from "@/lib/zodSchemas";
import { redirect } from "next/navigation";

export async function CreateEventTypeAction(data: eventSchemaType) {
    const session = await requireUser();
    if(!data.title || !data.description || !data.duration || !data.url || !data.videoCallSoftware) {
        return {
            message: 'Something is missing'
        }
    }
    try {
        const uniqueEvent = await prisma.eventType.findFirst({
            where: {
                userId: session.user?.id,
                url: data.url
            }
        });
        if(uniqueEvent) {
            return {
                message: 'Event already exist'
            }
        };
        await prisma.eventType.create({
            data: {
                userId: session.user?.id,
                title: data.title,
                description: data.description,
                duration: data.duration,
                videoCallSoftware: data.videoCallSoftware,
                url: data.url
            }
        })
        return;
    } catch (error) {
        console.log('something went wrong ', error);        
    }
}
  