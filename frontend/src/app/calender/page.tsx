"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { fetchTasks, createTask } from "@/lib/api";

type Task = {
  id: number;
  title: string;
  description?: string;
  start_time?: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await fetchTasks();
    const calendarEvents = data
      .filter((task: Task) => task.start_time)
      .map((task: Task) => ({
        title: task.title,
        date: task.start_time,
        id: task.id.toString(),
      }));
    setEvents(calendarEvents);
  }

  function handleDateClick(arg: DateClickArg) {
    setSelectedDate(arg.dateStr);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask({
      title,
      description,
      start_time: selectedDate,
    });

    setTitle("");
    setDescription("");
    setShowForm(false);
    loadTasks();
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📅 Takvim Görünümü</h1>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="text-lg font-semibold mb-2">
            Görev Ekle ({selectedDate})
          </h2>
          <input
            type="text"
            placeholder="Görev başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <textarea
            placeholder="Açıklama (isteğe bağlı)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Kaydet
            </button>
          </div>
        </form>
      )}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        dateClick={handleDateClick}
      />
    </main>
  );
}
