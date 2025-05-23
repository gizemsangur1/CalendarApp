const BASE_URL = "http://127.0.0.1:8000";

export async function fetchTasks() {
  const res = await fetch(`${BASE_URL}/tasks`);
  return res.json();
}

export async function createTask(task: {
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
}) {
  const res = await fetch(`${BASE_URL}/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function deleteTask(id: number) {
  return fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
}

export async function updateTask(id: number, updatedData: any) {
  const res = await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("PUT error: " + err);
  }

  return res.json();
}




