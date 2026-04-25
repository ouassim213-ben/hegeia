import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, ArrowRight, LogIn } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import api from '../api';

export default function Auth() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/publications');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('auth/login/', { email, password });
      if(res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        
        const user = res.data.user;
        if (user) {
          localStorage.setItem('firstName', user.first_name || '');
          localStorage.setItem('lastName', user.last_name || '');
          localStorage.setItem('isStaff', user.is_staff ? 'true' : 'false');
          localStorage.setItem('is_superuser', String(user.is_superuser));
          localStorage.setItem('user_type', (user.profile?.role || 'PATIENT').toLowerCase());
        }
        
        if (email === 'ouasssimbenmourallah@yahoo.com' || user.is_staff === true || user.role === 'ADMIN') {
            // ONLY Admin goes to the blue Django page
            window.location.href = "http://127.0.0.1:8000/admin/";
        } else if (user.role === 'NUTRITIONIST' || user.profile?.role === 'NUTRITIONIST') {
            // Nutritionists go to their specific dashboard
            navigate('/dashboard/nutritionist');
        } else {
            // Normal Users stay in the React Site
            const pendingPlan = localStorage.getItem('pendingPlan');
            if (pendingPlan) {
                navigate('/appointments'); // Redirect if they picked a plan
            } else {
                navigate('/publications'); // Standard entry
            }
        }
      }
    } catch(e) {
      if (e.response && e.response.status === 403) {
        alert(e.response.data.error || "Your account is pending admin approval. Please wait.");
      } else {
        alert("Login Error: Please check your credentials");
      }
    }
  };

  return (
    <>
      <nav className="navbar" id="navbar">
        <Link to="/" className="nav-brand">Hygeia</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/landing" className="nav-link">Services</Link>
          <Link to="/signup" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Sign Up <ArrowRight size={18} />
          </Link>
        </div>
      </nav>

      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-cream)' }}>
        <section className="auth-wrapper" style={{ paddingTop: '120px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="auth-box glass-panel animate-fade" style={{ maxWidth: '450px', width: '100%', padding: '3rem', borderRadius: 'var(--radius-lg)', background: 'white', border: '1px solid var(--color-navy)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2.5rem', color: 'var(--color-navy)', fontFamily: 'var(--font-heading)', fontWeight: '400' }}>Welcome Back</h2>
            <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-navy)', opacity: 0.8 }}>Sign in to your account.</p>
            
            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-navy)', fontWeight: '600' }}>Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control" 
                  required 
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', border: '2px solid var(--color-navy)', background: 'white', color: 'var(--color-navy)', fontSize: '1rem', outline: 'none' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-navy)', fontWeight: '600' }}>Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control" 
                  required 
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', border: '2px solid var(--color-navy)', background: 'white', color: 'var(--color-navy)', fontSize: '1rem', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--color-navy)', cursor: 'pointer' }}>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" style={{ color: 'var(--color-olive)', fontSize: '0.9rem', fontWeight: '500', textDecoration: 'none' }}>Forgot Password?</a>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-full)' }}>
                Sign In <LogIn size={20} />
              </button>
              
              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-navy)' }}>
                Don't have an account? <Link to="/signup" style={{ color: 'var(--color-olive)', fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link>
              </p>


            </form>
          </div>
        </section>
      </main>
    </>
  );
}
