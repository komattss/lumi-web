"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Build Lumi superapp", completed: true },
    { id: 2, title: "Add smooth animations", completed: false },
    { id: 3, title: "Test on mobile devices", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTask,
          completed: false,
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
            <CheckSquare className="text-green-500" />
            Tasks
          </h1>
          <p className="text-muted-foreground">
            Manage your to-do list and stay productive
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline">
              {completedCount} / {tasks.length} completed
            </Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTask()}
                  className="flex-1"
                />
                <Button onClick={addTask} size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-3">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={task.completed ? "opacity-60" : ""}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        task.completed
                          ? "bg-green-500 border-green-500"
                          : "border-muted-foreground hover:border-green-500"
                      }`}
                    >
                      {task.completed && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <span
                      className={`flex-1 ${
                        task.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <CheckSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No tasks yet. Add one to get started!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
