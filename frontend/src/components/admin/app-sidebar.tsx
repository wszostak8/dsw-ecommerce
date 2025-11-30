"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/admin/ui/sidebar";
import {
  RiArrowDownSLine,
  RiListUnordered,
  RiMoneyDollarCircleFill,
} from "@remixicon/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const data = {
  navMain: [
    {
      title: "PANEL ADMINISTRATORA",
      items: [
        {
          title: "Zamówienia",
          url: "/admin/orders",
          icon: RiMoneyDollarCircleFill,
        },
        {
          title: "Produkty",
          url: "#",
          icon: RiListUnordered,
          items: [
            { title: "Lista produktów", url: "/admin/products/list" },
            { title: "Dodaj produkt", url: "/admin/products/add" },
          ],
        }
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentPath = usePathname();

  return (
      <Sidebar {...props} className="dark !border-none">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>

        <SidebarContent>
          {/* --- PANEL ADMINISTRATORA --- */}
          <SidebarGroup>
            <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
              {data.navMain[0].title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {data.navMain[0].items.map((item) => {
                  const isActive =
                      currentPath === item.url ||
                      item.items?.some((sub) => currentPath?.startsWith(sub.url));

                  if (item.items && item.items.length > 0) {
                    return (
                        <Collapsible key={item.title} asChild defaultOpen={isActive}>
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                  className="group/menu-button font-medium gap-3 h-9 rounded-md transition-colors data-[active=true]:bg-sidebar-primary"
                                  isActive={isActive}
                              >
                                {item.icon && (
                                    <item.icon
                                        className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-sidebar-foreground"
                                        size={22}
                                        aria-hidden="true"
                                    />
                                )}
                                <span>{item.title}</span>
                                <RiArrowDownSLine
                                    className="ml-auto text-sidebar-foreground/50 transition-transform group-data-[state=open]/collapsible:rotate-180"
                                    size={16}
                                />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-1">
                              <SidebarMenuSub className="w-[98%] gap-1">
                                {item.items.map((subItem) => {
                                  const subActive = currentPath === subItem.url;
                                  return (
                                      <SidebarMenuSubItem key={subItem.title}>
                                        <SidebarMenuSubButton asChild isActive={subActive}>
                                          <Link href={subItem.url}>
                                            <span>{subItem.title}</span>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                    );
                  }

                  return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className="group/menu-button font-medium gap-3 h-9 rounded-md transition-colors data-[active=true]:bg-sidebar-primary"
                        >
                          <Link href={item.url}>
                            {item.icon && (
                                <item.icon
                                    className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-sidebar-foreground"
                                    size={22}
                                    aria-hidden="true"
                                />
                            )}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
}