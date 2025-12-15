"use client";

import { motion } from "framer-motion";
import { User, Mail, MapPin, Calendar, Edit } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const userProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  location: "San Francisco, CA",
  joinDate: "January 2024",
  bio: "Passionate about technology and building great products. Love exploring new places and staying organized.",
  stats: [
    { label: "Tasks Completed", value: "47" },
    { label: "Places Visited", value: "12" },
    { label: "Items Purchased", value: "8" },
  ],
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-500/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
            <User className="text-orange-500" />
            Profile
          </h1>
          <p className="text-muted-foreground">
            View and manage your personal information
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardHeader className="relative">
              <div className="absolute top-6 right-6">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center text-white text-3xl font-bold">
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">
                    {userProfile.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {userProfile.bio}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-5 h-5" />
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{userProfile.location}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>Joined {userProfile.joinDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                {userProfile.stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed 3 tasks</span>
                  <Badge variant="secondary">Today</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Visited Maps module</span>
                  <Badge variant="secondary">Yesterday</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Purchased 2 items</span>
                  <Badge variant="secondary">3 days ago</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <Badge>Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark Mode</span>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Language</span>
                  <Badge>English</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
