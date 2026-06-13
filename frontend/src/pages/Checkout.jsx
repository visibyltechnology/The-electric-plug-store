import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Truck, ShieldCheck, ChevronRight, CheckCircle, Zap, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from './Home';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadImage } from '../utils/cloudinaryService';

const steps = ['Delivery', 'Payment', 'Review'];

export default function Checkout() {
  const { user, cart, cartTotal, clearCart } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({ 
    fullName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '', 
    phone: user?.phone || '', 
    address: '', 
    city: '', 
    state: 'Lagos', 
    payMethod: 'bank_transfer' 
  });

  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState({ terms: false, privacy: false });

  const delivery = 5000;
  const total = cartTotal + delivery;

  useEffect(() => {
    if (cart.length === 0 && !placed) {
      navigate('/cart');
    }
  }, [cart, navigate, placed]);

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrderClick = () => {
    if (formData.payMethod === 'bank_transfer' && !receiptFile) {
      setError('Please upload your payment receipt before placing the order.');
      return;
    }
    setError('');
    setShowModal(true);
  };

  const submitOrder = async () => {
    if (!termsAccepted.terms || !termsAccepted.privacy) {
      setError('You must accept the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    setShowModal(false);
    setLoading(true);
    setError('');

    try {
      let receiptUrl = '';
      if (receiptFile) {
        receiptUrl = await uploadImage(receiptFile);
      }

      const orderData = {
        userId: user?.uid || 'guest',
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: user?.email || '',
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state}`,
        items: cart,
        subtotal: cartTotal,
        deliveryFee: delivery,
        totalAmount: total,
        paymentMethod: formData.payMethod,
        status: 'Pending Verification',
        receiptUrl: receiptUrl,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      clearCart();
      setPlaced(true);
    } catch (err) {
      console.error(err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', background: 'var(--dark)', border: '1.5px solid var(--dark-border)', color: 'var(--white)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px' };

  if (cart.length === 0 && !placed) return null;

  return (
    <main className="main-content" style={{ padding: '28px 20px' }}>
      {placed ? (
        <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', background: 'rgba(0,230,118,0.1)', border: '3px solid var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={52} color="var(--success)" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 900, color: 'var(--success)', marginBottom: '12px' }}>Order Placed!</h1>
          <p style={{ color: 'var(--gray-1)', fontSize: '16px', marginBottom: '8px' }}>Thank you for your purchase. We are currently verifying your payment receipt.</p>
          <p style={{ color: 'var(--gray-1)', fontSize: '14px', marginBottom: '24px' }}>You will receive an email notification once your order is confirmed and processing.</p>
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

          <div className="cart-grid" style={{ gridTemplateColumns: '1fr 360px', alignItems: 'start' }}>
            {/* Steps Content */}
            <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={20} color="var(--primary)" /> Delivery Details</h3>
                  {[['Full Name', 'fullName', 'text', 'e.g., Hassan Doe'], ['Phone', 'phone', 'tel', 'e.g., +234 800 000 0000'], ['Address', 'address', 'text', 'e.g., 5 Electronics Way, Ikeja'], ['City', 'city', 'text', 'e.g., Lagos']].map(([label, key, type, placeholder]) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--gray-1)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{label}</label>
                      <input type={type} placeholder={placeholder} value={formData[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor='var(--primary)'} onBlur={e => e.target.style.borderColor='var(--dark-border)'} required />
                    </div>
                  ))}
                  <button onClick={() => {
                    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
                      setError('Please fill in all delivery details.');
                      return;
                    }
                    setError('');
                    setStep(1);
                  }} style={{ background: 'var(--primary)', color: 'var(--black)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>Continue to Payment <ChevronRight size={18} /></button>
                  {error && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '-10px', textAlign: 'center' }}>{error}</p>}
                </div>
              )}

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}><CreditCard size={20} color="var(--primary)" /> Payment Method</h3>
                  {[
                    { id: 'bank_transfer', label: 'Direct Bank Transfer', icon: CreditCard, desc: 'Pay directly to our bank account' },
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
                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button onClick={() => setStep(0)} style={{ flex: 1, background: 'var(--dark)', border: '1px solid var(--dark-border)', color: 'var(--white)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                    <button onClick={() => setStep(2)} style={{ flex: 2, background: 'var(--primary)', color: 'var(--black)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Review Order <ChevronRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>Review & Pay</h3>
                  
                  {formData.payMethod === 'bank_transfer' && (
                    <div style={{ background: 'var(--dark)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={18} /> Bank Account Details
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--gray-1)', marginBottom: '16px' }}>
                        Please transfer the exact amount of <strong>{formatCurrency(total)}</strong> to the account below. Your order will not ship until we receive payment.
                      </p>
                      
                      <div style={{ background: 'var(--black)', padding: '16px', borderRadius: 'var(--radius-sm)', display: 'grid', gap: '12px', border: '1px solid var(--dark-border)', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--gray-1)', fontSize: '13px' }}>Bank Name</span>
                          <span style={{ fontWeight: 700, fontSize: '14px' }}>Wema Bank</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--gray-1)', fontSize: '13px' }}>Account Name</span>
                          <span style={{ fontWeight: 700, fontSize: '14px' }}>The electric plug enterprises</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--gray-1)', fontSize: '13px' }}>Account Number</span>
                          <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--white)', letterSpacing: '1px' }}>0125986348</span>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--white)', marginBottom: '8px' }}>Upload Payment Receipt <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <label style={{ flex: 1, background: 'var(--dark-card)', border: '1.5px dashed var(--dark-border)', padding: '16px', borderRadius: 'var(--radius-sm)', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)' }}>
                            <Upload size={20} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                            <span style={{ fontSize: '13px', color: 'var(--gray-1)' }}>Click to upload screenshot</span>
                            <input type="file" accept="image/*" onChange={handleReceiptChange} style={{ display: 'none' }} />
                          </label>
                          {receiptPreview && (
                            <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--dark-border)' }}>
                              <img src={receiptPreview} alt="Receipt preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div style={{ background: 'rgba(255,61,0,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button onClick={() => setStep(1)} disabled={loading} style={{ flex: 1, background: 'var(--dark)', border: '1px solid var(--dark-border)', color: 'var(--white)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>Back</button>
                    <button onClick={handlePlaceOrderClick} disabled={loading} style={{ flex: 2, background: 'var(--primary)', color: 'var(--black)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px var(--primary-glow)' }}>
                      {loading ? <><Loader2 className="spinner" size={18} /> Processing...</> : <><Zap size={18} /> Place Order — {formatCurrency(total)}</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: '24px', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--dark-border)' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--dark)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.imgUrl || item.image || item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--white)', marginBottom: '2px', lineHeight: 1.3 }}>{item.name}</div>
                      <div style={{ color: 'var(--gray-1)', fontSize: '11px' }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray-1)' }}><span>Subtotal</span><span style={{ color: 'var(--white)', fontWeight: 600 }}>{formatCurrency(cartTotal)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray-1)' }}><span>Delivery</span><span style={{ color: 'var(--white)', fontWeight: 600 }}>{formatCurrency(delivery)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, paddingTop: '12px', borderTop: '1px solid var(--dark-border)', marginTop: '4px' }}><span>Total</span><span style={{ color: 'var(--primary)' }}>{formatCurrency(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: '32px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '20px', color: 'var(--white)' }}>Almost there...</h3>
            <p style={{ color: 'var(--gray-1)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>Please read and accept our policies to complete your order.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={termsAccepted.terms} 
                  onChange={e => setTermsAccepted(p => ({...p, terms: e.target.checked}))} 
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--primary)' }} 
                />
                <span style={{ fontSize: '14px', color: 'var(--white)', lineHeight: 1.5 }}>
                  I have read and accept the <Link to="/terms" style={{ color: 'var(--primary)' }}>Terms & Conditions</Link> including the <strong>No-Return & No-Refund policy</strong>.
                </span>
              </label>
              
              <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={termsAccepted.privacy} 
                  onChange={e => setTermsAccepted(p => ({...p, privacy: e.target.checked}))} 
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--primary)' }} 
                />
                <span style={{ fontSize: '14px', color: 'var(--white)', lineHeight: 1.5 }}>
                  I have read and accept the <Link to="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</Link> and consent to data processing under Nigerian NDPR.
                </span>
              </label>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', color: 'var(--white)', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button 
                onClick={submitOrder} 
                disabled={!termsAccepted.terms || !termsAccepted.privacy} 
                style={{ flex: 2, padding: '12px', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--black)', fontWeight: 800, cursor: (!termsAccepted.terms || !termsAccepted.privacy) ? 'not-allowed' : 'pointer', opacity: (!termsAccepted.terms || !termsAccepted.privacy) ? 0.5 : 1, transition: 'var(--transition)' }}
              >
                Agree & Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
