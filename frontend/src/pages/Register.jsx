import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, ArrowRight, UserPlus, GraduationCap, FileText, Camera } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import api from '../api';

export default function Register() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const [role, setRole] = useState('PATIENT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [tier, setTier] = useState('basic');
  const [bio, setBio] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    if (role === 'NUTRITIONIST' && !certificate) {
      setErrorMsg("Work certificate is mandatory for Nutritionists.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);

      if (role === 'NUTRITIONIST') {
        formData.append('specialty_type', specialty);
        formData.append('tier', tier);
        formData.append('bio', bio);
        if (certificate) {
          formData.append('work_certificate', certificate);
        }
        if (profilePicture) {
          formData.append('image', profilePicture);
        }
      }

      const res = await api.post('auth/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if(res.data) {
        if (role === 'NUTRITIONIST') {
          setSuccessMsg("Registration successful! Your account is pending admin approval.");
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setSuccessMsg("Registration successful! Please sign in.");
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    } catch(e) {
      if (e.response && e.response.data) {
        const backendErrors = Object.values(e.response.data).flat().join(" ");
        setErrorMsg(backendErrors || "Registration Error: Check your details.");
      } else {
        setErrorMsg("Registration Error: Please try again.");
      }
    }
  };

  const navy = '#102a43';
  const gold = '#f0c27b';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <nav style={{ 
        backgroundColor: '#194459', 
        padding: '1rem 5%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <Link to="/" style={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold', textDecoration: 'none', fontFamily: 'serif' }}>Hygeia</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>Home</Link>
          <Link to="/about" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>Services</Link>
          <Link to="/login" style={{ 
            backgroundColor: gold, 
            color: '#102a43', 
            padding: '10px 25px', 
            borderRadius: '25px', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(240, 194, 123, 0.4)'
          }}>
            Sign In <ArrowRight size={18} />
          </Link>
        </div>
      </nav>

      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div style={{ 
          maxWidth: '550px', 
          width: '100%', 
          backgroundColor: 'white', 
          borderRadius: '24px', 
          padding: '3rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          border: 'none'
        }}>
          <h2 style={{ fontSize: '2.2rem', color: '#194459', marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'serif' }}>
            Join Our Community
          </h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2.5rem' }}>
            Start your personalized health journey today.
          </p>

          {(errorMsg || successMsg) && (
            <div style={{ 
              padding: '1rem', 
              borderRadius: '12px', 
              marginBottom: '2rem',
              backgroundColor: errorMsg ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: errorMsg ? '#ef4444' : '#22c55e',
              border: `1px solid ${errorMsg ? '#ef4444' : '#22c55e'}`,
              fontSize: '0.95rem',
              textAlign: 'center'
            }}>
              {errorMsg || successMsg}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Role Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold', color: '#194459' }}>
                I am a:
              </label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  type="button"
                  onClick={() => setRole('PATIENT')}
                  style={{ 
                    flex: 1, 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: `2px solid ${role === 'PATIENT' ? gold : '#e2e8f0'}`,
                    backgroundColor: role === 'PATIENT' ? gold : 'transparent',
                    color: role === 'PATIENT' ? '#102a43' : '#64748b',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Patient
                </button>
                <button 
                  type="button"
                  onClick={() => setRole('NUTRITIONIST')}
                  style={{ 
                    flex: 1, 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: `2px solid ${role === 'NUTRITIONIST' ? gold : '#e2e8f0'}`,
                    backgroundColor: role === 'NUTRITIONIST' ? gold : 'transparent',
                    color: role === 'NUTRITIONIST' ? '#102a43' : '#64748b',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Nutritionist
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <input 
                  type="text" 
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: 'black', outline: 'none' }}
                  required 
                />
              </div>
              <div style={{ flex: 1 }}>
                <input 
                  type="text" 
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: 'black', outline: 'none' }}
                  required 
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: 'black', outline: 'none' }}
                required 
              />
            </div>

            {role === 'NUTRITIONIST' && (
              <div className="animate-fade-in">
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: gold }}>
                    <GraduationCap size={18} /> <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Specialization</span>
                  </div>
                  <select 
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: 'black', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                    required 
                  >
                    <option value="" disabled>Select your specialization</option>
                    <option value="Nutritionist">Nutritionist</option>
                    <option value="Dietitian">Dietitian</option>
                    <option value="Fitness Coach">Fitness Coach</option>
                  </select>
                </div>
                {/* Expertise Tier */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: gold }}>
                    <GraduationCap size={18} /> <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Expertise Tier</span>
                  </div>
                  <select 
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: 'black', outline: 'none', appearance: 'none', cursor: 'pointer' }}
                    required 
                  >
                    <option value="basic">Junior (Quick Start Plan)</option>
                    <option value="standard">Certified (1 Month Plan)</option>
                    <option value="premium">Expert (Golden Plan)</option>
                  </select>
                </div>
                {/* Profile Picture Upload */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: gold }}>
                    <Camera size={18} /> <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Profile Picture</span>
                  </div>
                  <div style={{ 
                    border: `2px dashed #e2e8f0`, 
                    borderRadius: '12px', 
                    padding: '1.5rem', 
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    <input 
                      type="file" 
                      onChange={(e) => setProfilePicture(e.target.files[0])}
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        opacity: 0, 
                        cursor: 'pointer' 
                      }}
                      required={role === 'NUTRITIONIST'}
                      accept="image/*"
                    />
                    <div style={{ color: '#64748b' }}>
                      {profilePicture ? (
                        <span style={{ color: gold, fontWeight: 'bold' }}>{profilePicture.name}</span>
                      ) : (
                        "Upload a professional photo"
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: gold }}>
                    <FileText size={18} /> <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Professional Bio</span>
                  </div>
                  <textarea 
                    placeholder="Tell us about your experience and qualifications..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: 'black', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                    required 
                  />
                </div>
                {/* File Upload Section */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: gold }}>
                    <FileText size={18} /> <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Work Certificate (PDF/Image)</span>
                  </div>
                  <div style={{ 
                    border: `2px dashed #e2e8f0`, 
                    borderRadius: '12px', 
                    padding: '1.5rem', 
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer',
                    position: 'relative'
                  }}>
                    <input 
                      type="file" 
                      onChange={(e) => setCertificate(e.target.files[0])}
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        opacity: 0, 
                        cursor: 'pointer' 
                      }}
                      required={role === 'NUTRITIONIST'}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <div style={{ color: '#64748b' }}>
                      {certificate ? (
                        <span style={{ color: gold, fontWeight: 'bold' }}>{certificate.name}</span>
                      ) : (
                        "Click or drag certificate here"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: 'black', outline: 'none' }}
                required 
              />
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <input 
                type="password" 
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: 'black', outline: 'none' }}
                required 
              />
            </div>

            <button type="submit" style={{ 
              width: '100%', 
              padding: '1.2rem', 
              border: 'none', 
              borderRadius: '50px', 
              backgroundColor: navy, 
              color: 'white', 
              fontSize: '1.1rem', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: `0 10px 30px ${navy}44`,
              transition: 'transform 0.2s ease'
            }}>
              Sign Up <UserPlus size={22} />
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b' }}>
            Already have an account? <Link to="/login" style={{ color: gold, fontWeight: 'bold', textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
