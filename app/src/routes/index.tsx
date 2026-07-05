import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { submitReview, claimCoupon } from "../lib/api/reviews.functions";
import "./landing.css";

export const Route = createFileRoute("/")({
  component: CustomerExperienceApp,
});

// A lightweight, responsive SVG Star Icon for the interactive 5-star rating
function StarIcon({ filled, onClick }: { filled: boolean; onClick: () => void }) {
  return (
    <button type="button" className="star-btn" onClick={onClick}>
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

// Lightweight CSS Confetti particle system
function ConfettiEffect() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const colors = ["#E53E3E", "#ED8936", "#ECC94B", "#FFFBF7", "#FEB47B"];
    const items = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage horizontal placement
      y: -10 - Math.random() * 20, // initial top placement
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: 2.5 + Math.random() * 2,
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
            height: `${p.size * 1.6}px`,
            backgroundColor: p.color,
            borderRadius: "3px",
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0.9,
            animation: `confettiFall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
}

// Sparkle element wrapper for rewards card
function SparkleLayer() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <div className="sparkle" style={{ top: "15%", left: "10%", animationDelay: "0.2s" }} />
      <div className="sparkle" style={{ top: "25%", right: "12%", animationDelay: "0.8s" }} />
      <div className="sparkle" style={{ bottom: "20%", left: "18%", animationDelay: "1.1s" }} />
      <div className="sparkle" style={{ bottom: "35%", right: "8%", animationDelay: "0.5s" }} />
      <style>{`
        .sparkle {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: var(--brand-gold);
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          animation: sparkleAnim 1.8s ease-in-out infinite;
        }
        @keyframes sparkleAnim {
          0%, 100% { transform: scale(0.4); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 4px var(--brand-gold)); }
        }
      `}</style>
    </div>
  );
}

// ScratchCard Interactive HTML5 Canvas component
interface ScratchCardProps {
  rewardText: string;
  onReveal: () => void;
}

function ScratchCard({ rewardText, onReveal }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawSilverCover();
    };

    const drawSilverCover = () => {
      const img = new Image();
      img.src = "/assets/silver_texture.png";
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawTextLabel();
      };
      img.onerror = () => {
        // Safe fallback in case image isn't loaded/ready
        ctx.fillStyle = "#B0B5BC";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawTextLabel();
      };
    };

    const drawTextLabel = () => {
      ctx.fillStyle = "rgba(44, 30, 26, 0.85)";
      ctx.font = 'bold 22px "Outfit", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Scratch Here 🥟", canvas.width / 2, canvas.height / 2);
    };

    setupCanvas();

    // Trigger canvas resizing safely on window updates
    window.addEventListener("resize", setupCanvas);

    let drawing = false;

    const startDraw = (e: any) => {
      drawing = true;
      scratch(e);
    };

    const stopDraw = () => {
      drawing = false;
      calcTransparentPercentage();
    };

    const scratch = (e: any) => {
      if (!drawing || isFullyRevealed) return;
      const rect = canvas.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
    };

    const calcTransparentPercentage = () => {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let clearCount = 0;

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
          clearCount++;
        }
      }

      const total = pixels.length / 4;
      const percentage = (clearCount / total) * 100;

      // Auto-reveal the coupon code once user has scratched >60% of the silver card surface
      if (percentage > 58 && !isFullyRevealed) {
        setIsFullyRevealed(true);
        canvas.style.opacity = "0";
        canvas.style.transition = "opacity 0.5s ease-out";
        setTimeout(() => {
          onReveal();
        }, 550);
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
      window.removeEventListener("resize", setupCanvas);
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", scratch);
      canvas.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("mouseleave", stopDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", scratch);
      canvas.removeEventListener("touchend", stopDraw);
    };
  }, [isFullyRevealed, onReveal]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Revealed content is sitting underneath the canvas */}
      <div className="scratch-reveal-content">
        <SparkleLayer />
        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--brand-orange)", marginBottom: "0.25rem" }}>YOUR REWARD</h4>
        <div style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", color: "var(--brand-red)", animation: "floatMomo 3.5s ease-in-out infinite" }}>
          {rewardText}
        </div>
      </div>
      <canvas ref={canvasRef} className="scratch-canvas" />
    </div>
  );
}

// Vector SVG QR Code Mockup Generator
function QRCodeIcon({ value }: { value: string }) {
  return (
    <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ border: "4px solid white", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
      <rect width="100" height="100" fill="white" />
      {/* Top Left Corner Anchor */}
      <rect x="10" y="10" width="25" height="25" fill="var(--text-primary)" />
      <rect x="14" y="14" width="17" height="17" fill="white" />
      <rect x="18" y="18" width="9" height="9" fill="var(--text-primary)" />

      {/* Top Right Corner Anchor */}
      <rect x="65" y="10" width="25" height="25" fill="var(--text-primary)" />
      <rect x="69" y="14" width="17" height="17" fill="white" />
      <rect x="73" y="18" width="9" height="9" fill="var(--text-primary)" />

      {/* Bottom Left Corner Anchor */}
      <rect x="10" y="65" width="25" height="25" fill="var(--text-primary)" />
      <rect x="14" y="69" width="17" height="17" fill="white" />
      <rect x="18" y="73" width="9" height="9" fill="var(--text-primary)" />

      {/* Small anchor bottom-right */}
      <rect x="73" y="73" width="9" height="9" fill="var(--text-primary)" />

      {/* Simulated QR Code Blocks */}
      <rect x="42" y="10" width="5" height="10" fill="var(--text-primary)" />
      <rect x="50" y="15" width="8" height="5" fill="var(--text-primary)" />
      <rect x="45" y="25" width="12" height="6" fill="var(--text-primary)" />
      
      <rect x="10" y="42" width="10" height="5" fill="var(--text-primary)" />
      <rect x="15" y="50" width="5" height="8" fill="var(--text-primary)" />
      <rect x="25" y="45" width="6" height="12" fill="var(--text-primary)" />

      <rect x="40" y="40" width="8" height="8" fill="var(--text-primary)" />
      <rect x="52" y="44" width="10" height="6" fill="var(--text-primary)" />
      <rect x="48" y="55" width="12" height="5" fill="var(--text-primary)" />

      <rect x="65" y="40" width="6" height="12" fill="var(--text-primary)" />
      <rect x="75" y="48" width="12" height="4" fill="var(--text-primary)" />
      <rect x="70" y="56" width="5" height="8" fill="var(--text-primary)" />

      <rect x="42" y="65" width="8" height="6" fill="var(--text-primary)" />
      <rect x="54" y="70" width="12" height="8" fill="var(--text-primary)" />
      <rect x="48" y="82" width="6" height="6" fill="var(--text-primary)" />
      
      <rect x="70" y="65" width="15" height="5" fill="var(--text-primary)" />
      <rect x="65" y="80" width="6" height="10" fill="var(--text-primary)" />
    </svg>
  );
}

function CustomerExperienceApp() {
  const [screen, setScreen] = useState<"welcome" | "review" | "unlock" | "scratch" | "revealed">("welcome");
  
  // Review inputs state
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  
  // Submit details received from backend server
  const [rewardText, setRewardText] = useState<string>("");
  const [couponCode, setCouponCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  // Claim process state
  const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string>("");

  const ratingTexts = ["", "Terrible 😟", "Okay 😐", "Good 😊", "Delicious! 😋", "Heavenly! 🥟"];

  const handleStartReview = () => {
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
      setTimeout(() => setCopyFeedback(""), 2000);
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
      {/* Animated steam background details */}
      <div className="steam-overlay" />

      {/* Screen 1 – Welcome */}
      {screen === "welcome" && (
        <div className="screen-content" style={{ justifyContent: "space-between" }}>
          {/* Top header bar */}
          <div style={{ textAlign: "center", paddingTop: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--brand-red)", fontSize: "1.25rem", letterSpacing: "-0.01em" }}>
              🥟 MOMO KITCHEN
            </h3>
          </div>

          {/* Steaming Momo Illustration */}
          <div className="momo-visual-container">
            <img
              src="/assets/steaming_momos.png"
              alt="Steaming Momos Illustration"
              className="momo-image"
            />
          </div>

          {/* Text panel card */}
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

      {/* Screen 2 – Review */}
      {screen === "review" && (
        <div className="screen-content" style={{ justifyContent: "center" }}>
          <form onSubmit={handleSubmitReview} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
                How did we do?
              </h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                Your feedback helps us steam better dumplings.
              </p>
            </div>

            {/* Interactive Rating Component */}
            <div>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    filled={hoverRating ? star <= hoverRating : star <= rating}
                    onClick={() => {
                      setRating(star);
                      setFormError("");
                    }}
                  />
                ))}
              </div>
              <div className="rating-label">
                {ratingTexts[hoverRating || rating] || "Tap a star to rate"}
              </div>
            </div>

            {/* Feedback text area */}
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

            {/* Email Address field */}
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
              <div style={{ color: "var(--brand-red)", fontWeight: 600, fontSize: "0.875rem", textAlign: "center" }}>
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
          {/* Confetti celebration triggers immediately on load */}
          <ConfettiEffect />

          <div style={{ textAlign: "center", paddingTop: "1rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--brand-red)", fontSize: "1.25rem" }}>
              🎉 Thank You!
            </h3>
          </div>

          {/* Large glowing gift box */}
          <div className="gift-visual-container">
            <img
              src="/assets/glowing_gift_box.png"
              alt="Glowing Gift Box"
              className="gift-image"
            />
          </div>

          {/* Description and Action card */}
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", zIndex: 10 }}>
            <div style={{ textAlign: "center" }}>
              <h2 className="display-title" style={{ fontSize: "1.85rem", marginBottom: "0.5rem" }}>
                Surprise ready!
              </h2>
              <p className="sub-title">
                Your review unlocked a secret dumpling reward card.
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
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", textAlign: "center" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
                Scratch to Reveal
              </h2>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                Swipe your finger on the metallic card below to reveal your prize.
              </p>
            </div>

            {/* Silver Scratch Canvas wrapper */}
            <div className="scratch-area">
              <ScratchCard
                rewardText={rewardText}
                onReveal={() => setScreen("revealed")}
              />
            </div>

            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
              Scratch at least 60% of the surface to reveal.
            </p>
          </div>
        </div>
      )}

      {/* Screen 5 – Reward Revealed */}
      {screen === "revealed" && (
        <div className="screen-content" style={{ justifyContent: "center" }}>
          <ConfettiEffect />
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", textAlign: "center", position: "relative" }}>
            <SparkleLayer />
            
            {/* Header / Expiry */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
              <span className="badge-expiry">Valid Today Only</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.85rem" }}>
                Presents Unlocked!
              </h2>
            </div>

            {/* Revealed Prize details card */}
            <div style={{
              background: "linear-gradient(135deg, #FFF9F3 0%, #FFF0E4 100%)",
              border: "1.5px solid rgba(237,137,54,0.18)",
              borderRadius: "20px",
              padding: "1.5rem",
              width: "100%",
              boxShadow: "var(--shadow-sm)"
            }}>
              <div style={{ fontSize: "2.75rem", marginBottom: "0.25rem" }}>
                {rewardText.includes("Momos") ? "🥟" : rewardText.includes("10%") ? "🎁" : rewardText.includes("Drink") ? "🥤" : "🍟"}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.65rem", color: "var(--brand-red)" }}>
                {rewardText}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                Enjoy this reward on your current or next visit.
              </p>
            </div>

            {/* Coupon code container */}
            <div style={{ width: "100%" }}>
              <div className="coupon-box" onClick={handleCopyCode}>
                <span>{couponCode}</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {copyFeedback && (
                  <span style={{
                    position: "absolute",
                    top: "-24px",
                    background: "var(--text-primary)",
                    color: "white",
                    fontSize: "0.75rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontFamily: "var(--font-body)"
                  }}>
                    {copyFeedback}
                  </span>
                )}
              </div>
            </div>

            {/* QR verification graphic */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "center" }}>
              <QRCodeIcon value={couponCode} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500, marginTop: "0.5rem" }}>
                Scan Code for Redemption
              </span>
            </div>

            {/* Verification CTA */}
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

      {/* Cashier Verification Modal Sheet */}
      {isClaimModalOpen && (
        <div className="modal-overlay" onClick={() => setIsClaimModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 className="modal-title">Cashier Redemption</h3>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-secondary)" }}
              >
                &times;
              </button>
            </div>
            
            {!isClaimed ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  Please present this screen to the cashier. The cashier will confirm the reward code:
                </p>
                <div style={{ background: "#F7FAFC", border: "1px solid #E2E8F0", padding: "0.75rem 1rem", borderRadius: "8px", textAlign: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "1.1rem" }}>
                  {couponCode}
                </div>
                <button
                  onClick={handleCashierRedeem}
                  disabled={isClaiming}
                  className="btn-primary"
                  style={{ background: "var(--brand-orange)", boxShadow: "0 4px 12px rgba(237, 137, 54, 0.25)" }}
                >
                  {isClaiming ? "Verifying..." : "Confirm Redeemed"}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "1.5rem 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#C6F6D5",
                  color: "#22543D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.75rem"
                }}>
                  ✓
                </div>
                <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem" }}>
                  Redeemed Successfully
                </h4>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  This coupon code has been marked as claimed in the system.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
