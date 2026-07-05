import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef } from 'react';
import PixelBlast from '../components/PixelBlast';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';
import PillNav from '../components/PillNav';
import BlurText from '../components/BlurText';
import './landing.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'Connect', href: 'https://wa.me/YOUR_BOT_NUMBER' }
  ];

  useGSAP(() => {
    // 1. Hero Text Reveal Animation
    const heroTitle = document.querySelector(".hero h1") as HTMLElement;
    if (heroTitle && !heroTitle.dataset.animated) {
      heroTitle.dataset.animated = "true";
      const text = heroTitle.innerHTML;
      const splitText = text.split(/(<br\/?>|<span[^>]*>|<\/span>|\s+)/i).filter(Boolean);
      
      heroTitle.innerHTML = "";
      splitText.forEach(part => {
          if (part.startsWith("<")) {
              heroTitle.innerHTML += part;
          } else if (part.trim() !== "") {
              const span = document.createElement("span");
              span.innerHTML = part + " ";
              heroTitle.appendChild(span);
          } else {
              heroTitle.innerHTML += " ";
          }
      });

      gsap.from(".hero h1 span", {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.2
      });
    }

    gsap.from(".hero p", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.8
    });

    gsap.from(".cta-group .primary-btn, .cta-group .secondary-btn", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 1.2
    });

    // 2. Scroll-Triggered Bento Cards
    gsap.from(".bento-header", {
        scrollTrigger: {
            trigger: ".bento-features",
            start: "top 60%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    gsap.utils.toArray(".bento-card").forEach((card: any, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: index * 0.1
        });
    });

    // 3. Scroll-Triggered FAQ
    gsap.from(".faq-title", {
        scrollTrigger: {
            trigger: ".faq-section",
            start: "top 60%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    gsap.utils.toArray(".faq-item").forEach((item: any, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: ".faq-section",
                start: "top 60%",
                toggleActions: "play none none reverse"
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: index * 0.1 + 0.3
        });
    });

    // 4. Navbar Scroll Blur Effect
    const navbar = document.querySelector(".navbar") as HTMLElement;
    const handleScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(12, 13, 16, 0.8)";
            navbar.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.5)";
        } else {
            navbar.style.background = "transparent";
            navbar.style.boxShadow = "none";
        }
    };
    window.addEventListener("scroll", handleScroll);

    // Magnetic Buttons
    const magneticWraps = document.querySelectorAll(".magnetic-wrap");
    magneticWraps.forEach(wrap => {
        const btn = wrap.querySelector(".nav-btn");
        wrap.addEventListener("mousemove", (e: any) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
        });
        wrap.addEventListener("mouseleave", () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
        });
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, { scope: containerRef });

  const toggleFaq = (e: React.MouseEvent<HTMLButtonElement>) => {
    const faqItem = e.currentTarget.parentElement;
    if (!faqItem) return;
    const isActive = faqItem.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    if (!isActive) {
        faqItem.classList.add('active');
    }
  };

  useEffect(() => {
    setTimeout(() => {
        const typing = document.querySelector('.typing');
        if (typing) {
            typing.innerHTML = "✅ Transaction successful! Sent 10 USDC to shijas*stellapp.com.<br><br>Tx Hash: <code>a7f8...9b2c</code><div class='msg-time'>10:42 AM</div>";
            typing.classList.remove('typing');
        }
    }, 3000);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Premium Hero Backgrounds */}
      <div className="mesh-bg"></div>
      <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          opacity: 0.75,
          pointerEvents: 'none'
      }}>
          <PixelBlast
              variant="circle"
              pixelSize={6}
              color="#007d11"
              patternScale={3.5}
              patternDensity={0.8}
              pixelSizeJitter={0.5}
              enableRipples={true}
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid={true}
              liquidStrength={0.12}
              liquidRadius={1.2}
              liquidWobbleSpeed={5}
              speed={0.6}
              edgeFade={0.25}
              transparent={true}
          />
      </div>
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>
      <div className="hero-grid-overlay"></div>
      <PillNav
          items={navItems}
          activeHref="#features"
          baseColor="rgba(23, 63, 53, 0.4)"
          pillColor="rgba(255, 255, 255, 0.04)"
          hoveredPillTextColor="#173F35"
          pillTextColor="white"
      />
 
      <header className="section hero">
          <div className="hero-left" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <BlurText
                  text="Chat. Build. Pay. On Stellar."
                  delay={120}
                  animateBy="words"
                  direction="top"
                  className="hero-title"
              />
              <p className="hero-desc">Send, receive, swap, deploy contracts and more — all on Stellar, all inside WhatsApp.</p>
              
              <div className="cta-group" style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <a href="https://wa.me/YOUR_BOT_NUMBER" target="_blank" rel="noopener noreferrer" className="primary-btn green-whatsapp-btn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.232 5.236-.001 11.666 0c3.112.001 6.04 1.214 8.243 3.42 2.203 2.206 3.413 5.138 3.411 8.254-.005 6.435-5.238 11.668-11.669 11.668-2.003-.001-3.975-.515-5.727-1.498L0 24zm6.49-4.22c1.652.98 3.275 1.497 4.975 1.498 5.282.003 9.585-4.295 9.588-9.58.001-2.559-1.002-4.966-2.822-6.79C16.486 3.082 14.093 2.08 11.665 2.08c-5.285 0-9.589 4.301-9.593 9.587-.001 1.776.467 3.51 1.358 5.045l-1.02 3.722 3.818-1.002c1.479.807 3.013 1.347 4.339 1.348zm11.083-7.53c-.307-.154-1.82-.9-2.1-.998-.28-.1-.486-.15-.69.155-.205.3-.79.998-.97 1.203-.18.204-.36.23-.667.075-.306-.15-.1.25-.7-2.613-.6-2.518.435-2.56.59-2.634.156-.073.307-.152.46-.307.153-.153.204-.256.307-.46.102-.205.05-.385-.025-.537-.077-.154-.69-1.662-.947-2.277-.25-.6-.525-.52-.72-.53-.188-.01-.403-.01-.618-.01-.215 0-.565.08-.86.402-.296.324-1.13 1.104-1.13 2.69 0 1.588 1.156 3.12 1.31 3.325.153.205 2.274 3.473 5.51 4.873.77.33 1.37.528 1.84.678.773.245 1.477.21 2.03.128.618-.093 1.82-.746 2.078-1.47.257-.727.257-1.35.18-1.48-.076-.13-.28-.204-.588-.358z"/>
                      </svg>
                      Chat on WhatsApp
                  </a>
                  <a href="#demo" className="secondary-btn play-demo-btn">
                      <div className="play-icon-circle">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                          </svg>
                      </div>
                      See How It Works
                  </a>
              </div>
          </div>
      </header>

      <section id="features" className="section bento-features" style={{ position: 'relative' }}>
          <div className="features-bg">
              <div className="features-orb orb-1"></div>
              <div className="features-orb orb-2"></div>
              <div className="features-orb orb-3"></div>
          </div>
          
          <div className="bento-container">
              <div className="bento-header">
                  <h2>With Stellapp, crypto is <span className="highlight">simple.</span></h2>
              </div>
              <ScrollStack useWindowScroll={true} itemDistance={120} baseScale={0.88} itemScale={0.03} itemStackDistance={25} className="scroll-stack-window">
                  <ScrollStackItem itemClassName="bento-card full-width light-card">
                      <div className="bento-content">
                          <h3>Send money to your contacts across the world instantly</h3>
                          <p>Send money anywhere in the world instantly with no banks and near-zero fees. If your contacts have WhatsApp, they have Stellapp.</p>
                      </div>
                      <div className="bento-icon">
                          <svg width="130" height="130" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 10px rgba(129, 199, 132, 0.25))' }}>
                              <g clipPath="url(#globeClip)">
                                  <path 
                                      fillRule="evenodd" 
                                      clipRule="evenodd" 
                                      d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" 
                                      fill="var(--accent-1)" 
                                  />
                              </g>
                              <defs>
                                  <clipPath id="globeClip">
                                      <rect width="16" height="16" fill="white"/>
                                  </clipPath>
                              </defs>
                          </svg>
                      </div>
                  </ScrollStackItem>
                  
                  <ScrollStackItem itemClassName="bento-card full-width dark-card">
                      <div className="bento-content">
                          <h3>Crypto & DeFi, One Message Away</h3>
                          <p>Buy, sell, and hold crypto such as XLM or USDC with just a text. We manage the wallet infrastructure for you, making Web3 completely effortless.</p>
                      </div>
                      <div className="bento-icon">
                          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 12px rgba(129, 199, 132, 0.25))' }}>
                              {/* Wallet Base */}
                              <rect x="15" y="30" width="70" height="45" rx="8" fill="var(--bg-color)" stroke="var(--accent-1)" strokeWidth="2"/>
                              
                              {/* Wallet Flap/Strap */}
                              <path d="M85 45H65C62.2386 45 60 47.2386 60 50C60 52.7614 62.2386 55 65 55H85" fill="var(--accent-2)" stroke="var(--accent-1)" strokeWidth="2"/>
                              <circle cx="72" cy="50" r="3" fill="var(--accent-1)"/>
                              
                              {/* Floating Crypto Coins */}
                              <g style={{ transform: 'translateY(-5px)' }}>
                                  {/* USDC-like coin */}
                                  <circle cx="40" cy="25" r="12" fill="#2775ca"/>
                                  <circle cx="40" cy="25" r="9" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                                  <path d="M38 22V28M42 22V28M37 25H43" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                  
                                  {/* Stellar/XLM-like coin */}
                                  <circle cx="65" cy="18" r="10" fill="var(--accent-1)"/>
                                  <circle cx="65" cy="18" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                                  <path d="M62 16L68 20M62 20L68 16" stroke="var(--bg-color)" strokeWidth="1.5" strokeLinecap="round"/>
                              </g>
                              
                              {/* Connecting nodes/network lines */}
                              <path d="M25 45L45 45" stroke="var(--accent-3)" strokeWidth="2" strokeDasharray="4 4"/>
                              <circle cx="25" cy="45" r="2" fill="var(--accent-3)"/>
                              <circle cx="45" cy="45" r="2" fill="var(--accent-3)"/>
                          </svg>
                      </div>
                  </ScrollStackItem>
                  
                  <ScrollStackItem itemClassName="bento-card full-width light-card">
                      <div className="bento-content">
                          <h3>Deploy Smart Contracts in Chat</h3>
                          <p>Launch Soroban smart contracts directly from WhatsApp. Describe your idea, and your AI assistant will write, test, and deploy it on Stellar.</p>
                      </div>
                      <div className="bento-icon">
                          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 8px rgba(46, 125, 50, 0.1))' }}>
                              {/* Code compilation terminal box */}
                              <rect x="15" y="20" width="70" height="60" rx="10" fill="var(--accent-2)" stroke="var(--accent-3)" strokeWidth="2"/>
                              <path d="M15 32H85" stroke="var(--accent-3)" strokeWidth="1.5"/>
                              {/* Terminal dots */}
                              <circle cx="23" cy="26" r="2.5" fill="#ef4444"/>
                              <circle cx="30" cy="26" r="2.5" fill="#eab308"/>
                              <circle cx="37" cy="26" r="2.5" fill="#22c55e"/>
                              {/* Code brackets and prompt */}
                              <path d="M26 44L34 50L26 56" stroke="var(--accent-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <rect x="39" y="53" width="14" height="3" fill="var(--accent-1)" rx="1.5">
                                  <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/>
                              </rect>
                              {/* Floating Sparkles */}
                              <path d="M72 42L74 46L78 48L74 50L72 54L70 50L66 48L70 46L72 42Z" fill="var(--accent-1)" opacity="0.8"/>
                          </svg>
                      </div>
                  </ScrollStackItem>
              </ScrollStack>
          </div>
      </section>

      <section id="faq" className="section faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-container">
              <div className="faq-item">
                  <button className="faq-question" onClick={toggleFaq}>
                      Is my crypto safe on WhatsApp?
                      <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                      <p>Yes. Stellapp provides a secure, fully-managed custodial wallet. We handle all the complex key management on our enterprise-grade backend. WhatsApp acts as a fast, authenticated channel to communicate your intents to our AI, executing your transactions safely and instantly.</p>
                  </div>
              </div>
              <div className="faq-item">
                  <button className="faq-question" onClick={toggleFaq}>
                      What are the fees?
                      <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                      <p>Stellapp is built on the Stellar network, meaning transactions cost a fraction of a cent. We charge zero additional fees for standard transfers and swaps.</p>
                  </div>
              </div>
              <div className="faq-item">
                  <button className="faq-question" onClick={toggleFaq}>
                      Can I really deploy smart contracts from chat?
                      <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                      <p>Absolutely. Our AI agent translates your natural language requirements into Rust code, compiles it for Soroban, and guides you through the deployment process—all within your WhatsApp chat.</p>
                  </div>
              </div>
              <div className="faq-item">
                  <button className="faq-question" onClick={toggleFaq}>
                      Which assets are supported?
                      <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                      <p>We support all native Stellar assets including XLM, USDC, EURC, and AQUA.</p>
                  </div>
              </div>
          </div>
      </section>

      <footer className="glass">
          <p>&copy; 2026 Stellapp. Built on Stellar. Hosted on Railway.</p>
      </footer>
    </div>
  );
}
