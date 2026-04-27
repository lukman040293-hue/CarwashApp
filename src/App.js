import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  History, 
  BarChart3, 
  Car, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Search,
  Wallet,
  Calendar,
  Receipt,
  Printer,
  X,
  Clock,
  Star,
  Droplets,
  Sparkles,
  Wrench,
  Sun,
  Wind,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Pencil
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
  
  // State Layanan Custom
  const [customServices, setCustomServices] = useState(() => {
    const saved = localStorage.getItem('l_carwash_custom_services');
    if (saved) {
      try {
        return JSON.parse(saved).map(s => { const { icon, ...rest } = s; return rest; });
      } catch (e) { return []; }
    }
    return [];
  }); 
  
  // State Order
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('l_carwash_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
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
    /* PERUBAHAN UTAMA: w-screen h-[100dvh] tanpa max-w-md */
    <div className="bg-slate-50 text-slate-800 w-screen h-[100dvh] relative overflow-hidden flex flex-col font-sans m-0 p-0 border-none shadow-none">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;900&display=swap');
        body { font-family: 'Outfit', sans-serif; margin: 0; padding: 0; overflow: hidden; background-color: #f8fafc; }
        .icon-yellow-grad svg { stroke: url(#yellow-gradient) !important; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-in-out; }
        
        /* Menghilangkan efek tap di mobile browser */
        * { -webkit-tap-highlight-color: transparent; }
      `}} />

      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="yellow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>

      {/* Header Section - Full Width */}
      <div className="pt-4 px-4 pb-2 shrink-0 z-10 w-full">
        <div className="bg-[#24429A] rounded-[1.5rem] px-5 py-4 min-h-[100px] flex flex-col justify-center shadow-lg shadow-[#24429A]/20 text-white relative overflow-hidden border border-white/10">
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h1 className="text-sm font-bold tracking-[0.15em] text-white/90 uppercase">L Carwash & Detailing</h1>
              <p className="text-[10px] font-bold tracking-[0.2em] text-orange-400 mt-1 uppercase">Home Service</p>
            </div>
            <div className="bg-white/10 p-1 rounded-full border border-white/20 backdrop-blur-sm shadow-sm">
              <UserAvatar />
            </div>
          </div>
        </div>
      </div>

      {/* Content Area - Full Width with Internal Scroll */}
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-40 px-4 pt-2 w-full">
        {activeTab === 'kasir' && <KasirView services={SERVICES} customServices={customServices} setCustomServices={setCustomServices} setOrders={setOrders} formatRp={formatRp} setActiveTab={setActiveTab} setActiveNota={setActiveNota} showAlert={showAlert} />}
        {activeTab === 'kalender' && <KalenderView orders={orders} formatRp={formatRp} setActiveNota={setActiveNota} />}
        {activeTab === 'riwayat' && <RiwayatView orders={orders} setOrders={setOrders} services={SERVICES} customServices={customServices} setCustomServices={setCustomServices} formatRp={formatRp} setActiveNota={setActiveNota} showAlert={showAlert} showConfirm={showConfirm} />}
        {activeTab === 'laporan' && <LaporanView orders={orders} formatRp={formatRp} />}
      </div>

      {/* Navigasi Bawah - Floating but responsive width */}
      <div className="fixed bottom-6 left-4 right-4 bg-[#1e3a8a] flex justify-between items-center px-2 py-2 z-50 rounded-full shadow-[0_10px_30px_rgba(30,58,138,0.4)] border border-white/10">
        <NavItem icon={<ClipboardList />} label="Kasir" isActive={activeTab === 'kasir'} onClick={() => setActiveTab('kasir')} />
        <NavItem icon={<CalendarDays />} label="Jadwal" isActive={activeTab === 'kalender'} onClick={() => setActiveTab('kalender')} />
        <NavItem icon={<History />} label="Riwayat" isActive={activeTab === 'riwayat'} onClick={() => setActiveTab('riwayat')} />
        <NavItem icon={<BarChart3 />} label="Laporan" isActive={activeTab === 'laporan'} onClick={() => setActiveTab('laporan')} />
      </div>

      {activeNota && <NotaModal order={activeNota} formatRp={formatRp} onClose={() => setActiveNota(null)} showAlert={showAlert} />}

      {dialog && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
            <p className="text-slate-800 font-medium mb-6 text-sm">{dialog.message}</p>
            <div className="flex gap-3">
              {dialog.type === 'confirm' && (
                <button onClick={() => setDialog(null)} className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm">Batal</button>
              )}
              <button onClick={() => { if (dialog.onConfirm) dialog.onConfirm(); setDialog(null); }} className="flex-1 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-200">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS (Sama dengan sebelumnya namun dengan penyesuaian padding) ---

function KasirView({ services, customServices, setCustomServices, setOrders, formatRp, setActiveTab, setActiveNota, showAlert }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
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
    const itemsWithPrice = selectedItems.map(item => ({ ...item, calculatedPrice: getPrice(item, carSize) }));
    const total = itemsWithPrice.reduce((sum, item) => sum + item.calculatedPrice, 0);
    
    const newOrder = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: orderDate.split('-').reverse().join('/'),
      time: orderTime,
      customerName: customerName || 'Pelanggan Umum',
      customerPhone: customerPhone || '-',
      customerAddress: customerAddress || '-',
      plate: plate.toUpperCase() || '-',
      carType,
      carSize: selectedItems.some(i => typeof i.price === 'object') ? carSize : '-', 
      items: itemsWithPrice,
      total,
      status: 'Belum Lunas', 
      paymentMethod: '-'
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveTab('riwayat');
    setActiveNota(newOrder);
  };

  return (
    <div className="animate-fadeIn space-y-4">
      <h2 className="font-bold text-lg flex items-center gap-2 px-1"><Car className="text-blue-600" size={20}/> Input Kendaraan</h2>
      
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 space-y-3">
        <div className="grid grid-cols-2 gap-3 pb-2 border-b border-slate-50">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={10}/> Tanggal</label>
            <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={10}/> Jam</label>
            <input type="time" value={orderTime} onChange={e => setOrderTime(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Plat Nomor</label>
            <input type="text" placeholder="B 1234 XYZ" value={plate} onChange={e => setPlate(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-3 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Tipe Mobil</label>
            <input type="text" placeholder="Pajero Sport" value={carType} onChange={e => setCarType(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Nama Pemilik</label>
            <input type="text" placeholder="..." value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">WhatsApp</label>
            <input type="tel" placeholder="08..." value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {Object.keys(groupedServices).map(cat => (
          <div key={cat} className="space-y-2">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest ml-2">{cat}</h3>
            <div className="grid grid-cols-2 gap-3">
              {groupedServices[cat].map(item => {
                const isSelected = selectedItems.find(i => i.id === item.id);
                const priceLabel = getPrice(item, carSize);
                return (
                  <div key={item.id} onClick={() => toggleItem(item)} className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center relative ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md scale-[0.98]' : 'bg-white border-slate-100 shadow-sm'}`}>
                    {isSelected && <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-0.5 shadow-sm"><CheckCircle2 size={16}/></div>}
                    <div className="mb-3 icon-yellow-grad">{item.category === 'Layanan Custom' ? <Wrench size={30}/> : item.icon}</div>
                    <p className="text-[11px] font-bold leading-tight mb-1">{item.name}</p>
                    <p className="text-xs font-black text-blue-600">{formatRp(priceLabel)}</p>
                    {isSelected && typeof item.price === 'object' && (
                      <select value={carSize} onChange={e => {e.stopPropagation(); setCarSize(e.target.value)}} className="mt-3 w-full text-[10px] p-2 border-none rounded-xl bg-blue-100 text-blue-800 font-bold outline-none appearance-none text-center">
                        <option value="Kecil">Kecil</option>
                        <option value="Besar">Besar</option>
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {!showCustomForm ? (
          <button onClick={() => setShowCustomForm(true)} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 text-xs font-bold flex items-center justify-center gap-2 bg-white shadow-sm active:bg-slate-50">
            <Plus size={16}/> Tambah Layanan Custom
          </button>
        ) : (
          <div className="bg-blue-50 p-5 rounded-[2rem] border border-blue-200 space-y-3">
             <div className="flex justify-between items-center px-1"><span className="text-xs font-bold text-blue-800">Layanan Kustom</span><X size={18} onClick={() => setShowCustomForm(false)} className="text-blue-400 cursor-pointer"/></div>
             <input type="text" placeholder="Nama Layanan" value={customName} onChange={e => setCustomName(e.target.value)} className="w-full p-3.5 rounded-2xl text-xs outline-none bg-white border border-blue-100 font-semibold"/>
             <input type="number" placeholder="Harga" value={customPrice} onChange={e => setCustomPrice(e.target.value)} className="w-full p-3.5 rounded-2xl text-xs outline-none bg-white border border-blue-100 font-semibold"/>
             <button onClick={() => {
                if(!customName || !customPrice) return;
                const ns = { id: Date.now(), name: customName, price: parseInt(customPrice), category: 'Layanan Custom' };
                setCustomServices([...customServices, ns]);
                setSelectedItems([...selectedItems, ns]);
                setCustomName(''); setCustomPrice(''); setShowCustomForm(false);
             }} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl text-xs shadow-lg shadow-blue-200 active:scale-95 transition-transform mt-1">Simpan & Pilih</button>
          </div>
        )}
      </div>

      {/* Floating Bottom Summary - Full Width */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-5 pb-[110px] shadow-[0_-15px_50px_rgba(0,0,0,0.1)] rounded-t-[3rem] flex justify-between items-center px-8 z-40 border-t border-slate-50">
        <div className="animate-fadeIn">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tagihan</p>
          <p className="text-2xl font-black text-blue-600 leading-none">{formatRp(currentTotal)}</p>
        </div>
        <button onClick={handleSimpan} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-blue-100 active:scale-95 transition-transform flex items-center gap-2">
          Simpan <CheckCircle2 size={18}/>
        </button>
      </div>
    </div>
  );
}

function KalenderView({ orders, formatRp, setActiveNota }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  const checkDateMatch = (orderDateStr, dateToCheck) => {
    const [d, m, y] = orderDateStr.split('/');
    return parseInt(d) === dateToCheck.getDate() && (parseInt(m)-1) === dateToCheck.getMonth() && parseInt(y) === dateToCheck.getFullYear();
  };

  const dayOrders = orders.filter(o => checkDateMatch(o.date, selectedDate));
  dayOrders.sort((a,b) => a.time.localeCompare(b.time));

  return (
    <div className="animate-fadeIn space-y-4">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
        <div className="flex justify-between items-center mb-6 px-1">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()-1)))} className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 active:bg-blue-50 transition-colors"><ChevronLeft size={20}/></button>
          <h3 className="font-black text-slate-800 text-base">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth()+1)))} className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 active:bg-blue-50 transition-colors"><ChevronRight size={20}/></button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d => <div key={d} className="text-[10px] font-black text-slate-300 py-2 uppercase tracking-widest">{d}</div>)}
          {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()}).map((_, i) => <div key={i}/>)}
          {Array.from({length: new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0).getDate()}).map((_, i) => {
            const day = i + 1;
            const dObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isSel = day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear();
            const hasOrder = orders.some(o => checkDateMatch(o.date, dObj));
            return (
              <div key={day} onClick={() => setSelectedDate(dObj)} className={`aspect-square flex items-center justify-center text-sm font-bold rounded-full relative cursor-pointer transition-all ${isSel ? 'bg-blue-600 text-white shadow-lg scale-110' : 'text-slate-600 active:bg-slate-100'}`}>
                {day}
                {hasOrder && <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSel ? 'bg-yellow-300' : 'bg-blue-500'}`}></div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-black text-sm px-2 text-slate-800 flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
           Jadwal: {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
        </h3>
        {dayOrders.length === 0 ? (
          <div className="bg-white/60 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
            <CalendarDays className="mx-auto text-slate-300 mb-3" size={40}/>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Tidak ada jadwal</p>
          </div>
        ) : dayOrders.map(o => (
            <div key={o.id} className="bg-white p-5 rounded-[2rem] border border-slate-50 flex gap-4 items-center shadow-sm active:bg-slate-50">
              <div className="text-center border-r pr-4 border-slate-100 flex flex-col justify-center">
                <p className="text-xs font-black text-blue-600">{o.time}</p>
                <Clock size={12} className="text-blue-200 mx-auto mt-1.5"/>
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-800 text-sm">{o.plate}</p>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{o.carType || 'Unit Umum'} • {o.customerName}</p>
              </div>
              <button onClick={() => setActiveNota(o)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl active:text-blue-600 active:bg-blue-50 transition-colors"><Printer size={20}/></button>
            </div>
        ))}
      </div>
    </div>
  );
}

function RiwayatView({ orders, setOrders, services, formatRp, setActiveNota, showAlert, showConfirm }) {
  const [search, setSearch] = useState('');
  const filtered = orders.filter(o => o.plate.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fadeIn space-y-4">
      <div className="bg-white p-1 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center px-5">
        <Search size={18} className="text-slate-300"/>
        <input type="text" placeholder="Cari Plat Nomor / ID..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 p-4 text-xs font-bold outline-none bg-transparent"/>
      </div>
      
      <div className="space-y-4 pb-20">
        {filtered.length === 0 ? <p className="text-center py-20 text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Data Kosong</p> : 
          filtered.map(order => (
            <div key={order.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-50 relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${order.status === 'Lunas' ? 'bg-green-500' : 'bg-amber-500'}`}/>
              <div className="flex justify-between items-start mb-4 pl-2">
                <div>
                  <h4 className="font-black text-slate-800 text-xl tracking-tight">{order.plate}</h4>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{order.customerName}</p>
                </div>
                <span className={`text-[9px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest ${order.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
              </div>
              
              <div className="bg-slate-50/50 rounded-3xl p-5 my-4 text-[11px] font-semibold text-slate-600 border border-slate-50">
                <ul className="space-y-2">
                  {order.items.map((it, i) => <li key={i} className="flex justify-between items-center"><span>• {it.name}</span> <span className="font-bold text-slate-400">{formatRp(it.calculatedPrice)}</span></li>)}
                </ul>
              </div>

              <div className="flex justify-between items-center pl-2 pt-1">
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Total Tagihan</p>
                  <p className="font-black text-blue-600 text-xl leading-tight">{formatRp(order.total)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setActiveNota(order)} className="p-3.5 bg-slate-100 text-slate-400 rounded-2xl active:bg-blue-50 active:text-blue-600"><Printer size={20}/></button>
                  {order.status !== 'Lunas' && (
                    <button onClick={() => showConfirm(`Lunas ${formatRp(order.total)} via QRIS?`, () => setOrders(prev => prev.map(o => o.id === order.id ? {...o, status: 'Lunas', paymentMethod: 'Transfer / QRIS'} : o)))} className="bg-green-500 hover:bg-green-600 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-xl shadow-green-100 active:scale-95 transition-all">BAYAR SEKARANG</button>
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

function LaporanView({ orders, formatRp }) {
  const lunas = orders.filter(o => o.status === 'Lunas');
  const total = lunas.reduce((sum, o) => sum + o.total, 0);
  const units = lunas.length;

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <Wallet className="absolute -right-6 -top-6 w-32 h-32 text-white/5 rotate-12" />
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total Omzet (Lunas)</p>
        <h3 className="text-4xl font-black tracking-tighter">{formatRp(total)}</h3>
        <div className="mt-8 flex items-center gap-2 text-xs font-bold text-slate-400">
           <Calendar size={14} className="text-blue-400"/> Update Per Hari Ini
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-50 text-center shadow-sm">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Unit Selesai</p>
          <p className="text-3xl font-black text-green-600">{units}</p>
        </div>
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-50 text-center shadow-sm">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Total Antrian</p>
          <p className="text-3xl font-black text-slate-700">{orders.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 px-1"><Sparkles size={14} className="text-blue-500"/> Ringkasan Layanan</h4>
         <div className="space-y-5">
            <div className="flex justify-between items-center text-sm font-bold bg-slate-50 p-4 rounded-2xl">
               <span className="text-slate-600">Terbayar (Lunas)</span>
               <span className="text-green-600 font-black px-3 py-1 bg-green-50 rounded-lg">{units} trx</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold bg-slate-50 p-4 rounded-2xl">
               <span className="text-slate-600">Pending (Belum Lunas)</span>
               <span className="text-amber-500 font-black px-3 py-1 bg-amber-50 rounded-lg">{orders.length - units} trx</span>
            </div>
         </div>
      </div>
    </div>
  );
}

function UserAvatar() {
  return <img src="https://images.unsplash.com/photo-1777139472343-a07c690a8e4e?q=80&w=150" alt="Avatar" className="w-12 h-12 rounded-full object-cover bg-white shadow-inner border-2 border-white/20"/>;
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-[#facc15] text-[#1e3a8a] px-6 py-3 rounded-full font-black shadow-lg scale-105' : 'text-white/40 p-3 hover:text-white/70 active:scale-90'}`}>
      {React.cloneElement(icon, { size: 22, strokeWidth: isActive ? 3 : 2 })}
      {isActive && <span className="ml-2 text-xs tracking-tighter">{label}</span>}
    </button>
  );
}

function NotaModal({ order, formatRp, onClose, showAlert }) {
  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center p-5 backdrop-blur-md animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl border border-white/20">
        <div className="bg-slate-50 p-7 text-center relative border-b border-dashed border-slate-200">
          <button onClick={onClose} className="absolute right-6 top-6 text-slate-300 hover:text-slate-600"><X size={26}/></button>
          <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-100"><Receipt size={32}/></div>
          <h2 className="font-black text-slate-800 text-lg tracking-tighter leading-none">L CARWASH & DETAIL</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Samarinda • Home Service</p>
        </div>
        
        <div className="p-8 overflow-y-auto text-xs space-y-7 hide-scrollbar">
          <div className="flex justify-between border-b border-dashed border-slate-100 pb-5 mb-2">
             <span className="font-bold text-slate-400 uppercase">{order.date} • {order.time}</span>
             <span className="font-black text-blue-600 tracking-widest uppercase">{order.id}</span>
          </div>
          
          <div className="space-y-1.5">
            <p className="font-black text-2xl text-slate-800 tracking-tighter">{order.plate}</p>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">{order.carType || 'Unit Umum'} {order.carSize !== '-' ? `(${order.carSize})` : ''}</p>
            <p className="text-slate-400 font-bold text-[10px] mt-1">Cust: {order.customerName}</p>
          </div>

          <div className="py-5 border-y border-dashed border-slate-200 space-y-2.5">
            {order.items.map((it, i) => (
              <div key={i} className="flex justify-between items-center text-slate-600 font-bold">
                <span className="max-w-[70%]">{it.name}</span>
                <span className="font-black text-slate-900">{formatRp(it.calculatedPrice)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-2xl font-black pt-3 tracking-tighter">
            <span className="text-slate-800">TOTAL</span>
            <span className="text-blue-600">{formatRp(order.total)}</span>
          </div>

          <div className="pt-8 text-center italic text-slate-300 font-bold text-[10px] tracking-widest uppercase opacity-70">"Kilap maksimal, hati pun senang!"</div>
        </div>
        
        <div className="p-7 bg-slate-50 flex gap-3 mt-auto">
          <button onClick={onClose} className="flex-1 py-4.5 rounded-2xl font-black bg-white border border-slate-200 text-slate-400 text-[10px] tracking-widest uppercase active:bg-slate-50 transition-colors">Tutup</button>
          <button onClick={() => showAlert('Mencetak struk thermal...')} className="flex-1 py-4.5 rounded-2xl font-black bg-blue-600 text-white shadow-xl shadow-blue-100 text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 active:scale-95 transition-all">
            <Printer size={18}/> Cetak
          </button>
        </div>
      </div>
    </div>
  );
}
