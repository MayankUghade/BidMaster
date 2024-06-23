"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

export default function NavBar() {
  const { data: session } = useSession();
  return (
    <div className="dark:bg-gray-900 bg-gray-100">
      <div className="p-5 lg:container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/bid.png" alt="logo" width={50} height={50} />
          <h1 className="text-lg font-bold sm:flex hidden">BidMaster</h1>
        </div>

        <div className="flex items-center">
          {session ? (
            <div className="flex items-center">
              <Button>Your Posts</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link">
                    <Avatar>
                      <AvatarImage
                        src={
                          session.user?.image ??
                          `https://avatar.vercel.sh/${
                            session.user?.name as string
                          }`
                        }
                        alt="@shadcn"
                      />
                      <AvatarFallback>SK</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[240px] p-3"
                  align="end"
                  forceMount
                >
                  {session.user?.name ? (
                    <h1>{session.user?.name as string}</h1>
                  ) : (
                    <h1>User</h1>
                  )}

                  <h2 className="text-sm text-gray-500 mb-2">
                    {session.user?.email}
                  </h2>
                  <DropdownMenuSeparator />
                  <Button
                    type="submit"
                    variant="link"
                    onClick={() => signOut()}
                  >
                    LogOut
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button type="submit" onClick={() => signIn()}>
                SignIn
              </Button>
              <ModeToggle />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
