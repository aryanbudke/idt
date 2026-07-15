"use client";

import * as React from "react";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserDropdown() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const name = user ? user.fullName || user.username || "College User" : "ERP User";
  const email = user ? user.primaryEmailAddress?.emailAddress || "" : "";
  const imageUrl = user?.imageUrl;
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/sign-in";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="relative h-9 w-9 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0">
            <Avatar className="h-9 w-9">
              {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initial}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className="w-56 rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">{name}</p>
            {email && (
              <p className="text-xs leading-none text-on-surface-variant">
                {email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-outline-variant" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer flex items-center gap-2 hover:bg-surface-variant">
            <UserIcon className="h-4 w-4 text-on-surface-variant" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer flex items-center gap-2 hover:bg-surface-variant">
            <Settings className="h-4 w-4 text-on-surface-variant" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-outline-variant" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-error focus:text-error flex items-center gap-2 hover:bg-error-container hover:text-on-error-container"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
