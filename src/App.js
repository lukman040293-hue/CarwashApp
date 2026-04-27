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
} from 'lucide-react';

// --- DATA MASTER LAYANAN DENGAN HARGA DINAMIS ---
const SERVICES = [
  {
    id: 'w1',
    name: 'Basic Wash',
    category: 'Carwash',
    price: 150000,
    icon: <Droplets size={32} />,
  },
  {
    id: 'w2',
    name: 'Super Premium Wash',
    category: 'Carwash',
    price: { Kecil: 300000, Besar: 315000 },
    icon: <Sparkles size={32} />,
    recommended: true,
  },
  {
    id: 'w3',
    name: 'Premium Wash',
    category: 'Carwash',
    price: 200000,
    icon: <Wrench size={32} />,
  },
  {
    id: 'd1',
    name: 'Wash(Cuci) Engine',
    category: 'Engine',
    price: { Kecil: 125000, Besar: 145000 },
    icon: <Car size={32} />,
  },
  {
    id: 'd2',
    name: 'Detailing Engine',
    category: 'Engine',
    price: 650000,
    icon: <Sun size={32} />,
  },
  {
    id: 'a2',
    name: 'Pembersih noda aspal (Ringan)',
    category: 'Layanan Tambahan',
    price: 50000,
    icon: <Wind size={32} />,
  },
];

const getPrice = (item, size) => {
  if (typeof item.price === 'number') return item.price;
  return item.price[size] || item.price['Kecil'];
};

export default function App() {
  const [activeTab, setActiveTab] = useState('kasir');
  const [activeNota, setActiveNota] = useState(null);
  const [dialog, setDialog] = useState(null);

  // Mengambil layanan custom dari localStorage jika ada
  const [customServices, setCustomServices] = useState(() => {
    const savedCustomServices = localStorage.getItem(
      'l_carwash_custom_services'
    );
    if (savedCustomServices) {
      try {
        const parsed = JSON.parse(savedCustomServices);
        return parsed.map((service) => {
          const { icon, ...rest } = service;
          return rest;
        });
      } catch (e) {
        console.error('Gagal membaca layanan custom dari localStorage', e);
      }
    }
    return [];
  });

  // Mengambil pesanan dari localStorage jika ada, jika tidak gunakan data default
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('l_carwash_orders');
    if (savedOrders) {
      try {
        return JSON.parse(savedOrders);
      } catch (e) {
        console.error('Gagal membaca pesanan dari localStorage', e);
      }
    }
    return [
      {
        id: 'TRX-1001',
        date: new Date().toLocaleDateString('id-ID'),
        time: '10:30',
        customerName: 'Bapak Andi',
        customerPhone: '081234567890',
        customerAddress: 'Jl. Merdeka No. 45, Samarinda',
        plate: 'KT 8899 BB',
        carType: 'Toyota Fortuner',
        carSize: 'Besar',
        items: [
          { ...SERVICES[1], calculatedPrice: 315000 },
          { ...SERVICES[3], calculatedPrice: 145000 },
        ],
        total: 460000,
        status: 'Lunas',
        paymentMethod: 'Transfer / QRIS',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('l_carwash_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(
      'l_carwash_custom_services',
      JSON.stringify(customServices)
    );
  }, [customServices]);

  const formatRp = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const showAlert = (message) => setDialog({ type: 'alert', message });
  const showConfirm = (message, onConfirm) =>
    setDialog({ type: 'confirm', message, onConfirm });

  return (
    <div
      style={{ fontFamily: "'Outfit', sans-serif" }}
      className="bg-slate-50 min-h-screen text-slate-800 max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
        .icon-yellow-grad svg { stroke: url(#yellow-gradient) !important; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        /* Custom Scrollbar for better look */
        .hide-scrollbar::-webkit-scrollbar { width: 4px; }
        .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .hide-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `,
        }}
      />

      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient
            id="yellow-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>

      {/* Header Profile Baru */}
      <div className="pt-6 px-4 pb-2 shrink-0 z-10">
        <div className="bg-[#24429A] rounded-[1.5rem] px-4 py-5 min-h-[110px] flex flex-col justify-center shadow-lg shadow-[#24429A]/20 text-white relative overflow-hidden border border-white/10">
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h1 className="text-sm font-bold tracking-[0.15em] text-white/90 uppercase">
                L Carwash & Detailing
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] text-orange-400 mt-1 uppercase">
                Home Service
              </p>
            </div>
            <div className="bg-white/10 p-1.5 rounded-full border border-white/20 backdrop-blur-sm shadow-sm">
              <UserAvatar />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar pb-32 px-4 pt-4">
        {activeTab === 'kasir' && (
          <KasirView
            services={SERVICES}
            customServices={customServices}
            setCustomServices={setCustomServices}
            setOrders={setOrders}
            formatRp={formatRp}
            setActiveTab={setActiveTab}
            setActiveNota={setActiveNota}
            showAlert={showAlert}
          />
        )}
        {activeTab === 'kalender' && (
          <KalenderView
            orders={orders}
            formatRp={formatRp}
            setActiveNota={setActiveNota}
          />
        )}
        {activeTab === 'riwayat' && (
          <RiwayatView
            orders={orders}
            setOrders={setOrders}
            services={SERVICES}
            customServices={customServices}
            setCustomServices={setCustomServices}
            formatRp={formatRp}
            setActiveNota={setActiveNota}
            showAlert={showAlert}
            showConfirm={showConfirm}
          />
        )}
        {activeTab === 'laporan' && (
          <LaporanView orders={orders} formatRp={formatRp} />
        )}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] bg-[#1e3a8a] flex justify-between items-center px-2 py-2 z-50 rounded-full shadow-[0_10px_25px_-5px_rgba(30,58,138,0.5)] border border-white/10">
        <NavItem
          icon={<ClipboardList />}
          label="Kasir"
          isActive={activeTab === 'kasir'}
          onClick={() => setActiveTab('kasir')}
        />
        <NavItem
          icon={<CalendarDays />}
          label="Jadwal"
          isActive={activeTab === 'kalender'}
          onClick={() => setActiveTab('kalender')}
        />
        <NavItem
          icon={<History />}
          label="Riwayat"
          isActive={activeTab === 'riwayat'}
          onClick={() => setActiveTab('riwayat')}
        />
        <NavItem
          icon={<BarChart3 />}
          label="Laporan"
          isActive={activeTab === 'laporan'}
          onClick={() => setActiveTab('laporan')}
        />
      </div>

      {activeNota && (
        <NotaModal
          order={activeNota}
          formatRp={formatRp}
          onClose={() => setActiveNota(null)}
          showAlert={showAlert}
        />
      )}

      {dialog && (
        <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-2xl text-center animate-slideUp">
            <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
              {dialog.type === 'confirm' ? (
                <CheckCircle2 size={24} />
              ) : (
                <span className="font-bold text-xl">!</span>
              )}
            </div>
            <p className="text-slate-800 font-medium mb-5 text-sm">
              {dialog.message}
            </p>
            <div className="flex justify-center gap-3">
              {dialog.type === 'confirm' && (
                <button
                  onClick={() => setDialog(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 text-sm w-full"
                >
                  Batal
                </button>
              )}
              <button
                onClick={() => {
                  if (dialog.type === 'confirm' && dialog.onConfirm)
                    dialog.onConfirm();
                  setDialog(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 text-sm w-full"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- KOMPONEN VIEW --- */

function KasirView({
  services,
  customServices,
  setCustomServices,
  setOrders,
  formatRp,
  setActiveTab,
  setActiveNota,
  showAlert,
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [plate, setPlate] = useState('');
  const [carType, setCarType] = useState('');
  const [carSize, setCarSize] = useState('Kecil');
  const [selectedItems, setSelectedItems] = useState([]);

  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [orderTime, setOrderTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );

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
    const exists = selectedItems.find((item) => item.id === service.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((item) => item.id !== service.id));
    } else {
      setSelectedItems([...selectedItems, service]);
    }
  };

  const handleAddCustom = () => {
    if (!customName || !customPrice)
      return showAlert('Nama dan harga layanan custom wajib diisi!');

    const newService = {
      id: `cst-${Date.now()}`,
      name: customName,
      category: 'Layanan Custom',
      price: parseInt(customPrice.replace(/[^0-9]/g, '') || 0),
    };

    setCustomServices([...customServices, newService]);
    setSelectedItems([...selectedItems, newService]);

    setCustomName('');
    setCustomPrice('');
    setShowCustomForm(false);
  };

  const totalBelanja = selectedItems.reduce(
    (sum, item) => sum + getPrice(item, carSize),
    0
  );

  const handleSimpan = (e) => {
    e.preventDefault();
    if (selectedItems.length === 0)
      return showAlert('Pilih minimal 1 layanan!');

    const dateParts = orderDate.split('-');
    const displayDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    const itemsWithCalculatedPrice = selectedItems.map((item) => ({
      ...item,
      calculatedPrice: getPrice(item, carSize),
    }));

    const newOrder = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: displayDate,
      time: orderTime,
      customerName: customerName || 'Pelanggan Umum',
      customerPhone: customerPhone || '-',
      customerAddress: customerAddress || '-',
      plate: plate ? plate.toUpperCase() : '-',
      carType,
      carSize: selectedItems.some((i) => typeof i.price === 'object')
        ? carSize
        : '-',
      items: itemsWithCalculatedPrice,
      total: totalBelanja,
      status: 'Belum Lunas',
      paymentMethod: '-',
    };

    setOrders((prev) => [newOrder, ...prev]);

    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setPlate('');
    setCarType('');
    setCarSize('Kecil');
    setSelectedItems([]);
    setOrderDate(new Date().toISOString().split('T')[0]);
    setOrderTime(new Date().toTimeString().slice(0, 5));

    setActiveTab('riwayat');
    setActiveNota(newOrder);
  };

  return (
    <div className="animate-fadeIn relative h-full">
      <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
        <Car className="mr-2 text-blue-600" size={20} /> Input Kendaraan
        Customer
      </h2>

      <form className="space-y-5 pb-40">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex gap-3 pb-2 border-b border-slate-100">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center mb-1">
                <Calendar size={12} className="mr-1" /> Tanggal
              </label>
              <input
                type="date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center mb-1">
                <Clock size={12} className="mr-1" /> Jam
              </label>
              <input
                type="time"
                required
                value={orderTime}
                onChange={(e) => setOrderTime(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Plat Nomor
              </label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="B 1234 XYZ"
                className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 text-sm uppercase focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tipe/Merk Mobil
              </label>
              <input
                type="text"
                value={carType}
                onChange={(e) => setCarType(e.target.value)}
                placeholder="Pajero Sport"
                className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Nama Pemilik
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama Pelanggan"
                className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                No. WhatsApp
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0812..."
                className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Alamat Lengkap
            </label>
            <textarea
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Alamat pelanggan..."
              rows="2"
              className="mt-1 w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-800">Service</h3>
          </div>
          <div className="space-y-4">
            {Object.keys(groupedServices).map((category, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                  <h4 className="font-bold text-slate-700 text-sm">
                    {category}
                  </h4>
                </div>
                <div className="p-3 grid grid-cols-2 gap-3">
                  {groupedServices[category].map((item) => {
                    const isSelected = selectedItems.find(
                      (i) => i.id === item.id
                    );
                    const displayedPrice = getPrice(item, carSize);

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item)}
                        className={`relative rounded-3xl border-2 flex flex-col items-center justify-center pt-6 pb-4 px-2 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/80 shadow-[0_8px_15px_-3px_rgba(37,99,235,0.3)] scale-[0.98]'
                            : 'border-slate-100 bg-white shadow-[0_6px_20px_-4px_rgba(0,0,0,0.1)] hover:border-blue-200 hover:shadow-xl hover:-translate-y-1.5'
                        }`}
                      >
                        <div
                          className={`absolute top-2 right-2 rounded-full z-10 p-0.5 shadow-sm transition-opacity ${
                            isSelected ? 'bg-blue-600 text-white' : 'opacity-0'
                          }`}
                        >
                          <CheckCircle2 size={22} />
                        </div>

                        {item.recommended && (
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-amber-600 text-[9px] font-bold px-2 py-1.5 rounded-lg flex items-center shadow-lg border-[0.5px] border-amber-200/30 z-10">
                            <Star
                              size={10}
                              className="fill-amber-500 text-amber-500 mr-1"
                            />{' '}
                            Rekomendasi
                          </div>
                        )}

                        <div
                          className={`mb-3 p-4 rounded-full transition-colors duration-300 icon-yellow-grad ${
                            isSelected
                              ? 'bg-amber-100/50 shadow-inner'
                              : 'bg-slate-50'
                          }`}
                        >
                          {item.category === 'Layanan Custom' ? (
                            <Wrench size={32} />
                          ) : (
                            item.icon
                          )}
                        </div>

                        <div className="text-center px-1 w-full">
                          <p
                            className={`text-sm font-bold leading-tight mb-1 line-clamp-2 ${
                              isSelected ? 'text-blue-800' : 'text-slate-700'
                            }`}
                          >
                            {item.name}
                          </p>
                          <p className="text-sm font-black text-blue-600 transition-all">
                            {formatRp(displayedPrice)}
                          </p>

                          {isSelected && typeof item.price === 'object' && (
                            <div
                              className="mt-2 w-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <select
                                value={carSize}
                                onChange={(e) => setCarSize(e.target.value)}
                                className="w-full border border-blue-300 rounded-md p-1.5 text-xs text-center outline-none bg-blue-100 text-blue-800 font-bold cursor-pointer"
                              >
                                <option value="Kecil">Kecil</option>
                                <option value="Besar">Besar</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            {!showCustomForm ? (
              <button
                type="button"
                onClick={() => setShowCustomForm(true)}
                className="w-full flex items-center justify-center py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:border-blue-400 hover:text-blue-600 transition-colors bg-white"
              >
                <Plus size={18} className="mr-2" /> Tambah Layanan Custom
              </button>
            ) : (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-blue-800 text-sm">
                    Layanan Tambahan Custom
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <Minus size={18} />
                  </button>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Nama Layanan (mis: Las Knalpot)"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full border border-blue-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-2 bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Harga (mis: 150000)"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full border border-blue-200 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Tambahkan & Centang
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.15)] z-40 rounded-t-[2.5rem] px-7 pt-6 pb-[95px] flex justify-between items-start transition-all">
        <div>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-1.5">
            Total ({selectedItems.length} Item)
          </p>
          <p className="text-[26px] font-black text-[#2563eb] leading-none tracking-tight">
            {formatRp(totalBelanja)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSimpan}
          className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-[15px] py-2.5 px-5 rounded-xl shadow-lg shadow-blue-600/30 transition-transform active:scale-95 flex items-center gap-1.5 mt-0.5"
        >
          Simpan <CheckCircle2 size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function KalenderView({ orders, formatRp, setActiveNota }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const checkDateMatch = (orderDateStr, dateToCheck) => {
    let oDate;
    if (orderDateStr.includes('/')) {
      const parts = orderDateStr.split('/');
      oDate = new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
      oDate = new Date(orderDateStr);
    }
    return (
      oDate.getDate() === dateToCheck.getDate() &&
      oDate.getMonth() === dateToCheck.getMonth() &&
      oDate.getFullYear() === dateToCheck.getFullYear()
    );
  };

  const selectedDateOrders = orders.filter((order) =>
    checkDateMatch(order.date, selectedDate)
  );
  selectedDateOrders.sort((a, b) => a.time.localeCompare(b.time));

  const renderCalendarDays = () => {
    const grid = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const loopDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      const isSelected =
        loopDate.getDate() === selectedDate.getDate() &&
        loopDate.getMonth() === selectedDate.getMonth() &&
        loopDate.getFullYear() === selectedDate.getFullYear();

      const isToday =
        loopDate.getDate() === new Date().getDate() &&
        loopDate.getMonth() === new Date().getMonth() &&
        loopDate.getFullYear() === new Date().getFullYear();

      const hasOrder = orders.some((order) =>
        checkDateMatch(order.date, loopDate)
      );

      grid.push(
        <div
          key={i}
          onClick={() => setSelectedDate(loopDate)}
          className="p-1 flex justify-center cursor-pointer relative"
        >
          <div
            className={`w-8 h-8 flex flex-col items-center justify-center rounded-full text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md'
                : isToday
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>{i}</span>
          </div>
          {hasOrder && (
            <span
              className={`absolute bottom-0 w-1.5 h-1.5 rounded-full ${
                isSelected ? 'bg-yellow-300' : 'bg-blue-500'
              }`}
            ></span>
          )}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="animate-fadeIn space-y-4 relative pb-10">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={prevMonth}
            className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 border border-slate-200"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-bold text-slate-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="p-1.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 border border-slate-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {days.map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">{renderCalendarDays()}</div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-3 px-1">
          <h3 className="font-bold text-slate-800">
            Jadwal: {selectedDate.getDate()}{' '}
            {monthNames[selectedDate.getMonth()]}
          </h3>
          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
            {selectedDateOrders.length} Kendaraan
          </span>
        </div>

        <div className="space-y-3">
          {selectedDateOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-200 border-dashed">
              <CalendarDays className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-sm font-medium text-slate-500">
                Tidak ada jadwal layanan
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Belum ada kendaraan yang dijadwalkan pada tanggal ini.
              </p>
            </div>
          ) : (
            selectedDateOrders.map((order, idx) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="flex">
                  <div className="bg-slate-50 border-r border-slate-100 w-20 shrink-0 flex flex-col items-center justify-center py-4 relative">
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${
                        order.status === 'Lunas'
                          ? 'bg-green-500'
                          : order.status === 'Proses Pengerjaan'
                          ? 'bg-blue-500'
                          : order.status === 'Selesai'
                          ? 'bg-purple-500'
                          : order.status === 'Dibatalkan'
                          ? 'bg-red-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <Clock size={16} className="text-slate-400 mb-1" />
                    <span className="font-bold text-slate-700 text-sm">
                      {order.time}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 relative">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-blue-700">
                          {order.plate}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {order.carType || 'Mobil Umum'}{' '}
                          {order.carSize !== '-' ? `(${order.carSize})` : ''}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${
                          order.status === 'Lunas'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'Proses Pengerjaan'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'Selesai'
                            ? 'bg-purple-100 text-purple-700'
                            : order.status === 'Dibatalkan'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 border-dashed">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 bg-slate-100 p-1 rounded-md">
                          <Star size={12} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            Pelanggan
                          </p>
                          <p className="text-xs font-semibold text-slate-700">
                            {order.customerName}
                          </p>
                        </div>
                      </div>

                      {order.customerPhone && order.customerPhone !== '-' && (
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 bg-slate-100 p-1 rounded-md">
                            <Phone size={12} className="text-slate-500" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-600 mt-0.5">
                              {order.customerPhone}
                            </p>
                          </div>
                        </div>
                      )}

                      {order.customerAddress &&
                        order.customerAddress !== '-' && (
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 bg-slate-100 p-1 rounded-md">
                              <MapPin size={12} className="text-slate-500" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-600 leading-tight pt-0.5">
                                {order.customerAddress}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="mt-3 pt-3 flex justify-between items-center">
                      <div className="text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        {order.items.length} Layanan
                      </div>
                      <button
                        onClick={() => setActiveNota(order)}
                        className="text-xs font-bold text-blue-600 flex items-center bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Printer size={12} className="mr-1" /> Lihat Nota
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function RiwayatView({
  orders,
  setOrders,
  services,
  customServices,
  setCustomServices,
  formatRp,
  setActiveNota,
  showAlert,
  showConfirm,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);

  const filteredOrders = orders.filter(
    (o) =>
      o.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUbahStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const handlePelunasan = (id, method) => {
    showConfirm(`Konfirmasi pembayaran via ${method}?`, () => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: 'Lunas', paymentMethod: method } : o
        )
      );
    });
  };

  const handleSaveEdit = (orderId, newItems, newTotal, newCarSize) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            items: newItems,
            total: newTotal,
            carSize: newCarSize,
          };
        }
        return o;
      })
    );
    setEditingOrder(null);
  };

  return (
    <div className="animate-fadeIn space-y-4 relative">
      <div className="flex items-center bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
        <Search className="text-slate-400 ml-2 mr-2" size={20} />
        <input
          type="text"
          placeholder="Cari Plat Nomor / ID Transaksi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-sm p-1"
        />
      </div>

      <div className="space-y-3 pb-32">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-10">
            Tidak ada data pesanan.
          </p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 relative overflow-hidden"
            >
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  order.status === 'Lunas'
                    ? 'bg-green-500'
                    : order.status === 'Proses Pengerjaan'
                    ? 'bg-blue-500'
                    : order.status === 'Selesai'
                    ? 'bg-purple-500'
                    : order.status === 'Dibatalkan'
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}
              />

              <div className="flex justify-between items-start mb-2 pl-2">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">
                    {order.plate}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {order.carType ? `${order.carType} ` : ''}
                    {order.carSize !== '-' ? `(${order.carSize}) ` : ''}•{' '}
                    {order.customerName}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span
                    className={`text-[10px] px-2 py-1 rounded-md font-bold mb-1 ${
                      order.status === 'Lunas'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Proses Pengerjaan'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'Selesai'
                        ? 'bg-purple-100 text-purple-700'
                        : order.status === 'Dibatalkan'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="text-[10px] text-slate-400">{order.id}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 my-3 pl-3 text-xs text-slate-600">
                <ul className="list-disc pl-3 space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name}{' '}
                      <span className="text-slate-400">
                        ({formatRp(item.calculatedPrice || item.price)})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center pl-2 pt-3 border-t border-slate-100 mt-2">
                <div>
                  <p className="text-[10px] text-slate-500">Total Tagihan</p>
                  <p className="font-bold text-blue-600 text-base">
                    {formatRp(order.total)}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  {(order.status === 'Belum Lunas' ||
                    order.status === 'Proses Pengerjaan') && (
                    <button
                      onClick={() => setEditingOrder(order)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 flex items-center shadow-sm"
                      title="Edit/Tambah Layanan"
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => setActiveNota(order)}
                    className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                    title="Lihat/Cetak Nota"
                  >
                    <Printer size={16} />
                  </button>
                </div>
              </div>

              <div className="pl-2 pt-3 mt-3 border-t border-slate-100 flex gap-2 justify-end">
                {order.status === 'Belum Lunas' && (
                  <>
                    <button
                      onClick={() => handleUbahStatus(order.id, 'Dibatalkan')}
                      className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() =>
                        handleUbahStatus(order.id, 'Proses Pengerjaan')
                      }
                      className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 shadow-sm"
                    >
                      Mulai Kerjakan
                    </button>
                  </>
                )}

                {order.status === 'Proses Pengerjaan' && (
                  <button
                    onClick={() => handleUbahStatus(order.id, 'Selesai')}
                    className="px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 shadow-sm"
                  >
                    Selesai
                  </button>
                )}

                {(order.status === 'Belum Lunas' ||
                  order.status === 'Proses Pengerjaan' ||
                  order.status === 'Selesai') && (
                  <button
                    onClick={() => handlePelunasan(order.id, 'Transfer / QRIS')}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-sm"
                  >
                    Lunas (QRIS/Transfer)
                  </button>
                )}

                {(order.status === 'Lunas' ||
                  order.status === 'Dibatalkan') && (
                  <div className="flex items-center text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <Receipt size={14} className="mr-1" />{' '}
                    {order.paymentMethod || '-'}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {editingOrder && (
        <EditLayananModal
          order={editingOrder}
          services={services}
          customServices={customServices}
          setCustomServices={setCustomServices}
          onClose={() => setEditingOrder(null)}
          onSave={handleSaveEdit}
          formatRp={formatRp}
          showAlert={showAlert}
        />
      )}
    </div>
  );
}

function EditLayananModal({
  order,
  services,
  customServices,
  setCustomServices,
  onClose,
  onSave,
  formatRp,
  showAlert,
}) {
  const [selectedItems, setSelectedItems] = useState(order.items || []);
  const [carSize, setCarSize] = useState(
    order.carSize !== '-' ? order.carSize : 'Kecil'
  );
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
    const exists = selectedItems.find((item) => item.id === service.id);
    if (exists) {
      setSelectedItems(selectedItems.filter((item) => item.id !== service.id));
    } else {
      setSelectedItems([...selectedItems, service]);
    }
  };

  const handleAddCustom = () => {
    if (!customName || !customPrice)
      return showAlert('Nama dan harga layanan custom wajib diisi!');
    const newService = {
      id: `cst-${Date.now()}`,
      name: customName,
      category: 'Layanan Custom',
      price: parseInt(customPrice.replace(/[^0-9]/g, '') || 0),
    };
    setCustomServices([...customServices, newService]);
    setSelectedItems([...selectedItems, newService]);
    setCustomName('');
    setCustomPrice('');
    setShowCustomForm(false);
  };

  const handleSimpan = () => {
    if (selectedItems.length === 0)
      return showAlert('Pilih minimal 1 layanan terlebih dahulu!');
    const itemsWithCalculatedPrice = selectedItems.map((item) => ({
      ...item,
      calculatedPrice: getPrice(item, carSize),
    }));
    const totalBelanja = itemsWithCalculatedPrice.reduce(
      (sum, item) => sum + (item.calculatedPrice || item.price),
      0
    );
    const finalCarSize = selectedItems.some((i) => typeof i.price === 'object')
      ? carSize
      : '-';
    onSave(order.id, itemsWithCalculatedPrice, totalBelanja, finalCarSize);
  };

  const currentTotal = selectedItems.reduce(
    (sum, item) => sum + getPrice(item, carSize),
    0
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[70] flex items-end sm:items-center justify-center backdrop-blur-sm sm:p-4">
      <div className="bg-slate-50 w-full max-w-md h-[90vh] sm:h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        <div className="bg-white px-5 py-4 border-b border-slate-200 flex justify-between items-center shrink-0 shadow-sm z-10">
          <div>
            <h3 className="font-bold text-slate-800">Edit / Tambah Layanan</h3>
            <p className="text-xs text-slate-500">
              {order.plate} • {order.customerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 hide-scrollbar space-y-4 relative">
          {Object.keys(groupedServices).map((category, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                <h4 className="font-bold text-slate-700 text-sm">{category}</h4>
              </div>
              <div className="p-3 grid grid-cols-2 gap-3">
                {groupedServices[category].map((item) => {
                  const isSelected = selectedItems.find(
                    (i) => i.id === item.id
                  );
                  const displayedPrice = getPrice(item, carSize);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item)}
                      className={`relative rounded-3xl border-2 flex flex-col items-center justify-center pt-6 pb-4 px-2 cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/80 shadow-[0_8px_15px_-3px_rgba(37,99,235,0.3)] scale-[0.98]'
                          : 'border-slate-100 bg-white shadow-[0_6px_20px_-4px_rgba(0,0,0,0.1)] hover:border-blue-200 hover:shadow-xl hover:-translate-y-1.5'
                      }`}
                    >
                      <div
                        className={`absolute top-2 right-2 rounded-full z-10 p-0.5 shadow-sm transition-opacity ${
                          isSelected ? 'bg-blue-600 text-white' : 'opacity-0'
                        }`}
                      >
                        <CheckCircle2 size={22} />
                      </div>

                      <div
                        className={`mb-3 p-4 rounded-full transition-colors duration-300 icon-yellow-grad ${
                          isSelected
                            ? 'bg-amber-100/50 shadow-inner'
                            : 'bg-slate-50'
                        }`}
                      >
                        {item.category === 'Layanan Custom' ? (
                          <Wrench size={32} />
                        ) : (
                          item.icon
                        )}
                      </div>

                      <div className="text-center px-1 w-full">
                        <p
                          className={`text-sm font-bold leading-tight mb-1 line-clamp-2 ${
                            isSelected ? 'text-blue-800' : 'text-slate-700'
                          }`}
                        >
                          {item.name}
                        </p>
                        <p className="text-sm font-black text-blue-600 transition-all">
                          {formatRp(displayedPrice)}
                        </p>

                        {isSelected && typeof item.price === 'object' && (
                          <div
                            className="mt-2 w-full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <select
                              value={carSize}
                              onChange={(e) => setCarSize(e.target.value)}
                              className="w-full border border-blue-300 rounded-md p-1.5 text-xs text-center outline-none bg-blue-100 text-blue-800 font-bold cursor-pointer"
                            >
                              <option value="Kecil">Kecil</option>
                              <option value="Besar">Besar</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mt-4 pb-4">
            {!showCustomForm ? (
              <button
                type="button"
                onClick={() => setShowCustomForm(true)}
                className="w-full flex items-center justify-center py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:border-blue-400 bg-white"
              >
                <Plus size={18} className="mr-2" /> Tambah Layanan Custom
              </button>
            ) : (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-blue-800 text-sm">
                    Layanan Tambahan Custom
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="text-blue-400"
                  >
                    <Minus size={18} />
                  </button>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Nama Layanan"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full border border-blue-200 rounded-lg p-2.5 text-sm outline-none mb-2 bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Harga"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full border border-blue-200 rounded-lg p-2.5 text-sm outline-none bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg shadow-sm"
                >
                  Tambahkan & Centang
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 border-t border-slate-200 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10 pb-safe">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Total Baru</p>
              <p className="text-xl font-bold text-blue-600">
                {formatRp(currentTotal)}
              </p>
            </div>
            <button
              onClick={handleSimpan}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-transform active:scale-95"
            >
              Simpan Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotaModal({ order, formatRp, onClose, showAlert }) {
  const handleCetakNota = () => {
    showAlert(
      'Menghubungkan ke printer thermal... (Mencetak Nota: ' + order.id + ')'
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-slate-100 p-4 text-center border-b border-dashed border-slate-300 relative">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 size={24} />
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            L CarwashDetailing
          </h2>
          <p className="text-xs text-slate-500">TOKO, Samarinda</p>
        </div>

        <div className="p-5 flex-1 overflow-y-auto hide-scrollbar text-sm text-slate-700">
          <div className="flex justify-between mb-1">
            <span>Tanggal:</span>
            <span>
              {order.date} {order.time}
            </span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Kasir:</span>
            <span>Admin Kasir</span>
          </div>

          <div className="border-t border-b border-dashed border-slate-300 py-3 mb-3">
            <div className="flex justify-between mb-1">
              <span>
                Plat: <span className="font-bold text-base">{order.plate}</span>
              </span>
            </div>
            {(order.carType || order.carSize !== '-') && (
              <div className="flex justify-between mb-1 text-xs text-slate-500">
                <span>
                  Mobil: {order.carType ? `${order.carType} ` : ''}
                  {order.carSize !== '-' ? `(${order.carSize})` : ''}
                </span>
              </div>
            )}
            {order.customerName && order.customerName !== 'Pelanggan Umum' && (
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Nama: {order.customerName}</span>
              </div>
            )}
            {order.customerPhone && order.customerPhone !== '-' && (
              <div className="flex justify-between text-xs text-slate-500">
                <span>No. WA: {order.customerPhone}</span>
              </div>
            )}
            {order.customerAddress && order.customerAddress !== '-' && (
              <div className="text-xs text-slate-500 mt-1">
                <span>Alamat: {order.customerAddress}</span>
              </div>
            )}
          </div>

          <table className="w-full mb-4">
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className="align-top">
                  <td className="py-1 pb-2">
                    <div className="font-medium text-slate-800">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-400">1x</div>
                  </td>
                  <td className="text-right py-1 font-medium">
                    {formatRp(item.calculatedPrice || item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-lg font-bold">
            <span>TOTAL</span>
            <span className="text-blue-600">{formatRp(order.total)}</span>
          </div>

          <div className="mt-6 text-center space-y-1">
            <div className="bg-blue-50 text-blue-700 py-1.5 px-3 rounded-lg text-xs font-semibold mb-2 border border-blue-100 mx-auto w-fit">
              Pembayaran Hanya Melalui Transfer / QRIS
            </div>
            <p className="text-xs text-slate-500 italic">
              "Terima kasih atas kunjungan Anda"
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-3 shrink-0">
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handleCetakNota}
            className="py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm shadow-blue-200"
          >
            <Printer size={18} className="mr-2" /> Cetak
          </button>
        </div>
      </div>
    </div>
  );
}

function LaporanView({ orders, formatRp }) {
  const [period, setPeriod] = useState('Hari Ini');

  const filteredOrders = orders.filter((order) => {
    const today = new Date();

    let orderDate;
    if (order.date.includes('/')) {
      const parts = order.date.split('/');
      orderDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    } else {
      orderDate = new Date(order.date);
    }

    if (period === 'Hari Ini') {
      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    } else if (period === 'Bulan Ini') {
      return (
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    } else if (period === 'Tahun Ini') {
      return orderDate.getFullYear() === today.getFullYear();
    }
    return true;
  });

  const lunasOrders = filteredOrders.filter((o) => o.status === 'Lunas');
  const batalOrders = filteredOrders.filter((o) => o.status === 'Dibatalkan');
  const pendingOrders = filteredOrders.filter((o) =>
    ['Belum Lunas', 'Proses Pengerjaan', 'Selesai'].includes(o.status)
  );

  const totalPendapatan = lunasOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const renderPeriodLabel = () => {
    const today = new Date();
    if (period === 'Hari Ini')
      return today.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    if (period === 'Bulan Ini')
      return today.toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      });
    if (period === 'Tahun Ini') return `Tahun ${today.getFullYear()}`;
    return 'Data Keseluruhan Waktu';
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg text-slate-800 flex items-center">
          <BarChart3 className="mr-2 text-blue-600" size={20} /> Ringkasan
        </h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-white border border-slate-200 text-xs font-bold text-blue-600 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
        >
          <option value="Hari Ini">Hari Ini</option>
          <option value="Bulan Ini">Bulan Ini</option>
          <option value="Tahun Ini">Tahun Ini</option>
          <option value="Semua Waktu">Semua Waktu</option>
        </select>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
        <Wallet className="absolute right-[-20px] top-[-10px] w-32 h-32 text-white/5" />
        <p className="text-slate-300 text-sm font-medium mb-1">
          Total Pendapatan (Lunas)
        </p>
        <h3 className="text-3xl font-bold">{formatRp(totalPendapatan)}</h3>
        <p className="text-xs text-slate-400 mt-3 flex items-center">
          <Calendar size={12} className="mr-1" /> {renderPeriodLabel()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Mobil Selesai"
          value={lunasOrders.length}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          title="Sedang Aktif"
          value={pendingOrders.length}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          title="Mobil Batal"
          value={batalOrders.length}
          color="text-red-600"
          bg="bg-red-50"
        />
        <StatCard
          title="Total Transaksi"
          value={filteredOrders.length}
          color="text-slate-700"
          bg="bg-slate-100"
        />
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-3 text-sm">
          Metode Pembayaran (Lunas)
        </h3>
        <div className="space-y-3">
          <MetodeBar
            label="Transfer / QRIS"
            count={
              lunasOrders.filter((o) => o.paymentMethod === 'Transfer / QRIS')
                .length
            }
            total={lunasOrders.length}
          />
        </div>
      </div>
    </div>
  );
}

function UserAvatar() {
  return (
    <img
      src="https://images.unsplash.com/photo-1777139472343-a07c690a8e4e?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Logo Profil"
      className="w-12 h-12 rounded-full object-cover bg-white shadow-sm"
    />
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center transition-all duration-300 ${
        isActive
          ? 'bg-[#facc15] text-[#1e3a8a] px-3.5 sm:px-4 py-2 rounded-full font-bold shadow-md'
          : 'text-white/40 hover:text-white/80 p-2 sm:p-2.5'
      }`}
    >
      {React.cloneElement(icon, { size: 20, strokeWidth: isActive ? 2.5 : 2 })}
      {isActive && <span className="ml-1.5 text-xs sm:text-sm">{label}</span>}
    </button>
  );
}

function StatCard({ title, value, color, bg }) {
  return (
    <div className={`p-4 rounded-xl border border-slate-100 ${bg}`}>
      <p className="text-xs text-slate-500 font-medium mb-1">{title}</p>
      <h4 className={`text-2xl font-bold ${color}`}>{value}</h4>
    </div>
  );
}

function MetodeBar({ label, count, total }) {
  const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-slate-800">
          {count} trx ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
