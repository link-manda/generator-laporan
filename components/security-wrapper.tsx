"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import { verifyAppPassword } from "@/lib/actions";
import { Button } from "./ui/button";

interface SecurityWrapperProps {
  children: ReactNode;
}

export default function SecurityWrapper({ children }: SecurityWrapperProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(15);

  // Konfigurasi Timer (dalam milidetik)
  const IDLE_TIMEOUT = 60 * 1000; // 60 detik tanpa interaksi
  const WARNING_TIMEOUT = 15 * 1000; // 15 detik masa peringatan

  const lockApp = useCallback(() => {
    setIsLocked(true);
    setShowWarning(false);
    setPassword("");
  }, []);

  useEffect(() => {
    if (isLocked) return;

    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);

      if (showWarning) return;

      idleTimer = setTimeout(() => {
        setShowWarning(true);
      }, IDLE_TIMEOUT);
    };

    const handleUserActivity = () => {
      if (!showWarning) {
        resetIdleTimer();
      }
    };

    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("click", handleUserActivity);
    window.addEventListener("scroll", handleUserActivity);

    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("scroll", handleUserActivity);
    };
  }, [isLocked, showWarning, IDLE_TIMEOUT]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showWarning && !isLocked) {
      setCountdown(15);
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            lockApp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [showWarning, isLocked, lockApp]);

  const handleContinue = () => {
    setShowWarning(false);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    try {
      const isValid = await verifyAppPassword(password);
      if (isValid) {
        setIsLocked(false);
        setPassword("");
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`transition-all duration-700 w-full ${isLocked || showWarning ? 'blur-lg pointer-events-none select-none h-screen overflow-hidden opacity-40' : ''}`}>
        {children}
      </div>

      {isLocked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all border border-slate-100">
            <div className="text-center mb-6">
              <div className="mx-auto bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Aplikasi Terkunci</h2>
              <p className="text-slate-500 text-sm mt-2">Masukkan kata sandi internal untuk mengakses editor laporan.</p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-lg p-3 outline-none focus:border-slate-800 transition-colors text-center text-lg tracking-widest"
                  placeholder="••••••••"
                  autoFocus
                />
                {error && <p className="text-red-500 text-sm mt-2 font-medium text-center">Kredensial tidak valid!</p>}
              </div>
              <Button type="submit" className="w-full py-6 text-lg bg-slate-800 hover:bg-slate-900" disabled={isLoading || !password}>
                {isLoading ? "Memeriksa..." : "Buka Kunci"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {showWarning && !isLocked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm text-center animate-in fade-in zoom-in duration-300 border border-amber-100">
            <div className="mx-auto bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-amber-500 border border-amber-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Sesi Tidak Aktif</h3>
            <p className="text-slate-500 mb-6 text-sm">
              Apakah Anda masih di halaman ini? Aplikasi akan segera dikunci kembali demi keamanan dalam <strong className="text-amber-600 text-lg">{countdown}</strong> detik.
            </p>
            <Button onClick={handleContinue} className="w-full py-5 text-base bg-amber-500 hover:bg-amber-600 text-white font-semibold">
              Ya, Saya Masih Disini
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
