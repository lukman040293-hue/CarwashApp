import React, { useState, useEffect } from 'react';
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
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  FileText,
  FileDown,
  Phone,
  Share2,
  Edit,
  Star,
  Map,
  Navigation,
  Flame,
  TrendingUp
} from 'lucide-react';

// --- PENGATURAN HEADER & LOGO ---
// Bos bisa mengganti logo, nama usaha, dan sub-teksnya di sini:
const APP_LOGO = 'https://images.unsplash.com/photo-1777407265534-248433dc692c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; 
const APP_NAME_LINE1 = 'Carwash & Detailing';       
const APP_NAME_LINE2 = '';     
const APP_SUBTITLE = 'Home Service';      

// --- DATA MASTER LAYANAN (Diperbarui dengan Foto Asli) ---
const SERVICES = [
  { id: 'w1', name: 'Basic Wash', category: 'Carwash', price: 150000, image: 'https://images.unsplash.com/photo-1777400924439-3e5ab46a9373?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Prewash, Handwash, Vacum Interior, Dressing Ban, Lap Mircofiber, Finishing' },
  { id: 'w2', name: 'Premium Wash', category: 'Carwash', price: { Kecil: 300000, Besar: 315000 }, image: 'https://images.unsplash.com/photo-1777398801194-b43d80625efd?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', recommended: true, desc: 'Include Detail Wash, Jamur Body + Noda Aspal (RINGAN), Window Cleaning, Emblem Logo, Sela Pintu Cleaning, Interior Detailing Level 1' },
  { id: 'w3', name: 'Detail Wash', category: 'Carwash', price: 200000, image: 'https://images.unsplash.com/photo-1777400924425-29aa6b51e01b?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Basic Wash, Dressing Interior, Door Jamb / Ketiak pintu' },
  { id: 'd1', name: 'Wash(Cuci) Engine', category: 'Engine', price: { Kecil: 125000, Besar: 145000 }, image: 'https://images.unsplash.com/photo-1777401359919-047b5f0cb0a9?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Pembersihan debu ruang mesin.' },
  { id: 'd2', name: 'Detailing Engine', category: 'Engine', price: 650000, image: 'https://images.unsplash.com/photo-1777401584789-0485762fe359?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Detailing menyeluruh ruang mesin & dressing.' },
  { id: 'a2', name: 'Pembersih noda aspal (Ringan)', category: 'Layanan Tambahan', price: 50000, image: 'https://images.unsplash.com/photo-1777401383326-97bd44e392f1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Pembersihan kerak noda aspal body bawah.' },
];

const getPrice = (item, size) => {
  if (!item || item.price === undefined) return 0;
  if (typeof item.price === 'number') return item.price;
  return item.price[size] || item.price['Kecil'] || 0;
};

// --- HELPER: DETEKSI SHARELOK WA / URL PETA ---
const getMapLink = (address) => {
  if (!address || address === '-') return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = address.match(urlRegex);
  if (match) {
    return match[0]; 
  }
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('kasir');
  const [activeNota, setActiveNota] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  
  // STATE PENYIMPANAN LOCAL (AMAN UNTUK VERCEL)
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

  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", "#ffffff"); 
    }
  }, []);

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
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}} />

      {/* HEADER SECTION */}
      {activeTab === 'kasir' && (
        <div className="shrink-0 z-10 w-full">
          <div className="bg-white rounded-b-[1.5rem] px-5 pt-5 pb-4 flex flex-col justify-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-b border-slate-200 text-slate-800 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-50 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-slate-100 rounded-full blur-xl"></div>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3.5">
                <img 
                  src={APP_LOGO} 
                  alt="Logo Aplikasi" 
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover drop-shadow-sm shrink-0 rounded-xl"
                />
                <div className="flex flex-col justify-center">
                  <h1 className="text-sm sm:text-base font-black tracking-[0.1em] text-slate-800 uppercase leading-tight">
                    {APP_NAME_LINE1}
                    {APP_NAME_LINE2 && <><br/>{APP_NAME_LINE2}</>}
                  </h1>
                  <p className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-indigo-500 mt-1 uppercase">{APP_SUBTITLE}</p>
                </div>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center gap-1.5">
                <User size={18} className="text-slate-600"/>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT AREA */}
      <div className={`flex-1 overflow-y-auto hide-scrollbar ${activeTab === 'peta' ? 'px-0 pt-0 pb-32' : 'px-4 sm:px-5'} ${activeTab === 'kasir' ? 'pb-[260px]' : (activeTab !== 'peta' ? 'pb-32' : '')} ${activeTab !== 'kasir' && activeTab !== 'peta' ? 'pt-8' : 'pt-5'} w-full relative`}>
        {activeTab === 'kasir' && <KasirView services={SERVICES} customServices={customServices} setCustomServices={setCustomServices} setOrders={setOrders} formatRp={formatRp} setActiveTab={setActiveTab} setActiveNota={setActiveNota} showAlert={showAlert} isKeyboardOpen={isKeyboardOpen} editingOrder={editingOrder} setEditingOrder={setEditingOrder} />}
        {activeTab === 'peta' && <PetaView orders={orders} formatRp={formatRp} setActiveNota={setActiveNota} />}
        {activeTab === 'kalender' && <KalenderView orders={orders} formatRp={formatRp} setActiveNota={setActiveNota} />}
        {activeTab === 'riwayat' && <RiwayatView orders={orders} setOrders={setOrders} formatRp={formatRp} setActiveNota={setActiveNota} showAlert={showAlert} showConfirm={showConfirm} setEditingOrder={setEditingOrder} setActiveTab={setActiveTab} />}
        {activeTab === 'laporan' && <LaporanView orders={orders} formatRp={formatRp} showAlert={showAlert} />}
      </div>

      {/* STRUKTUR DOCK MENYATU */}
      <div className={`fixed bottom-0 left-0 right-0 w-full z-[60] px-3 pb-6 transition-transform duration-300 ease-in-out pointer-events-none ${isKeyboardOpen ? 'translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}`}>
        
        {activeTab === 'kasir' && (
          <div className="mx-auto max-w-lg bg-white pt-4 px-4 sm:px-5 pb-[4.5rem] -mb-[3.5rem] rounded-t-[2rem] rounded-b-[2rem] shadow-[0_-4px_15px_rgba(0,0,0,0.05)] border border-slate-200 flex justify-between items-center pointer-events-auto relative">
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Tagihan</p>
              <p className="text-2xl font-black text-indigo-600 leading-none tracking-tight truncate">
                <KasirTotalCalculator formatRp={formatRp} />
              </p>
            </div>
            <button 
              onClick={() => document.getElementById('btn-simpan-kasir')?.click()} 
              className="shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white font-black px-6 sm:px-8 py-4 rounded-2xl shadow-md shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {editingOrder ? 'Perbarui' : 'Simpan'} <CheckCircle size={20}/>
            </button>
          </div>
        )}

        {/* NAVIGASI BAWAH */}
        <div className="mx-auto max-w-lg bg-indigo-500 flex justify-between items-center px-1.5 py-2 rounded-[2rem] shadow-md shadow-indigo-900/20 pointer-events-auto relative z-[61]">
          <NavItem icon={<ClipboardList />} label="Kasir" isActive={activeTab === 'kasir'} onClick={() => setActiveTab('kasir')} />
          <NavItem icon={<Map />} label="Peta" isActive={activeTab === 'peta'} onClick={() => setActiveTab('peta')} />
          <NavItem icon={<CalendarDays />} label="Jadwal" isActive={activeTab === 'kalender'} onClick={() => setActiveTab('kalender')} />
          <NavItem icon={<History />} label="Riwayat" isActive={activeTab === 'riwayat'} onClick={() => setActiveTab('riwayat')} />
          <NavItem icon={<BarChart />} label="Laporan" isActive={activeTab === 'laporan'} onClick={() => setActiveTab('laporan')} />
        </div>

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
              <button onClick={() => { if (dialog.onConfirm) dialog.onConfirm(); setDialog(null); }} className="flex-1 py-4 rounded-2xl bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-200 active:scale-95 transition-transform">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KasirTotalCalculator({ formatRp }) {
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedData = localStorage.getItem('l_carwash_temp_total');
        if (savedData) setTotal(JSON.parse(savedData));
        else setTotal(0);
      } catch(e) {}
    };
    
    window.addEventListener('updateTotalKasir', handleStorageChange);
    handleStorageChange();
    
    return () => window.removeEventListener('updateTotalKasir', handleStorageChange);
  }, []);

  return <>{formatRp(total)}</>;
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-white text-indigo-500 px-3.5 sm:px-5 py-3 rounded-2xl font-black shadow-lg scale-105' : 'text-white/70 p-2.5 hover:text-white active:scale-95'}`}>
      {React.cloneElement(icon, { size: 20, strokeWidth: isActive ? 2.5 : 2 })}
      {isActive && <span className="ml-1.5 text-[10px] sm:text-xs tracking-tight">{label}</span>}
    </button>
  );
}

// --- VIEW: PETA ---
function PetaView({ orders, formatRp, setActiveNota }) {
  const pendingOrders = orders.filter(o => o.status !== 'Lunas');
  const [selectedAddress, setSelectedAddress] = useState(
    pendingOrders.length > 0 && pendingOrders[0].address && pendingOrders[0].address !== '-' 
      ? pendingOrders[0].address 
      : 'Indonesia'
  );

  const hasUrlMatch = selectedAddress ? selectedAddress.match(/(https?:\/\/[^\s]+)/g) : null;
  const isUrl = !!hasUrlMatch;
  const mapUrl = isUrl ? hasUrlMatch[0] : `https://maps.google.com/?q=${encodeURIComponent(selectedAddress)}`;

  return (
    <div className="animate-fadeIn h-full flex flex-col relative w-full">
      <div className="w-full h-[45vh] bg-slate-200 shrink-0 relative z-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] rounded-b-[2rem] overflow-hidden">
        {isUrl ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-8 text-center border-b border-slate-200">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Map size={32} />
            </div>
            <p className="text-base font-black text-slate-800 mb-1">Tautan Lokasi Terdeteksi</p>
            <p className="text-[10px] text-slate-500 mb-6 leading-relaxed max-w-[200px]">Pratinjau peta tidak dapat memuat Sharelok. Silakan buka langsung di aplikasi.</p>
            <button 
              onClick={() => window.open(mapUrl, '_blank')}
              className="bg-indigo-500 text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-xl shadow-xl shadow-indigo-200 active:scale-95 transition-transform"
            >
              Buka Google Maps
            </button>
          </div>
        ) : (
          <iframe 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            loading="lazy" 
            allowFullScreen 
            title="Peta Lokasi"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          ></iframe>
        )}
        
        {!isUrl && (
          <button 
            onClick={() => window.open(mapUrl, '_blank')}
            className="absolute bottom-5 right-5 bg-white text-indigo-500 font-black text-[10px] uppercase tracking-widest px-4 py-3 rounded-xl shadow-lg border border-slate-100 flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <Navigation size={14} /> Navigasi Rute
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-32 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            Lokasi Panggilan (Belum Lunas)
          </h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{pendingOrders.length} Titik</span>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
            <Map className="mx-auto text-slate-300 mb-3" size={40}/>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Semua Kunjungan Selesai</p>
          </div>
        ) : (
          pendingOrders.map(o => {
            const isActive = selectedAddress === o.address;
            const itemHasUrl = o.address && o.address.match(/(https?:\/\/[^\s]+)/g);
            return (
              <div 
                key={o.id} 
                onClick={() => {
                  if (o.address && o.address !== '-') setSelectedAddress(o.address);
                }}
                className={`p-5 rounded-[1.5rem] border-2 transition-all flex flex-col relative cursor-pointer active:scale-[0.98] ${isActive ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="pr-2">
                    <h4 className="font-black text-slate-800 text-base tracking-tight">{o.customerName || '-'}</h4>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{o.plate || '-'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-black text-indigo-600 mb-0.5">{(o.date || '').substring(0, 5)}</p>
                    <p className="text-sm font-black text-slate-700">{o.time || '-'}</p>
                  </div>
                </div>

                <p className="text-[10px] font-medium text-slate-500 flex items-start gap-1 leading-snug mt-1">
                  <MapPin size={12} className={`shrink-0 mt-0.5 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}/> 
                  <span className="line-clamp-2">
                    {itemHasUrl ? '🔗 Tautan Sharelok Terlampir' : (o.address || '-')}
                  </span>
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// --- VIEW: KASIR ---
function KasirView({ services, customServices, setCustomServices, setOrders, formatRp, setActiveTab, setActiveNota, showAlert, isKeyboardOpen, editingOrder, setEditingOrder }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
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
  const [showMap, setShowMap] = useState(false);

  const addressUrlMatch = address.match(/(https?:\/\/[^\s]+)/g);
  const hasUrlInAddress = !!addressUrlMatch;

  useEffect(() => {
    if (editingOrder) {
      setCustomerName(editingOrder.customerName === 'Pelanggan Umum' ? '' : editingOrder.customerName);
      setCustomerPhone(editingOrder.customerPhone === '-' ? '' : editingOrder.customerPhone);
      setAddress(editingOrder.address === '-' ? '' : editingOrder.address);
      setPlate(editingOrder.plate);
      setCarType(editingOrder.carType === '-' ? '' : editingOrder.carType);
      setCarSize(editingOrder.carSize === '-' ? 'Kecil' : editingOrder.carSize);
      setSelectedItems(editingOrder.items || []);
      
      if (editingOrder.date && editingOrder.date.includes('/')) {
        const [d, m, y] = editingOrder.date.split('/');
        setOrderDate(`${y}-${m}-${d}`);
      }
      setOrderTime(editingOrder.time || new Date().toTimeString().slice(0, 5));
    } else {
      setCustomerName('');
      setCustomerPhone('');
      setAddress('');
      setPlate('');
      setCarType('');
      setCarSize('Kecil');
      setSelectedItems([]);
      setOrderDate(new Date().toISOString().split('T')[0]);
      setOrderTime(new Date().toTimeString().slice(0, 5));
    }
  }, [editingOrder]);

  const allServices = [...services, ...customServices];
  const groupedServices = allServices.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  const toggleItem = (service) => {
    let newSelected;
    const exists = selectedItems.find(item => item.id === service.id);
    if (exists) newSelected = selectedItems.filter(item => item.id !== service.id);
    else newSelected = [...selectedItems, service];
    
    setSelectedItems(newSelected);
  };

  const currentTotal = selectedItems.reduce((sum, item) => sum + getPrice(item, carSize), 0);

  useEffect(() => {
    localStorage.setItem('l_carwash_temp_total', JSON.stringify(currentTotal));
    window.dispatchEvent(new Event('updateTotalKasir'));
  }, [currentTotal]);

  useEffect(() => {
    return () => {
      localStorage.setItem('l_carwash_temp_total', '0');
      window.dispatchEvent(new Event('updateTotalKasir'));
    };
  }, []);

  const handleSimpan = () => {
    if (selectedItems.length === 0) return showAlert('Pilih minimal 1 layanan!');
    if (!plate) return showAlert('Plat nomor wajib diisi!');
    if (!address) return showAlert('Alamat wajib diisi untuk Home Service!');
    
    const itemsWithPrice = selectedItems.map(item => ({ ...item, calculatedPrice: getPrice(item, carSize) }));
    
    const newOrder = {
      id: editingOrder ? editingOrder.id : `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: orderDate.split('-').reverse().join('/'),
      time: orderTime,
      customerName: customerName || 'Pelanggan Umum',
      customerPhone: customerPhone || '-',
      address: address || '-', 
      plate: plate.toUpperCase(),
      carType: carType || '-',
      carSize: selectedItems.some(i => typeof i.price === 'object') ? carSize : '-', 
      items: itemsWithPrice,
      total: currentTotal,
      status: editingOrder ? editingOrder.status : 'Belum Lunas'
    };

    if (editingOrder) {
      setOrders(prev => prev.map(o => o.id === editingOrder.id ? newOrder : o));
      setEditingOrder(null); 
    } else {
      setOrders(prev => [newOrder, ...prev]);
    }
    
    setActiveTab('riwayat');
    setActiveNota(newOrder);
  };

  return (
    <div className="animate-fadeIn space-y-6 relative">
      
      {editingOrder && (
        <div className="bg-indigo-100 text-indigo-800 p-5 rounded-[2rem] flex justify-between items-center border border-indigo-200 shadow-sm mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-0.5">Mode Edit Transaksi</p>
            <p className="font-bold text-sm leading-none">{editingOrder.id}</p>
          </div>
          <button onClick={() => setEditingOrder(null)} className="bg-white text-indigo-600 px-4 py-2.5 rounded-xl text-xs font-black shadow-sm active:scale-95 transition-transform">
            Batal Edit
          </button>
        </div>
      )}

      <div>
        <h2 className="font-black text-lg text-slate-800 flex items-center gap-2.5 mb-4 pl-1">
          <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600"><Car size={20}/></div>
          Pelanggan & Kendaraan
        </h2>
        
        <div className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pl-1"><Calendar size={12}/> Tanggal</label>
            <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-base font-bold outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700"/>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 pl-1"><Clock size={12}/> Jam</label>
            <input type="time" value={orderTime} onChange={e => setOrderTime(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-base font-bold outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700"/>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5"><User size={12}/> Nama Pemilik</label>
            <input type="text" placeholder="Masukkan nama pelanggan..." value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-base font-bold outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"/>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5"><Phone size={12}/> No. WhatsApp</label>
            <input type="tel" placeholder="Contoh: 08123456789" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-base font-bold outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"/>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center pl-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12}/> Alamat / Sharelok</label>
              {address && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasUrlInAddress) {
                      window.open(addressUrlMatch[0], '_blank');
                    } else {
                      setShowMap(!showMap);
                    }
                  }} 
                  className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded flex items-center gap-1 active:scale-95"
                >
                  {hasUrlInAddress ? <><Navigation size={10} /> Buka Link Map</> : <><Map size={10} /> {showMap ? 'Tutup Peta' : 'Cek Peta'}</>}
                </button>
              )}
            </div>
            <textarea placeholder="Ketik alamat atau paste Link Sharelok WA di sini..." value={address} onChange={e => setAddress(e.target.value)} rows="3" className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-base font-bold outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium resize-none"></textarea>
            
            {showMap && address && !hasUrlInAddress && (
              <div className="w-full h-[200px] rounded-[1.25rem] overflow-hidden border border-slate-200 mt-2 bg-slate-100 relative">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy" 
                  allowFullScreen 
                  title="Peta Lokasi"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tipe Mobil</label>
            <input type="text" placeholder="Contoh: Pajero Sport, Avanza" value={carType} onChange={e => setCarType(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-base font-bold outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"/>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Plat Nomor</label>
            <input type="text" placeholder="B 1234 XYZ" value={plate} onChange={e => setPlate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] p-4 text-base font-black uppercase outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-300 placeholder:font-medium"/>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-4">
        {Object.keys(groupedServices).map(cat => (
          <div key={cat} className="space-y-4">
            <h3 className="font-black text-xs text-slate-400 uppercase tracking-[0.2em] ml-2">{cat}</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {groupedServices[cat].map(item => {
                const isSelected = selectedItems.find(i => i.id === item.id);
                const itemImage = item.image || 'https://images.unsplash.com/photo-1550524514-411a7f0525ee?w=800&auto=format&fit=crop&q=60'; 
                
                return (
                  <div 
                    key={item.id} 
                    onClick={() => toggleItem(item)} 
                    className={`rounded-[1.5rem] border-2 transition-all flex flex-col relative cursor-pointer active:scale-[0.98] overflow-hidden ${isSelected ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'}`}
                  >
                    
                    {isSelected && <div className="absolute top-4 right-4 bg-indigo-500 text-white rounded-full p-1.5 shadow-sm z-20"><CheckCircle size={22}/></div>}
                    
                    <div className="flex flex-row items-stretch min-h-[140px]">
                      
                      <div className="w-[130px] sm:w-[150px] shrink-0 relative bg-slate-100 border-r border-slate-100">
                        <img src={itemImage} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0 p-4 sm:p-5 pr-14 flex flex-col justify-center">

                        {item.recommended && (
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div className="flex text-yellow-400">
                              <Star size={12} fill="currentColor" strokeWidth={0} />
                              <Star size={12} fill="currentColor" strokeWidth={0} />
                              <Star size={12} fill="currentColor" strokeWidth={0} />
                              <Star size={12} fill="currentColor" strokeWidth={0} />
                              <Star size={12} fill="currentColor" strokeWidth={0} />
                            </div>
                            <span className="text-[9px] font-black text-yellow-600 uppercase tracking-widest bg-yellow-100 px-2 py-0.5 rounded-md">
                              Rekomendasi
                            </span>
                          </div>
                        )}

                        <p className="text-base sm:text-lg font-black leading-tight mb-1.5 text-slate-800">{item.name}</p>
                        
                        {item.desc && <p className="text-xs font-medium text-slate-500 mb-3 leading-snug line-clamp-2">{item.desc}</p>}
                        
                        {typeof item.price === 'object' ? (
                          <div className="text-xs font-bold text-slate-600 mt-auto flex flex-col gap-1">
                            <div className="flex items-center justify-between bg-white border border-slate-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                               <span>Kecil:</span> 
                               <span className="text-indigo-500 font-black text-sm">{formatRp(item.price.Kecil)}</span>
                            </div>
                            <div className="flex items-center justify-between bg-white border border-slate-100 px-2.5 py-1.5 rounded-lg shadow-sm">
                               <span>Besar:</span> 
                               <span className="text-indigo-500 font-black text-sm">{formatRp(item.price.Besar)}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-base font-black text-indigo-500 mt-auto">{formatRp(item.price)}</p>
                        )}
                      </div>
                    </div>

                    {isSelected && typeof item.price === 'object' && (
                      <div className="p-4 sm:p-5 pt-4 border-t border-indigo-200 bg-indigo-50/50">
                        <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3 pl-1">Pilih Ukuran:</p>
                        <select 
                          value={carSize} 
                          onChange={e => {
                            e.stopPropagation(); 
                            setCarSize(e.target.value);
                            setTimeout(() => {
                              window.dispatchEvent(new Event('updateTotalKasir'));
                            }, 50);
                          }} 
                          onClick={e => e.stopPropagation()}
                          className="w-full text-base p-4 border border-indigo-300 rounded-xl bg-white text-indigo-800 font-black outline-none appearance-none cursor-pointer shadow-sm"
                        >
                          <option value="Kecil">Mobil Kecil - {formatRp(item.price.Kecil)}</option>
                          <option value="Besar">Mobil Besar - {formatRp(item.price.Besar)}</option>
                        </select>
                      </div>
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
          <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-200 space-y-4 shadow-inner">
             <div className="flex justify-between items-center px-1">
                <span className="text-base font-black text-indigo-800">Layanan Baru</span>
                <button onClick={() => setShowCustomForm(false)} className="bg-indigo-100 p-2 rounded-full text-indigo-500"><X size={20}/></button>
             </div>
             <input type="text" placeholder="Nama Layanan (Misa: Poles Kaca)" value={customName} onChange={e => setCustomName(e.target.value)} className="w-full p-4 rounded-2xl text-base font-bold bg-white border border-indigo-100 outline-none focus:ring-2 focus:ring-indigo-400"/>
             <input type="number" placeholder="Harga (Rp)" value={customPrice} onChange={e => setCustomPrice(e.target.value)} className="w-full p-4 rounded-2xl text-base font-bold bg-white border border-indigo-100 outline-none focus:ring-2 focus:ring-indigo-400"/>
             <button onClick={() => {
                if(!customName || !customPrice) return;
                const ns = { id: Date.now(), name: customName, price: parseInt(customPrice), category: 'Layanan Custom' };
                
                setCustomServices([...customServices, ns]);
                setSelectedItems([...selectedItems, ns]);
                setCustomName(''); setCustomPrice(''); setShowCustomForm(false);
             }} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl text-sm shadow-xl shadow-indigo-200/50 active:scale-95 transition-transform mt-2">Simpan ke Daftar</button>
          </div>
        )}
      </div>

      <button id="btn-simpan-kasir" onClick={handleSimpan} className="hidden"></button>
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
              <div key={day} onClick={() => handleDateClick(day)} className={`aspect-square flex flex-col items-center justify-center rounded-full cursor-pointer transition-all ${isSel ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 scale-110' : 'text-slate-600 hover:bg-slate-50'}`}>
                <span className="text-sm font-bold leading-none">{day}</span>
                {hasOrder && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSel ? 'bg-white' : 'bg-indigo-500'}`}></div>}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            {selectedDate ? `Jadwal: ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}` : `Semua Jadwal Bulan Ini`}
          </h3>
          {selectedDate && (
            <button onClick={() => setSelectedDate(null)} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
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
          ) : displayOrders.map(o => {
            const hasUrlInAddress = o.address && o.address.match(/(https?:\/\/[^\s]+)/g);
            return (
              <div key={o.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 flex gap-4 items-center shadow-sm relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${o.status === 'Lunas' ? 'bg-green-500' : 'bg-orange-500'}`}/>
                
                <div className="text-center border-r pr-4 sm:pr-5 border-slate-100 min-w-[90px] flex flex-col justify-center pl-2">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-1.5">{(o.date || '').substring(0, 5)}</p>
                  <p className="text-xs font-bold text-indigo-500">{o.time || '-'}</p>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-lg truncate mb-0.5">{o.plate || '-'}</p>
                  <p className="text-xs font-medium text-slate-500 truncate">{o.customerName || '-'} • {o.customerPhone || '-'}</p>
                  
                  <p 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if(o.address && o.address !== '-') {
                        window.open(getMapLink(o.address), '_blank');
                      } 
                    }}
                    className="text-xs font-medium text-slate-400 mt-2 flex items-start gap-1.5 leading-snug cursor-pointer hover:text-indigo-500 transition-colors"
                  >
                    <MapPin size={14} className="shrink-0 mt-0.5"/> 
                    <span className="line-clamp-2 underline decoration-dashed underline-offset-4 decoration-slate-300">
                      {hasUrlInAddress ? 'Tautan Sharelok Terlampir' : (o.address || '-')}
                    </span>
                  </p>
                </div>
                <button onClick={() => setActiveNota(o)} className="p-3 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-colors"><Printer size={20}/></button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- VIEW: RIWAYAT PESANAN ---
function RiwayatView({ orders, setOrders, formatRp, setActiveNota, showConfirm, setEditingOrder, setActiveTab }) {
  const [search, setSearch] = useState('');
  
  const filtered = orders.filter(o => {
    const s = search.toLowerCase();
    const plate = o.plate || '';
    const id = o.id || '';
    const address = o.address || '';
    const phone = o.customerPhone || '';
    return plate.toLowerCase().includes(s) || id.toLowerCase().includes(s) || address.toLowerCase().includes(s) || phone.toLowerCase().includes(s);
  });

  return (
    <div className="animate-fadeIn space-y-5">
      <div className="bg-white p-1 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center px-5">
        <Search size={20} className="text-slate-300"/>
        <input type="text" placeholder="Cari Plat, No. WA, ID..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 p-4 text-base font-bold outline-none bg-transparent placeholder:font-medium"/>
      </div>
      
      <div className="space-y-5 pb-10">
        {filtered.length === 0 ? <p className="text-center py-20 text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Data Tidak Ditemukan</p> : 
          filtered.map(order => {
            const hasUrlInAddress = order.address && order.address.match(/(https?:\/\/[^\s]+)/g);
            return (
              <div key={order.id} className="bg-white rounded-[2rem] p-5 sm:p-6 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col gap-4">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${order.status === 'Lunas' ? 'bg-green-500' : 'bg-orange-500'}`}/>
                
                <div className="flex justify-between items-start pl-2">
                  <div className="pr-3">
                    <h4 className="font-black text-slate-800 text-xl sm:text-2xl tracking-tight mb-1">{order.plate || '-'}</h4>
                    <p className="text-xs font-medium text-slate-500">{order.customerName || '-'} • {order.customerPhone || '-'}</p>
                  </div>
                  <span className={`text-[10px] px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider shrink-0 ${order.status === 'Lunas' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="pl-2">
                  <p 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if(order.address && order.address !== '-') {
                        window.open(getMapLink(order.address), '_blank');
                      } 
                    }}
                    className="text-xs font-medium text-slate-500 flex items-start gap-1.5 cursor-pointer hover:text-indigo-500 transition-colors"
                  >
                    <MapPin size={14} className="shrink-0 mt-0.5 text-slate-400"/> 
                    <span className="line-clamp-2 underline decoration-dashed underline-offset-4 decoration-slate-300">
                      {hasUrlInAddress ? 'Tautan Sharelok' : (order.address || '-')}
                    </span>
                  </p>
                </div>
                
                <div className="pl-2 pr-2">
                  <div className="bg-slate-50/80 rounded-2xl p-4 text-xs font-medium text-slate-600 border border-slate-100/50">
                    <ul className="space-y-2.5">
                      {(order.items || []).map((it, i) => (
                        <li key={i} className="flex justify-between items-center gap-3">
                          <span className="truncate text-slate-500">• {it.name}</span> 
                          <span className="font-bold text-slate-700 whitespace-nowrap">{formatRp(it.calculatedPrice)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between items-end pl-2 pt-2 border-t border-slate-50 mt-1 gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Tagihan</p>
                    <p className="font-black text-slate-800 text-lg sm:text-xl truncate">{formatRp(order.total)}</p>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setEditingOrder(order); setActiveTab('kasir'); }} className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors shadow-sm"><Edit size={18}/></button>
                    <button onClick={() => setActiveNota(order)} className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-colors shadow-sm"><Printer size={18}/></button>
                    {order.status !== 'Lunas' && (
                      <button onClick={() => showConfirm(`Konfirmasi Lunas untuk ${formatRp(order.total)}?`, () => setOrders(prev => prev.map(o => o.id === order.id ? {...o, status: 'Lunas'} : o)))} className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-green-200 active:scale-95 transition-transform">LUNAS</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

// --- VIEW: LAPORAN (DASHBOARD) ---
function LaporanView({ orders, formatRp, showAlert }) {
  const [filterMonth, setFilterMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  const [year, month] = filterMonth.split('-');
  const monthStr = month ? `${month}/${year}` : ''; 
  const displayMonthName = month ? `${monthNames[parseInt(month)-1]} ${year}` : '';

  const monthOrders = orders.filter(o => o.date && o.date.endsWith(`/${monthStr}`));
  
  const monthCompleted = monthOrders.filter(o => o.status === 'Lunas');
  const monthPending = monthOrders.filter(o => o.status !== 'Lunas');
  const totalMonthRevenue = monthCompleted.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const serviceCounts = {};
  monthOrders.forEach(o => {
    (o.items || []).forEach(item => {
      serviceCounts[item.name] = (serviceCounts[item.name] || 0) + 1;
    });
  });
  
  const popularServices = Object.entries(serviceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); 

  const handleDownloadPDF = async () => {
    if (monthCompleted.length === 0) return showAlert("Tidak ada data transaksi lunas bulan ini untuk dijadikan PDF.");
    
    showAlert("Sedang mengunduh file PDF...");

    try {
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
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

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("L CARWASH & DETAILING", 14, 20);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Laporan Rekapitulasi Pendapatan", 14, 26);
      doc.text(`Periode: ${displayMonthName}`, 14, 32);

      const tableColumn = ["Tanggal", "ID Trx", "Pelanggan", "Plat Nomor", "Nominal"];
      const tableRows = [];

      monthCompleted.forEach(order => {
        const orderData = [
          order.date || "-",
          order.id || "-",
          order.customerName || "-",
          order.plate || "-",
          formatRp(order.total)
        ];
        tableRows.push(orderData);
      });

      doc.autoTable({
        startY: 40,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] }, 
        foot: [["", "", "", "TOTAL PENDAPATAN", formatRp(totalMonthRevenue)]],
        footStyles: { fillColor: [241, 245, 249], textColor: [0, 0, 0], fontStyle: 'bold' },
        styles: { fontSize: 9 }
      });

      doc.save(`Rekap_Bulanan_${displayMonthName.replace(' ', '_')}.pdf`);
    } catch (error) {
      alert("Gagal membuat PDF. Pastikan HP Anda terhubung ke internet saat men-download laporan.");
    }
  };

  return (
    <div className="animate-fadeIn space-y-6 pb-10">
      
      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center gap-4">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dashboard Periode</p>
          <p className="font-bold text-slate-800 text-sm">{displayMonthName}</p>
        </div>
        <input 
          type="month" 
          value={filterMonth} 
          onChange={e => setFilterMonth(e.target.value)} 
          className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
        />
      </div>

      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <Wallet className="absolute -right-6 -top-6 w-40 h-40 text-white/5 rotate-12" />
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total Pendapatan</p>
          <h3 className="text-4xl font-black tracking-tighter truncate text-indigo-400">{formatRp(totalMonthRevenue)}</h3>
          <p className="text-xs text-slate-300 font-medium mt-2 flex items-center gap-1">
            <CheckCircle size={14} className="text-green-400"/> Dari {monthCompleted.length} transaksi selesai
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-indigo-200 rounded-full text-indigo-600"><Clock size={16} /></div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Antrian</p>
          </div>
          <p className="text-4xl font-black text-indigo-600">{monthPending.length}</p>
          <p className="text-[10px] font-bold text-indigo-400 mt-1 uppercase tracking-wider">Unit Diproses</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-green-200 rounded-full text-green-600"><CheckCircle size={16} /></div>
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Selesai</p>
          </div>
          <p className="text-4xl font-black text-green-600">{monthCompleted.length}</p>
          <p className="text-[10px] font-bold text-green-500 mt-1 uppercase tracking-wider">Unit Selesai</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><TrendingUp size={20}/></div>
          <div>
            <h3 className="font-black text-slate-800 text-base leading-none mb-1">Layanan Terpopuler</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Paling banyak dipilih</p>
          </div>
        </div>

        {popularServices.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6 font-medium">Belum ada layanan yang dipesan bulan ini.</p>
        ) : (
          <div className="space-y-4 pt-2">
            {popularServices.map((srv, idx) => {
              const maxCount = popularServices[0].count;
              const percentage = Math.round((srv.count / maxCount) * 100);
              
              return (
                <div key={idx} className="relative">
                  <div className="flex justify-between items-end text-xs font-bold mb-1.5">
                    <span className="text-slate-700 truncate pr-4">{srv.name}</span>
                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded shadow-sm">{srv.count} unit</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-400 to-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-3">
        <div>
          <p className="font-black text-slate-800 text-sm">Unduh Rekap Bulanan</p>
          <p className="text-[10px] text-slate-400 font-medium">Cetak laporan pemasukan untuk diarsipkan.</p>
        </div>
        <button 
          onClick={handleDownloadPDF} 
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 active:scale-95 transition-transform flex flex-row items-center justify-center gap-2 text-xs uppercase tracking-widest"
        >
          <FileDown size={18}/> Cetak Laporan PDF
        </button>
      </div>

    </div>
  );
}

// --- KOMPONEN MODAL NOTA (CETAK) ---
function NotaModal({ order, formatRp, onClose, showAlert }) {
  const [capturedImage, setCapturedImage] = useState(null);
  const [textWaData, setTextWaData] = useState('');

  if (!order) return null;

  const handleShareProcess = async () => {
    showAlert('Sedang memproses nota...');

    const textWa = `*${APP_NAME_LINE1.toUpperCase()} ${APP_NAME_LINE2.toUpperCase()}*\n${APP_SUBTITLE}\n\nID: ${order.id}\nTanggal: ${order.date}\n------------------------\nPelanggan: ${order.customerName}\nWA: ${order.customerPhone || '-'}\nPlat: ${order.plate}\nAlamat: ${order.address || '-'}\n------------------------\nLayanan:\n${(order.items || []).map(it => `- ${it.name}: ${formatRp(it.calculatedPrice)}`).join('\n')}\n------------------------\n*TOTAL: ${formatRp(order.total)}*\n\nTerima kasih atas kepercayaannya!`;
    setTextWaData(textWa);

    try {
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const notaElement = document.getElementById('nota-capture-area');
      const canvas = await window.html2canvas(notaElement, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      setCapturedImage(canvas.toDataURL('image/jpeg', 0.9));

    } catch (error) {
      showAlert('Gagal memproses nota.');
    }
  };

  const handleDownloadImage = () => {
    showAlert('TIPS MENYIMPAN: Tekan dan Tahan (Long Press) pada gambar nota dengan agak kuat, lalu pilih menu "Simpan Gambar" / "Download Image" dari HP Anda.');
  };

  const handleSendWA = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(textWaData)}`;
    window.location.href = waUrl; 
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center p-5 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden flex flex-col shadow-2xl">
        
        {capturedImage ? (
          <div className="flex flex-col h-full max-h-[85vh]">
            <div className="p-4 bg-slate-800 border-b border-slate-700 text-center shrink-0 shadow-md z-10 relative">
              <p className="text-white font-black text-xs mb-1 uppercase tracking-widest">Nota Siap Disimpan!</p>
              <p className="text-slate-300 text-[10px] leading-tight">Keamanan aplikasi memblokir unduhan otomatis.<br/>Silakan lakukan <b className="text-yellow-400">SCREENSHOT (Tangkapan Layar)</b> menggunakan HP Anda sekarang.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-slate-900 flex justify-center items-center hide-scrollbar">
              <img 
                src={capturedImage} 
                alt="Nota" 
                className="max-w-full h-auto rounded-xl shadow-2xl" 
              />
            </div>

            <div className="p-4 bg-white shrink-0 flex flex-col gap-3 border-t border-slate-100 relative z-10">
              <button onClick={handleSendWA} className="w-full py-4 rounded-2xl font-black uppercase tracking-wider bg-green-500 hover:bg-green-600 text-white text-[10px] active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-xl shadow-green-200">
                <Share2 size={16}/> Kirim Teks Nota ke WA
              </button>
              <button onClick={() => setCapturedImage(null)} className="w-full py-4 rounded-2xl font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 text-[10px] active:scale-95 transition-transform">
                Kembali
              </button>
            </div>
          </div>
        ) : (
          <>
            <div id="nota-capture-area" className="bg-white">
              <div className="bg-slate-50 p-8 text-center relative border-b border-dashed border-slate-200">
                <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 print:hidden"><X size={24}/></button>
                <div className="w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-200"><Receipt size={32}/></div>
                <h2 className="font-black text-slate-800 text-xl tracking-tighter">{APP_NAME_LINE1} {APP_NAME_LINE2.replace('&', '')}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{APP_SUBTITLE}</p>
              </div>
              
              <div className="p-8 text-xs space-y-6">
                <div className="flex justify-between border-b border-dashed border-slate-100 pb-4">
                   <span className="font-black text-slate-400 uppercase tracking-widest">{order.date || '-'}</span>
                   <span className="font-black text-indigo-500 tracking-widest">{order.id || '-'}</span>
                </div>
                
                <div>
                  <p className="font-black text-2xl text-slate-800 tracking-tighter">{order.plate || '-'}</p>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mt-1">{order.customerName || '-'} | {order.customerPhone || '-'}</p>
                  
                  <p 
                    onClick={() => { 
                      if(order.address && order.address !== '-') {
                        window.open(getMapLink(order.address), '_blank');
                      }
                    }}
                    className="text-slate-500 font-medium text-[10px] mt-1.5 leading-relaxed flex items-start gap-1 cursor-pointer hover:text-indigo-500"
                  >
                     <MapPin size={12} className="shrink-0" /> 
                     <span className="underline decoration-dashed underline-offset-2">
                       {order.address && order.address.match(/(https?:\/\/[^\s]+)/g) ? '🔗 Tautan Sharelok Terlampir' : (order.address || '-')}
                     </span>
                  </p>
                </div>

                <div className="py-5 border-y border-dashed border-slate-200 space-y-3">
                  {(order.items || []).map((it, i) => (
                    <div key={i} className="flex justify-between items-center text-slate-600 font-bold">
                      <span>{it.name}</span>
                      <span className="font-black text-slate-900">{formatRp(it.calculatedPrice)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-2xl font-black pt-2 pb-2">
                  <span className="text-slate-800 tracking-tighter">TOTAL</span>
                  <span className="text-indigo-500 truncate max-w-[60%] text-right">{formatRp(order.total)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 flex gap-2 border-t border-slate-100">
              <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-white border border-slate-200 text-slate-400 text-[10px] active:bg-slate-100">Tutup</button>
              <button onClick={handleShareProcess} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-green-500 text-white shadow-xl shadow-green-200 text-[10px] flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
                <Share2 size={16}/> Share
              </button>
              <button onClick={() => showAlert('Mencetak struk thermal...')} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest bg-indigo-500 text-white shadow-xl shadow-indigo-200 text-[10px] flex items-center justify-center gap-1.5 active:scale-95 transition-transform">
                <Printer size={16}/> Cetak
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
