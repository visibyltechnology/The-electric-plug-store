import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, MapPin, Truck, ShieldCheck, ChevronRight, CheckCircle, Zap } from 'lucide-react';
import { allProducts } from '../data/productData';
import { formatCurrency } from './Home';

const checkoutItems = allProducts.slice(0, 2).map((p, i) => ({ ...p, qty: i + 1 }));

const steps = ['Delivery', 'Payment', 'Review'];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', city: '', state: 'Lagos', payMethod: 'kora' });

  const subtotal = checkoutItems.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = 5000;
  const total = subtotal + delivery;

  const inputStyle = { width: '100%', background: 'var(--dark)', border: '1.5px solid var(--dark-border)', color: 'var(--white)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px' };

  return (
    <main className="main-content" style={{ padding: '28px 20px' }}>
      {placed ? (
        <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', background: 'rgba(0,230,118,0.1)', border: '3px solid var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={52} color="var(--success)" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 900, color: 'var(--success)', marginBottom: '12px' }}>Order Placed!</h1>
          <p style={{ color: 'var(--gray-1)', fontSize: '16px', marginBottom: '8px' }}>Thank you for your purchase. Your order has been received and is being processed.</p>
          <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '20px', marginBottom: '32px' }}>Order Total: {formatCurrency(total)}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'var(--black)', padding: '14px 28px', borderRadius: 'var(--radius-md)', fontWeight: 800 }}>Track Order <ChevronRight size={16} /></Link>
            <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--dark-card)', border: '1px solid var(--dark-border)', color: 'var(--white)', padding: '14px 28px', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>Continue Shopping</Link>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, marginBottom: '28px' }}>Checkout</h1>

          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '0' }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', background: i <= step ? 'var(--primary)' : 'var(--dark-card)', color: i <= step ? 'var(--black)' : 'var(--gray-1)', border: `2px solid ${i <= step ? 'var(--primary)' : 'var(--dark-border)'}`, transition: 'var(--transition)' }}>{i < step ? '✓' : i + 1}</div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: i === step ? 'var(--primary)' : 'var(--gray-1)' }}>{s}</span>
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: '2px', background: i < step ? 'var(--primary)' : 'var(--dark-border)', margin: '0 8px', marginBottom: '20px', transition: 'var(--transition)' }}></div>}
              </React.Fragment>
            ))}
          </div>

          <div className="cart-grid">
            {/* Steps Content */}
            <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={20} color="var(--primary)" /> Delivery Details</h3>
                  {[['Full Name', 'fullName', 'text', 'Hassan Doe'], ['Phone', 'phone', 'tel', '+234 800 000 0000'], ['Address', 'address', 'text', '5 Electronics Way, Ikeja'], ['City', 'city', 'text', 'Lagos']].map(([label, key, type, placeholder]) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--gray-1)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{label}</label>
                      <input type={type} placeholder={placeholder} value={formData[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor='var(--primary)'} onBlur={e => e.target.style.borderColor='var(--dark-border)'} />
                    </div>
                  ))}
                  <button onClick={() => setStep(1)} style={{ background: 'var(--primary)', color: 'var(--black)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Continue to Payment <ChevronRight size={18} /></button>
                </div>
              )}

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}><CreditCard size={20} color="var(--primary)" /> Payment Method</h3>
                  {[
                    { id: 'kora', label: 'Pay with Kora Pay', icon: CreditCard, desc: 'Make Payment' },
                    { id: 'installment', label: 'Installment Payment', icon: Truck, desc: 'Pay in small installments' },
                    { id: 'easybuy', label: 'Easy Buy', icon: ShieldCheck, desc: 'Coming Soon', disabled: true },
                  ].map(method => (
                    <div 
                      key={method.id} 
                      onClick={() => !method.disabled && setFormData(p => ({ ...p, payMethod: method.id }))} 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', 
                        border: `2px solid ${formData.payMethod === method.id ? 'var(--primary)' : 'var(--dark-border)'}`, 
                        borderRadius: 'var(--radius-md)', 
                        cursor: method.disabled ? 'not-allowed' : 'pointer', 
                        background: formData.payMethod === method.id ? 'rgba(255,206,30,0.05)' : 'var(--dark)', 
                        opacity: method.disabled ? 0.5 : 1,
                        transition: 'var(--transition)' 
                      }}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,206,30,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <method.icon size={20} color="var(--primary)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {method.label}
                          {method.disabled && <span style={{ fontSize: '10px', background: 'var(--danger)', color: 'var(--white)', padding: '2px 6px', borderRadius: '10px' }}>Soon</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-1)' }}>{method.desc}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${formData.payMethod === method.id ? 'var(--primary)' : 'var(--dark-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {formData.payMethod === method.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(0)} style={{ flex: 1, background: 'var(--dark)', border: '1px solid var(--dark-border)', color: 'var(--white)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                    <button onClick={() => setStep(2)} style={{ flex: 2, background: 'var(--primary)', color: 'var(--black)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Review Order <ChevronRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>Review Your Order</h3>
                  {checkoutItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--dark)', borderRadius: 'var(--radius-sm)' }}>
                      <img src={item.imgUrl} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--gray-1)' }}>Qty: {item.qty}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(item.price * item.qty)}</div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(1)} style={{ flex: 1, background: 'var(--dark)', border: '1px solid var(--dark-border)', color: 'var(--white)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                    <button onClick={() => setPlaced(true)} style={{ flex: 2, background: 'var(--primary)', color: 'var(--black)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px var(--primary-glow)' }}>
                      <Zap size={18} /> Place Order — {formatCurrency(total)}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: '24px', position: 'sticky', top: '90px', height: 'fit-content' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--dark-border)' }}>Order Summary</h3>
              {checkoutItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--gray-1)' }}>{item.name.substring(0, 24)}... ×{item.qty}</span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: '12px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray-1)' }}><span>Subtotal</span><span style={{ color: 'var(--white)' }}>{formatCurrency(subtotal)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray-1)' }}><span>Delivery</span><span style={{ color: 'var(--white)' }}>{formatCurrency(delivery)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, paddingTop: '8px', borderTop: '1px solid var(--dark-border)', marginTop: '4px' }}><span>Total</span><span style={{ color: 'var(--primary)' }}>{formatCurrency(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
