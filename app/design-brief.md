# Design Brief – Momo Customer Review & Rewards

## Design Read
A premium, delightful, and highly engaging mobile-first feedback experience for a high-end momo restaurant. It uses warm, cozy colors and playful illustrations to make the review process feel like a game and rewards customers for their time.

## Concept Spine
"The Magic Steamer Basket" – The experience is structured like opening a traditional bamboo steamer: starting with the rising steam (welcome), opening the lid to add ingredients (review), finding a glowing surprise (unlock), scraping away the leaf wrap (scratch), and enjoying the steaming momo reward (revealed).

## Delivery Tier
`cinema` – We will use smooth CSS transitions, custom GSAP scroll/pointer animations, an interactive HTML5 `<canvas>` scratch card with realistic brush strokes, and physics-based confetti particles for reward celebration.

## Locked Palette
- **Primary Background:** Warm Light Cream (`#FFFDFB`)
- **Accent Backgrounds:** Warm Peach (`#FFF4E6`), Soft Rose-Orange (`#FFEBE3`)
- **Brand Red:** Spicy Vermilion (`#E53E3E`)
- **Brand Orange:** Sweet Apricot (`#ED8936`)
- **Brand Gold:** Honey Yellow (`#ECC94B`)
- **Text Color:** Rich Espresso (`#2C1E1A`)
- **Gradients:** Soft warmth radial gradients mimicking rising steam (`linear-gradient(135deg, #FF7E5F, #FEB47B)`).

## Locked Type
- **Headings & Display:** `Outfit` (warm, geometric, friendly sans-serif)
- **Body & Captions:** `Inter` (readable, neutral sans-serif)
- **Codes & Tech:** `JetBrains Mono` (for the coupon codes)

## Tier-1 Technique
**C3 / B2: Canvas Scratch Card & Dynamic Particle Burst**
An interactive `<canvas>` overlay that behaves like a physical metallic silver scratch card. The user swipes their finger/mouse to erase the silver metallic texture, revealing the reward below in real time. Once 70% of the surface is scratched, it triggers a confetti burst and opens the final screen.

## Section Plan (UI States)
1. **Screen 1: Welcome (`state-welcome`)** – Full-screen hero, steaming momo vector, large rating CTA.
2. **Screen 2: Review Form (`state-review`)** – Glassmorphism card containing 5-star selector, optional Email Address input, and submit button.
3. **Screen 3: Reward Unlock (`state-unlock`)** – Animated celebration with a pulsing golden gift box.
4. **Screen 4: Scratch Card (`state-scratch`)** – Interactive scratch canvas overlay.
5. **Screen 5: Reward Revealed (`state-revealed`)** – Burst card displaying prize, unique code, QR code, and expiry timer.

## Asset Plan
- **Primary Steaming Momo Illustration:** `momo_steamer.png` (cute, stylized steaming momos in a bamboo basket, warm palette).
- **Glowing Gift Box:** `glowing_gift_box.png` (gold and vermilion glowing present box).
- **Silver Metallic Texture:** `silver_texture.png` (silver glitter pattern, generated for canvas scratch card overlay).
- **Favicon & Monogram:** `momo_logo.png` (minimal cute momo icon).
- **OG Card:** `social_og.png` (1200x630 branded social card).

## CTA Inventory
- `Start Review` – Pulsing primary pill with warm gradient and active tap scale.
- `Submit & Unlock Reward` – Soft red container button with micro-bounce.
- `Scratch Now` – Glowing gold button with a shimmer gradient overlay.
- `Show to Cashier` – Interactive action that displays the verification modal.
