"use client";

import { motion } from "framer-motion";
import { Map, CheckSquare, ShoppingBag, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const modules = [
  {
    title: "Maps",
    description: "Explore interactive maps and discover locations",
    icon: Map,
    href: "/maps",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Tasks",
    description: "Manage your to-do list and stay productive",
    icon: CheckSquare,
    href: "/tasks",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Store",
    description: "Browse products and shop with ease",
    icon: ShoppingBag,
    href: "/store",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Profile",
    description: "View and manage your personal information",
    icon: User,
    href: "/profile",
    color: "from-orange-500 to-red-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to Lumi
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your interactive mini-superapp for maps, tasks, shopping, and more
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <motion.div key={module.title} variants={item}>
                <Link href={module.href}>
                  <Card className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 glow-card h-full">
                    <CardHeader>
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {module.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                        Explore
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-sm text-muted-foreground">
            Built with Next.js, React, Tailwind CSS, and Framer Motion
          </p>
        </motion.div>
      </div>
    </div>
  );
}
