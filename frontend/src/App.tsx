import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// Interfaces
// ==========================================

interface TimelineEvent {
  time: string;
  event: string;
  status: string;
}

interface Employee {
  id: string;
  name: string;
  gender: string;
  designation: string;
  department: string;
  photo_url: string;
  age: number;
  joining_date: string;
  anniversary_milestone: string;
  hobbies: string[];
  activities: string[];
  caricature_url: string | null;
  status: 'Awaiting Stylization' | 'Generating' | 'Ready for Review' | 'Approved';
  progress: number;
  tags: string[];
  timeline: TimelineEvent[];
  email?: string;
  role?: string;
  job_title?: string;
  anniversary_date?: string;
}

// ==========================================
// Inline SVG Icon Components
// ==========================================

const IconDashboard = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="10" rx="1" />
    <rect width="7" height="5" x="3" y="14" rx="1" />
  </svg>
);

const IconClock = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

// const IconPaintbrush = () => (
//   <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="m12 22 1-1c1.4-1.4 2.4-3.2 3-5 .2-.7.7-1.3 1.4-1.5 1.8-.6 3.6-1.6 5-3l-10-10c-1.4 1.4-2.4 3.2-3 5-.2.7-.7 1.3-1.4 1.5-1.8.6-3.6 1.6-5 3l1 1h5l1 1" />
//   </svg>
// );

const IconPalette = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10c1.378 0 2.5-1.122 2.5-2.5 0-.649-.247-1.24-.65-1.688A1.493 1.493 0 0 1 13.5 16.5c0-.828.672-1.5 1.5-1.5h1.5c4.418 0 8-3.582 8-8C24.5 4.686 18.918 2 12 2Z"/>
  </svg>
);

const IconSettings = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconFileText = ({ className = "w-4.5 h-4.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);

const IconSearch = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconChevronDown = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconUserPlus = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const IconAlertTriangle = ({ className = "w-4.5 h-4.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconCheckCircle2 = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconVolume2 = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const IconDownload = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconMessageSquare = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconSparkles = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const IconRotateCw = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <polyline points="21 3 21 8 16 8" />
  </svg>
);

const IconEdit2 = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const IconPlus = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconX = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCalendar = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconTag = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l7.29-7.29a1 1 0 0 0 0-1.42z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const IconCoffee = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" y1="2" x2="6" y2="4" />
    <line x1="10" y1="2" x2="10" y2="4" />
    <line x1="14" y1="2" x2="14" y2="4" />
  </svg>
);

const IconPlane = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 20.19 14 17.5H4.5a1.5 1.5 0 0 1 0-3h4.68l-3.32-6 2.37-1.37 5.56 5.87h6.69a2 2 0 0 1 2 2c0 .9-.68 1.63-1.56 1.83Z" />
  </svg>
);

// ==========================================
// Speech Synthesis Generator
// ==========================================

const playAnniversaryWishText = (employee: Employee) => {
  if (!('speechSynthesis' in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech narration
  window.speechSynthesis.cancel();

  const milestoneClean = employee.anniversary_milestone.replace(' Anniversary', '');
  
  const hobbiesText = employee.hobbies && employee.hobbies.length > 0
    ? `whose hobbies include ${employee.hobbies.join(', ')}`
    : 'who has a vibrant set of hobbies';
    
  const activitiesText = employee.activities && employee.activities.length > 0
    ? `loves participating in ${employee.activities.join(', ')}`
    : 'enjoys engaging in team challenges';

  const phrase = `Happy ${milestoneClean} Work Anniversary, ${employee.name}! Thank you for being our incredible ${employee.designation} in the ${employee.department} department! We celebrate you as someone ${hobbiesText}, and who ${activitiesText}. Have a fantastic milestone day!`;

  const utterance = new SpeechSynthesisUtterance(phrase);

  let voices = window.speechSynthesis.getVoices();

  const speakUtterance = () => {
    const englishVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
    if (englishVoices.length > 0) {
      const charSum = employee.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const voiceIndex = charSum % englishVoices.length;
      utterance.voice = englishVoices[voiceIndex];
    }

    const seed = employee.name.length;
    utterance.pitch = 1.15 + (seed % 3) * 0.05; 
    utterance.rate = 0.95 + (seed % 2) * 0.05; 
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  if (!voices || voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
      speakUtterance();
    };
  } else {
    speakUtterance();
  }
};

// ==========================================
// Inner Component: ConfettiEffect
// ==========================================

const ConfettiEffect: React.FC<{ trigger: number }> = ({ trigger }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles: any[] = [];
    const colors = ['#FF2A7A', '#00FFE0', '#7000FF', '#FFB800', '#00FF66'];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const initCannon = () => {
      particles = [];
      const numParticles = 140;
      // Burst from left corner
      for (let i = 0; i < numParticles / 2; i++) {
        particles.push({
          x: 0,
          y: height,
          vx: Math.random() * 12 + 6,
          vy: -(Math.random() * 18 + 12),
          r: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5,
          opacity: 1,
        });
      }
      // Burst from right corner
      for (let i = 0; i < numParticles / 2; i++) {
        particles.push({
          x: width,
          y: height,
          vx: -(Math.random() * 12 + 6),
          vy: -(Math.random() * 18 + 12),
          r: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5,
          opacity: 1,
        });
      }
    };

    initCannon();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravity
        p.vx *= 0.98; // Air resistance
        p.vy *= 0.98;
        p.rotation += p.rotationSpeed;

        if (p.y > height - 10) {
          p.opacity -= 0.015;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        ctx.restore();
      });

      // Filter out dead particles
      particles = particles.filter(p => p.opacity > 0 && p.y < height + 50 && p.x > -50 && p.x < width + 50);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [trigger]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />;
};

// ==========================================
// Inner Component: CelebrationShowcase
// ==========================================

interface CelebrationShowcaseProps {
  employees: Employee[];
  onClose: () => void;
}

const CelebrationShowcase: React.FC<CelebrationShowcaseProps> = ({ employees, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Filter only employees with caricature ready or approved
  const celebrating = employees.filter(
    emp => emp.caricature_url || emp.status === 'Approved' || emp.status === 'Ready for Review'
  );

  const list = celebrating.length > 0 ? celebrating : employees;

  useEffect(() => {
    if (list.length === 0) return;
    
    // Play initial voice wish after short delay
    const t = setTimeout(() => {
      playAnniversaryWishText(list[currentIndex]);
      setConfettiTrigger(prev => prev + 1);
    }, 800);

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (list.length === 0 || !autoPlay) return;

    const interval = setInterval(() => {
      handleNext();
    }, 9000);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay, list]);

  const handleNext = () => {
    if (list.length === 0) return;
    const nextIdx = (currentIndex + 1) % list.length;
    setCurrentIndex(nextIdx);
    setConfettiTrigger(prev => prev + 1);
    playAnniversaryWishText(list[nextIdx]);
  };

  const handlePrev = () => {
    if (list.length === 0) return;
    const prevIdx = (currentIndex - 1 + list.length) % list.length;
    setCurrentIndex(prevIdx);
    setConfettiTrigger(prev => prev + 1);
    playAnniversaryWishText(list[prevIdx]);
  };

  const handlePlayWish = () => {
    if (list.length === 0) return;
    playAnniversaryWishText(list[currentIndex]);
    setConfettiTrigger(prev => prev + 1);
  };

  if (list.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#090A0F] z-50 flex flex-col items-center justify-center p-6 text-center select-none">
        <h2 className="text-2xl font-black text-white mb-2">No Active Anniversaries</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-sm">Please register some employees and generate caricatures in the admin panel first.</p>
        <button onClick={onClose} className="py-2.5 px-6 rounded-xl bg-neonPink hover:bg-[#E02269] text-white font-bold text-sm shadow-glow transition-all">
          Exit Showcase
        </button>
      </div>
    );
  }

  const current = list[currentIndex];
  const photoUrl = current.caricature_url || current.photo_url;
  const getPhotoUrl = (url: string) => url.startsWith('/static') ? `http://localhost:8000${url}` : url;

  return (
    <div className="fixed inset-0 bg-[#090A0F] z-50 flex flex-col justify-between h-screen w-screen overflow-hidden select-none text-slate-100">
      <ConfettiEffect trigger={confettiTrigger} />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonPink/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#00FFE0]/5 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Header Bar */}
      <header className="p-6 flex items-center justify-between border-b border-slate-900 bg-[#090A0F]/80 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-3">
          <div className="w-3.5 h-3.5 rounded-full bg-neonPink animate-ping"></div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider text-white">
              CELEBRATION <span className="text-neonPink">SHOWCASE</span>
            </h1>
            <span className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase mt-0.5">
              MILESTONE SLIDESHOW MODE
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800 px-3.5 py-1.5 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Auto-Play</span>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${autoPlay ? 'bg-neonPink' : 'bg-slate-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoPlay ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <button
            onClick={onClose}
            className="py-2 px-4 border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>Exit Fullscreen</span>
          </button>
        </div>
      </header>

      {/* Central Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full flex items-center justify-center px-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          {/* Left Side: Massive Glowing Caricature */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-slate-800/80 bg-[#0F1015] shadow-pinkGlow group cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
              <img
                src={getPhotoUrl(photoUrl)}
                alt={current.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] text-[#00FFE0] font-black uppercase tracking-widest text-glow-cyan mb-1">
                  Stylized Caricature Profile
                </span>
                <h3 className="text-2xl font-black text-white">{current.name}</h3>
              </div>
            </div>
          </div>

          {/* Right Side: Congratulations details */}
          <div className="space-y-6 flex flex-col justify-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-500/20 bg-pink-950/10 text-xs font-extrabold text-neonPink uppercase tracking-widest text-glow-pink mb-4">
                🎉 Work Anniversary
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 leading-tight">
                {current.anniversary_milestone.replace(' Anniversary', '').replace('st', '').replace('nd', '').replace('rd', '').replace('th', '')} Years of <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-[#00FFE0] text-glow-pink">Excellence</span>
              </h2>
              <p className="text-lg font-bold text-slate-400">
                {current.designation} in <span className="text-white">{current.department}</span>
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850/80 backdrop-blur-md space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "We celebrate {current.name} as a valuable and key member of the team! Outside of making things happen, we know they are passionate about {current.hobbies.join(', ')} and {current.activities.join(', ')}. Happy Work Anniversary!"
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {current.hobbies.map((hobby) => (
                  <span key={hobby} className="px-3 py-1 bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 rounded-lg">
                    # {hobby}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayWish}
                className="py-3 px-6 rounded-2xl bg-[#00FFE0] hover:bg-[#00E5FF] text-slate-950 font-black text-sm shadow-cyanGlow transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <IconVolume2 className="w-4 h-4 stroke-[2.5]" />
                <span>Play Greeting Audio</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="p-6 border-t border-slate-900 bg-[#090A0F]/80 backdrop-blur-sm z-10 flex items-center justify-between">
        <div className="text-xs text-slate-500 font-semibold tracking-wider">
          SLIDE {currentIndex + 1} OF {list.length}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-3 border border-slate-850 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl transition-all"
            title="Previous Celebrant"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="p-3 border border-slate-850 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl transition-all"
            title="Next Celebrant"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 12 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Milestone: {current.anniversary_milestone}
        </div>
      </footer>
    </div>
  );
};

// ==========================================
// Inner Component: Login Screen
// ==========================================

interface LoginProps {
  onLoginSuccess: (user: Employee, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data.user, data.token);
      } else {
        const errData = await res.json();
        setError(errData.detail || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError('Connection to auth server failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#090A0F] z-50 flex items-center justify-center p-6 select-none font-sans bg-radial-gradient">
      {/* Glow balls */}
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-neonPink/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[#00FFE0]/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 z-10 backdrop-blur-md">
        <div className="text-center space-y-1.5">
          <h1 className="font-extrabold text-2xl tracking-wider text-white">
            HR <span className="text-neonPink">CORE AI</span>
          </h1>
          <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase block">
            CELEBRATE & ENGAGE PLATFORM
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-450 text-xs rounded-xl flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090A0F] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-neonPink/50 transition-colors"
              placeholder="e.g. sarah@company.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#090A0F] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-neonPink/50 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-neonPink to-violet-650 hover:from-neonPink hover:to-violet-750 text-white rounded-xl text-xs font-black shadow-glow transition-all active:scale-[0.98]"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="border-t border-slate-900 pt-4 text-center">
          <p className="text-[10px] text-slate-600 font-semibold leading-relaxed">
            Quick credentials:<br />
            HR Admin: <span className="text-slate-400">admin@company.com / admin123</span><br />
            Employee: <span className="text-slate-400">sarah@company.com / password123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: Sidebar
// ==========================================

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onGenerateReport: () => void;
  onLaunchCelebration: () => void;
  currentUser: Employee;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onGenerateReport, 
  onLaunchCelebration,
  currentUser,
  onLogout
}) => {
  const today = new Date();
  const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
  const currentDay = String(today.getDate()).padStart(2, '0');
  const todayStr = `${currentMonth}-${currentDay}`;
  const isAnniversary = currentUser.anniversary_date === todayStr;

  const menuItems = currentUser.role === 'HR'
    ? [
        { id: 'dashboard', name: 'Dashboard', icon: IconDashboard },
        { id: 'queue', name: 'Anniversary Queue', icon: IconClock },
        { id: 'picture-canvas', name: 'Picture Canvas', icon: IconPalette },
        { id: 'employees', name: 'Employees', icon: IconUsers },
        { id: 'employee-portal', name: 'Employee Portal', icon: IconSettings },
      ]
    : [
        { id: 'dashboard', name: 'Feed Dashboard', icon: IconDashboard },
        ...(isAnniversary ? [{ id: 'anniversary-dashboard', name: 'Anniversary Wishes', icon: IconSparkles }] : []),
        { id: 'employees', name: 'Coworkers Directory', icon: IconUsers },
        { id: 'my-profile', name: 'My Profile Card', icon: IconPalette },
      ];

  const getPhotoUrl = (url: string) => {
    if (!url) return '/admin_avatar.png';
    return url.startsWith('/static') ? `http://localhost:8000${url}` : url;
  };

  return (
    <aside className="w-64 bg-[#090A0F] border-r border-slate-900 flex flex-col h-screen shrink-0 justify-between select-none">
      <div>
        <div className="p-6">
          <div className="flex flex-col">
            <h1 className="font-extrabold text-xl tracking-wider text-white">
              HR <span className="text-neonPink">CORE AI</span>
            </h1>
            <span className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase mt-0.5">
              {currentUser.role === 'HR' ? 'ENTERPRISE ADMIN' : 'EMPLOYEE CELEBRATE'}
            </span>
          </div>

          <button
            onClick={onLaunchCelebration}
            className="w-full mt-5 py-2.5 px-4 bg-gradient-to-r from-neonPink to-violet-650 hover:from-[#E02269] hover:to-violet-750 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-glow active:scale-[0.98]"
          >
            <IconSparkles className="w-4 h-4 animate-pulse" />
            <span>Celebration Mode</span>
          </button>
        </div>

        <nav className="px-3 space-y-1 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-lg transition-all duration-150 ${
                  isActive 
                    ? 'bg-neonPink text-white font-semibold shadow-glow' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 space-y-4">
        {currentUser.role === 'HR' && (
          <button 
            onClick={onGenerateReport}
            className="w-full py-3 px-4 rounded-xl bg-[#00FFE0] hover:bg-[#00E5CC] text-slate-950 text-sm font-bold flex items-center justify-center space-x-2 transition-all duration-200 active:scale-[0.98] shadow-[0_0_12px_rgba(0,255,224,0.15)]"
          >
            <IconFileText />
            <span>Generate Reports</span>
          </button>
        )}

        <div className="bg-[#12131A] border border-slate-900/60 rounded-2xl p-3 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={getPhotoUrl(currentUser.photo_url)} 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-800"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-450 rounded-full border-2 border-[#12131A]"></span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-200 truncate leading-tight">{currentUser.name}</span>
              <span className="text-[9px] text-slate-500 truncate mt-0.5">{currentUser.role === 'HR' ? 'HR Manager' : currentUser.designation}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-red-400 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-wider"
          >
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

// ==========================================
// Inner Component: KPICards
// ==========================================

interface KPICardsProps {
  pendingCount: number;
  awaitingCount: number;
  scheduledCount: number;
}

const KPICards: React.FC<KPICardsProps> = ({ pendingCount, awaitingCount, scheduledCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 select-none">
      <div className="bg-[#12131A] border border-slate-900 rounded-xl p-5 flex flex-col justify-between h-[120px] transition-all hover:border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          PENDING GENERATION
        </span>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl font-extrabold text-neonPink">{pendingCount}</span>
          <div className="flex items-center space-x-2 text-neonPink text-xs font-semibold">
            <svg className="w-14 h-6 stroke-current stroke-[2] fill-none" viewBox="0 0 50 20">
              <path d="M0 15 Q 12 5, 25 12 T 50 5" />
            </svg>
            <span>~ 2%</span>
          </div>
        </div>
      </div>

      <div className="bg-[#12131A] border border-slate-900 rounded-xl p-5 flex flex-col justify-between h-[120px] transition-all hover:border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          AWAITING APPROVAL
        </span>
        <div className="flex flex-col mt-2">
          <span className="text-3xl font-extrabold text-[#00FFE0]">{awaitingCount}</span>
          <span className="text-slate-500 text-xs mt-1 font-medium">Target: 0</span>
        </div>
      </div>

      <div className="bg-[#12131A] border border-slate-900 rounded-xl p-5 flex flex-col justify-between h-[120px] transition-all hover:border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          SCHEDULED THIS WEEK
        </span>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-3xl font-extrabold text-white">{scheduledCount}</span>
          <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold">
            <IconCheckCircle2 className="w-4 h-4 fill-emerald-950/40" />
            <span>On Track</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: FilterBar
// ==========================================

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  deptFilter: string;
  setDeptFilter: (filter: string) => void;
  departments: string[];
  onUploadTrigger: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  deptFilter,
  setDeptFilter,
  departments,
  onUploadTrigger,
}) => {
  return (
    <div className="bg-[#12131A] border border-slate-900 rounded-xl p-3 flex flex-col lg:flex-row gap-4 items-center justify-between mb-8 select-none">
      <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
        <div className="relative w-full sm:w-72">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee names..."
            className="w-full pl-10 pr-4 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-neonPink/50 transition-colors"
          />
        </div>
        
        <button
          onClick={onUploadTrigger}
          className="w-full sm:w-auto py-2 px-4 bg-neonPink/10 hover:bg-neonPink/20 text-neonPink border border-neonPink/30 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(255,42,122,0.1)] active:scale-[0.98] shrink-0"
        >
          <IconUserPlus />
          <span>Register Milestone</span>
        </button>
      </div>

      <div className="flex w-full sm:w-auto items-center gap-3 justify-end">
        <div className="relative min-w-[130px] w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-[#090A0F] border border-slate-800/80 hover:border-slate-700/80 px-4 py-2 pr-9 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-neonPink/50 transition-colors cursor-pointer"
          >
            <option value="All">Status: All</option>
            <option value="Awaiting Stylization">Awaiting Stylization</option>
            <option value="Generating">Generating</option>
            <option value="Ready for Review">Ready for Review</option>
            <option value="Approved">Approved</option>
          </select>
          <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>

        <div className="relative min-w-[140px] w-full sm:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full appearance-none bg-[#090A0F] border border-slate-800/80 hover:border-slate-700/80 px-4 py-2 pr-9 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-neonPink/50 transition-colors cursor-pointer"
          >
            <option value="All">Department: All</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: AnniversaryCard
// ==========================================

interface AnniversaryCardProps {
  employee: Employee;
  isSelected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onGenerate: () => void;
  onUploadPhoto: (file: File) => void;
  onRefresh: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onUpdateClick: () => void;
}

const AnniversaryCard: React.FC<AnniversaryCardProps> = ({
  employee,
  isSelected,
  onSelect,
  onApprove,
  onGenerate,
  onUploadPhoto,
  onRefresh,
  onEdit,
  onUpdateClick
}) => {
  const isAwaiting = employee.status === 'Awaiting Stylization';
  const isGenerating = employee.status === 'Generating';
  const isReady = employee.status === 'Ready for Review';
  const isApproved = employee.status === 'Approved';

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadPhoto(e.target.files[0]);
    }
  };

  const showOriginal = isAwaiting || isGenerating;
  const currentPhoto = showOriginal 
    ? employee.photo_url 
    : (employee.caricature_url || employee.photo_url);

  const getPhotoUrl = (url: string) => {
    if (url.startsWith('/static')) {
      return `http://localhost:8000${url}`;
    }
    return url;
  };

  return (
    <div 
      onClick={onSelect}
      className={`bg-[#12131A] border-2 rounded-2xl flex flex-col p-4 cursor-pointer transition-all duration-200 select-none relative group ${
        isSelected 
          ? 'border-neonPink shadow-panelGlow' 
          : 'border-slate-900 hover:border-slate-800'
      }`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Top Section - Employee Info */}
      <div className="flex items-start justify-between mb-3.5">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <img 
            src={getPhotoUrl(employee.photo_url)} 
            alt={employee.name} 
            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-800 bg-slate-950 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-sm text-slate-100 truncate">{employee.name}</h3>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wide truncate uppercase">
              {employee.designation} • {employee.department}
            </p>
          </div>
        </div>
        
        <div className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-850 text-[10px] font-bold text-slate-400 shrink-0 ml-2">
          {employee.anniversary_milestone.replace(' Anniversary', '')}
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-3.5">
        {isAwaiting && (
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5 text-slate-450 text-[10px] font-bold tracking-wider uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              <span>AWAITING STYLIZATION</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full w-full"></div>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-neonPink text-[10px] font-bold tracking-wider uppercase mb-1">
              <div className="flex items-center space-x-1.5">
                <IconRotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>GENERATING ({employee.progress || 0}%)</span>
              </div>
            </div>
            <div className="h-1 bg-slate-800 rounded-full w-full overflow-hidden">
              <div 
                className="h-full bg-neonPink transition-all duration-300 rounded-full" 
                style={{ width: `${employee.progress || 0}%` }}
              ></div>
            </div>
          </div>
        )}

        {isReady && (
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5 text-emerald-400 text-[10px] font-bold tracking-wider uppercase mb-1">
              <IconCheckCircle2 className="w-3.5 h-3.5 fill-emerald-950/20" />
              <span>READY FOR REVIEW</span>
            </div>
            <div className="h-1 bg-emerald-500 rounded-full w-full"></div>
          </div>
        )}

        {isApproved && (
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5 text-cyan-400 text-[10px] font-bold tracking-wider uppercase mb-1">
              <IconCalendar className="w-3.5 h-3.5 fill-cyan-950/20" />
              <span>APPROVED & SCHEDULED</span>
            </div>
            <div className="h-1 bg-[#00E5FF] rounded-full w-full"></div>
          </div>
        )}
      </div>

      {/* Middle Section - Caricature Frame */}
      <div className="relative aspect-square w-full bg-[#090A0F] rounded-xl overflow-hidden mb-4 border border-slate-850 flex items-center justify-center group/img">
        <img 
          src={getPhotoUrl(currentPhoto)} 
          alt={`${employee.name}`} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105 ${
            isGenerating ? 'blur-md opacity-45' : ''
          }`}
        />

        {!isGenerating && (
          <button
            onClick={handleEditClick}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer backdrop-blur-xs select-none border-0"
          >
            <IconEdit2 className="w-5 h-5 text-[#00E5FF] drop-shadow-glow animate-pulse" />
            <span className="text-[10px] font-bold text-slate-300 tracking-wider">
              UPDATE PHOTO
            </span>
          </button>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs select-none">
            <div className="relative flex items-center justify-center w-12 h-12 mb-2">
              <div className="absolute inset-0 border-2 border-t-neonPink border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <IconSparkles className="w-5 h-5 text-neonPink animate-pulse-fast" />
            </div>
            <span className="text-[10px] font-black text-neonPink tracking-widest text-glow-pink">
              APPLYING STYLES...
            </span>
          </div>
        )}
      </div>

      {/* Localized Update Employee Info Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUpdateClick();
        }}
        className="w-full py-1.5 mb-3 bg-[#1D2130]/80 hover:bg-[#1D2130] text-[10px] font-extrabold text-slate-350 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-1.5"
        title="Update Employee Info"
      >
        <IconEdit2 className="w-3 h-3 text-[#00FFE0]" />
        <span>UPDATE EMPLOYEE INFO</span>
      </button>

      {/* Bottom Section - Action Controls */}
      <div className="flex items-center gap-2 mt-auto">
        {isAwaiting && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGenerate();
            }}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-[#00E5FF] hover:bg-[#00CCEE] text-slate-950 transition-all duration-200 active:scale-[0.98] shadow-[0_0_12px_rgba(0,229,255,0.15)]"
          >
            Generate Caricature
          </button>
        )}

        {isGenerating && (
          <button
            disabled
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed text-center"
          >
            Generating...
          </button>
        )}

        {isReady && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove();
            }}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-neonPink hover:bg-[#E02269] text-white transition-all duration-200 active:scale-[0.98] shadow-glow"
          >
            Approve & Schedule
          </button>
        )}

        {isApproved && (
          <button
            disabled
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-[#1D2130] text-slate-400 cursor-not-allowed text-center"
          >
            Scheduled
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            playAnniversaryWishText(employee);
          }}
          className="p-2 border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 bg-slate-900/40 rounded-lg text-[#00E5FF] hover:text-white transition-colors"
          title="Play Anniversary Voice Wish"
        >
          <IconVolume2 />
        </button>

        {(isReady || isApproved) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefresh(e);
            }}
            className="p-2 border border-slate-850 hover:border-slate-700 bg-slate-900/40 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            title="Regenerate Caricature"
          >
            <IconRotateCw />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(e);
          }}
          className="p-2 border border-slate-850 hover:border-slate-700 bg-slate-900/40 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Focus Detail"
        >
          <IconSearch className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: InspectionView
// ==========================================

interface InspectionViewProps {
  employee: Employee | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
  onDownload: (employee: Employee) => void;
  onFeedback: (employee: Employee) => void;
  onEditProfileClick: () => void;
  onRegenerate: (id: string) => void;
  onDelete: (id: string) => void;
}

const InspectionView: React.FC<InspectionViewProps> = ({
  employee,
  onClose,
  onApprove,
  onAddTag,
  onRemoveTag,
  onDownload,
  onFeedback,
  onEditProfileClick,
  onRegenerate,
  onDelete
}) => {
  const [newTagInput, setNewTagInput] = useState('');

  if (!employee) return null;

  const handleAddTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim()) {
      onAddTag(employee.id, newTagInput.trim());
      setNewTagInput('');
    }
  };

  const getTagStyle = (tag: string) => {
    const norm = tag.toLowerCase();
    if (norm.includes('coffee')) {
      return {
        classes: 'border-teal-500/40 bg-teal-950/20 text-teal-300 hover:border-teal-400/60',
        icon: IconCoffee,
      };
    } else if (norm.includes('travel') || norm.includes('explore') || norm.includes('wander')) {
      return {
        classes: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400/60',
        icon: IconPlane,
      };
    } else if (norm.includes('vector') || norm.includes('modern') || norm.includes('design')) {
      return {
        classes: 'border-pink-500/40 bg-pink-950/20 text-pink-300 hover:border-pink-400/60',
        icon: IconSparkles,
      };
    } else if (norm.includes('code') || norm.includes('engineer') || norm.includes('artist') || norm.includes('tech')) {
      return {
        classes: 'border-purple-500/40 bg-purple-950/20 text-purple-300 hover:border-purple-400/60',
        icon: IconCode,
      };
    }
    return {
      classes: 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700',
      icon: IconTag,
    };
  };

  const IconCode = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );

  const IconTrash = ({ className = "w-3.5 h-3.5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );

  const isReady = employee.status === 'Ready for Review';
  const showOriginal = employee.status === 'Awaiting Stylization' || employee.status === 'Generating';
  const displayPhoto = showOriginal 
    ? employee.photo_url 
    : (employee.caricature_url || employee.photo_url);

  const getPhotoUrl = (url: string) => {
    if (url.startsWith('/static')) {
      return `http://localhost:8000${url}`;
    }
    return url;
  };

  return (
    <div className="w-96 bg-[#090A0F] border-l border-slate-900 flex flex-col h-screen shrink-0 overflow-y-auto select-none relative">
      <div className="flex items-center justify-between p-5 border-b border-slate-900">
        <h2 className="font-extrabold text-base text-slate-100">Inspection View</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors"
        >
          <IconX />
        </button>
      </div>

      <div className="p-5 flex-1 space-y-6 overflow-y-auto">
        <div className="flex justify-end gap-2">
          <button
            onClick={onEditProfileClick}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <IconEdit2 className="w-3 h-3 text-neonPink" />
            <span>Update Info</span>
          </button>
          <button
            onClick={() => onDelete(employee.id)}
            className="px-3 py-1.5 bg-red-950/20 border border-red-900/40 hover:border-red-500/50 hover:bg-red-900/30 text-red-400 hover:text-red-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 animate-pulse-once"
            title="Delete Employee Profile"
          >
            <IconTrash className="w-3 h-3 text-red-500" />
            <span>Delete Profile</span>
          </button>
        </div>

        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#0F1015] border border-slate-900 relative shadow-inner">
          <img 
            src={getPhotoUrl(displayPhoto)} 
            alt={`${employee.name} expanded`}
            className={`w-full h-full object-cover ${
              employee.status === 'Generating' ? 'blur-md opacity-45' : ''
            }`}
          />
          {employee.status === 'Generating' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center w-12 h-12">
                <div className="absolute inset-0 border-2 border-t-neonPink border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <IconSparkles className="w-5 h-5 text-neonPink animate-pulse-fast" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-white truncate max-w-[220px]">{employee.name}</h3>
            <div className="px-2.5 py-0.5 rounded-full border border-pink-500/30 bg-pink-950/10 text-[10px] font-bold text-neonPink shrink-0">
              {employee.anniversary_milestone.replace(' Anniversary', '').replace('st', '').replace('nd', '').replace('rd', '').replace('th', '')} Years
            </div>
          </div>
          <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
            {employee.designation} • {employee.department} (Age {employee.age})
          </span>
        </div>

        <div className="space-y-3 bg-[#11121B] p-4 rounded-xl border border-slate-900 text-xs text-slate-300">
          <div>
            <strong className="text-slate-400 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">Hobbies</strong>
            <p className="leading-relaxed">
              {employee.hobbies.length > 0 ? employee.hobbies.join(', ') : 'None listed'}
            </p>
          </div>
          <div>
            <strong className="text-slate-400 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">Activities</strong>
            <p className="leading-relaxed">
              {employee.activities.length > 0 ? employee.activities.join(', ') : 'None listed'}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-3">
            PERSONA TAGS
          </h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {employee.tags.map((tag) => {
              const style = getTagStyle(tag);
              const TagIcon = style.icon;
              return (
                <div
                  key={tag}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${style.classes}`}
                >
                  <TagIcon className="w-3.5 h-3.5" />
                  <span>{tag}</span>
                  <button
                    onClick={() => onRemoveTag(employee.id, tag)}
                    className="pl-1 text-slate-500 hover:text-red-400 transition-colors font-bold text-xs"
                    title="Remove tag"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleAddTagSubmit} className="flex items-center gap-1.5 mt-2">
            <input
              type="text"
              placeholder="Add tag..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-900/40 border border-slate-850 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neonPink/50"
            />
            <button
              type="submit"
              className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-neonPink transition-colors"
            >
              <IconPlus />
            </button>
          </form>
        </div>

        <div className="relative timeline-line">
          <h4 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4">
            GENERATION LOG
          </h4>
          <div className="space-y-5 relative pl-8">
            {employee.timeline.map((event, index) => {
              const isComp = event.status === 'completed';
              const isAct = event.status === 'in-progress';
              return (
                <div key={index} className="relative text-xs">
                  <span className="absolute -left-8 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#090A0F]">
                    {isComp ? (
                      <IconCheckCircle2 className="h-4.5 w-4.5 text-emerald-400 fill-[#090A0F]" />
                    ) : isAct ? (
                      <IconClock className="h-4.5 w-4.5 text-neonPink fill-[#090A0F] animate-pulse-fast" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-800"></span>
                    )}
                  </span>
                  
                  <div className="flex flex-col">
                    <span className={`font-bold ${isComp ? 'text-slate-200' : isAct ? 'text-neonPink' : 'text-slate-500'}`}>
                      {event.event}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 font-medium">
                      {event.time}{event.event === 'Generation Complete' ? ' • Version 3.2' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Controls Panel */}
      <div className="p-4 border-t border-slate-900 space-y-2.5 bg-[#090A0F]/80 backdrop-blur-md sticky bottom-0">
        <button
          onClick={() => onApprove(employee.id)}
          disabled={!isReady}
          className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-center transition-all duration-200 ${
            isReady
              ? 'bg-neonPink hover:bg-[#E02269] text-white shadow-glow active:scale-[0.98]'
              : 'bg-[#1D2130] text-slate-500 cursor-not-allowed'
          }`}
        >
          {employee.status === 'Approved' ? 'Milestone Scheduled' : 'Approve & Schedule Milestone'}
        </button>

        <button
          onClick={() => playAnniversaryWishText(employee)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#00E5FF] hover:bg-[#00CCEE] text-slate-950 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-[0_0_12px_rgba(0,229,255,0.15)]"
        >
          <IconVolume2 className="w-4 h-4 text-slate-950" />
          <span>Play Anniversary Audio Wish</span>
        </button>

        <div className="flex gap-2">
          {(isReady || employee.status === 'Approved') && (
            <button
              onClick={() => onRegenerate(employee.id)}
              className="flex-1 py-2.5 px-3 bg-[#1D2130]/50 hover:bg-[#1D2130] text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-800/40 transition-colors"
              title="Regenerate Caricature"
            >
              <IconRotateCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          )}
          <button
            onClick={() => onDownload(employee)}
            className="flex-1 py-2.5 px-3 bg-[#1D2130]/50 hover:bg-[#1D2130] text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-800/40 transition-colors"
          >
            <IconDownload />
            <span>Download</span>
          </button>
          <button
            onClick={() => onFeedback(employee)}
            className="flex-1 py-2.5 px-3 bg-[#1D2130]/50 hover:bg-[#1D2130] text-slate-300 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-800/40 transition-colors"
          >
            <IconMessageSquare />
            <span>Feedback</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: UploadModal
// ==========================================

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (
    name: string,
    gender: string,
    roleTitle: string,
    department: string,
    milestone: string,
    tags: string[],
    age: number,
    hobbies: string[],
    activities: string[],
    photoFile: File | null
  ) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onRegister,
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Female');
  const [roleTitle, setRoleTitle] = useState('');
  const [department, setDepartment] = useState('Product');
  const [milestone, setMilestone] = useState('5th Anniversary');
  const [tagsInput, setTagsInput] = useState('');
  const [age, setAge] = useState(30);
  const [hobbiesInput, setHobbiesInput] = useState('');
  const [activitiesInput, setActivitiesInput] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErrorMsg('Name is required.');
    if (!roleTitle.trim()) return setErrorMsg('Role Title is required.');
    if (!department.trim()) return setErrorMsg('Department is required.');

    setErrorMsg(null);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const hobbies = hobbiesInput
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    const activities = activitiesInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    onRegister(
      name.trim(),
      gender,
      roleTitle.trim(),
      department.trim(),
      milestone,
      tags,
      Number(age),
      hobbies,
      activities,
      photoFile
    );
    
    setName('');
    setGender('Female');
    setRoleTitle('');
    setDepartment('Product');
    setMilestone('5th Anniversary');
    setTagsInput('');
    setAge(30);
    setHobbiesInput('');
    setActivitiesInput('');
    setPhotoFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm select-none p-4 animate-fade-in">
      <div 
        className="w-full max-w-lg bg-[#12131A] border border-slate-800 rounded-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-900">
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <IconUserPlus className="w-5 h-5 text-neonPink" />
            <span>Register Employee Milestone</span>
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors"
          >
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="flex items-center space-x-2 bg-red-950/20 border border-red-500/40 text-red-400 p-3 rounded-lg text-xs font-semibold">
              <IconAlertTriangle />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Employee Name</label>
              <input
                type="text"
                placeholder="e.g., Sarah Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Role Title</label>
              <input
                type="text"
                placeholder="e.g., Senior Engineer"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Gender Style</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#090A0F] border border-slate-800/80 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-neonPink/50 cursor-pointer"
              >
                <option value="Female">Female Style (Jane / Sarah Templates)</option>
                <option value="Male">Male Style (Marcus / Alex Templates)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Department</label>
              <input
                type="text"
                placeholder="e.g., Product"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Milestone</label>
              <select
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                className="w-full bg-[#090A0F] border border-slate-800/80 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-neonPink/50 cursor-pointer"
              >
                <option value="1st Anniversary">1st Anniversary</option>
                <option value="3rd Anniversary">3rd Anniversary</option>
                <option value="5th Anniversary">5th Anniversary</option>
                <option value="10th Anniversary">10th Anniversary</option>
                <option value="15th Anniversary">15th Anniversary</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Persona Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Code Artist, Traveler"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-neonPink/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Hobbies (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Coffee Brewing, Travel Photography"
              value={hobbiesInput}
              onChange={(e) => setHobbiesInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-neonPink/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Activities (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g., Hiking, Cycling"
              value={activitiesInput}
              onChange={(e) => setActivitiesInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-neonPink/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Profile Portrait Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPhotoFile(e.target.files[0]);
                }
              }}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 file:bg-neonPink/20 file:border-0 file:text-neonPink file:text-xs file:font-bold file:px-2.5 file:py-1 file:rounded-md file:cursor-pointer cursor-pointer focus:outline-none"
            />
          </div>

          <div className="text-[10px] text-slate-500 leading-relaxed bg-[#090A0F]/50 p-3 rounded-lg border border-slate-900">
            💡 **Tip:** The caricature card will dynamically cartoonize this uploaded portrait image and display all custom tags, hobbies, activities, and role titles.
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1D2130]/60 hover:bg-[#1D2130] rounded-lg text-xs font-bold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-neonPink to-violet-650 hover:from-neonPink hover:to-violet-750 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-[0.98]"
            >
              Register Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: UpdateEmployeeModal (Localized inline configuration modal)
// ==========================================

interface UpdateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onUpdate: (id: string, updatedFields: {
    name: string;
    gender: string;
    designation: string;
    department: string;
    age: number;
    hobbies: string[];
    activities: string[];
  }) => void;
}

const UpdateEmployeeModal: React.FC<UpdateEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onUpdate,
}) => {
  const [name, setName] = useState(employee.name);
  const [gender, setGender] = useState(employee.gender || 'Female');
  const [designation, setDesignation] = useState(employee.designation);
  const [department, setDepartment] = useState(employee.department);
  const [age, setAge] = useState(employee.age);
  const [hobbiesInput, setHobbiesInput] = useState(employee.hobbies.join(', '));
  const [activitiesInput, setActivitiesInput] = useState(employee.activities.join(', '));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hobbies = hobbiesInput.split(',').map((h) => h.trim()).filter(Boolean);
    const activities = activitiesInput.split(',').map((a) => a.trim()).filter(Boolean);
    onUpdate(employee.id, {
      name: name.trim(),
      gender,
      designation: designation.trim(),
      department: department.trim(),
      age: Number(age),
      hobbies,
      activities
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[#12131A] border border-slate-800 rounded-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between p-5 border-b border-slate-900">
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <IconEdit2 className="w-5 h-5 text-[#00FFE0]" />
            <span>Update Employee Info</span>
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors">
            <IconX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Gender Style</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#090A0F] border border-slate-800/80 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 focus:outline-none focus:border-neonPink/50 cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Hobbies (comma-separated)</label>
            <input
              type="text"
              value={hobbiesInput}
              onChange={(e) => setHobbiesInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Activities (comma-separated)</label>
            <input
              type="text"
              value={activitiesInput}
              onChange={(e) => setActivitiesInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-neonPink/50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-900 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-[#1D2130]/60 hover:bg-[#1D2130] rounded-lg text-xs font-bold text-slate-300 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-neonPink to-violet-650 hover:from-neonPink hover:to-violet-750 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-[0.98]">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// Inner Component: StorySlideshowOverlay
// ==========================================

interface StorySlideshowOverlayProps {
  employee: Employee;
  wishes: any[];
  onClose: () => void;
}

const StorySlideshowOverlay: React.FC<StorySlideshowOverlayProps> = ({ employee, wishes, onClose }) => {
  const publicWishes = wishes.filter(w => w.receiver_id === employee.id && w.is_public);
  const totalSlides = 1 + publicWishes.length;
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setProgress(0);
  }, [activeSlideIndex]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (activeSlideIndex < totalSlides - 1) {
            setActiveSlideIndex(prevIdx => prevIdx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2.5; // Increments to 100% over 4 seconds (2.5% every 100ms)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeSlideIndex, totalSlides, isPaused]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeSlideIndex < totalSlides - 1) {
      setActiveSlideIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(prev => prev - 1);
    }
  };

  const getPhotoUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('/static') ? `http://localhost:8000${url}` : url;
  };

  return (
    <div 
      className="fixed inset-0 bg-[#090A0F]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 select-none"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="relative w-full max-w-[420px] h-[90vh] bg-[#12131A] border border-slate-900 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl">
        {/* Progress Bars */}
        <div className="absolute top-4 inset-x-0 flex gap-1.5 px-4 z-50">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div key={idx} className="flex-1 h-[3px] bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-neonPink transition-all duration-100 ease-linear"
                style={{
                  width: idx < activeSlideIndex ? '100%' : idx === activeSlideIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header (Sender Profile) */}
        <div className="p-6 pt-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent z-40">
          <div className="flex items-center gap-3">
            <img 
              src={getPhotoUrl(employee.photo_url)} 
              alt={employee.name} 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-neonPink"
            />
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{employee.name}</h4>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{employee.anniversary_milestone}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full bg-black/40 text-slate-400 hover:text-white transition-colors"
          >
            <IconX className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center p-6 relative">
          {/* Navigation Overlay Areas */}
          <div className="absolute inset-y-0 left-0 w-1/4 z-30 cursor-pointer" onClick={handlePrev} />
          <div className="absolute inset-y-0 right-0 w-1/4 z-30 cursor-pointer" onClick={handleNext} />

          {activeSlideIndex === 0 ? (
            /* Primary Caricature Slide */
            <div className="w-full flex flex-col items-center gap-4 text-center z-10 animate-fade-in">
              <div className="relative w-72 aspect-square rounded-3xl overflow-hidden border border-slate-800 bg-[#0F1015] shadow-pinkGlow">
                <img 
                  src={getPhotoUrl(employee.caricature_url || employee.photo_url)} 
                  alt={employee.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white text-glow-pink">Happy Work Anniversary!</h3>
                <p className="text-xs text-slate-400">{employee.designation} in {employee.department}</p>
              </div>
            </div>
          ) : (
            /* Public Wishes Slides */
            (() => {
              const wish = publicWishes[activeSlideIndex - 1];
              return (
                <div className="w-full flex flex-col items-center gap-6 text-center z-10 px-4 animate-fade-in">
                  <span className="text-[10px] font-black text-[#00FFE0] tracking-widest uppercase text-glow-cyan">Public Greeting from HR</span>
                  {wish.caricature_image_url && (
                    <div className="relative w-48 aspect-square rounded-2xl overflow-hidden border border-slate-855 shadow-panelGlow">
                      <img 
                        src={getPhotoUrl(wish.caricature_image_url)} 
                        alt="Wish attachment" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="bg-slate-900/60 border border-slate-850 p-5 rounded-2xl backdrop-blur-md w-full">
                    <p className="text-sm text-slate-200 italic leading-relaxed">
                      "{wish.message_text}"
                    </p>
                    <span className="block text-[10px] font-bold text-neonPink mt-3 uppercase tracking-wider">
                      — {wish.sender_name}
                    </span>
                  </div>
                </div>
              );
            })()
          )}
        </div>

        {/* Footer controls or indicators */}
        <div className="p-6 bg-gradient-to-t from-black/80 to-transparent text-center z-40 text-[9px] text-slate-500 font-bold tracking-widest uppercase">
          Slide {activeSlideIndex + 1} of {totalSlides}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Component: ReactionButton
// ==========================================

const ReactionButton: React.FC<{ wishId: number }> = ({ wishId: _wishId }) => {
  const [likes, setLikes] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [hasLiked, setHasLiked] = useState(false);

  return (
    <button 
      onClick={() => {
        if (hasLiked) {
          setLikes(likes - 1);
          setHasLiked(false);
        } else {
          setLikes(likes + 1);
          setHasLiked(true);
        }
      }}
      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
        hasLiked 
          ? 'bg-neonPink/20 border-neonPink text-neonPink shadow-glow' 
          : 'bg-slate-900 border-slate-800 text-slate-450 hover:text-slate-200 hover:border-slate-700'
      }`}
    >
      <span>❤️</span>
      <span>{likes}</span>
    </button>
  );
};

// ==========================================
// Main Component: App
const getDaysUntilAnniversary = (anniversaryDate?: string) => {
  if (!anniversaryDate) return 999;
  const today = new Date();
  const currentYear = today.getFullYear();
  const parts = anniversaryDate.split('-');
  if (parts.length !== 2) return 999;
  const [month, day] = parts.map(Number);
  
  // Set anniversary for this year
  const anniversary = new Date(currentYear, month - 1, day);
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  // If the anniversary has already passed this year, set it for next year
  if (anniversary < todayDate) {
    anniversary.setFullYear(currentYear + 1);
  }
  
  const diffTime = anniversary.getTime() - todayDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatAnniversaryDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length !== 2) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mIdx = parseInt(parts[0], 10) - 1;
  const day = parseInt(parts[1], 10);
  if (mIdx >= 0 && mIdx < 12) {
    return `${months[mIdx]} ${day}`;
  }
  return dateStr;
};

// ==========================================

export default function App() {
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem('celebrate_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [_authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('celebrate_token'));
  const [wishes, setWishes] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [activeEditEmployee, setActiveEditEmployee] = useState<Employee | null>(null);

  // Active Story & Coworker States
  const [selectedStoryEmployee, setSelectedStoryEmployee] = useState<Employee | null>(null);
  const [selectedCoworkerId, setSelectedCoworkerId] = useState<string | null>(null);

  // User Profile Customizer States
  const [profileStyle, setProfileStyle] = useState<string>('Anime');
  const [profileBackdrop, setProfileBackdrop] = useState<'none' | 'sunset' | 'matrix' | 'office' | 'neon'>('none');
  const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null);
  const [isProfileCanvasLoading, setIsProfileCanvasLoading] = useState<boolean>(false);

  // Picture Canvas State
  const [canvasEmpId, setCanvasEmpId] = useState<string>('');
  const [canvasStyle, setCanvasStyle] = useState<string>('Anime');
  const [canvasBackdrop, setCanvasBackdrop] = useState<'none' | 'sunset' | 'matrix' | 'office' | 'neon'>('none');
  const [canvasPreviewUrl, setCanvasPreviewUrl] = useState<string | null>(null);
  const [isCanvasLoading, setIsCanvasLoading] = useState<boolean>(false);

  // New Celebration & Portal states
  const [isFullscreenCelebration, setIsFullscreenCelebration] = useState<boolean>(false);
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState<string | null>(null);
  const [portalStyle, setPortalStyle] = useState<string>('Anime');
  const [portalBackdrop, setPortalBackdrop] = useState<'none' | 'sunset' | 'matrix' | 'office' | 'neon'>('none');
  const [portalPreviewUrl, setPortalPreviewUrl] = useState<string | null>(null);
  const [isPortalCanvasLoading, setIsPortalCanvasLoading] = useState<boolean>(false);

  // Whenever the portal active employee, selected style, or backdrop changes, render the preview!
  useEffect(() => {
    if (!loggedInEmployeeId) {
      setPortalPreviewUrl(null);
      return;
    }
    
    let isMounted = true;
    const fetchPortalPreview = async () => {
      setIsPortalCanvasLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/picture-canvas/render', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emp_id: loggedInEmployeeId,
            style: portalStyle,
            backdrop: portalBackdrop,
          }),
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          setPortalPreviewUrl(`http://localhost:8000${data.preview_url}`);
        }
      } catch (err) {
        console.error('Error rendering portal canvas preview:', err);
      } finally {
        if (isMounted) {
          setIsPortalCanvasLoading(false);
        }
      }
    };

    fetchPortalPreview();
    return () => {
      isMounted = false;
    };
  }, [loggedInEmployeeId, portalStyle, portalBackdrop]);

  const handleSavePortalCanvasArtwork = async () => {
    if (!loggedInEmployeeId || !portalPreviewUrl) return;
    setIsPortalCanvasLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/picture-canvas/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emp_id: loggedInEmployeeId,
          preview_url: portalPreviewUrl,
          style: portalStyle,
          backdrop: portalBackdrop,
        }),
      });
      if (res.ok) {
        triggerToast("Anniversary caricature style updated successfully!");
        loadEmployees();
      }
    } catch (err) {
      console.error('Error saving portal canvas artwork:', err);
    } finally {
      setIsPortalCanvasLoading(false);
    }
  };

  // Whenever the user profile style or backdrop changes, render the preview!
  useEffect(() => {
    if (!currentUser || activeTab !== 'my-profile') {
      setProfilePreviewUrl(null);
      return;
    }
    
    let isMounted = true;
    const fetchProfilePreview = async () => {
      setIsProfileCanvasLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/picture-canvas/render', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emp_id: currentUser.id,
            style: profileStyle,
            backdrop: profileBackdrop,
          }),
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          setProfilePreviewUrl(`http://localhost:8000${data.preview_url}`);
        }
      } catch (err) {
        console.error('Error rendering profile canvas preview:', err);
      } finally {
        if (isMounted) {
          setIsProfileCanvasLoading(false);
        }
      }
    };

    fetchProfilePreview();
    return () => {
      isMounted = false;
    };
  }, [currentUser, profileStyle, profileBackdrop, activeTab]);

  const handleSaveProfileCanvasArtwork = async () => {
    if (!currentUser || !profilePreviewUrl) return;
    setIsProfileCanvasLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/picture-canvas/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emp_id: currentUser.id,
          preview_url: profilePreviewUrl,
          style: profileStyle,
          backdrop: profileBackdrop,
        }),
      });
      if (res.ok) {
        triggerToast("Your profile caricature style updated successfully!");
        loadEmployees();
      }
    } catch (err) {
      console.error('Error saving profile canvas artwork:', err);
    } finally {
      setIsProfileCanvasLoading(false);
    }
  };


  // Whenever the active Canvas Employee, selected style, or backdrop changes, render the preview!
  useEffect(() => {
    if (!canvasEmpId) {
      setCanvasPreviewUrl(null);
      return;
    }
    
    let isMounted = true;
    const fetchPreview = async () => {
      setIsCanvasLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/picture-canvas/render', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emp_id: canvasEmpId,
            style: canvasStyle,
            backdrop: canvasBackdrop,
          }),
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          setCanvasPreviewUrl(`http://localhost:8000${data.preview_url}`);
        }
      } catch (err) {
        console.error('Error rendering canvas preview:', err);
      } finally {
        if (isMounted) {
          setIsCanvasLoading(false);
        }
      }
    };

    fetchPreview();
    return () => {
      isMounted = false;
    };
  }, [canvasEmpId, canvasStyle, canvasBackdrop]);

  const handleSaveCanvasArtwork = async () => {
    if (!canvasEmpId || !canvasPreviewUrl) return;
    setIsCanvasLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/picture-canvas/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emp_id: canvasEmpId,
          preview_url: canvasPreviewUrl,
          style: canvasStyle,
          backdrop: canvasBackdrop,
        }),
      });
      if (res.ok) {
        triggerToast("Custom caricature saved and applied to employee profile!");
        loadEmployees();
      } else {
        throw new Error('Save canvas trigger failed.');
      }
    } catch (err) {
      console.error('Failed to save custom caricature:', err);
      triggerToast("Error saving customized caricature.");
    } finally {
      setIsCanvasLoading(false);
    }
  };

  const handleDownloadCanvasArtwork = () => {
    if (!canvasPreviewUrl) return;
    const a = document.createElement('a');
    a.href = canvasPreviewUrl;
    a.download = `custom_caricature_${canvasEmpId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLoginSuccess = (user: Employee, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('celebrate_user', JSON.stringify(user));
    localStorage.setItem('celebrate_token', token);
    
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');
    const todayStr = `${currentMonth}-${currentDay}`;
    
    if (user.anniversary_date === todayStr) {
      setActiveTab('anniversary-dashboard');
      triggerToast(`Welcome, ${user.name}! Happy Anniversary! 🎉`);
    } else {
      setActiveTab('dashboard');
      triggerToast(`Signed in as ${user.name}`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('celebrate_user');
    localStorage.removeItem('celebrate_token');
    triggerToast("Signed out.");
  };

  // Wishing States & Handlers
  const [wishMessage, setWishMessage] = useState('');
  const [wishFile, setWishFile] = useState<File | null>(null);
  const [wishFilePreview, setWishFilePreview] = useState<string | null>(null);
  const [isSendingWish, setIsSendingWish] = useState(false);
  const [isWishPublic, setIsWishPublic] = useState(false);
  const [wishCaricatureStyle, setWishCaricatureStyle] = useState('Anime');
  const [isGeneratingWishCaricature, setIsGeneratingWishCaricature] = useState(false);
  const [generatedWishCaricatureUrl, setGeneratedWishCaricatureUrl] = useState<string | null>(null);

  const handleWishFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setWishFile(file);
      setWishFilePreview(URL.createObjectURL(file));
      setGeneratedWishCaricatureUrl(null);
    }
  };

  const handleGenerateWishCaricature = async () => {
    if (!wishFile) {
      triggerToast("Please choose an image file first.");
      return;
    }
    setIsGeneratingWishCaricature(true);
    try {
      const formData = new FormData();
      formData.append('file', wishFile);
      formData.append('style', wishCaricatureStyle);
      const res = await fetch('http://localhost:8000/api/wishes/generate-caricature', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedWishCaricatureUrl(data.caricature_image_url);
        setWishFilePreview(`http://localhost:8000${data.caricature_image_url}`);
        triggerToast("AI Caricature generated successfully! 🎉");
      } else {
        const errData = await res.json();
        throw new Error(errData.detail || 'Caricature generation failed');
      }
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || "Error generating caricature style.");
    } finally {
      setIsGeneratingWishCaricature(false);
    }
  };

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const coworker = employees.find(emp => emp.id === selectedCoworkerId);
    if (!coworker) return;
    if (!wishMessage.trim()) {
      triggerToast("Please enter a wishing message.");
      return;
    }

    setIsSendingWish(true);
    try {
      let caricatureImageUrl = generatedWishCaricatureUrl;
      if (!caricatureImageUrl && wishFile) {
        const formData = new FormData();
        formData.append('file', wishFile);
        const uploadRes = await fetch('http://localhost:8000/api/wishes/upload-caricature', {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          caricatureImageUrl = uploadData.caricature_image_url;
        } else {
          throw new Error('Image upload failed');
        }
      }

      const res = await fetch('http://localhost:8000/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: currentUser.id,
          receiver_id: coworker.id,
          message_text: wishMessage.trim(),
          caricature_image_url: caricatureImageUrl,
          is_public: isWishPublic
        })
      });

      if (res.ok) {
        triggerToast(isWishPublic ? "Anniversary wish sent publicly! 📢" : "Anniversary wish sent privately! 🔒");
        setWishMessage('');
        setWishFile(null);
        setWishFilePreview(null);
        setGeneratedWishCaricatureUrl(null);
        setIsWishPublic(false);
        loadWishes();
      } else {
        throw new Error('Failed to post wish');
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error sending anniversary wish.");
    } finally {
      setIsSendingWish(false);
    }
  };

  const loadWishes = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/wishes');
      if (res.ok) {
        const data = await res.json();
        setWishes(data);
      }
    } catch (err) {
      console.error("Failed to load wishes:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadWishes();
    }
  }, [currentUser]);

  const loadEmployees = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
        setCanvasEmpId(prev => prev || (data.length > 0 ? data[0].id : ''));
      } else {
        throw new Error('API server did not respond successfully');
      }
    } catch (err) {
      console.warn('Backend server not responding, using offline fallback schema:', err);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    const hasGenerating = employees.some(emp => emp.status === 'Generating');
    if (!hasGenerating) return;

    const pollInterval = setInterval(() => {
      loadEmployees();
    }, 1500);

    return () => clearInterval(pollInterval);
  }, [employees]);

  const handleGenerateCaricature = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/generate`, {
        method: 'POST',
      });
      if (res.ok) {
        triggerToast("Caricature style transfer pipeline initiated!");
        loadEmployees();
      } else {
        throw new Error('Caricature generation trigger failed.');
      }
    } catch (err) {
      console.error('Failed to trigger generation:', err);
      triggerToast("Error triggering caricature styling.");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/approve`, {
        method: 'POST',
      });
      if (res.ok) {
        triggerToast("Milestone approved and scheduled successfully!");
        loadEmployees();
      } else {
        throw new Error('Approval request failed');
      }
    } catch (err) {
      console.error('Approval failed:', err);
      triggerToast("Error approving milestone.");
    }
  };

  const handlePhotoUpload = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/upload-photo`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        triggerToast("Professional photo uploaded successfully!");
        loadEmployees();
      } else {
        throw new Error('Photo upload failed.');
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      triggerToast("Error uploading photo.");
    }
  };

  const handleRegisterEmployee = async (
    name: string,
    gender: string,
    roleTitle: string,
    department: string,
    milestone: string,
    tags: string[],
    age: number,
    hobbies: string[],
    activities: string[],
    photoFile: File | null
  ) => {
    try {
      const res = await fetch('http://localhost:8000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, gender, role_title: roleTitle, department, milestone, tags, age, hobbies, activities })
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(`Milestone registered for ${name}!`);
        if (photoFile) {
          await handlePhotoUpload(data.id, photoFile);
        } else {
          loadEmployees();
        }
        setSelectedId(data.id);
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      triggerToast("Error registering milestone.");
    }
  };

  const handleUpdateEmployee = async (id: string, updatedFields: any) => {
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        triggerToast("Profile variables saved. Status reset to Awaiting Stylization!");
        loadEmployees();
      } else {
        throw new Error('Update request failed');
      }
    } catch (err) {
      console.error('Failed to update employee details:', err);
      triggerToast("Error updating employee profile details.");
    }
  };

  const handleAddTag = async (id: string, tag: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag })
      });
      if (res.ok) {
        loadEmployees();
      }
    } catch (err) {
      console.error('Failed to add tag:', err);
    }
  };

  const handleRemoveTag = async (id: string, tag: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}/tags/${encodeURIComponent(tag)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadEmployees();
      }
    } catch (err) {
      console.error('Failed to remove tag:', err);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this employee profile? All database records and dynamic caricature files will be permanently removed.")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        triggerToast("Employee profile deleted successfully.");
        if (selectedId === id) {
          setSelectedId(null);
        }
        loadEmployees();
      } else {
        throw new Error('Delete request failed');
      }
    } catch (err) {
      console.error('Failed to delete employee:', err);
      triggerToast("Error deleting employee profile.");
    }
  };

  const handleGenerateReport = () => {
    triggerToast("Generating export payload. Excel spreadsheet downloaded (CSV format ready)!");
    const headers = "Employee Name,Designation,Milestone,Department,Age,Status,Tags,Hobbies,Activities\n";
    const rows = employees.map(e => 
      `"${e.name}","${e.designation}","${e.anniversary_milestone}","${e.department}",${e.age},"${e.status}","${e.tags.join(' | ')}","${e.hobbies.join(' | ')}","${e.activities.join(' | ')}"`
    ).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "anniversary_caricature_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFocusDetails = (_e: React.MouseEvent, id: string) => {
    setSelectedId(id);
    triggerToast("Profile focused in Inspection View.");
  };

  const handleDownloadCaricature = (emp: Employee) => {
    const url = emp.caricature_url || emp.photo_url;
    const downloadUrl = url.startsWith('/static') ? `http://localhost:8000${url}` : url;
    triggerToast(`Downloading digital asset: ${emp.name}_asset.png`);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${emp.name.replace(' ', '_')}_asset.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFeedback = (emp: Employee) => {
    const feedbackMsg = prompt(`Submit design review notes for ${emp.name}'s styling:`, "Refine style transfer caricature details.");
    if (feedbackMsg) {
      triggerToast(`Feedback submitted: "${feedbackMsg}"`);
    }
  };

  const selectedEmployee = employees.find(e => e.id === selectedId) || null;

  const departments = Array.from(new Set(employees.map(e => e.department)));

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const upcomingEmployees = filteredEmployees.filter(emp => emp.status === 'Awaiting Stylization' || emp.status === 'Generating');
  const completedEmployees = filteredEmployees.filter(emp => emp.status === 'Ready for Review' || emp.status === 'Approved');

  const pendingCount = employees.filter(e => e.status === 'Awaiting Stylization' || e.status === 'Generating').length;
  const awaitingCount = employees.filter(e => e.status === 'Ready for Review').length;
  const scheduledCount = employees.filter(e => e.status === 'Approved').length;

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (isFullscreenCelebration) {
    return (
      <CelebrationShowcase 
        employees={employees}
        onClose={() => setIsFullscreenCelebration(false)}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#0B0F19] text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-3 bg-slate-900 border-2 border-neonPink rounded-xl shadow-glow text-xs font-bold text-white flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-neonPink animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Nav panel */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onGenerateReport={handleGenerateReport} 
        onLaunchCelebration={() => setIsFullscreenCelebration(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#0D0E15]">
        {activeTab === 'dashboard' ? (
          <div className="flex-1 overflow-y-auto p-8 bg-radial-gradient">
            {/* Today's Anniversary Stories Slider */}
            {(() => {
              const today = new Date();
              const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
              const currentDay = String(today.getDate()).padStart(2, '0');
              const todayStr = `${currentMonth}-${currentDay}`;
              const celebratingToday = employees.filter(emp => emp.anniversary_date === todayStr);

              return (
                <div className="mb-8 bg-[#12131A] border border-slate-900 rounded-3xl p-6 shadow-glow">
                  <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neonPink animate-pulse"></span>
                    <span>Today's Anniversary Stories</span>
                  </h3>
                  {celebratingToday.length > 0 ? (
                    <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none">
                      {celebratingToday.map((emp) => {
                        const hasActiveStory = emp.caricature_url || emp.status === 'Approved' || emp.status === 'Ready for Review';
                        const photoUrl = emp.caricature_url || emp.photo_url;
                        const displayUrl = photoUrl.startsWith('/static') ? `http://localhost:8000${photoUrl}` : photoUrl;
                        return (
                          <div 
                            key={emp.id} 
                            onClick={() => hasActiveStory && setSelectedStoryEmployee(emp)}
                            className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group select-none"
                          >
                            <div className="relative">
                              <div className={`w-16 h-16 rounded-full p-[2px] flex items-center justify-center ${hasActiveStory ? 'story-ring-active' : 'bg-slate-800'}`}>
                                <img 
                                  src={displayUrl} 
                                  alt={emp.name} 
                                  className="w-full h-full rounded-full object-cover bg-slate-950 ring-2 ring-[#0D0E15]"
                                />
                              </div>
                              <span className="absolute -bottom-1 -right-1 bg-neonPink text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-[#0D0E15]">
                                🎉
                              </span>
                            </div>
                            <span className="text-xs font-bold text-slate-200 group-hover:text-neonPink transition-colors truncate max-w-[80px]">
                              {emp.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-2 italic">
                      No employee work anniversaries today. Check back tomorrow!
                    </div>
                  )}
                </div>
              );
            })()}

            {currentUser.role === 'HR' ? (
              <>
                <div className="mb-8 select-none">
                  <h2 className="text-3xl font-black tracking-tight text-white">
                    Milestone Celebration <span className="text-neonPink">Hub</span>
                  </h2>
                  <p className="text-sm text-slate-400 max-w-2xl mt-2 leading-relaxed">
                    Welcome to the corporate celebration panel. Launch a fullscreen celebration slideshow or access the employee portal below.
                  </p>
                </div>

                {/* Quick Stats Banner */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-[#12131A] border border-slate-900 rounded-2xl p-4.5">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block mb-1">Total Milestone Employees</span>
                    <span className="text-2xl font-black text-white">{employees.length}</span>
                  </div>
                  <div className="bg-[#12131A] border border-slate-900 rounded-2xl p-4.5">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block mb-1">Awaiting Stylization</span>
                    <span className="text-2xl font-black text-neonPink">{pendingCount}</span>
                  </div>
                  <div className="bg-[#12131A] border border-slate-900 rounded-2xl p-4.5">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block mb-1">Ready for Review</span>
                    <span className="text-2xl font-black text-emerald-400">{awaitingCount}</span>
                  </div>
                  <div className="bg-[#12131A] border border-slate-900 rounded-2xl p-4.5">
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block mb-1">Approved & Scheduled</span>
                    <span className="text-2xl font-black text-[#00FFE0]">{scheduledCount}</span>
                  </div>
                </div>

                {/* Dual Actions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Card 1: Celebration Mode Launcher */}
                  <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-6.5 flex flex-col justify-between hover:border-pink-500/20 transition-all group">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-neonPink/10 flex items-center justify-center text-neonPink">
                        <IconSparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white group-hover:text-neonPink transition-colors">Launch Celebration Showcase</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mt-1">
                          Designed to be displayed on office monitors or shared during team meetings. Shows fullscreen profiles of milestone achievers, animated particles, custom caricature cards, and speaks voice greetings automatically.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsFullscreenCelebration(true)}
                      className="mt-6 w-full py-3 bg-neonPink hover:bg-[#E02269] text-white font-bold text-xs rounded-xl shadow-glow active:scale-[0.98] transition-all"
                    >
                      Start Slideshow Mode
                    </button>
                  </div>

                  {/* Card 2: Employee Portal Simulation */}
                  <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-6.5 flex flex-col justify-between hover:border-[#00FFE0]/20 transition-all group">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#00FFE0]/10 flex items-center justify-center text-[#00FFE0]">
                        <IconUsers />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white group-hover:text-[#00FFE0] transition-colors">Employee Portal Simulator</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mt-1">
                          View the platform from a specific employee's perspective. Allow them to log in, read their customized anniversary card, play their audio wish, download high-res caricatures, and test different styles/backdrops.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="relative">
                        <select
                          id="sim-login-select"
                          className="w-full appearance-none bg-[#090A0F] border border-slate-800 hover:border-slate-700 px-4 py-2.5 pr-10 rounded-xl text-xs font-semibold text-slate-350 focus:outline-none focus:border-[#00FFE0]/50 transition-colors cursor-pointer animate-pulse-once"
                          defaultValue=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                              setLoggedInEmployeeId(val);
                              setActiveTab('employee-portal');
                            }
                          }}
                        >
                          <option value="" disabled>Select employee to log in as...</option>
                          {employees.map(e => (
                            <option key={e.id} value={e.id}>{e.name} ({e.anniversary_milestone})</option>
                          ))}
                        </select>
                        <IconChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-8 select-none">
                  <h2 className="text-3xl font-black tracking-tight text-white">
                    Celebration <span className="text-neonPink">Feed</span>
                  </h2>
                  <p className="text-sm text-slate-400 max-w-2xl mt-2 leading-relaxed">
                    Congratulate your colleagues on their milestones! Write wishes, react, and view company-wide public caricatures.
                  </p>
                </div>

                {/* Feed Cards Section */}
                <div className="space-y-6 max-w-3xl">
                  {wishes.filter(w => w.is_public).length > 0 ? (
                    wishes.filter(w => w.is_public).map((wish) => {
                      const photoUrl = wish.caricature_image_url;
                      const displayUrl = photoUrl ? (photoUrl.startsWith('/static') ? `http://localhost:8000${photoUrl}` : photoUrl) : null;
                      return (
                        <div key={wish.id} className="bg-[#12131A] border border-slate-900 rounded-3xl p-6 flex flex-col md:flex-row gap-6 hover:border-slate-800 transition-all animate-fade-in">
                          {displayUrl && (
                            <div className="relative w-full md:w-48 aspect-square rounded-2xl overflow-hidden border border-slate-850 shrink-0">
                              <img 
                                src={displayUrl} 
                                alt="Wish caricature" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-neonPink uppercase tracking-wider">🎉 Public Greeting Message</span>
                                <span className="text-[10px] text-slate-500">• {wish.created_at}</span>
                              </div>
                              <p className="text-sm text-slate-200 leading-relaxed italic">
                                "{wish.message_text}"
                              </p>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-900/60 pt-4 mt-4">
                              <div className="text-xs text-slate-450">
                                For <strong className="text-white">{wish.receiver_name}</strong> from <strong className="text-white">{wish.sender_name}</strong>
                              </div>
                              {/* Simple Reaction button */}
                              <ReactionButton wishId={wish.id} />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-900 rounded-2xl select-none">
                      <span className="text-slate-500 font-bold mb-1 text-sm">No Public Wishes Yet</span>
                      <span className="text-xs text-slate-650">Be the first to send a work anniversary wish!</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : activeTab === 'queue' ? (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mb-8 select-none flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Anniversary <span className="text-neonPink">Caricature</span> Queue
                </h2>
                <p className="text-sm text-slate-400 max-w-2xl mt-2 leading-relaxed">
                  Manage upcoming employee milestones and generate caricature artwork.
                  Wipe out stale caricatures and edit customized variables completely offline.
                </p>
              </div>

              <button
                onClick={() => setIsFullscreenCelebration(true)}
                className="py-3 px-5 bg-gradient-to-r from-neonPink to-violet-650 hover:from-[#E02269] hover:to-violet-750 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-glow active:scale-[0.98] shrink-0"
              >
                <IconSparkles className="w-4 h-4 animate-pulse" />
                <span>Celebration Mode</span>
              </button>
            </div>

            {/* KPI Cards Panel */}
            <KPICards 
              pendingCount={pendingCount} 
              awaitingCount={awaitingCount} 
              scheduledCount={scheduledCount} 
            />

            {/* Search/Filters bar */}
            <FilterBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              deptFilter={deptFilter}
              setDeptFilter={setDeptFilter}
              departments={departments}
              onUploadTrigger={() => setIsRegisterModalOpen(true)}
            />

            {/* Main Lists Section */}
            <div className="space-y-10 pb-12">
              {/* Upcoming work Anniversaries list */}
              <section>
                <h3 className="text-lg font-extrabold text-white mb-5 flex items-center gap-2 select-none border-b border-slate-900 pb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neonPink animate-pulse"></span>
                  <span>Upcoming Work Anniversaries</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md ml-1.5 font-bold">
                    {upcomingEmployees.length} Approaching
                  </span>
                </h3>
                {upcomingEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEmployees.map((emp) => (
                      <AnniversaryCard 
                        key={emp.id}
                        employee={emp}
                        isSelected={selectedId === emp.id}
                        onSelect={() => setSelectedId(emp.id)}
                        onApprove={() => handleApprove(emp.id)}
                        onGenerate={() => handleGenerateCaricature(emp.id)}
                        onUploadPhoto={(file) => handlePhotoUpload(emp.id, file)}
                        onRefresh={(e) => {
                          e.stopPropagation();
                          handleGenerateCaricature(emp.id);
                        }}
                        onEdit={(e) => handleFocusDetails(e, emp.id)}
                        onUpdateClick={() => setActiveEditEmployee(emp)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-900 rounded-2xl select-none">
                    <span className="text-slate-500 font-bold mb-1 text-sm">No Upcoming Anniversaries</span>
                    <span className="text-xs text-slate-650">Register employee milestones or clear active filters</span>
                  </div>
                )}
              </section>

              {/* Completed history list */}
              <section>
                <h3 className="text-lg font-extrabold text-white mb-5 flex items-center gap-2 select-none border-b border-slate-900 pb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]"></span>
                  <span>Completed Caricatures History</span>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md ml-1.5 font-bold">
                    {completedEmployees.length} Historical
                  </span>
                </h3>
                {completedEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedEmployees.map((emp) => (
                      <AnniversaryCard 
                        key={emp.id}
                        employee={emp}
                        isSelected={selectedId === emp.id}
                        onSelect={() => setSelectedId(emp.id)}
                        onApprove={() => handleApprove(emp.id)}
                        onGenerate={() => handleGenerateCaricature(emp.id)}
                        onUploadPhoto={(file) => handlePhotoUpload(emp.id, file)}
                        onRefresh={(e) => {
                          e.stopPropagation();
                          handleGenerateCaricature(emp.id);
                        }}
                        onEdit={(e) => handleFocusDetails(e, emp.id)}
                        onUpdateClick={() => setActiveEditEmployee(emp)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-900 rounded-2xl select-none">
                    <span className="text-slate-500 font-bold mb-1 text-sm">No Completed Caricatures</span>
                    <span className="text-xs text-slate-650">Complete style transfers above to populate history</span>
                  </div>
                )}
              </section>
            </div>
          </div>
        ) : activeTab === 'picture-canvas' ? (
          // ==================== PICTURE CANVAS CUSTOMIZER ====================
          <div className="flex-1 overflow-y-auto p-8 flex flex-col h-full">
            <div className="mb-6 select-none">
              <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
                AI Picture <span className="text-neonPink">Canvas</span> Customizer
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl mt-2 leading-relaxed">
                Design custom caricature styles and backdrop themes for employees. Select an employee, tweak parameters, and apply to their milestone card.
              </p>
            </div>

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-0">
              {/* Left Column: Employee Selector */}
              <div className="xl:col-span-1 bg-[#12131A] border border-slate-900 rounded-2xl p-4 flex flex-col h-[600px] overflow-hidden">
                <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">Select Employee</h3>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {employees.map((emp) => {
                    const isSelected = canvasEmpId === emp.id;
                    const getPhotoUrl = (url: string) => url.startsWith('/static') ? `http://localhost:8000${url}` : url;
                    return (
                      <div
                        key={emp.id}
                        onClick={() => setCanvasEmpId(emp.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#1D2130]/60 border-neonPink'
                            : 'bg-slate-900/30 border-slate-900 hover:border-slate-800'
                        }`}
                      >
                        <img
                          src={getPhotoUrl(emp.photo_url)}
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-800"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-slate-200 truncate">{emp.name}</h4>
                          <p className="text-[10px] text-slate-500 truncate">{emp.designation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Middle Section: Workspace (Original vs Preview) */}
              <div className="xl:col-span-2 bg-[#12131A] border border-slate-900 rounded-2xl p-6 flex flex-col justify-between h-[600px]">
                <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">Workspace Canvas</h3>
                
                <div className="flex-1 grid grid-cols-2 gap-6 items-center">
                  {/* Left: Original Photo */}
                  <div className="flex flex-col items-center gap-2.5 h-full justify-center">
                    <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Original Photo</span>
                    <div className="w-full aspect-square rounded-2xl overflow-hidden border border-slate-900 bg-[#090A0F] max-w-[240px]">
                      {canvasEmpId ? (
                        <img
                          src={
                            (() => {
                              const emp = employees.find(e => e.id === canvasEmpId);
                              if (!emp) return '';
                              return emp.photo_url.startsWith('/static') ? `http://localhost:8000${emp.photo_url}` : emp.photo_url;
                            })()
                          }
                          alt="Original"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-650 text-xs">No employee selected</div>
                      )}
                    </div>
                  </div>

                  {/* Right: Live Preview */}
                  <div className="flex flex-col items-center gap-2.5 h-full justify-center">
                    <span className="text-[10px] font-black text-[#00FFE0] tracking-widest uppercase text-glow-cyan">Dynamic Caricature Preview</span>
                    <div className="w-full aspect-square rounded-2xl overflow-hidden border border-slate-900 bg-[#090A0F] relative max-w-[240px] shadow-panelGlow">
                      {isCanvasLoading ? (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center select-none z-10">
                          <div className="relative flex items-center justify-center w-10 h-10 mb-2">
                            <div className="absolute inset-0 border-2 border-t-[#00FFE0] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <IconSparkles className="w-4 h-4 text-[#00FFE0] animate-pulse-fast" />
                          </div>
                          <span className="text-[9px] font-black text-[#00FFE0] tracking-widest text-glow-cyan uppercase animate-pulse">Rendering...</span>
                        </div>
                      ) : null}

                      {canvasPreviewUrl ? (
                        <img
                          src={canvasPreviewUrl}
                          alt="Canvas Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-650 text-xs">Select options to render</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-900 pt-4 flex justify-between items-center text-slate-500 text-xs mt-4">
                  <span>Target Dimensions: 512 x 512 pixels</span>
                  <span>Pipeline Status: Ready</span>
                </div>
              </div>

              {/* Right Column: Controls Panel */}
              <div className="xl:col-span-1 bg-[#12131A] border border-slate-900 rounded-2xl p-4 flex flex-col justify-between h-[600px]">
                <div className="space-y-5 overflow-y-auto pr-1">
                  {/* Style Selector */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2.5">Caricature Style</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'Anime', name: 'Original Anime' },
                        { id: 'Hayao', name: 'Ghibli Style' },
                        { id: 'Shinkai', name: 'Shinkai Style' },
                        { id: 'Paprika', name: 'Paprika Style' },
                        { id: 'Sketch', name: 'Pencil Sketch' },
                        { id: 'Charcoal', name: 'Charcoal Sketch' },
                        { id: 'Watercolor', name: 'Watercolor' },
                        { id: 'Cartoon', name: 'Pixar Cartoon' },
                        { id: 'PixelArt', name: '8-Bit Pixel Art' },
                        { id: 'OilPainting', name: 'Oil Painting' },
                        { id: 'PopArt', name: 'Pop Art (Warhol)' }
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setCanvasStyle(style.id as any)}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                            canvasStyle === style.id
                              ? 'bg-neonPink border-neonPink text-white shadow-glow'
                              : 'bg-[#1D2130]/30 border-slate-800/80 text-slate-350 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Backdrop Selector */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2.5">Backdrop Theme</h3>
                    <div className="space-y-2">
                      {[
                        { id: 'none', name: 'No Backdrop (Standard)', desc: 'Keeps default style transfer background' },
                        { id: 'sunset', name: 'Sunset Explorer', desc: 'Purple-orange gradient with silhouettes' },
                        { id: 'matrix', name: 'Tech Matrix', desc: 'Glowing green matrix code overlay streams' },
                        { id: 'office', name: 'Office Spotlight', desc: 'Corporate spotlight shapes on slate gradient' },
                        { id: 'neon', name: 'Neon Glow', desc: 'Premium deep dark carbon frame border' }
                      ].map((bg) => (
                        <button
                          key={bg.id}
                          onClick={() => setCanvasBackdrop(bg.id as any)}
                          className={`w-full text-left p-2.5 rounded-lg border flex flex-col transition-all ${
                            canvasBackdrop === bg.id
                              ? 'bg-[#1D2130] border-[#00FFE0] text-white shadow-[0_0_8px_rgba(0,255,224,0.15)]'
                              : 'bg-slate-900/30 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-300'
                          }`}
                        >
                          <span className={`font-bold text-xs ${canvasBackdrop === bg.id ? 'text-[#00FFE0]' : ''}`}>{bg.name}</span>
                          <span className="text-[9px] text-slate-500 font-semibold mt-0.5">{bg.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Final Actions */}
                <div className="border-t border-slate-900 pt-4 space-y-2.5 mt-4">
                  <button
                    onClick={handleSaveCanvasArtwork}
                    disabled={isCanvasLoading || !canvasPreviewUrl}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center transition-all ${
                      canvasPreviewUrl && !isCanvasLoading
                        ? 'bg-neonPink hover:bg-[#E02269] text-white shadow-glow active:scale-[0.98]'
                        : 'bg-[#1D2130] text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Save & Apply to Profile
                  </button>
                  <button
                    onClick={handleDownloadCanvasArtwork}
                    disabled={!canvasPreviewUrl}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#1D2130] hover:bg-[#2A2F45] text-slate-300 hover:text-white flex items-center justify-center gap-2 border border-slate-800/40 transition-all ${
                      canvasPreviewUrl ? 'active:scale-[0.98]' : 'cursor-not-allowed opacity-50'
                    }`}
                  >
                    <IconDownload className="w-3.5 h-3.5" />
                    <span>Download Artwork</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'employee-portal' ? (
          // ==================== EMPLOYEE PORTAL TAB ====================
          <div className="flex-1 overflow-y-auto p-8 bg-radial-gradient flex flex-col h-full">
            {!loggedInEmployeeId ? (
              // SIMULATED LOGIN CARD
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-3 bg-neonPink/10 text-neonPink rounded-2xl mb-1">
                      <IconSettings className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-white">Employee Celebration Portal</h3>
                    <p className="text-xs text-slate-400">Select your name to log in and review your work anniversary milestone materials.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Select Employee Profile</label>
                      <div className="relative">
                        <select
                          className="w-full appearance-none bg-[#090A0F] border border-slate-800 hover:border-slate-700 px-4 py-2.5 pr-10 rounded-xl text-xs font-semibold text-slate-350 focus:outline-none focus:border-neonPink/50 transition-colors cursor-pointer"
                          onChange={(e) => setLoggedInEmployeeId(e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Choose your name...</option>
                          {employees.map(e => (
                            <option key={e.id} value={e.id}>{e.name} - {e.designation}</option>
                          ))}
                        </select>
                        <IconChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // LOGGED IN PORTAL LAYOUT
              (() => {
                const emp = employees.find(e => e.id === loggedInEmployeeId);
                if (!emp) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <p className="text-xs text-slate-400">Profile not found.</p>
                      <button onClick={() => setLoggedInEmployeeId(null)} className="mt-4 px-4 py-2 bg-slate-900 border border-slate-800 text-xs font-bold rounded-xl text-white">Back</button>
                    </div>
                  );
                }

                const photoUrl = emp.caricature_url || emp.photo_url;
                const getPhotoUrl = (url: string) => url.startsWith('/static') ? `http://localhost:8000${url}` : url;

                return (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none bg-[#12131A] border border-slate-900 p-6 rounded-3xl">
                      <div className="flex items-center gap-4">
                        <img
                          src={getPhotoUrl(emp.photo_url)}
                          alt={emp.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-neonPink bg-slate-950 hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-black text-white">Happy Anniversary, {emp.name}! 🎉</h2>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Celebrating your <strong className="text-neonPink">{emp.anniversary_milestone}</strong> as {emp.designation} in {emp.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setLoggedInEmployeeId(null);
                            setPortalPreviewUrl(null);
                            triggerToast("Logged out of Employee Portal.");
                          }}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all"
                        >
                          Logout Simulator
                        </button>
                      </div>
                    </div>

                    {/* Dual Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      {/* Left: Anniversary Celebration Card */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Interactive Celebrant Card */}
                        <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-6 relative overflow-hidden shadow-pinkGlow">
                          <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-4">Your Milestone Card</h3>
                          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#090A0F] border border-slate-850 relative group">
                            <img
                              src={getPhotoUrl(photoUrl)}
                              alt="Caricature Card"
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute top-3 right-3 px-3 py-1 bg-[#090A0F]/80 backdrop-blur-md rounded-xl text-[10px] font-bold text-slate-350 border border-slate-880">
                              {emp.anniversary_milestone.replace(' Anniversary', '')}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-3">
                            <button
                              onClick={() => playAnniversaryWishText(emp)}
                              className="flex-1 py-2.5 px-4 bg-[#00FFE0]/15 hover:bg-[#00FFE0]/25 text-[#00FFE0] border border-[#00FFE0]/25 hover:border-[#00FFE0]/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                            >
                              <IconVolume2 className="w-4 h-4" />
                              <span>Play Greeting</span>
                            </button>
                            <button
                              onClick={() => handleDownloadCaricature(emp)}
                              className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
                              title="Download Asset"
                            >
                              <IconDownload className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Letter of Appreciation */}
                        <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-6 space-y-3">
                          <h4 className="text-xs font-black text-slate-500 tracking-widest uppercase">Recognition Message</h4>
                          <p className="text-xs text-slate-350 leading-relaxed italic">
                            "Thank you, {emp.name}, for being an amazing colleague and leader in the {emp.department} team! Your colleagues value your enthusiasm, including your love for {emp.hobbies.join(', ')}. We wish you a beautiful anniversary day!"
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {emp.tags.map(tag => (
                              <span key={tag} className="text-[10px] bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-md text-slate-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Personal Customizer / Picture Canvas */}
                      <div className="lg:col-span-3 bg-[#12131A] border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
                        <div className="space-y-6">
                          <div className="border-b border-slate-900 pb-4 select-none">
                            <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                              My Caricature <span className="text-[#00FFE0] text-glow-cyan">Canvas</span> Customizer
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                              Choose a stylized caricature model and a custom backdrop theme to update your work anniversary photo.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-6 items-center">
                            {/* Left: Original Photo */}
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Original Photo</span>
                              <div className="aspect-square w-full rounded-2xl overflow-hidden border border-slate-900 bg-[#090A0F] max-w-[180px]">
                                <img
                                  src={getPhotoUrl(emp.photo_url)}
                                  alt="Original"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            {/* Right: Styled Preview */}
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-[9px] font-bold text-[#00FFE0] tracking-widest uppercase text-glow-cyan">Live Preview</span>
                              <div className="aspect-square w-full rounded-2xl overflow-hidden border border-slate-900 bg-[#090A0F] relative max-w-[180px] shadow-cyanGlow">
                                {isPortalCanvasLoading && (
                                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center select-none z-10">
                                    <div className="relative flex items-center justify-center w-8 h-8 mb-1">
                                      <div className="absolute inset-0 border-2 border-t-[#00FFE0] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                      <IconSparkles className="w-3.5 h-3.5 text-[#00FFE0] animate-pulse-fast" />
                                    </div>
                                    <span className="text-[8px] font-bold text-[#00FFE0] tracking-wider uppercase animate-pulse">Rendering...</span>
                                  </div>
                                )}

                                {portalPreviewUrl ? (
                                  <img
                                    src={portalPreviewUrl}
                                    alt="Caricature Preview"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px] text-center p-4">Select style parameters below</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Controls Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-900">
                            {/* Style Selector */}
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-bold text-slate-450 tracking-wider uppercase">Caricature Style</h4>
                              <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                                {[
                                  { id: 'Anime', name: 'Original Anime' },
                                  { id: 'Hayao', name: 'Ghibli Style' },
                                  { id: 'Shinkai', name: 'Shinkai Style' },
                                  { id: 'Paprika', name: 'Paprika Style' },
                                  { id: 'Sketch', name: 'Pencil Sketch' },
                                  { id: 'Charcoal', name: 'Charcoal Sketch' },
                                  { id: 'Watercolor', name: 'Watercolor' },
                                  { id: 'Cartoon', name: 'Pixar Cartoon' },
                                  { id: 'PixelArt', name: '8-Bit Pixel' },
                                  { id: 'OilPainting', name: 'Oil Painting' },
                                  { id: 'PopArt', name: 'Pop Art' }
                                ].map((style) => (
                                  <button
                                    key={style.id}
                                    onClick={() => setPortalStyle(style.id)}
                                    className={`py-2 px-2.5 rounded-lg border text-[10px] font-bold transition-all truncate ${
                                      portalStyle === style.id
                                        ? 'bg-neonPink border-neonPink text-white shadow-glow'
                                        : 'bg-[#1D2130]/30 border-slate-800/85 text-slate-400 hover:border-slate-700 hover:text-white'
                                    }`}
                                  >
                                    {style.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Backdrop Selector */}
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-bold text-slate-450 tracking-wider uppercase">Backdrop Theme</h4>
                              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                {[
                                  { id: 'none', name: 'No Backdrop', desc: 'Default background style' },
                                  { id: 'sunset', name: 'Sunset Explorer', desc: 'Sunset glow with silhouettes' },
                                  { id: 'matrix', name: 'Tech Matrix', desc: 'Matrix green code streams' },
                                  { id: 'office', name: 'Office Spotlight', desc: 'Professional corporate spotlight' },
                                  { id: 'neon', name: 'Neon Glow border', desc: 'Vibrant neon borders frame' }
                                ].map((bg) => (
                                  <button
                                    key={bg.id}
                                    onClick={() => setPortalBackdrop(bg.id as any)}
                                    className={`w-full text-left p-2 rounded-lg border flex flex-col transition-all ${
                                      portalBackdrop === bg.id
                                        ? 'bg-[#1D2130] border-[#00FFE0] text-white shadow-[0_0_8px_rgba(0,255,224,0.1)]'
                                        : 'bg-slate-900/30 border-slate-850 text-slate-450 hover:border-slate-800 hover:text-slate-350'
                                    }`}
                                  >
                                    <span className={`font-bold text-[10px] ${portalBackdrop === bg.id ? 'text-[#00FFE0]' : ''}`}>{bg.name}</span>
                                    <span className="text-[8px] text-slate-500 font-semibold mt-0.5">{bg.desc}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Save Action */}
                        <div className="border-t border-slate-900 pt-4 mt-6">
                          <button
                            onClick={handleSavePortalCanvasArtwork}
                            disabled={isPortalCanvasLoading || !portalPreviewUrl}
                            className={`w-full py-2.5 px-4 rounded-xl text-xs font-black text-center transition-all ${
                              portalPreviewUrl && !isPortalCanvasLoading
                                ? 'bg-gradient-to-r from-neonPink to-violet-650 hover:from-neonPink hover:to-violet-750 text-white shadow-glow active:scale-[0.98]'
                                : 'bg-[#1D2130] text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            Update My Profile Picture Card
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        ) : activeTab === 'employees' ? (
          // ==================== EMPLOYEES DIRECTORY REGISTRY ====================
          <div className="flex-1 overflow-y-auto p-8">
            {currentUser.role === 'HR' ? (
              <>
                <div className="mb-8 select-none">
                  <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
                    Employee <span className="text-neonPink">Directory</span> Registry
                  </h2>
                  <p className="text-sm text-slate-400 max-w-2xl mt-2 leading-relaxed">
                    View all company employees registered for milestones. Manage profiles, update details, or jump straight to stylization.
                  </p>
                </div>
                
                {/* Search/Filters bar */}
                <FilterBar 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  deptFilter={deptFilter}
                  setDeptFilter={setDeptFilter}
                  departments={departments}
                  onUploadTrigger={() => setIsRegisterModalOpen(true)}
                />

                {/* Table layout of employees */}
                <div className="bg-[#12131A] border border-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-900 bg-[#090A0F]/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                          <th className="py-4 px-6">Employee</th>
                          <th className="py-4 px-6">Department</th>
                          <th className="py-4 px-6">Milestone</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6">Age</th>
                          <th className="py-4 px-6">Hobbies & Activities</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900/60 text-xs text-slate-200">
                        {filteredEmployees.length > 0 ? (
                          filteredEmployees.map((emp) => {
                            const isAwaiting = emp.status === 'Awaiting Stylization';
                            const isGenerating = emp.status === 'Generating';
                            const isReady = emp.status === 'Ready for Review';
                            const isApproved = emp.status === 'Approved';

                            let statusColor = "text-slate-450 border-slate-800 bg-slate-900/50";
                            if (isAwaiting) statusColor = "text-slate-400 border-slate-800 bg-slate-900/40";
                            if (isGenerating) statusColor = "text-neonPink border-neonPink/20 bg-neonPink/5";
                            if (isReady) statusColor = "text-emerald-400 border-emerald-500/20 bg-emerald-950/10";
                            if (isApproved) statusColor = "text-[#00FFE0] border-[#00FFE0]/20 bg-[#00FFE0]/5";

                            const getPhotoUrl = (url: string) => {
                              if (url.startsWith('/static')) {
                                return `http://localhost:8000${url}`;
                              }
                              return url;
                            };

                            return (
                              <tr key={emp.id} className="hover:bg-slate-900/20 transition-colors">
                                <td className="py-3.5 px-6">
                                  <div className="flex items-center space-x-3">
                                    <img 
                                      src={getPhotoUrl(emp.photo_url)} 
                                      alt={emp.name} 
                                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-800 bg-slate-950 shrink-0"
                                    />
                                    <div className="flex flex-col min-w-0">
                                      <span className="font-bold text-slate-100 truncate">{emp.name}</span>
                                      <span className="text-[10px] text-slate-500 font-medium truncate">{emp.designation}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-6 text-slate-300 font-semibold">{emp.department}</td>
                                <td className="py-3.5 px-6">
                                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400">
                                    {emp.anniversary_milestone.replace(' Anniversary', '')}
                                  </span>
                                </td>
                                <td className="py-3.5 px-6">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                                    {isGenerating && <span className="w-1.5 h-1.5 rounded-full bg-neonPink animate-ping"></span>}
                                    {emp.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-6 text-slate-400 font-medium">{emp.age}</td>
                                <td className="py-3.5 px-6 max-w-xs">
                                  <div className="flex flex-col gap-0.5 truncate text-[10px] text-slate-450">
                                    <span className="truncate"><strong>Hobbies:</strong> {emp.hobbies.length > 0 ? emp.hobbies.join(', ') : 'None'}</span>
                                    <span className="truncate"><strong>Activities:</strong> {emp.activities.length > 0 ? emp.activities.join(', ') : 'None'}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => playAnniversaryWishText(emp)}
                                      className="p-1.5 border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 bg-slate-900/40 rounded-lg text-[#00E5FF] hover:text-white transition-colors"
                                      title="Play Voice Wish"
                                    >
                                      <IconVolume2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setActiveEditEmployee(emp)}
                                      className="p-1.5 border border-slate-850 hover:border-slate-700 bg-slate-900/40 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                                      title="Update Info"
                                    >
                                      <IconEdit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedId(emp.id);
                                        setActiveTab('queue');
                                        triggerToast(`Viewing details for ${emp.name}`);
                                      }}
                                      className="p-1.5 border border-neonPink/20 hover:border-neonPink/50 bg-slate-900/40 rounded-lg text-neonPink hover:text-white transition-colors"
                                      title="Focus in Queue"
                                    >
                                      <IconSearch className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-500 select-none font-bold">
                              No employees matching the search criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              /* Employee Role Coworker Directory & Coworker Profile wishes section */
              (() => {
                if (selectedCoworkerId !== null) {
                  const coworker = employees.find(e => e.id === selectedCoworkerId);
                  if (!coworker) return <p className="text-xs text-slate-400">Coworker profile not found.</p>;
                  const photoUrl = coworker.caricature_url || coworker.photo_url;
                  const displayUrl = photoUrl.startsWith('/static') ? `http://localhost:8000${photoUrl}` : photoUrl;
                  
                  // Filter public wishes AND wishes sent by the logged-in user to this coworker
                  const coworkerWishes = wishes.filter(w => 
                    w.receiver_id === coworker.id && 
                    (w.is_public || w.sender_id === currentUser.id)
                  );

                  return (
                    <div className="space-y-6">
                      <button 
                        onClick={() => {
                          setSelectedCoworkerId(null);
                          setWishMessage('');
                          setWishFile(null);
                          setWishFilePreview(null);
                          setGeneratedWishCaricatureUrl(null);
                          setIsWishPublic(false);
                        }}
                        className="py-2 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <span>← Back to Directory</span>
                      </button>

                      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Left Side: Coworker details */}
                        <div className="lg:col-span-2 space-y-6 animate-fade-in">
                          <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-6 shadow-pinkGlow">
                            <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-4">Milestone Profile</h3>
                            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#090A0F] border border-slate-850 relative group">
                              <img 
                                src={displayUrl} 
                                alt={coworker.name} 
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                            <div className="mt-4 space-y-2">
                              <h3 className="text-xl font-black text-white">{coworker.name}</h3>
                              <p className="text-xs text-slate-400">{coworker.designation} • <span className="text-neonPink font-extrabold">{coworker.anniversary_milestone}</span></p>
                              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Joined: {coworker.joining_date} • {coworker.department}</p>
                            </div>
                          </div>

                          <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-6 space-y-4">
                            <div>
                              <strong className="text-slate-400 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">Hobbies</strong>
                              <p className="text-xs text-slate-200">{coworker.hobbies.join(', ')}</p>
                            </div>
                            <div>
                              <strong className="text-slate-400 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">Activities</strong>
                              <p className="text-xs text-slate-200">{coworker.activities.join(', ')}</p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-900/60">
                              {coworker.tags.map(t => (
                                <span key={t} className="text-[9px] bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-slate-400">#{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Wishes Form and Wall */}
                        <div className="lg:col-span-3 space-y-6 animate-fade-in">
                          {/* Write peer wish form */}
                          <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-6">
                            <h3 className="text-sm font-black text-white mb-4 flex items-center gap-1.5">
                              <span>🎁 Send a Peer Anniversary Wish</span>
                            </h3>
                            <form onSubmit={handleSendWish} className="space-y-4">
                              <textarea
                                value={wishMessage}
                                onChange={(e) => setWishMessage(e.target.value)}
                                placeholder={`Write a personalized anniversary wish for ${coworker.name}...`}
                                className="w-full h-24 p-4 bg-[#090A0F] border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-neonPink/50 transition-colors"
                                required
                              />

                              {/* Public/Private Toggle Selection */}
                              <div className="flex items-center justify-between border-t border-slate-900/60 pt-4 mt-2">
                                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Wish Visibility</span>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setIsWishPublic(true)}
                                    className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                                      isWishPublic
                                        ? 'bg-neonPink border-neonPink text-white shadow-glow'
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    <span>📢</span>
                                    <span>Public Feed</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setIsWishPublic(false)}
                                    className={`py-1.5 px-3 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                                      !isWishPublic
                                        ? 'bg-neonPink border-neonPink text-white shadow-glow'
                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    <span>🔒</span>
                                    <span>Private Wall</span>
                                  </button>
                                </div>
                              </div>

                              {/* Upload wish custom image and style transfer options */}
                              <div className="space-y-3 border-t border-slate-900/60 pt-4">
                                <label className="text-[10px] font-bold text-slate-450 tracking-wider uppercase block">Attach Photo or Custom Caricature (optional)</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleWishFileChange}
                                  className="w-full px-3 py-2 bg-[#090A0F] border border-slate-800/80 rounded-lg text-xs text-slate-200 file:bg-neonPink/20 file:border-0 file:text-neonPink file:text-xs file:font-bold file:px-2.5 file:py-1 file:rounded-md cursor-pointer"
                                />
                                
                                {wishFile && (
                                  <div className="space-y-3 bg-[#090A0F]/60 border border-slate-850 p-4 rounded-2xl mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex-1 space-y-1.5">
                                      <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">AI Caricature Style</label>
                                      <select
                                        value={wishCaricatureStyle}
                                        onChange={(e) => setWishCaricatureStyle(e.target.value)}
                                        className="w-full bg-[#12131A] border border-slate-800 px-3 py-2 rounded-lg text-xs font-semibold text-slate-350 focus:outline-none focus:border-neonPink/50 cursor-pointer"
                                      >
                                        <option value="Anime">Original Anime</option>
                                        <option value="Hayao">Ghibli Style</option>
                                        <option value="Shinkai">Shinkai Style</option>
                                        <option value="Paprika">Paprika Style</option>
                                        <option value="Sketch">Pencil Sketch</option>
                                        <option value="Charcoal">Charcoal Sketch</option>
                                        <option value="Watercolor">Watercolor</option>
                                        <option value="Cartoon">Pixar Cartoon</option>
                                        <option value="PixelArt">8-Bit Pixel</option>
                                        <option value="OilPainting">Oil Painting</option>
                                        <option value="PopArt">Pop Art</option>
                                      </select>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleGenerateWishCaricature}
                                      disabled={isGeneratingWishCaricature}
                                      className="w-full sm:w-auto py-2.5 px-4 bg-[#00FFE0]/15 hover:bg-[#00FFE0]/25 text-[#00FFE0] border border-[#00FFE0]/25 hover:border-[#00FFE0]/40 rounded-xl text-xs font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shrink-0"
                                    >
                                      {isGeneratingWishCaricature ? 'Transforming...' : 'Transform into Caricature'}
                                    </button>
                                  </div>
                                )}

                                {wishFilePreview && (
                                  <div className="relative w-36 aspect-square rounded-xl overflow-hidden border border-slate-850 mt-2 shadow-panelGlow">
                                    <img src={wishFilePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button 
                                      type="button" 
                                      onClick={() => { 
                                        setWishFile(null); 
                                        setWishFilePreview(null); 
                                        setGeneratedWishCaricatureUrl(null); 
                                      }}
                                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-slate-400 hover:text-white"
                                    >
                                      <IconX className="w-3.5 h-3.5" />
                                    </button>
                                    {isGeneratingWishCaricature && (
                                      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                                        <div className="border-2 border-t-neonPink border-r-transparent border-b-transparent border-l-transparent rounded-full w-8 h-8 animate-spin"></div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <button
                                type="submit"
                                disabled={isSendingWish}
                                className="w-full py-3 bg-gradient-to-r from-neonPink to-violet-650 hover:from-neonPink hover:to-violet-750 text-white font-black text-xs rounded-xl shadow-glow transition-all flex items-center justify-center gap-1.5 mt-2"
                              >
                                {isSendingWish ? 'Sending Wish...' : isWishPublic ? 'Send Public Wish 📢' : 'Send Private Wish 🔒'}
                              </button>
                            </form>
                            <span className="block text-[10px] text-slate-500 mt-3 font-semibold leading-relaxed">
                              {isWishPublic
                                ? '📢 Public wishes appear on the company-wide celebration feed and fullscreen slideshow overlays.'
                                : '🔒 Private peer wishes are isolated and will only appear on the recipient\'s private wishing wall.'}
                            </span>
                          </div>

                          {/* Wishes wall */}
                          <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-6">
                            <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-4">Anniversary Wishing Wall ({coworkerWishes.length})</h3>
                            <div className="space-y-4">
                              {coworkerWishes.length > 0 ? (
                                coworkerWishes.map((w) => (
                                  <div key={w.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-850/80 flex gap-4">
                                    {w.caricature_image_url && (
                                      <img 
                                        src={w.caricature_image_url.startsWith('/static') ? `http://localhost:8000${w.caricature_image_url}` : w.caricature_image_url} 
                                        alt="Wish attachment" 
                                        className="w-16 h-16 rounded-xl object-cover border border-slate-800"
                                      />
                                    )}
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-[#00FFE0]">{w.sender_name}</span>
                                        <span className="text-[9px] text-slate-500">{w.created_at}</span>
                                      </div>
                                      <p className="text-xs text-slate-300 leading-relaxed italic">"{w.message_text}"</p>
                                      {!w.is_public && (
                                        <span className="inline-flex items-center gap-1 text-[8px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-500 font-bold uppercase mt-1">
                                          🔒 Private
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-slate-500 italic py-4 text-center">No anniversary wishes visible on the wall yet. Be the first to congratulate them!</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <>
                      <div className="mb-8 select-none">
                        <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
                          Coworkers <span className="text-neonPink">Directory</span>
                        </h2>
                        <p className="text-sm text-slate-400 max-w-2xl mt-2 leading-relaxed">
                          Connect with your colleagues, view their custom caricatures, and send anniversary wishes!
                        </p>
                      </div>

                      {(() => {
                        const sortedCoworkers = [...employees]
                          .filter(e => e.id !== currentUser.id && e.id !== 'admin')
                          .sort((a, b) => {
                            const daysA = getDaysUntilAnniversary(a.anniversary_date);
                            const daysB = getDaysUntilAnniversary(b.anniversary_date);
                            return daysA - daysB;
                          });

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedCoworkers.map((emp) => {
                              const photoUrl = emp.caricature_url || emp.photo_url;
                              const displayUrl = photoUrl.startsWith('/static') ? `http://localhost:8000${photoUrl}` : photoUrl;
                              const daysLeft = getDaysUntilAnniversary(emp.anniversary_date);
                              const isUpcoming = daysLeft <= 15;

                              return (
                                <div 
                                  key={emp.id}
                                  onClick={() => setSelectedCoworkerId(emp.id)}
                                  className={`bg-[#12131A] border-2 rounded-3xl p-5 cursor-pointer transition-all flex flex-col justify-between gap-4 group hover:scale-[1.01] ${
                                    isUpcoming
                                      ? 'border-neonPink shadow-pinkGlow animate-pulse-once'
                                      : 'border-slate-900 hover:border-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-850 bg-slate-950 shrink-0 shadow-glow">
                                      <img 
                                        src={displayUrl} 
                                        alt={emp.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      />
                                      {isUpcoming && (
                                        <span className="absolute -bottom-1 -right-1 bg-neonPink text-white text-[8px] font-black px-1 py-0.5 rounded-full border border-[#12131A] animate-pulse">
                                          🎉
                                        </span>
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5 font-sans">
                                        <h4 className="font-bold text-base text-slate-100 truncate group-hover:text-neonPink transition-colors">{emp.name}</h4>
                                        {isUpcoming && (
                                          <span className="text-[8px] bg-neonPink/20 text-neonPink border border-neonPink/30 px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider animate-pulse">
                                            Soon!
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-slate-500 truncate">{emp.designation}</p>
                                      <p className="text-[10px] text-slate-455 truncate uppercase tracking-wider font-semibold">{emp.department}</p>
                                    </div>
                                  </div>

                                  <div className="border-t border-slate-900/60 pt-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-[10px] text-slate-450">
                                      <div className="flex items-center gap-1">
                                        <span>📅 Date:</span>
                                        <span className="text-[#00FFE0] font-black tracking-wide text-glow-cyan">
                                          {formatAnniversaryDate(emp.anniversary_date)}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span>✨ Milestone:</span>
                                        <span className="text-neonPink font-extrabold text-glow-pink">
                                          {emp.anniversary_milestone.replace(' Anniversary', '')}
                                        </span>
                                      </div>
                                    </div>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCoworkerId(emp.id);
                                      }}
                                      className="w-full mt-1 py-2 bg-neonPink/10 hover:bg-neonPink hover:text-white border border-neonPink/30 rounded-xl text-[10px] font-black text-neonPink transition-all text-center"
                                    >
                                      Write Wish
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </>
                  );
                }
              })()
            )}
          </div>
        ) : activeTab === 'anniversary-dashboard' ? (
          // ==================== RECIPIENT'S ANNIVERSARY DASHBOARD ====================
          <div className="flex-1 overflow-y-auto p-8 bg-radial-gradient">
            <div className="mb-8 select-none bg-[#12131A] border-2 border-neonPink p-8 rounded-3xl relative overflow-hidden shadow-pinkGlow animate-fade-in text-center max-w-4xl mx-auto">
              {/* Confetti effect inside anniversary portal */}
              <ConfettiEffect trigger={1} />
              
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl border border-pink-500/25 bg-pink-950/15 text-xs font-extrabold text-neonPink uppercase tracking-widest text-glow-pink">
                  🎉 Happy Work Anniversary!
                </span>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  Congratulations, <span className="text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-[#00FFE0] text-glow-pink">{currentUser.name}</span>!
                </h1>
                <p className="text-sm text-slate-400 max-w-xl mx-auto mt-2 leading-relaxed">
                  Thank you for your incredible contribution as our <strong className="text-white">{currentUser.designation}</strong> in the {currentUser.department} department. The entire company celebrates your milestone!
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  <button 
                    onClick={() => playAnniversaryWishText(currentUser)}
                    className="py-2.5 px-5 bg-[#00FFE0] hover:bg-[#00E5CC] text-slate-950 font-black text-xs rounded-xl shadow-cyanGlow transition-all active:scale-[0.98] flex items-center gap-1.5"
                  >
                    <IconVolume2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Play Audio wish greeting</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Anniversary wishes grid */}
            <div className="mt-8 max-w-4xl mx-auto space-y-6">
              <h2 className="text-lg font-extrabold text-white select-none">Anniversary Wishing Cards sent to you</h2>
              
              {(() => {
                const myAnniversaryWishes = wishes.filter(w => w.receiver_id === currentUser.id);
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myAnniversaryWishes.length > 0 ? (
                      myAnniversaryWishes.map((w) => (
                        <div key={w.id} className="bg-[#12131A] border border-slate-900 rounded-3xl p-6 space-y-4 hover:border-slate-800 transition-all flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold uppercase tracking-wider ${w.is_public ? 'text-neonPink' : 'text-[#00FFE0]'}`}>
                                {w.is_public ? '📢 Public Greeting card' : '🔒 Private Greeting card'}
                              </span>
                              <span className="text-[10px] text-slate-500">{w.created_at}</span>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed italic">"{w.message_text}"</p>
                          </div>
                          {w.caricature_image_url && (
                            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-850 mt-3 shadow-panelGlow">
                              <img 
                                src={w.caricature_image_url.startsWith('/static') ? `http://localhost:8000${w.caricature_image_url}` : w.caricature_image_url} 
                                alt="Wish Caricature" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="border-t border-slate-900/60 pt-3 mt-3 text-[10px] text-slate-400">
                            From: <strong className="text-white">{w.sender_name}</strong>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-900 rounded-2xl select-none">
                        <span className="text-slate-500 font-bold mb-1 text-sm">No Wishing Cards Yet</span>
                        <span className="text-xs text-slate-655">Public and private celebration cards will appear here.</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        ) : activeTab === 'my-profile' ? (
          // ==================== MY PROFILE CARD TAB ====================
          <div className="flex-1 overflow-y-auto p-8 bg-radial-gradient flex flex-col h-full">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none bg-[#12131A] border border-slate-900 p-6 rounded-3xl">
                <div className="flex items-center gap-4">
                  <img
                    src={currentUser.caricature_url ? (currentUser.caricature_url.startsWith('/static') ? `http://localhost:8000${currentUser.caricature_url}` : currentUser.caricature_url) : (currentUser.photo_url.startsWith('/static') ? `http://localhost:8000${currentUser.photo_url}` : currentUser.photo_url)}
                    alt={currentUser.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-neonPink bg-slate-950 hover:scale-105 transition-transform"
                  />
                  <div>
                    <h2 className="text-2xl font-black text-white">My Milestone Profile: {currentUser.name}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Celebrating your <strong className="text-neonPink">{currentUser.anniversary_milestone}</strong> as {currentUser.designation} in {currentUser.department}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dual Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: Caricature card details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Interactive card */}
                  <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-6 relative overflow-hidden shadow-pinkGlow">
                    <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-4">My Caricature Card</h3>
                    <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#090A0F] border border-slate-855 relative group">
                      <img
                        src={currentUser.caricature_url ? (currentUser.caricature_url.startsWith('/static') ? `http://localhost:8000${currentUser.caricature_url}` : currentUser.caricature_url) : (currentUser.photo_url.startsWith('/static') ? `http://localhost:8000${currentUser.photo_url}` : currentUser.photo_url)}
                        alt="Caricature Card"
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 bg-[#090A0F]/80 backdrop-blur-md rounded-xl text-[10px] font-bold text-slate-350 border border-slate-880">
                        {currentUser.anniversary_milestone.replace(' Anniversary', '')}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <button
                        onClick={() => playAnniversaryWishText(currentUser)}
                        className="flex-1 py-2.5 px-4 bg-[#00FFE0]/15 hover:bg-[#00FFE0]/25 text-[#00FFE0] border border-[#00FFE0]/25 hover:border-[#00FFE0]/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <IconVolume2 className="w-4 h-4" />
                        <span>Play Greeting</span>
                      </button>
                      <button
                        onClick={() => handleDownloadCaricature(currentUser)}
                        className="py-2.5 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
                        title="Download Asset"
                      >
                        <IconDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Wishes sent to me (Public and Private) */}
                  <div className="bg-[#12131A] border border-slate-900 rounded-3xl p-6">
                    <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-4">Anniversary Wishing Wall ({wishes.filter(w => w.receiver_id === currentUser.id).length})</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                      {wishes.filter(w => w.receiver_id === currentUser.id).length > 0 ? (
                        wishes.filter(w => w.receiver_id === currentUser.id).map((w) => (
                          <div key={w.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-850/80 flex gap-4 animate-fade-in">
                            {w.caricature_image_url && (
                              <img 
                                src={w.caricature_image_url.startsWith('/static') ? `http://localhost:8000${w.caricature_image_url}` : w.caricature_image_url} 
                                alt="Wish attachment" 
                                className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                              />
                            )}
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-[#00FFE0]">{w.sender_name}</span>
                                <span className="text-[8px] text-slate-500">{w.created_at}</span>
                              </div>
                              <p className="text-xs text-slate-355 leading-relaxed italic">"{w.message_text}"</p>
                              <span className="inline-flex items-center gap-1 text-[8px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-500 font-bold uppercase mt-1">
                                {w.is_public ? '📢 Public' : '🔒 Private'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic py-4 text-center">No anniversary wishes on your wall yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Customizer / My Picture Canvas */}
                <div className="lg:col-span-3 bg-[#12131A] border border-slate-900 rounded-3xl p-6 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="border-b border-slate-900 pb-4 select-none">
                      <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                        My Caricature <span className="text-[#00FFE0] text-glow-cyan">Canvas</span> Customizer
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Choose a stylized caricature model and a custom backdrop theme to update your work anniversary photo.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 items-center">
                      {/* Left: Original Photo */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase">Original Photo</span>
                        <div className="aspect-square w-full rounded-2xl overflow-hidden border border-slate-900 bg-[#090A0F] max-w-[180px]">
                          <img
                            src={currentUser.photo_url.startsWith('/static') ? `http://localhost:8000${currentUser.photo_url}` : currentUser.photo_url}
                            alt="Original"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Right: Styled Preview */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[9px] font-bold text-[#00FFE0] tracking-widest uppercase text-glow-cyan">Live Preview</span>
                        <div className="aspect-square w-full rounded-2xl overflow-hidden border border-slate-900 bg-[#090A0F] relative max-w-[180px] shadow-cyanGlow">
                          {isProfileCanvasLoading && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center select-none z-10">
                              <div className="relative flex items-center justify-center w-8 h-8 mb-1">
                                <div className="absolute inset-0 border-2 border-t-[#00FFE0] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                <IconSparkles className="w-3.5 h-3.5 text-[#00FFE0] animate-pulse-fast" />
                              </div>
                              <span className="text-[8px] font-bold text-[#00FFE0] tracking-wider uppercase animate-pulse">Rendering...</span>
                            </div>
                          )}

                          {profilePreviewUrl ? (
                            <img
                              src={profilePreviewUrl}
                              alt="Caricature Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px] text-center p-4">Select style parameters below</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-900">
                      {/* Style Selector */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-450 tracking-wider uppercase">Caricature Style</h4>
                        <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                          {[
                            { id: 'Anime', name: 'Original Anime' },
                            { id: 'Hayao', name: 'Ghibli Style' },
                            { id: 'Shinkai', name: 'Shinkai Style' },
                            { id: 'Paprika', name: 'Paprika Style' },
                            { id: 'Sketch', name: 'Pencil Sketch' },
                            { id: 'Charcoal', name: 'Charcoal Sketch' },
                            { id: 'Watercolor', name: 'Watercolor' },
                            { id: 'Cartoon', name: 'Pixar Cartoon' },
                            { id: 'PixelArt', name: '8-Bit Pixel' },
                            { id: 'OilPainting', name: 'Oil Painting' },
                            { id: 'PopArt', name: 'Pop Art' }
                          ].map((style) => (
                            <button
                              key={style.id}
                              onClick={() => setProfileStyle(style.id)}
                              className={`py-2 px-2.5 rounded-lg border text-[10px] font-bold transition-all truncate ${
                                profileStyle === style.id
                                  ? 'bg-neonPink border-neonPink text-white shadow-glow'
                                  : 'bg-[#1D2130]/30 border-slate-800/85 text-slate-400 hover:border-slate-700 hover:text-white'
                              }`}
                            >
                              {style.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Backdrop Selector */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-450 tracking-wider uppercase">Backdrop Theme</h4>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {[
                            { id: 'none', name: 'No Backdrop', desc: 'Default background style' },
                            { id: 'sunset', name: 'Sunset Explorer', desc: 'Sunset glow with silhouettes' },
                            { id: 'matrix', name: 'Tech Matrix', desc: 'Matrix green code streams' },
                            { id: 'office', name: 'Office Spotlight', desc: 'Professional corporate spotlight' },
                            { id: 'neon', name: 'Neon Glow border', desc: 'Vibrant neon borders frame' }
                          ].map((bg) => (
                            <button
                              key={bg.id}
                              onClick={() => setProfileBackdrop(bg.id as any)}
                              className={`w-full text-left p-2 rounded-lg border flex flex-col transition-all ${
                                profileBackdrop === bg.id
                                  ? 'bg-[#1D2130] border-[#00FFE0] text-white shadow-[0_0_8px_rgba(0,255,224,0.1)]'
                                  : 'bg-slate-900/30 border-slate-850 text-slate-450 hover:border-slate-800 hover:text-slate-350'
                              }`}
                            >
                              <span className={`font-bold text-[10px] ${profileBackdrop === bg.id ? 'text-[#00FFE0]' : ''}`}>{bg.name}</span>
                              <span className="text-[8px] text-slate-500 font-semibold mt-0.5">{bg.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Action */}
                  <div className="border-t border-slate-900 pt-4 mt-6">
                    <button
                      onClick={handleSaveProfileCanvasArtwork}
                      disabled={isProfileCanvasLoading || !profilePreviewUrl}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-black text-center transition-all ${
                        profilePreviewUrl && !isProfileCanvasLoading
                          ? 'bg-gradient-to-r from-neonPink to-violet-650 hover:from-neonPink hover:to-violet-750 text-white shadow-glow active:scale-[0.98]'
                          : 'bg-[#1D2130] text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Update My Profile Picture Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center select-none text-slate-500">
            <h2 className="text-lg font-bold capitalize mb-1">{activeTab} Section</h2>
            <p className="text-xs text-slate-660">This module is active under the corporate celebration panel context scope.</p>
          </div>
        )}
      </main>

      {/* Right Drawer Inspection Panel */}
      {activeTab === 'queue' && selectedEmployee && (
        <InspectionView 
          employee={selectedEmployee}
          onClose={() => setSelectedId(null)}
          onApprove={handleApprove}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onDownload={handleDownloadCaricature}
          onFeedback={handleFeedback}
          onEditProfileClick={() => setActiveEditEmployee(selectedEmployee)}
          onRegenerate={handleGenerateCaricature}
          onDelete={handleDeleteEmployee}
        />
      )}

      {/* Register Milestone Modal */}
      <UploadModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegisterEmployee}
      />

      {/* Localized Inline Edit Modal */}
      {activeEditEmployee && (
        <UpdateEmployeeModal
          isOpen={!!activeEditEmployee}
          onClose={() => setActiveEditEmployee(null)}
          employee={activeEditEmployee}
          onUpdate={handleUpdateEmployee}
        />
      )}

      {/* Fullscreen Story Slideshow Overlay */}
      {selectedStoryEmployee && (
        <StorySlideshowOverlay
          employee={selectedStoryEmployee}
          wishes={wishes}
          onClose={() => setSelectedStoryEmployee(null)}
        />
      )}
    </div>
  );
}
