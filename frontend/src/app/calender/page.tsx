"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { fetchTasks, createTask } from "@/lib/api";
import type { EventClickArg } from "@fullcalendar/core";


type Task = {
  id: number;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await fetchTasks();
    setEvents(
      data.map((task: Task) => ({
        title: task.title,
        date: task.start_time,
        id: task.id.toString(),
        extendedProps: task, 
      }))
    );
  }

  function handleDateClick(arg: DateClickArg) {
    setSelectedDate(arg.dateStr);
    setShowForm(true);
  }

  function handleEventClick(arg: EventClickArg) {
    const task = arg.event.extendedProps as Task;
    setSelectedTask(task);
    setShowDetail(true);
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
    <main className="max-w-5xl mx-auto p-4 relative">
      <h1 className="text-2xl font-bold mb-4">📅 Takvim Görünümü</h1>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Yeni Görev – {selectedDate}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Başlık"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <textarea
                placeholder="Açıklama"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowForm(false)} type="button" className="border px-4 py-2 rounded">
                  İptal
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-2">{selectedTask.title}</h2>
            {selectedTask.description && (
              <p className="text-gray-700 mb-2">{selectedTask.description}</p>
            )}
            {selectedTask.start_time && (
              <p className="text-sm text-gray-500">
                Başlangıç: {new Date(selectedTask.start_time).toLocaleString()}
              </p>
            )}
            {selectedTask.end_time && (
              <p className="text-sm text-gray-500">
                Bitiş: {new Date(selectedTask.end_time).toLocaleString()}
              </p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDetail(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
