'use server'
import { prisma } from "@/lib/db";
import requireUser from "@/lib/hooks";
import { settingFormSchemaType } from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";

export async function SettingsAction(data: settingFormSchemaType) {
    const session = await requireUser();
    if(!data.fullName || !data.profileImage) {
        return {
            error: "Fill the form correctly"
        }
    }
    try {
        const user = await prisma.user.update({
            where: {
                id: session.user?.id
            },
            data: {
                name: data.fullName,
                image: data.profileImage,
            }
        });
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.log('Something went wrong ', error);
        return {
            error: 'Something went wrong!'
        }
    }

}