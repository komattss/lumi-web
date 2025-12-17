"use client";

import { motion } from "framer-motion";
import {
  Map,
  CheckSquare,
  ShoppingBag,
  User,
  ArrowRight,
  Cloud,
  Calculator,
  MessageCircle,
  Sparkles,
  Settings,
  ChevronDown,
  ChevronUp,
  Plus,
  Navigation,
  ListTodo,
  CloudRain,
  Clock,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Carousel, CarouselSlide } from "@/components/ui/carousel";
import { Footer } from "@/components/common/Footer";

const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    title: "Lumi",
    description: "Mini-superapp untuk produktivitas dan lifestyle Anda",
    gradient: "from-purple-600 via-pink-500 to-red-500",
  },
  {
    id: 2,
    title: "Mulai Sekarang",
    description: "Navigasi lokasi • Kelola tugas • Cek cuaca • Hitung cepat",
    gradient: "from-blue-600 via-cyan-500 to-teal-500",
  },
  {
    id: 3,
    title: "Tetap Terhubung",
    description: "Chat dengan teman • Belanja online • Atur profil Anda",
    gradient: "from-green-600 via-emerald-500 to-lime-500",
  },
];

// Quick Actions - High-frequency daily tasks
const quickActions = [
  {
    label: "Cari Lokasi",
    description: "Temukan tempat terdekat",
    icon: Navigation,
    href: "/maps",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    hoverBg: "hover:bg-blue-500/20",
    textColor: "text-blue-500",
  },
  {
    label: "Tambah Tugas",
    description: "Buat to-do baru",
    icon: Plus,
    href: "/tasks",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    hoverBg: "hover:bg-green-500/20",
    textColor: "text-green-500",
  },
  {
    label: "Cek Cuaca",
    description: "Lihat prakiraan hari ini",
    icon: CloudRain,
    href: "/weather",
    color: "from-sky-500 to-blue-500",
    bgColor: "bg-sky-500/10",
    hoverBg: "hover:bg-sky-500/20",
    textColor: "text-sky-500",
  },
  {
    label: "Kirim Pesan",
    description: "Mulai chat cepat",
    icon: MessageCircle,
    href: "/chat",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    hoverBg: "hover:bg-pink-500/20",
    textColor: "text-pink-500",
  },
];

// Personalized sections - simulating user behavior
const recentlyUsed = [
  {
    title: "Weather",
    description: "Terakhir dibuka 5 menit lalu",
    icon: Cloud,
    href: "/weather",
    color: "from-sky-500 to-blue-500",
    timeAgo: "5m",
  },
  {
    title: "Tasks",
    description: "3 tugas menunggu",
    icon: CheckSquare,
    href: "/tasks",
    color: "from-green-500 to-emerald-500",
    timeAgo: "2h",
  },
  {
    title: "Maps",
    description: "Terakhir dicari: Cafe",
    icon: Map,
    href: "/maps",
    color: "from-blue-500 to-cyan-500",
    timeAgo: "1d",
  },
];

const continueActions = [
  {
    title: "Lanjutkan Chat",
    description: "2 pesan belum dibaca dari Alex",
    icon: MessageCircle,
    href: "/chat",
    color: "from-pink-500 to-rose-500",
    badge: "2",
  },
  {
    title: "Selesaikan Tugas",
    description: "Meeting Preparation - 80% selesai",
    icon: CheckSquare,
    href: "/tasks",
    color: "from-green-500 to-emerald-500",
    badge: "80%",
  },
];

const suggestedForYou = [
  {
    title: "Cek Cuaca Sore",
    description: "Biasanya Anda cek cuaca jam ini",
    icon: Cloud,
    href: "/weather",
    color: "from-sky-500 to-blue-500",
    reason: "Kebiasaan harian",
  },
  {
    title: "Belanja Kebutuhan",
    description: "Promo spesial minggu ini",
    icon: ShoppingBag,
    href: "/store",
    color: "from-purple-500 to-pink-500",
    reason: "Rekomendasi",
  },
];

// Primary modules - 4 core features
const primaryModules = [
  {
    title: "Maps",
    description: "Explore interactive maps and discover locations",
    icon: Map,
    href: "/maps",
    color: "from-blue-500 to-cyan-500",
    hoverColor: "hover:border-blue-500/50",
    textColor: "group-hover:text-blue-500",
    buttonColor: "text-blue-500",
    buttonText: "Jelajahi Peta",
  },
  {
    title: "Tasks",
    description: "Manage your to-do list and stay productive",
    icon: CheckSquare,
    href: "/tasks",
    color: "from-green-500 to-emerald-500",
    hoverColor: "hover:border-green-500/50",
    textColor: "group-hover:text-green-500",
    buttonColor: "text-green-500",
    buttonText: "Kelola Tugas",
  },
  {
    title: "Weather",
    description: "Real-time weather updates for any location",
    icon: Cloud,
    href: "/weather",
    color: "from-sky-500 to-blue-500",
    hoverColor: "hover:border-sky-500/50",
    textColor: "group-hover:text-sky-500",
    buttonColor: "text-sky-500",
    buttonText: "Lihat Cuaca",
  },
  {
    title: "Chat",
    description: "Connect and chat with friends instantly",
    icon: MessageCircle,
    href: "/chat",
    color: "from-pink-500 to-rose-500",
    hoverColor: "hover:border-pink-500/50",
    textColor: "group-hover:text-pink-500",
    buttonColor: "text-pink-500",
    buttonText: "Mulai Chat",
  },
];

// Secondary modules - less frequently used
const secondaryModules = [
  {
    title: "Calculator",
    description: "Advanced calculator with history",
    icon: Calculator,
    href: "/calculator",
    color: "from-violet-500 to-purple-500",
    hoverColor: "hover:border-violet-500/50",
    textColor: "group-hover:text-violet-500",
    buttonColor: "text-violet-500",
    buttonText: "Hitung",
  },
  {
    title: "Store",
    description: "Browse products and shop with ease",
    icon: ShoppingBag,
    href: "/store",
    color: "from-purple-500 to-pink-500",
    hoverColor: "hover:border-purple-500/50",
    textColor: "group-hover:text-purple-500",
    buttonColor: "text-purple-500",
    buttonText: "Belanja",
  },
  {
    title: "Profile",
    description: "View and manage your personal information",
    icon: User,
    href: "/profile",
    color: "from-orange-500 to-red-500",
    hoverColor: "hover:border-orange-500/50",
    textColor: "group-hover:text-orange-500",
    buttonColor: "text-orange-500",
    buttonText: "Lihat Profil",
  },
  {
    title: "Settings",
    description: "Customize your experience and preferences",
    icon: Settings,
    href: "/settings",
    color: "from-gray-500 to-slate-500",
    hoverColor: "hover:border-gray-500/50",
    textColor: "group-hover:text-gray-500",
    buttonColor: "text-gray-500",
    buttonText: "Atur Preferensi",
  },
];

const modules = [
  {
    title: "Maps",
    description: "Explore interactive maps and discover locations",
    icon: Map,
    href: "/maps",
    color: "from-blue-500 to-cyan-500",
    hoverColor: "hover:border-blue-500/50",
    textColor: "group-hover:text-blue-500",
    buttonColor: "text-blue-500",
  },
  {
    title: "Tasks",
    description: "Manage your to-do list and stay productive",
    icon: CheckSquare,
    href: "/tasks",
    color: "from-green-500 to-emerald-500",
    hoverColor: "hover:border-green-500/50",
    textColor: "group-hover:text-green-500",
    buttonColor: "text-green-500",
  },
  {
    title: "Weather",
    description: "Real-time weather updates for any location",
    icon: Cloud,
    href: "/weather",
    color: "from-sky-500 to-blue-500",
    hoverColor: "hover:border-sky-500/50",
    textColor: "group-hover:text-sky-500",
    buttonColor: "text-sky-500",
  },
  {
    title: "Calculator",
    description: "Advanced calculator with history",
    icon: Calculator,
    href: "/calculator",
    color: "from-violet-500 to-purple-500",
    hoverColor: "hover:border-violet-500/50",
    textColor: "group-hover:text-violet-500",
    buttonColor: "text-violet-500",
  },
  {
    title: "Chat",
    description: "Connect and chat with friends instantly",
    icon: MessageCircle,
    href: "/chat",
    color: "from-pink-500 to-rose-500",
    hoverColor: "hover:border-pink-500/50",
    textColor: "group-hover:text-pink-500",
    buttonColor: "text-pink-500",
  },
  {
    title: "Store",
    description: "Browse products and shop with ease",
    icon: ShoppingBag,
    href: "/store",
    color: "from-purple-500 to-pink-500",
    hoverColor: "hover:border-purple-500/50",
    textColor: "group-hover:text-purple-500",
    buttonColor: "text-purple-500",
  },
  {
    title: "Profile",
    description: "View and manage your personal information",
    icon: User,
    href: "/profile",
    color: "from-orange-500 to-red-500",
    hoverColor: "hover:border-orange-500/50",
    textColor: "group-hover:text-orange-500",
    buttonColor: "text-orange-500",
  },
  {
    title: "Settings",
    description: "Customize your experience and preferences",
    icon: Settings,
    href: "/settings",
    color: "from-gray-500 to-slate-500",
    hoverColor: "hover:border-gray-500/50",
    textColor: "group-hover:text-gray-500",
    buttonColor: "text-gray-500",
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
  const [showMoreTools, setShowMoreTools] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-3 py-4 md:px-4 md:py-8">
        {/* Hero - Brief Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 md:mb-8"
        >
          <div className="h-[180px] md:h-[280px] relative">
            <Carousel
              slides={carouselSlides}
              autoPlay
              autoPlayInterval={5000}
            />
          </div>
        </motion.div>

        {/* Quick Actions - High-Frequency Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6 md:mb-10 pb-5 md:pb-6 border-b border-border/50"
        >
          <div className="max-w-5xl mx-auto">
            <div className="mb-3 px-0.5">
              <h3 className="text-sm md:text-lg font-semibold">Aksi Cepat</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tugas yang sering Anda lakukan
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                  >
                    <Link href={action.href}>
                      <div
                        className={`group ${action.bgColor} ${action.hoverBg} rounded-xl md:rounded-2xl p-3 md:p-4 transition-all duration-300 hover:shadow-lg active:scale-95 md:hover:scale-105 border border-transparent hover:border-${action.textColor}/20 cursor-pointer min-h-[100px] md:min-h-0`}
                      >
                        <div className="flex flex-col items-center text-center gap-1.5 md:gap-2">
                          <div
                            className={`w-11 h-11 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}
                          >
                            <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-xs md:text-base text-foreground leading-tight">
                              {action.label}
                            </p>
                            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Personalized & Contextual Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 md:mb-10 pb-5 md:pb-6 border-b border-border/50"
        >
          <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
            {/* Recently Used */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-0.5">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <h3 className="text-sm md:text-lg font-semibold">
                  Baru Saja Digunakan
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-4">
                {recentlyUsed.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    >
                      <Link href={item.href}>
                        <Card className="group cursor-pointer hover:shadow-lg active:scale-98 transition-all duration-300 border md:border-2 hover:border-primary/30">
                          <CardContent className="p-3 md:p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}
                              >
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm mb-1">
                                  {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {item.description}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                  <span className="text-xs text-primary font-medium">
                                    {item.timeAgo}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Continue Where You Left Off */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-0.5">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                <h3 className="text-sm md:text-lg font-semibold">
                  Lanjutkan Aktivitas
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
                {continueActions.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    >
                      <Link href={item.href}>
                        <Card className="group cursor-pointer hover:shadow-lg active:scale-98 transition-all duration-300 border md:border-2 hover:border-orange-500/30 bg-gradient-to-br from-card to-orange-500/5">
                          <CardContent className="p-3.5 md:p-5">
                            <div className="flex items-start justify-between gap-2 md:gap-3">
                              <div className="flex items-start gap-2.5 md:gap-3 flex-1">
                                <div
                                  className={`w-11 h-11 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md`}
                                >
                                  <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-sm md:text-base mb-0.5 md:mb-1">
                                    {item.title}
                                  </p>
                                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                              {item.badge && (
                                <div className="bg-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-semibold">
                                  {item.badge}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Suggested For You */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-0.5">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                <h3 className="text-sm md:text-lg font-semibold">
                  Disarankan untuk Anda
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
                {suggestedForYou.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    >
                      <Link href={item.href}>
                        <Card className="group cursor-pointer hover:shadow-lg active:scale-98 transition-all duration-300 border md:border-2 hover:border-purple-500/30 bg-gradient-to-br from-card to-purple-500/5">
                          <CardContent className="p-3.5 md:p-5">
                            <div className="flex items-start gap-2.5 md:gap-3">
                              <div
                                className={`w-11 h-11 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}
                              >
                                <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-0.5 md:mb-1 gap-2">
                                  <p className="font-semibold text-sm md:text-base">
                                    {item.title}
                                  </p>
                                  <span className="text-[10px] md:text-xs bg-purple-500/20 text-purple-600 dark:text-purple-400 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">
                                    {item.reason}
                                  </span>
                                </div>
                                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Explore Features - Main Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-6 md:mb-10"
        >
          <div className="max-w-5xl mx-auto">
            <div className="mb-3 md:mb-5 px-0.5">
              <h3 className="text-sm md:text-xl font-bold mb-0.5 md:mb-1">
                Jelajahi Fitur
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Semua kemampuan utama Lumi
              </p>
            </div>

            {/* Features Grid */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-2.5 md:gap-5"
            >
              {primaryModules.map((module) => {
                const Icon = module.icon;

                return (
                  <motion.div key={module.title} variants={item}>
                    <Link href={module.href}>
                      <Card
                        className={`group cursor-pointer overflow-hidden border ${module.hoverColor} active:scale-95 transition-all duration-300 hover:shadow-md h-full`}
                      >
                        <CardHeader className="pb-2 md:pb-3 p-3 md:p-4">
                          <div
                            className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-1.5 md:mb-2 group-hover:scale-105 transition-transform duration-300`}
                          >
                            <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                          </div>
                          <CardTitle
                            className={`text-sm md:text-lg ${module.textColor} transition-colors leading-tight`}
                          >
                            {module.title}
                          </CardTitle>
                          <CardDescription className="text-[10px] md:text-sm line-clamp-2 leading-snug">
                            {module.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3 px-3 md:pb-4 md:px-4">
                          <div
                            className={`flex items-center ${module.buttonColor} font-medium text-xs md:text-sm group-hover:translate-x-2 transition-transform duration-300`}
                          >
                            {module.buttonText}
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

        {/* Secondary Tools - Less Frequent Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 md:mb-10"
        >
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => setShowMoreTools(!showMoreTools)}
              className="w-full flex items-center justify-between p-3 md:p-4 rounded-xl border md:border-2 border-muted hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm mb-3 md:mb-4 active:scale-98"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-gray-500 to-slate-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm md:text-lg">
                    Alat Tambahan
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {secondaryModules.length} fitur lainnya tersedia
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showMoreTools ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              </motion.div>
            </button>

            {/* Secondary Features - Compact Grid */}
            <motion.div
              initial={false}
              animate={{
                height: showMoreTools ? "auto" : 0,
                opacity: showMoreTools ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-2">
                {secondaryModules.map((module, index) => {
                  const Icon = module.icon;

                  return (
                    <motion.div
                      key={module.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: showMoreTools ? 1 : 0,
                        y: showMoreTools ? 0 : 10,
                      }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link href={module.href}>
                        <Card
                          className={`group cursor-pointer overflow-hidden border ${module.hoverColor} transition-all duration-300 hover:shadow-md h-full bg-card/80`}
                        >
                          <CardHeader className="p-4">
                            <div
                              className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300`}
                            >
                              <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <CardTitle
                              className={`text-base md:text-lg ${module.textColor} transition-colors`}
                            >
                              {module.title}
                            </CardTitle>
                            <CardDescription className="text-xs line-clamp-2">
                              {module.description}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Optional Info - About Lumi */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 mb-10 md:mt-8 md:mb-12 pt-6 md:pt-8 border-t border-border/30"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-5">
              <h3 className="text-lg md:text-xl font-semibold mb-1">
                Kenapa Lumi?
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto">
                Semua yang Anda butuhkan dalam satu aplikasi modern
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              \n{" "}
              <Card className="text-center p-4 md:p-5 border hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-sm md:text-base mb-1">
                  Cepat & Efisien
                </h3>
                <p className="text-xs text-muted-foreground">
                  Performa maksimal untuk produktivitas harian Anda
                </p>
              </Card>
              <Card className="text-center p-4 md:p-5 border hover:border-purple-500/30 transition-all duration-300 hover:shadow-md">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-sm md:text-base mb-1">
                  Semua dalam Satu
                </h3>
                <p className="text-xs text-muted-foreground">
                  8+ fitur terintegrasi tanpa perlu ganti aplikasi
                </p>
              </Card>
              <Card className="text-center p-4 md:p-5 border hover:border-pink-500/30 transition-all duration-300 hover:shadow-md">
                <div className="text-3xl mb-2">📱</div>
                <h3 className="font-semibold text-sm md:text-base mb-1">
                  Akses Dimana Saja
                </h3>
                <p className="text-xs text-muted-foreground">
                  Responsive design untuk semua perangkat Anda
                </p>
              </Card>
            </div>

            <div className="text-center mt-5">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-primary font-medium transition-colors"
              >
                Pelajari lebih lanjut tentang Lumi
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
