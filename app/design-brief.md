# Design Brief – Momo Customer Review & Rewards (Retro Edition)

## Design Read
A premium, retro-inspired Japanese street-food style customer review and rewards web app for a high-end dumpling and momo restaurant. It evokes a playful, authentic, and handcrafted visual character using hand-drawn watercolor art, vintage cream paper textures, and tactile feedback.

## Concept Spine
"The Street Dumpling Cart" – The design mimics a vintage wooden street food stall where everything is handcrafted, authentic, and steamed fresh. From the ink-and-watercolor main steam pot (welcome) to the review slate, the paper card, and the scratch ticket wrap, the user is immersed in a warm, physical dining experience.

## Delivery Tier
`cinema` – We will use:
- A textured vintage paper background (`/assets/paper_texture.png`).
- Hand-drawn ink + watercolor spot illustrations (`/assets/noodle_spot.png`, `/assets/dumpling_spot.png`) positioned floating dynamically using CSS multiply blending for clean transparency.
- A **Web Audio API** procedural sound synthesizer:
  - Dynamic scraping friction noise synced with pointer coordinates during scratching.
  - A delightful pentatonic major scale arpeggio chime when the coupon is revealed.
- Soft animated steam keyframes rising from the steamer graphics.

## Locked Palette
- **Primary Background:** Warm Vintage Cream (`#FFF7ED` or custom paper texture pattern)
- **Primary Red:** Vibrant Tomato Red (`#E5422B`)
- **Accent Orange:** Warm Apricot (`#F09456`)
- **Accent Beige:** Soft Sand (`#F5EAD4`)
- **Dark Text:** Charcoal-Brown (`#362521`)
- **Paper Border:** Soft Brown Line (`rgba(54, 37, 33, 0.12)`)

## Locked Type
- **Headings & Bold Text:** `Outfit` (for playful premium structure)
- **Body Text:** `Inter` (for readability)
- **Monospace details:** `JetBrains Mono` (for coupons)

## Tier-1 Technique
**C3 / B2: Interactive Scratch Canvas with Pointer Friction Audio & Reveal Chimes**
The scratch card uses an HTML5 canvas overlay loaded with a silver scratch texture. When the pointer scratches, a high-pass filtered white noise generator synthesizes scratching friction audio in real time. Upon reaching >60% clearance, a major pentatonic synth chime triggers, and the canvas fades out to reveal the reward.

## Section Plan (UI States)
1. **Screen 1: Welcome (`state-welcome`)** – Retro ink-and-watercolor steamer illustration, tomato red CTAs, floating noodles and dumplings decoration.
2. **Screen 2: Review Form (`state-review`)** – Warm card overlay, interactive star selectors, optional email address input.
3. **Screen 3: Reward Unlock (`state-unlock`)** – Celebration with custom colored confetti and golden gift box.
4. **Screen 4: Scratch Card (`state-scratch`)** – Silver ticket, real-time scratching noise synthesizer.
5. **Screen 5: Reward Revealed (`state-revealed`)** – Celebration arpeggio, coupon code copy, QR, and Cashier redeem dialog.
