import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  History, 
  BarChart3, 
  Car, 
  Plus, 
  CheckCircle2, 
  Search,
  Wallet,
  Calendar,
  Receipt,
  Printer,
  X,
  Clock,
  Droplets,
  Sparkles,
  Wrench,
  Sun,
  Wind,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

// --- DATA MASTER LAYANAN ---
const SERVICES = [
  { id: 'w1', name: 'Basic Wash', category: 'Carwash', price: 150000, icon: <Droplets size={32} /> },
  { id: 'w2', name: 'Super Premium Wash', category: 'Carwash', price: { Kecil: 300000, Besar: 315000 }, icon: <Sparkles size={32} />, recommended: true },
  { id: 'w3', name: 'Premium Wash', category: 'Carwash', price: 200000, icon: <Wrench size={32} /> },
  { id: 'd1', name: 'Wash(Cuci) Engine', category: 'Engine', price: { Kecil: 125000, Besar: 145000 }, icon: <Car size={32} /> },
  { id: 'd2', name: 'Detailing Engine', category: 'Engine', price: 650000, icon: <Sun size={32} /> },
  { id: 'a2', name: 'Pembersih noda aspal (Ringan)', category: 'Layanan Tambahan', price: 50000, icon: <Wind size={32} /> },
];

const getPrice = (item, size) => {
  if (typeof item.price === 'number') return item.price;
  return item.price[size] || item.price['Kecil'];
};

export default function App() {
  const [activeTab, setActiveTab] = useState('kasir');
  const [activeNota, setActiveNota] = useState(null);
  const [dialog, setDialog] = useState(null);
  
  // State Layanan Custom & Order dengan LocalStorage
  const [customServices, setCustomServices] = useState(() => {
    try {
      const saved = localStorage.getItem('l_carwash_custom_services');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  }); 
  
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('l_carwash_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    localStorage.setItem('l_carwash_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('l_carwash_custom_services', JSON.stringify(customServices));
  }, [customServices]);

  const formatRp = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  const showAlert = (message) => setDialog({ type: 'alert', message });
  const showConfirm = (message, onConfirm) => setDialog({ type: 'confirm', message, onConfirm });

  return (
    <div className="bg-slate-50 text-slate-800 w-full h-[100dvh] relative overflow-hidden flex flex-col font-sans">
      {/* GLOBAL STYLES */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;900&display=swap');
        
        html, body { 
          font-family: 'Outfit', sans-serif; 
          margin: 0; 
          padding: 0; 
          overflow: hidden !important; 
          background-color: #f8fafc;
          overscroll-behavior: none !important;
          -webkit-tap-highlight-color: transparent;
        }

        #root { width: 100%; height: 100%; }
        
        .icon-yellow-grad svg { stroke: url(#yellow-gradient) !important; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}} />

      {/* Definisi Gradient untuk Icon */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="yellow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>

      {/* HEADER SECTION (Menyatu dengan batas atas layar) */}
      <div className="shrink-0 z-10 w-full bg-slate-50">
        <div className="bg-[#24429A] rounded-b-[2.5rem] px-6 pt-10 pb-8 flex flex-col justify-center shadow-xl shadow-[#24429A]/10 text-white relative overflow-hidden">
          {/* Aksen Dekoratif */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h1 className="text-base font-black tracking-[0.1em] text-white uppercase drop-shadow-md">L Carwash & Detailing</h1>
              <p className="text-[11px] font-bold tracking-[0.25em] text-orange-400 mt-1 uppercase">Home Service</p>
            </div>
            <div className="bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md shadow-sm">
              <User size={24} className="text-white"/>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-40 px-5 pt-6 w-full relative">
        {activeTab === 'kasir' && <KasirView services={SERVICES} customServices={customServices} setCustomServices={setCustomServices} setOrders={setOrders} formatRp={formatRp} setActiveTab={setActiveTab} setActiveNota={setActiveNota} showAlert={showAlert} />}
        {activeTab === 'kalender' && <KalenderView orders={orders} formatRp={formatRp} setActiveNota={setActiveNota} />}
        {activeTab === 'riwayat' && <RiwayatView orders={orders} setOrders={setOrders} formatRp={formatRp} setActiveNota={setActiveNota} showAlert={showAlert} showConfirm={showConfirm} />}
        {activeTab === 'laporan' && <LaporanView orders={orders} formatRp={formatRp} />}
      </div>

      {/* NAVIGASI BAWAH */}
      <div className="fixed bottom-6 left-4 right-4 bg-[#1e3a8a] flex justify-between items-center px-2 py-2 z-50 rounded-full shadow-[0_15px_35px_-5px_rgba(30,58,138,0.5)] border border-white/10 mx-auto max-w-lg">
        <NavItem icon={<ClipboardList />} label="Kasir" isActive={activeTab === 'kasir'} onClick={() => setActiveTab('kasir')} />
        <NavItem icon={<CalendarDays />} label="Jadwal" isActive={activeTab === 'kalender'} onClick={() => setActiveTab('kalender')} />
        <NavItem icon={<History />} label="Riwayat" isActive={activeTab === 'riwayat'} onClick={() => setActiveTab('riwayat')} />
        <NavItem icon={<BarChart3 />} label="Laporan" isActive={activeTab === 'laporan'} onClick={() => setActiveTab('laporan')} />
      </div>

      {/* MODAL NOTA */}
      {activeNota && <NotaModal order={activeNota} formatRp={formatRp} onClose={() => setActiveNota(null)} showAlert={showAlert} />}

      {/* MODAL ALERT/CONFIRM */}
      {dialog && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs shadow-2xl text-center border border-slate-100">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-5 font-bold text-3xl shadow-inner shadow-amber-200/50">!</div>
            <p className="text-slate-800 font-bold mb-8 text-base">{dialog.message}</p>
            <div className="flex gap-3">
              {dialog.type === 'confirm' && (
                <button onClick={() => setDialog(null)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm active:bg-slate-200 transition-colors">Batal</button>
              )}
              <button onClick={() => { if (dialog.onConfirm) dialog.onConfirm(); setDialog(null); }} className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-200 active:scale-95 transition-transform">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-KOMPONEN NAVIGASI ---
function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-yellow-400 text-[#1e3a8a] px-6 py-3 rounded-full font-black shadow-lg scale-105' : 'text-white/40 p-3 hover:text-white/70 active:scale-95'}`}>
      {React.cloneElement(icon, { size: 22, strokeWidth: isActive ? 2.5 : 2 })}
      {isActive && <span className="ml-2 text-xs tracking-tight">{label}</span>}
    </button>
  );
}

// --- VIEW: KASIR ---
function KasirView({ services, customServices, setCustomServices, setOrders, formatRp, setActiveTab, setActiveNota, showAlert }) {
  const [customerName, setCustomerName] = useState('');
  const [plate, setPlate] = useState('');
  const [carType, setCarType] = useState('');
  const [carSize, setCarSize] = useState('Kecil');
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderTime, setOrderTime] = useState(new Date().toTimeString().slice(0, 5));
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  const allServices = [...services, ...customServices];
  const groupedServices = allServices.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  const toggleItem = (service) => {
    const exists = selectedItems.find(item => item.id === service.id);
    if (exists) setSelectedItems(selectedItems.filter(item => item.id !== service.id));
    else setSelectedItems([...selectedItems, service]);
  };

  const currentTotal = selectedItems.reduce((sum, item) => sum + getPrice(item, carSize), 0);

  const handleSimpan = () => {
    if (selectedItems.length === 0) return showAlert('Pilih minimal 1 layanan!');
    if (!plate) return showAlert('Plat nomor wajib diisi!');
    
    const itemsWithPrice = selectedItems.map(item => ({ ...item, calculatedPrice: getPrice(item, carSize) }));
    
    const newOrder = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: orderDate.split('-').reverse().join('/'),
      time: orderTime,
      customerName: customerName || 'Pelanggan Umum',
      plate: plate.toUpperCase(),
      carType: carType || '-',
      carSize: selectedItems.some(i => typeof i.price === 'object') ? carSize : '-', 
      items: itemsWithPrice,
      total: currentTotal,
      status: 'Belum Lunas'
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveTab('riwayat');
    setActiveNota(newOrder);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      
      {/* SECTION FORM KENDARAAN LEBIH PROFESIONAL */}
      <div>
        <h2 className="font-black text-lg text-slate-800 flex items-center gap-2.5 mb-4 pl-1">
          <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Car size={20}/></div>
          Data Kendaraan
        </h2>
        
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-5">
          {/* Row 1: Tanggal & Jam */}
          <div className="grid grid-cols-2 gap-4 pb-5 border-b border-slate-50">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12}/> Tanggal</label>
              <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> Jam</label>
              <input type="time" value={orderTime} onChange={e => setOrderTime(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"/>
            </div>
          </div>

          {/* Row 2: Plat & Tipe */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Plat Nomor</label>
              <input type="text" placeholder="B 1234 XYZ" value={plate} onChange={e => setPlate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-black uppercase outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tipe Mobil</label>
              <input type="text" placeholder="Pajero Sport" value={carType} onChange={e => setCarType(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"/>
            </div>
          </div>

          {/* Row 3: Nama Pemilik */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Nama Pemilik</label>
            <input type="text" placeholder="Masukkan nama pelanggan..." value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"/>
          </div>
        </div>
      </div>

      {/* SECTION DAFTAR LAYANAN */}
      <div className="space-y-6 pt-4">
        {Object.keys(groupedServices).map(cat => (
          <div key={cat} className="space-y-3">
            <h3 className="font-black text-xs text-slate-400 uppercase tracking-[0.2em] ml-2">{cat}</h3>
            <div className="grid grid-cols-2 gap-3">
              {groupedServices[cat].map(item => {
                const isSelected = selectedItems.find(i => i.id === item.id);
                return (
                  <div key={item.id} onClick={() => toggleItem(item)} className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center relative cursor-pointer active:scale-[0.98] ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'}`}>
                    {isSelected && <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-0.5 shadow-sm"><CheckCircle2 size={16}/></div>}
                    <div className="mb-3 icon-yellow-grad">{item.category === 'Layanan Custom' ? <Wrench size={32}/> : item.icon}</div>
                    <p className="text-[12px] font-bold leading-tight mb-1 text-slate-800">{item.name}</p>
                    <p className="text-sm font-black text-blue-600">{formatRp(getPrice(item, carSize))}</p>
                    {isSelected && typeof item.price === 'object' && (
                      <select value={carSize} onChange={e => {e.stopPropagation(); setCarSize(e.target.value)}} className="mt-4 w-full text-xs p-2.5 border border-blue-200 rounded-xl bg-blue-100 text-blue-800 font-bold outline-none text-center appearance-none cursor-pointer">
                        <option value="Kecil">Mobil Kecil</option>
                        <option value="Besar">Mobil Besar</option>
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* CUSTOM LAYANAN */}
        {!showCustomForm ? (
          <button onClick={() => setShowCustomForm(true)} className="w-full py-5 border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 text-xs font-bold flex items-center justify-center gap-2 bg-white hover:bg-slate-50 hover:text-slate-500 hover:border-slate-400 transition-colors active:bg-slate-100 mb-10">
            <Plus size={18}/> Tambah Layanan Khusus
          </button>
        ) : (
          <div className="bg-blue-50 p-5 rounded-[2rem] border border-blue-200 space-y-4 mb-10 shadow-inner">
             <div className="flex justify-between items-center px-1">
                <span className="text-sm font-black text-blue-800">Layanan Baru</span>
                <button onClick={() => setShowCustomForm(false)} className="bg-blue-100 p-1.5 rounded-full text-blue-500"><X size={18}/></button>
             </div>
             <input type="text" placeholder="Nama Layanan (Misa: Poles Kaca)" value={customName} onChange={e => setCustomName(e.target.value)} className="w-full p-4 rounded-2xl text-sm font-bold bg-white border border-blue-100 outline-none focus:ring-2 focus:ring-blue-400 placeholder:font-medium"/>
             <input type="number" placeholder="Harga (Rp)" value={customPrice} onChange={e => setCustomPrice(e.target.value)} className="w-full p-4 rounded-2xl text-sm font-bold bg-white border border-blue-100 outline-none focus:ring-2 focus:ring-blue-400 placeholder:font-medium"/>
             <button onClick={() => {
                if(!customName || !customPrice) return;
                const ns = { id: Date.now(), name: customName, price: parseInt(customPrice), category: 'Layanan Custom' };
                setCustomServices([...customServices, ns]);
                setSelectedItems([...selectedItems, ns]);
                setCustomName(''); setCustomPrice(''); setShowCustomForm(false);
             }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-sm shadow-xl shadow-blue-200/50 active:scale-95 transition-transform mt-2">Simpan ke Daftar</button>
          </div>
        )}
      </div>

      {/* TABS BAWAH: Total Harga & Tombol Simpan */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-5 pb-[110px] shadow-[0_-15px_40px_rgba(0,0,0,0.08)] rounded-t-[3rem] flex justify-between items-center z-40 border-t border-slate-100 max-w-lg mx-auto">
        <div className="pl-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Tagihan</p>
          <p className="text-2xl font-black text-blue-600 leading-none tracking-tight">{formatRp(currentTotal)}</p>
        </div>
        <button onClick={handleSimpan} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-transform flex items-center gap-2">
          Simpan <CheckCircle2 size={20}/>
        </button>
      </div>
    </div>
  );
}

// --- VIEW: KALENDER / JADWAL ---
function KalenderView({ orders, formatRp, setActiveNota }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  const dayOrders = orders.filter(o => o.date === `${selectedDate.getDate().toString().padStart(2,'0')}/${(selectedDate.getMonth()+1).toString().padStart(2,'0')}/${selectedDate.getFullYear()}`);

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()-1)))} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"><ChevronLeft size={20} className="text-slate-500"/></button>
          <h3 className="font-black text-slate-800 text-base">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()+1)))} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"><ChevronRight size={20} className="text-slate-500"/></button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d => <div key={d} className="text-[10px] font-black text-slate-300 py-2 tracking-widest">{d}</div>)}
          {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()}).map((_, i) => <div key={i}/>)}
          {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0).getDate()}).map((_, i) => {
            const day = i + 1;
            const isSel = day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth();
            return (
              <div key={day} onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))} className={`aspect-square flex items-center justify-center text-sm font-bold rounded-full cursor-pointer transition-all ${isSel ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : 'text-slate-600 hover:bg-slate-50'}`}>
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-black text-sm px-2 mb-4 text-slate-800 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          Jadwal: {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
        </h3>
        <div className="space-y-4">
          {dayOrders.length === 0 ? (
            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
              <CalendarDays className="mx-auto text-slate-300 mb-3" size={40}/>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Tidak ada jadwal</p>
            </div>
          ) : dayOrders.map(o => (
            <div key={o.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex gap-4 items-center shadow-sm">
              <div className="text-center border-r pr-5 border-slate-100"><p className="text-sm font-black text-blue-600">{o.time}</p></div>
              <div className="flex-1"><p className="font-black text-slate-800 text-base">{o.plate}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{o.customerName}</p></div>
              <button onClick={() => setActiveNota(o)} className="p-3.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-colors"><Printer size={20}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- VIEW: RIWAYAT PESANAN ---
function RiwayatView({ orders, setOrders, formatRp, setActiveNota, showConfirm }) {
  const [search, setSearch] = useState('');
  const filtered = orders.filter(o => o.plate.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="bg-white p-1 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center px-5">
        <Search size={20} className="text-slate-300"/>
        <input type="text" placeholder="Cari Plat Nomor atau ID Transaksi..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 p-4 text-sm font-bold outline-none bg-transparent placeholder:font-medium"/>
      </div>
      
      <div className="space-y-5 pb-10">
        {filtered.length === 0 ? <p className="text-center py-20 text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Data Tidak Ditemukan</p> : 
          filtered.map(order => (
            <div key={order.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${order.status === 'Lunas' ? 'bg-green-500' : 'bg-amber-500'}`}/>
              <div className="flex justify-between items-start mb-4 pl-3">
                <div>
                  <h4 className="font-black text-slate-800 text-xl tracking-tight">{order.plate}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{order.customerName}</p>
                </div>
                <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest ${order.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
              </div>
              
              <div className="bg-slate-50 rounded-3xl p-5 my-4 text-xs font-semibold text-slate-600 border border-slate-100">
                <ul className="space-y-2">
                  {order.items.map((it, i) => <li key={i} className="flex justify-between"><span>• {it.name}</span> <span className="font-black text-slate-400">{formatRp(it.calculatedPrice)}</span></li>)}
                </ul>
              </div>

              <div className="flex justify-between items-center pl-3">
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Tagihan</p>
                  <p className="font-black text-blue-600 text-xl">{formatRp(order.total)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActiveNota(order)} className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-colors"><Printer size={20}/></button>
                  {order.status !== 'Lunas' && (
                    <button onClick={() => showConfirm(`Konfirmasi Lunas untuk ${formatRp(order.total)}?`, () => setOrders(prev => prev.map(o => o.id === order.id ? {...o, status: 'Lunas'} : o)))} className="bg-green-500 hover:bg-green-600 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-xl shadow-green-200 active:scale-95 transition-transform">LUNASI</button>
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// --- VIEW: LAPORAN ---
function LaporanView({ orders, formatRp }) {
  const lunas = orders.filter(o => o.status === 'Lunas');
  const total = lunas.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <Wallet className="absolute -right-6 -top-6 w-40 h-40 text-white/5 rotate-12" />
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total Pendapatan</p>
          <h3 className="text-4xl font-black tracking-tighter">{formatRp(total)}</h3>
          <p className="text-xs text-blue-400 font-bold mt-4">Hanya menghitung transaksi lunas</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Unit Selesai</p>
          <p className="text-4xl font-black text-green-500">{lunas.length}</p>
        </div>
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Total Antrian</p>
          <p className="text-4xl font-black text-slate-700">{orders.length}</p>
        </div>
      </div>
    </div>
  );
}

// --- KOMPONEN MODAL NOTA (CETAK) ---
function NotaModal({ order, formatRp, onClose, showAlert }) {
  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center p-5 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
        <div className="bg-slate-50 p-8 text-center relative border-b border-dashed border-slate-200">
          <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"><X size={24}/></button>
          <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200"><Receipt size={32}/></div>
          <h2 className="font-black text-slate-800 text-xl tracking-tighter">L CARWASH</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Home Service</p>
        </div>
        
        <div className="p-8 text-xs space-y-6">
          <div className="flex justify-between border-b border-dashed border-slate-100 pb-4">
             <span className="font-black text-slate-400 uppercase tracking-widest">{order.date}</span>
             <span className="font-black text-blue-600 tracking-widest">{order.id}</span>
          </div>
          
          <div>
            <p className="font-black text-2xl text-slate-800 tracking-tighter">{order.plate}</p>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mt-1">{order.customerName}</p>
          </div>

          <div className="py-5 border-y border-dashed border-slate-200 space-y-3">
            {order.items.map((it, i) => (
              <div key={i} className="flex justify-between items-center text-slate-600 font-bold">
                <span>{it.name}</span>
                <span className="font-black text-slate-900">{formatRp(it.calculatedPrice)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-2xl font-black pt-2">
            <span className="text-slate-800 tracking-tighter">TOTAL</span>
            <span className="text-blue-600">{formatRp(order.total)}</span>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-4.5 rounded-2xl font-black uppercase tracking-widest bg-white border border-slate-200 text-slate-400 text-[10px] active:bg-slate-100">Tutup</button>
          <button onClick={() => showAlert('Mencetak struk thermal...')} className="flex-1 py-4.5 rounded-2xl font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-200 text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <Printer size={16}/> Cetak
          </button>
        </div>
      </div>
    </div>
  );
}
