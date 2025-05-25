"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
   const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token); 
    if (token) {
      router.push("/calendar"); 
    }
  }, []);

  if (loggedIn) return null;
  return (
    <div className="p-4 flex flex-col space-y-4 h-screen justify-center align-middle text-center">
      <h1 className="text-2xl font-bold">Görev Takvimi</h1>
      <div className="space-x-4 flex justify-center align-middle">
        <Link href="/auth/login" className="bg-green-600 text-white px-4 py-2 rounded">
          Giriş Yap
        </Link>
        <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded">
          Kayıt Ol
        </Link>
      </div>
    </div>
  );
}
