import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { submitReview, claimCoupon } from "../lib/api/reviews.functions";
import "./landing.css";

export const Route = createFileRoute("/")({
  component: CustomerExperienceApp,
});

// SSR-Safe Procedural Synthesizer for Scratch Card Audio Feedback
class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;

  init() {
    if (this.ctx) return;
    
    // Guard browser-only globals for SSR safety
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      this.ctx = new AudioContextClass();
      
      // Generate 2 seconds of white noise buffer
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = buffer;
      this.noiseSource.loop = true;

      // Bandpass filter to isolate scratch squeak frequencies
      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = "bandpass";
      this.noiseFilter.frequency.value = 900;
      this.noiseFilter.Q.value = 3.5;

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.value = 0; // Start completely silent

      this.noiseSource.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.ctx.destination);

      this.noiseSource.start(0);
    } catch (e) {
      console.warn("Failed to initialize Web Audio API Context:", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setIntensity(speed: number) {
    this.init();
    this.resume();
    if (!this.ctx || !this.noiseGain || !this.noiseFilter) return;

    const now = this.ctx.currentTime;
    // Map stroke speed directly to gain and center frequency
    const targetGain = Math.min(0.2, speed * 0.008);
    const targetFreq = Math.min(1600, 700 + speed * 8);

    this.noiseGain.gain.setTargetAtTime(targetGain, now, 0.03);
    this.noiseFilter.frequency.setTargetAtTime(targetFreq, now, 0.03);
  }

  stop() {
    if (this.ctx && this.noiseGain) {
      this.noiseGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04);
    }
  }

  playChime() {
    this.init();
    this.resume();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // C-major Pentatonic Scale arpeggio for magical win effect (C4, D4, E4, G4, A4, C5)
    const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];

    frequencies.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gainNode = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      // Bell envelope: fast attack, exponential decay decay decay
      gainNode.gain.setValueAtTime(0, now + index * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.12, now + index * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.45);

      osc.connect(gainNode);
      gainNode.connect(this.ctx!.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.48);
    });
  }
}

// Custom star SVG icons
function StarIcon({ filled, onClick, index, onMouseEnter }: { filled: boolean; onClick: () => void; index: number; onMouseEnter?: () => void }) {
  return (
    <button 
      type="button" 
      className="star-btn" 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <svg
        className={`star-icon ${filled ? "filled" : ""}`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    </button>
  );
}

// Visual Confetti Effect
function ConfettiEffect() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Tomato red, Warm orange, Honey gold colors
    const colors = ["#E5422B", "#F09456", "#ECC94B", "#362521", "#FFF9F2"];
    const items = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: 2.2 + Math.random() * 2,
      rotation: Math.random() * 360,
    }));
    setParticles(items);
  }, []);

  return (
    <div className="confetti-wrapper">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            backgroundColor: p.color,
            borderRadius: "2px",
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0.95,
            animation: `confettiFall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(105vh) rotate(540deg); }
        }
      `}</style>
    </div>
  );
}

// Sparkle graphic overlays
function SparkleLayer() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <div className="sparkle" style={{ top: "12%", left: "8%", animationDelay: "0.1s" }} />
      <div className="sparkle" style={{ top: "22%", right: "10%", animationDelay: "0.6s" }} />
      <div className="sparkle" style={{ bottom: "18%", left: "15%", animationDelay: "0.9s" }} />
      <div className="sparkle" style={{ bottom: "30%", right: "7%", animationDelay: "0.4s" }} />
      <style>{`
        .sparkle {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: var(--brand-gold);
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          animation: sparkleAnim 1.6s ease-in-out infinite;
        }
        @keyframes sparkleAnim {
          0%, 100% { transform: scale(0.3); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.95; filter: drop-shadow(0 0 3px var(--brand-gold)); }
        }
      `}</style>
    </div>
  );
}

// Stylized dumpling outline vector decoration matching the logo
const DumplingOutline = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M20,60 C20,78 35,83 50,83 C65,83 80,78 80,60 C80,45 70,35 50,35 C30,35 20,45 20,60 Z" 
      stroke="currentColor" 
      strokeWidth="3.5" 
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M50,35 C50,22 45,15 48,15" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M40,38 C35,27 30,22 35,22" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M60,38 C65,27 70,22 65,22" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M28,48 C25,42 22,40 25,38" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M72,48 C75,42 78,40 75,38" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
);

// High-fidelity four-pointed sparkle star vector
const TicketSparkle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12,2 C12,2 13,8 15,10 C17,12 22,12 22,12 C22,12 17,12 15,14 C13,16 12,22 12,22 C12,22 11,16 9,14 C7,12 2,12 2,12 C2,12 7,12 9,10 C11,8 12,2 12,2 Z" />
  </svg>
);

// Premium SVG background with moving ambient glow lights and floating vector dumplings
function PremiumAnimatedBackground() {
  const [bgParticles] = useState(() => 
    Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      left: 3 + Math.random() * 94,
      size: 24 + Math.random() * 26,
      delay: Math.random() * -35,
      duration: 22 + Math.random() * 18,
      rotation: Math.random() * 360,
      swayDuration: 6 + Math.random() * 6,
      opacity: 0.025 + Math.random() * 0.035
    }))
  );

  return (
    <div className="premium-animated-bg">
      {/* Dynamic ambient color gradients */}
      <div className="bg-glow glow-1" />
      <div className="bg-glow glow-2" />
      
      {/* Morphing rising steam paths */}
      <div className="steam-waves-container">
        <svg viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none" className="steam-wave-svg">
          <path className="steam-wave wave-a" d="M0,350 C360,300 720,400 1080,350 C1260,325 1380,340 1440,350 L1440,800 L0,800 Z" fill="url(#steam-grad-a)" />
          <path className="steam-wave wave-b" d="M0,420 C360,460 720,380 1080,420 C1260,440 1380,410 1440,420 L1440,800 L0,800 Z" fill="url(#steam-grad-b)" />
          <defs>
            <linearGradient id="steam-grad-a" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(229, 66, 43, 0.04)" />
              <stop offset="60%" stopColor="rgba(229, 66, 43, 0.01)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="steam-grad-b" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 249, 242, 0.03)" />
              <stop offset="60%" stopColor="rgba(255, 249, 242, 0.005)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating vector dumpling outlines */}
      <div className="bg-particles-container">
        {bgParticles.map((p) => (
          <div
            key={p.id}
            className="bg-floating-dumpling-wrapper"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`
            }}
          >
            <div
              className="bg-floating-dumpling-child"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                transform: `rotate(${p.rotation}deg)`,
                animationDuration: `${p.swayDuration}s`,
                animationDelay: `${p.delay * 0.4}s`
              } as any}
            >
              <DumplingOutline />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Interactive ScratchCard using custom audio synthesis intensity trigger
interface ScratchCardProps {
  rewardText: string;
  onReveal: () => void;
  audioSynth: AudioSynthEngine;
}

function ScratchCard({ rewardText, onReveal, audioSynth }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const prevPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawSilverCover();
    };

    const drawSilverCover = () => {
      // Brushed silver metallic gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#C5C9CD");
      grad.addColorStop(0.35, "#E2E5E8");
      grad.addColorStop(0.7, "#D0D4D8");
      grad.addColorStop(1, "#A2A6AA");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fine brushed metallic scratch texture strokes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 1.2;
      for (let i = 0; i < canvas.height; i += 3) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 15, i);
        ctx.lineTo(canvas.width - Math.random() * 15, i + (Math.random() * 2 - 1));
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
      ctx.lineWidth = 1.0;
      for (let i = 0; i < canvas.height; i += 5) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 15, i);
        ctx.lineTo(canvas.width - Math.random() * 15, i + (Math.random() * 2 - 1));
        ctx.stroke();
      }

      drawCoverText();
    };

    const drawCoverText = () => {
      ctx.fillStyle = "#606468"; // Charcoal grey matching reference image
      ctx.font = '800 17px "Outfit", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2);
    };

    initCanvas();
    window.addEventListener("resize", initCanvas);

    let drawing = false;

    const startDraw = (e: any) => {
      drawing = true;
      audioSynth.init();
      audioSynth.resume();
      
      const rect = canvas.getBoundingClientRect();
      let cx = 0, cy = 0;
      if (e.touches && e.touches[0]) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else {
        cx = e.clientX;
        cy = e.clientY;
      }
      prevPosRef.current = { x: cx - rect.left, y: cy - rect.top };
      
      scratch(e);
    };

    const stopDraw = () => {
      drawing = false;
      audioSynth.stop();
      checkFulfillment();
    };

    const scratch = (e: any) => {
      if (!drawing || isRevealed) return;
      const rect = canvas.getBoundingClientRect();
      let cx = 0, cy = 0;

      if (e.touches && e.touches[0]) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else {
        cx = e.clientX;
        cy = e.clientY;
      }

      const x = cx - rect.left;
      const y = cy - rect.top;

      // Calculate swipe speed
      const dx = x - prevPosRef.current.x;
      const dy = y - prevPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      prevPosRef.current = { x, y };

      // Set audio scratch intensity in synthesis engine
      if (distance > 0.5) {
        audioSynth.setIntensity(distance);
      }

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
    };

    const checkFulfillment = () => {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let emptyCount = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) emptyCount++;
      }

      const ratio = emptyCount / (pixels.length / 4);
      if (ratio > 0.55 && !isRevealed) {
        setIsRevealed(true);
        audioSynth.stop();
        audioSynth.playChime(); // Play pentatonic scale reveal sound
        canvas.style.opacity = "0";
        canvas.style.transition = "opacity 0.4s ease-out";
        setTimeout(() => {
          onReveal();
        }, 500);
      }
    };

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseleave", stopDraw);

    canvas.addEventListener("touchstart", startDraw);
    canvas.addEventListener("touchmove", scratch);
    canvas.addEventListener("touchend", stopDraw);

    return () => {
      window.removeEventListener("resize", initCanvas);
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", scratch);
      canvas.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("mouseleave", stopDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", scratch);
      canvas.removeEventListener("touchend", stopDraw);
    };
  }, [isRevealed, onReveal, audioSynth]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div className="scratch-reveal-content">
        <SparkleLayer />
        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", color: "var(--brand-orange)", marginBottom: "0.25rem" }}>LUCKY REWARD</h4>
        <div style={{ fontSize: "2rem", fontWeight: 900, textAlign: "center", color: "var(--brand-gold)", animation: "floatMomo 4s ease-in-out infinite" }}>
          {rewardText}
        </div>
      </div>
      <canvas ref={canvasRef} className="scratch-canvas" />
    </div>
  );
}

// Vector QR Code representation
function QRCodeIcon({ value }: { value: string }) {
  return (
    <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ border: "4px solid white", borderRadius: "10px", boxShadow: "var(--shadow-sm)" }}>
      <rect width="100" height="100" fill="white" />
      
      {/* Anchor squares */}
      <rect x="8" y="8" width="22" height="22" fill="var(--text-primary)" />
      <rect x="12" y="12" width="14" height="14" fill="white" />
      <rect x="15" y="15" width="8" height="8" fill="var(--text-primary)" />

      <rect x="70" y="8" width="22" height="22" fill="var(--text-primary)" />
      <rect x="74" y="12" width="14" height="14" fill="white" />
      <rect x="77" y="15" width="8" height="8" fill="var(--text-primary)" />

      <rect x="8" y="70" width="22" height="22" fill="var(--text-primary)" />
      <rect x="12" y="74" width="14" height="14" fill="white" />
      <rect x="15" y="77" width="8" height="8" fill="var(--text-primary)" />

      <rect x="77" y="77" width="8" height="8" fill="var(--text-primary)" />

      {/* QR matrix blocks */}
      <rect x="36" y="8" width="6" height="12" fill="var(--text-primary)" />
      <rect x="46" y="14" width="8" height="6" fill="var(--text-primary)" />
      <rect x="40" y="24" width="12" height="6" fill="var(--text-primary)" />
      
      <rect x="8" y="36" width="12" height="6" fill="var(--text-primary)" />
      <rect x="14" y="46" width="6" height="8" fill="var(--text-primary)" />
      <rect x="24" y="40" width="6" height="12" fill="var(--text-primary)" />

      <rect x="36" y="36" width="8" height="8" fill="var(--text-primary)" />
      <rect x="48" y="42" width="10" height="6" fill="var(--text-primary)" />
      <rect x="44" y="52" width="12" height="6" fill="var(--text-primary)" />

      <rect x="62" y="36" width="6" height="12" fill="var(--text-primary)" />
      <rect x="74" y="44" width="12" height="4" fill="var(--text-primary)" />
      <rect x="68" y="52" width="6" height="8" fill="var(--text-primary)" />

      <rect x="38" y="70" width="8" height="6" fill="var(--text-primary)" />
      <rect x="50" y="76" width="12" height="8" fill="var(--text-primary)" />
      <rect x="44" y="86" width="6" height="6" fill="var(--text-primary)" />
      
      <rect x="68" y="70" width="12" height="6" fill="var(--text-primary)" />
      <rect x="62" y="82" width="6" height="10" fill="var(--text-primary)" />
    </svg>
  );
}

function CustomerExperienceApp() {
  const [screen, setScreen] = useState<"welcome" | "review" | "unlock" | "scratch" | "revealed">("welcome");
  
  // Review form states
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  
  // Reward details
  const [rewardText, setRewardText] = useState<string>("");
  const [couponCode, setCouponCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  // Claim overlay details
  const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string>("");

  // SSR-Safe Web Audio Synthesizer reference
  const audioSynthRef = useRef<AudioSynthEngine | null>(null);

  useEffect(() => {
    // Instantiate Audio Engine only in browser environment
    audioSynthRef.current = new AudioSynthEngine();
  }, []);

  const ratingTexts = ["", "Terrible 😟", "Okay 😐", "Good 😊", "Delicious! 😋", "Heavenly! 🤩"];

  const handleStartReview = () => {
    if (audioSynthRef.current) {
      audioSynthRef.current.init();
      audioSynthRef.current.resume();
    }
    setScreen("review");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setFormError("Please select a star rating first!");
      return;
    }
    setFormError("");
    setIsSubmitting(true);

    try {
      const res = await submitReview({
        data: {
          email: email || null,
          rating,
          feedback: feedback || null,
        }
      });

      if (res.success) {
        setRewardText(res.rewardType);
        setCouponCode(res.couponCode);
        setScreen("unlock");
      } else {
        setFormError("Oops, something went wrong. Please try again!");
      }
    } catch (err) {
      console.error(err);
      setFormError("Connection error. Please try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 1800);
    }
  };

  const handleCashierRedeem = async () => {
    setIsClaiming(true);
    try {
      await claimCoupon({ data: { couponCode } });
      setIsClaimed(true);
      setTimeout(() => {
        setIsClaimModalOpen(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="app-container">
      {/* Premium animated SVG background */}
      <PremiumAnimatedBackground />

      {/* Floating Retro Japanese food spot illustrations */}
      <img src="/assets/noodle_spot.png" className="floating-spot spot-noodle" alt="Noodle bowl deco" />
      <img src="/assets/dumpling_spot.png" className="floating-spot spot-dumpling" alt="Dumpling deco" />

      {/* Screen 1 – Welcome */}
      {screen === "welcome" && (
        <div className="screen-content" style={{ justifyContent: "space-between" }}>
          
          {/* Steam particle emitter */}
          <div className="steam-container">
            <div className="steam-puff" style={{ animationDelay: "0s" }} />
            <div className="steam-puff" style={{ animationDelay: "0.8s" }} />
            <div className="steam-puff" style={{ animationDelay: "1.6s" }} />
          </div>

          <div style={{ textAlign: "center", paddingTop: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "var(--brand-red)", fontSize: "1.35rem", letterSpacing: "-0.01em" }}>
              🥟 MOMOJI
            </h3>
          </div>

          {/* Retro Ink & Watercolor Dumpling Basket illustration */}
          <div className="momo-visual-container">
            <img
              src="/assets/front_logo.png"
              alt="Steaming Hot Dumpling Basket illustration"
              className="momo-image"
            />
          </div>

          {/* Headline and start CTA */}
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <h1 className="display-title" style={{ textAlign: "center" }}>
              How was your <span className="gradient-text">meal?</span>
            </h1>
            <p className="sub-title" style={{ textAlign: "center", fontWeight: 500 }}>
              Rate your experience in 20 seconds and unlock a surprise reward.
            </p>
            <button
              onClick={handleStartReview}
              className="btn-primary"
              style={{ marginTop: "0.5rem" }}
            >
              Start Review
            </button>
          </div>
        </div>
      )}

      {/* Screen 2 – Review Form */}
      {screen === "review" && (
        <div className="screen-content" style={{ justifyContent: "center" }}>
          <form onSubmit={handleSubmitReview} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
                How did we do?
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                Your feedback helps us steam dumpling baskets better.
              </p>
            </div>

            {/* Single Overall Rating */}
            <div>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    index={star - 1}
                    filled={hoverRating ? star <= hoverRating : star <= rating}
                    onClick={() => { setRating(star); setFormError(""); }}
                    onMouseEnter={() => setHoverRating(star)}
                  />
                ))}
              </div>
              <div className="rating-label">
                {ratingTexts[hoverRating || rating] || "Tap a star to rate"}
              </div>
            </div>

            {/* Feedback textarea comments */}
            <div className="form-group">
              <label htmlFor="feedback" className="form-label">
                Comments
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you loved..."
                className="form-control"
              />
            </div>

            {/* Optional Email Address input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. delicious@momo.com"
                className="form-control"
              />
            </div>

            {formError && (
              <div style={{ color: "var(--brand-red)", fontWeight: 800, fontSize: "0.85rem", textAlign: "center" }}>
                ⚠️ {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? "Submitting..." : "Submit & Unlock Reward"}
            </button>
          </form>
        </div>
      )}

      {/* Screen 3 – Reward Unlock */}
      {screen === "unlock" && (
        <div className="screen-content" style={{ justifyContent: "space-between" }}>
          <ConfettiEffect />

          <div style={{ textAlign: "center", paddingTop: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "var(--brand-red)", fontSize: "1.25rem" }}>
              🎉 Thank You!
            </h3>
          </div>

          {/* Large pulsing golden gift box */}
          <div className="gift-visual-container">
            <img
              src="/assets/gift_box.png?v=2"
              alt="Pulsing Surprise Gift Box"
              className="gift-image"
            />
          </div>

          {/* Unlock action card */}
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", zIndex: 10 }}>
            <div style={{ textAlign: "center" }}>
              <h2 className="display-title" style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}>
                Surprise Ready!
              </h2>
              <p className="sub-title">
                Your feedback unlocked a retro secret reward card.
              </p>
            </div>
            <button
              onClick={() => setScreen("scratch")}
              className="btn-gold"
            >
              Scratch Now
            </button>
          </div>
        </div>
      )}

      {/* Screen 4 – Scratch Card */}
      {screen === "scratch" && (
        <div className="screen-content" style={{ justifyContent: "center" }}>
          <div className="scratch-card-container">
            <div className="retro-scratch-card">
              {/* Sunburst radial rays pattern and floating dumpling graphics */}
              <div className="ticket-ray-pattern" />
              <DumplingOutline className="dumpling-decor top-left" />
              <DumplingOutline className="dumpling-decor top-right" />
              <DumplingOutline className="dumpling-decor mid-left" />
              <DumplingOutline className="dumpling-decor mid-right" />
              <TicketSparkle className="ticket-sparkle s1" />
              <TicketSparkle className="ticket-sparkle s2" />

              <div className="scratch-card-body">
                {/* Centered Top Logo */}
                <div className="scratch-card-left">
                  <img src="/assets/front_logo.png" className="scratch-card-logo" alt="MOMOJI Logo" />
                </div>

                {/* Title and Canvas Scratch Box */}
                <div className="scratch-card-right">
                  <div className="scratch-title-group">
                    {/* Distressed spark lines on left */}
                    <svg className="accent-lines left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="4" y1="18" x2="16" y2="8" />
                      <line x1="8" y1="20" x2="20" y2="12" />
                    </svg>

                    <div className="scratch-win-title">
                      <span className="text-scratch">SCRATCH</span>
                      <span className="text-win">& WIN!</span>
                    </div>

                    {/* Distressed spark lines on right */}
                    <svg className="accent-lines right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <line x1="8" y1="8" x2="20" y2="18" />
                      <line x1="4" y1="12" x2="16" y2="22" />
                    </svg>
                  </div>

                  {/* Silver scratch box */}
                  <div className="scratch-area-wrapper">
                    <div className="scratch-area" style={{ width: "100%", height: "100%", margin: 0, border: "none", borderRadius: 0, boxShadow: "none" }}>
                      {audioSynthRef.current && (
                        <ScratchCard
                          rewardText={rewardText}
                          onReveal={() => setScreen("revealed")}
                          audioSynth={audioSynthRef.current}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Tagline Footer */}
              <div className="scratch-card-footer">
                <div className="footer-line"></div>
                <span className="footer-diamond">✦</span>
                <span className="footer-text">STEAMING GOOD VIBES</span>
                <span className="footer-diamond">✦</span>
                <div className="footer-line"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen 5 – Reward Revealed */}
      {screen === "revealed" && (
        <div className="screen-content" style={{ justifyContent: "center" }}>
          <ConfettiEffect />
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "center", textAlign: "center", position: "relative" }}>
            <SparkleLayer />
            
            {/* Expiry / Header */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "center" }}>
              <span className="badge-expiry">Valid Today Only</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.75rem" }}>
                Prize Unlocked!
              </h2>
            </div>

            {/* Revealed Prize details card */}
            <div style={{
              background: "#FFFDFB",
              border: "1.5px solid var(--text-primary)",
              borderRadius: "16px",
              padding: "1.25rem",
              width: "100%",
              boxShadow: "var(--shadow-sm)"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.15rem" }}>
                {rewardText.includes("Momos") ? "🥟" : rewardText.includes("OFF") ? "🎁" : rewardText.includes("Drink") ? "🥤" : "🍟"}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.55rem", color: "var(--brand-red)" }}>
                {rewardText}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                Enjoy this reward on your current or next purchase.
              </p>
            </div>

            {/* Copyable Coupon Code */}
            <div style={{ width: "100%" }}>
              <div className="coupon-box" onClick={handleCopyCode}>
                <span>{couponCode}</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {copyFeedback && (
                  <span style={{
                    position: "absolute",
                    top: "-22px",
                    background: "var(--text-primary)",
                    color: "white",
                    fontSize: "0.7rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontFamily: "var(--font-body)"
                  }}>
                    {copyFeedback}
                  </span>
                )}
              </div>
            </div>

            {/* QR verification code */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "center" }}>
              <QRCodeIcon value={couponCode} />
              <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 600, marginTop: "0.4rem" }}>
                Scan Code at Register
              </span>
            </div>

            {/* Redemption CTA */}
            <button
              onClick={() => setIsClaimModalOpen(true)}
              className="btn-primary"
              style={{ width: "100%" }}
            >
              Show to Cashier
            </button>
          </div>
        </div>
      )}

      {/* Cashier Redemption Confirmation Sheet */}
      {isClaimModalOpen && (
        <div className="modal-overlay" onClick={() => setIsClaimModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 className="modal-title">Cashier Verification</h3>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-secondary)" }}
              >
                &times;
              </button>
            </div>
            
            {!isClaimed ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  Please present this to the cashier to redeem the offer:
                </p>
                <div style={{ background: "var(--brand-beige)", border: "1.5px solid var(--text-primary)", padding: "0.7rem 1rem", borderRadius: "8px", textAlign: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.1rem" }}>
                  {couponCode}
                </div>
                <button
                  onClick={handleCashierRedeem}
                  disabled={isClaiming}
                  className="btn-primary"
                  style={{ background: "var(--brand-orange)", boxShadow: "0 3px 0 var(--text-primary)" }}
                >
                  {isClaiming ? "Redeeming..." : "Confirm Redeemed"}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "1.25rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
                <div style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "#C6F6D5",
                  color: "#22543D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.55rem",
                  border: "2px solid #22543D"
                }}>
                  ✓
                </div>
                <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem" }}>
                  Redeemed Successfully
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  This coupon has been validated and marked as claimed.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
