// apps/dashboard/src/app/(dashboard)/_components/AdminNav.tsx
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@package/ui/lib/utils";
import {
  Users,
  Settings,
  CreditCard,
  LayoutDashboard,
  Mail,
  UserPlus,
  Shield,
} from "lucide-react";
import { useUser } from "@/hooks/use-user";

interface AdminNavProps {
  className?: string;
}

export function AdminNav({ className }: AdminNavProps) {
  const pathname = usePathname();
  const { user } = useUser();

  // Only show Admin navigation if user has the correct role
  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    return null;
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-4 w-4" />,
      active: pathname === "/admin",
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-4 w-4" />,
      active: pathname.startsWith("/admin/users"),
    },
    {
      title: "Subscriptions",
      href: "/admin/subscriptions",
      icon: <CreditCard className="h-4 w-4" />,
      active: pathname.startsWith("/admin/subscriptions"),
    },
    {
      title: "Leads",
      href: "/admin/leads",
      icon: <UserPlus className="h-4 w-4" />,
      active: pathname.startsWith("/admin/leads"),
    },
    {
      title: "Newsletter",
      href: "/admin/newsletter",
      icon: <Mail className="h-4 w-4" />,
      active: pathname.startsWith("/admin/newsletter"),
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-4 w-4" />,
      active: pathname.startsWith("/admin/settings"),
    },
  ];

  // Add super admin only items
  if (user?.role === "SUPER_ADMIN") {
    navItems.push({
      title: "Permissions",
      href: "/admin/permissions",
      icon: <Shield className="h-4 w-4" />,
      active: pathname.startsWith("/admin/permissions"),
    });
  }

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            item.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {item.icon}
          <span className="ml-2">{item.title}</span>
        </Link>
      ))}
    </nav>
  );
}
