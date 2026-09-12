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
      <SidebarHeader className="p-5 flex items-center justify-between border-b border-transparent group-data-[collapsible=icon]:p-3 transition-all duration-300">
        <Link href={navItems[0]?.url || "#"} className="flex items-center gap-3 overflow-hidden group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-transparent group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                <img src="/rentTrack_logo_ver2.png" alt="RentTrack Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-black tracking-tight whitespace-nowrap group-data-[collapsible=icon]:hidden">
                Rent<span className="text-cyan-500">Track</span>
            </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4 custom-scrollbar">
        <NavMain label={navLabel} items={navItems} />
      </SidebarContent>
      
      <SidebarFooter className="p-2 border-t border-slate-200/60 dark:border-white/5 group-data-[collapsible=icon]:items-center">
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
