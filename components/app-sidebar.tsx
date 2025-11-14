"use client"

import * as React from "react"
import {

  IconChartBar,
  IconDashboard,

  IconHelp,

  IconListDetails,

  IconSettings,
  IconUsers,
  IconShoppingCartFilled
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
      link:"dashboard"
    },
    {
      title: "borradores",
      url: "#",
      icon: IconListDetails,
      link:"borradores"
    },
    {
      title: "Analiticas",
      url: "#",
      icon: IconChartBar,
    },

    {
      title: "Empleados",
      url: "#",
      icon: IconUsers,
      link:"empleados"
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Ayuda",
      url: "#",
      icon: IconHelp,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconShoppingCartFilled className="!size-5" />
                <span className="text-base font-semibold">Merca Horarios</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        
            <NavMain   items={data.navMain}  />
  
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
