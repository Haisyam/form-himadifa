'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  LogOut,
  RefreshCw,
  Briefcase,
  GraduationCap,
  Phone,
  Building2,
  MapPin,
  X,
  Check,
  Filter,
  Eye,
  ArrowLeft,
  ShieldCheck,
  User,
  CreditCard,
  FileSpreadsheet
} from 'lucide-react';

interface Pengurus {
  id: number;
  nama: string;
  nim: string;
  angkatan: string;
  asal_instansi: string;
  alamat_domisili: string;
  no_whatsapp: string;
  jabatan_hima: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [pengurusList, setPengurusList] = useState<Pengurus[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAngkatan, setSelectedAngkatan] = useState('ALL');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showJabatanModal, setShowJabatanModal] = useState(false);

  const [activeItem, setActiveItem] = useState<Pengurus | null>(null);

  // Form states for Create/Edit
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    angkatan: 'DIFA4',
    asal_instansi: 'Universitas Ahmad Dahlan',
    alamat_domisili: '',
    no_whatsapp: '',
    jabatan_hima: 'Anggota HIMA',
  });

  const [quickJabatan, setQuickJabatan] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        setAuthChecking(false);
        fetchData();
      } catch (err) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pengurus');
      const json = await res.json();
      if (json.success) {
        setPengurusList(json.data);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  // Filter Data
  const filteredList = pengurusList.filter((item) => {
    const matchesAngkatan = selectedAngkatan === 'ALL' || item.angkatan === selectedAngkatan;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.nama.toLowerCase().includes(q) ||
      item.nim.toLowerCase().includes(q) ||
      item.asal_instansi.toLowerCase().includes(q) ||
      item.alamat_domisili.toLowerCase().includes(q) ||
      item.no_whatsapp.toLowerCase().includes(q) ||
      item.jabatan_hima.toLowerCase().includes(q);
    return matchesAngkatan && matchesSearch;
  });

  // Analytics Stats
  const totalCount = pengurusList.length;
  const difa3Count = pengurusList.filter((i) => i.angkatan === 'DIFA3').length;
  const difa4Count = pengurusList.filter((i) => i.angkatan === 'DIFA4').length;
  const difa5Count = pengurusList.filter((i) => i.angkatan === 'DIFA5').length;
  const jabatanAssignedCount = pengurusList.filter(
    (i) => i.jabatan_hima && i.jabatan_hima !== 'Belum Ditentukan'
  ).length;

  // Open Create Modal
  const openCreateModal = () => {
    setFormData({
      nama: '',
      nim: '',
      angkatan: 'DIFA4',
      asal_instansi: 'Universitas Ahmad Dahlan',
      alamat_domisili: '',
      no_whatsapp: '',
      jabatan_hima: 'Pengurus HIMA',
    });
    setShowCreateModal(true);
  };

  // Submit Create
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/pengurus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setShowCreateModal(false);
        showToast('Berhasil menambahkan data pengurus!');
        fetchData();
      } else {
        alert(json.message || 'Gagal membuat data.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (item: Pengurus) => {
    setActiveItem(item);
    setFormData({
      nama: item.nama,
      nim: item.nim,
      angkatan: item.angkatan,
      asal_instansi: item.asal_instansi,
      alamat_domisili: item.alamat_domisili,
      no_whatsapp: item.no_whatsapp,
      jabatan_hima: item.jabatan_hima,
    });
    setShowEditModal(true);
  };

  // Submit Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/pengurus/${activeItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setShowEditModal(false);
        showToast('Berhasil mengupdate data pengurus!');
        fetchData();
      } else {
        alert(json.message || 'Gagal update data.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Quick Jabatan Modal
  const openJabatanModal = (item: Pengurus) => {
    setActiveItem(item);
    setQuickJabatan(item.jabatan_hima || '');
    setShowJabatanModal(true);
  };

  // Submit Quick Jabatan Update
  const handleJabatanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/pengurus/${activeItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jabatan_hima: quickJabatan }),
      });
      const json = await res.json();
      if (json.success) {
        setShowJabatanModal(false);
        showToast('Jabatan HIMA berhasil diperbarui!');
        fetchData();
      } else {
        alert(json.message || 'Gagal update jabatan.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (item: Pengurus) => {
    setActiveItem(item);
    setShowDeleteModal(true);
  };

  // Submit Delete
  const handleDeleteSubmit = async () => {
    if (!activeItem) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/pengurus/${activeItem.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setShowDeleteModal(false);
        showToast('Data pengurus berhasil dihapus!');
        fetchData();
      } else {
        alert(json.message || 'Gagal menghapus data.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setActionLoading(false);
    }
  };

  // Export CSV Function
  const exportToCSV = () => {
    if (pengurusList.length === 0) return;
    const headers = ['ID', 'Nama', 'NIM', 'Angkatan', 'Instansi', 'Domisili/Alamat', 'No WhatsApp', 'Jabatan HIMA'];
    const rows = filteredList.map((item) => [
      item.id,
      `"${item.nama.replace(/"/g, '""')}"`,
      `"${item.nim}"`,
      `"${item.angkatan}"`,
      `"${item.asal_instansi.replace(/"/g, '""')}"`,
      `"${item.alamat_domisili.replace(/"/g, '""')}"`,
      `"${item.no_whatsapp}"`,
      `"${item.jabatan_hima.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Biodata_Pengurus_HimaDifa_UAD_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File CSV berhasil diunduh!');
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#06101E] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-orange-400">
          <RefreshCw className="w-8 h-8 animate-spin" />
          <span className="text-sm font-semibold text-slate-300">Memverifikasi Sesi Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06101E] via-[#091B33] to-[#0A2540] text-slate-100 flex flex-col" suppressHydrationWarning>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3 animate-fadeIn">
          <Check className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="w-full bg-[#08172C]/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-orange-500/40 bg-[#0A2540] flex items-center justify-center">
                <Image src="/logo himadifa.jpeg" alt="HIMADIFA" fill className="object-contain p-0.5" />
              </div>
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-orange-500/40 bg-[#0A2540] flex items-center justify-center">
                <Image src="/logo uad.png" alt="UAD Logo" fill className="object-contain p-0.5" />
              </div>
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border border-orange-500/40 bg-[#0A2540] flex items-center justify-center">
                <Image src="/logo nama uad.png" alt="Logo Nama UAD" fill className="object-contain p-0.5" />
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight flex items-center gap-2">
                <span>Dashboard Admin</span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  HimaDifa UAD
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden xs:block">Kelola & Verifikasi Biodata Pengurus</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Form Utama</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card rounded-2xl p-4 border border-slate-700/60 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Pengurus</span>
              <Users className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalCount}</div>
            <div className="text-[11px] text-slate-400 mt-1">Terdaftar di sistem</div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Angkatan DIFA3</span>
              <GraduationCap className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">{difa3Count}</div>
            <div className="text-[11px] text-slate-400 mt-1">Pengurus DIFA3</div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Angkatan DIFA4</span>
              <GraduationCap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{difa4Count}</div>
            <div className="text-[11px] text-slate-400 mt-1">Pengurus DIFA4</div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Angkatan DIFA5</span>
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{difa5Count}</div>
            <div className="text-[11px] text-slate-400 mt-1">Pengurus DIFA5</div>
          </div>
        </div>

        {/* Toolbar: Search, Filters, Add & Export */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-700/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIM, WhatsApp, domisili, atau jabatan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-slate-400"
            />
          </div>

          {/* Angkatan Filter Tabs */}
          <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-slate-700/60 overflow-x-auto">
            {['ALL', 'DIFA3', 'DIFA4', 'DIFA5'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedAngkatan(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  selectedAngkatan === tab
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'ALL' ? 'Semua Angkatan' : tab}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-xl btn-gradient-primary text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengurus</span>
            </button>
          </div>
        </div>

        {/* Data List Section */}
        <div className="glass-card rounded-2xl border border-slate-700/60 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
              <span className="text-sm font-semibold">Memuat Data Pengurus...</span>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Users className="w-12 h-12 text-slate-600 mb-2" />
              <p className="text-base font-semibold text-slate-300">Tidak ada data ditemukan</p>
              <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau filter angkatan.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-4">Pengurus</th>
                      <th className="py-4 px-4">Angkatan</th>
                      <th className="py-4 px-4">Jabatan HIMA</th>
                      <th className="py-4 px-4">Instansi & Domisili</th>
                      <th className="py-4 px-4">WhatsApp</th>
                      <th className="py-4 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-white text-sm">{item.nama}</div>
                          <div className="text-slate-400 text-xs flex items-center gap-1 font-mono">
                            <span>NIM: {item.nim}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                              item.angkatan === 'DIFA3'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : item.angkatan === 'DIFA4'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {item.angkatan}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 text-xs">
                              {item.jabatan_hima}
                            </span>
                            <button
                              onClick={() => openJabatanModal(item)}
                              title="Edit Jabatan HIMA"
                              className="text-slate-400 hover:text-orange-400 p-1 rounded hover:bg-slate-700/50 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="text-slate-200 text-xs">{item.asal_instansi}</div>
                          <div className="text-slate-400 text-[11px] truncate max-w-[200px]">{item.alamat_domisili}</div>
                        </td>

                        <td className="py-4 px-4">
                          <a
                            href={`https://wa.me/${item.no_whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-medium text-xs bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{item.no_whatsapp}</span>
                          </a>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setActiveItem(item);
                                setShowDetailModal(true);
                              }}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                              title="Lihat Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors cursor-pointer"
                              title="Edit Pengurus"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDeleteModal(item)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                              title="Hapus Pengurus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Responsive Card List View */}
              <div className="block md:hidden divide-y divide-slate-800">
                {filteredList.map((item) => (
                  <div key={item.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base">{item.nama}</h4>
                        <div className="text-slate-400 text-xs font-mono">NIM: {item.nim}</div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.angkatan === 'DIFA3'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : item.angkatan === 'DIFA4'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.angkatan}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl space-y-1.5 text-xs border border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Jabatan HIMA:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-amber-300">{item.jabatan_hima}</span>
                          <button
                            onClick={() => openJabatanModal(item)}
                            className="text-orange-400 p-0.5"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Instansi:</span>
                        <span className="text-slate-200 truncate max-w-[180px]">{item.asal_instansi}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Domisili:</span>
                        <span className="text-slate-200 truncate max-w-[180px]">{item.alamat_domisili}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-400">WhatsApp:</span>
                        <a
                          href={`https://wa.me/${item.no_whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 font-medium underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{item.no_whatsapp}</span>
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          setActiveItem(item);
                          setShowDetailModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-xs font-semibold text-blue-400 border border-blue-500/30 flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(item)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-xs font-semibold text-red-400 border border-red-500/30 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0F233D] border border-orange-500/40 rounded-3xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-400" />
                <span>Tambah Pengurus Baru</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">NIM *</label>
                <input
                  type="text"
                  required
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Angkatan *</label>
                <select
                  value={formData.angkatan}
                  onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-slate-900"
                >
                  <option value="DIFA3">DIFA3</option>
                  <option value="DIFA4">DIFA4</option>
                  <option value="DIFA5">DIFA5</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Jabatan HIMA (Admin) *</label>
                <input
                  type="text"
                  required
                  value={formData.jabatan_hima}
                  onChange={(e) => setFormData({ ...formData, jabatan_hima: e.target.value })}
                  placeholder="Contoh: Ketua Departemen Kominfo"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Asal Instansi *</label>
                <input
                  type="text"
                  required
                  value={formData.asal_instansi}
                  onChange={(e) => setFormData({ ...formData, asal_instansi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Wilayah Domisili / Alamat *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.alamat_domisili}
                  onChange={(e) => setFormData({ ...formData, alamat_domisili: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">No WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={formData.no_whatsapp}
                  onChange={(e) => setFormData({ ...formData, no_whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl btn-gradient-primary text-xs font-bold cursor-pointer"
                >
                  {actionLoading ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0F233D] border border-blue-500/40 rounded-3xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-400" />
                <span>Edit Biodata Pengurus</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">NIM</label>
                <input
                  type="text"
                  required
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Angkatan</label>
                <select
                  value={formData.angkatan}
                  onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-slate-900"
                >
                  <option value="DIFA3">DIFA3</option>
                  <option value="DIFA4">DIFA4</option>
                  <option value="DIFA5">DIFA5</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Jabatan HIMA (Diisi oleh Admin)</label>
                <input
                  type="text"
                  required
                  value={formData.jabatan_hima}
                  onChange={(e) => setFormData({ ...formData, jabatan_hima: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white border-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Asal Instansi</label>
                <input
                  type="text"
                  required
                  value={formData.asal_instansi}
                  onChange={(e) => setFormData({ ...formData, asal_instansi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Wilayah Domisili / Alamat</label>
                <textarea
                  required
                  rows={2}
                  value={formData.alamat_domisili}
                  onChange={(e) => setFormData({ ...formData, alamat_domisili: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">No WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={formData.no_whatsapp}
                  onChange={(e) => setFormData({ ...formData, no_whatsapp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white cursor-pointer"
                >
                  {actionLoading ? 'Menyimpan...' : 'Update Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK JABATAN EDIT MODAL */}
      {showJabatanModal && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F233D] border border-amber-500/40 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Update Jabatan HIMA</span>
              </h3>
              <button onClick={() => setShowJabatanModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4">
              Ubah jabatan struktural HIMA untuk pengurus <strong className="text-orange-400">{activeItem.nama}</strong> ({activeItem.nim}).
            </p>

            <form onSubmit={handleJabatanSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Jabatan HIMA Baru</label>
                <input
                  type="text"
                  required
                  value={quickJabatan}
                  onChange={(e) => setQuickJabatan(e.target.value)}
                  placeholder="Contoh: Ketua Divisi Humas"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJabatanModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 cursor-pointer"
                >
                  {actionLoading ? 'Menyimpan...' : 'Simpan Jabatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F233D] border border-slate-700 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                {activeItem.nama.charAt(0)}
              </div>
              <h3 className="text-lg font-bold text-white">{activeItem.nama}</h3>
              <p className="text-xs text-slate-400 font-mono">NIM: {activeItem.nim}</p>
            </div>

            <div className="bg-slate-900/80 rounded-2xl p-4 text-xs space-y-3 border border-slate-800">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Angkatan:</span>
                <span className="font-bold text-orange-400">{activeItem.angkatan}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Jabatan HIMA:</span>
                <span className="font-semibold text-amber-300">{activeItem.jabatan_hima}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Instansi:</span>
                <span className="text-slate-200 text-right">{activeItem.asal_instansi}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Domisili:</span>
                <span className="text-slate-200 text-right max-w-[200px]">{activeItem.alamat_domisili}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">WhatsApp:</span>
                <a
                  href={`https://wa.me/${activeItem.no_whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 font-semibold underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{activeItem.no_whatsapp}</span>
                </a>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-white cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0F233D] border border-red-500/40 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-3 border border-red-500/30">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">Hapus Data Pengurus?</h3>
            <p className="text-xs text-slate-300 mb-6">
              Apakah Anda yakin ingin menghapus data <strong className="text-red-400">{activeItem.nama}</strong> ({activeItem.nim})? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white cursor-pointer"
              >
                {actionLoading ? 'Hapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
