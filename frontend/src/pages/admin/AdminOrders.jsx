import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  ClipboardList, Package, CheckCircle, Clock, AlertCircle,
  Search, ChevronDown, ChevronUp, Loader2, Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const STATUS_COLORS = {
  Pending: { bg: 'rgba(255,206,30,0.1)', color: 'var(--warning)', border: 'rgba(255,206,30,0.3)' },
  'Pending Verification': { bg: 'rgba(255,152,0,0.1)', color: '#FF9800', border: 'rgba(255,152,0,0.3)' },
  Processing: { bg: 'rgba(0,176,255,0.1)', color: 'var(--info)', border: 'rgba(0,176,255,0.3)' },
  'In Transit': { bg: 'rgba(0,176,255,0.12)', color: '#29b6f6', border: 'rgba(0,176,255,0.3)' },
  Delivered: { bg: 'rgba(0,230,118,0.1)', color: 'var(--success)', border: 'rgba(0,230,118,0.3)' },
  Cancelled: { bg: 'rgba(255,61,0,0.1)', color: 'var(--danger)', border: 'rgba(255,61,0,0.3)' },
  'Payment Failed': { bg: 'rgba(255,0,0,0.1)', color: '#ff1744', border: 'rgba(255,0,0,0.3)' },
};

const STATUS_OPTIONS = ['Pending', 'Pending Verification', 'Processing', 'In Transit', 'Delivered', 'Cancelled', 'Payment Failed'];

const fmt = n => '₦' + Math.ceil(n || 0).toLocaleString('en-NG');

function OrderCard({ order }) {
  const { showToast } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const s = STATUS_COLORS[order.status] || STATUS_COLORS['Pending'];

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'orders', order.id), { status: newStatus });
      showToast(`Order status updated to ${newStatus}`);
    } catch (e) {
      showToast('Failed to update status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const date = order.createdAt?.toDate?.()?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) || '—';

  return (
    <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', transition: 'var(--transition)' }}>
      {/* Summary Row */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', flexWrap: 'wrap' }}
      >
        <div style={{ minWidth: '130px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--gray-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Order ID</div>
          <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700 }}>#{order.id?.slice(0, 12)}</div>
        </div>

        <div style={{ minWidth: '90px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--gray-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Date</div>
          <div style={{ fontSize: '13px', fontWeight: 700 }}>{date}</div>
        </div>

        <div style={{ flex: 1, minWidth: '150px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--gray-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Customer</div>
          <div style={{ fontSize: '13px', fontWeight: 700 }}>{order.customerName || order.userId || 'Guest'}</div>
          {order.customerEmail && <div style={{ fontSize: '12px', color: 'var(--gray-1)' }}>{order.customerEmail}</div>}
        </div>

        <div style={{ minWidth: '120px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--gray-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Total</div>
          <div style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>{fmt(order.total || order.totalAmount)}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            {order.status === 'Delivered' ? <CheckCircle size={12} /> : order.status === 'Cancelled' ? <AlertCircle size={12} /> : <Clock size={12} />}
            {order.status || 'Pending'}
          </span>
          <div style={{ color: 'var(--gray-1)' }}>{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--dark-border)', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
          {/* Items */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gray-1)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Items Ordered</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(order.items || order.cartItems || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'var(--dark)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {(item.imgUrl || item.image || item.img) ? (
                      <img src={item.imgUrl || item.image || item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : <Package size={18} color="var(--gray-2)" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{item.name} <span style={{ color: 'var(--gray-1)', fontWeight: 400 }}>×{item.qty || item.quantity || 1}</span></div>
                    <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700 }}>{fmt(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Update Status & Delivery */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gray-1)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Update Status</h4>
            <select
              value={order.status || 'Pending'}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={updating}
              style={{ width: '100%', padding: '12px 14px', background: 'var(--dark)', border: '1.5px solid var(--dark-border)', color: 'var(--white)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: 600, outline: 'none', cursor: 'pointer', marginBottom: '12px' }}
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {order.deliveryAddress && (
              <div style={{ background: 'var(--dark)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-sm)', padding: '14px', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--gray-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Truck size={12} /> Delivery Address</div>
                <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--gray-1)', margin: 0 }}>{order.deliveryAddress}</p>
              </div>
            )}

            {order.receiptUrl && (
              <div style={{ background: 'rgba(0,176,255,0.05)', border: '1px solid var(--info)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--info)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Payment Receipt Uploaded</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--dark-border)' }}>
                    <img src={order.receiptUrl} alt="Receipt Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)', background: 'var(--primary)', color: 'var(--black)', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none' }}>
                    View Full Receipt
                  </a>
                </div>
              </div>
            )}

            {updating && <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '8px' }}>Updating…</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, err => {
      console.error(err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || (o.id || '').toLowerCase().includes(q) || (o.customerName || '').toLowerCase().includes(q) || (o.customerEmail || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: 'Total', value: orders.length },
    { label: 'Pending', value: orders.filter(o => o.status === 'Pending' || !o.status).length, color: 'var(--warning)' },
    { label: 'In Transit', value: orders.filter(o => o.status === 'In Transit').length, color: 'var(--info)' },
    { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: 'var(--success)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 900, margin: 0 }}>Customer Orders</h1>
        <p style={{ color: 'var(--gray-1)', fontSize: '13px', marginTop: '4px' }}>Real-time order management — updates automatically</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-sm)', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'var(--font-display)', color: s.color || 'var(--white)' }}>{s.value}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-1)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-2)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, name, email…"
            style={{ width: '100%', padding: '10px 12px 10px 34px', background: 'var(--dark-card)', border: '1.5px solid var(--dark-border)', borderRadius: 'var(--radius-sm)', color: 'var(--white)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--dark-border)'} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', background: 'var(--dark-card)', border: '1.5px solid var(--dark-border)', color: 'var(--white)', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
          <option value="All">All Orders</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Loader2 className="spinner" size={48} color="var(--primary)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--gray-1)' }}>Loading orders…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)' }}>
          <ClipboardList size={56} color="var(--gray-2)" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--gray-1)', fontWeight: 600, fontSize: '16px' }}>No orders found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '12px', color: 'var(--gray-2)', marginBottom: '4px' }}>Showing {filtered.length} of {orders.length} orders</p>
          {filtered.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
}
