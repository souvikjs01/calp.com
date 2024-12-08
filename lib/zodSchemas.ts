import { z } from "zod"
export const onboardingSchema = z.object({
    fullName: z.string().min(3, {
        message: 'Fullname must be contained atleast 3 characters'
    }).max(150, {
        message: 'Fullname can contain atmost 150 characters'
    }),
    userName: z.string().min(3, {
        message: 'Username must be contained atleast 3 characters'
    }).max(150, {
        message: 'Username can contain atmost 150 characters'
    }).regex(/^[a-zA-Z0-9-]+$/, {
        message: 'Username can only contain letters, number and - etc.'
    })
})
export type onboardingSchemaType = z.infer<typeof onboardingSchema>

export const settingFormSchema = z.object({
    fullName: z.string().min(3, {
        message: 'Fullname must be contained atleast 3 characters'
    }).max(150, {
        message: 'Fullname can contain atmost 150 characters'
    }),

    profileImage: z.string(),
})
export type settingFormSchemaType = z.infer<typeof settingFormSchema>

export const eventSchema = z.object({
    title: z.string().min(3, {
        message: 'Title should be atleast 3 words'
    }).max(150, {
        message: 'Title should be at most 150 words'
    }),

    duration: z.number().min(15).max(60),
    url: z.string().min(3).max(150),
    description: z.string().min(3).max(300),
    videoCallSoftware: z.string().min(3)
})
export type eventSchemaType = z.infer<typeof eventSchema>