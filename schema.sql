-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 08, 2025 at 09:09 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_bazma`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `nis` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `nis`, `password`) VALUES
(0, '1992', 'smktibazma');

-- --------------------------------------------------------

--
-- Table structure for table `db_siswa`
--

CREATE TABLE `db_siswa` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `angkatan` int(11) NOT NULL,
  `keahlian` text DEFAULT NULL,
  `link_porto` varchar(200) DEFAULT NULL,
  `cv` varchar(50) DEFAULT NULL,
  `foto` varchar(50) DEFAULT NULL,
  `alamat` varchar(50) DEFAULT NULL,
  `deskripsi` varchar(500) DEFAULT NULL,
  `posisi` varchar(50) DEFAULT NULL,
  `instansi` varchar(20) DEFAULT NULL,
  `skill` text DEFAULT NULL,
  `linkedin` text DEFAULT NULL,
  `password` varchar(50) DEFAULT 'smktibazma123'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `db_siswa`
--

INSERT INTO `db_siswa` (`id`, `name`, `angkatan`, `keahlian`, `link_porto`, `cv`, `foto`, `alamat`, `deskripsi`, `posisi`, `instansi`, `skill`, `linkedin`, `password`) VALUES
('2324019', 'Nur Yusuf', 3, 'FULL-STACK DEVELOPER', 'https://iaas-ashy.vercel.app/', NULL, '1751945296626-yusuf2.png', 'Cirebon', 'Saya adalah siswa SMK dengan semangat belajar tinggi dan ketertarikan dalam bidang teknologi. Terbiasa bekerja dalam tim, bertanggung jawab, dan memiliki motivasi untuk terus berkembang. Berpengalaman dalam beberapa proyek sekolah dan aktif mengikuti kegiatan organisasi.', 'UI UX desain', 'SMK TI Bazma', 'React, Express, Js, Html, Bootstrap, Css', 'www.linkedin.com/in/nur-yusuf-07ab15323', 'smktibazma123');

-- --------------------------------------------------------

--
-- Table structure for table `pengalaman`
--

CREATE TABLE `pengalaman` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `lokasi` varchar(30) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `foto` varchar(100) DEFAULT NULL,
  `db_siswa_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` char(36) NOT NULL,
  `name_project` varchar(255) NOT NULL,
  `db_siswa_id` char(36) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `link_web` varchar(50) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `tools` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `db_siswa`
--
ALTER TABLE `db_siswa`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengalaman`
--
ALTER TABLE `pengalaman`
  ADD PRIMARY KEY (`id`),
  ADD KEY `db_siswa_id` (`db_siswa_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pengalaman`
--
ALTER TABLE `pengalaman`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pengalaman`
--
ALTER TABLE `pengalaman`
  ADD CONSTRAINT `pengalaman_ibfk_1` FOREIGN KEY (`db_siswa_id`) REFERENCES `db_siswa` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
