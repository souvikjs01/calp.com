import { prisma } from '@/lib/db';
import { nylas } from '@/lib/nylas';
import { Prisma } from '@prisma/client';
import { addMinutes, format, fromUnixTime, isAfter, isBefore, parse} from 'date-fns'
import Link from 'next/link';
import { GetFreeBusyRequest, GetFreeBusyResponse, NylasResponse } from 'nylas';
import { start } from 'repl';
import { Button } from '../ui/button';

async function getData(userName: string, selectedDate: Date) {
    const currentDay = format(selectedDate, 'EEEE');

    const startDay = new Date(selectedDate);
    startDay.setHours(0, 0, 0, 0);

    const endDay = new Date(selectedDate);
    endDay.setHours(23, 59, 59, 999)

    const data = await prisma.availability.findFirst({
        where: {
            day: currentDay as Prisma.EnumDayFilter,
            User: {
                userName: userName,
            },
        },
        select: {
            fromTime: true,
            tillTime: true,
            id: true,
            User: {
                select: {
                    grantEmail: true,
                    grantId: true,
                }
            }
        }
    });
    const nylasCalendarData = await nylas.calendars.getFreeBusy({
        identifier: data?.User?.grantId as string,
        requestBody: {
            startTime: Math.floor(startDay.getTime()/ 1000),
            endTime: Math.floor(endDay.getTime()/1000),
            emails: [data?.User?.grantEmail as string]
        }
    })

    return {
        data,
        nylasCalendarData
    }
}
interface AppProps {
    selectedDate: Date;
    userName: string;
    duration: number;
}

function calculateAvailableTimeSlots(date: string, dbAvailability: 
    {
        fromTime: string | undefined;
        tillTime: string | undefined;
    },
    nylasData: NylasResponse<GetFreeBusyResponse[]>,
    duration: number,

) {
    const now = new Date();
    const availableForm = parse(
        `${date} ${dbAvailability.fromTime}`, 
        'yyyy-MM-dd HH:mm',
        new Date()
    );
    const availableTill = parse(
        `${date} ${dbAvailability.tillTime}`, 
        'yyyy-MM-dd HH:mm',
        new Date()
    );
    // console.log(nylasData.data[0].timeSlots);
    // @ts-ignorey
    const busySlots = nylasData.data[0].timeSlots.map((slot) => (
        {
            start: fromUnixTime(slot.startTime),
            end: fromUnixTime(slot.endTime)
        }
    ));
    
    const allSlots = [];
    let currentSlot = availableForm;
    
    while(isBefore(currentSlot, availableTill)) {
        allSlots.push(currentSlot);
        currentSlot = addMinutes(currentSlot, duration)
    }
    const freeSlots = allSlots.filter((slot) => {
        const slotEnd = addMinutes(slot, duration)

        return (
            isAfter(slot, now) && 
            !busySlots.some(
                (busy: { start: any; end: any }) => 
                    (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) || 
                    (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
                    (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
            )
        )
    });
    
    const temp = freeSlots.map((slot) => format(slot, 'HH:mm'));
    return temp;
}

export default async function TimeTable({ selectedDate, userName, duration  }: AppProps) {
  const { data, nylasCalendarData } = await getData(userName, selectedDate);
  
  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  const dbAvailability = {
    fromTime: data?.fromTime,
    tillTime: data?.tillTime,
  };

  const availableSlots = calculateAvailableTimeSlots(formattedDate, dbAvailability, nylasCalendarData, 30)

  
  
  return (
    <div className=' px-4'>
        <p className=' text-base font-semibold'>
            {format(selectedDate, 'EEE')}{' '}
            <span  className=' text-sm text-muted-foreground'>{format(selectedDate, 'MMM. d')}</span>    
        </p>

        <div className=' mt-3 max-h-[350px] overflow-auto'>
            {availableSlots.length > 0 ? (
                availableSlots.map((slot, idx) => (
                    <Link href={`?date=${format(selectedDate, "yyyy-MM-dd")}&time=${slot}`} key={idx}>
                        <Button variant='outline' className=' w-full mb-2'>
                            {slot}
                        </Button>
                    </Link>
                ))
            ) : (
                <p>No time slots available</p>
            )}
        </div>
    </div>
  )
}
