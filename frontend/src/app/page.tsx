"use client";

import { useEffect, useState } from "react";
import { fetchTasks, createTask, deleteTask } from "@/lib/api";

type Task = {
  id: number;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  completed: boolean;
  created_at: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await fetchTasks();
    setTasks(data);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask({
      title,
      description,
      start_time: startTime || undefined,
      end_time: endTime || undefined,
    });

    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    loadTasks();
  }

  async function handleDelete(id: number) {
    await deleteTask(id);
    loadTasks();
  }

  if (!mounted) return null;

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📅 Görev Takvimi</h1>

      <form onSubmit={handleCreate} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Görev başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Açıklama (isteğe bağlı)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Görev Ekle
        </button>
      </form>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border rounded p-3 flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
              {task.start_time && (
                <p className="text-xs text-gray-500">
                  Başlangıç: {new Date(task.start_time).toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              className="text-red-500 hover:underline text-sm"
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
