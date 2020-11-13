-- MariaDB dump 10.17  Distrib 10.4.13-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: calendarsf
-- ------------------------------------------------------
-- Server version	10.4.13-MariaDB-1:10.4.13+maria~bionic

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cours`
--

DROP TABLE IF EXISTS `cours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ec_id` int(11) NOT NULL,
  `semaine` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `place` tinyint(1) NOT NULL,
  `pos_top` smallint(6) NOT NULL,
  `pos_left` smallint(6) NOT NULL,
  `groupe` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `enseignant` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarque` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_FDCA8C9C27634BEF` (`ec_id`),
  CONSTRAINT `FK_FDCA8C9C27634BEF` FOREIGN KEY (`ec_id`) REFERENCES `ec` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cours`
--

LOCK TABLES `cours` WRITE;
/*!40000 ALTER TABLE `cours` DISABLE KEYS */;
INSERT INTO `cours` VALUES (5,7,'s36',1,20,5,'groupe3','Courtellemont','SC8',NULL),(6,7,'s36',1,32,5,'groupe4','Courtellemont','SC8',NULL),(7,7,'s37',1,32,5,'groupe4',NULL,NULL,NULL),(8,7,'s37',1,23,1,'groupe4',NULL,NULL,NULL),(9,7,'s37',1,20,5,'groupe3',NULL,NULL,NULL),(10,7,'s37',1,7,1,'groupe3',NULL,NULL,NULL),(25,7,'s38',0,7,2,'groupe3',NULL,NULL,NULL),(26,7,'s38',0,7,2,'groupe4',NULL,NULL,NULL),(31,14,'s36',1,32,5,'groupe3','Sigoillot','133',NULL),(32,14,'s36',0,8,3,'groupe4',NULL,NULL,NULL),(33,14,'s36',1,20,5,'groupe4','Sigoillot','133',NULL),(34,14,'s36',0,0,0,'groupe4',NULL,NULL,NULL),(39,14,'s37',1,23,1,'groupe3',NULL,NULL,NULL),(40,14,'s37',1,32,5,'groupe3',NULL,NULL,NULL),(41,14,'s37',1,7,1,'groupe4',NULL,NULL,NULL),(42,14,'s37',1,20,5,'groupe4',NULL,NULL,NULL),(45,15,'s36',1,23,4,'groupe3','Bourmaud','136',NULL),(46,15,'s36',1,23,4,'groupe4','Guillaume','137',NULL),(51,15,'s37',1,23,3,'groupe3',NULL,NULL,NULL),(52,15,'s37',1,6,5,'groupe3',NULL,NULL,NULL),(53,15,'s37',1,6,5,'groupe4',NULL,NULL,NULL),(54,15,'s37',1,8,3,'groupe4',NULL,NULL,NULL),(61,15,'s38',0,0,0,'groupe3',NULL,NULL,NULL),(62,15,'s38',0,0,0,'groupe3',NULL,NULL,NULL),(63,15,'s38',0,0,0,'groupe4',NULL,NULL,NULL),(64,15,'s38',0,0,0,'groupe3',NULL,NULL,NULL),(65,15,'s38',0,0,0,'groupe4',NULL,NULL,NULL),(66,15,'s38',0,0,0,'groupe4',NULL,NULL,NULL),(73,16,'s36',1,8,4,'groupe1','Rodriguez','137',NULL),(74,16,'s36',1,23,5,'groupe1','Rodriguez','136',NULL),(75,16,'s36',1,23,4,'groupe1','Rodriguez','134',NULL),(76,16,'s36',1,23,4,'groupe2','Trugeon','135',NULL),(77,16,'s36',1,23,5,'groupe2','Bourmaud','137',NULL),(78,16,'s36',1,8,4,'groupe2','Trugeon','136',NULL),(81,16,'s37',1,23,1,'groupe2',NULL,NULL,NULL),(82,16,'s37',1,7,1,'groupe1',NULL,NULL,NULL),(91,17,'s37',1,23,1,'groupe1',NULL,NULL,NULL),(92,17,'s37',1,8,4,'groupe1',NULL,NULL,NULL),(93,17,'s37',1,23,5,'groupe1',NULL,NULL,NULL),(94,17,'s37',1,23,4,'groupe1',NULL,NULL,NULL),(95,17,'s37',1,7,1,'groupe2',NULL,NULL,NULL),(96,17,'s37',1,23,3,'groupe2',NULL,NULL,NULL),(97,17,'s37',1,8,3,'groupe2',NULL,NULL,NULL),(98,17,'s37',1,5,2,'groupe2',NULL,NULL,NULL),(101,18,'s37',1,23,3,'groupe1',NULL,NULL,NULL),(102,18,'s37',1,23,5,'groupe2',NULL,NULL,NULL),(113,18,'s38',0,0,0,'groupe1',NULL,NULL,NULL),(114,18,'s38',0,0,0,'groupe1',NULL,NULL,NULL),(115,18,'s38',0,0,0,'groupe1',NULL,NULL,NULL),(116,18,'s38',0,0,0,'groupe1',NULL,NULL,NULL),(117,18,'s38',0,0,0,'groupe1',NULL,NULL,NULL),(118,18,'s38',0,0,0,'groupe2',NULL,NULL,NULL),(119,18,'s38',0,0,0,'groupe2',NULL,NULL,NULL),(120,18,'s38',0,0,0,'groupe2',NULL,NULL,NULL),(121,18,'s38',0,0,0,'groupe2',NULL,NULL,NULL),(122,18,'s38',0,0,0,'groupe2',NULL,NULL,NULL),(125,19,'s38',0,0,0,'groupe1',NULL,NULL,NULL),(126,19,'s38',0,0,0,'groupe1',NULL,NULL,NULL),(129,21,'s36',1,8,3,'groupe1','Bourmaud','018',NULL),(130,21,'s36',0,14,2,'groupe1',NULL,NULL,NULL),(132,21,'s37',1,1,1,'groupe1',NULL,NULL,NULL),(134,21,'s38',0,0,0,'groupe1',NULL,NULL,NULL),(136,23,'s36',1,26,2,'groupe1',NULL,'Amphi 100',NULL),(138,25,'s36',1,23,3,'groupe1',NULL,'Parc des pères',NULL),(140,26,'s36',1,8,4,'groupe3',NULL,NULL,NULL),(142,26,'s37',1,8,4,'groupe3',NULL,NULL,NULL),(145,26,'s38',0,0,0,'groupe3',NULL,NULL,NULL),(146,26,'s38',0,0,0,'groupe3',NULL,NULL,NULL),(148,27,'s36',1,8,5,'groupe1',NULL,NULL,NULL),(150,27,'s37',1,8,5,'groupe1',NULL,NULL,NULL),(153,27,'s38',0,0,0,'groupe1',NULL,NULL,NULL),(154,27,'s38',0,0,0,'groupe1',NULL,NULL,NULL);
/*!40000 ALTER TABLE `cours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctrine_migration_versions`
--

LOCK TABLES `doctrine_migration_versions` WRITE;
/*!40000 ALTER TABLE `doctrine_migration_versions` DISABLE KEYS */;
INSERT INTO `doctrine_migration_versions` VALUES ('DoctrineMigrations\\Version20201109110806','2020-11-09 12:08:21',184),('DoctrineMigrations\\Version20201109142739','2020-11-09 15:27:46',42),('DoctrineMigrations\\Version20201111133724','2020-11-11 14:37:31',44),('DoctrineMigrations\\Version20201112081734','2020-11-12 09:17:42',40),('DoctrineMigrations\\Version20201112132321','2020-11-12 14:23:28',48);
/*!40000 ALTER TABLE `doctrine_migration_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ec`
--

DROP TABLE IF EXISTS `ec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ec` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(11) NOT NULL,
  `promo_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vol` double NOT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duree` double NOT NULL,
  `nb_groupes` int(11) NOT NULL,
  `semaines` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '(DC2Type:json)',
  PRIMARY KEY (`id`),
  KEY `IDX_8DE8BDFFC54C8C93` (`type_id`),
  KEY `IDX_8DE8BDFFD0C07AFF` (`promo_id`),
  CONSTRAINT `FK_8DE8BDFFC54C8C93` FOREIGN KEY (`type_id`) REFERENCES `type_cours` (`id`),
  CONSTRAINT `FK_8DE8BDFFD0C07AFF` FOREIGN KEY (`promo_id`) REFERENCES `promo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ec`
--

LOCK TABLES `ec` WRITE;
/*!40000 ALTER TABLE `ec` DISABLE KEYS */;
INSERT INTO `ec` VALUES (7,3,3,'RAN photoshop',12,'#E700FFFF',3,2,'{\"s36\":\"3\",\"s37\":\"6\",\"s38\":\"3\"}'),(14,3,3,'RAN Illustrator',12,'#BC00FFFF',3,2,'{\"s36\":\"6\",\"s37\":\"6\"}'),(15,3,3,'RAN JS',18,'#00FFC6FF',3,2,'{\"s36\":\"3\",\"s37\":\"6\",\"s38\":\"9\"}'),(16,3,2,'RAN HTML',12,'#FFEC00FF',3,2,'{\"s36\":\"9\",\"s37\":\"3\"}'),(17,3,2,'RAN BD',12,'#FF7200FF',3,2,'{\"s37\":\"12\"}'),(18,3,2,'RAN PHP',18,'#FFA400FF',3,2,'{\"s37\":\"3\",\"s38\":\"15\"}'),(19,1,1,'CMS',9,'#FF0000FF',1.5,1,'{\"s38\":\"3\"}'),(20,3,1,'CMS',39,'#00FF13FF',3,4,'[]'),(21,1,1,'HTML/CSS',12,'#B500FFFF',1.5,1,'{\"s36\":\"3\",\"s37\":\"1.5\",\"s38\":\"1.5\"}'),(22,3,1,'HTML/CSS',33,'#AE00FFFF',3,4,'[]'),(23,1,1,'Accueil',2,'#00FFD4FF',2,1,'{\"s36\":\"2\"}'),(25,6,1,'Icebreaking',6,'#00FFA9FF',6,1,'{\"s36\":\"6\"}'),(26,1,3,'UX/UI',12,'#FF0000FF',3,1,'{\"s36\":\"3\",\"s37\":\"3\",\"s38\":\"6\"}'),(27,1,2,'UX Design',12,'#FF0000FF',3,1,'{\"s36\":\"3\",\"s37\":\"3\",\"s38\":\"6\"}');
/*!40000 ALTER TABLE `ec` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `header`
--

DROP TABLE IF EXISTS `header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `header` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `texte` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `header`
--

LOCK TABLES `header` WRITE;
/*!40000 ALTER TABLE `header` DISABLE KEYS */;
INSERT INTO `header` VALUES (1,'Action','action'),(2,'Ec Libellé','name'),(3,'Type','type'),(4,'Total fait','total'),(5,'S36','s36'),(6,'S37','s37'),(7,'S38','s38'),(8,'S39','s39'),(9,'S40','s40'),(10,'S41','s41'),(11,'S42','s42'),(12,'S43','s43'),(13,'S44','s44'),(14,'S45','s45'),(15,'S46','s46'),(16,'S47','s47'),(17,'S48','s48'),(18,'S49','s49'),(19,'S50','s50'),(20,'S51','s51'),(21,'S52','s52'),(22,'S01','s01'),(23,'S02','s02'),(24,'S03','s03'),(25,'S04','s04'),(26,'S05','s05'),(27,'S06','s06'),(28,'S07','s07'),(29,'S08','s08'),(30,'S09','s09'),(31,'S10','s10'),(32,'S11','s11'),(33,'S12','s12'),(34,'S13','s13');
/*!40000 ALTER TABLE `header` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promo`
--

DROP TABLE IF EXISTS `promo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promo`
--

LOCK TABLES `promo` WRITE;
/*!40000 ALTER TABLE `promo` DISABLE KEYS */;
INSERT INTO `promo` VALUES (1,'Tous'),(2,'WDI'),(3,'DFS');
/*!40000 ALTER TABLE `promo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_cours`
--

DROP TABLE IF EXISTS `type_cours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `type_cours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_cours`
--

LOCK TABLES `type_cours` WRITE;
/*!40000 ALTER TABLE `type_cours` DISABLE KEYS */;
INSERT INTO `type_cours` VALUES (1,'CM'),(2,'TD'),(3,'TP'),(4,'Projets Tut'),(5,'Conf'),(6,'Autre');
/*!40000 ALTER TABLE `type_cours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '(DC2Type:json)',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_1D1C63B3F85E0677` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (1,'ntrugeon','[]','$argon2id$v=19$m=65536,t=4,p=1$2EdenGuGehgsyIQQc8U60w$+P5xKoEGwykk1oTzRYc8GH0dW2HYsilrdgNSO+QDMwI');
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-12 21:13:43
