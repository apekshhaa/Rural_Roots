import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MapPin,
    Star,
    Snowflake,
    Wheat,
    Box,
    Navigation,
    CheckCircle2,
    X,
    Send,
    MessageSquare,
    Mic,
    MicOff,
    Volume2,
    Languages,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

// --- DATA ---
const warehouses = [
    { id: 1, name: "Green Valley Cold", type: "Cold Storage", icon: <Snowflake className="h-6 w-6" />, location: "Doddaballapur", dist: 2.3, price: 450, capacity: "500 qtl", rating: 4.8, features: ["Temp Ctrl", "Insurance"], color: "bg-[#ddefdd]", image: "/images/warehouses/cold_storage.png", recommended: true, position: { lat: 12.9716, lng: 77.5946 } },
    { id: 2, name: "Kolar Grain Hub", type: "Grain Silo", icon: <Wheat className="h-6 w-6" />, location: "Kolar", dist: 5.7, price: 280, capacity: "1200 qtl", rating: 4.5, features: ["Pest Ctrl"], color: "bg-[#e8f0d8]", image: "/images/warehouses/grain_silo.png", recommended: true, position: { lat: 13.0216, lng: 77.6146 } },
    { id: 3, name: "Nandi Dry Store", type: "Dry Warehouse", icon: <Box className="h-6 w-6" />, location: "Nandi Hills", dist: 7.1, price: 320, capacity: "800 qtl", rating: 4.6, features: ["24/7 Security"], color: "bg-[#f0edd8]", image: "/images/warehouses/dry_warehouse.png", recommended: true, position: { lat: 13.0516, lng: 77.5646 } },
    { id: 4, name: "Hosakote Cold", type: "Cold Storage", icon: <Snowflake className="h-6 w-6" />, location: "Hosakote", dist: 9.4, price: 580, capacity: "300 qtl", rating: 4.7, features: ["–5°C Capable"], color: "bg-[#d8edf5]", image: "/images/warehouses/cold_storage.png", recommended: false, position: { lat: 13.0016, lng: 77.6746 } },
    { id: 5, name: "Devanahalli Hub", type: "Dry Warehouse", icon: <Box className="h-6 w-6" />, location: "Near Airport", dist: 12.2, price: 260, capacity: "2000 qtl", rating: 4.3, features: ["Loading Dock"], color: "bg-[#f5e8d8]", image: "/images/warehouses/dry_warehouse.png", recommended: false, position: { lat: 13.1216, lng: 77.6446 } },
    { id: 6, name: "Tumkur Cold Chain", type: "Cold Storage", icon: <Snowflake className="h-6 w-6" />, location: "Tumkur", dist: 18.5, price: 520, capacity: "600 qtl", rating: 4.9, features: ["Power Backup"], color: "bg-[#dde8f5]", image: "/images/warehouses/cold_storage.png", recommended: false, position: { lat: 13.1716, lng: 77.4946 } },
    { id: 7, name: "Hebbal Agri-Link", type: "Dry Warehouse", icon: <Box className="h-6 w-6" />, location: "Hebbal North", dist: 4.1, price: 310, capacity: "450 qtl", rating: 4.4, features: ["Smart Mon."], color: "bg-[#f5f5f5]", image: "/images/warehouses/dry_warehouse.png", recommended: false, position: { lat: 13.0116, lng: 77.6046 } },
    { id: 8, name: "Whitefield Cold", type: "Cold Storage", icon: <Snowflake className="h-6 w-6" />, location: "Whitefield", dist: 14.5, price: 490, capacity: "700 qtl", rating: 4.7, features: ["Prec. Cooling"], color: "bg-[#e3f2fd]", image: "/images/warehouses/cold_storage.png", recommended: false, position: { lat: 12.9516, lng: 77.7146 } },
    { id: 9, name: "Peenya Industrial", type: "Refrigerated", icon: <Snowflake className="h-6 w-6" />, location: "Peenya Industrial", dist: 8.2, price: 550, capacity: "350 qtl", rating: 4.2, features: ["Heavy Dock"], color: "bg-[#e8eaf6]", image: "/images/warehouses/cold_storage.png", recommended: false, position: { lat: 13.0316, lng: 77.5146 } },
    { id: 10, name: "Electronic City", type: "Grain Silo", icon: <Wheat className="h-6 w-6" />, location: "South Bengaluru", dist: 15.8, price: 270, capacity: "1500 qtl", rating: 4.6, features: ["Automated Venting"], color: "bg-[#fff3e0]", image: "/images/warehouses/grain_silo.png", recommended: false, position: { lat: 12.8516, lng: 77.6446 } },
    { id: 11, name: "Yelahanka Food Park", type: "Cold Storage", icon: <Snowflake className="h-6 w-6" />, location: "North Bengaluru", dist: 11.1, price: 480, capacity: "900 qtl", rating: 4.5, features: ["FSSAI Cert."], color: "bg-[#f1f8e9]", image: "/images/warehouses/cold_storage.png", recommended: false, position: { lat: 13.0816, lng: 77.5746 } },
    { id: 12, name: "Bidadi Mega Hub", type: "Dry Warehouse", icon: <Box className="h-6 w-6" />, location: "Mysuru Road", dist: 22.4, price: 240, capacity: "5000 qtl", rating: 4.1, features: ["Massive Cap."], color: "bg-[#efebe9]", image: "/images/warehouses/dry_warehouse.png", recommended: false, position: { lat: 12.8216, lng: 77.4746 } },
];

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: 12.9716,
    lng: 77.5946
};

export function WarehouseSection() {
    // --- UI & Filter States ---
    const [selectedRadius, setSelectedRadius] = useState(10);
    const [selectedType, setSelectedType] = useState('All');
    const [maxPrice, setMaxPrice] = useState(1000);
    const [userLocation, setUserLocation] = useState(center);
    const [locationLabel, setLocationLabel] = useState('Detecting...');

    // --- Booking States ---
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [currentWarehouse, setCurrentWarehouse] = useState<any>(null);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    // --- Map States ---
    const [selectedMarker, setSelectedMarker] = useState<any>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "" // User can add their API key here
    });

    // --- Chat & Ollama & Voice States ---
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCaptureActive, setIsCaptureActive] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en-US');
    const [chatHistory, setChatHistory] = useState<any[]>([
        { role: 'assistant', content: "Hello, Farmer! I'm your AI guide. Need help finding cold storage or preparing for harvest? Ask me anything!" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isOllamaConnected, setIsOllamaConnected] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const languages = [
        { code: 'en-US', label: 'English', native: 'English' },
        { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
        { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' }
    ];

    // --- Connectivity Check ---
    const checkOllamaConnection = async () => {
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            if (response.ok) {
                setIsOllamaConnected(true);
            } else {
                setIsOllamaConnected(false);
            }
        } catch (error) {
            setIsOllamaConnected(false);
        }
    };

    useEffect(() => {
        checkOllamaConnection();
        const interval = setInterval(checkOllamaConnection, 10000); // Check every 10s
        return () => clearInterval(interval);
    }, []);

    // --- Callbacks & Effects ---
    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(_map: google.maps.Map) {
        setMap(null);
    }, []);

    const filteredWarehouses = useMemo(() => {
        return warehouses.filter(w => {
            const withinRadius = w.dist <= selectedRadius;
            const typeMatch = selectedType === 'All' || w.type === selectedType;
            const priceMatch = w.price <= maxPrice;
            return withinRadius && typeMatch && priceMatch;
        });
    }, [selectedRadius, selectedType, maxPrice]);

    const detectLocation = () => {
        setLocationLabel('Detecting...');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserLocation(pos);
                setLocationLabel(`${pos.lat.toFixed(4)}° N, ${pos.lng.toFixed(4)}° E`);
                if (map) map.panTo(pos);
            }, () => {
                setLocationLabel('Bengaluru Center');
            });
        } else {
            setLocationLabel('Bengaluru Center');
        }
    };

    useEffect(() => {
        detectLocation();
    }, []);

    // --- Actions ---
    const openBooking = (w: any) => {
        setCurrentWarehouse(w);
        setBookingConfirmed(false);
        setIsBookingModalOpen(true);
    };

    const handleBooking = () => {
        setBookingConfirmed(true);
    };

    const sendMessageToOllama = async (text: string) => {
        if (!text.trim()) return;

        const newMsg = { role: 'user', content: text };
        setChatHistory(prev => [...prev, newMsg]);
        setChatInput('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3',
                    messages: [
                        { role: 'system', content: `You are "Harvest Helper," a polite agricultural assistant for the Rural Roots platform. Keep answers short, practical, and in ${languages.find(l => l.code === selectedLang)?.label}. Help users with warehouse booking, crop storage, and post-harvest tips.` },
                        ...chatHistory.filter(m => m.role !== 'system'),
                        newMsg
                    ],
                    stream: false
                }),
            });

            const data = await response.json();
            const aiMsg = { role: 'assistant', content: data.message.content };
            setChatHistory(prev => [...prev, aiMsg]);
            if (isSpeaking) speakText(aiMsg.content);
        } catch (error) {
            console.error('Ollama Error:', error);
            setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain (Ollama). Please ensure it's running locally." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleRecording = () => {
        if (isCaptureActive) {
            setIsCaptureActive(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = selectedLang;
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsCaptureActive(true);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setChatInput(transcript);
            sendMessageToOllama(transcript);
        };
        recognition.onerror = () => setIsCaptureActive(false);
        recognition.onend = () => setIsCaptureActive(false);

        recognition.start();
    };

    const speakText = (text: string) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLang;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const durationDays = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }, [checkIn, checkOut]);

    return (
        <section id="warehouse" className="py-24 bg-farm-cream overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <SectionLabel>Warehouse Booking</SectionLabel>
                    <h2 className="text-4xl md:text-5xl font-serif font-semibold text-farm-dark leading-tight">
                        Store Your Harvest, <br /> Close to Your Farm
                    </h2>
                    <p className="mt-4 text-farm-muted max-w-2xl mx-auto">
                        Find certified cold storage, dry warehouses, and grain silos within kilometers of your location. Book for any number of days.
                    </p>
                </div>

                {/* Location & Radius Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-farm-mint/20 p-6 mb-8 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-farm-muted">Your Location:</span>
                        <div className="bg-farm-mint/10 border border-farm-mint/30 rounded-full px-4 py-1.5 flex items-center gap-2">
                            <div className="w-2 h-2 bg-farm-mint rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-farm-primary">{locationLabel}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={detectLocation} className="text-farm-primary hover:text-farm-dark">
                            <Navigation className="h-4 w-4 mr-1" /> Re-detect
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        <span className="text-sm font-medium text-farm-muted">Search Radius:</span>
                        <select
                            value={selectedRadius}
                            onChange={(e) => setSelectedRadius(Number(e.target.value))}
                            className="bg-farm-mint/10 border border-farm-mint/30 rounded-lg px-3 py-1.5 text-sm font-medium text-farm-primary outline-none focus:ring-2 ring-farm-mint/50"
                        >
                            <option value={5}>5 km</option>
                            <option value={10}>10 km</option>
                            <option value={20}>20 km</option>
                            <option value={50}>50 km</option>
                        </select>
                        <span className="text-sm font-semibold text-farm-mint">
                            {filteredWarehouses.length} warehouses found
                        </span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[320px_1fr] gap-8">
                    {/* Sidebar Filters */}
                    <aside className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-farm-mint/10 h-fit">
                        <div>
                            <h3 className="text-lg font-serif font-semibold text-farm-dark mb-4 flex items-center gap-2">
                                <Search className="h-5 w-5 text-farm-primary" /> Filters
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-xs uppercase tracking-widest font-bold text-farm-muted block mb-3">Storage Type</span>
                                    <div className="flex flex-wrap gap-2">
                                        {['All', 'Cold Storage', 'Dry Warehouse', 'Grain Silo', 'Refrigerated'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedType === type
                                                    ? 'bg-farm-primary text-white'
                                                    : 'bg-farm-mint/10 text-farm-muted hover:bg-farm-mint/20'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-farm-mint/10">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs uppercase tracking-widest font-bold text-farm-muted">Max Price / Day</span>
                                        <span className="text-sm font-bold text-farm-primary">₹{maxPrice}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={100}
                                        max={1000}
                                        step={10}
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="w-full h-1.5 bg-farm-mint/20 rounded-lg appearance-none cursor-pointer accent-farm-primary"
                                    />
                                    <div className="flex justify-between mt-2 text-[10px] text-farm-muted font-bold">
                                        <span>₹100</span>
                                        <span>₹1000</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-farm-mint/10">
                                    <div className="bg-farm-mint/5 rounded-xl p-4 border border-farm-mint/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MessageSquare className="h-4 w-4 text-farm-primary" />
                                            <span className="text-xs font-bold text-farm-dark uppercase">AI Tip</span>
                                        </div>
                                        <p className="text-xs text-farm-muted leading-relaxed">
                                            Based on your crops, we suggest <strong>{filteredWarehouses.find(w => w.recommended)?.type || 'Cold Storage'}</strong>. Try {filteredWarehouses.find(w => w.recommended)?.name || 'local stores'} for the best rates.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Map + Cards */}
                    <div className="space-y-6 flex flex-col min-h-0">
                        {/* Interactive Google Map */}
                        <div className="h-[320px] bg-farm-mint/10 rounded-2xl relative overflow-hidden shadow-inner border border-farm-mint/20 flex-shrink-0">
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={userLocation}
                                    zoom={11}
                                    onLoad={onLoad}
                                    onUnmount={onUnmount}
                                    options={{
                                        disableDefaultUI: true,
                                        zoomControl: true,
                                        styles: [
                                            {
                                                "featureType": "all",
                                                "elementType": "geometry.fill",
                                                "stylers": [{ "color": "#e8f5ee" }]
                                            },
                                            {
                                                "featureType": "water",
                                                "stylers": [{ "color": "#c8e6d5" }]
                                            }
                                        ]
                                    }}
                                >
                                    <Marker
                                        position={userLocation}
                                        icon={{
                                            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                                            fillColor: "#2d5a45",
                                            fillOpacity: 1,
                                            strokeColor: "#ffffff",
                                            strokeWeight: 2,
                                            scale: 1.5,
                                            anchor: new google.maps.Point(12, 22)
                                        }}
                                    />

                                    {filteredWarehouses.map(w => (
                                        <Marker
                                            key={w.id}
                                            position={w.position}
                                            onClick={() => setSelectedMarker(w)}
                                            icon={{
                                                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
                                                fillColor: w.recommended ? "#1a3d2e" : "#5fa05a",
                                                fillOpacity: 1,
                                                strokeColor: "#ffffff",
                                                strokeWeight: 1.5,
                                                scale: 1.2
                                            }}
                                        />
                                    ))}

                                    {selectedMarker && (
                                        <InfoWindow
                                            position={selectedMarker.position}
                                            onCloseClick={() => setSelectedMarker(null)}
                                        >
                                            <div className="p-2 min-w-[150px]">
                                                <h4 className="font-bold text-sm text-farm-dark">{selectedMarker.name}</h4>
                                                <p className="text-[10px] text-farm-muted">{selectedMarker.type}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="font-bold text-farm-primary">₹{selectedMarker.price}/day</span>
                                                    <Button
                                                        size="sm"
                                                        className="h-7 text-[10px] bg-farm-primary text-white"
                                                        onClick={() => openBooking(selectedMarker)}
                                                    >
                                                        Book
                                                    </Button>
                                                </div>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </GoogleMap>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center flex-col text-center">
                                    <MapPin className="h-12 w-12 text-farm-primary mb-3 animate-pulse" />
                                    <h3 className="font-serif text-lg font-semibold text-farm-dark">Loading Maps...</h3>
                                </div>
                            )}
                        </div>

                        {/* Warehouse Grid with Scroll Constraint */}
                        <div className="grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredWarehouses.map(w => (
                                <motion.div
                                    layout
                                    key={w.id}
                                    className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl group h-fit ${w.recommended ? 'border-farm-mint shadow-md ring-1 ring-farm-mint/20' : 'border-farm-mint/10'
                                        }`}
                                >
                                    <div className="h-32 relative overflow-hidden">
                                        <img
                                            src={w.image}
                                            alt={w.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-farm-dark/20 group-hover:bg-farm-dark/10 transition-colors" />
                                        {w.recommended && (
                                            <div className="absolute top-3 left-3 bg-farm-dark text-white text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                                <Star className="h-3 w-3 text-farm-mint" /> AI PICK
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[9px] font-bold text-farm-dark">
                                            {w.dist} km
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-serif font-semibold text-farm-dark text-base leading-tight">{w.name}</h4>
                                            <div className="flex items-center gap-1 text-farm-primary">
                                                <Star className="h-3 w-3 fill-current" />
                                                <span className="text-xs font-bold">{w.rating}</span>
                                            </div>
                                        </div>

                                        <p className="text-[10px] text-farm-muted mb-3 flex items-center gap-1">
                                            <MapPin className="h-2.5 w-2.5" /> {w.location}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {w.features.map((f: string) => (
                                                <span key={f} className="text-[9px] font-semibold bg-farm-mint/10 text-farm-primary px-1.5 py-0.5 rounded">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-farm-mint/10">
                                            <div>
                                                <span className="text-lg font-bold text-farm-dark">₹{w.price}</span>
                                                <span className="text-[10px] text-farm-muted"> /day</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => openBooking(w)}
                                                className="bg-farm-primary hover:bg-farm-dark text-white rounded-lg px-4 h-9"
                                            >
                                                Book
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {isBookingModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBookingModalOpen(false)}
                            className="absolute inset-0 bg-farm-dark/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl"
                        >
                            {!bookingConfirmed ? (
                                <>
                                    <div className="bg-farm-dark p-6 text-white flex justify-between items-center">
                                        <h3 className="text-xl font-serif font-semibold">Book Store Space</h3>
                                        <button onClick={() => setIsBookingModalOpen(false)} className="hover:text-farm-mint">
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="p-8">
                                        <div className="bg-farm-mint/10 p-4 rounded-2xl flex items-center gap-4 mb-8">
                                            <div className={`p-4 rounded-xl ${currentWarehouse?.color}`}>
                                                {currentWarehouse?.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-farm-dark">{currentWarehouse?.name}</h4>
                                                <p className="text-xs text-farm-muted">{currentWarehouse?.location}</p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <p className="text-lg font-bold text-farm-primary">₹{currentWarehouse?.price}</p>
                                                <p className="text-[10px] text-farm-muted uppercase font-bold tracking-widest">per day</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-farm-muted uppercase tracking-widest">Check-in</label>
                                                <input
                                                    type="date"
                                                    value={checkIn}
                                                    onChange={(e) => setCheckIn(e.target.value)}
                                                    className="w-full bg-farm-mint/5 border border-farm-mint/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-farm-primary/50 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-farm-muted uppercase tracking-widest">Check-out</label>
                                                <input
                                                    type="date"
                                                    value={checkOut}
                                                    onChange={(e) => setCheckOut(e.target.value)}
                                                    className="w-full bg-farm-mint/5 border border-farm-mint/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-farm-primary/50 outline-none"
                                                />
                                            </div>
                                        </div>

                                        {durationDays > 0 && (
                                            <div className="bg-farm-dark/5 p-4 rounded-2xl flex justify-between items-center mb-8 border border-farm-mint/10">
                                                <div>
                                                    <p className="text-xs text-farm-muted font-bold">Duration</p>
                                                    <p className="font-serif text-xl font-bold text-farm-dark">{durationDays} Days</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-farm-muted font-bold">Total Estimated Cost</p>
                                                    <p className="text-xl font-bold text-farm-primary">₹{(durationDays * currentWarehouse?.price || 0).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-4">
                                            <Button variant="ghost" onClick={() => setIsBookingModalOpen(false)} className="flex-1 py-6 text-farm-muted hover:bg-farm-mint/10">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleBooking} className="flex-[2] py-6 bg-farm-primary hover:bg-farm-dark text-white rounded-xl font-bold">
                                                Confirm Booking
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-20 h-20 bg-farm-mint/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="h-10 w-10 text-farm-primary" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-farm-dark mb-2">Booking Confirmed!</h3>
                                    <p className="text-farm-muted mb-8">Your storage space is reserved. You'll receive a confirmation SMS with the warehouse map and contact details.</p>

                                    <div className="bg-farm-mint/10 p-4 rounded-2xl border border-farm-mint/20 font-mono text-sm font-bold text-farm-primary mb-8">
                                        REF: RR-{Math.floor(100000 + Math.random() * 900000)}
                                    </div>

                                    <Button onClick={() => setIsBookingModalOpen(false)} className="w-full py-6 bg-farm-dark hover:bg-farm-primary text-white rounded-xl font-bold">
                                        Close
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Floating Chat */}
            <div className="fixed bottom-8 left-8 z-[90]">
                <AnimatePresence>
                    {isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute bottom-20 left-0 w-[360px] h-[520px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-farm-mint/10 flex flex-col"
                        >
                            {/* Chat Header */}
                            <div className="bg-farm-dark p-4 text-white">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-farm-mint rounded-full flex items-center justify-center text-farm-dark font-bold text-xl">🌾</div>
                                        <div>
                                            <h4 className="text-sm font-bold">Harvest Helper</h4>
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isOllamaConnected ? 'bg-farm-mint animate-pulse' : 'bg-red-500'}`} />
                                                <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest">
                                                    {isOllamaConnected ? 'Ollama Online' : 'Ollama Offline'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setIsSpeaking(!isSpeaking)}
                                            className={`p-2 rounded-lg transition-colors ${isSpeaking ? 'bg-farm-mint text-farm-dark' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                            title="Toggle Text-to-Speech"
                                        >
                                            <Volume2 className="h-4 w-4" />
                                        </button>
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                                className={`p-2 rounded-lg transition-colors ${isLangMenuOpen ? 'bg-farm-mint text-farm-dark' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                                            >
                                                <Languages className="h-4 w-4" />
                                            </button>
                                            <AnimatePresence>
                                                {isLangMenuOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-farm-mint/10 p-2 z-[100] min-w-[120px]"
                                                    >
                                                        {languages.map(lang => (
                                                            <button
                                                                key={lang.code}
                                                                onClick={() => {
                                                                    setSelectedLang(lang.code);
                                                                    setIsLangMenuOpen(false);
                                                                }}
                                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold mb-1 last:mb-0 transition-colors ${selectedLang === lang.code ? 'bg-farm-mint/20 text-farm-primary' : 'text-farm-muted hover:bg-farm-mint/5'}`}
                                                            >
                                                                {lang.native}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 p-4 bg-farm-mint/5 overflow-y-auto space-y-4 custom-scrollbar relative">
                                {!isOllamaConnected && chatHistory.length <= 1 && (
                                    <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex items-center justify-center p-8 text-center">
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                                <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
                                            </div>
                                            <h4 className="font-bold text-farm-dark">Ollama Not Running</h4>
                                            <p className="text-xs text-farm-muted leading-relaxed">
                                                To chat with AI, please run Ollama locally with this command:
                                            </p>
                                            <div className="bg-farm-dark text-farm-mint p-3 rounded-xl font-mono text-[10px] select-all">
                                                $env:OLLAMA_ORIGINS="*" ; ollama serve
                                            </div>
                                            <Button
                                                onClick={checkOllamaConnection}
                                                size="sm"
                                                className="bg-farm-primary text-white"
                                            >
                                                Check Connection
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                                        {msg.role === 'assistant' && (
                                            <div className="w-6 h-6 bg-farm-mint rounded-full flex items-center justify-center text-[10px] flex-shrink-0">🌾</div>
                                        )}
                                        <div className={`p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm border max-w-[85%] ${msg.role === 'user'
                                            ? 'bg-farm-primary text-white border-farm-primary rounded-tr-none'
                                            : 'bg-white text-farm-dark border-farm-mint/10 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start gap-2">
                                        <div className="w-6 h-6 bg-farm-mint rounded-full flex items-center justify-center text-[10px] flex-shrink-0 animate-bounce">🌾</div>
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-farm-mint/10 shadow-sm">
                                            <Loader2 className="h-4 w-4 animate-spin text-farm-primary" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-farm-mint/10 bg-white">
                                <div className="flex gap-2 items-center">
                                    <div className="relative flex-1">
                                        <input
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && sendMessageToOllama(chatInput)}
                                            placeholder={selectedLang === 'en-US' ? "Ask me anything..." : selectedLang === 'hi-IN' ? "मुझसे कुछ भी पूछें..." : "ನನಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ..."}
                                            className="w-full bg-farm-mint/5 border border-farm-mint/20 rounded-2xl px-4 py-3 pr-12 text-sm outline-none focus:ring-2 ring-farm-primary/50"
                                        />
                                        <button
                                            onClick={toggleRecording}
                                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isCaptureActive ? 'bg-red-500 text-white animate-pulse' : 'text-farm-muted hover:text-farm-primary'}`}
                                        >
                                            {isCaptureActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <Button
                                        onClick={() => sendMessageToOllama(chatInput)}
                                        size="icon"
                                        className="bg-farm-primary hover:bg-farm-dark text-white rounded-2xl h-11 w-11 flex-shrink-0"
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${isChatOpen ? 'bg-farm-dark text-white' : 'bg-farm-primary text-white'
                        }`}
                >
                    {isChatOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                    {!isChatOpen && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-farm-mint text-farm-dark text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                            1
                        </span>
                    )}
                </button>
            </div>
        </section>
    );
}
