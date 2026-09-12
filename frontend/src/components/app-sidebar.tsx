"use client"

import * as React from "react"
import Link from "next/link"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ 
  navLabel,
  navItems,
  user,
  onLogout,
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  navLabel: string
  navItems: any[]
  user: {
    name: string
    email: string
    avatar: string
    role: string
  }
  onLogout: () => void
}) {
  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200/60 dark:border-white/5 bg-white dark:bg-[#0a0a0a]" {...props}>
      <SidebarHeader className="mt-1 sm:mt-2 px-5 pt-2 pb-1 flex items-center justify-between border-b border-transparent group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center transition-all duration-300">
        <Link href={navItems[0]?.url || "#"} className="flex items-center gap-3 overflow-hidden group/logo">
            <div className="w-12 h-12 sm:w-14 sm:h-14 group-data-[collapsible=icon]:!w-8 group-data-[collapsible=icon]:!h-8 rounded-xl flex items-center justify-center shrink-0 bg-transparent group-hover/logo:scale-105 group-hover/logo:rotate-3 transition-all duration-300">
                <img src="/rentTrack_logo_ver2.png" alt="RentTrack Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <span className="text-2xl font-black tracking-tight whitespace-nowrap group-data-[collapsible=icon]:hidden">
                Rent<span className="text-cyan-500">Track</span>
            </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="pb-4 group-data-[collapsible=icon]:pb-2 custom-scrollbar">
        <NavMain label={navLabel} items={navItems} />
      </SidebarContent>
      
      <SidebarFooter className="p-2 border-t border-slate-200/60 dark:border-white/5 group-data-[collapsible=icon]:items-center">
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
