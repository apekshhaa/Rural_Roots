import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './KrishiSightDashboard.css';

Chart.register(...registerables);

const DATA = {
    tomato: {
        name: "Tomato",
        chartColor: "#e05a2b",
        currentPrice: 2340,
        prevPrice: 2180,
        minPrice: 1800,
        maxPrice: 3100,
        volatility: 72,
        arimaAcc: "83%",
        mandis: [
            { name: "Mangaluru APMC", dist: "0 km", price: 2340, change: +4.2 },
            { name: "Udupi Mandi", dist: "58 km", price: 2290, change: +2.8 },
            { name: "Hassan Mandi", dist: "180 km", price: 2180, change: -1.2 },
            { name: "Bangalore APMC", dist: "352 km", price: 2460, change: +6.1 },
            { name: "Mysuru Mandi", dist: "240 km", price: 2310, change: +3.5 },
        ],
        warehouses: [
            { name: "NWRH Mangaluru", cap: 48, status: "available" },
            { name: "KMF Cold Store", cap: 82, status: "limited" },
        ],
        history: [1820, 1950, 2100, 2050, 1980, 2120, 2200, 2080, 2150, 2340, 2290, 2260],
        forecast: [2380, 2420, 2510, 2480, 2550, 2600],
        ciHigh: [2480, 2550, 2700, 2710, 2820, 2900],
        ciLow: [2280, 2290, 2320, 2250, 2280, 2300],
        seasonal: [
            { m: "Nov", curr: 80, prev: 65 },
            { m: "Dec", curr: 88, prev: 72 },
            { m: "Jan", curr: 100, prev: 84 },
            { m: "Feb", curr: 95, prev: 91 },
            { m: "Mar", curr: 78, prev: 88 },
            { m: "Apr", curr: 60, prev: 70 },
        ],
        heatmap: [
            { city: "Bangalore", level: "high" },
            { city: "Chennai", level: "high" },
            { city: "Mumbai", level: "medium" },
            { city: "Mysuru", level: "low" },
        ],
        bestWindow: "Mar 15 – Apr 10",
        bestWindowSub: "Demand expected to increase in nearby cities.",
        aiInsight: "Tomato arrivals in Kolar belt are <strong>down 18%</strong> vs last month. ARIMA predicts a peak of <strong>₹2,550/Qtl in March</strong>. Hold 30–40% stock for 3 more weeks to maximise profit.",
    },
    onion: {
        name: "Onion",
        chartColor: "#9b4a8e",
        currentPrice: 1870,
        prevPrice: 2100,
        minPrice: 1200,
        maxPrice: 2800,
        volatility: 88,
        arimaAcc: "79%",
        mandis: [
            { name: "Mangaluru APMC", dist: "0 km", price: 1870, change: -5.3 },
            { name: "Lasalgaon APMC", dist: "802 km", price: 1650, change: -8.1 },
            { name: "Pimpalgaon", dist: "780 km", price: 1720, change: -6.4 },
            { name: "Solapur Mandi", dist: "710 km", price: 1810, change: -4.2 },
            { name: "Bangalore APMC", dist: "352 km", price: 1940, change: -3.1 },
        ],
        warehouses: [
            { name: "Agri Ware Store", cap: 35, status: "available" },
            { name: "NAFED Hub", cap: 91, status: "full" },
        ],
        history: [2480, 2300, 2100, 2050, 1980, 1870, 1820, 1750, 1820, 1870, 1850, 1870],
        forecast: [1820, 1780, 1820, 1900, 2050, 2200],
        ciHigh: [1960, 1960, 2020, 2100, 2250, 2450],
        ciLow: [1680, 1600, 1620, 1700, 1850, 1950],
        seasonal: [
            { m: "Nov", curr: 95, prev: 88 },
            { m: "Dec", curr: 88, prev: 92 },
            { m: "Jan", curr: 78, prev: 80 },
            { m: "Feb", curr: 66, prev: 74 },
            { m: "Mar", curr: 60, prev: 65 },
            { m: "Apr", curr: 65, prev: 60 },
        ],
        heatmap: [
            { city: "Delhi", level: "high" },
            { city: "Mumbai", level: "high" },
            { city: "Kolkata", level: "medium" },
            { city: "Bangalore", level: "low" },
        ],
        bestWindow: "Apr 20 – May 15",
        bestWindowSub: "Post-harvest dip to reverse after April.",
        aiInsight: "Onion arrivals surged <strong>+24% this week</strong> due to early Rabi harvest. Prices likely stay low until <strong>mid-March</strong>. Store if cold chain available — model signals <strong>recovery to ₹2,050+ by April</strong>.",
    },
    potato: {
        name: "Potato",
        chartColor: "#c49a3c",
        currentPrice: 1540,
        prevPrice: 1490,
        minPrice: 1100,
        maxPrice: 2000,
        volatility: 55,
        arimaAcc: "85%",
        mandis: [
            { name: "Mangaluru APMC", dist: "0 km", price: 1540, change: +3.3 },
            { name: "Udupi Mandi", dist: "58 km", price: 1510, change: +1.8 },
            { name: "Agra Mandi", dist: "1820 km", price: 1380, change: -0.9 },
            { name: "Pune APMC", dist: "810 km", price: 1600, change: +2.4 },
            { name: "Mysuru Mandi", dist: "240 km", price: 1560, change: +1.1 },
        ],
        warehouses: [
            { name: "NWRH Mangaluru", cap: 62, status: "limited" },
            { name: "FCI Cold Store", cap: 44, status: "available" },
        ],
        history: [1200, 1250, 1310, 1350, 1390, 1420, 1460, 1490, 1510, 1540, 1520, 1540],
        forecast: [1560, 1590, 1640, 1680, 1720, 1750],
        ciHigh: [1650, 1700, 1760, 1800, 1840, 1880],
        ciLow: [1470, 1480, 1520, 1560, 1600, 1620],
        seasonal: [
            { m: "Nov", curr: 72, prev: 68 },
            { m: "Dec", curr: 80, prev: 74 },
            { m: "Jan", curr: 88, prev: 82 },
            { m: "Feb", curr: 100, prev: 90 },
            { m: "Mar", curr: 95, prev: 96 },
            { m: "Apr", curr: 80, prev: 84 },
        ],
        heatmap: [
            { city: "Bangalore", level: "high" },
            { city: "Chennai", level: "medium" },
            { city: "Mumbai", level: "high" },
            { city: "Mysuru", level: "low" },
        ],
        bestWindow: "Feb 10 – Mar 5",
        bestWindowSub: "Cold-season demand peak from urban markets.",
        aiInsight: "Potato demand is rising steadily with <strong>February peak expected</strong>. Forecast accuracy is 85%. Sell in smaller lots across <strong>Feb 10 – Mar 5</strong> to capture the best average price.",
    },
    rice: {
        name: "Rice (Sona Masoori)",
        chartColor: "#4a9b68",
        currentPrice: 3420,
        prevPrice: 3380,
        minPrice: 3100,
        maxPrice: 3800,
        volatility: 28,
        arimaAcc: "92%",
        mandis: [
            { name: "Mangaluru APMC", dist: "0 km", price: 3420, change: +1.2 },
            { name: "Udupi Mandi", dist: "58 km", price: 3390, change: +0.8 },
            { name: "Davangere", dist: "265 km", price: 3460, change: +2.1 },
            { name: "Raichur APMC", dist: "440 km", price: 3380, change: +0.4 },
            { name: "Kurnool APMC", dist: "560 km", price: 3500, change: +3.6 },
        ],
        warehouses: [
            { name: "FCI Godown", cap: 58, status: "limited" },
            { name: "NAFED Hub", cap: 32, status: "available" },
        ],
        history: [3180, 3200, 3240, 3280, 3310, 3350, 3380, 3400, 3390, 3410, 3420, 3420],
        forecast: [3440, 3470, 3510, 3540, 3560, 3580],
        ciHigh: [3500, 3540, 3590, 3630, 3660, 3690],
        ciLow: [3380, 3400, 3430, 3450, 3460, 3470],
        seasonal: [
            { m: "Nov", curr: 88, prev: 82 },
            { m: "Dec", curr: 90, prev: 86 },
            { m: "Jan", curr: 93, prev: 88 },
            { m: "Feb", curr: 95, prev: 90 },
            { m: "Mar", curr: 100, prev: 94 },
            { m: "Apr", curr: 98, prev: 96 },
        ],
        heatmap: [
            { city: "Hyderabad", level: "high" },
            { city: "Chennai", level: "high" },
            { city: "Bangalore", level: "medium" },
            { city: "Mumbai", level: "low" },
        ],
        bestWindow: "Mar 1 – Mar 31",
        bestWindowSub: "Premium export demand window from Gulf markets.",
        aiInsight: "Sona Masoori shows <strong>steady bullish momentum</strong> with low volatility — ideal for gradual selling. Gulf export demand is <strong>30% above seasonal average</strong>. Sell 50% now, hold rest for March peak.",
    },
    wheat: {
        name: "Wheat",
        chartColor: "#d4a017",
        currentPrice: 2310,
        prevPrice: 2280,
        minPrice: 2100,
        maxPrice: 2600,
        volatility: 35,
        arimaAcc: "88%",
        mandis: [
            { name: "Mangaluru APMC", dist: "0 km", price: 2310, change: +1.3 },
            { name: "Hubli APMC", dist: "310 km", price: 2280, change: +0.5 },
            { name: "Dharwad Mandi", dist: "320 km", price: 2260, change: -0.6 },
            { name: "Pune APMC", dist: "810 km", price: 2350, change: +2.0 },
            { name: "Delhi Mandi", dist: "1900 km", price: 2400, change: +2.7 },
        ],
        warehouses: [
            { name: "FCI Godown", cap: 70, status: "limited" },
            { name: "NWRH Mangaluru", cap: 40, status: "available" },
        ],
        history: [2100, 2130, 2160, 2190, 2220, 2240, 2260, 2280, 2290, 2300, 2305, 2310],
        forecast: [2320, 2340, 2370, 2400, 2430, 2460],
        ciHigh: [2400, 2430, 2470, 2510, 2550, 2590],
        ciLow: [2240, 2250, 2270, 2290, 2310, 2330],
        seasonal: [
            { m: "Nov", curr: 82, prev: 78 },
            { m: "Dec", curr: 85, prev: 80 },
            { m: "Jan", curr: 88, prev: 84 },
            { m: "Feb", curr: 93, prev: 88 },
            { m: "Mar", curr: 100, prev: 94 },
            { m: "Apr", curr: 96, prev: 92 },
        ],
        heatmap: [
            { city: "Delhi", level: "high" },
            { city: "Mumbai", level: "high" },
            { city: "Bangalore", level: "medium" },
            { city: "Chennai", level: "low" },
        ],
        bestWindow: "Mar 5 – Apr 5",
        bestWindowSub: "Pre-Rabi procurement drives demand up.",
        aiInsight: "Wheat prices are <strong>slowly rising</strong> ahead of government procurement season. Low volatility makes this a safe crop. ARIMA forecasts <strong>₹2,460 by July</strong>. Sell 60% before Apr 5.",
    },
    cotton: {
        name: "Cotton",
        chartColor: "#5e8fa1",
        currentPrice: 6450,
        prevPrice: 6200,
        minPrice: 5800,
        maxPrice: 7200,
        volatility: 60,
        arimaAcc: "81%",
        mandis: [
            { name: "Mangaluru APMC", dist: "0 km", price: 6450, change: +4.0 },
            { name: "Akola APMC", dist: "610 km", price: 6380, change: +3.2 },
            { name: "Amravati", dist: "640 km", price: 6320, change: +1.9 },
            { name: "Yavatmal", dist: "680 km", price: 6410, change: +3.5 },
            { name: "Pune APMC", dist: "810 km", price: 6500, change: +4.8 },
        ],
        warehouses: [
            { name: "CCI Warehouse", cap: 55, status: "limited" },
            { name: "NWRH Mangaluru", cap: 30, status: "available" },
        ],
        history: [5900, 5980, 6050, 6100, 6150, 6200, 6250, 6300, 6350, 6400, 6430, 6450],
        forecast: [6500, 6560, 6630, 6700, 6780, 6850],
        ciHigh: [6680, 6760, 6850, 6950, 7050, 7150],
        ciLow: [6320, 6360, 6410, 6450, 6510, 6550],
        seasonal: [
            { m: "Nov", curr: 85, prev: 78 },
            { m: "Dec", curr: 90, prev: 84 },
            { m: "Jan", curr: 95, prev: 88 },
            { m: "Feb", curr: 100, prev: 93 },
            { m: "Mar", curr: 98, prev: 96 },
            { m: "Apr", curr: 92, prev: 90 },
        ],
        heatmap: [
            { city: "Mumbai", level: "high" },
            { city: "Ahmedabad", level: "high" },
            { city: "Bangalore", level: "medium" },
            { city: "Chennai", level: "medium" },
        ],
        bestWindow: "Feb 20 – Mar 20",
        bestWindowSub: "Textile mills ramp up buying before summer.",
        aiInsight: "Cotton prices have <strong>risen 4% this week</strong> driven by strong textile demand. ARIMA model forecasts <strong>₹6,850 by June</strong>. Medium volatility — sell in 2–3 lots between Feb 20 and Mar 20.",
    },
};

const ALL_LABELS = [
    "Aug", "Sep", "Oct", "Nov", "Dec", "Jan",
    "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"
];

const fmt = (n: number | string) => "₹" + Number(n).toLocaleString("en-IN");
const fmtChange = (c: number) => (c >= 0 ? "+" : "") + c.toFixed(1) + "%";
const arrow = (c: number) => (c >= 0 ? "▲ " : "▼ ");

export function KrishiSightDashboard() {
    const [selectedCrop, setSelectedCrop] = useState<keyof typeof DATA>('tomato');
    const [clock, setClock] = useState('');
    const [localData, setLocalData] = useState(DATA);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    const d = localData[selectedCrop];

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setClock(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setLocalData(prev => {
                const newData = { ...prev };
                const crop = newData[selectedCrop];
                const i = Math.floor(Math.random() * crop.mandis.length);
                const delta = (Math.random() - 0.45) * 45;
                crop.mandis[i] = {
                    ...crop.mandis[i],
                    price: Math.max(500, Math.round(crop.mandis[i].price + delta)),
                    change: parseFloat((crop.mandis[i].change + (Math.random() - 0.5)).toFixed(1)),
                    //@ts-ignore
                    updated: true
                };
                setTimeout(() => {
                    setLocalData(curr => {
                        const resetData = { ...curr };
                        //@ts-ignore
                        resetData[selectedCrop].mandis[i].updated = false;
                        return resetData;
                    });
                }, 1700);
                return newData;
            });
        }, 3500);
        return () => clearInterval(interval);
    }, [selectedCrop]);

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;
        const histLen = d.history.length;
        const fcastLen = d.forecast.length;
        const totalLen = histLen + fcastLen;

        const histData = [...d.history, ...Array(fcastLen).fill(null)];
        const fcastData = [...Array(histLen - 1).fill(null), d.history[histLen - 1], ...d.forecast];
        const ciHighData = [...Array(histLen - 1).fill(null), d.history[histLen - 1], ...d.ciHigh];
        const ciLowData = [...Array(histLen - 1).fill(null), d.history[histLen - 1], ...d.ciLow];
        const labels = ALL_LABELS.slice(0, totalLen);

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const config = {
            type: 'line' as const,
            data: {
                labels,
                datasets: [
                    {
                        label: 'CI High',
                        data: ciHighData,
                        borderColor: 'transparent',
                        backgroundColor: 'rgba(106,79,191,0.12)',
                        fill: '+1',
                        tension: 0.35,
                        pointRadius: 0,
                    },
                    {
                        label: 'CI Low',
                        data: ciLowData,
                        borderColor: 'rgba(106,79,191,0.3)',
                        borderWidth: 1,
                        borderDash: [4, 3],
                        backgroundColor: 'transparent',
                        fill: false,
                        tension: 0.35,
                        pointRadius: 0,
                    },
                    {
                        label: 'Forecast (ARIMA)',
                        data: fcastData,
                        borderColor: '#6a4fbf',
                        borderWidth: 2.5,
                        borderDash: [7, 4],
                        backgroundColor: 'transparent',
                        pointRadius: 4,
                        pointStyle: 'triangle',
                        pointBackgroundColor: '#6a4fbf',
                        tension: 0.35,
                    },
                    {
                        label: 'Historical Price',
                        data: histData,
                        borderColor: d.chartColor,
                        borderWidth: 2.5,
                        backgroundColor: 'transparent',
                        pointRadius: 4,
                        pointBackgroundColor: d.chartColor,
                        tension: 0.35,
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index' as const, intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e5631',
                        titleColor: '#b7e4c7',
                        bodyColor: '#ffffff',
                        borderColor: '#52b788',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: (tooltipCtx: any) => tooltipCtx.raw ? ` ${tooltipCtx.dataset.label}: ${fmt(tooltipCtx.raw as number)}/Qtl` : undefined
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(180,210,190,0.35)' },
                        ticks: { color: '#7a9485', font: { size: 11, weight: 'bold' } },
                        border: { color: '#cde8d4' },
                    },
                    y: {
                        grid: { color: 'rgba(180,210,190,0.35)' },
                        ticks: {
                            color: '#7a9485',
                            font: { size: 11, weight: 'bold' },
                            callback: (v: any) => fmt(v as number),
                        },
                        border: { color: '#cde8d4' },
                    }
                }
            }
        };

        chartInstance.current = new Chart(ctx, config);

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [selectedCrop, d]);

    return (
        <div className="krishisight-dashboard">
            <header className="ks-header">
                <div className="ks-header-logo">
                    <div className="icon">🌾</div>
                    Krishi<span>Sight</span>
                </div>
                <div className="ks-header-right">
                    <div className="ks-live-badge">
                        <div className="ks-live-dot"></div>
                        LIVE DATA
                    </div>
                    <div className="ks-header-clock">{clock}</div>
                </div>
            </header>

            <div className="ks-app-grid">
                <aside className="ks-sidebar-left">
                    <div className="ks-crop-select-wrap ks-fade-up ks-d1">
                        <div className="ks-section-label">📌 Select Crop</div>
                        <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value as keyof typeof DATA)}>
                            <option value="tomato">🍅 Tomato</option>
                            <option value="onion">🧅 Onion</option>
                            <option value="potato">🥔 Potato</option>
                            <option value="rice">🌾 Rice (Sona Masoori)</option>
                            <option value="wheat">🌿 Wheat</option>
                            <option value="cotton">🌱 Cotton</option>
                        </select>
                    </div>

                    <div className="ks-fade-up ks-d2">
                        <div className="ks-section-label">🏪 Live Mandi Prices (₹/Qtl)</div>
                        <div className="ks-mandi-list">
                            {d.mandis.map((m, i) => (
                                <div key={m.name} className={`ks-mandi-item ${//@ts-ignore
                                    m.updated ? 'ks-updated' : ''}`} style={{ animationDelay: `${i * 0.07}s` }}>
                                    <div className="ks-mandi-left">
                                        <div className="ks-mandi-name">{m.name}</div>
                                        <div className="ks-mandi-dist">📍 {m.dist}</div>
                                    </div>
                                    <div className="ks-mandi-right">
                                        <div className="ks-mandi-price">{fmt(m.price)}</div>
                                        <div className={`ks-mandi-change ${m.change >= 0 ? 'ks-up' : 'ks-down'}`}>
                                            {arrow(m.change)}{fmtChange(m.change)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="ks-fade-up ks-d3">
                        <div className="ks-section-label">🏭 Warehouse Availability</div>
                        <div className="ks-warehouse-list">
                            {d.warehouses.map((w: any) => (
                                <div key={w.name} className="ks-wh-card">
                                    <div className="ks-wh-row1">
                                        <div className="ks-wh-name">🏭 {w.name}</div>
                                        <div className={`ks-wh-badge ks-${w.status}`}>{w.status.toUpperCase()}</div>
                                    </div>
                                    <div className="ks-wh-bar-bg">
                                        <div className={`ks-wh-bar-fill ks-${w.cap < 60 ? 'green' : w.cap < 80 ? 'orange' : 'red'}`} style={{ width: `${w.cap}%` }}></div>
                                    </div>
                                    <div className="ks-wh-cap-row">
                                        <span>Capacity used</span>
                                        <span>{w.cap}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="ks-main-col">
                    <div className="ks-selling-window ks-fade-up ks-d2">
                        <div className="ks-sw-icon">🎯</div>
                        <div className="ks-sw-text">
                            <h3>Best Selling Window</h3>
                            <p>{d.bestWindowSub}</p>
                        </div>
                        <div className="ks-sw-right">
                            <div className="ks-sw-label">OPTIMAL WINDOW</div>
                            <div className="ks-sw-dates">{d.bestWindow}</div>
                            <div className="ks-sw-sub">AI-powered prediction</div>
                        </div>
                    </div>

                    <div className="ks-chart-card ks-fade-up ks-d3">
                        <div className="ks-chart-header">
                            <div>
                                <div className="ks-card-title">{d.name} · Price Trend & Forecast</div>
                                <div className="ks-card-sub">Historical prices · ARIMA forecast · 95% confidence band</div>
                            </div>
                            <div className="ks-chart-legend">
                                <div className="ks-legend-item">
                                    <div className="ks-legend-dot" style={{ background: 'var(--ks-green-light)' }}></div>
                                    Historical
                                </div>
                                <div className="ks-legend-item">
                                    <div className="ks-legend-dot" style={{ background: 'var(--ks-forecast)' }}></div>
                                    Forecast
                                </div>
                                <div className="ks-legend-item">
                                    <div className="ks-legend-rect" style={{ background: 'rgba(106,79,191,0.18)', border: '1px dashed var(--ks-forecast)' }}></div>
                                    CI Band (95%)
                                </div>
                            </div>
                        </div>
                        <div className="ks-chart-body" style={{ height: '300px', position: 'relative' }}>
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </div>

                    <div className="ks-season-card ks-fade-up ks-d4">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                            <div className="ks-card-title">Seasonal Price Comparison</div>
                            <div className="ks-season-legend">
                                <div className="ks-season-legend-item">
                                    <div className="ks-sl-dot" style={{ background: 'var(--ks-green-light)' }}></div>
                                    2025–26
                                </div>
                                <div className="ks-season-legend-item">
                                    <div className="ks-sl-dot" style={{ background: 'var(--ks-green-pale)' }}></div>
                                    2024–25
                                </div>
                            </div>
                        </div>
                        <div className="ks-season-bars">
                            {d.seasonal.map((s: any) => (
                                <div key={s.m} className="ks-season-row">
                                    <div className="ks-season-month">{s.m}</div>
                                    <div className="ks-season-tracks">
                                        <div className="ks-season-track-bg">
                                            <div className="ks-season-track-fill ks-fill-current" style={{ width: `${s.curr}%` }}></div>
                                        </div>
                                        <div className="ks-season-track-bg">
                                            <div className="ks-season-track-fill ks-fill-prev" style={{ width: `${s.prev}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="ks-season-val">{s.curr}%</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                <aside className="ks-sidebar-right">
                    <div className="ks-fade-up ks-d2">
                        <div className="ks-section-label">🗺️ Demand — Nearby Markets</div>
                        <div className="ks-heatmap-grid">
                            {d.heatmap.map((h: any) => (
                                <div key={h.city} className={`ks-hm-cell ks-hm-${h.level}`}>
                                    <div className="ks-hm-city">{h.city}</div>
                                    <div className="ks-hm-level">{h.level.charAt(0).toUpperCase() + h.level.slice(1)}</div>
                                </div>
                            ))}
                        </div>
                        <div className="ks-hm-scale">
                            <span>Low</span>
                            <div className="ks-hm-bar"></div>
                            <span>High</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
