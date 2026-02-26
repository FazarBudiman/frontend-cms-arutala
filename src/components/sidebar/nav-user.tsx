"use client";

import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/features/user";
import { logoutAction } from "@/features/auth";
import { Button } from "../ui/button";
import { Item, ItemContent, ItemDescription, ItemHeader, ItemMedia, ItemTitle } from "../ui/item";
import { formatSnakeCaseToTitle } from "@/shared/utils/string";

export function NavUser({ user }: { user?: User }) {
  const router = useRouter();
  if (!user) return null;

  const handleLogout = async () => {
    toast.promise(logoutAction(), {
      loading: "Sign Out...",
      success: () => {
        router.push("/sign-in");
        return "Sign Out Berhasil";
      },
      error: (err) => err.message || "Sign Out Gagal",
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* ===== Trigger ===== */}
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <Avatar>
                <AvatarImage src={user.user_profile_url || undefined} alt={user.username} />
                <AvatarFallback className="bg-primary-900 text-white">{user.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          {/* ===== Content ===== */}
          <DropdownMenuContent align="end" sideOffset={6} className="rounded-md">
            {/* ===== Profile Header ===== */}
            <DropdownMenuLabel>
              <Item>
                <ItemHeader>
                  <Badge variant="outline">{formatSnakeCaseToTitle(user.role_name)}</Badge>
                </ItemHeader>
                <ItemMedia>
                  <Avatar size="lg">
                    <AvatarImage src={user.user_profile_url || undefined} alt={user.username} />
                    <AvatarFallback className="bg-primary-900 text-white">{user.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent className="gap-0">
                  <ItemTitle>{user.full_name}</ItemTitle>
                  <ItemDescription>{user.username}</ItemDescription>
                </ItemContent>
              </Item>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* ===== Logout ===== */}
            <DropdownMenuLabel className="flex justify-end">
              <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full">
                Log Out
                <IconLogout />
              </Button>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
