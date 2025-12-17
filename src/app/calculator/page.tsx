"use client";

import { useEffect, useState } from "react";
import { Calculator, Delete, RotateCcw, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const usingSupabase = isSupabaseConfigured;
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    let uid = localStorage.getItem("chatUserId");
    if (!uid) {
      uid = `user_${Date.now()}`;
      localStorage.setItem("chatUserId", uid);
    }
    setUserId(uid);
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      if (!usingSupabase || !userId) return;
      try {
        const { data, error } = await supabase
          .from("calc_history")
          .select("calculation, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10);
        if (!error && data) {
          setHistory(data.map((d: any) => d.calculation));
        }
      } catch (e) {
        // ignore and keep local empty
      }
    };
    loadHistory();
  }, [usingSupabase, userId]);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay("0.");
      setNewNumber(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "×":
        return prev * current;
      case "÷":
        return prev / current;
      case "%":
        return (prev / 100) * current;
      default:
        return current;
    }
  };

  const handleEquals = async () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);

      const calculation = `${previousValue} ${operation} ${currentValue} = ${result}`;
      setHistory([calculation, ...history.slice(0, 9)]);

      if (usingSupabase && userId) {
        try {
          await supabase.from("calc_history").insert({
            user_id: userId,
            calculation,
          });
        } catch (e) {
          // ignore insert error, UI already updated
        }
      }

      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length === 1) {
      setDisplay("0");
      setNewNumber(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handleSquare = () => {
    const value = parseFloat(display);
    const result = value * value;
    setDisplay(String(result));
    setNewNumber(true);
  };

  const handleSquareRoot = () => {
    const value = parseFloat(display);
    if (value < 0) {
      setDisplay("Error");
    } else {
      const result = Math.sqrt(value);
      setDisplay(String(result));
    }
    setNewNumber(true);
  };

  const handleNegative = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearHistory = async () => {
    setHistory([]);
    if (usingSupabase && userId) {
      try {
        await supabase.from("calc_history").delete().eq("user_id", userId);
      } catch (e) {
        // ignore
      }
    }
  };

  const buttonClass =
    "p-4 rounded-lg font-semibold text-lg transition-all hover:shadow-lg active:scale-95";
  const numberButtonClass = `${buttonClass} bg-card hover:bg-accent text-foreground border border-border`;
  const operationButtonClass = `${buttonClass} bg-primary hover:bg-primary/90 text-primary-foreground`;
  const functionButtonClass = `${buttonClass} bg-muted hover:bg-muted/80 text-foreground`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Kalkulator</h1>
          </div>
          <p className="text-muted-foreground">
            Kalkulator ilmiah dengan riwayat perhitungan
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl">
              {/* Display */}
              <div className="mb-6">
                <div className="bg-muted rounded-lg p-4 mb-2">
                  <div className="text-right text-muted-foreground text-sm h-6">
                    {previousValue && operation
                      ? `${previousValue} ${operation}`
                      : ""}
                  </div>
                  <div className="text-right text-4xl font-bold text-foreground break-words">
                    {display}
                  </div>
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Disalin!" : "Salin Hasil"}
                </Button>
              </div>

              {/* Scientific Functions */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <button
                  onClick={handleSquare}
                  className={functionButtonClass}
                  title="Kuadrat"
                >
                  x²
                </button>
                <button
                  onClick={handleSquareRoot}
                  className={functionButtonClass}
                  title="Akar Kuadrat"
                >
                  √x
                </button>
                <button
                  onClick={handlePercentage}
                  className={functionButtonClass}
                  title="Persen"
                >
                  %
                </button>
                <button
                  onClick={handleNegative}
                  className={functionButtonClass}
                  title="Negatif"
                >
                  ±
                </button>
              </div>

              {/* Main Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {/* Row 1 */}
                <button
                  onClick={handleClear}
                  className={`${operationButtonClass} col-span-2`}
                >
                  <RotateCcw className="w-5 h-5 inline mr-2" />
                  Clear
                </button>
                <button
                  onClick={handleBackspace}
                  className={operationButtonClass}
                >
                  <Delete className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleOperation("÷")}
                  className={operationButtonClass}
                >
                  ÷
                </button>

                {/* Row 2 */}
                <button
                  onClick={() => handleNumber("7")}
                  className={numberButtonClass}
                >
                  7
                </button>
                <button
                  onClick={() => handleNumber("8")}
                  className={numberButtonClass}
                >
                  8
                </button>
                <button
                  onClick={() => handleNumber("9")}
                  className={numberButtonClass}
                >
                  9
                </button>
                <button
                  onClick={() => handleOperation("×")}
                  className={operationButtonClass}
                >
                  ×
                </button>

                {/* Row 3 */}
                <button
                  onClick={() => handleNumber("4")}
                  className={numberButtonClass}
                >
                  4
                </button>
                <button
                  onClick={() => handleNumber("5")}
                  className={numberButtonClass}
                >
                  5
                </button>
                <button
                  onClick={() => handleNumber("6")}
                  className={numberButtonClass}
                >
                  6
                </button>
                <button
                  onClick={() => handleOperation("-")}
                  className={operationButtonClass}
                >
                  −
                </button>

                {/* Row 4 */}
                <button
                  onClick={() => handleNumber("1")}
                  className={numberButtonClass}
                >
                  1
                </button>
                <button
                  onClick={() => handleNumber("2")}
                  className={numberButtonClass}
                >
                  2
                </button>
                <button
                  onClick={() => handleNumber("3")}
                  className={numberButtonClass}
                >
                  3
                </button>
                <button
                  onClick={() => handleOperation("+")}
                  className={operationButtonClass}
                >
                  +
                </button>

                {/* Row 5 */}
                <button
                  onClick={() => handleNumber("0")}
                  className={`${numberButtonClass} col-span-2`}
                >
                  0
                </button>
                <button onClick={handleDecimal} className={numberButtonClass}>
                  .
                </button>
                <button
                  onClick={handleEquals}
                  className={`${operationButtonClass} bg-green-600 hover:bg-green-700`}
                >
                  =
                </button>
              </div>
            </div>
          </motion.div>

          {/* History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-2xl h-fit"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Riwayat</h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bersihkan
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada riwayat
                </p>
              ) : (
                history.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-muted rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                    onClick={() => {
                      const result = item.split(" = ")[1];
                      setDisplay(result);
                      setPreviousValue(null);
                      setOperation(null);
                      setNewNumber(true);
                    }}
                  >
                    <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      {item}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Features Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-card border border-border rounded-xl p-6 shadow-lg"
        >
          <h3 className="font-semibold mb-3">✨ Fitur</h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <li>• Operasi dasar (+, −, ×, ÷)</li>
            <li>• Fungsi ilmiah (x², √x, %)</li>
            <li>• Riwayat perhitungan otomatis</li>
            <li>• Salin hasil ke clipboard</li>
            <li>• Desain responsif</li>
            <li>• Tombol backspace untuk koreksi</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
