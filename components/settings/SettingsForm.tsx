'use client'
import React, { useState } from 'react'
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from '../ui/card'
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '../ui/form'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
import { settingFormSchema, settingFormSchemaType } from '@/lib/zodSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Loader2, X } from 'lucide-react'
import { UploadDropzone } from '@/lib/uploadThing'
import { SettingsAction } from '@/actions/settings'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface IAppsProps{
    fullName: string;
    email: string;
    profileImage: string
}
export default function SettingsForm({ fullName, email, profileImage }: IAppsProps) {
    const form = useForm<settingFormSchemaType>({
        resolver: zodResolver(settingFormSchema),
        defaultValues: {
          fullName: fullName,
          profileImage: profileImage,
        },
    })
    const [loading, setLoading] = useState(false)
    const [currentProfileImage, setcurrentProfileImage] = useState(profileImage)

    // remove the current profile image:
    const handleDeleteImage = () => {
        setcurrentProfileImage("");
        form.setValue("profileImage", "");
    }

    const router = useRouter();
    const onSubmit = async (data: settingFormSchemaType) => {
        setLoading(true);
        const response = await SettingsAction(data);
        setLoading(false)
        if(response.error) {
            toast.error(response.error || "Something went wrong");
        }
        else if(response.success) {
            setcurrentProfileImage(data.profileImage)
            router.push('/dashboard')
        }
    }
  return (
    <Card>
        <CardHeader>
            <CardTitle>You are almost Done!</CardTitle>
            <CardDescription>We have to now connect your calendar to your account</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Kathrena Strecy" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className=' flex flex-col gap-y-4'>
                        <Label>Email</Label>
                        <Input disabled defaultValue={email} placeholder='test@gmail.com'/>
                    </div>

                    <div className=' grid gap-y-4'>
                        <Label>Profile Image</Label>
                        <input 
                            type='hidden'
                            value={currentProfileImage}
                            key='profile'
                        />
                        {currentProfileImage ? (
                            <div className=' relative size-16'>
                                <img 
                                    src={currentProfileImage}
                                    alt='profile'
                                    className=' size-16 rounded-lg'
                                />
                                <Button 
                                    onClick={handleDeleteImage}
                                    className=' absolute -top-3 -right-3 rounded-full' 
                                    variant='destructive' 
                                    size='icon'
                                    type='button'
                                >
                                    <X className=' size-4'/>
                                </Button>
                            </div>
                        ) : (
                            <UploadDropzone 
                                onClientUploadComplete={(res) => {
                                    const url = res[0].url
                                    setcurrentProfileImage(res[0].url)
                                    form.setValue("profileImage", url);
                                    toast.success("Profile Image has been uploaded");
                                }} 
                                onUploadError={(err) => {
                                    console.log('Something went wrong ', err);
                                    toast.error("Something went wrong");
                                }}
                                endpoint='imageUploader'
                            />
                        )}
                    </div>
        
                    <Button type='submit'>
                        {loading ? (<Loader2 className=' size-4 animate-spin'/>) : ("Save Changes")}
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
  )
}
