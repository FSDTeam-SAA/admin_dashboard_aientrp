import { ImageIcon, Package, Clapperboard, Users, Shapes, Settings } from "lucide-react";

export const dashboardNavItems = [
  { href: "/dashboard/banner", label: "Banner", icon: ImageIcon },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/reels", label: "Reels", icon: Clapperboard },
  { href: "/dashboard/user", label: "User", icon: Users },
  { href: "/dashboard/category", label: "Category", icon: Shapes },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];
