'use server'

import { prisma } from "@/lib/db";
import requireUser from "@/lib/hooks"
import { revalidatePath } from "next/cache";

export async function UpdateEventTypeStatusAction (prevState: any, {eventTypeId, isChecked} : {
    eventTypeId: string, 
    isChecked: boolean,
}) {
    try {
        const session = await requireUser();

        const data = await prisma.eventType.update({
            where: {
                id: eventTypeId,
                userId: session.user?.id,
            },
            data: {
                active: isChecked,
            }
        });

        revalidatePath('/dashboard');

        return {
            status: "success",
            message: "Event Type Status Updated!",
        }
    } catch (error) {
        return {
            status: "error",
            message: "Something went wrong"
        }
    }
}