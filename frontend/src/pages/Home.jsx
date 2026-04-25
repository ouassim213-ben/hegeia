import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Moon, Flame, Apple, Dumbbell, ArrowRight, Shield, Zap, MessageSquare, Camera, Users, TrendingUp, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { PLANS } from './Plans';

// Import hero image
import heroImage from '../assets/hero_new.png';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (localStorage.getItem('token')) {
      navigate('/publications');
    }
  }, [navigate]);

  const [activeService, setActiveService] = useState(null);

  const servicesList = [
    {
      id: 'ai-tracking',
      icon: <Camera size={32} />,
      title: 'AI Nutrition Tracking',
      desc: 'Real-time analysis of meals using computer vision.',
      advantages: ['Instant calorie & macro breakdowns', 'Image recognition technology', 'Seamless meal logging']
    },
    {
      id: 'consultations',
      icon: <Users size={32} />,
      title: 'Professional Consultations',
      desc: 'Direct access to certified nutritionists.',
      advantages: ['1-on-1 personalized advice', 'Video & chat support', 'Certified professionals']
    },
    {
      id: 'smart-plans',
      icon: <Apple size={32} />,
      title: 'Smart Meal Plans',
      desc: 'Data-driven plans tailored to your health goals.',
      advantages: ['Customized to your macros', 'Allergy & preference aware', 'Weekly shopping lists']
    },
    {
      id: 'analytics',
      icon: <TrendingUp size={32} />,
      title: 'Progress Analytics',
      desc: 'Detailed reports on your health journey.',
      advantages: ['Visual progress charts', 'Weekly & monthly summaries', 'Data-driven adjustments']
    }
  ];

  return (
    <div className="home-container">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="hero-wrapper">
        <div className="container-wide hero-grid">
          <div className="hero-text">
            <h1 className="text-navy">Your Health,<br />AI-Powered.</h1>
            <p className="text-muted">
              Experience a new era of wellness. We combine advanced artificial intelligence 
              with expert medical data to help you achieve your health goals with scientific precision.
            </p>
            <Link to="/signup" className="btn-primary-modern">
              Get Started <ArrowRight size={20} />
            </Link>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="AI Health Wellness" />
          </div>
        </div>
      </section>

      {/* 2. OUR SERVICES SECTION */}
      <section className="services-section" style={{ backgroundColor: '#f8fafc', padding: '6rem 5%' }}>
        <div className="container-wide">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 className="section-title">Our Services</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Comprehensive health solutions combining artificial intelligence with professional medical expertise.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {servicesList.map((service) => (
              <div 
                key={service.id}
                onClick={() => setActiveService(activeService === service.id ? null : service.id)}
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '20px', 
                  padding: '2.5rem 2rem', 
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  boxShadow: activeService === service.id ? '0 20px 40px rgba(25, 68, 89, 0.1)' : '0 4px 6px rgba(0,0,0,0.02)',
                  transform: activeService === service.id ? 'translateY(-5px)' : 'none',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  color: '#10b981', 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  {service.icon}
                </div>
                <h3 style={{ color: '#194459', fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                  {service.title}
                </h3>
                <p style={{ color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {service.desc}
                </p>
                
                {/* Expandable Advantages Area */}
                <div style={{ 
                  overflow: 'hidden', 
                  transition: 'max-height 0.4s ease, opacity 0.4s ease', 
                  maxHeight: activeService === service.id ? '300px' : '0',
                  opacity: activeService === service.id ? 1 : 0,
                  width: '100%',
                  marginTop: 'auto'
                }}>
                  <div style={{ padding: '1rem 0', borderTop: '1px solid #f1f5f9' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', textAlign: 'left' }}>
                      {service.advantages.map((adv, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem', color: '#334155', fontSize: '0.95rem' }}>
                          <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span> {adv}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        localStorage.setItem('serviceIntent', service.id);
                        navigate('/signup');
                      }}
                      style={{ 
                        width: '100%', 
                        padding: '1rem', 
                        backgroundColor: '#10b981', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '12px', 
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                    >
                      Start Now with this Service
                    </button>
                  </div>
                </div>
                
                {/* Expand indicator when not active */}
                <div style={{ 
                  marginTop: activeService === service.id ? '0' : 'auto',
                  display: activeService === service.id ? 'none' : 'block',
                  color: '#10b981',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  Learn More ↓
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PREMIUM NUTRITION PLANS GRID */}
      <section className="plans-section">
        <div className="container-wide">
          <h2 className="section-title">Premium Nutrition Plans</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
            Choose the right scientific plan for your specialized journey.
          </p>
          <div className="plans-grid-modern" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {Object.values(PLANS).map((plan) => (
              <div key={plan.id} className="plan-card-modern" style={{ background: '#ffffff', borderRadius: '24px', padding: '2.5rem', display: 'flex', flexDirection: 'column', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: '800', marginBottom: '2rem' }}>
                  {plan.name}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {plan.iconSVG}
                  </div>
                  <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{plan.price}</span>
                </div>

                <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', lineHeight: '1.5', marginBottom: '2rem', minHeight: '40px' }}>
                  {plan.tagline}
                </p>

                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', marginBottom: '2rem' }} />

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flexGrow: 1 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                      <span style={{ color: '#d4af37', fontWeight: 'bold' }}>✓</span>
                      <span style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => {
                    localStorage.setItem('pendingPlan', plan.id);
                    navigate('/signup');
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CHATBOT SECTION — Simple & Clean AI Intro */}
      <section className="chatbot-simple-section">
        <div className="chatbot-simple-inner">
          <div className="chatbot-badge-simple">AI Support</div>
          <h2 className="chatbot-title-simple">Instant Health Solutions</h2>
          
          <div className="chatbot-simple-window">
            <div className="chatbot-simple-messages">
              {/* User Message */}
              <div className="chat-msg-row user-row">
                <div className="chat-bubble-simple user-bubble">
                  What is HYGEIA and how can it help me?
                </div>
              </div>

              {/* Bot Message */}
              <div className="chat-msg-row bot-row">
                <div className="bot-icon-small">
                  <MessageSquare size={16} color="#88B699" />
                </div>
                <div className="chat-bubble-simple bot-bubble">
                  <strong>HYGEIA AI:</strong> <br />
                  HYGEIA is your all-in-one health companion. We use AI to track your nutrition via photos and connect you with expert nutritionists for personalized care.
                </div>
              </div>
            </div>

            <div className="chatbot-simple-footer">
              <Link to="/ai-tracker" className="btn-simple-cta">
                Try it now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container-wide">
          <p>© 2026 HYGEIA — Premier Health-Tech Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
