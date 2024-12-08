"use server"

import { prisma } from "@/lib/db";
import requireUser from "@/lib/hooks"
import { onboardingSchemaType } from "@/lib/zodSchemas";
// interface OnboardingResult {
//     error?: string;
//     success?: string;
// }
export async function OnboardingAction(formData: onboardingSchemaType) {
    const session = await requireUser();
    if(!formData.fullName || !formData.userName) {
        return {
            error: "Fill the form correctly"
        }
    }
    try {
        const userNameExist = await prisma.user.findUnique({
            where: {
                userName: formData.userName
            }
        })
        if(userNameExist) {
            return {
                error: "Username already taken, try another one."
            }
        }
        const data = await prisma.user.update({
            where: {
                id: session.user?.id
            },
            data: {
                userName: formData.userName, 
                name: formData.fullName,
                availability: {
                    createMany: {
                        data: [
                            {
                                day: 'Monday',
                                fromTime: '08:00',
                                tillTime: '18:00',
                            },
                            {
                                day: 'Tuesday',
                                fromTime: '08:00',
                                tillTime: '18:00',
                            },
                            {
                                day: 'Wednesday',
                                fromTime: '08:00',
                                tillTime: '18:00',
                            },
                            {
                                day: 'Thursday',
                                fromTime: '08:00',
                                tillTime: '18:00',
                            },
                            {
                                day: 'Friday',
                                fromTime: '08:00',
                                tillTime: '18:00',
                            },
                            {
                                day: 'Saturday',
                                fromTime: '08:00',
                                tillTime: '18:00',
                            },
                            {
                                day: 'Sunday',
                                fromTime: '08:00',
                                tillTime: '18:00',
                            },
                        ]
                    }
                }
            }
        })
        return;
    } catch (error) {
        console.log(error);
        return {
            error: "Internal server error"
        }
    }
}