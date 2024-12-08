'use server'

import { prisma } from "@/lib/db"
import requireUser from "@/lib/hooks"
import { redirect } from "next/navigation";

export async function DeleteEventTypeAction(formData: FormData) {
    const session = await requireUser()

    const data = await prisma.eventType.delete({
        where: {
            id: formData.get('id') as string,
            userId: session.user?.id,
        }
    });

    return redirect('/dashboard');
}