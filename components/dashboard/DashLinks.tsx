"use client"
import { cn } from '@/lib/utils';
import { CalendarCheck, HomeIcon, LucideProps, Settings, User2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { ForwardRefExoticComponent, RefAttributes } from 'react'
interface IappProps {
    id: number;
    name: string;
    href: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}
export const dashboardLinks: IappProps[] = [
    {
        id: 0,
        name: "Event Types",
        href: "/dashboard",
        icon: HomeIcon
    },
    {
        id: 1,
        name: "Meeting",
        href: "/dashboard/meetings",
        icon: User2
    },
    {
        id: 2,
        name: "Availablity",
        href: "/dashboard/availability",
        icon: CalendarCheck
    },
    {
        id: 3,
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings
    },
]
export default function DashLinks() {
    const pathname = usePathname();
  return (
    <>
        {dashboardLinks.map((link) => (
            <Link key={link.id} href={link.href} className={cn(
                pathname === link.href ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground',
                " flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
            )}>
                <link.icon className=' size-4'/>
                {link.name}
            </Link>
        ))}
    </>
  )
}
