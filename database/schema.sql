-- Create Database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    technologies LONGTEXT,
    link VARCHAR(500),
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    FULLTEXT INDEX ft_title_description (title, description)
);

-- Insert default users
INSERT INTO users (username, password, email, role, active) VALUES
('admin', '$2a$10$slYQmyNdGzin7olVN3p1Be7DlH.PKZbv5H8KnzzVgXXbVxzy2QDZG', 'admin@portfolio.com', 'ADMIN', TRUE),
('user', '$2a$10$qTZf4rHJVeXVKVEKqJqHXO8XvLz5pKjzB5CnPZn8qN5qVxwZ2OHZG', 'user@portfolio.com', 'USER', TRUE);
