"use client";
import { auth } from "@/server/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
type SignOutProps = {
  className: string;
};
export function SignOut({ className }: SignOutProps) {

  return (
    <div>
      <Card className={cn(className, "bg-white/10 text-white")}>
        <CardHeader>
          <CardTitle>Logout</CardTitle>
          <CardDescription>
            Ready to logout ?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              signOut({ redirectTo: "/" });
            }}
            className="w-full"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
