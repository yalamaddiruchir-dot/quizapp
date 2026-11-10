-- Reference schema (Hibernate creates these automatically with ddl-auto=update)
CREATE DATABASE IF NOT EXISTS quizdb;
USE quizdb;

CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL
);

CREATE TABLE question (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(500) NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct INT NOT NULL,
  category VARCHAR(255)
);

CREATE TABLE quiz_result (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  score INT NOT NULL,
  total INT NOT NULL,
  taken_at DATETIME(6)
);
