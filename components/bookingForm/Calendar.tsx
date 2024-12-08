'use client'
import React from 'react'
import {useCalendar, useLocale} from 'react-aria';
import {useCalendarState} from 'react-stately';
import {createCalendar} from '@internationalized/date';
import { CalendarProps, DateValue } from '@react-types/calendar';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';


export default function Calendar(props: CalendarProps<DateValue> & {
  isDateUnavailable?: (date: DateValue) => boolean
}) {
    const { locale } = useLocale();
    let state = useCalendarState({
        ...props,
        visibleDuration: {months: 1},
        locale,
        createCalendar
    });
    let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
        props,
        state
    );
  return (
    <div {...calendarProps} className=' inline-block'>
      <CalendarHeader 
        calendarProps={calendarProps} 
        state={state}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}        
      />

      <div className=' flex gap-6'>
          <CalendarGrid 
            state={state}
            isDateUnavailable={props.isDateUnavailable}
          />
      </div>
    </div>
  )
}
