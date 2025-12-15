"use client";

import { useState, useEffect, useCallback } from "react";

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

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userSettings");
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage
  const updateSetting = useCallback(
    <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      setSettings((prev) => {
        const updated = { ...prev, [key]: value };
        try {
          localStorage.setItem("userSettings", JSON.stringify(updated));
        } catch (error) {
          console.error("Failed to save settings:", error);
        }
        return updated;
      });
    },
    []
  );

  // Reset to default settings
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem("userSettings", JSON.stringify(DEFAULT_SETTINGS));
    } catch (error) {
      console.error("Failed to reset settings:", error);
    }
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
    isLoaded,
  };
}
