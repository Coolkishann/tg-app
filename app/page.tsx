"use client";

import { useEffect, useState } from "react";

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function HomePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Access Telegram WebApp object if available
    if (typeof window !== "undefined") {
      // @ts-ignore
      const tg = window.Telegram?.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const u = tg.initDataUnsafe.user;
        setUserData({
          id: u.id,
          first_name: u.first_name,
          last_name: u.last_name,
          username: u.username,
          language_code: u.language_code,
          is_premium: u.is_premium,
        });
      } else {
        setError("No Telegram user data found. Please open this app via Telegram.");
      }
    }
  }, []);

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      {userData ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Your Telegram Data</h1>
          <ul className="bg-white rounded shadow p-6">
            <li>
              <strong>User ID:</strong> {userData.id}
            </li>
            <li>
              <strong>First Name:</strong> {userData.first_name}
            </li>
            <li>
              <strong>Last Name:</strong> {userData.last_name ?? "(none)"}
            </li>
            <li>
              <strong>Username:</strong> @{userData.username ?? "(none)"}
            </li>
            <li>
              <strong>Language Code:</strong> {userData.language_code}
            </li>
            <li>
              <strong>Premium:</strong> {userData.is_premium ? "Yes" : "No"}
            </li>
          </ul>
        </>
      ) : (
        <p className="text-gray-500">Loading Telegram user data...</p>
      )}
    </main>
  );
}
