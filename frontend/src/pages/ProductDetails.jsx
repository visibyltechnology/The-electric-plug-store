import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct } from '../utils/productService';
import { getProductIcon, formatCurrency } from './Home';
import { categorySpecs } from '../data/taxonomy';
import { 
  ShoppingCart, Heart, Truck, ShieldCheck, 
  BatteryCharging, MicOff, Package, Speaker, Cable, Loader2, CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';

export default function ProductDetails() {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const dbProduct = await getProduct(id);
        if (dbProduct) {
          setProduct(dbProduct);
          if (dbProduct.colors && dbProduct.colors.length > 0) {
            const firstCol = dbProduct.colors[0];
            setSelectedColor(typeof firstCol === 'string' ? firstCol : firstCol.name);
          }
        } else {
          // No product found
          navigate('/shop');
        }
      } catch (error) {
        console.error(error);
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);
  
  const inWishlist = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 className="spinner" size={48} color="var(--primary)" />
      </main>
    );
  }

  if (!product) return null;

  // Normalize colors
  const normalizedColors = product?.colors?.map(c => typeof c === 'string' ? { name: c, image: null } : c) || [];

  // Extract images from product
  let productImages = (product.images && product.images.length > 0) 
    ? [...product.images] 
    : (product.image || product.imgUrl || product.img) 
      ? [product.image || product.imgUrl || product.img] 
      : [];

  // Add unique color images to the gallery
  normalizedColors.forEach(col => {
    if (col.image && !productImages.includes(col.image)) {
      productImages.push(col.image);
    }
  });

  const hasImages = productImages.length > 0;

  // Provide a generic set of fallback icons if we can't map properly
  const fallbackThumbnails = [
    getProductIcon(product.category), 
    <Package size={48} strokeWidth={1} color="var(--gray-2)" />, 
    <Speaker size={48} strokeWidth={1} color="var(--gray-2)" />, 
    <Cable size={48} strokeWidth={1} color="var(--gray-2)" />
  ];

  return (
    <main className="main-content" id="main">
      <SEO
        title={`${product.name} - Buy in Nigeria`}
        description={`Buy ${product.name} in Nigeria at The Electric Plug. ₦${Math.ceil(product.price || 0).toLocaleString('en-NG')}. Fast delivery nationwide. Flexible installment payment available.`}
        image={product.images?.[0] || product.imgUrl || '/logo.jpeg'}
        url={`/product/${product.id}`}
        type="product"
        product={product}
      />
      <div className="text-primary" style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
        <Link to="/" style={{ color: 'var(--gray-1)' }}>Home</Link> / 
        <Link to="/shop" style={{ color: 'var(--gray-1)' }}> Shop </Link> / 
        {product.department && <><span style={{ color: 'var(--gray-1)' }}> {product.department} </span> / </>}
        {product.category && <><span style={{ color: 'var(--gray-1)' }}> {product.category} </span> / </>}
        {product.subcategory && <><span style={{ color: 'var(--gray-1)' }}> {product.subcategory} </span> / </>}
        {product.name}
      </div>

      <div className="product-detail-layout">
        
        {/* 1. IMAGE GALLERY */}
        <div className="product-gallery">
          <div className="pg-main" style={hasImages ? { padding: 0, overflow: 'hidden', display: 'block' } : {}}>
            {product.badge && (
              <span className={`pg-badge ${product.badge === 'hot' ? 'hot' : product.badge === 'new' ? 'new' : ''}`} style={hasImages ? { zIndex: 10 } : {}}>
                {product.badge.toUpperCase()}
              </span>
            )}
            
            {hasImages ? (
              <img src={productImages[activeThumb]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ transform: 'scale(2.5)' }}>
                {fallbackThumbnails[activeThumb]}
              </div>
            )}
          </div>
          <div className="pg-thumbnails">
            {hasImages ? (
              productImages.map((img, idx) => (
                <div 
                  key={idx}
                  className={`pg-thumb ${activeThumb === idx ? 'active' : ''}`}
                  onClick={() => setActiveThumb(idx)}
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  <img src={img} alt={`${product.name} thumbnail`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))
            ) : (
              fallbackThumbnails.map((thumb, idx) => (
                <div 
                  key={idx}
                  className={`pg-thumb ${activeThumb === idx ? 'active' : ''}`}
                  onClick={() => setActiveThumb(idx)}
                  style={{ padding: '16px' }}
                >
                  {thumb}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. PRODUCT INFO */}
        <div className="product-detail-info">
          <div>
            <div className="pd-brand">{product.brand}</div>
            <h1 className="pd-title">{product.name}</h1>
          </div>
          
          <div className="pd-rating">
            <span className="stars" style={{ color: 'var(--primary)', fontSize: '16px', letterSpacing: '2px' }}>
              {'★'.repeat(Math.max(0, Math.min(5, Math.floor(Number(product.rating) || 0))))}{'☆'.repeat(Math.max(0, 5 - Math.min(5, Math.floor(Number(product.rating) || 0))))}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--white)', marginLeft: '8px' }}>{Number(product.rating) || 0}</span>
            <span>({Number(product.reviews) || 0} verified ratings)</span>
          </div>

          <div>
            {product.oldPrice && (
              <div className="pd-discount">
                -{Math.round((1 - product.price/product.oldPrice) * 100)}% Discount
              </div>
            )}
            <div className="pd-price-wrap">
              <span className="pd-price">{formatCurrency(product.price)}</span>
              {product.oldPrice && <span className="pd-old-price">{formatCurrency(product.oldPrice)}</span>}
            </div>
          </div>

          {normalizedColors.length > 0 && (
            <div className="pd-variants">
              <div className="variant-title">Color: <span style={{ color: 'var(--white)' }}>{selectedColor}</span></div>
              <div className="variant-options">
                {normalizedColors.map(col => (
                  <button 
                    key={col.name} 
                    className={`variant-btn ${selectedColor === col.name ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedColor(col.name);
                      if (col.image) {
                        const idx = productImages.indexOf(col.image);
                        if (idx !== -1) setActiveThumb(idx);
                      }
                    }}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pd-features">
            {product.features && product.features.length > 0 ? (
              product.features.map((feat, idx) => (
                <div key={idx} className="pd-feature">
                  <span className="pd-feature-icon"><CheckCircle2 size={20} /></span>
                  <span>{feat}</span>
                </div>
              ))
            ) : (
              <>
                <div className="pd-feature">
                  <span className="pd-feature-icon"><BatteryCharging size={20} /></span>
                  <span>Up to 30 hours of battery life with quick charging.</span>
                </div>
                <div className="pd-feature">
                  <span className="pd-feature-icon"><MicOff size={20} /></span>
                  <span>Industry-leading noise cancellation optimized for you.</span>
                </div>
                <div className="pd-feature">
                  <span className="pd-feature-icon"><ShieldCheck size={20} /></span>
                  <span>1 Year Official Warranty Included.</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. ACTION SIDEBAR */}
        <div className="product-action-sidebar">
          <div className="pas-delivery">
            <div className="pas-delivery-icon" style={{ color: 'var(--primary)' }}><Truck size={32} strokeWidth={1.5} /></div>
            <div className="pas-delivery-text">
              <strong>Free Delivery</strong>
              <span>Estimated delivery: 2-4 working days across Lagos.</span>
            </div>
          </div>
          <div className="pas-delivery" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="pas-delivery-icon" style={{ color: 'var(--primary)' }}><ShieldCheck size={32} strokeWidth={1.5} /></div>
            <div className="pas-delivery-text">
              <strong>Return Policy</strong>
              <span>Free return within 7 days for defective items.</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--dark-border)', margin: 0 }} />

          <div className="pas-qty">
            <span>Quantity</span>
            <div className="qty-selector">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <input type="number" value={qty} readOnly />
              <button onClick={() => setQty(q => Math.min(10, q + 1))}>+</button>
            </div>
          </div>

          <div>
            <button className="pas-add-btn" onClick={() => {
              const productToAdd = selectedColor ? { ...product, selectedColor } : product;
              addToCart(productToAdd, qty);
            }}>
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button 
              className={`pas-wish-btn ${isInWishlist(product.id) ? 'active' : ''}`} 
              onClick={() => toggleWishlist(product)} 
              style={{ marginTop: '10px', color: isInWishlist(product.id) ? 'var(--primary)' : 'inherit', borderColor: isInWishlist(product.id) ? 'var(--primary)' : 'inherit' }}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? 'var(--primary)' : 'none'} /> {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

      </div>

      {/* 4. PRODUCT TABS */}
      <div className="product-tabs-section">
        <div className="tabs-nav">
          <button className={`tab-btn ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>Overview</button>
          <button className={`tab-btn ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>Specifications</button>
          <button className={`tab-btn ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>Verified Reviews ({product.reviews})</button>
        </div>
        
        {activeTab === 0 && (
          <div className="tab-content active">
            {product.overview ? (
              <>
                <h3>About the {product.name}</h3>
                <p style={{ lineHeight: '1.8', color: 'var(--gray-1)' }}>{product.overview}</p>
              </>
            ) : (
              <>
                <h3>Premium Experience with {product.brand}</h3>
                <p>Experience unparalleled quality and performance with the latest {product.name}. Designed to seamlessly integrate into your lifestyle, this product sets a new standard for excellence.</p>
                <p>Every detail has been meticulously crafted to provide you with the best experience possible. From the premium materials to the advanced internal components, this is technology at its finest.</p>
              </>
            )}
            {product.description && (
              <div style={{ marginTop: '16px', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.8', color: 'var(--gray-1)', whiteSpace: 'pre-line' }}>{product.description}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && (() => {
          const specKey = product.subcategory || product.category;
          const specFields = categorySpecs[specKey] || categorySpecs[product.category] || [];
          const hasSpecs = product.specs && Object.keys(product.specs).some(k => product.specs[k]);
          return (
            <div className="tab-content active">
              <h3>Technical Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {/* Always-visible core fields */}
                  {product.brand && <tr><th>Brand</th><td>{product.brand}</td></tr>}
                  {product.department && <tr><th>Department</th><td>{product.department}</td></tr>}
                  {product.category && <tr><th>Category</th><td>{product.category}</td></tr>}
                  {product.subcategory && <tr><th>Subcategory</th><td>{product.subcategory}</td></tr>}

                  {/* Dynamic specs from taxonomy schema */}
                  {specFields.length > 0 && hasSpecs ? (
                    specFields.map(field => {
                      const val = product.specs?.[field.id];
                      if (!val) return null;
                      return <tr key={field.id}><th>{field.label}</th><td>{val}</td></tr>;
                    })
                  ) : !hasSpecs ? (
                    // Fallback static rows if no specs saved
                    <>
                      <tr><th>Model Year</th><td>2025</td></tr>
                      <tr><th>Warranty</th><td>1 Year Limited Warranty</td></tr>
                      <tr><th>Condition</th><td>Brand New</td></tr>
                    </>
                  ) : null}

                  {/* Any extra specs not in schema */}
                  {product.specs && Object.entries(product.specs)
                    .filter(([k, v]) => v && !specFields.find(f => f.id === k))
                    .map(([k, v]) => (
                      <tr key={k}><th style={{ textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</th><td>{v}</td></tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          );
        })()}

        {activeTab === 2 && (() => {
          const ratingValue = Number(product.rating) || 0;
          const reviewsCount = Number(product.reviews) || 0;
          const starsString = '★'.repeat(Math.max(0, Math.min(5, Math.floor(ratingValue)))) + '☆'.repeat(Math.max(0, 5 - Math.min(5, Math.floor(ratingValue))));
          const reviewsList = product.reviewsList || [];

          // Calculate breakdown if reviews exist
          const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          reviewsList.forEach(r => {
            const s = Math.max(1, Math.min(5, Math.floor(Number(r.stars) || 5)));
            counts[s]++;
          });
          const totalReviews = reviewsList.length || 1; // avoid division by zero
          
          return (
            <div className="tab-content active">
              <div className="reviews-grid">
                <div className="rating-summary">
                  <h3>Customer Feedback</h3>
                  <div>
                    <div className="rs-score">{ratingValue > 0 ? ratingValue.toFixed(1) : '0'}</div>
                    <div className="rs-stars" style={{ color: 'var(--primary)', letterSpacing: '2px' }}>{starsString}</div>
                    <div style={{ fontSize: '13px', color: 'var(--gray-1)' }}>Based on {reviewsCount} reviews</div>
                  </div>
                  <div className="rs-bars">
                    {[5, 4, 3, 2, 1].map(star => {
                      const pct = reviewsList.length > 0 ? Math.round((counts[star] / totalReviews) * 100) : 0;
                      return (
                        <div key={star} className="rs-bar-row">
                          {star}★ <div className="rs-bar-track"><div className="rs-bar-fill" style={{ width: `${pct}%` }}></div></div> {pct}%
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="review-list">
                  {reviewsList.length > 0 ? (
                    reviewsList.map((review, idx) => (
                      <div key={idx} className="review-card">
                        <div className="rc-header">
                          <span className="rc-user">{review.user || 'Anonymous'} <span style={{ color: 'var(--success)', fontSize: '11px' }}>✓ Verified Buyer</span></span>
                          <span className="rc-date">{review.date || 'Recently'}</span>
                        </div>
                        <div className="rc-stars">{'★'.repeat(Math.max(1, Math.min(5, Number(review.stars) || 5)))}</div>
                        <div className="rc-text">{review.text}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', color: 'var(--gray-1)', fontStyle: 'italic' }}>
                      No reviews yet for this product. Be the first to leave a review!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </main>
  );
}
