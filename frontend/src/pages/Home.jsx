import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { allProducts, productData } from '../data/productData';
import { 
  Smartphone, Laptop, Tv, Headphones, Refrigerator, Gamepad2, Camera, Watch,
  ShoppingCart, Heart, Truck, ShieldCheck, CheckCircle, RefreshCcw, Mail, Zap,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const formatCurrency = (amount) => '₦' + (amount || 0).toLocaleString('en-NG');

export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const inWishlist = isInWishlist(product.id);

  const priceHtml = product.originalPrice ? (
    <>
      <span className="product-old-price">{formatCurrency(product.originalPrice)}</span>
      <span className="product-price">{formatCurrency(product.price)}</span>
      <span className="product-discount">-{Math.round((1 - product.price/product.originalPrice) * 100)}%</span>
    </>
  ) : (
    <span className="product-price">{formatCurrency(product.price)}</span>
  );

  let badgeHtml = null;
  if (product.badge === 'hot') badgeHtml = <span className="product-badge hot">HOT</span>;
  else if (product.badge === 'new') badgeHtml = <span className="product-badge new">NEW</span>;
  else if (product.badge === 'sale' || product.originalPrice) badgeHtml = <span className="product-badge">SALE</span>;

  return (
    <article className="product-card" tabIndex="0">
      <Link to={`/product/${product.id}`} style={{ display: 'contents' }}>
        <div className="product-img-wrap">
          {badgeHtml}
          <button 
            className={`product-wishlist ${inWishlist ? 'active' : ''}`} 
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"} 
            onClick={(e) => { 
              e.preventDefault(); 
              toggleWishlist(product); 
            }}
            style={{ color: inWishlist ? 'var(--primary)' : 'var(--gray-1)', background: inWishlist ? 'rgba(255, 94, 0, 0.1)' : 'var(--dark)' }}
          >
            <Heart size={16} fill={inWishlist ? "var(--primary)" : "none"} />
          </button>
          <img src={product.imgUrl || product.image || (product.images && product.images[0]) || '/placeholder.jpg'} alt={product.name} className="product-img" />
          <div className="product-actions">
            <button 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', font: 'inherit', fontWeight: 700, width: '100%', height: '100%', cursor: 'pointer' }} 
              onClick={(e) => { 
                e.preventDefault(); 
                addToCart(product); 
              }}
            >
              <ShoppingCart size={16} /> ADD TO CART
            </button>
          </div>
        </div>
        
        <div className="product-info">
          <div className="product-brand">{product.brand}</div>
          <h3 className="product-name" title={product.name}>{product.name}</h3>
          <div className="product-rating">
            <span className="stars" style={{ color: 'var(--primary)', fontSize: '12px', letterSpacing: '2px' }}>{'★'.repeat(Math.max(0, Math.min(5, Math.floor(Number(product.rating) || 0))))}{'☆'.repeat(Math.max(0, 5 - Math.min(5, Math.floor(Number(product.rating) || 0))))}</span>
            <span className="rating-count" style={{ marginLeft: '4px' }}>({Number(product.reviews) || 0})</span>
          </div>
          <div className="product-price-wrap">
            {priceHtml}
          </div>
        </div>
      </Link>
    </article>
  );
};

// New Slider Component for the 2-row horizontally scrolling grids
const ScrollableProductSlider = ({ products }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      // Scroll by roughly 2 columns (400px) + gap
      const scrollAmount = direction === 'left' ? -432 : 432;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="slider-container">
      <button className="slider-btn left" onClick={() => scroll('left')} aria-label="Scroll left">
        <ChevronLeft size={24} />
      </button>
      
      <div className="scrollable-2row" ref={scrollRef}>
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <button className="slider-btn right" onClick={() => scroll('right')} aria-label="Scroll right">
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

  const [heroSlides, setHeroSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'site_settings'));
        if (docSnap.exists() && docSnap.data().heroSlides) {
          setHeroSlides(docSnap.data().heroSlides);
        }
      } catch (err) {
        console.error('Failed to fetch hero slides', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { getProducts } = await import('../utils/productService');
        const dbProducts = await getProducts();
        if (dbProducts && dbProducts.length > 0) {
          setData({
            flashSale: dbProducts.slice(0, 8),
            bestSellers: dbProducts.slice(0, 6),
            newArrivals: dbProducts.slice(0, 10),
            recommended: dbProducts.slice(0, 10),
            featured: dbProducts.slice(0, 8),
            all: dbProducts
          });
        }
      } catch (err) {
        console.error('Failed to fetch home products', err);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [currentSlide, heroSlides.length]);
  return (
    <main className="main-content" id="main">
      <SEO
        title="Shop Premium Electronics in Nigeria"
        description="Buy the latest iPhones, Samsung Galaxy, laptops, TVs, gaming consoles, air conditioners and more at The Electric Plug. Fast delivery across Nigeria with flexible installment payment plans."
        url="/"
      />

      {/* ---- HERO SECTION ---- */}
      {heroSlides.length > 0 && (
        <section className="hero-section" aria-label="Featured promotions">
          <div className="hero-carousel" role="region" aria-label="Hero slideshow">
            <div className="carousel-track" id="carousel-track" style={{ transform: `translateX(-${currentSlide * (100 / heroSlides.length)}%)`, width: `${heroSlides.length * 100}%` }}>
              {heroSlides.map((slide, index) => (
                <div 
                  key={index} 
                  className={`carousel-slide slide-${index + 1} ${currentSlide === index ? 'active' : ''}`} 
                  style={{ 
                    width: `${100 / heroSlides.length}%`,
                    backgroundImage: `linear-gradient(to right, rgba(6,6,8,0.95) 0%, rgba(6,6,8,0.85) 40%, rgba(6,6,8,0.4) 100%), url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  
                  {/* Animated Background Elements */}
                  <div className="slide-bg-glow"></div>
                  <div className="slide-bg-glow glow-2"></div>
                  
                  <div className="slide-content">
                    <h1 className="slide-title" style={{ fontSize: '42px' }}>
                      {slide.title}
                    </h1>
                    <p className="slide-desc">{slide.subtitle}</p>
                    <div className="slide-actions">
                      <Link to={slide.link || '/shop'} className="slide-btn primary">
                        <ShoppingCart size={18} /> {slide.buttonText || 'Shop Now'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            {heroSlides.length > 1 && (
              <>
                <button className="carousel-btn prev" aria-label="Previous slide" onClick={() => setCurrentSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1))}>
                  <ChevronLeft size={24} />
                </button>
                <button className="carousel-btn next" aria-label="Next slide" onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)}>
                  <ChevronRight size={24} />
                </button>
                <div className="carousel-dots">
                  {heroSlides.map((_, i) => (
                    <div 
                      key={i} 
                      className={`dot ${currentSlide === i ? 'active' : ''}`} 
                      onClick={() => setCurrentSlide(i)}
                      role="button"
                      aria-label={`Go to slide ${i + 1}`}
                    ></div>
                  ))}
                </div>
              </>
            )}
          </div>

        <aside className="hero-sidebar" aria-label="Promotional banners">
          <Link to="/shop" className="promo-card promo-card-1" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="promo-emoji"><Smartphone size={24} /></span>
            <div className="promo-subtitle">New Arrivals</div>
            <div className="promo-title">Phones &amp; Tablets</div>
            <div className="promo-cta">Shop Now →</div>
          </Link>
          <Link to="/shop" className="promo-card promo-card-2" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="promo-emoji"><Gamepad2 size={24} /></span>
            <div className="promo-subtitle">Up to 30% OFF</div>
            <div className="promo-title">Gaming Zone</div>
            <div className="promo-cta">Explore →</div>
          </Link>
          <Link to="/shop" className="promo-card promo-card-3" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="promo-emoji"><Refrigerator size={24} /></span>
            <div className="promo-subtitle">Best Deals</div>
            <div className="promo-title">Home Appliances</div>
            <div className="promo-cta">View All →</div>
          </Link>
        </aside>
        </section>
      )}

      {/* ---- QUICK CATEGORIES ---- */}
      <section className="quick-cats section-gap" aria-label="Quick product categories">
        <div className="quick-cats-grid">
          {[
            { icon: <Smartphone size={32} strokeWidth={1.5} />, name: 'Smartphones' },
            { icon: <Laptop size={32} strokeWidth={1.5} />, name: 'Laptops' },
            { icon: <Tv size={32} strokeWidth={1.5} />, name: 'Televisions' },
            { icon: <Headphones size={32} strokeWidth={1.5} />, name: 'Headphones' },
            { icon: <Refrigerator size={32} strokeWidth={1.5} />, name: 'Refrigerators' },
            { icon: <Gamepad2 size={32} strokeWidth={1.5} />, name: 'Gaming' },
            { icon: <Camera size={32} strokeWidth={1.5} />, name: 'Cameras' },
            { icon: <Watch size={32} strokeWidth={1.5} />, name: 'Smart Watches' },
          ].map(cat => (
            <Link to="/shop" key={cat.name} className="quick-cat-item" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="qc-icon" style={{ display: 'flex', color: 'var(--primary)' }}>{cat.icon}</div>
              <span className="qc-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- FLASH SALE ---- */}
      <section className="flash-sale section-gap" aria-label="Flash sale products">
        <div className="flash-header">
          <div className="flash-title-wrap">
            <div className="flash-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={24} className="flash-icon" /> Flash Sale
            </div>
          </div>
          <div className="countdown" role="timer" aria-label="Time remaining in flash sale">
            <span className="countdown-label">Ends in:</span>
            <div className="time-unit">
              <span className="time-num">02</span>
              <span className="time-label">HRS</span>
            </div>
            <span className="time-sep">:</span>
            <div className="time-unit">
              <span className="time-num">14</span>
              <span className="time-label">MIN</span>
            </div>
            <span className="time-sep">:</span>
            <div className="time-unit">
              <span className="time-num">37</span>
              <span className="time-label">SEC</span>
            </div>
          </div>
          <Link to="/shop" className="see-all">See All ›</Link>
        </div>

        <div className="flash-products">
          {data.flashSale.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ---- TRUST BADGES ---- */}
      <section className="trust-section section-gap" aria-label="Our guarantees">
        <div className="trust-item">
          <span className="trust-icon" style={{ display: 'flex', color: 'var(--primary)' }}><Truck size={36} strokeWidth={1.5} /></span>
          <div className="trust-text">
            <div className="trust-title">Free Delivery</div>
            <div className="trust-sub">On orders above ₦50,000</div>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon" style={{ display: 'flex', color: 'var(--primary)' }}><ShieldCheck size={36} strokeWidth={1.5} /></span>
          <div className="trust-text">
            <div className="trust-title">Secure Payment</div>
            <div className="trust-sub">100% safe transactions</div>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon" style={{ display: 'flex', color: 'var(--primary)' }}><CheckCircle size={36} strokeWidth={1.5} /></span>
          <div className="trust-text">
            <div className="trust-title">Genuine Products</div>
            <div className="trust-sub">All items are 100% authentic</div>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon" style={{ display: 'flex', color: 'var(--primary)' }}><RefreshCcw size={36} strokeWidth={1.5} /></span>
          <div className="trust-text">
            <div className="trust-title">Easy Returns</div>
            <div className="trust-sub">7-day hassle-free returns</div>
          </div>
        </div>
      </section>

      {/* ---- BRAND BANNERS ---- */}
      <section className="brand-banners section-gap" aria-label="Brand promotions">
        <Link to="/shop" className="brand-banner bb-1" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>
            <div className="bb-eyebrow">Official Store</div>
            <div className="bb-brand">Sam<span>sung</span></div>
            <div className="bb-sub">Galaxy S24 Series — Up to ₦80,000 off</div>
          </div>
          <div className="bb-cta">Shop Samsung ›</div>
          <span className="bb-icon"><Smartphone size={48} strokeWidth={1} color="rgba(255,255,255,0.4)" /></span>
        </Link>
        <Link to="/shop" className="brand-banner bb-2" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>
            <div className="bb-eyebrow">Apple Deals</div>
            <div className="bb-brand"><span>Apple</span> Week</div>
            <div className="bb-sub">iPhone, MacBook & iPad on sale</div>
          </div>
          <div className="bb-cta">Shop Apple ›</div>
          <span className="bb-icon"><Laptop size={48} strokeWidth={1} color="rgba(255,255,255,0.4)" /></span>
        </Link>
        <Link to="/shop" className="brand-banner bb-3" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>
            <div className="bb-eyebrow">Game On</div>
            <div className="bb-brand"><span>Gaming</span> Hub</div>
            <div className="bb-sub">PS5, Xbox, Nintendo & accessories</div>
          </div>
          <div className="bb-cta">Shop Gaming ›</div>
          <span className="bb-icon"><Gamepad2 size={48} strokeWidth={1} color="rgba(255,255,255,0.4)" /></span>
        </Link>
      </section>

      {/* ---- FEATURED PRODUCTS (2-ROW SCROLLABLE) ---- */}
      <section className="products-section section-gap" aria-label="Featured products">
        <div className="section-header">
          <h2 className="section-title">Featured <span className="title-accent">Products</span></h2>
          <Link to="/shop" className="see-all">See All ›</Link>
        </div>
        <ScrollableProductSlider products={data.featured} />
      </section>

      {/* ---- NEW ARRIVALS (2-ROW SCROLLABLE) ---- */}
      <section className="products-section section-gap" aria-label="New arrivals">
        <div className="section-header">
          <h2 className="section-title">New <span className="title-accent">Arrivals</span></h2>
          <Link to="/shop" className="see-all">See All ›</Link>
        </div>
        <ScrollableProductSlider products={data.newArrivals} />
      </section>

      {/* ---- TOP DEALS (2-ROW SCROLLABLE) ---- */}
      <section className="products-section section-gap" aria-label="Top deals">
        <div className="section-header">
          <h2 className="section-title">Top <span className="title-accent">Deals</span></h2>
          <Link to="/shop" className="see-all">See All ›</Link>
        </div>
        <ScrollableProductSlider products={[...data.featured, ...data.newArrivals].filter(p => p.oldPrice || p.badge === 'sale')} />
      </section>

      {/* ---- DYNAMIC PROMO SECTIONS ---- */}
      {data.all && data.all.length > 0 && [
        "Ecoflow Official Store | Anniversary Sales",
        "Appliances deals | Anniversary Sales",
        "Phones deal | Anniversary Sales",
        "Top Express | Anniversary Sales",
        "Television deals",
        "Beauty deals | Anniversary Sales",
        "Tablets & Computing Accessories | Anniversary Sales",
        "Mobile Accessories deals | Anniversary Sales",
        "Fashion deals | Anniversary Sales",
        "Aeon Official Store | Anniversary Sales",
        "Steeze And Flex | Anniversary Sales",
        "Kids deals | Anniversary Sales",
        "Gaming deals | Anniversary Sales",
        "Best Sellers | Anniversary Sales",
        "Jumia Bar",
        "Fitness deals"
      ].map((title, idx) => {
        // A simple way to make each section look slightly different
        // In a real app, this would be fetched from an API by category
        const shiftedProducts = [...data.all.slice(idx % data.all.length), ...data.all.slice(0, idx % data.all.length)];
        
        return (
          <section className="products-section section-gap" aria-label={title} key={title}>
            <div className="section-header">
              <h2 className="section-title" style={{ fontSize: '20px' }}>{title.split(' | ')[0]} <span className="title-accent">{title.split(' | ')[1] ? '| ' + title.split(' | ')[1] : ''}</span></h2>
              <Link to="/shop" className="see-all">See All ›</Link>
            </div>
            <ScrollableProductSlider products={shiftedProducts} />
          </section>
        );
      })}

      {/* ---- NEWSLETTER ---- */}
      <section className="newsletter-section section-gap" aria-label="Newsletter signup">
        <div className="newsletter-icon" style={{ display: 'flex', color: 'var(--primary)', marginBottom: '16px' }}><Mail size={48} strokeWidth={1.5} /></div>
        <h2 className="newsletter-title">Get <span>Exclusive Deals</span> in Your Inbox</h2>
        <p className="newsletter-sub">Subscribe to our newsletter and be the first to know about flash sales, new arrivals and exclusive discounts.</p>
        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); showToast('Subscribed to newsletter!'); }}>
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email address..."
            required
          />
          <button type="submit" className="newsletter-btn">Subscribe</button>
        </form>
      </section>

    </main>
  );
}

const getProductIcon = (category) => {
  if (!category) return <Smartphone size={48} strokeWidth={1} color="var(--gray-2)" />;
  const cat = category.toLowerCase();
  if (cat.includes('phone') || cat.includes('tablet')) return <Smartphone size={48} strokeWidth={1} color="var(--gray-2)" />;
  if (cat.includes('laptop') || cat.includes('computer')) return <Laptop size={48} strokeWidth={1} color="var(--gray-2)" />;
  if (cat.includes('tv') || cat.includes('television')) return <Tv size={48} strokeWidth={1} color="var(--gray-2)" />;
  if (cat.includes('headphone') || cat.includes('audio')) return <Headphones size={48} strokeWidth={1} color="var(--gray-2)" />;
  if (cat.includes('fridge') || cat.includes('home')) return <Refrigerator size={48} strokeWidth={1} color="var(--gray-2)" />;
  if (cat.includes('gaming')) return <Gamepad2 size={48} strokeWidth={1} color="var(--gray-2)" />;
  if (cat.includes('camera')) return <Camera size={48} strokeWidth={1} color="var(--gray-2)" />;
  if (cat.includes('watch')) return <Watch size={48} strokeWidth={1} color="var(--gray-2)" />;
  return <Smartphone size={48} strokeWidth={1} color="var(--gray-2)" />;
};

export { getProductIcon };
