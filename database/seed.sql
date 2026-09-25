-- ============================================================
-- BRAIN ARENA — Database Seed
-- Imports all existing questions from the original questions.js
-- ============================================================

-- Categories
INSERT INTO categories (slug, name, description, icon, color) VALUES
  ('general', 'General Knowledge', 'Test your knowledge on a variety of everyday topics.', 'Lightbulb', '#6C63FF'),
  ('science', 'Science', 'Explore the wonders of physics, chemistry, and biology.', 'FlaskConical', '#FF6B6B'),
  ('technology', 'Technology', 'How well do you know the digital world?', 'Cpu', '#2ED573'),
  ('mathematics', 'Mathematics', 'Put your number skills to the ultimate test.', 'Calculator', '#FFA502'),
  ('sports', 'Sports', 'From football to athletics — prove your sports IQ.', 'Trophy', '#1E90FF'),
  ('movies', 'Movies', 'Lights, camera, quiz! Test your cinema knowledge.', 'Clapperboard', '#E84393'),
  ('music', 'Music', 'From classical to pop — how much do you know?', 'Music', '#00CEC9'),
  ('history', 'History', 'Journey through time and test your history knowledge.', 'Landmark', '#FDCB6E'),
  ('geography', 'Geography', 'Explore the world from the comfort of your screen.', 'Globe', '#A29BFE')
ON CONFLICT (slug) DO NOTHING;

-- General Knowledge Questions
INSERT INTO questions (category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
  ((SELECT id FROM categories WHERE slug='general'), 'What is the capital of France?', 'Berlin', 'Madrid', 'Paris', 'Lisbon', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='general'), 'How many continents are there on Earth?', '5', '6', '7', '8', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='general'), 'What color are bananas when they are ripe?', 'Green', 'Yellow', 'Red', 'Blue', 'B', 'easy'),
  ((SELECT id FROM categories WHERE slug='general'), 'Which animal is known as the King of the Jungle?', 'Tiger', 'Elephant', 'Lion', 'Bear', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='general'), 'What is the largest ocean on Earth?', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean', 'D', 'medium'),
  ((SELECT id FROM categories WHERE slug='general'), 'Which country is home to the kangaroo?', 'New Zealand', 'South Africa', 'Australia', 'Brazil', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='general'), 'What does UNESCO stand for?', 'United Nations Educational, Scientific and Cultural Organization', 'United Nations Economic and Social Council Organization', 'Universal Education Science Culture Organization', 'United Nations Environment Safety and Culture Organization', 'A', 'medium'),
  ((SELECT id FROM categories WHERE slug='general'), 'In which year was the United Nations founded?', '1940', '1945', '1950', '1955', 'B', 'hard'),
  ((SELECT id FROM categories WHERE slug='general'), 'What is the hardest natural substance on Earth?', 'Gold', 'Iron', 'Diamond', 'Platinum', 'C', 'hard'),
  ((SELECT id FROM categories WHERE slug='general'), 'Which country has the most official languages?', 'India', 'South Africa', 'Bolivia', 'Zimbabwe', 'C', 'hard');

-- Science Questions
INSERT INTO questions (category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
  ((SELECT id FROM categories WHERE slug='science'), 'What planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'B', 'easy'),
  ((SELECT id FROM categories WHERE slug='science'), 'What gas do plants absorb from the atmosphere?', 'Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='science'), 'How many bones are in the adult human body?', '186', '206', '226', '256', 'B', 'easy'),
  ((SELECT id FROM categories WHERE slug='science'), 'What is the chemical symbol for water?', 'HO', 'H2O', 'O2H', 'H2O2', 'B', 'easy'),
  ((SELECT id FROM categories WHERE slug='science'), 'What is the powerhouse of the cell?', 'Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Apparatus', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='science'), 'What is the speed of light in a vacuum (approx.)?', '300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s', 'A', 'medium'),
  ((SELECT id FROM categories WHERE slug='science'), 'Which element has the atomic number 1?', 'Helium', 'Lithium', 'Hydrogen', 'Carbon', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='science'), 'What is the Heisenberg Uncertainty Principle about?', 'The speed of chemical reactions', 'The position and momentum of particles', 'The half-life of radioactive elements', 'The energy of photons', 'B', 'hard'),
  ((SELECT id FROM categories WHERE slug='science'), 'What is the most abundant element in the universe?', 'Oxygen', 'Carbon', 'Helium', 'Hydrogen', 'D', 'hard'),
  ((SELECT id FROM categories WHERE slug='science'), 'What phenomenon causes the Aurora Borealis?', 'Reflection of sunlight off ice crystals', 'Charged particles from the Sun interacting with Earth''s magnetosphere', 'Volcanic gases in the upper atmosphere', 'Refraction of moonlight through clouds', 'B', 'hard');

-- Technology Questions
INSERT INTO questions (category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
  ((SELECT id FROM categories WHERE slug='technology'), 'What does ''CPU'' stand for?', 'Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit', 'A', 'easy'),
  ((SELECT id FROM categories WHERE slug='technology'), 'Who co-founded Apple Inc.?', 'Bill Gates', 'Elon Musk', 'Steve Jobs', 'Jeff Bezos', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='technology'), 'What does ''HTML'' stand for?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language', 'A', 'easy'),
  ((SELECT id FROM categories WHERE slug='technology'), 'Which company developed the Android operating system?', 'Apple', 'Microsoft', 'Google', 'Samsung', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='technology'), 'What year was the first iPhone released?', '2005', '2006', '2007', '2008', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='technology'), 'What does ''RAM'' stand for?', 'Random Access Memory', 'Read Access Memory', 'Run Application Memory', 'Rapid Access Module', 'A', 'medium'),
  ((SELECT id FROM categories WHERE slug='technology'), 'Which programming language is known as the ''language of the web''?', 'Python', 'Java', 'JavaScript', 'C++', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='technology'), 'What does the acronym ''API'' stand for?', 'Application Programming Interface', 'Applied Program Integration', 'Automated Process Instruction', 'Application Process Integration', 'A', 'hard'),
  ((SELECT id FROM categories WHERE slug='technology'), 'In what year was the World Wide Web invented?', '1985', '1989', '1993', '1991', 'B', 'hard'),
  ((SELECT id FROM categories WHERE slug='technology'), 'What is the time complexity of binary search?', 'O(n)', 'O(n²)', 'O(log n)', 'O(1)', 'C', 'hard');

-- Mathematics Questions
INSERT INTO questions (category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
  ((SELECT id FROM categories WHERE slug='mathematics'), 'What is 12 × 12?', '124', '144', '132', '156', 'B', 'easy'),
  ((SELECT id FROM categories WHERE slug='mathematics'), 'What is the square root of 64?', '6', '7', '8', '9', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='mathematics'), 'How many sides does a hexagon have?', '5', '6', '7', '8', 'B', 'easy'),
  ((SELECT id FROM categories WHERE slug='mathematics'), 'What is 15% of 200?', '20', '25', '30', '35', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='mathematics'), 'What is the value of Pi (π) to two decimal places?', '3.12', '3.14', '3.16', '3.18', 'B', 'medium'),
  ((SELECT id FROM categories WHERE slug='mathematics'), 'What is the next prime number after 7?', '9', '10', '11', '13', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='mathematics'), 'If a triangle has angles of 90° and 45°, what is the third angle?', '35°', '40°', '45°', '55°', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='mathematics'), 'What is the derivative of x³?', 'x²', '2x²', '3x²', '3x', 'C', 'hard'),
  ((SELECT id FROM categories WHERE slug='mathematics'), 'What is the factorial of 6 (6!)?', '120', '620', '720', '840', 'C', 'hard'),
  ((SELECT id FROM categories WHERE slug='mathematics'), 'What is the sum of the interior angles of a pentagon?', '360°', '480°', '540°', '720°', 'C', 'hard');

-- Sports Questions
INSERT INTO questions (category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
  ((SELECT id FROM categories WHERE slug='sports'), 'How many players are on a standard football (soccer) team?', '9', '10', '11', '12', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='sports'), 'In which sport do you use a racket to hit a shuttlecock?', 'Tennis', 'Badminton', 'Squash', 'Table Tennis', 'B', 'easy'),
  ((SELECT id FROM categories WHERE slug='sports'), 'How many rings are on the Olympic flag?', '3', '4', '5', '6', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='sports'), 'What sport is played at Wimbledon?', 'Cricket', 'Golf', 'Tennis', 'Polo', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='sports'), 'Which country won the 2022 FIFA World Cup?', 'France', 'Brazil', 'Argentina', 'Germany', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='sports'), 'How many points is a touchdown worth in American football?', '3', '5', '6', '7', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='sports'), 'What is the maximum score in a single frame of bowling?', '10', '20', '30', '50', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='sports'), 'Who holds the record for the most Grand Slam tennis titles (men''s singles)?', 'Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Pete Sampras', 'C', 'hard'),
  ((SELECT id FROM categories WHERE slug='sports'), 'In which year were the first modern Olympic Games held?', '1892', '1896', '1900', '1904', 'B', 'hard'),
  ((SELECT id FROM categories WHERE slug='sports'), 'What is the diameter of a basketball hoop in inches?', '16', '17', '18', '19', 'C', 'hard');

-- Movies Questions
INSERT INTO questions (category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
  ((SELECT id FROM categories WHERE slug='movies'), 'What animated film features a character named Simba?', 'Finding Nemo', 'Shrek', 'The Lion King', 'Toy Story', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='movies'), 'Who directed the movie ''Titanic''?', 'Steven Spielberg', 'James Cameron', 'Martin Scorsese', 'Ridley Scott', 'B', 'easy'),
  ((SELECT id FROM categories WHERE slug='movies'), 'What is the name of the wizard school in Harry Potter?', 'Narnia Academy', 'Hogwarts', 'Westeros School', 'Middle Earth Academy', 'B', 'easy'),
  ((SELECT id FROM categories WHERE slug='movies'), 'Which superhero is also known as ''The Dark Knight''?', 'Superman', 'Spider-Man', 'Iron Man', 'Batman', 'D', 'easy'),
  ((SELECT id FROM categories WHERE slug='movies'), 'Which film won the Academy Award for Best Picture in 2020?', '1917', 'Joker', 'Parasite', 'Once Upon a Time in Hollywood', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='movies'), 'Who played the Joker in ''The Dark Knight'' (2008)?', 'Jack Nicholson', 'Jared Leto', 'Joaquin Phoenix', 'Heath Ledger', 'D', 'medium'),
  ((SELECT id FROM categories WHERE slug='movies'), 'What is the highest-grossing film of all time (unadjusted)?', 'Avengers: Endgame', 'Avatar', 'Titanic', 'Star Wars: The Force Awakens', 'B', 'medium'),
  ((SELECT id FROM categories WHERE slug='movies'), 'In ''Inception'', what is the name of the spinning top used as a totem?', 'The Dreamer', 'The Spinner', 'It has no specific name', 'The Architect', 'C', 'hard'),
  ((SELECT id FROM categories WHERE slug='movies'), 'Which 1994 film was based on a Stephen King novella called ''Rita Hayworth and Shawshank Redemption''?', 'The Green Mile', 'Stand By Me', 'The Shawshank Redemption', 'Misery', 'C', 'hard'),
  ((SELECT id FROM categories WHERE slug='movies'), 'Who composed the iconic score for the ''Star Wars'' franchise?', 'Hans Zimmer', 'Howard Shore', 'John Williams', 'Ennio Morricone', 'C', 'hard');

-- Music Questions
INSERT INTO questions (category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
  ((SELECT id FROM categories WHERE slug='music'), 'Which band performed ''Bohemian Rhapsody''?', 'The Beatles', 'Queen', 'Led Zeppelin', 'Pink Floyd', 'B', 'easy'),
  ((SELECT id FROM categories WHERE slug='music'), 'How many strings does a standard guitar have?', '4', '5', '6', '7', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='music'), 'Who is known as the ''King of Pop''?', 'Prince', 'Elvis Presley', 'Michael Jackson', 'Stevie Wonder', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='music'), 'What instrument does a drummer play?', 'Guitar', 'Piano', 'Drums', 'Violin', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='music'), 'Which artist released the album ''25'' in 2015?', 'Taylor Swift', 'Beyoncé', 'Adele', 'Rihanna', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='music'), 'What is the highest female singing voice type?', 'Alto', 'Mezzo-Soprano', 'Soprano', 'Contralto', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='music'), 'Which composer wrote ''The Four Seasons''?', 'Mozart', 'Beethoven', 'Bach', 'Vivaldi', 'D', 'medium'),
  ((SELECT id FROM categories WHERE slug='music'), 'In music theory, how many semitones are in an octave?', '8', '10', '12', '14', 'C', 'hard'),
  ((SELECT id FROM categories WHERE slug='music'), 'Which Beethoven symphony is known as ''Ode to Joy''?', '5th', '7th', '9th', '3rd', 'C', 'hard'),
  ((SELECT id FROM categories WHERE slug='music'), 'What is the BPM range typically associated with ''Allegro'' tempo?', '60-80', '80-100', '100-120', '120-156', 'D', 'hard');

-- History Questions
INSERT INTO questions (category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
  ((SELECT id FROM categories WHERE slug='history'), 'Who was the first President of the United States?', 'Thomas Jefferson', 'Abraham Lincoln', 'George Washington', 'John Adams', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='history'), 'In which country were the ancient pyramids built?', 'Greece', 'Mexico', 'Egypt', 'China', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='history'), 'What was the name of the ship that sank in 1912?', 'Lusitania', 'Britannic', 'Titanic', 'Olympic', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='history'), 'Which ancient civilization built the Colosseum?', 'Greek', 'Egyptian', 'Roman', 'Persian', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='history'), 'In which year did World War II end?', '1943', '1944', '1945', '1946', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='history'), 'Who discovered America in 1492?', 'Vasco da Gama', 'Ferdinand Magellan', 'Christopher Columbus', 'Amerigo Vespucci', 'C', 'medium'),
  ((SELECT id FROM categories WHERE slug='history'), 'What wall divided Berlin from 1961 to 1989?', 'The Iron Curtain', 'The Berlin Wall', 'The Great Wall', 'Hadrian''s Wall', 'B', 'medium'),
  ((SELECT id FROM categories WHERE slug='history'), 'Which empire was ruled by Genghis Khan?', 'Ottoman Empire', 'Roman Empire', 'Mongol Empire', 'Persian Empire', 'C', 'hard'),
  ((SELECT id FROM categories WHERE slug='history'), 'The Treaty of Versailles ended which war?', 'World War II', 'World War I', 'The Napoleonic Wars', 'The Franco-Prussian War', 'B', 'hard'),
  ((SELECT id FROM categories WHERE slug='history'), 'In which year did the French Revolution begin?', '1776', '1789', '1799', '1804', 'B', 'hard');

-- Geography Questions
INSERT INTO questions (category_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
  ((SELECT id FROM categories WHERE slug='geography'), 'What is the capital of Ghana?', 'Accra', 'Kumasi', 'Takoradi', 'Tamale', 'A', 'easy'),
  ((SELECT id FROM categories WHERE slug='geography'), 'Which is the largest continent by area?', 'Africa', 'North America', 'Europe', 'Asia', 'D', 'easy'),
  ((SELECT id FROM categories WHERE slug='geography'), 'What is the longest river in the world?', 'Amazon', 'Mississippi', 'Nile', 'Yangtze', 'C', 'easy'),
  ((SELECT id FROM categories WHERE slug='geography'), 'Which country is known as the Land of the Rising Sun?', 'China', 'Japan', 'South Korea', 'Thailand', 'B', 'easy'),
  ((SELECT id FROM categories WHERE slug='geography'), 'What is the smallest country in the world?', 'Monaco', 'Vatican City', 'San Marino', 'Liechtenstein', 'B', 'medium'),
  ((SELECT id FROM categories WHERE slug='geography'), 'Which desert is the largest hot desert in the world?', 'Gobi', 'Kalahari', 'Arabian', 'Sahara', 'D', 'medium'),
  ((SELECT id FROM categories WHERE slug='geography'), 'Mount Everest is located on the border of which two countries?', 'India and China', 'Nepal and China', 'Nepal and India', 'Pakistan and China', 'B', 'medium'),
  ((SELECT id FROM categories WHERE slug='geography'), 'What is the deepest point in the world''s oceans?', 'Tonga Trench', 'Mariana Trench', 'Puerto Rico Trench', 'Java Trench', 'B', 'hard'),
  ((SELECT id FROM categories WHERE slug='geography'), 'Which African country has the largest population?', 'South Africa', 'Ethiopia', 'Egypt', 'Nigeria', 'D', 'hard'),
  ((SELECT id FROM categories WHERE slug='geography'), 'What is the capital of Kazakhstan?', 'Almaty', 'Astana', 'Bishkek', 'Tashkent', 'B', 'hard');

-- Create default admin user (password: admin123 — change in production!)
-- Hash: $2b$10$... will be generated by the seed script
