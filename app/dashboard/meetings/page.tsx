import { CancelMeetingAction } from "@/actions/cancelMeeting";
import EmptyState from "@/components/events/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db"
import requireUser from "@/lib/hooks";
import { nylas } from "@/lib/nylas";
import { format, fromUnixTime } from "date-fns";
import { Video } from "lucide-react";

async function getData(userId: string) {
  const userData = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        grantId: true,
        grantEmail: true
    }
  });

  if(!userData) {
    throw new Error('User not found');
  }

  const data = await nylas.events.list({
    identifier: userData.grantId as string,
    queryParams: {
      calendarId: userData.grantEmail as string
    }
  });

  return data;
}

export default async function MeetingsRoute() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  console.log(data);
  
  return (
    <>
      {data.data.length < 1 ? (
        <EmptyState 
          title="No meetings found" 
          description="You don't have any meetings yet" 
          buttonText="Create a new event type" 
          href="/dashboard/new"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>See up coming event which where booked with and see the event type link.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.data.map((item) => (
              <form action={CancelMeetingAction} key={item.id}>
                <input type="hidden" name="eventId" value={item.id}/>
                <div className=" grid grid-cols-3 justify-between items-center" >
                  <div>
                    {/* @ts-ignore */}
                    <p className=" text-muted-foreground text-sm">{format(fromUnixTime(item.when.startTime), "EEE, dd MMM")}</p>
                    <p className=" text-muted-foreground text-xs pt-1">
                      {/* @ts-ignore */}
                      {format(fromUnixTime(item.when.startTime), "hh:mm a")} - {" "}
                      {/* @ts-ignore */}
                      {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                    </p>

                    <div className=" flex items-center mt-1">
                      <Video className=" size-4 mr-2 text-primary"/>
                      <a
                        /* @ts-ignore */
                        href={item.conferencing.details.url} 
                        className=" text-xs text-pretty underline underline-offset-4 text-blue-700"
                        target="_blank"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>

                  <div className=" flex flex-col items-start">
                    <h2 className=" text-sm font-medium">{item.title}</h2>
                    <p className=" text-sm text-muted-foreground">You an {item.participants[0].name}</p>
                  </div>

                  <Button variant='destructive' className=" w-fit flex ml-auto">Cancel Event</Button>
                </div>
              </form>
            ))}
          </CardContent>
        </Card>
      )}
    
    </>
  )
}
