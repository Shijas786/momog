-- D1 migration to create the customer reviews and rewards tables.
-- This table stores email, rating, feedback, coupon details, and claim timestamp.

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT,
  rating INTEGER NOT NULL,
  feedback TEXT,
  coupon_code TEXT NOT NULL UNIQUE,
  reward_type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  claimed_at TEXT
);
