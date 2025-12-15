"use client";

import { useState } from "react";
import {
  Settings,
  Moon,
  Sun,
  Globe,
  Bell,
  Type,
  RotateCcw,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { settings, updateSetting, resetSettings, isLoaded } = useSettings();
  const [saveStatus, setSaveStatus] = useState("");

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSave = () => {
    setSaveStatus("Pengaturan berhasil disimpan!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const themeOptions = [
    { value: "light", label: "Terang", icon: Sun },
    { value: "dark", label: "Gelap", icon: Moon },
    { value: "system", label: "Sistem", icon: Globe },
  ];

  const fontSizeOptions = [
    { value: "small", label: "Kecil" },
    { value: "medium", label: "Normal" },
    { value: "large", label: "Besar" },
  ];

  const languageOptions = [
    { value: "id", label: "Bahasa Indonesia" },
    { value: "en", label: "English" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Pengaturan</h1>
          </div>
          <p className="text-muted-foreground">
            Kelola preferensi dan personalisasi pengalaman Anda
          </p>
        </motion.div>

        {/* Save Status */}
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-600"
          >
            <Check size={20} />
            {saveStatus}
          </motion.div>
        )}

        {/* Settings Grid */}
        <div className="space-y-6">
          {/* Theme Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sun className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Tema</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Pilih tema tampilan preferensi Anda
            </p>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateSetting(
                        "theme",
                        option.value as "light" | "dark" | "system"
                      )
                    }
                    className={`p-4 rounded-lg border-2 transition-all ${
                      settings.theme === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <IconComponent className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Language Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Bahasa</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Pilih bahasa aplikasi
            </p>
            <div className="space-y-2">
              {languageOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-3 border border-border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="language"
                    value={option.value}
                    checked={settings.language === option.value}
                    onChange={(e) =>
                      updateSetting("language", e.target.value as "en" | "id")
                    }
                    className="w-4 h-4"
                  />
                  <span className="ml-3 font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Display Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <Type className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Tampilan</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Atur ukuran font dan mode tampilan
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Ukuran Font
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {fontSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        updateSetting(
                          "fontSize",
                          option.value as "small" | "medium" | "large"
                        )
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        settings.fontSize === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-sm">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.compactMode}
                    onChange={(e) =>
                      updateSetting("compactMode", e.target.checked)
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium">Mode Kompak</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Notifikasi</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Kelola preferensi notifikasi Anda
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) =>
                    updateSetting("notifications", e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">Notifikasi Dalam Aplikasi</div>
                  <div className="text-xs text-muted-foreground">
                    Terima notifikasi saat menggunakan aplikasi
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    updateSetting("emailNotifications", e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">Notifikasi Email</div>
                  <div className="text-xs text-muted-foreground">
                    Terima update penting via email
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) =>
                    updateSetting("soundEnabled", e.target.checked)
                  }
                  className="w-4 h-4 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">Suara Notifikasi</div>
                  <div className="text-xs text-muted-foreground">
                    Putar suara saat notifikasi diterima
                  </div>
                </div>
              </label>
            </div>
          </motion.div>

          {/* Advanced Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">Lanjutan</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Pengaturan lanjutan dan preferensi
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-accent rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => updateSetting("autoSave", e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">Simpan Otomatis</div>
                  <div className="text-xs text-muted-foreground">
                    Otomatis menyimpan perubahan Anda
                  </div>
                </div>
              </label>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3 pt-4"
          >
            <Button
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Check className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </Button>
            <Button
              onClick={resetSettings}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset ke Default
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
