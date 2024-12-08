'use client'
import { CreateEventTypeAction } from '@/actions/createEvent'
import SubmitButton from '@/components/submitButton/SubmitButton'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/ButtonGroup'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { eventSchema, eventSchemaType } from '@/lib/zodSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

type Platform = "Zoom Meeting" | "Google Meet" | "Microsoft Teams";
export default function NewEventRoute() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<eventSchemaType>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 15,
      url: "",
      videoCallSoftware: "Google Meet",
    },
  })

  const onSubmit = async (data: eventSchemaType) => {   
    setLoading(true)
    const response = await CreateEventTypeAction(data);
    setLoading(false);
    if(response?.message) {
      toast({
        title: response.message
      })
    }  
    form.reset();
    router.push('/dashboard');
  }
  return (
    <div className=' w-full h-full flex flex-1 justify-center items-center '>
        <Card>
            <CardHeader>
              <CardTitle>Add new appointment type</CardTitle>
              <CardDescription>Create new appointment type that allows people to book you!</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <CardContent>
                  {/* title field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* url slug  */}
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug</FormLabel>
                        <FormControl>
                          <div className="flex rounded-md">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-muted-foreground text-sm">
                              CalPro.com/
                            </span>
                            <Input
                              placeholder="example-user-1"
                              className="rounded-l-none"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="30 min meeting" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Duration Field */}
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Select 
                            {...field} 
                            value={String(field.value)}
                            onValueChange={(value) => field.onChange(parseInt(value, 10))} 
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select the duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Duration</SelectLabel>
                                <SelectItem value="15">15 Mins</SelectItem>
                                <SelectItem value="30">30 Mins</SelectItem>
                                <SelectItem value="45">45 Mins</SelectItem>
                                <SelectItem value="60">60 Mins</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Video Call Provider Buttons */}
                  <FormField
                    control={form.control}
                    name="videoCallSoftware"
                    render={() => (
                      <FormItem>
                        <FormLabel>Video Call Provider</FormLabel>
                        <FormControl>
                          <ButtonGroup className="w-full">
                            <Button
                              onClick={() => form.setValue("videoCallSoftware" ,"Zoom Meeting")}
                              type="button"
                              className="w-full"
                            >
                              Zoom
                            </Button>
                            <Button
                              onClick={() => form.setValue("videoCallSoftware" ,"Google Meet")}
                              type="button"
                              className="w-full"
                            >
                              Google Meet
                            </Button>
                            <Button
                              onClick={() => form.setValue("videoCallSoftware" ,"Microsoft Teams")}
                              type="button"
                              className="w-full"
                            >
                              Microsoft Teams
                            </Button>
                          </ButtonGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className=' flex justify-between items-center'>
                  <Button asChild variant="secondary">
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                  <SubmitButton text='Create new event' loading={loading} />
                </CardFooter>
              </form>
            </Form>            
        </Card>
    </div>
  )
}
