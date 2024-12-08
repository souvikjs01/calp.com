'use server'

import { prisma } from "@/lib/db";
import requireUser from "@/lib/hooks"
import { revalidatePath } from "next/cache";

export async function updateAvailabilityAction(data: FormData) {
    const session = await requireUser();
    const rawData = Object.fromEntries(data.entries())
    console.log('raw data: ', rawData);
    
    const availabilityData = Object.keys(rawData).filter((key) => key.startsWith("id-"))
    .map((key) => {
        const id = key.replace("id-", "");
        return {
            id,
            isActive: rawData[`isActive-${id}`] === "on",
            fromTime: rawData[`fromTime-${id}`] as string,
            tillTime: rawData[`tillTime-${id}`] as string
        }
    });
    console.log('availability data ', availabilityData);

    try {
        await prisma.$transaction(
            availabilityData.map((item) => prisma.availability.update({
                where: {
                    id: item.id
                },
                data: {
                    isActive: item.isActive,
                    fromTime: item.fromTime,
                    tillTime: item.tillTime,
                }
            }))
        )
        revalidatePath("/dashboard/availability");
    } catch (error) {
        console.log(error);        
    }
    
    
}