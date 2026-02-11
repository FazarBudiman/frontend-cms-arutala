"use client";

import { IconLogout } from "@tabler/icons-react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

import { User } from "@/features/user/type";
import { logoutAction } from "@/features/auth";

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

  const roleBadgeClass = user.role_name === "SUPER_ADMIN" ? "bg-black text-white" : "bg-muted text-muted-foreground";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* ===== Trigger ===== */}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="flex items-center gap-2 data-[state=open]:bg-sidebar-accent">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.user_profile_url || undefined} alt={user.username} />
                <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>

              <ChevronDown className="h-4 w-4 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* ===== Content ===== */}
          <DropdownMenuContent align="end" sideOffset={6} className="min-w-64 rounded-xl p-2">
            {/* ===== Profile Header ===== */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-3">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage src={user.user_profile_url || undefined} alt={user.username} />
                  <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-0.5">
                  <p className="truncate text-sm font-semibold">{user.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">@{user.username}</p>

                  <Badge className={`mt-1 w-fit px-2 py-0.5 text-[10px] ${roleBadgeClass}`}>{user.role_name}</Badge>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-2" />

            {/* ===== Logout ===== */}
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <IconLogout className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
