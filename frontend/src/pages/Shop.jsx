import React, { useState } from 'react';
import { allProducts } from '../data/productData';
import { ProductCard } from './Home';
import { categoryTaxonomy, categoryAttributes, defaultAttributes } from '../data/taxonomy';

export default function Shop() {
  const [view, setView] = useState('grid');
  const [activeCategory, setActiveCategory] = useState('Laptops'); // Default to Laptops to show dynamic filters
  const [expandedDept, setExpandedDept] = useState('Computing');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Get attributes for the currently active category, fallback to default
  const activeFilters = categoryAttributes[activeCategory] || defaultAttributes;

  const handleFilterChange = (filterId, option) => {
    setSelectedFilters(prev => {
      const currentSelections = prev[filterId] || [];
      if (currentSelections.includes(option)) {
        return { ...prev, [filterId]: currentSelections.filter(item => item !== option) };
      } else {
        return { ...prev, [filterId]: [...currentSelections, option] };
      }
    });
  };
  
  return (
    <main className="main-content" id="main">
      <div className="section-header">
        <h1 className="section-title">Shop <span className="title-accent">Electronics</span></h1>
        <div className="text-primary" style={{ fontSize: '13px', fontWeight: 600 }}>Home / Shop</div>
      </div>

      <div className="shop-layout">
        {/* Mobile Filter Overlay Background */}
        {isMobileFilterOpen && <div className="mobile-filter-backdrop" onClick={() => setIsMobileFilterOpen(false)}></div>}

        <aside className={`shop-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
          <div className="mobile-filter-header">
            <span>Filter Products</span>
            <button onClick={() => setIsMobileFilterOpen(false)}>×</button>
          </div>
          {/* Category Tree Navigation */}
          <div className="filter-group">
            <div className="filter-title">Categories</div>
            <div className="category-tree" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(categoryTaxonomy).map(([dept, categories]) => (
                <div key={dept} className="tree-dept">
                  <div 
                    className="dept-header" 
                    onClick={() => setExpandedDept(expandedDept === dept ? null : dept)}
                    style={{ fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--dark-border)' }}
                  >
                    {dept} <span>{expandedDept === dept ? '-' : '+'}</span>
                  </div>
                  
                  {expandedDept === dept && (
                    <div className="dept-categories" style={{ paddingLeft: '12px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {Object.entries(categories).map(([catName, leafNodes]) => (
                        <div key={catName}>
                          <div 
                            style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-1)', cursor: 'pointer', marginBottom: '4px' }}
                            onClick={() => setActiveCategory(catName)}
                          >
                            {catName}
                          </div>
                          <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {leafNodes.map(node => (
                              <div 
                                key={node} 
                                style={{ 
                                  fontSize: '12px', 
                                  cursor: 'pointer', 
                                  color: activeCategory === node ? 'var(--primary)' : 'var(--gray-2)'
                                }}
                                onClick={() => setActiveCategory(node)}
                              >
                                {node}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="filter-group">
            <div className="filter-title">Brand</div>
            <div className="filter-list">
              {['Samsung', 'Apple', 'Sony', 'LG', 'HP'].map(brand => (
                <label className="filter-item" key={brand}>
                  <input 
                    type="checkbox" 
                    className="filter-checkbox" 
                    checked={(selectedFilters.brand || []).includes(brand)}
                    onChange={() => handleFilterChange('brand', brand)}
                  />
                  {brand} <span className="filter-count">{Math.floor(Math.random() * 50) + 5}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range (Always visible) */}
          <div className="filter-group">
            <div className="filter-title">Price (₦)</div>
            <div className="price-inputs">
              <input type="number" className="price-input" placeholder="Min" min="0" />
              <span>-</span>
              <input type="number" className="price-input" placeholder="Max" min="0" />
            </div>
            <button className="apply-filter-btn" onClick={() => alert('Filters Applied!')}>Apply Price Filter</button>
          </div>

          {/* DYNAMIC FILTERS based on Active Category */}
          <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,184,0,0.05)', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>Dynamic Specs For:</span>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--white)' }}>{activeCategory}</div>
          </div>

          {activeFilters.map(filter => (
            <div className="filter-group" key={filter.id}>
              <div className="filter-title">{filter.label}</div>
              <div className="filter-list">
                {filter.options.map(option => (
                  <label className="filter-item" key={option}>
                    <input 
                      type="checkbox" 
                      className="filter-checkbox" 
                      checked={(selectedFilters[filter.id] || []).includes(option)}
                      onChange={() => handleFilterChange(filter.id, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Rating Filter */}
          <div className="filter-group">
            <div className="filter-title">Customer Rating</div>
            <div className="filter-list">
              {[4, 3, 2].map(stars => (
                <label className="filter-item" key={stars}>
                  <input 
                    type="checkbox" 
                    className="filter-checkbox" 
                    checked={(selectedFilters.rating || []).includes(stars)}
                    onChange={() => handleFilterChange('rating', stars)}
                  />
                  <span className="stars" style={{ color: 'var(--primary)' }}>
                    {'★'.repeat(stars)}{'☆'.repeat(5-stars)}
                  </span> & Up
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="shop-main">
          <div className="shop-toolbar">
            <div className="shop-results-count">Showing <span>1-{allProducts.length}</span> of <span>{allProducts.length}</span> results</div>
            
            <button className="mobile-filter-toggle" onClick={() => setIsMobileFilterOpen(true)}>
              Filter Products
            </button>

            <div className="shop-sort-wrap">
              <span className="sort-label">Sort by:</span>
              <select className="sort-select">
                <option>Recommended</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Customer Rating</option>
              </select>
              
              <div className="view-toggles">
                <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} title="Grid View" onClick={() => setView('grid')}>🔲</button>
                <button className={`view-btn ${view === 'list' ? 'active' : ''}`} title="List View" onClick={() => setView('list')}>☰</button>
              </div>
            </div>
          </div>

          <div className={`shop-grid ${view === 'list' ? 'list-view' : ''}`} id="shop-products">
            {allProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="pagination">
            <button className="page-btn disabled" aria-label="Previous page">‹</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <span style={{ color: 'var(--gray-1)' }}>...</span>
            <button className="page-btn">12</button>
            <button className="page-btn" aria-label="Next page">›</button>
          </div>
        </section>
      </div>
    </main>
  );
}
