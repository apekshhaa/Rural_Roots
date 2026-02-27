import { useState, useEffect, useMemo } from 'react';
import './FarmerPortal.css';

// ── TYPES ─────────────────────────────────────────────────────
interface Lot {
    id: number;
    crop: string;
    qty: number;
    pricePerKg: number;
    status: 'free' | 'collateral' | 'sold';
    owner: 'farmer' | 'customer';
    depositedOn: string;
    soldBy: string | null;
}

interface Loan {
    id: number;
    lotIds: number[];
    originalLotIds: number[];
    amount: number;
    duration: number;
    rate: number;
    interest: number;
    repaymentTotal: number;
    status: 'pending' | 'approved' | 'rejected' | 'repaid';
    date: string;
    approvedAt?: string;
    repaidAt?: string;
    amountPaid: number;
    repayments: { date: string; lotId: number; amount: number; net: number }[];
}

interface Transaction {
    date: string;
    type: 'credit' | 'debit';
    desc: string;
    amount: number;
    note?: string;
}

interface FarmerPortalProps {
    onBack: () => void;
}

// ── UTILITIES ─────────────────────────────────────────────────
const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');
const today = () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function FarmerPortal({ onBack }: FarmerPortalProps) {
    // ── STATE ─────────────────────────────────────────────────────
    const [wallet, setWallet] = useState(50000);
    const [totalEarned, setTotalEarned] = useState(0);
    const [totalRepaid, setTotalRepaid] = useState(0);
    const [lots, setLots] = useState<Lot[]>([]);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [lotCounter, setLotCounter] = useState(1);
    const [loanCounter, setLoanCounter] = useState(1);

    const [activePanel, setActivePanel] = useState('dashboard');
    const [filter, setFilter] = useState('all');

    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isLotModalOpen, setIsLotModalOpen] = useState(false);
    const [selectedLotId, setSelectedLotId] = useState<number | null>(null);

    const [loanDraft, setLoanDraft] = useState<{
        lotIds: number[];
        amount: number;
        duration: number;
        rate: number;
        _max: number;
        _mkt: number;
        _int: number;
        _total: number;
    }>({
        lotIds: [],
        amount: 0,
        duration: 6,
        rate: 8,
        _max: 0,
        _mkt: 0,
        _int: 0,
        _total: 0
    });

    const [depositForm, setDepositForm] = useState({
        crop: 'Wheat',
        qty: 0,
        lotSize: 0,
        price: 0
    });

    // ── SEEDING ───────────────────────────────────────────────────
    useEffect(() => {
        const seedLots: Lot[] = [
            {
                id: 1,
                crop: 'Wheat',
                qty: 40,
                pricePerKg: 24,
                status: 'free',
                owner: 'farmer',
                depositedOn: today(),
                soldBy: null
            },
            {
                id: 2,
                crop: 'Rice',
                qty: 30,
                pricePerKg: 38,
                status: 'free',
                owner: 'farmer',
                depositedOn: today(),
                soldBy: null
            },
            {
                id: 3,
                crop: 'Maize',
                qty: 30,
                pricePerKg: 18,
                status: 'free',
                owner: 'farmer',
                depositedOn: today(),
                soldBy: null
            }
        ];
        setLots(seedLots);
        setLotCounter(4);
    }, []);

    // ── TOAST ─────────────────────────────────────────────────────
    const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);
    const toast = (msg: string, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };

    // ── CALCULATIONS ──────────────────────────────────────────────
    const activeLoans = useMemo(() => loans.filter(l => l.status === 'approved'), [loans]);
    const totalOutstanding = useMemo(() => activeLoans.reduce((s, l) => s + (l.repaymentTotal - (l.amountPaid || 0)), 0), [activeLoans]);
    const farmerLots = useMemo(() => lots.filter(l => l.owner === 'farmer' || l.soldBy === 'farmer'), [lots]);

    const filteredLots = useMemo(() => {
        const farmerOnly = lots.filter(l => l.owner === 'farmer' || l.soldBy === 'farmer');
        if (filter === 'all') return farmerOnly;
        if (filter === 'sold') return farmerOnly.filter(l => l.status === 'sold');
        return farmerOnly.filter(l => l.status === filter && l.owner === 'farmer');
    }, [lots, filter]);

    // ── ACTIONS ───────────────────────────────────────────────────
    const depositCrops = () => {
        const { crop, qty, lotSize, price } = depositForm;
        if (!qty || !lotSize || !price) {
            toast('Please fill all fields.', 'warn');
            return;
        }
        let rem = qty;
        const added: Lot[] = [];
        let currentLotCounter = lotCounter;
        while (rem > 0) {
            const sz = Math.min(rem, lotSize);
            added.push({
                id: currentLotCounter++,
                crop,
                qty: sz,
                pricePerKg: price,
                status: 'free',
                owner: 'farmer',
                depositedOn: today(),
                soldBy: null
            });
            rem -= sz;
        }
        setLots([...lots, ...added]);
        setLotCounter(currentLotCounter);
        setIsDepositModalOpen(false);
        setDepositForm({ crop: 'Wheat', qty: 0, lotSize: 0, price: 0 });
        toast(`🌾 ${added.length} lot(s) of ${crop} deposited! Receipts generated.`, 'success');
    };

    const toggleLoanLot = (id: number) => {
        setLoanDraft(prev => {
            const exists = prev.lotIds.includes(id);
            const newIds = exists ? prev.lotIds.filter(lid => lid !== id) : [...prev.lotIds, id];

            const selLots = lots.filter(l => newIds.includes(l.id));
            const mkt = selLots.reduce((s, l) => s + (l.qty * l.pricePerKg), 0);
            const max = Math.round(mkt * 0.7);

            return { ...prev, lotIds: newIds, _max: max, _mkt: mkt, amount: max };
        });
    };

    const updateLoanPreview = (amt: number, dur: number, rate: number) => {
        const int = Math.round(amt * (rate / 100) * (dur / 12));
        const total = amt + int;
        setLoanDraft(prev => ({ ...prev, amount: amt, duration: dur, rate, _int: int, _total: total }));
    };

    const submitLoan = () => {
        const newLoan: Loan = {
            id: loanCounter,
            lotIds: [...loanDraft.lotIds],
            originalLotIds: [...loanDraft.lotIds],
            amount: loanDraft.amount,
            duration: loanDraft.duration,
            rate: loanDraft.rate,
            interest: loanDraft._int,
            repaymentTotal: loanDraft._total,
            status: 'pending',
            date: today(),
            amountPaid: 0,
            repayments: []
        };

        setLoans([...loans, newLoan]);
        setLoanCounter(loanCounter + 1);

        // Lock lots
        setLots(prev => prev.map(l => loanDraft.lotIds.includes(l.id) ? { ...l, status: 'collateral' as const } : l));

        setLoanDraft({ lotIds: [], amount: 0, duration: 6, rate: 8, _max: 0, _mkt: 0, _int: 0, _total: 0 });
        toast('📬 Application submitted! Bank is reviewing...', 'info');

        // Simulate approval
        setTimeout(() => {
            setLoans(prev => prev.map(l => l.id === newLoan.id ? { ...l, status: 'approved' as const, approvedAt: today() } : l));
            setWallet(w => w + newLoan.amount);
            setTransactions(prev => [...prev, { date: today(), type: 'credit', desc: `Loan LOAN-${newLoan.id} disbursed`, amount: newLoan.amount }]);
            toast(`✅ Loan approved! ₹${fmt(newLoan.amount)} credited to your wallet.`, 'success');
        }, 2500);

        setActivePanel('my-loans');
    };

    const doCollateralSale = (loanId: number) => {
        const loan = loans.find(l => l.id === loanId);
        if (!loan || !loan.lotIds.length) return;

        const lotId = loan.lotIds[0];
        const lot = lots.find(l => l.id === lotId);
        if (!lot) return;

        const sale = lot.qty * lot.pricePerKg;
        const repay = Math.min(Math.round(loan.repaymentTotal / loan.originalLotIds.length), sale);
        const net = sale - repay;

        // Update loan
        setLoans(prev => prev.map(l => {
            if (l.id === loanId) {
                const newPaid = (l.amountPaid || 0) + repay;
                const newLotIds = l.lotIds.filter(id => id !== lotId);
                const isRepaid = newLotIds.length === 0 || newPaid >= l.repaymentTotal;
                return {
                    ...l,
                    amountPaid: newPaid,
                    lotIds: newLotIds,
                    status: isRepaid ? 'repaid' as const : l.status,
                    repaidAt: isRepaid ? today() : l.repaidAt,
                    repayments: [...l.repayments, { date: today(), lotId, amount: repay, net }]
                };
            }
            return l;
        }));

        // Update lot and wallet
        setLots(prev => prev.map(l => l.id === lotId ? { ...l, owner: 'customer' as const, status: 'sold' as const, soldBy: 'farmer' } : l));
        setWallet(w => w + net);
        setTotalEarned(e => e + sale);
        setTotalRepaid(r => r + repay);
        setTransactions(prev => [...prev, {
            date: today(), type: 'credit',
            desc: `LOT-${lotId} sold (${lot.crop}, ${lot.qty}kg)`,
            amount: net,
            note: `₹${fmt(repay)} auto-repaid to LOAN-${loanId}`
        }]);

        toast(`💰 LOT-${lotId} sold! ₹${fmt(repay)} repaid. ₹${fmt(net)} to your wallet.`, 'success');
    };

    const demoBuyFreeLot = () => {
        const freeLot = lots.find(l => l.owner === 'farmer' && l.status === 'free');
        if (!freeLot) {
            toast('No free lots available to sell.', 'warn');
            return;
        }
        const sale = freeLot.qty * freeLot.pricePerKg;
        setLots(prev => prev.map(l => l.id === freeLot.id ? { ...l, owner: 'customer' as const, status: 'sold' as const, soldBy: 'farmer' } : l));
        setWallet(w => w + sale);
        setTotalEarned(e => e + sale);
        setTransactions(prev => [...prev, { date: today(), type: 'credit', desc: `LOT-${freeLot.id} sold (${freeLot.crop}, ${freeLot.qty}kg)`, amount: sale }]);
        toast(`🛒 LOT-${freeLot.id} purchased! ₹${fmt(sale)} to your wallet.`, 'success');
    };

    // ── RENDER COMPONENTS ─────────────────────────────────────────
    const navItem = (id: string, icon: string, label: string) => (
        <button className={`nav-item ${activePanel === id ? 'active' : ''}`} onClick={() => setActivePanel(id)}>
            <span className="nav-icon">{icon}</span> {label}
            {id === 'my-loans' && loans.some(l => l.status === 'pending') && (
                <span className="nav-badge">{loans.filter(l => l.status === 'pending').length}</span>
            )}
        </button>
    );

    const lotCard = (lot: Lot, selectable = false) => {
        const isSelected = loanDraft.lotIds.includes(lot.id);
        const badgeClass = lot.status === 'free' ? 'badge-free' : lot.status === 'collateral' ? 'badge-collateral' : 'badge-sold';
        return (
            <div
                key={lot.id}
                className={`f-lot-card ${selectable ? 'selectable' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                    if (selectable) toggleLoanLot(lot.id);
                    else { setSelectedLotId(lot.id); setIsLotModalOpen(true); }
                }}
            >
                <div className="lot-receipt">LOT-{lot.id} · WR-{String(lot.id).padStart(4, '0')}</div>
                <div className="lot-crop">{lot.crop}</div>
                <div className="lot-qty">{lot.qty.toLocaleString()} kg</div>
                <div className="lot-val">₹{fmt(lot.qty * lot.pricePerKg)}</div>
                <span className={`f-badge ${badgeClass}`}>
                    <span className="badge-dot"></span>{lot.status.toUpperCase()}
                </span>
                {selectable && lot.status === 'free' && (
                    <div style={{ fontSize: '0.73rem', color: 'var(--gold2)', marginTop: '2px' }}>
                        Collateral: ₹{fmt(Math.round(lot.qty * lot.pricePerKg * 0.7))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="farmer-portal-container">
            {/* TOPBAR */}
            <div className="f-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        className="f-btn btn-sm btn-outline"
                        onClick={onBack}
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                        ← Back to Website
                    </button>
                    <div className="f-logo">Rural<span>Roots</span></div>
                </div>
                <div className="topbar-right">
                    <div className="wallet-pill">₹ {fmt(wallet)}</div>
                    <div className="farmer-info">
                        <div className="farmer-avatar">👨🌾</div>
                        <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--white)' }}>Rajan Kumar</div>
                            <div className="farmer-name-lbl">FRM-001 · Farmer Portal</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="f-layout">
                {/* SIDEBAR */}
                <div className="f-sidebar">
                    <div className="sidebar-section">
                        <div className="sidebar-label">My Farm</div>
                        {navItem('dashboard', '🌿', 'Dashboard')}
                        {navItem('lots', '📦', 'My Lots')}
                        {navItem('receipts', '📄', 'Receipts')}
                    </div>
                    <div className="sidebar-section">
                        <div className="sidebar-label">Finance</div>
                        {navItem('loan-apply', '💳', 'Apply for Loan')}
                        {navItem('my-loans', '📋', 'My Loans')}
                    </div>
                    <div className="sidebar-section">
                        <div className="sidebar-label">Account</div>
                        {navItem('wallet', '👛', 'Wallet & History')}
                    </div>
                    <div style={{ marginTop: 'auto', padding: '14px', borderTop: '1px solid var(--border)' }}>
                        <button
                            className="nav-item"
                            style={{ color: 'var(--accent)', fontWeight: 500 }}
                            onClick={onBack}
                        >
                            <span className="nav-icon">←</span> Exit Portal
                        </button>
                    </div>
                </div>

                {/* MAIN */}
                <div className="f-main">
                    {/* DASHBOARD */}
                    <div className={`f-panel ${activePanel === 'dashboard' ? 'active' : ''}`}>
                        <div className="f-page-title">Good morning, Rajan 🌾</div>
                        <div className="f-page-sub">Here is your farm portfolio overview.</div>
                        <div className="f-stats-row">
                            <div className="f-stat"><div className="f-stat-val">{lots.filter(l => l.owner === 'farmer' && l.status === 'free').length}</div><div className="f-stat-lbl">Free Lots</div></div>
                            <div className="f-stat"><div className="f-stat-val">{lots.filter(l => l.owner === 'farmer' && l.status === 'collateral').length}</div><div className="f-stat-lbl">Collateral Lots</div></div>
                            <div className="f-stat"><div className="f-stat-val">₹{fmt(wallet)}</div><div className="f-stat-lbl">Wallet Balance</div></div>
                            <div className="f-stat"><div className="f-stat-val">₹{fmt(totalOutstanding)}</div><div className="f-stat-lbl">Loan Outstanding</div></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="f-card">
                                <div className="f-card-header"><div className="f-card-title">Quick Actions</div></div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button className="f-btn btn-primary" onClick={() => setIsDepositModalOpen(true)}>🌾 Deposit New Crops</button>
                                    <button className="f-btn btn-gold" onClick={() => setActivePanel('loan-apply')}>💳 Apply for a Loan</button>
                                    <button className="f-btn btn-outline" onClick={() => setActivePanel('lots')}>📦 Manage My Lots</button>
                                </div>
                            </div>
                            <div className="f-card">
                                <div className="f-card-header"><div className="f-card-title">Loan Status</div></div>
                                {loans.length === 0 ? (
                                    <>
                                        <div style={{ color: 'var(--muted)', fontSize: '0.86rem', padding: '6px 0 12px' }}>No active loans. Use your lots to get credit.</div>
                                        <button className="f-btn btn-gold" onClick={() => setActivePanel('loan-apply')}>Apply for a Loan</button>
                                    </>
                                ) : (() => {
                                    const lastLoan = loans[loans.length - 1];
                                    const paid = lastLoan.amountPaid || 0;
                                    const pct = lastLoan.repaymentTotal > 0 ? Math.min(100, Math.round(paid / lastLoan.repaymentTotal * 100)) : 0;
                                    const colors = { pending: '#6ab0e0', approved: '#a8c89a', rejected: '#e05050', repaid: 'rgba(240,245,236,0.3)' };
                                    const statusTexts = { pending: '⏳ Awaiting Approval', approved: '✅ Active', rejected: '❌ Rejected', repaid: '🎉 Repaid' };
                                    return (
                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--muted2)', letterSpacing: '0.08em', marginBottom: '4px' }}>LOAN-{lastLoan.id}</div>
                                            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.7rem', fontWeight: 700, marginBottom: '10px' }}>₹{fmt(lastLoan.amount)}</div>
                                            <span className="f-badge" style={{ background: `${colors[lastLoan.status]}18`, color: colors[lastLoan.status], border: `1px solid ${colors[lastLoan.status]}40`, marginBottom: lastLoan.status === 'approved' ? '14px' : '0' }}>
                                                {statusTexts[lastLoan.status]}
                                            </span>
                                            {lastLoan.status === 'approved' && (
                                                <>
                                                    <div className="progress-row"><span>Repayment · ₹{fmt(paid)} paid</span><span>{pct}%</span></div>
                                                    <div className="progress-bg"><div className="progress-fill" style={{ width: `${pct}%` }}></div></div>
                                                    <div style={{ fontSize: '0.74rem', color: 'var(--muted)', marginTop: '4px' }}>₹{fmt(lastLoan.repaymentTotal - paid)} outstanding — auto-deducted on lot sales</div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="f-card">
                            <div className="f-card-header">
                                <div className="f-card-title">My Lots Overview</div>
                                <button className="f-btn btn-sm btn-outline" onClick={() => setActivePanel('lots')}>View All →</button>
                            </div>
                            {farmerLots.length === 0 ? (
                                <div className="f-empty">
                                    <div className="empty-icon">🌱</div>
                                    <div className="empty-title">No crops deposited yet</div>
                                    <p>Deposit your harvest to generate digital lots and warehouse receipts.</p>
                                    <button className="f-btn btn-primary" onClick={() => setIsDepositModalOpen(true)}>Deposit Crops</button>
                                </div>
                            ) : (
                                <div className="f-lots-grid">
                                    {farmerLots.slice(-8).reverse().map(l => lotCard(l))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MY LOTS */}
                    <div className={`f-panel ${activePanel === 'lots' ? 'active' : ''}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div className="f-page-title">My Lots</div>
                            <button className="f-btn btn-primary" onClick={() => setIsDepositModalOpen(true)}>🌾 Deposit Crops</button>
                        </div>
                        <div className="f-page-sub">All warehouse lots and their current status. Click any lot for its receipt.</div>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            {['all', 'free', 'collateral', 'sold'].map(f => (
                                <button
                                    key={f}
                                    className={`f-btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                        {filteredLots.length === 0 ? (
                            <div className="f-empty"><div className="empty-icon">📦</div><div className="empty-title">No lots found</div>
                                <p>Try a different filter, or deposit crops to generate lots.</p></div>
                        ) : (
                            <div className="f-lots-grid">{filteredLots.reverse().map(l => lotCard(l))}</div>
                        )}
                    </div>

                    {/* RECEIPTS */}
                    <div className={`f-panel ${activePanel === 'receipts' ? 'active' : ''}`}>
                        <div className="f-page-title">Digital Warehouse Receipts</div>
                        <div className="f-page-sub">Each lot carries a unique digital receipt — your immutable proof of ownership.</div>
                        {farmerLots.length === 0 ? (
                            <div className="f-empty"><div className="empty-icon">📄</div><div className="empty-title">No receipts yet</div>
                                <p>Deposit crops to generate your first digital warehouse receipts.</p>
                                <button className="f-btn btn-primary" onClick={() => setIsDepositModalOpen(true)}>Deposit Crops</button></div>
                        ) : (
                            <div id="receipts-list">
                                {farmerLots.reverse().map(lot => (
                                    <div key={lot.id} className="f-receipt-card" onClick={() => { setSelectedLotId(lot.id); setIsLotModalOpen(true); }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                            <div style={{ fontSize: '0.68rem', color: 'var(--muted2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Digital Warehouse Receipt</div>
                                            <span className={`f-badge ${lot.status === 'free' ? 'badge-free' : lot.status === 'collateral' ? 'badge-collateral' : 'badge-sold'}`}>
                                                <span className="badge-dot"></span>{lot.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="receipt-row"><span className="receipt-key">Receipt</span><span className="receipt-val">WR-{String(lot.id).padStart(4, '0')} · LOT-{lot.id}</span></div>
                                        <div className="receipt-row"><span className="receipt-key">Crop</span><span className="receipt-val">{lot.crop} · {lot.qty.toLocaleString()} kg</span></div>
                                        <div className="receipt-row"><span className="receipt-key">Value</span><span className="receipt-val">₹{fmt(lot.qty * lot.pricePerKg)}</span></div>
                                        <div className="receipt-row"><span className="receipt-key">Deposited</span><span className="receipt-val">{lot.depositedOn}</span></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* LOAN APPLY */}
                    <div className={`f-panel ${activePanel === 'loan-apply' ? 'active' : ''}`}>
                        <div className="f-page-title">Apply for a Loan</div>
                        <div className="f-page-sub">Pledge your free lots as collateral. The bank lends up to 70% of their market value.</div>

                        <div className="f-stepper">
                            <div className={`step-item ${loanDraft.lotIds.length === 0 ? 'active' : 'done'}`}><div className="step-num">1</div><div className="step-label">Select Lots</div></div>
                            <div className={`step-item ${loanDraft.lotIds.length > 0 && loanDraft.amount === 0 ? 'active' : loanDraft.amount > 0 ? 'done' : ''}`}><div className="step-num">2</div><div className="step-label">Loan Details</div></div>
                            <div className={`step-item ${loanDraft.amount > 0 ? 'active' : ''}`}><div className="step-num">3</div><div className="step-label">Review</div></div>
                        </div>

                        <div className="f-card">
                            {loanDraft.lotIds.length === 0 ? (
                                <>
                                    <div className="f-card-header"><div className="f-card-title">Step 1 — Select Lots as Collateral</div></div>
                                    <div className="f-alert alert-info">
                                        <div className="alert-icon">ℹ️</div>
                                        <div>Select <strong>Free</strong> lots to pledge. Collateral value = <strong>70% of market value</strong>. Pledged lots lock until loan is repaid.</div>
                                    </div>
                                    {lots.filter(l => l.owner === 'farmer' && l.status === 'free').length === 0 ? (
                                        <div className="f-empty"><div className="empty-icon">📦</div><div className="empty-title">No free lots</div>
                                            <p>Deposit crops first to create lots you can pledge as collateral.</p>
                                            <button className="f-btn btn-primary" onClick={() => setIsDepositModalOpen(true)}>Deposit Crops</button></div>
                                    ) : (
                                        <div className="f-lots-grid">
                                            {lots.filter(l => l.owner === 'farmer' && l.status === 'free').map(l => lotCard(l, true))}
                                        </div>
                                    )}
                                </>
                            ) : loanDraft.amount === 0 || !activePanel.includes('review') ? (
                                <>
                                    <div className="f-card-header"><div className="f-card-title">Step 2 — Loan Details</div></div>
                                    <div className="f-alert alert-success">
                                        <div className="alert-icon">✅</div>
                                        <div><strong>{loanDraft.lotIds.length}</strong> lot(s) · Max eligible loan: <strong>₹{fmt(loanDraft._max)}</strong></div>
                                    </div>
                                    <div className="f-form-row">
                                        <div className="f-form-group">
                                            <label className="form-label">Loan Amount (₹)</label>
                                            <input className="f-form-input" type="number" value={loanDraft.amount} onChange={e => updateLoanPreview(+e.target.value, loanDraft.duration, loanDraft.rate)} />
                                        </div>
                                        <div className="f-form-group">
                                            <label className="form-label">Duration</label>
                                            <select className="f-form-select" value={loanDraft.duration} onChange={e => updateLoanPreview(loanDraft.amount, +e.target.value, loanDraft.rate)}>
                                                <option value="3">3 months</option><option value="6">6 months</option><option value="12">12 months</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="f-btn btn-outline" onClick={() => setLoanDraft({ ...loanDraft, lotIds: [] })}>← Back</button>
                                        <button className="f-btn btn-primary" onClick={() => setActivePanel('loan-apply-review')}>Next: Review →</button>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        {activePanel === 'loan-apply-review' && (
                            <div className="f-card">
                                <div className="f-card-header"><div className="f-card-title">Step 3 — Review & Submit</div></div>
                                <div className="f-alert alert-warning"><div className="alert-icon">⚠️</div><div>Pledged lots will be locked.</div></div>
                                <div className="f-divider">Loan Summary</div>
                                <div style={{ background: 'var(--bg3)', padding: '15px', borderRadius: '10px' }}>
                                    <div className="receipt-row"><span className="receipt-key">Principal</span><span className="receipt-val">₹{fmt(loanDraft.amount)}</span></div>
                                    <div className="receipt-row"><span className="receipt-key">Total Repayable</span><span className="receipt-val">₹{fmt(loanDraft._total)}</span></div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    <button className="f-btn btn-outline" onClick={() => setActivePanel('loan-apply')}>← Back</button>
                                    <button className="f-btn btn-gold" onClick={submitLoan}>✅ Submit Application</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MY LOANS */}
                    <div className={`f-panel ${activePanel === 'my-loans' ? 'active' : ''}`}>
                        <div className="f-page-title">My Loans</div>
                        <div className="f-page-sub">Track your applications, collateral, and repayments.</div>
                        {loans.length === 0 ? (
                            <div className="f-empty"><div className="empty-icon">💳</div><div className="empty-title">No loans yet</div>
                                <p>Pledge your lots as collateral to access credit.</p>
                                <button className="f-btn btn-gold" onClick={() => setActivePanel('loan-apply')}>Apply for a Loan</button></div>
                        ) : (
                            [...loans].reverse().map(loan => (
                                <div key={loan.id} className={`f-loan-card ${loan.status}`}>
                                    <div className="loan-top">
                                        <div><div className="loan-id-line">LOAN-{loan.id} · Applied {loan.date}</div><div className="loan-amount">₹{fmt(loan.amount)}</div></div>
                                        <span className="f-badge badge-free" style={{ padding: '6px 14px' }}>{loan.status.toUpperCase()}</span>
                                    </div>
                                    <div className="loan-meta-grid">
                                        <div className="loan-meta-cell"><div className="loan-meta-label">Duration</div><div className="loan-meta-val">{loan.duration} mos</div></div>
                                        <div className="loan-meta-cell"><div className="loan-meta-label">Rate</div><div className="loan-meta-val">{loan.rate}%</div></div>
                                        <div className="loan-meta-cell"><div className="loan-meta-label">To Repay</div><div className="loan-meta-val">₹{fmt(loan.repaymentTotal)}</div></div>
                                    </div>
                                    <div className="f-divider">Timeline</div>
                                    <div className="f-timeline">
                                        <div className="tl-item"><div className="tl-dot green">📝</div><div><div className="tl-label">Submitted</div><div className="tl-date">{loan.date}</div></div></div>
                                        {loan.approvedAt && <div className="tl-item"><div className="tl-dot green">✅</div><div><div className="tl-label">Approved</div><div className="tl-date">{loan.approvedAt}</div></div></div>}
                                        {loan.repayments.map((r, i) => (
                                            <div key={i} className="tl-item"><div className="tl-dot green">💰</div><div><div className="tl-label">Repayment: ₹{fmt(r.amount)}</div><div className="tl-date">{r.date}</div></div></div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* WALLET */}
                    <div className={`f-panel ${activePanel === 'wallet' ? 'active' : ''}`}>
                        <div className="f-page-title">Wallet & History</div>
                        <div className="f-stats-row">
                            <div className="f-stat"><div className="f-stat-val">₹{fmt(wallet)}</div><div className="f-stat-lbl">Current Balance</div></div>
                            <div className="f-stat"><div className="f-stat-val">₹{fmt(totalEarned)}</div><div className="f-stat-lbl">Total Earned</div></div>
                            <div className="f-stat"><div className="f-stat-val">₹{fmt(totalRepaid)}</div><div className="f-stat-lbl">Loan Repaid</div></div>
                        </div>
                        <div className="f-card">
                            <div className="f-card-title" style={{ marginBottom: '18px' }}>Transaction History</div>
                            {transactions.length === 0 ? <p>No transactions yet.</p> : (
                                <table className="f-table">
                                    <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Note</th></tr></thead>
                                    <tbody>
                                        {[...transactions].reverse().map((tx, i) => (
                                            <tr key={i}>
                                                <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{tx.date}</td>
                                                <td>{tx.desc}</td>
                                                <td style={{ color: tx.type === 'credit' ? 'var(--accent2)' : 'var(--red)', fontWeight: 500 }}>{tx.type === 'credit' ? '+' : '-'}₹{fmt(tx.amount)}</td>
                                                <td style={{ color: 'var(--muted)', fontSize: '0.79rem' }}>{tx.note || ''}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {isDepositModalOpen && (
                <div className="f-modal-overlay open" onClick={() => setIsDepositModalOpen(false)}>
                    <div className="f-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">🌾 Deposit Crops</div>
                        <div className="f-form-group">
                            <label className="form-label">Crop Type</label>
                            <select className="f-form-select" value={depositForm.crop} onChange={e => setDepositForm({ ...depositForm, crop: e.target.value })}>
                                <option>Wheat</option><option>Rice</option><option>Maize</option><option>Soybean</option>
                            </select>
                        </div>
                        <div className="f-form-row">
                            <div className="f-form-group">
                                <label className="form-label">Total Qty (kg)</label>
                                <input className="f-form-input" type="number" placeholder="5000" onChange={e => setDepositForm({ ...depositForm, qty: +e.target.value })} />
                            </div>
                            <div className="f-form-group">
                                <label className="form-label">Lot Size (kg)</label>
                                <input className="f-form-input" type="number" placeholder="500" onChange={e => setDepositForm({ ...depositForm, lotSize: +e.target.value })} />
                            </div>
                        </div>
                        <div className="f-form-group">
                            <label className="form-label">Price (₹/kg)</label>
                            <input className="f-form-input" type="number" placeholder="25" onChange={e => setDepositForm({ ...depositForm, price: +e.target.value })} />
                        </div>
                        <div className="modal-footer">
                            <button className="f-btn btn-outline" onClick={() => setIsDepositModalOpen(false)}>Cancel</button>
                            <button className="f-btn btn-primary" onClick={depositCrops}>Deposit</button>
                        </div>
                    </div>
                </div>
            )}

            {isLotModalOpen && selectedLotId && (() => {
                const lot = lots.find(l => l.id === selectedLotId);
                if (!lot) return null;
                return (
                    <div className="f-modal-overlay open" onClick={() => setIsLotModalOpen(false)}>
                        <div className="f-modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-title">LOT-{lot.id} · Warehouse Receipt</div>
                            <div style={{ background: 'var(--bg3)', padding: '20px', borderRadius: '12px' }}>
                                <div className="receipt-row"><span className="receipt-key">Receipt No.</span><span className="receipt-val">WR-{String(lot.id).padStart(4, '0')}</span></div>
                                <div className="receipt-row"><span className="receipt-key">Crop</span><span className="receipt-val">{lot.crop}</span></div>
                                <div className="receipt-row"><span className="receipt-key">Quantity</span><span className="receipt-val">{lot.qty} kg</span></div>
                                <div className="receipt-row"><span className="receipt-key">Status</span><span className="receipt-val">{lot.status.toUpperCase()}</span></div>
                            </div>
                            <div className="modal-footer"><button className="f-btn btn-outline" onClick={() => setIsLotModalOpen(false)}>Close</button></div>
                        </div>
                    </div>
                );
            })()}

            {/* TOASTS */}
            <div className="toast-wrap">
                {toasts.map(t => <div key={t.id} className={`f-toast ${t.type}`}>{t.msg}</div>)}
            </div>

            {/* DEMO BAR */}
            <div className="f-demo-bar">
                <span style={{ color: 'var(--accent)', fontWeight: 500 }}>🎮 Demo:</span>
                <button className="demo-btn" onClick={() => setIsDepositModalOpen(true)}>+ Deposit</button>
                <button className="demo-btn gold" onClick={() => setActivePanel('loan-apply')}>💳 Apply Loan</button>
                <button className="demo-btn blue" onClick={() => {
                    const pending = loans.find(l => l.status === 'pending');
                    if (pending) {
                        setLoans(prev => prev.map(l => l.id === pending.id ? { ...l, status: 'approved' as const, approvedAt: today() } : l));
                        setWallet(w => w + pending.amount);
                        setTransactions(prev => [...prev, { date: today(), type: 'credit', desc: `Loan LOAN-${pending.id} disbursed`, amount: pending.amount }]);
                        toast(`✅ Bank approved LOAN-${pending.id}!`, 'success');
                    } else toast('No pending loans.', 'warn');
                }}>🏦 Bank Approves</button>
                <button className="demo-btn red" onClick={() => {
                    const approvedLoan = loans.find(l => l.status === 'approved' && l.lotIds.length > 0);
                    if (approvedLoan) doCollateralSale(approvedLoan.id);
                    else demoBuyFreeLot();
                }}>🛒 Customer Buys</button>
            </div>
        </div>
    );
}
