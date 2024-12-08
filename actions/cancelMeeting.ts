'use server'
import { prisma } from "@/lib/db";
import requireUser from "@/lib/hooks";
import { nylas } from "@/lib/nylas";
import { revalidatePath } from "next/cache";

export async function CancelMeetingAction(formData: FormData) {
    const session = await requireUser();

    const userData = await prisma.user.findUnique({
        where: {
            id: session.user?.id
        },
        select: {
            grantEmail: true,
            grantId: true,
        }
    });
    if(!userData) {
        throw new Error('User not found')
    }

    const data = await nylas.events.destroy({
        eventId: formData.get('eventId') as string,
        identifier: userData.grantId as string,
        queryParams: {
            calendarId: userData.grantEmail as string,
        }
    });

    revalidatePath('/dashboard/meetings');
}