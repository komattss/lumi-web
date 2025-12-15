"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues
const MapView = dynamic(() => import("@/components/modules/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="text-center">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapsPage() {
  return (
    <div className="h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border p-6"
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MapPin className="text-primary" />
          Maps
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore interactive maps and discover locations
        </p>
      </motion.div>

      <div className="flex-1 relative">
        <MapView />
      </div>
    </div>
  );
}
