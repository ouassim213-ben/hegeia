import React from 'react';
import Navbar from '../components/Navbar';
import { Lightbulb, University, HeartPulse, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '100px' }}>
        <section className="section">
          <div className="container animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h1 className="section-title" style={{ fontSize: '2.5rem', color: 'var(--theme-text)', marginBottom: '1rem', fontWeight: 'bold' }}>L'IA au service de votre santé</h1>
              <p style={{ color: 'var(--theme-text-muted)', fontSize: '1.1rem' }}>Découvrez comment HYGEIA utilise le Deep Learning pour transformer votre nutrition quotidienne.</p>
            </div>
          </div>
        </section>

        <section className="section" style={{ backgroundColor: 'var(--color-bg-light)', padding: '6rem 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
            <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              
              <div className="feature-box" style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-card-border)', borderRadius: 'var(--radius-lg)', padding: '3rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div className="feature-icon" style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', background: 'rgba(133,181,153,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#85B599' }}>
                  <Lightbulb size={32} />
                </div>
                <h4 style={{ color: 'var(--theme-text)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Notre Vision</h4>
                <p style={{ color: 'var(--theme-text-muted)', lineHeight: '1.6' }}>Simplifier le suivi calorique grâce à la reconnaissance d'image instantanée.</p>
              </div>

              <div className="feature-box" style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-card-border)', borderRadius: 'var(--radius-lg)', padding: '3rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div className="feature-icon" style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', background: 'rgba(133,181,153,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#85B599' }}>
                  <University size={32} />
                </div>
                <h4 style={{ color: 'var(--theme-text)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Origine</h4>
                <p style={{ color: 'var(--theme-text-muted)', lineHeight: '1.6' }}>Un projet innovant développé avec passion pour l'Université Constantine 2.</p>
              </div>

              <div className="feature-box" style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-card-border)', borderRadius: 'var(--radius-lg)', padding: '3rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div className="feature-icon" style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', background: 'rgba(133,181,153,0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#85B599' }}>
                  <HeartPulse size={32} />
                </div>
                <h4 style={{ color: 'var(--theme-text)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Engagement</h4>
                <p style={{ color: 'var(--theme-text-muted)', lineHeight: '1.6' }}>Offrir des plans nutritionnels précis et adaptés à chaque métabolisme.</p>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Modern React Footer Mapping directly to the CSS classes */}
      <footer className="footer" style={{ background: 'linear-gradient(170deg, var(--color-primary) 0%, #0c2736 100%)', color: 'white', padding: '6rem 0 2rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
            <div>
              <div className="footer-logo" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white' }}>Hygeia</div>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>Your AI-powered bridge to sustainable wellness.</p>
              <div style={{ fontSize: '1.5rem', display: 'flex', gap: '15px' }}>
                <a href="#" style={{ color: 'white' }}><i className="fab fa-instagram"></i></a>
                <a href="#" style={{ color: 'white' }}><i className="fab fa-twitter"></i></a>
                <a href="#" style={{ color: 'white' }}><i className="fab fa-facebook-f"></i></a>
              </div>
            </div>
            <nav>
              <h5 style={{ color: '#85B599', fontSize: '1.3rem', marginBottom: '1.5rem' }}>Quick Links</h5>
              <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/about" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>About Us</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/appointments" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Nutritionists</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/landing" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Our Plans</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/ai-tracker" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>AI Tracker</Link></li>
              </ul>
            </nav>
            <nav>
              <h5 style={{ color: '#85B599', fontSize: '1.3rem', marginBottom: '1.5rem' }}>Legal</h5>
              <ul className="footer-links" style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Privacy Policy</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Terms of Service</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Cookie Policy</a></li>
              </ul>
            </nav>
            <div>
              <h5 style={{ color: '#85B599', fontSize: '1.3rem', marginBottom: '1.5rem' }}>Newsletter</h5>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', fontSize: '0.9rem' }}>Join for weekly nutrition tips and recipes.</p>
              <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} style={{ display: 'flex', borderRadius: '30px', overflow: 'hidden' }}>
                <input type="email" placeholder="Email address" required style={{ flexGrow: 1, padding: '0.85rem 1.2rem', border: 'none', outline: 'none' }}/>
                <button type="submit" style={{ padding: '0.85rem 1.4rem', border: 'none', background: '#85B599', color: 'white', cursor: 'pointer' }}>
                  <Mail size={18} />
                </button>
              </form>
            </div>
          </div>
          <div className="footer-bottom" style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
            <p>&copy; 2026 Hygeia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
