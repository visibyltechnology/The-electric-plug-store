import React from 'react';
import { 
  MessageCircle, PhoneCall, Mail, MapPin, MessageSquare, CreditCard 
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="site-footer" style={{ marginTop: '60px' }}>
      <div className="footer-inner">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <div className="site-logo" style={{ marginBottom: '12px' }}>
              <div className="logo-img-wrap" style={{ width: '44px', height: '44px' }}>
                <img src="/logo.jpeg" alt="The Electric Plug Logo" />
              </div>
              <div className="logo-text">
                <span className="logo-name" style={{ fontSize: '15px' }}>The Electric Plug</span>
                <span className="logo-tagline">Giving Quality you can always trust</span>
              </div>
            </div>
            <p>Nigeria's most trusted electronics marketplace. We offer the best prices on genuine products with fast delivery across the country.</p>
            <div className="social-links" style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a href="#" className="social-link" style={{ color: 'var(--white)' }}><FaFacebook size={20} /></a>
              <a href="#" className="social-link" style={{ color: 'var(--white)' }}><FaTwitter size={20} /></a>
              <a href="#" className="social-link" style={{ color: 'var(--white)' }}><FaInstagram size={20} /></a>
              <a href="#" className="social-link" style={{ color: 'var(--white)' }}><MessageCircle size={20} /></a>
              <a href="#" className="social-link" style={{ color: 'var(--white)' }}><FaYoutube size={20} /></a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Popular Categories</div>
            <div className="footer-links">
              <a href="#">Smartphones</a>
              <a href="#">Laptops & Computers</a>
              <a href="#">Televisions</a>
              <a href="#">Audio & Headphones</a>
              <a href="#">Cameras</a>
              <a href="#">Gaming</a>
              <a href="#">Smart Watches</a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Help & Support</div>
            <div className="footer-links">
              <a href="#">Track Your Order</a>
              <a href="#">Returns & Refunds</a>
              <a href="#">Payment Methods</a>
              <a href="#">Delivery Information</a>
              <a href="#">FAQ</a>
              <a href="#">Live Chat</a>
              <a href="#">Contact Us</a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Contact Us</div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon" style={{ color: 'var(--primary)' }}><PhoneCall size={20} /></span>
              <div className="footer-contact-text">
                <strong>Customer Service</strong>
                09032272294<br />
                Mon – Sat: 8am – 8pm
              </div>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon" style={{ color: 'var(--primary)' }}><Mail size={20} /></span>
              <div className="footer-contact-text">
                <strong>Email Support</strong>
                support@theelectricplug.ng
              </div>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon" style={{ color: 'var(--primary)' }}><MapPin size={20} /></span>
              <div className="footer-contact-text">
                <strong>Head Office</strong>
                A7 adeti street, FABTECH plaza<br />ilesa osun state
              </div>
            </div>
            <div className="footer-contact-item" style={{ marginTop: '12px' }}>
              <span className="footer-contact-icon" style={{ color: 'var(--primary)' }}><MapPin size={20} /></span>
              <div className="footer-contact-text">
                <strong>Branch Office</strong>
                Shop424 upstairs japan line,<br />electronics alaba international market,<br />ojo, lagos state
              </div>
            </div>
            <div className="footer-contact-item" style={{ marginTop: '12px' }}>
              <span className="footer-contact-icon" style={{ color: 'var(--primary)' }}><MessageSquare size={20} /></span>
              <div className="footer-contact-text">
                <strong>WhatsApp</strong>
                09032272294
              </div>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 <span>The Electric Plug</span>. All rights reserved. Made with ⚡ in Nigeria.
          </div>
          <div className="payment-methods" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="payment-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CreditCard size={14} /> Visa</span>
            <span className="payment-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CreditCard size={14} /> Mastercard</span>
            <span className="payment-badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CreditCard size={14} /> Paystack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
