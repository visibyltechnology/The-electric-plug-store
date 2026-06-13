import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Truck, Zap, ShieldCheck, PhoneCall, Search, 
  User, Heart, ShoppingCart, 
  LayoutGrid, Smartphone, Laptop, Tv, Home as HomeIcon,
  Gamepad2, Camera, ChevronDown, Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../pages/Home';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, cartCount, cartTotal, wishlist } = useApp();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* 1. ANNOUNCEMENT BAR (Premium Marquee) */}
      <div className="announcement-bar">
        <div className="ann-marquee">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Truck size={14} className="ann-icon" /> FREE DELIVERY on orders above ₦50,000</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}><Zap size={14} className="ann-icon" /> ⚡ ANNIVERSARY FLASH SALE LIVE NOW!</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={14} className="ann-icon" /> 100% Secure Payments & Genuine Products</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><PhoneCall size={14} className="ann-icon" /> Call Us: 0800-ELECTRIC</span>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="site-header">
        <div className="header-inner">
          
          {/* Logo */}
          <Link to="/" className="site-logo">
            <div className="logo-img-wrap">
              <img src="/logo.jpeg" alt="The Electric Plug Logo" />
            </div>
            <div className="logo-text">
              <span className="logo-name">The Electric Plug</span>
              <span className="logo-tagline" style={{ letterSpacing: '0.5px' }}>GIVING QUALITY YOU TRUST</span>
            </div>
          </Link>

          {/* Desktop: Search Bar (centre) */}
          <form onSubmit={handleSearch} className={`search-bar desktop-search ${isSearchFocused ? 'focused' : ''}`} style={{ transition: 'all 0.3s ease', boxShadow: isSearchFocused ? '0 0 0 3px rgba(255, 206, 30, 0.4)' : 'none', border: isSearchFocused ? '1.5px solid var(--primary)' : '1.5px solid var(--dark-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'transparent', borderRight: '1px solid var(--dark-border)', padding: '0 14px', cursor: 'pointer', color: 'var(--gray-1)' }}>
              <span style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>All Categories</span>
              <ChevronDown size={14} style={{ marginLeft: '6px' }} />
            </div>
            <input 
              type="search" 
              className="search-input" 
              placeholder="Search for laptops, phones, TVs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <button type="submit" className="search-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={18} />
            </button>
          </form>

          {/* Desktop: Account Actions */}
          <div className="header-actions desktop-actions">
            <ThemeToggle />
            
            {user?.isAdmin && (
              <Link to="/admin" className="hdr-btn" style={{ flexDirection: 'row', gap: '8px', padding: '10px 14px', alignItems: 'center', background: 'rgba(255, 61, 0, 0.1)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)' }}>
                <ShieldCheck size={22} className="icon" style={{ color: 'var(--danger)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '10px', color: 'var(--danger)', fontWeight: 600 }}>Manage</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)' }}>Admin</span>
                </div>
              </Link>
            )}

            <Link to={user ? "/profile" : "/login"} className="hdr-btn" style={{ flexDirection: 'row', gap: '8px', padding: '10px 14px', alignItems: 'center' }}>
              <User size={22} className="icon" />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '10px', color: 'var(--gray-1)', fontWeight: 600 }}>{user ? `Hello, ${user.firstName || 'User'}` : 'Hello, Sign in'}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)' }}>Account</span>
              </div>
            </Link>

            <Link to="/wishlist" className="hdr-btn" style={{ flexDirection: 'row', gap: '8px', padding: '10px 14px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Heart size={22} className="icon" />
                <span className="cart-badge" style={{ background: 'var(--gray-2)', color: 'var(--white)' }}>{wishlist.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '10px', color: 'var(--gray-1)', fontWeight: 600 }}>Saved</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)' }}>Items</span>
              </div>
            </Link>

            <Link to="/cart" className="hdr-btn" style={{ flexDirection: 'row', gap: '8px', padding: '10px 14px', alignItems: 'center', background: 'rgba(255, 206, 30, 0.1)', border: '1px solid rgba(255, 206, 30, 0.3)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={22} className="icon" style={{ color: 'var(--primary)' }} />
                <span className="cart-badge">{cartCount}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--white)', fontFamily: 'var(--font-display)' }}>{formatCurrency(cartTotal)}</span>
              </div>
            </Link>
          </div>

          {/* Mobile: Right side icons (Menu toggle + Cart) */}
          <div className="mobile-header-right">
            <Link to="/cart" className="mobile-cart-icon">
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={24} style={{ color: 'var(--primary)' }} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
            </Link>
            <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile: Search bar row below logo row */}
        <div className="mobile-search-row">
          <form onSubmit={handleSearch} className={`search-bar ${isSearchFocused ? 'focused' : ''}`} style={{ transition: 'all 0.3s ease', boxShadow: isSearchFocused ? '0 0 0 3px rgba(255, 206, 30, 0.4)' : 'none', border: isSearchFocused ? '1.5px solid var(--primary)' : '1.5px solid var(--dark-border)' }}>
            <input 
              type="search" 
              className="search-input" 
              placeholder="Search for laptops, phones, TVs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <button type="submit" className="search-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={18} />
            </button>
          </form>
        </div>
      </header>

      {/* 3. CATEGORY NAVIGATION */}
      <nav className="cat-nav" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(18, 18, 26, 0.95)' }}>
        <div className="cat-nav-inner" style={{ padding: '0 20px' }}>
          <Link to="/shop" className="cat-link active" style={{ background: 'var(--primary)', color: 'var(--black)', borderRadius: '0', borderBottom: 'none' }}>
            <Menu size={16} className="cat-icon" /> Shop All Departments
          </Link>
          <Link to="/shop" className="cat-link"><Smartphone size={16} className="cat-icon" /> Phones & Wearables</Link>
          <Link to="/shop" className="cat-link"><Laptop size={16} className="cat-icon" /> Computing</Link>
          <Link to="/shop" className="cat-link"><Tv size={16} className="cat-icon" /> TV & Audio</Link>
          <Link to="/shop" className="cat-link"><Gamepad2 size={16} className="cat-icon" /> Gaming</Link>
          <Link to="/shop" className="cat-link"><Camera size={16} className="cat-icon" /> Photography</Link>
          <Link to="/shop" className="cat-link"><HomeIcon size={16} className="cat-icon" /> Home Appliances</Link>
          
          <div style={{ flex: 1 }}></div>
          
          <Link to="/shop" className="cat-link" style={{ color: 'var(--primary)', fontWeight: 800 }}>
            🔥 TOP DEALS
          </Link>
        </div>
      </nav>

      {/* 4. MOBILE MENU OVERLAY */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <button className="close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>×</button>
          <div className="mobile-menu-header">Menu</div>
          <div className="mobile-menu-links">
            {/* User Actions for Mobile */}
            <Link to={user ? "/profile" : "/login"} onClick={() => setIsMobileMenuOpen(false)}>
              <User size={18} /> {user ? `Hello, ${user.name}` : 'Sign In / Account'}
            </Link>
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
              <Heart size={18} /> Saved Items ({wishlist.length})
            </Link>
            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: 700 }}>
              <ShoppingCart size={18} /> Cart — {formatCurrency(cartTotal)} ({cartCount})
            </Link>
            
            <div style={{ height: '1px', background: 'var(--dark-border)', margin: '8px 0' }}></div>
            
            {user?.isAdmin && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--danger)', fontWeight: 700 }}>
                <ShieldCheck size={18} /> Admin Dashboard
              </Link>
            )}
            
            {/* Categories */}
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}><Menu size={16} /> Shop All Departments</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}><Smartphone size={16} /> Phones & Wearables</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}><Laptop size={16} /> Computing</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}><Tv size={16} /> TV & Audio</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}><Gamepad2 size={16} /> Gaming</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}><Camera size={16} /> Photography</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}><HomeIcon size={16} /> Home Appliances</Link>
            
            <div style={{ height: '1px', background: 'var(--dark-border)', margin: '8px 0' }}></div>
            <div style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--gray-1)' }}>Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
