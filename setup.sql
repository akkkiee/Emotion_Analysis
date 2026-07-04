-- Create Database
CREATE DATABASE IF NOT EXISTS emotiondb;
USE emotiondb;

-- Create emotions table
CREATE TABLE IF NOT EXISTS emotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_text VARCHAR(500) NOT NULL,
    emotion VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial data for testing and analytics dashboard
INSERT INTO emotions (user_text, emotion, created_at) VALUES
('I had an absolutely wonderful day today, everything went perfect!', 'Happy', NOW() - INTERVAL 12 HOUR),
('This project is awesome and I love coding in Python!', 'Happy', NOW() - INTERVAL 10 HOUR),
('I feel so lonely and disappointed with the results.', 'Sad', NOW() - INTERVAL 8 HOUR),
('It makes me want to cry when things go wrong.', 'Sad', NOW() - INTERVAL 7 HOUR),
('I am so angry at this service! I hate waiting in lines!', 'Angry', NOW() - INTERVAL 5 HOUR),
('I am worried and scared about my exam tomorrow.', 'Fear', NOW() - INTERVAL 3 HOUR),
('Please do not panic, but I am nervous about the presentation.', 'Fear', NOW() - INTERVAL 2 HOUR),
('The weather is plain today. Just another ordinary afternoon.', 'Neutral', NOW() - INTERVAL 1 HOUR),
('I will walk to the market and buy some bread.', 'Neutral', NOW());
