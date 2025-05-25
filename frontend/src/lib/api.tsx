const BASE_URL = "http://127.0.0.1:8000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function fetchTasks() {
  const res = await fetch(`${BASE_URL}/tasks/`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Görevler alınamadı");

  return await res.json();
}

export async function createTask(task: {
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
}) {
  const res = await fetch(`${BASE_URL}/tasks/`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(task),
  });

  if (!res.ok) throw new Error("Görev oluşturulamadı");

  return await res.json();
}

export async function deleteTask(id: number) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  if (!res.ok) throw new Error("Görev silinemedi");

  return await res.json();
}

export async function updateTask(id: number, updatedData: any) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("PUT error: " + err);
  }

  return await res.json();
}
