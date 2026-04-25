import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Brain } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const userType = localStorage.getItem('user_type'); // 'patient', 'nutritionist', 'admin'
  const isNutritionist = userType?.toLowerCase() === 'nutritionist';

  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  
  const getDisplayName = () => {
    if (!firstName) return '';
    const lastInitial = lastName ? ` ${lastName.charAt(0)}.` : '';
    const fullName = `${firstName}${lastInitial}`;
    return fullName.length > 15 ? `${firstName.charAt(0)}. ${lastName}` : fullName;
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate('/login');
  };

  const getLinkStyle = (path) => {
    return location.pathname === path ? { color: 'var(--color-highlight)' } : {};
  };

  return (
    <nav className="navbar" id="navbar">
      <Link to="/" className="nav-brand" style={{ 
        fontFamily: "'Instrument Serif', serif", 
        fontSize: '28px', 
        fontWeight: '600', 
        color: '#F3E5AB', 
        letterSpacing: '1px', 
        paddingLeft: '25px',
        textDecoration: 'none'
      }}>
        Hygeia
      </Link>
      
      <div className="nav-links">
        {!isLoggedIn ? (
          /* GUEST VIEW */
          <>
            <Link to="/" className="nav-link" style={getLinkStyle('/')}>Home</Link>
            <Link to="/about" className="nav-link" style={getLinkStyle('/about')}>About</Link>
            
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn-nav-login">
                Login
              </Link>
              <Link to="/signup" className="btn-nav-signup">
                Sign Up
              </Link>
            </div>
          </>
        ) : isNutritionist ? (
          /* NUTRITIONIST VIEW — Professional workspace links, no AI Tracker */
          <>
            <Link to="/publications" className="nav-link" style={getLinkStyle('/publications')}>Publications</Link>
            <Link to="/schedule" className="nav-link" style={getLinkStyle('/schedule')}>Schedule</Link>
            <Link to="/my-patients" className="nav-link" style={getLinkStyle('/my-patients')}>My Patients</Link>
            <Link to="/profile" className="nav-link" style={getLinkStyle('/profile')}>
              {/* Verified badge inline */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Profile
                <span style={{
                  background: 'rgba(136, 182, 153, 0.25)',
                  color: '#88B699',
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  padding: '2px 7px',
                  borderRadius: '99px',
                  letterSpacing: '0.5px',
                }}>PRO</span>
              </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '15px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '15px' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center' }} title="Nutritionist Profile">
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #88B699', background: 'white' }}>
                  <img
                    src={localStorage.getItem('profileImage') || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                    alt="nutritionist"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; }}
                  />
                </div>
              </Link>
              <button onClick={handleLogout} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.85rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </>
        ) : (
          /* PATIENT VIEW — Full experience with AI Tracker */
          <>
            <Link to="/publications" className="nav-link" style={getLinkStyle('/publications')}>Publications</Link>
            <Link to="/ai-tracker" className="nav-link" style={getLinkStyle('/ai-tracker')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Brain size={14} /> AI Tracker
              </span>
            </Link>
            <Link to="/appointments" className="nav-link" style={getLinkStyle('/appointments')}>Appointments</Link>
            <Link to="/profile" className="nav-link" style={getLinkStyle('/profile')}>Profile</Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '15px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '15px' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center' }} title="Profile Settings">
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', background: 'white' }}>
                  <img
                    src={localStorage.getItem('profileImage') || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
                    alt="user"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'; }}
                  />
                </div>
              </Link>
              <button onClick={handleLogout} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.85rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
