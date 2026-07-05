import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { bindings } from "../bindings.server";

// Rewards available to win
const REWARDS = [
  "Free Momos 🥟",
  "10% OFF 🎁",
  "Free Soft Drink 🎉",
  "Free Fries 🍟"
];

// Helper to generate a unique random coupon code
function generateCouponCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No confusing 0/O/1/I
  const randSegment = () => {
    let res = "";
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };
  return `MOMO-${randSegment()}-${randSegment()}`;
}

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email().optional().or(z.literal("")).or(z.null()),
      rating: z.number().min(1).max(5),
      feedback: z.string().optional().or(z.null()),
    })
  )
  .handler(async ({ data }) => {
    const { DB } = bindings();
    
    // Select reward randomly
    const rewardType = REWARDS[Math.floor(Math.random() * REWARDS.length)];
    const couponCode = generateCouponCode();
    const emailVal = data.email || null;
    const feedbackVal = data.feedback || null;

    if (DB) {
      try {
        await DB.prepare(
          `INSERT INTO reviews (email, rating, feedback, coupon_code, reward_type) 
           VALUES (?, ?, ?, ?, ?)`
        )
          .bind(emailVal, data.rating, feedbackVal, couponCode, rewardType)
          .run();
      } catch (err) {
        console.error("Database error while saving review:", err);
        // Fall through to returning the reward even if DB write fails, so the user experience doesn't break
      }
    } else {
      console.warn("D1 Database is not bound (check app.manifest.json 'db': true)");
    }

    return {
      success: true,
      couponCode,
      rewardType,
    };
  });

export const claimCoupon = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      couponCode: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    const { DB } = bindings();
    
    if (DB) {
      try {
        await DB.prepare(
          "UPDATE reviews SET claimed_at = datetime('now') WHERE coupon_code = ?"
        )
          .bind(data.couponCode)
          .run();
      } catch (err) {
        console.error("Database error while claiming coupon:", err);
      }
    } else {
      console.warn("D1 Database is not bound (check app.manifest.json 'db': true)");
    }

    return {
      success: true,
    };
  });
