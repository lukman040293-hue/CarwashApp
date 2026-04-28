import React, { useState, useEffect, cloneElement } from 'react';
import { 
  ClipboardList, 
  History, 
  BarChart, 
  Car, 
  Plus, 
  CheckCircle, 
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
  User,
  MapPin,
  FileText,
  Download,
  Share2,
  FileDown
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
  if (!item || item.price === undefined) return 0;
  if (typeof item.price === 'number') return item.price;
  return item.price[size] || item.price['Kecil'] || 0;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('kasir');
  const [activeNota, setActiveNota] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  
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
    try {
      localStorage.setItem('l_carwash_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('l_carwash_custom_services', JSON.stringify(customServices));
    } catch (e) {}
  }, [customServices]);

  // LOGIKA PINTAR: Sembunyikan Navigasi saat Keyboard Terbuka
  useEffect(() => {
    let timeout;
    const handleFocusIn = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
        clearTimeout(timeout);
        setIsKeyboardOpen(true);
        const targetEl = e.target;
        timeout = setTimeout(() => {
          try {
            if (targetEl && typeof targetEl.scrollIntoView === 'function') {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          } catch (err) {} 
        }, 300);
      }
    };
    const handleFocusOut = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsKeyboardOpen(false);
      }, 100);
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
      clearTimeout(timeout);
    };
  }, []);

  const formatRp = (number) => {
    const num = Number(number) || 0;
    // Menggunakan format manual agar 100% bersih dari karakter aneh saat dicetak ke PDF
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  const showAlert = (message) => setDialog({ type: 'alert', message });
  const showConfirm = (message, onConfirm) => setDialog({ type: 'confirm', message, onConfirm });

  return (
    <div className="bg-slate-50 text-slate-800 w-full min-h-[100dvh] relative overflow-x-hidden flex flex-col font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;900&display=swap');
        html, body { font-family: 'Outfit', sans-serif; margin: 0; padding: 0; overflow-x: hidden; background-color: #f8fafc; overscroll-behavior: none !important; -webkit-tap-highlight-color: transparent; }
        #root { width: 100%; height: 100%; }
        .icon-yellow-grad svg { stroke: url(#yellow-gradient) !important; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}} />

      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="yellow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>

      {/* HEADER SECTION */}
      <div className="shrink-0 z-10 w-full">
        <div className="bg-[#24429A] rounded-b-[2rem] px-6 pt-8 pb-5 flex flex-col justify-center shadow-xl shadow-[#24429A]/10 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h1 className="text-base font-black tracking-[0.1em] text-white uppercase drop-shadow-md">L Carwash & Detailing</h1>
              <p className="text-[11px] font-bold tracking-[0.25em] text-orange-400 mt-1 uppercase">Home Service</p>
            </div>
            <div className="bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md shadow-sm">
              <User size={20} className="text-white"/>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32 px-5 pt-6 w-full relative">
        {activeTab === 'kasir' && <KasirView services={SERVICES} customServices={customServices} setCustomServices={setCustomServices} setOrders={setOrders} formatRp={formatRp} setActiveTab={setActiveTab} setActiveNota={setActiveNota} showAlert={showAlert} />}
        {activeTab === 'kalender' && <KalenderView orders={orders} formatRp={formatRp} setActiveNota={setActiveNota} />}
        {activeTab === 'riwayat' && <RiwayatView orders={orders} setOrders={setOrders} formatRp={formatRp} setActiveNota={setActiveNota} showAlert={showAlert} showConfirm={showConfirm} />}
        {activeTab === 'laporan' && <LaporanView orders={orders} formatRp={formatRp} showAlert={showAlert} />}
      </div>

      {/* NAVIGASI BAWAH */}
      <div className={`fixed bottom-6 left-4 right-4 bg-[#1e3a8a] flex justify-between items-center px-2 py-2 z-50 rounded-full shadow-[0_15px_35px_-5px_rgba(30,58,138,0.5)] border border-white/10 mx-auto max-w-lg transition-transform duration-300 ease-in-out ${isKeyboardOpen ? 'translate-y-[150%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <NavItem icon={ClipboardList} label="Kasir" isActive={activeTab === 'kasir'} onClick={() => setActiveTab('kasir')} />
        <NavItem icon={CalendarDays} label="Jadwal" isActive={activeTab === 'kalender'} onClick={() => setActiveTab('kalender')} />
        <NavItem icon={History} label="Riwayat" isActive={activeTab === 'riwayat'} onClick={() => setActiveTab('riwayat')} />
        <NavItem icon={BarChart} label="Laporan" isActive={activeTab === 'laporan'} onClick={() => setActiveTab('laporan')} />
      </div>

      {/* MODALS */}
      {activeNota && <NotaModal order={activeNota} formatRp={formatRp} onClose={() => setActiveNota(null)} showAlert={showAlert} />}
      {dialog && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs shadow-2xl text-center border border-slate-100">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-5 font-bold text-3xl shadow-inner shadow-amber-200/50">!</div>
            <p className="text-slate-800 font-bold mb-8 text-base">{dialog.message}</p>
            <div className="flex gap-3">
              {dialog.type === 'confirm' && <button onClick={() => setDialog(null)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm active:bg-slate-200 transition-colors">Batal</button>}
              <button onClick={() => { if (dialog.onConfirm) dialog.onConfirm(); setDialog(null); }} className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-xl shadow-blue-200 active:scale-95 transition-transform">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-yellow-400 text-[#1e3a8a] px-6 py-3 rounded-full font-black shadow-lg scale-105' : 'text-white/40 p-3 hover:text-white/70 active:scale-95'}`}>
      <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
      {isActive && <span className="ml-2 text-xs tracking-tight">{label}</span>}
    </button>
  );
}

// --- VIEW: KASIR ---
function KasirView({ services, customServices, setCustomServices, setOrders, formatRp, setActiveTab, setActiveNota, showAlert }) {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
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
    if (!address) return showAlert('Alamat wajib diisi untuk Home Service!');
    
    const itemsWithPrice = selectedItems.map(item => ({ ...item, calculatedPrice: getPrice(item, carSize) }));
    
    const newOrder = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: orderDate.split('-').reverse().join('/'),
      time: orderTime,
      customerName: customerName || 'Pelanggan Umum',
      address: address || '-', 
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
      <div>
        <h2 className="font-black text-lg text-slate-800 flex items-center gap-2.5 mb-4 pl-1">
          <div className="p-2 bg-blue-100 rounded-xl text-blue-600"><Car size={20}/></div>
          Pelanggan & Kendaraan
        </h2>
        
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pl-1"><Calendar size={12}/> Tanggal</label>
            <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"/>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pl-1"><Clock size={12}/> Jam</label>
            <input type="time" value={orderTime} onChange={e => setOrderTime(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"/>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5"><User size={12}/> Nama Pemilik</label>
            <input type="text" placeholder="Masukkan nama pelanggan..." value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"/>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5"><MapPin size={12}/> Alamat Lengkap</label>
            <textarea placeholder="Masukkan alamat lokasi pelanggan..." value={address} onChange={e => setAddress(e.target.value)} rows="3" className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium resize-none"></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tipe Mobil</label>
            <input type="text" placeholder="Contoh: Pajero Sport, Avanza" value={carType} onChange={e => setCarType(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"/>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Plat Nomor</label>
            <input type="text" placeholder="B 1234 XYZ" value={plate} onChange={e => setPlate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-black uppercase outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"/>
          </div>
        </div>
      </div>

      {/* SECTION DAFTAR LAYANAN */}
      <div className="space-y-6 pt-4">
        {Object.keys(groupedServices).map(cat => (
          <div key={cat} className="space-y-4">
            <h3 className="font-black text-xs text-slate-400 uppercase tracking-[0.2em] ml-2">{cat}</h3>
            <div className="grid grid-cols-1 gap-4">
              {groupedServices[cat].map(item => {
                const isSelected = selectedItems.find(i => i.id === item.id);
                return (
                  <div key={item.id} onClick={() => toggleItem(item)} className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center relative cursor-pointer active:scale-[0.98] ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'}`}>
                    {isSelected && <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-1 shadow-sm"><CheckCircle size={20}/></div>}
                    <div className="mb-4 icon-yellow-grad scale-125">{item.category === 'Layanan Custom' ? <Wrench size={32}/> : item.icon}</div>
                    <p className="text-sm font-bold leading-tight mb-2 text-slate-800">{item.name}</p>
                    <p className="text-lg font-black text-blue-600">{formatRp(getPrice(item, carSize))}</p>
                    {isSelected && typeof item.price === 'object' && (
                      <select 
                        value={carSize} 
                        onChange={e => {e.stopPropagation(); setCarSize(e.target.value)}} 
                        onClick={e => e.stopPropagation()}
                        className="mt-5 w-full max-w-[200px] text-sm p-3 border border-blue-200 rounded-xl bg-blue-100 text-blue-800 font-bold outline-none text-center appearance-none cursor-pointer"
                      >
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

        {!showCustomForm ? (
          <button onClick={() => setShowCustomForm(true)} className="w-full py-5 border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 text-sm font-bold flex items-center justify-center gap-2 bg-white hover:bg-slate-50 transition-colors active:bg-slate-100">
            <Plus size={20}/> Tambah Layanan Khusus
          </button>
        ) : (
          <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-200 space-y-4 shadow-inner">
             <div className="flex justify-between items-center px-1">
                <span className="text-base font-black text-blue-800">Layanan Baru</span>
                <button onClick={() => setShowCustomForm(false)} className="bg-blue-100 p-2 rounded-full text-blue-500"><X size={20}/></button>
             </div>
             <input type="text" placeholder="Nama Layanan (Misa: Poles Kaca)" value={customName} onChange={e => setCustomName(e.target.value)} className="w-full p-4 rounded-2xl text-sm font-bold bg-white border border-blue-100 outline-none focus:ring-2 focus:ring-blue-400"/>
             <input type="number" placeholder="Harga (Rp)" value={customPrice} onChange={e => setCustomPrice(e.target.value)} className="w-full p-4 rounded-2xl text-sm font-bold bg-white border border-blue-100 outline-none focus:ring-2 focus:ring-blue-400"/>
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

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center w-full mt-6 mb-8">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Tagihan</p>
          <p className="text-2xl font-black text-blue-600 leading-none tracking-tight truncate">{formatRp(currentTotal)}</p>
        </div>
        <button onClick={handleSimpan} className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
          Simpan <CheckCircle size={20}/>
        </button>
      </div>
    </div>
  );
}

// --- VIEW: KALENDER / JADWAL ---
function KalenderView({ orders, formatRp, setActiveNota }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); 
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  const currentMonthStr = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentYearStr = currentDate.getFullYear().toString();
  
  const monthOrders = orders.filter(o => o.date && o.date.endsWith(`/${currentMonthStr}/${currentYearStr}`));
  
  monthOrders.sort((a, b) => {
    const timeA = a.time || '';
    const timeB = b.time || '';
    const dayA = parseInt((a.date || '').split('/')[0], 10) || 0;
    const dayB = parseInt((b.date || '').split('/')[0], 10) || 0;
    if (dayA !== dayB) return dayA - dayB;
    return timeA.localeCompare(timeB);
  });

  const displayOrders = selectedDate 
    ? monthOrders.filter(o => o.date === `${selectedDate.getDate().toString().padStart(2,'0')}/${currentMonthStr}/${currentYearStr}`)
    : monthOrders;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()-1)));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()+1)));
    setSelectedDate(null);
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth()) {
      setSelectedDate(null);
    } else {
      setSelectedDate(clickedDate);
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handlePrevMonth} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"><ChevronLeft size={20} className="text-slate-500"/></button>
          <h3 className="font-black text-slate-800 text-base">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={handleNextMonth} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors"><ChevronRight size={20} className="text-slate-500"/></button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d => <div key={d} className="text-[10px] font-black text-slate-300 py-2 tracking-widest">{d}</div>)}
          {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()}).map((_, i) => <div key={i}/>)}
          {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0).getDate()}).map((_, i) => {
            const day = i + 1;
            const isSel = selectedDate && day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth();
            const dateStr = `${day.toString().padStart(2,'0')}/${currentMonthStr}/${currentYearStr}`;
            const hasOrder = monthOrders.some(o => o.date === dateStr);

            return (
              <div key={day} onClick={() => handleDateClick(day)} className={`aspect-square flex flex-col items-center justify-center rounded-full cursor-pointer transition-all ${isSel ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : 'text-slate-600 hover:bg-slate-50'}`}>
                <span className="text-sm font-bold leading-none">{day}</span>
                {hasOrder && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSel ? 'bg-white' : 'bg-orange-500'}`}></div>}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            {selectedDate ? `Jadwal: ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}` : `Semua Jadwal Bulan Ini`}
          </h3>
          {selectedDate && (
            <button onClick={() => setSelectedDate(null)} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
              Lihat Semua
            </button>
          )}
        </div>

        <div className="space-y-4">
          {displayOrders.length === 0 ? (
            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
              <CalendarDays className="mx-auto text-slate-300 mb-3" size={40}/>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Tidak ada jadwal</p>
            </div>
          ) : displayOrders.map(o => (
            <div key={o.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex gap-4 items-center shadow-sm">
              <div className="text-center border-r pr-5 border-slate-100 min-w-[70px]">
                <p className="text-[10px] font-black text-slate-400 mb-1">{(o.date || '').substring(0, 5)}</p>
                <p className="text-sm font-black text-blue-600">{o.time || '-'}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-800 text-base truncate">{o.plate || '-'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">{o.customerName || '-'}</p>
                <p className="text-[10px] font-medium text-slate-500 mt-1.5 flex items-start gap-1 leading-snug">
                  <MapPin size={12} className="shrink-0 text-slate-400 mt-0.5"/> 
                  <span className="line-clamp-2">{o.address || '-'}</span>
                </p>
              </div>
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
  
  const filtered = orders.filter(o => {
    const s = search.toLowerCase();
    const plate = o.plate || '';
    const id = o.id || '';
    const address = o.address || '';
    return plate.toLowerCase().includes(s) || id.toLowerCase().includes(s) || address.toLowerCase().includes(s);
  });

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="bg-white p-1 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center px-5">
        <Search size={20} className="text-slate-300"/>
        <input type="text" placeholder="Cari Plat, ID, atau Alamat..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 p-4 text-sm font-bold outline-none bg-transparent placeholder:font-medium"/>
      </div>
      
      <div className="space-y-5 pb-10">
        {filtered.length === 0 ? <p className="text-center py-20 text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Data Tidak Ditemukan</p> : 
          filtered.map(order => (
            <div key={order.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${order.status === 'Lunas' ? 'bg-green-500' : 'bg-amber-500'}`}/>
              <div className="flex justify-between items-start mb-4 pl-3">
                <div className="pr-2">
                  <h4 className="font-black text-slate-800 text-xl tracking-tight">{order.plate || '-'}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{order.customerName || '-'}</p>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{order.address || '-'}</p>
                </div>
                <span className={`text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest shrink-0 ${order.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
              </div>
              
              <div className="bg-slate-50 rounded-3xl p-5 my-4 text-xs font-semibold text-slate-600 border border-slate-100">
                <ul className="space-y-2">
                  {(order.items || []).map((it, i) => <li key={i} className="flex justify-between"><span>• {it.name}</span> <span className="font-black text-slate-400">{formatRp(it.calculatedPrice)}</span></li>)}
                </ul>
              </div>

              <div className="flex justify-between items-center pl-3">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Tagihan</p>
                  <p className="font-black text-blue-600 text-xl truncate">{formatRp(order.total)}</p>
                </div>
                <div className="flex gap-2 shrink-0">
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
function LaporanView({ orders, formatRp, showAlert }) {
  const [filterMonth, setFilterMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  const [year, month] = filterMonth.split('-');
  const monthStr = month ? `${month}/${year}` : ''; 
  const displayMonthName = month ? `${monthNames[parseInt(month)-1]} ${year}` : '';

  const lunasAll = orders.filter(o => o.status === 'Lunas');
  const totalAll = lunasAll.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const monthOrders = orders.filter(o => o.date && o.date.endsWith(`/${monthStr}`) && o.status === 'Lunas');
  const totalMonth = monthOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const handleShareRekap = async () => {
    const text = `*REKAP L CARWASH - ${displayMonthName}*\n\nTotal Pendapatan: ${formatRp(totalMonth)}\nUnit Selesai: ${monthOrders.length} Kendaraan\n\n_Silakan cek file PDF/Excel untuk rincian lengkap._`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Rekap ${displayMonthName}`, text });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      showAlert('Teks rekap disalin ke clipboard!');
    }
  };

  const handleDownloadCSV = () => {
    if (monthOrders.length === 0) return showAlert("Tidak ada data transaksi bulan ini.");

    let csvContent = "Tanggal,Jam,ID Transaksi,Nama Pelanggan,Plat Nomor,Alamat,Layanan,Total Tagihan\n";
    monthOrders.forEach(o => {
      const date = o.date || '';
      const time = o.time || '';
      const id = o.id || '';
      const name = `"${(o.customerName || '').replace(/"/g, '""')}"`;
      const plate = o.plate || '';
      const address = `"${(o.address || '').replace(/"/g, '""')}"`;
      const items = `"${(o.items || []).map(i => i.name).join(', ')}"`;
      const total = o.total || 0;
      csvContent += `${date},${time},${id},${name},${plate},${address},${items},${total}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_LCarwash_${monthStr.replace('/', '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FUNGSI BARU: GENERATE PDF LANGSUNG (TANPA PRINT WEB)
  const handleDownloadPDF = async () => {
    if (monthOrders.length === 0) return showAlert("Tidak ada data transaksi bulan ini untuk dijadikan PDF.");
    
    showAlert("Sedang mengunduh file PDF...");

    try {
      // Load library jsPDF secara dinamis
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      // Load library jsPDF-AutoTable untuk membuat tabel
      if (!window.jspdf.jsPDF.API.autoTable) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Desain Header PDF
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("L CARWASH & DETAILING", 14, 20);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Laporan Rekapitulasi Pendapatan", 14, 26);
      doc.text(`Periode: ${displayMonthName}`, 14, 32);

      // Menyiapkan Data Tabel
      const tableColumn = ["Tanggal", "ID Trx", "Pelanggan", "Plat Nomor", "Nominal"];
      const tableRows = [];

      monthOrders.forEach(order => {
        const orderData = [
          order.date || "-",
          order.id || "-",
          order.customerName || "-",
          order.plate || "-",
          formatRp(order.total)
        ];
        tableRows.push(orderData);
      });

      // Men-generate Tabel ke PDF
      doc.autoTable({
        startY: 40,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [36, 66, 154] }, // Warna biru khas L Carwash
        foot: [["", "", "", "TOTAL", formatRp(totalMonth)]],
        footStyles: { fillColor: [241, 245, 249], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 9 }
      });

      // Simpan & Download File PDF
      doc.save(`Rekap_Bulanan_${displayMonthName.replace(' ', '_')}.pdf`);
    } catch (error) {
      alert("Gagal membuat PDF. Pastikan HP Anda terhubung ke internet saat men-download laporan.");
    }
  };

  return (
    <div className="animate-fadeIn space-y-6 pb-10">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <Wallet className="absolute -right-6 -top-6 w-40 h-40 text-white/5 rotate-12" />
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total Semua Pendapatan</p>
          <h3 className="text-4xl font-black tracking-tighter truncate">{formatRp(totalAll)}</h3>
          <p className="text-xs text-blue-400 font-bold mt-4">Total dari {lunasAll.length} transaksi lunas</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><FileText size={20}/></div>
          <h3 className="font-black text-slate-800 text-lg">Cetak & Unduh Laporan</h3>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Pilih Bulan</label>
          <input 
            type="month" 
            value={filterMonth} 
            onChange={e => setFilterMonth(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
          />
        </div>

        <div className="bg-blue-50 rounded-3xl p-5 flex justify-between items-center border border-blue-100">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Omzet {displayMonthName}</p>
            <p className="text-xl font-black text-blue-700">{formatRp(totalMonth)}</p>
          </div>
          <div className="text-right border-l border-blue-200 pl-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Unit Selesai</p>
            <p className="text-xl font-black text-blue-700">{monthOrders.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={handleDownloadPDF} 
            className="bg-slate-800 hover:bg-slate-900 text-white font-black py-3 rounded-2xl shadow-xl shadow-slate-200 active:scale-95 transition-transform flex flex-col items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest"
          >
            <FileDown size={16}/> Unduh PDF
          </button>
          <button 
            onClick={handleShareRekap} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-transform flex flex-col items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest"
          >
            <Share2 size={16}/> Bagikan
          </button>
          <button 
            onClick={handleDownloadCSV} 
            className="bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-2xl shadow-xl shadow-green-200 active:scale-95 transition-transform flex flex-col items-center justify-center gap-1.5 text-[9px] uppercase tracking-widest"
          >
            <Download size={16}/> Excel/CSV
          </button>
        </div>
      </div>
    </div>
  );
}

// --- KOMPONEN MODAL NOTA (CETAK) ---
function NotaModal({ order, formatRp, onClose, showAlert }) {
  if (!order) return null;

  const handleShareNota = async () => {
    const text = `*L CARWASH & DETAILING*\nHome Service\n\nID: ${order.id}\nTanggal: ${order.date}\n------------------------\nPelanggan: ${order.customerName}\nPlat: ${order.plate}\nAlamat: ${order.address}\n------------------------\nLayanan:\n${order.items.map(it => `- ${it.name}: ${formatRp(it.calculatedPrice)}`).join('\n')}\n------------------------\n*TOTAL: ${formatRp(order.total)}*\n\nTerima kasih atas kepercayaannya!`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: `Nota ${order.id}`, text });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      showAlert('Nota disalin ke clipboard! Silakan paste di WhatsApp.');
    }
  };

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
             <span className="font-black text-slate-400 uppercase tracking-widest">{order.date || '-'}</span>
             <span className="font-black text-blue-600 tracking-widest">{order.id || '-'}</span>
          </div>
          
          <div>
            <p className="font-black text-2xl text-slate-800 tracking-tighter">{order.plate || '-'}</p>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mt-1">{order.customerName || '-'}</p>
            <p className="text-slate-500 font-medium text-[10px] mt-1.5 leading-relaxed">{order.address || '-'}</p>
          </div>

          <div className="py-5 border-y border-dashed border-slate-200 space-y-3">
            {(order.items || []).map((it, i) => (
              <div key={i} className="flex justify-between items-center text-slate-600 font-bold">
                <span>{it.name}</span>
                <span className="font-black text-slate-900">{formatRp(it.calculatedPrice)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-2xl font-black pt-2">
            <span className="text-slate-800 tracking-tighter">TOTAL</span>
            <span className="text-blue-600 truncate max-w-[60%] text-right">{formatRp(order.total)}</span>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 flex gap-2">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-white border border-slate-200 text-slate-400 text-[10px] active:bg-slate-100">Tutup</button>
          <button onClick={handleShareNota} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-green-500 text-white shadow-xl shadow-green-200 text-[10px] flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
            <Share2 size={16}/> Share
          </button>
          <button onClick={() => showAlert('Mencetak struk thermal...')} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-200 text-[10px] flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
            <Printer size={16}/> Cetak
          </button>
        </div>
      </div>
    </div>
  );
}
