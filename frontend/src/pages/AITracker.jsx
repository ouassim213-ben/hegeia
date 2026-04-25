import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Camera, Brain, PieChart, UploadCloud, Settings, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AITracker() {
  const [scanState, setScanState] = useState('upload'); // 'upload', 'scanning', 'result'
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const userType = localStorage.getItem('user_type');

  useEffect(() => {
    if (userType === 'NUTRITIONIST') {
      navigate('/dashboard/nutritionist');
    }
  }, [userType, navigate]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        setPreviewImage(event.target.result);
        setScanState('scanning');
        
        try {
          // Simulated delay for UI aesthetics
          await new Promise(r => setTimeout(r, 2000));
          
          // Simulated API Call
          const mealData = {
            image_url: "uploaded_image",
            calories: 645,
            protein: 42,
            carbs: 54,
            fats: 28
          };
          
          /* 
          // Placeholder for real fetch
          const res = await fetch('http://192.168.1.103:8000/api/meals/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mealData)
          }); 
          */

          setScanState('result');
        } catch(error) {
          console.error("Tracker Error:", error);
          alert("Backend connection failed.");
          setScanState('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="section" style={{ paddingTop: '130px', minHeight: '100vh' }}>
          <div className="tracker-container animate-fade" style={{ maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative' }}>
            
            <div className="page-header" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '12px', color: 'var(--theme-text)' }}>AI Nutrition Scanner</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                Upload a photo of your meal and let our AI do the math.
              </p>
            </div>

            {/* Step-by-Step Guide */}
            <h2 className="section-title" style={{ fontSize: '1.8rem', color: 'var(--theme-text)', marginBottom: '2rem', textAlign: 'center', fontWeight: 'bold' }}>
              Step-by-Step Guide
            </h2>
            <div className="step-grid" style={{ display: 'flex', gap: '1.5rem', marginBottom: '4.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div className="step-card" style={{ flex: 1, minWidth: '250px', background: 'var(--theme-card-bg)', border: '1px solid var(--theme-card-border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                <div className="step-icon" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--theme-step-circle-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--theme-step-circle-color)', background: 'var(--theme-step-circle-bg)' }}>
                  <Camera size={32} />
                </div>
                <h3 className="step-title" style={{ color: 'var(--theme-text)', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px' }}>Step 1: Capture</h3>
                <p className="step-desc" style={{ color: 'var(--theme-text-muted)', fontSize: '1.05rem', lineHeight: '1.5' }}>Take a clear photo of your meal directly from the app.</p>
              </div>
              
              <div className="step-card" style={{ flex: 1, minWidth: '250px', background: 'var(--theme-card-bg)', border: '1px solid var(--theme-card-border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                <div className="step-icon" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--theme-step-circle-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--theme-step-circle-color)', background: 'var(--theme-step-circle-bg)' }}>
                  <Brain size={32} />
                </div>
                <h3 className="step-title" style={{ color: 'var(--theme-text)', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px' }}>Step 2: AI Analysis</h3>
                <p className="step-desc" style={{ color: 'var(--theme-text-muted)', fontSize: '1.05rem', lineHeight: '1.5' }}>Our Neural Network identifies ingredients, portions, and nutritional density.</p>
              </div>
              
              <div className="step-card" style={{ flex: 1, minWidth: '250px', background: 'var(--theme-card-bg)', border: '1px solid var(--theme-card-border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                <div className="step-icon" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid var(--theme-step-circle-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--theme-step-circle-color)', background: 'var(--theme-step-circle-bg)' }}>
                  <PieChart size={32} />
                </div>
                <h3 className="step-title" style={{ color: 'var(--theme-text)', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '12px' }}>Step 3: Results</h3>
                <p className="step-desc" style={{ color: 'var(--theme-text-muted)', fontSize: '1.05rem', lineHeight: '1.5' }}>Receive a detailed report with Calories, Macros, and Health Score.</p>
              </div>
            </div>

            {/* The Demo (Upload Area) */}
            <h2 className="section-title" style={{ fontSize: '1.8rem', color: 'var(--theme-text)', marginBottom: '2.5rem', textAlign: 'center', fontWeight: 'bold' }}>
              Try the AI Scanner Now
            </h2>
            <div 
              className={`tracker-box ${scanState === 'result' ? 'has-result' : ''}`}
              style={{
                background: scanState === 'result' ? 'var(--theme-card-bg)' : 'rgba(255,255,255,0.05)',
                border: scanState === 'result' ? '1px solid var(--theme-card-border)' : '2px dashed #85B599',
                borderRadius: 'var(--radius-lg)',
                padding: scanState === 'result' ? '0' : '3rem',
                minHeight: '480px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              
              {/* State 1: Upload Zone */}
              {scanState === 'upload' && (
                <div id="state-1" style={{ textAlign: 'center', width: '100%' }}>
                  <button 
                    className="btn-upload" 
                    onClick={() => fileInputRef.current.click()}
                    style={{ background: '#194459', color: 'white', padding: '1.2rem 3.5rem', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.25rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}
                  >
                    <UploadCloud color="#85B599" size={24} /> Upload Image
                  </button>
                  <p className="upload-subtitle" style={{ color: 'var(--theme-text-muted)', fontSize: '1.2rem', fontWeight: '500' }}>Analyze your meal in seconds</p>
                  <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                </div>
              )}

              {/* State 2: Scanning Animation */}
              {scanState === 'scanning' && (
                <div id="state-2" style={{ width: '100%', textAlign: 'center' }}>
                  <div className="scan-image-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '450px', margin: '0 auto 1.5rem', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '2px solid #85B599' }}>
                    <img src={previewImage} alt="Scanning" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '400px' }} />
                    <div className="laser-line" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '4px', background: '#10b981', boxShadow: '0 0 28px 10px rgba(16, 185, 129, 0.85)', animation: 'scan-anim 1.5s infinite alternate ease-in-out', zIndex: 5 }}></div>
                  </div>
                  <div className="processing-msg" style={{ color: 'var(--theme-text)', fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
                    <Settings className="fa-spin" color="#85B599" size={24} /> Extracting nutritional data...
                  </div>
                  <style>{`
                    @keyframes scan-anim { 0% { top: 0%; } 100% { top: calc(100% - 4px); } }
                    .fa-spin { animation: spin 2s linear infinite; }
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                  `}</style>
                </div>
              )}

              {/* State 3: Blurred Result & Paywall */}
              {scanState === 'result' && (
                <div id="state-3" className="result-wrapper" style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: 'var(--radius-lg)', minHeight: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  
                  {/* Background Content */}
                  <div 
                    className="blurred-content" 
                    style={{ 
                      padding: '3rem', 
                      width: '100%', 
                      height: '100%', 
                      background: 'rgba(133,181,153,0.08)'
                    }}
                  >
                    <h3 style={{ color: 'var(--theme-text)', fontSize: '2rem', marginBottom: '25px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <CheckCircle color="#85B599" size={32} /> Analysis Confirmed
                    </h3>
                    
                    <div className="macro-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '20px', textAlign: 'center', marginTop: '2.5rem' }}>
                      <div className="macro-card" style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-card-border)', borderRadius: '12px', padding: '20px' }}>
                        <h4 style={{ color: 'var(--theme-text-muted)', fontSize: '1.1rem', marginBottom: '8px', fontWeight: '500' }}>Calories</h4>
                        <div className="val" style={{ color: '#85B599', fontSize: '2.2rem', fontWeight: 'bold' }}>450kcal</div>
                      </div>
                      <div className="macro-card" style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-card-border)', borderRadius: '12px', padding: '20px' }}>
                        <h4 style={{ color: 'var(--theme-text-muted)', fontSize: '1.1rem', marginBottom: '8px', fontWeight: '500' }}>Protein</h4>
                        <div className="val" style={{ color: '#85B599', fontSize: '2.2rem', fontWeight: 'bold' }}>30g</div>
                      </div>
                      <div className="macro-card" style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-card-border)', borderRadius: '12px', padding: '20px' }}>
                        <h4 style={{ color: 'var(--theme-text-muted)', fontSize: '1.1rem', marginBottom: '8px', fontWeight: '500' }}>Carbs</h4>
                        <div className="val" style={{ color: '#85B599', fontSize: '2.2rem', fontWeight: 'bold' }}>50g</div>
                      </div>
                      <div className="macro-card" style={{ background: 'var(--theme-card-bg)', border: '1px solid var(--theme-card-border)', borderRadius: '12px', padding: '20px' }}>
                        <h4 style={{ color: 'var(--theme-text-muted)', fontSize: '1.1rem', marginBottom: '8px', fontWeight: '500' }}>Fats</h4>
                        <div className="val" style={{ color: '#85B599', fontSize: '2.2rem', fontWeight: 'bold' }}>15g</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                      <button 
                        onClick={() => setScanState('upload')}
                        style={{ padding: '1rem 2rem', background: '#85B599', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                      >
                        Scan Another Meal
                      </button>
                    </div>

                  </div>

                </div>
              )}

            </div>
          </div>
        </section>
      </main>
    </>
  );
}
