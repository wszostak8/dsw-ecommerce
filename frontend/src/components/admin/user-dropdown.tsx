"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import {
  RiLogoutCircleLine,
} from "@remixicon/react";
import {useAuth} from "@/api/stores/auth";

export default function UserDropdown() {
  const { user, logout } = useAuth();

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar className="size-10">
            <AvatarFallback className="">{firstLetter}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 p-2" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col py-0 px-1 mb-2">
          <span className="truncate text-sm font-medium text-foreground mb-0.5">
            {user?.name}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuItem className="gap-3 px-1">
          <span>Przejdź do swojego konta</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-3 px-1" onClick={ () => logout()}>
          <RiLogoutCircleLine
            size={20}
            className="text-muted-foreground/70"
            aria-hidden="true"
          />
          <span>Wyloguj się</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
