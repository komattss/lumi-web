"use client";

import { useState } from "react";
import {
  Menu,
  X,
  Home,
  Map,
  CheckSquare,
  ShoppingBag,
  User,
  Settings,
  Cloud,
  Calculator,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Maps", href: "/maps", icon: Map },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Store", href: "/store", icon: ShoppingBag },
  { name: "Weather", href: "/weather", icon: Cloud },
  { name: "Calculator", href: "/calculator", icon: Calculator },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent"
          >
            Lumi
          </motion.h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={20} />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div
          className={cn(
            "text-xs text-muted-foreground",
            collapsed && "text-center"
          )}
        >
          {!collapsed ? "© 2025 Lumi" : "©"}
        </div>
      </div>
    </aside>
  );
}
