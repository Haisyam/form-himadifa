"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  CreditCard,
  GraduationCap,
  Building2,
  MapPin,
  Phone,
  Briefcase,
  Send,
  CheckCircle2,
  ShieldLock,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    angkatan: "DIFA4",
    asal_instansi: "Universitas Ahmad Dahlan",
    alamat_domisili: "",
    no_whatsapp: "",
  });

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Simple validation
    if (!formData.nama.trim()) {
      setErrorMessage("Nama Lengkap wajib diisi!");
      return;
    }
    if (!formData.nim.trim()) {
      setErrorMessage("NIM wajib diisi!");
      return;
    }
    if (!formData.asal_instansi.trim()) {
      setErrorMessage("Asal Universitas / Instansi Pekerjaan wajib diisi!");
      return;
    }
    if (!formData.alamat_domisili.trim()) {
      setErrorMessage("Wilayah Domisili / Alamat wajib diisi!");
      return;
    }
    if (!formData.no_whatsapp.trim()) {
      setErrorMessage("No WhatsApp wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/pengurus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        setSubmittedData(json.data);
        setShowSuccessModal(true);
        // Reset form
        setFormData({
          nama: "",
          nim: "",
          angkatan: "DIFA4",
          asal_instansi: "Universitas Ahmad Dahlan",
          alamat_domisili: "",
          no_whatsapp: "",
        });
      } else {
        setErrorMessage(
          json.message || "Gagal mengirim data. Silakan coba lagi.",
        );
      }
    } catch (err) {
      setErrorMessage(
        "Terjadi kesalahan koneksi. Pastikan internet Anda terhubung.",
      );
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    if (!submittedData) return;
    const text =
      `*BIODATA PENGURUS HIMADIFA UAD*\n\n` +
      `👤 *Nama:* ${submittedData.nama}\n` +
      `💳 *NIM:* ${submittedData.nim}\n` +
      `🎓 *Angkatan:* ${submittedData.angkatan}\n` +
      `🏢 *Instansi:* ${submittedData.asal_instansi}\n` +
      `📍 *Domisili:* ${submittedData.alamat_domisili}\n` +
      `📱 *WhatsApp:* ${submittedData.no_whatsapp}\n` +
      `💼 *Jabatan:* ${submittedData.jabatan_hima}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-b from-[#06101E] via-[#091B33] to-[#0A2540] flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden"
      suppressHydrationWarning
    >
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-orange-500/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 sm:w-[500px] sm:h-[500px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Main Container - Optimized Mobile First */}
      <main className="w-full max-w-xl mx-auto my-auto z-10">
        <div className="glass-card rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden border border-slate-700/60">
          {/* Subtle Top Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-blue-600"></div>

          {/* Form Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-5">
              {/* Logo 1: HIMADIFA */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-orange-500/40 p-1.5 bg-[#0A2540] flex items-center justify-center hover:scale-105 transition-transform">
                <Image
                  src="/logo himadifa.jpeg"
                  alt="Logo HIMADIFA UAD"
                  fill
                  className="object-contain p-0.5 rounded-xl"
                  priority
                />
              </div>

              {/* Logo 2: UAD Emblem */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-orange-500/40 p-1.5 bg-[#0A2540] flex items-center justify-center hover:scale-105 transition-transform">
                <Image
                  src="/logo uad.png"
                  alt="Logo UAD"
                  fill
                  className="object-contain p-0.5 rounded-xl"
                  priority
                />
              </div>

              {/* Logo 3: UAD Name */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-orange-500/40 p-1.5 bg-[#0A2540] flex items-center justify-center hover:scale-105 transition-transform">
                <Image
                  src="/logo nama uad.png"
                  alt="Logo Nama UAD"
                  fill
                  className="object-contain p-0.5 rounded-xl"
                  priority
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold mb-2 tracking-wide">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>HIMADIFA UAD OFFICIAL</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Biodata Pengurus <br />
              <span className="gradient-text-orange">HimaDifa UAD</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              Silakan lengkapi formulir biodata di bawah ini secara akurat untuk
              kebutuhan pendataan pengurus.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-3 animate-fadeIn">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* 1. Nama Lengkap */}
            <div>
              <label
                htmlFor="nama"
                className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-orange-400" />
                <span>Nama Lengkap</span>
                <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Contoh: Ferga Pras"
                required
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-400"
              />
            </div>

            {/* 2. NIM */}
            <div>
              <label
                htmlFor="nim"
                className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4 text-orange-400" />
                <span>NIM (Nomor Induk Mahasiswa)</span>
                <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                id="nim"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                placeholder="Contoh: 2300018042"
                required
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-400"
              />
            </div>

            {/* 3. Angkatan (DIFA3 / DIFA4 / DIFA5) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-orange-400" />
                <span>Angkatan</span>
                <span className="text-orange-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {["DIFA3", "DIFA4", "DIFA5"].map((angkatan) => (
                  <button
                    key={angkatan}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, angkatan }))
                    }
                    className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border flex flex-col items-center justify-center gap-1 ${
                      formData.angkatan === angkatan
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-lg shadow-orange-500/25 scale-[1.02]"
                        : "bg-slate-800/40 text-slate-300 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    <span>{angkatan}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Asal Universitas / Instansi Pekerjaan */}
            <div>
              <label
                htmlFor="asal_instansi"
                className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-orange-400" />
                <span>Asal Universitas / Instansi Pekerjaan</span>
                <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                id="asal_instansi"
                name="asal_instansi"
                value={formData.asal_instansi}
                onChange={handleChange}
                placeholder="Contoh: Universitas Ahmad Dahlan"
                required
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-400"
              />
            </div>

            {/* 5. Wilayah Domisili / Alamat */}
            <div>
              <label
                htmlFor="alamat_domisili"
                className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>Wilayah Domisili / Alamat</span>
                <span className="text-orange-500">*</span>
              </label>
              <textarea
                id="alamat_domisili"
                name="alamat_domisili"
                rows={2}
                value={formData.alamat_domisili}
                onChange={handleChange}
                placeholder="Contoh: Umbulharjo, Kota Yogyakarta"
                required
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-400 resize-none"
              ></textarea>
            </div>

            {/* 6. No WhatsApp */}
            <div>
              <label
                htmlFor="no_whatsapp"
                className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5 flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-orange-400" />
                <span>No WhatsApp</span>
                <span className="text-orange-500">*</span>
              </label>
              <input
                type="tel"
                id="no_whatsapp"
                name="no_whatsapp"
                value={formData.no_whatsapp}
                onChange={handleChange}
                placeholder="Contoh: 081234567890"
                required
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-slate-400"
              />
            </div>

            {/* 7. Jabatan HIMA (Disabled - Informational) */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>Jabatan HIMA</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Diisi oleh Admin
                </span>
              </label>
              <div className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-sm text-slate-400 flex items-center justify-between cursor-not-allowed select-none">
                <span>Belum Ditentukan (Menunggu Penetapan Admin)</span>
                <ShieldLock className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl btn-gradient-primary font-bold text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Menyimpan Biodata...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span>Kirim Biodata Pengurus</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Discrete Footer Link for Admin Login */}
      {/* <footer className="w-full text-center py-4 z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-400 transition-colors py-1 px-3 rounded-full hover:bg-white/5"
        >
          <ShieldLock className="w-3.5 h-3.5" />
          <span>Login Dashboard Admin</span>
        </Link>
      </footer> */}

      {/* Success Modal */}
      {showSuccessModal && submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#0F233D] border border-orange-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Biodata Berhasil Terkirim!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6">
              Terima kasih{" "}
              <strong className="text-orange-400">{submittedData.nama}</strong>,
              data biodata pengurus Anda telah tersimpan ke dalam database
              HimaDifa UAD.
            </p>

            {/* Quick Summary Card */}
            <div className="bg-slate-900/60 rounded-2xl p-4 mb-6 text-left border border-slate-700/60 text-xs sm:text-sm space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">NIM:</span>
                <span className="font-semibold text-white">
                  {submittedData.nim}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Angkatan:</span>
                <span className="font-semibold text-orange-400">
                  {submittedData.angkatan}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">WhatsApp:</span>
                <span className="font-semibold text-white">
                  {submittedData.no_whatsapp}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Jabatan:</span>
                <span className="font-semibold text-amber-300">
                  {submittedData.jabatan_hima}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={copySummary}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-orange-400" />
                    <span>Salin Ringkasan</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 py-3 px-4 rounded-xl btn-gradient-primary text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
