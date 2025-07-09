CREATE DATABASE IF NOT EXISTS db_bazma;
USE db_bazma;

CREATE TABLE IF NOT EXISTS admin (
  id INT(11) NOT NULL,
  nis VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS db_siswa (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  angkatan INT(11) NOT NULL,
  keahlian TEXT,
  link_porto VARCHAR(200),
  cv VARCHAR(50),
  foto VARCHAR(50),
  alamat VARCHAR(50),
  deskripsi VARCHAR(500),
  posisi VARCHAR(50),
  instansi VARCHAR(20),
  skill TEXT,
  linkedin TEXT,
  password VARCHAR(50) DEFAULT 'smktibazma123',
  email VARCHAR(50),
  telepon VARCHAR(20),
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS pengalaman (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(50),
  lokasi VARCHAR(30),
  deskripsi TEXT,
  foto VARCHAR(100),
  db_siswa_id CHAR(36),
  PRIMARY KEY (id),
  KEY db_siswa_id (db_siswa_id),
  CONSTRAINT pengalaman_ibfk_1 FOREIGN KEY (db_siswa_id) REFERENCES db_siswa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name_project VARCHAR(255) NOT NULL,
  db_siswa_id CHAR(36),
  foto VARCHAR(255),
  link_web VARCHAR(50),
  deskripsi TEXT,
  tools TEXT,
  FOREIGN KEY (db_siswa_id) REFERENCES db_siswa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- OPTIONAL: Seed data admin awal
INSERT IGNORE INTO admin (id, nis, password) VALUES (0, '1992', 'smktibazma');
