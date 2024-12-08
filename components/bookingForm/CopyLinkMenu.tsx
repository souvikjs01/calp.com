'use client'
import React from 'react'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { Link2 } from 'lucide-react'
import { Toast } from '../ui/toast'

export default function CopyLinkMenuItem({meetingUrl}: {meetingUrl: string}) {
  const handleCopy = async () => {
    try {
        await navigator.clipboard.writeText(meetingUrl)
    } catch (error) {
        console.log(error);
    }
  }
  return (
    <DropdownMenuItem onSelect={handleCopy}>
        <Link2 className=' mr-2 size-4'/>
        Copy
    </DropdownMenuItem>
  )
}
