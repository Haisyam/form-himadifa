'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldLock, Lock, User, Eye, EyeOff, ArrowLeft, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (json.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(json.message || 'Login gagal. Periksa username & password.');
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#06101E] via-[#091B33] to-[#0A2540] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden" suppressHydrationWarning>
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-[-10%] w-80 h-80 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-[-10%] w-80 h-80 bg-orange-500/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Back to Form link */}
      <div className="w-full max-w-md mx-auto pt-2 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-orange-400 transition-colors py-2 px-3 rounded-xl bg-slate-800/40 border border-slate-700/60 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Form Utama</span>
        </Link>
      </div>

      {/* Login Card */}
      <main className="w-full max-w-md mx-auto my-auto z-10 py-6">
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-700/60">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-blue-600"></div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-orange-500/40 p-1 bg-[#0A2540] flex items-center justify-center">
                <Image
                  src="/logo himadifa.jpeg"
                  alt="Logo HIMADIFA"
                  fill
                  className="object-contain p-0.5 rounded-xl"
                />
              </div>
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-orange-500/40 p-1 bg-[#0A2540] flex items-center justify-center">
                <Image
                  src="/logo uad.png"
                  alt="Logo UAD"
                  fill
                  className="object-contain p-0.5 rounded-xl"
                />
              </div>
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-orange-500/40 p-1 bg-[#0A2540] flex items-center justify-center">
                <Image
                  src="/logo nama uad.png"
                  alt="Logo Nama UAD"
                  fill
                  className="object-contain p-0.5 rounded-xl"
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
              <ShieldLock className="w-3.5 h-3.5" />
              <span>PORTAL ADMIN HIMA</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Login Pengurus Admin
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Masuk untuk mengelola & memverifikasi data biodata pengurus HimaDifa UAD.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-400" />
                <span>Username</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-10 rounded-xl glass-input text-sm text-white placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl btn-gradient-primary font-bold text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="w-full text-center text-[11px] text-slate-400 py-2 z-10" suppressHydrationWarning>
        &copy; {new Date().getFullYear()} HIMADIFA Universitas Ahmad Dahlan
      </footer>
    </div>
  );
}
