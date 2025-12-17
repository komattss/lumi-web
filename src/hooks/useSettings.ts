"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface UserSettings {
  theme: "light" | "dark" | "system";
  language: "en" | "id";
  fontSize: "small" | "medium" | "large";
  notifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
  autoSave: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  language: "id",
  fontSize: "medium",
  notifications: true,
  emailNotifications: false,
  soundEnabled: true,
  compactMode: false,
  autoSave: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const usingSupabase = isSupabaseConfigured;
  const [userId, setUserId] = useState<string>("");

  // Load settings from Supabase (if configured) or localStorage
  useEffect(() => {
    const init = async () => {
      // establish local user id (shared with chat)
      let uid = localStorage.getItem("chatUserId");
      if (!uid) {
        uid = `user_${Date.now()}`;
        localStorage.setItem("chatUserId", uid);
      }
      setUserId(uid);

      if (usingSupabase) {
        try {
          const { data, error } = await supabase
            .from("settings")
            .select("data")
            .eq("user_id", uid)
            .single();
          if (!error && data?.data) {
            setSettings(data.data as UserSettings);
          } else {
            // fall back to local storage if present
            const stored = localStorage.getItem("userSettings");
            if (stored) setSettings(JSON.parse(stored));
          }
        } catch (e) {
          console.warn(
            "Failed to load settings from Supabase, using local storage.",
            e
          );
          const stored = localStorage.getItem("userSettings");
          if (stored) setSettings(JSON.parse(stored));
        } finally {
          setIsLoaded(true);
        }
      } else {
        try {
          const stored = localStorage.getItem("userSettings");
          if (stored) setSettings(JSON.parse(stored));
        } catch (error) {
          console.error("Failed to load settings:", error);
        } finally {
          setIsLoaded(true);
        }
      }
    };
    init();
  }, [usingSupabase]);

  // Save settings to Supabase (if configured) and localStorage
  const updateSetting = useCallback(
    <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      setSettings((prev) => {
        const updated = { ...prev, [key]: value };
        try {
          localStorage.setItem("userSettings", JSON.stringify(updated));
        } catch (error) {
          console.error("Failed to save settings:", error);
        }
        if (usingSupabase && userId) {
          supabase
            .from("settings")
            .upsert({
              user_id: userId,
              data: updated,
              updated_at: new Date().toISOString(),
            })
            .then((res: { error?: unknown }) => {
              if (res && (res as any).error)
                console.error(
                  "Supabase upsert settings failed",
                  (res as any).error
                );
            });
        }
        return updated;
      });
    },
    [usingSupabase, userId]
  );

  // Reset to default settings
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem("userSettings", JSON.stringify(DEFAULT_SETTINGS));
    } catch (error) {
      console.error("Failed to reset settings:", error);
    }
    if (usingSupabase && userId) {
      supabase
        .from("settings")
        .upsert({
          user_id: userId,
          data: DEFAULT_SETTINGS,
          updated_at: new Date().toISOString(),
        })
        .then((res: { error?: unknown }) => {
          if (res && (res as any).error)
            console.error("Supabase reset settings failed", (res as any).error);
        });
    }
  }, [usingSupabase, userId]);

  return {
    settings,
    updateSetting,
    resetSettings,
    isLoaded,
  };
}
