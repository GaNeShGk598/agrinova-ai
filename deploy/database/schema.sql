-- =============================================
-- AgriNova AI — MySQL Database Schema
-- =============================================
-- Run: mysql -u root -p < schema.sql
-- Or import via Railway / PlanetScale dashboard

CREATE DATABASE IF NOT EXISTS agrinova CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agrinova;

-- -----------------------------------------------
-- Users
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          VARCHAR(36)  NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,  -- bcrypt hash
  region      VARCHAR(100),
  language    VARCHAR(10)  NOT NULL DEFAULT 'en',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Prediction History — Crop
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS crop_predictions (
  id          VARCHAR(36)  NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id     VARCHAR(36)  NOT NULL,
  soil_ph     DECIMAL(4,2),
  soil_n      DECIMAL(8,2),
  soil_p      DECIMAL(8,2),
  soil_k      DECIMAL(8,2),
  organic_matter DECIMAL(5,2),
  moisture    DECIMAL(5,2),
  season      VARCHAR(30),
  region      VARCHAR(100),
  best_pick   VARCHAR(100),
  result_json JSON,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_crop_user (user_id),
  INDEX idx_crop_created (created_at)
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Prediction History — Disease
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS disease_detections (
  id          VARCHAR(36)  NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id     VARCHAR(36)  NOT NULL,
  filename    VARCHAR(255),
  disease     VARCHAR(150),
  severity    VARCHAR(20),
  confidence  DECIMAL(5,2),
  result_json JSON,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_disease_user (user_id)
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Prediction History — Yield
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS yield_estimates (
  id              VARCHAR(36)  NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id         VARCHAR(36)  NOT NULL,
  crop            VARCHAR(100),
  area_acres      DECIMAL(10,2),
  rainfall_mm     DECIMAL(8,2),
  temperature_c   DECIMAL(5,2),
  yield_q_per_ha  DECIMAL(10,2),
  range_low       DECIMAL(10,2),
  range_high      DECIMAL(10,2),
  category        VARCHAR(20),
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_yield_user (user_id)
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Smart Alerts
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS alerts (
  id          VARCHAR(36)  NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id     VARCHAR(36)  NOT NULL,
  farm_id     VARCHAR(36),
  type        ENUM('irrigation','disease','weather','market') NOT NULL,
  severity    ENUM('low','medium','high') NOT NULL DEFAULT 'low',
  title       VARCHAR(255) NOT NULL,
  message     TEXT         NOT NULL,
  is_read     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_alerts_user (user_id),
  INDEX idx_alerts_created (created_at)
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Market Price Cache
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS market_prices (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT PRIMARY KEY,
  crop        VARCHAR(100)  NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  unit        VARCHAR(30)   NOT NULL DEFAULT 'quintal',
  week_label  VARCHAR(30)   NOT NULL,
  recorded_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_market_crop (crop),
  INDEX idx_market_recorded (recorded_at)
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Farm Profiles (optional extension)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS farms (
  id          VARCHAR(36)  NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id     VARCHAR(36)  NOT NULL,
  name        VARCHAR(150) NOT NULL,
  area_acres  DECIMAL(10,2),
  location    VARCHAR(255),
  soil_type   VARCHAR(100),
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_farms_user (user_id)
) ENGINE=InnoDB;
