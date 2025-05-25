"use client";
import { useState } from "react";
import { register } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await register(email, password);
      localStorage.setItem("token", data.access_token);
      router.push("/");
    } catch (err) {
      alert("Kayıt başarısız");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="h-screen flex flex-col justify-center align-middle  max-w-sm mx-auto p-4 space-y-3">
      <h2 className="text-xl font-bold">Kayıt Ol</h2>
      <input
        type="email"
        placeholder="E-posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Kayıt Ol
      </button>
    </form>
  );
}

