"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/admin/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import UserDropdown from "@/components/admin/user-dropdown";
import { ReactNode } from "react";
import {useAuth} from "@/api/stores/auth";
import AuthLayout from "@/components/auth/layout";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="bg-sidebar group/sidebar-inset antialiased flex flex-col h-screen">
                    <header className="dark flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-sidebar text-sidebar-foreground relative z-10 before:absolute before:inset-y-3 before:-left-px before:w-px before:bg-gradient-to-b before:from-white/5 before:via-white/15 before:to-white/5">
                        <SidebarTrigger className="-ms-2" />
                        <div className="flex items-center gap-8 ml-auto">
                            <UserDropdown />
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto bg-[hsl(240_5%_92.16%)] md:rounded-t-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-t-none transition-all ease-in-out duration-300">
                        <div className="p-4 sm:p-6 lg:p-10">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}