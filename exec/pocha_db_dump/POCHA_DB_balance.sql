CREATE DATABASE  IF NOT EXISTS `POCHA_DB` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `POCHA_DB`;
-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: pocha.c2dmjuulvzgw.ap-northeast-2.rds.amazonaws.com    Database: POCHA_DB
-- ------------------------------------------------------
-- Server version	8.0.31

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `balance`
--

DROP TABLE IF EXISTS `balance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `balance` (
  `balance_id` bigint NOT NULL AUTO_INCREMENT,
  `question1` varchar(100) NOT NULL,
  `question2` varchar(100) NOT NULL,
  `type` int DEFAULT NULL,
  PRIMARY KEY (`balance_id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `balance`
--

LOCK TABLES `balance` WRITE;
/*!40000 ALTER TABLE `balance` DISABLE KEYS */;
INSERT INTO `balance` VALUES (1,'순간이동','투명인간',0),(2,'전애인 썰 계속 물어보는 애인 ','전애인 썰만 이야기하는 애인',1),(3,'평생 버스 한 번씩 놓치기','평생 택시 돌아가기',0),(4,'첫데이트 장소로 국밥','첫데이트 장소로 김밥천국',1),(5,'지금과 같은 삶으로 수명 다할 때까지 살기','모든 사람이 내가 원하는대로 움직이지만 일주일 후 필연적 사망',0),(6,'로또 당첨되면 애인에게 바로 말한다','숨긴다',0),(7,'항상 나보다 일찍 자서 코 시끄럽게 고는 룸메','일주일에 한 번만 씻는 룸메',0),(8,'바다 놀러갔는데 건물 안에만 있으려는 친구','바다 놀러 갔는데 해산물 먹기 싫다는 친구(나도 못 먹게 함)',0),(9,'요구르트에 김치 말아먹기','라면에 초콜릿 넣기',0),(10,'평생 탄산 안 마시기','평생 라면 못 먹기',0),(11,'소개팅에서 전애인과의전 애인과의 추억을 자꾸 이야기하는 사람','소개팅에서 전 애인과의 추억을 자꾸 묻는 사람',0),(12,'독심술 초능력이 생겼는데 내 의지와 상관없이 모든 사람 생각 읽기','거짓말하면 죽는 병 걸리기',0),(13,'약속해서 만났는데 핸드폰만 보는 사람','약속은 항상 먼저 잡으면서 돈은 절대 안 내는 사람',0),(14,'결혼했는데 전 남자 친구or 전 여자 친구 옆집 (이사 못함) ','결혼했는데 배우자의 전남친 or 전여친 옆집',0),(15,'15년 연애했던 전 애인(헤어진 이후로 연락은 안 함)','한 달 사귀었는데 친구처럼 지내는 애인',1),(16,'이상형 만나는 대신 평생 친구 잃기(연예인, 짝사랑 상대 누구든 ok)','평범한 사람 만나기',1),(17,'빚이 30억 있는 이상형 만나기','부자지만 내가 싫어하는 사람과 연애',0),(18,'평생 치통','평생 두통',0),(19,'월 200만 원 백수 되기(일 하면 절대 안 됨)','월 600만 원 직장인(정년까지 일 못 그만둠)',0),(20,'전 남자 친구의 절친과 사귀기','절친의 전 남자 친구와 사귀기',1),(21,'내가 좋아하는 사람이 날 싫어하게 되기','나를 싫어하던 사람이 목숨 걸 만큼 날 좋아하게 되기',1),(22,'반반의 확률로 10억 받기','5000만 원 받기',0),(23,'똥 안 먹었는데 먹었다고 소문나기(전 세계 사람들이 다 알고 있음)','진짜로 먹었는데 아무도 모르기',0),(24,'바람피우는데 부자인 사람과 결혼하기','나를 아껴주고 사랑해주는 사람과 결혼하기',0),(25,'바람피우는데 부자인 사람과 결혼하기','나를 아껴주고 사랑해주는 사람과 결혼하기',1),(26,'평소에 양치 절대 안 하는 애인','평소에 머리 절대 안 감는 애인',1),(27,'잠수 이별(평생 이유 모름)','환승 이별',1),(28,'새 신발인데 물웅덩이에 빠지고 1시간 이상 돌아다니기','양말 젖어서 1시간 이상 돌아다니는데 발 냄새 심하게 나기',0),(29,'1년 동안 폰 없이 살기','1년동안 친구 없기',0),(30,'여름에 히터 틀고 자기','겨울에 에어컨 켜고 자기',0),(31,'항상 불 환하게 키고 자는 룸메(불 끄면 일어나서 다시 끔)','밤마다 몰래 타자기 두드리는 룸메(시끄럽지는 않은데 거슬림)',0),(32,'과거로 돌아갈 수 있다면, 내가 가장 행복했던 시절로 돌아가기','내가 가장 불행했던 시절로 돌아가기',0),(33,'평생 노래 못 듣기 ','한국 제외한 모든 나라 여행 못 가기',0),(34,'10년 전 과거로 가기','10년 후 미래로 가기',0),(35,'자는데 모기소리 들리기(물리지는 않음)','소리는 없는데 모기에 물리기',0),(36,'반말','존댓말',1),(37,'얼굴','몸매',1),(38,'만날 때마다 밸런스 게임 지옥','만날 때마다 만약에 게임 지옥',1),(39,'애인이 친구 짝사랑','친구가 애인 짝사랑',1),(40,'맞춤법 지적하는 애인','맞춤법 틀리는 애인',1),(41,'싸운 후 다 이야기하고 다니는 애인','싸운 후 전혀 타격감없어 보이는 애인',1),(42,'매일 만나기','한달에 한 번 만나기',1),(43,'내가 찼는데 차였다고 소문나기','내가 찼다고 소문났지만 실제로는 내가 차이기',1),(44,'짜장면','짬뽕',0),(45,'팔만대장경 끝까지 읽기','대장내시경 팔만 번 하기',0),(46,'마동석한테 맞고 이국종 교수한테 수술받기','이국종 교수한테 맞고 마동석한테 수술받기',0),(47,'토 맛 토마토','토마토맛 토',0),(48,'남들 눈에 나체로 보이기','진짜 나체인인데 남들은 옷 입었다고 생각하기',0),(49,'연어회 케찹 찍먹','감자튀김 초장 찍먹',0),(50,'사생활 노출당하기 ','노출로 생활하기',0),(51,'방귀 꼈는데 트름소리','트름했는데 방귀소리',0),(52,'지하철에서 재채기소리 ‘흥냐핫’되기','일주일간 검색기록, 카톡내역 인스타그램 스토리 게시',0),(53,'나만 바라보는데 100억 빚 있는 애인','딴 사람도 보는데 100억 있는 애인',1),(54,'탈모 원빈님 ','머리 풍성한 김광규님',0),(55,'10억 받고 폰 평생 안 쓰기 ','10만원 받고 폰 평생 쓰기',0),(56,'스윙칩 삼시세끼 8달 먹기 ','스윙스한테 80만원 주기',0),(57,' 하루 5시간 치통','두통',0),(58,'존잘 노잼','존못 꿀잼',1),(59,'개명을 한다면 점순이','점돌이',0),(60,'하루에 세번 문틈에 발 찧기','레고 밟기',0),(61,'여름마다 나이아가라 폭포수 맞으면서 정신수양','히말라야에서 스키타면서 선수준비',0),(62,'좋아하는 사람한테 고백하려는데 방귀끼기','고백했는데 상대가 방귀끼기',1),(63,'떨어진 음식 먹다 짝남한테 걸리기','짝남이랑 데이트하는데 떨어진 음식 먹는거 목격하기',1),(64,'5만구독자 악플없는 유튜버','500만구독자 악플많은 유튜버',0),(65,' 닭이먼저','계란이먼저',0),(66,'절친 동생과 결혼','절친과 내 동생 결혼',1),(67,'강남역 앞에서 노홍철 저질댄스','야구장 키스타임에 저질댄스',0),(68,'목욕탕에 불나면 얼굴만 가리고 탈출하기','중요 부위만 가리고 탈출하기',0),(69,' 똥 쌀 때 휴지 하나 다 쓰는 애인','아깝다고 휴지 한 칸 쓰고 뿌듯해하는 애인',1),(70,'결혼 상대로 플레이보이','엄마말이 우선인 마마보이',1),(71,'부모님 앞에서 애인과 키스하기','애인 앞에서 부모님한테 뽀뽀하기',1),(72,' 베프한테 들이대는 애인','애인한테 들이대는 베프',1),(73,'데이트 장소로 영화관','데이트 장소로 전시회',1),(74,'한달 동안 뽀뽀금지','한달동안 손잡기 금지',1),(75,'내 절친이랑 바람난 애인','내 원수랑 바람난 애인',1),(76,'바람피운걸 자백하고 봐달라는 애인','바람피고 비밀로 하는 애인',1),(77,'밤에 이성친구랑 단둘이 커피','낮에 이성친구랑 단둘이 술',1),(78,'위치추적 어플 깔아야하는 애인','일주일 이상 연락두절 신경안쓰는 애인',1);
/*!40000 ALTER TABLE `balance` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-17 11:20:24
