CREATE DATABASE  IF NOT EXISTS `recording_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `recording_system`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: recording_system
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approval_requests`
--

DROP TABLE IF EXISTS `approval_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `program_name` varchar(255) NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `program_id` (`program_id`),
  CONSTRAINT `approval_requests_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_requests`
--

LOCK TABLES `approval_requests` WRITE;
/*!40000 ALTER TABLE `approval_requests` DISABLE KEYS */;
INSERT INTO `approval_requests` VALUES (77,116,'event 1','pending','2025-07-05 04:23:42','2025-07-05 04:23:42');
/*!40000 ALTER TABLE `approval_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `voucher_number` varchar(255) NOT NULL,
  `eft_number` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `payments_ibfk_1` (`program_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (12,116,'hjhvj','868',53,'2025-07-05 04:27:32');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_document_history`
--

DROP TABLE IF EXISTS `program_document_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program_document_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `document_type` varchar(255) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_blob` longblob,
  `uploaded_by` int NOT NULL,
  `uploaded_at` timestamp NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `program_id` (`program_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `program_document_history_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `program_document_history_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_document_history`
--

LOCK TABLES `program_document_history` WRITE;
/*!40000 ALTER TABLE `program_document_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `program_document_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `recipient_name` varchar(255) DEFAULT NULL,
  `status` enum('draft','under_review_finance','under_review_mmk','query','query_answered','Completed','approved','rejected','approved_by_mmk_office') DEFAULT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `central_service_letter_path` varchar(255) DEFAULT NULL,
  `central_service_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `pkns_approval_letter_path` varchar(255) DEFAULT NULL,
  `pkns_approval_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `program_letter_path` varchar(255) DEFAULT NULL,
  `program_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `exco_letter_path` varchar(255) DEFAULT NULL,
  `exco_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `bank_account_manager_path` varchar(255) DEFAULT NULL,
  `bank_account_manager_uploaded_at` timestamp NULL DEFAULT NULL,
  `cord_registration_form_path` varchar(255) DEFAULT NULL,
  `cord_registration_form_uploaded_at` timestamp NULL DEFAULT NULL,
  `exco_letter_reference_no` varchar(255) DEFAULT NULL,
  `updated_document_path` varchar(255) DEFAULT NULL,
  `updated_document_uploaded_at` timestamp NULL DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `central_service_letter_blob` longblob,
  `pkns_approval_letter_blob` longblob,
  `program_letter_blob` longblob,
  `exco_letter_blob` longblob,
  `bank_account_manager_blob` longblob,
  `cord_registration_form_blob` longblob,
  `updated_document_blob` longblob,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `programs_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `programs_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES (116,'event 1',123.00,'wert','approved',15,'2025-07-05 04:23:33','2025-07-05 04:27:32','abc.pdf','2025-07-05 04:23:33',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'mmk',NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs_temp`
--

DROP TABLE IF EXISTS `programs_temp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs_temp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `recipient_name` varchar(255) DEFAULT NULL,
  `status` enum('draft','under_review','completed','rejected','query','query_answered') DEFAULT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `central_service_letter_path` varchar(255) DEFAULT NULL,
  `central_service_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `pkns_approval_letter_path` varchar(255) DEFAULT NULL,
  `pkns_approval_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `program_letter_path` varchar(255) DEFAULT NULL,
  `program_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `exco_letter_path` varchar(255) DEFAULT NULL,
  `exco_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `bank_account_manager_path` varchar(255) DEFAULT NULL,
  `bank_account_manager_uploaded_at` timestamp NULL DEFAULT NULL,
  `cord_registration_form_path` varchar(255) DEFAULT NULL,
  `cord_registration_form_uploaded_at` timestamp NULL DEFAULT NULL,
  `exco_letter_reference_no` varchar(255) DEFAULT NULL,
  `updated_document_path` varchar(255) DEFAULT NULL,
  `updated_document_uploaded_at` timestamp NULL DEFAULT NULL,
  `updated_by` int DEFAULT NULL,
  `central_service_letter_blob` longblob,
  `pkns_approval_letter_blob` longblob,
  `program_letter_blob` longblob,
  `exco_letter_blob` longblob,
  `bank_account_manager_blob` longblob,
  `cord_registration_form_blob` longblob,
  `updated_document_blob` longblob,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs_temp`
--

LOCK TABLES `programs_temp` WRITE;
/*!40000 ALTER TABLE `programs_temp` DISABLE KEYS */;
/*!40000 ALTER TABLE `programs_temp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `queries`
--

DROP TABLE IF EXISTS `queries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `queries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `query_text` text NOT NULL,
  `status` enum('pending','answered','resolved') NOT NULL DEFAULT 'pending',
  `created_by` int NOT NULL,
  `answered_by` int DEFAULT NULL,
  `answer_text` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `answered_at` timestamp NULL DEFAULT NULL,
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `program_id` (`program_id`),
  KEY `created_by` (`created_by`),
  KEY `answered_by` (`answered_by`),
  CONSTRAINT `queries_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `queries_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `queries_ibfk_3` FOREIGN KEY (`answered_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `queries`
--

LOCK TABLES `queries` WRITE;
/*!40000 ALTER TABLE `queries` DISABLE KEYS */;
INSERT INTO `queries` VALUES (22,116,'feweg','answered',53,54,'kukuvkuv','2025-07-05 04:24:21','2025-07-05 04:24:58',NULL);
/*!40000 ALTER TABLE `queries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `remarks`
--

DROP TABLE IF EXISTS `remarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `remarks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `user_id` int NOT NULL,
  `remark` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `program_id` (`program_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `remarks_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `remarks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `remarks`
--

LOCK TABLES `remarks` WRITE;
/*!40000 ALTER TABLE `remarks` DISABLE KEYS */;
INSERT INTO `remarks` VALUES (35,116,53,'kuvkub','2025-07-05 04:28:59');
/*!40000 ALTER TABLE `remarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signed_documents`
--

DROP TABLE IF EXISTS `signed_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `signed_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `program_id` int NOT NULL,
  `signed_central_service_letter_path` varchar(255) DEFAULT NULL,
  `signed_central_service_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `signed_central_service_letter_blob` longblob,
  `signed_pkns_approval_letter_path` varchar(255) DEFAULT NULL,
  `signed_pkns_approval_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `signed_pkns_approval_letter_blob` longblob,
  `signed_program_letter_path` varchar(255) DEFAULT NULL,
  `signed_program_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `signed_program_letter_blob` longblob,
  `signed_exco_letter_path` varchar(255) DEFAULT NULL,
  `signed_exco_letter_uploaded_at` timestamp NULL DEFAULT NULL,
  `signed_exco_letter_blob` longblob,
  `signed_bank_account_manager_path` varchar(255) DEFAULT NULL,
  `signed_bank_account_manager_uploaded_at` timestamp NULL DEFAULT NULL,
  `signed_bank_account_manager_blob` longblob,
  `signed_cord_registration_form_path` varchar(255) DEFAULT NULL,
  `signed_cord_registration_form_uploaded_at` timestamp NULL DEFAULT NULL,
  `signed_cord_registration_form_blob` longblob,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `program_id` (`program_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `signed_documents_ibfk_1` FOREIGN KEY (`program_id`) REFERENCES `programs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `signed_documents_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signed_documents`
--

LOCK TABLES `signed_documents` WRITE;
/*!40000 ALTER TABLE `signed_documents` DISABLE KEYS */;
INSERT INTO `signed_documents` VALUES (26,116,'abc.pdf','2025-07-05 04:25:32','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,53,'2025-07-05 04:25:31','2025-07-05 04:25:31');
/*!40000 ALTER TABLE `signed_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user','staff_finance','staff_pa','staff_exco','staff_mmk') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (15,'Kaung','kaung@gmail.com','$2b$10$EbyswFLXJ4ytmRy2cw00eeHm9P9Ftt7sC/BKRs.8ca/SiZ1guj5tu','user','2025-06-14 08:43:23','2025-06-24 03:41:18'),(19,'admin','admin@gmail.com','$2b$10$UAavunRtEDOKOjM0BqVp5emB/luh0y5uC9E.sphgp1l7ke6GtmDR.','admin','2025-06-15 06:28:13','2025-06-16 04:30:22'),(47,'DATO USTAZAH HJH SITI ASHAH','dato@gmail.com','$2b$10$Iym7iTzkgGXQdKEHG265guvmMhVrDuLNBlj8Gb/dg4jjVHvNPIR12','user','2025-06-23 04:01:41','2025-06-25 01:43:16'),(53,'finance','finance@gmail.com','$2b$10$Q/meRQ56ZP5ihTpvSC392uLNVGnk0JSo9BlrNDbu2iXkpkmySm1z.','staff_finance','2025-06-25 04:15:57','2025-06-25 04:15:57'),(54,'pa','pa@gmail.com','$2b$10$SUfBFI35OdaM1snFvKJoPO53uSfla5wbuUfydeQp1Gps/KbgJlPeW','staff_pa','2025-06-25 06:31:51','2025-06-25 06:31:51'),(55,'mmk','mmk@gmail.com','$2b$10$s1wDwMCYXqGm6Hbs3dDhLuXgdzeOsbKubLzV7E.4RW5./EqG1sTXG','staff_mmk','2025-07-01 03:46:23','2025-07-01 03:46:23');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'recording_system'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-05 12:45:42
