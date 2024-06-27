"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "./mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "./ui/separator";
import Link from "next/link";
import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function NavBar() {
  const { isAuthenticated, user } = useKindeBrowserClient();
  return (
    <div className="dark:bg-gray-900 bg-gray-100">
      <div className="p-5 lg:container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image src="/bid.png" alt="logo" width={50} height={50} />
          <h1 className="text-lg font-bold">BidMaster</h1>
        </Link>

        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link">
                    <Avatar>
                      <AvatarImage
                        src={
                          user?.picture ??
                          `https://avatar.vercel.sh/${
                            user?.given_name as string
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
                  {user?.given_name ? (
                    <h1>{user.given_name as string}</h1>
                  ) : (
                    <h1>User</h1>
                  )}

                  <h2 className="text-sm text-gray-500 mb-2">{user?.email}</h2>
                  <Separator />
                  <Button type="submit" variant="link"></Button>
                </DropdownMenuContent>
              </DropdownMenu>
              <ModeToggle />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button type="submit">
                <LoginLink>Sign in </LoginLink>
              </Button>
              <Button type="submit">
                <RegisterLink>Register</RegisterLink>
              </Button>
              <ModeToggle />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
