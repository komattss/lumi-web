"use client";

import { useState, useEffect } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Gauge,
  MapPin,
  Search,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WeatherData {
  main: string;
  description: string;
  icon: string;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  visibility: number;
  pressure: number;
  city: string;
  country: string;
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Get weather by geolocation
  const getWeatherByLocation = () => {
    setLoading(true);
    setError("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          setError("Tidak dapat mengakses lokasi. Gunakan pencarian kota.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation tidak didukung browser Anda");
      setLoading(false);
    }
  };

  // Fetch weather data (menggunakan API gratis)
  const fetchWeather = async (
    lat?: number,
    lon?: number,
    cityName?: string
  ) => {
    try {
      setLoading(true);
      setError("");

      // Menggunakan Open-Meteo API yang tidak memerlukan API key
      let url = "";

      if (cityName) {
        // Geocoding
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=id&format=json`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          setError("Kota tidak ditemukan");
          setLoading(false);
          return;
        }

        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        setCity(geoData.results[0].name);
      }

      // Get weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility&timezone=auto`
      );
      const weatherData = await weatherRes.json();

      if (weatherData.current) {
        const current = weatherData.current;
        const tempC = current.temperature_2m;

        // Map weather codes to descriptions
        const getWeatherDescription = (code: number) => {
          if (code === 0) return { main: "Cerah", description: "Cuaca Cerah" };
          if (code === 1 || code === 2)
            return {
              main: "Sebagian Berawan",
              description: "Sebagian Berawan",
            };
          if (code === 3) return { main: "Berawan", description: "Berawan" };
          if (code === 45 || code === 48)
            return { main: "Berkabut", description: "Berkabut" };
          if (code === 51 || code === 53 || code === 55)
            return { main: "Gerimis", description: "Gerimis Halus" };
          if (code === 61 || code === 63 || code === 65)
            return { main: "Hujan", description: "Hujan" };
          if (code === 71 || code === 73 || code === 75)
            return { main: "Salju", description: "Salju" };
          return { main: "Berubah", description: "Cuaca Berubah-ubah" };
        };

        const desc = getWeatherDescription(current.weather_code);

        setWeather({
          main: desc.main,
          description: desc.description,
          icon:
            current.weather_code === 0
              ? "01d"
              : current.weather_code < 50
              ? "02d"
              : "10d",
          temp: Math.round(tempC),
          feels_like: Math.round(current.apparent_temperature),
          humidity: current.relative_humidity_2m || 0,
          wind_speed: Math.round(current.wind_speed_10m),
          visibility: Math.round((current.visibility || 10000) / 1000),
          pressure: Math.round(current.pressure_msl || 1013),
          city: city || "Lokasi Anda",
          country: "Indonesia",
        });
      }
    } catch (err) {
      setError("Gagal mengambil data cuaca. Silakan coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeatherByLocation();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(undefined, undefined, searchInput);
      setSearchInput("");
    }
  };

  const getWeatherIcon = (code: string) => {
    switch (code) {
      case "01d":
        return <Sun className="w-24 h-24 text-yellow-400" />;
      case "02d":
        return <Cloud className="w-24 h-24 text-gray-400" />;
      case "10d":
        return <CloudRain className="w-24 h-24 text-blue-400" />;
      default:
        return <Cloud className="w-24 h-24 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-blue-100 dark:from-background dark:via-background dark:to-background/50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Cloud className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">Cuaca</h1>
          </div>
          <p className="text-muted-foreground">
            Periksa kondisi cuaca real-time di lokasi Anda
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="mb-8"
        >
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari nama kota..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
              />
            </div>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              Cari
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={getWeatherByLocation}
              disabled={loading}
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
        </motion.form>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-600"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Weather Display */}
        {weather && !loading && (
          <div className="space-y-6">
            {/* Current Weather Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-900 dark:to-blue-950 rounded-2xl p-8 text-white shadow-2xl"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold">{weather.city}</h2>
                  <p className="text-blue-100">{weather.country}</p>
                </div>
                {getWeatherIcon(weather.icon)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-6xl font-bold">{weather.temp}°C</div>
                  <p className="text-blue-100 text-lg">{weather.description}</p>
                </div>
                <div className="flex flex-col justify-center items-end">
                  <div className="text-lg">Terasa seperti</div>
                  <div className="text-4xl font-bold">
                    {weather.feels_like}°C
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weather Details Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {/* Humidity */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">Kelembaban</h3>
                </div>
                <div className="text-3xl font-bold">{weather.humidity}%</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {weather.humidity > 70
                    ? "Lembab"
                    : weather.humidity > 40
                    ? "Normal"
                    : "Kering"}
                </p>
              </div>

              {/* Wind Speed */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Wind className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold">Kecepatan Angin</h3>
                </div>
                <div className="text-3xl font-bold">{weather.wind_speed}</div>
                <p className="text-xs text-muted-foreground mt-2">km/h</p>
              </div>

              {/* Visibility */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold">Visibilitas</h3>
                </div>
                <div className="text-3xl font-bold">{weather.visibility}</div>
                <p className="text-xs text-muted-foreground mt-2">km</p>
              </div>

              {/* Pressure */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Gauge className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold">Tekanan</h3>
                </div>
                <div className="text-3xl font-bold">{weather.pressure}</div>
                <p className="text-xs text-muted-foreground mt-2">hPa</p>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-xl p-6 shadow-lg"
            >
              <h3 className="font-semibold mb-3">💡 Tips Cuaca</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {weather.temp > 30 && (
                  <li>• Cuaca panas, pastikan minum air yang cukup</li>
                )}
                {weather.humidity > 70 && (
                  <li>• Udara lembab, hati-hati terhadap kesehatan</li>
                )}
                {weather.wind_speed > 30 && (
                  <li>• Angin kencang, hindari aktivitas di luar</li>
                )}
                {weather.description.includes("Hujan") && (
                  <li>• Cuaca hujan, bawa payung jika keluar</li>
                )}
                {weather.temp < 15 && (
                  <li>• Cuaca dingin, gunakan pakaian yang hangat</li>
                )}
              </ul>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
