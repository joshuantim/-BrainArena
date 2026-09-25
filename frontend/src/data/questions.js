/* ============================================================
   QUESTIONS.JS — Quiz Data Store (ES Module)
   Contains 90+ questions across 9 categories with 3 difficulty levels.
   ============================================================ */

export const quizData = {
  categories: [
    { id: "general", name: "General Knowledge", icon: "Lightbulb", description: "Test your knowledge on a variety of everyday topics.", color: "#6C63FF" },
    { id: "science", name: "Science", icon: "FlaskConical", description: "Explore the wonders of physics, chemistry, and biology.", color: "#FF6B6B" },
    { id: "technology", name: "Technology", icon: "Cpu", description: "How well do you know the digital world?", color: "#2ED573" },
    { id: "mathematics", name: "Mathematics", icon: "Calculator", description: "Put your number skills to the ultimate test.", color: "#FFA502" },
    { id: "sports", name: "Sports", icon: "Trophy", description: "From football to athletics — prove your sports IQ.", color: "#1E90FF" },
    { id: "movies", name: "Movies", icon: "Clapperboard", description: "Lights, camera, quiz! Test your cinema knowledge.", color: "#E84393" },
    { id: "music", name: "Music", icon: "Music", description: "From classical to pop — how much do you know?", color: "#00CEC9" },
    { id: "history", name: "History", icon: "Landmark", description: "Journey through time and test your history knowledge.", color: "#FDCB6E" },
    { id: "geography", name: "Geography", icon: "Globe", description: "Explore the world from the comfort of your screen.", color: "#A29BFE" },
  ],

  general: [
    { id: "gen1", category: "general", difficulty: "easy", question: "What is the capital of France?", answers: ["Berlin", "Madrid", "Paris", "Lisbon"], correct: 2 },
    { id: "gen2", category: "general", difficulty: "easy", question: "How many continents are there on Earth?", answers: ["5", "6", "7", "8"], correct: 2 },
    { id: "gen3", category: "general", difficulty: "easy", question: "What color are bananas when they are ripe?", answers: ["Green", "Yellow", "Red", "Blue"], correct: 1 },
    { id: "gen4", category: "general", difficulty: "easy", question: "Which animal is known as the King of the Jungle?", answers: ["Tiger", "Elephant", "Lion", "Bear"], correct: 2 },
    { id: "gen5", category: "general", difficulty: "medium", question: "What is the largest ocean on Earth?", answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"], correct: 3 },
    { id: "gen6", category: "general", difficulty: "medium", question: "Which country is home to the kangaroo?", answers: ["New Zealand", "South Africa", "Australia", "Brazil"], correct: 2 },
    { id: "gen7", category: "general", difficulty: "medium", question: "What does UNESCO stand for?", answers: ["United Nations Educational, Scientific and Cultural Organization", "United Nations Economic and Social Council Organization", "Universal Education Science Culture Organization", "United Nations Environment Safety and Culture Organization"], correct: 0 },
    { id: "gen8", category: "general", difficulty: "hard", question: "In which year was the United Nations founded?", answers: ["1940", "1945", "1950", "1955"], correct: 1 },
    { id: "gen9", category: "general", difficulty: "hard", question: "What is the hardest natural substance on Earth?", answers: ["Gold", "Iron", "Diamond", "Platinum"], correct: 2 },
    { id: "gen10", category: "general", difficulty: "hard", question: "Which country has the most official languages?", answers: ["India", "South Africa", "Bolivia", "Zimbabwe"], correct: 2 },
  ],

  science: [
    { id: "sci1", category: "science", difficulty: "easy", question: "What planet is known as the Red Planet?", answers: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
    { id: "sci2", category: "science", difficulty: "easy", question: "What gas do plants absorb from the atmosphere?", answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
    { id: "sci3", category: "science", difficulty: "easy", question: "How many bones are in the adult human body?", answers: ["186", "206", "226", "256"], correct: 1 },
    { id: "sci4", category: "science", difficulty: "easy", question: "What is the chemical symbol for water?", answers: ["HO", "H2O", "O2H", "H2O2"], correct: 1 },
    { id: "sci5", category: "science", difficulty: "medium", question: "What is the powerhouse of the cell?", answers: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"], correct: 2 },
    { id: "sci6", category: "science", difficulty: "medium", question: "What is the speed of light in a vacuum (approx.)?", answers: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000,000 km/s"], correct: 0 },
    { id: "sci7", category: "science", difficulty: "medium", question: "Which element has the atomic number 1?", answers: ["Helium", "Lithium", "Hydrogen", "Carbon"], correct: 2 },
    { id: "sci8", category: "science", difficulty: "hard", question: "What is the Heisenberg Uncertainty Principle about?", answers: ["The speed of chemical reactions", "The position and momentum of particles", "The half-life of radioactive elements", "The energy of photons"], correct: 1 },
    { id: "sci9", category: "science", difficulty: "hard", question: "What is the most abundant element in the universe?", answers: ["Oxygen", "Carbon", "Helium", "Hydrogen"], correct: 3 },
    { id: "sci10", category: "science", difficulty: "hard", question: "What phenomenon causes the Aurora Borealis?", answers: ["Reflection of sunlight off ice crystals", "Charged particles from the Sun interacting with Earth's magnetosphere", "Volcanic gases in the upper atmosphere", "Refraction of moonlight through clouds"], correct: 1 },
  ],

  technology: [
    { id: "tech1", category: "technology", difficulty: "easy", question: "What does 'CPU' stand for?", answers: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], correct: 0 },
    { id: "tech2", category: "technology", difficulty: "easy", question: "Who co-founded Apple Inc.?", answers: ["Bill Gates", "Elon Musk", "Steve Jobs", "Jeff Bezos"], correct: 2 },
    { id: "tech3", category: "technology", difficulty: "easy", question: "What does 'HTML' stand for?", answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0 },
    { id: "tech4", category: "technology", difficulty: "easy", question: "Which company developed the Android operating system?", answers: ["Apple", "Microsoft", "Google", "Samsung"], correct: 2 },
    { id: "tech5", category: "technology", difficulty: "medium", question: "What year was the first iPhone released?", answers: ["2005", "2006", "2007", "2008"], correct: 2 },
    { id: "tech6", category: "technology", difficulty: "medium", question: "What does 'RAM' stand for?", answers: ["Random Access Memory", "Read Access Memory", "Run Application Memory", "Rapid Access Module"], correct: 0 },
    { id: "tech7", category: "technology", difficulty: "medium", question: "Which programming language is known as the 'language of the web'?", answers: ["Python", "Java", "JavaScript", "C++"], correct: 2 },
    { id: "tech8", category: "technology", difficulty: "hard", question: "What does the acronym 'API' stand for?", answers: ["Application Programming Interface", "Applied Program Integration", "Automated Process Instruction", "Application Process Integration"], correct: 0 },
    { id: "tech9", category: "technology", difficulty: "hard", question: "In what year was the World Wide Web invented?", answers: ["1985", "1989", "1993", "1991"], correct: 1 },
    { id: "tech10", category: "technology", difficulty: "hard", question: "What is the time complexity of binary search?", answers: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 2 },
  ],

  mathematics: [
    { id: "math1", category: "mathematics", difficulty: "easy", question: "What is 12 × 12?", answers: ["124", "144", "132", "156"], correct: 1 },
    { id: "math2", category: "mathematics", difficulty: "easy", question: "What is the square root of 64?", answers: ["6", "7", "8", "9"], correct: 2 },
    { id: "math3", category: "mathematics", difficulty: "easy", question: "How many sides does a hexagon have?", answers: ["5", "6", "7", "8"], correct: 1 },
    { id: "math4", category: "mathematics", difficulty: "easy", question: "What is 15% of 200?", answers: ["20", "25", "30", "35"], correct: 2 },
    { id: "math5", category: "mathematics", difficulty: "medium", question: "What is the value of Pi (π) to two decimal places?", answers: ["3.12", "3.14", "3.16", "3.18"], correct: 1 },
    { id: "math6", category: "mathematics", difficulty: "medium", question: "What is the next prime number after 7?", answers: ["9", "10", "11", "13"], correct: 2 },
    { id: "math7", category: "mathematics", difficulty: "medium", question: "If a triangle has angles of 90° and 45°, what is the third angle?", answers: ["35°", "40°", "45°", "55°"], correct: 2 },
    { id: "math8", category: "mathematics", difficulty: "hard", question: "What is the derivative of x³?", answers: ["x²", "2x²", "3x²", "3x"], correct: 2 },
    { id: "math9", category: "mathematics", difficulty: "hard", question: "What is the factorial of 6 (6!)?", answers: ["120", "620", "720", "840"], correct: 2 },
    { id: "math10", category: "mathematics", difficulty: "hard", question: "What is the sum of the interior angles of a pentagon?", answers: ["360°", "480°", "540°", "720°"], correct: 2 },
  ],

  sports: [
    { id: "spt1", category: "sports", difficulty: "easy", question: "How many players are on a standard football (soccer) team?", answers: ["9", "10", "11", "12"], correct: 2 },
    { id: "spt2", category: "sports", difficulty: "easy", question: "In which sport do you use a racket to hit a shuttlecock?", answers: ["Tennis", "Badminton", "Squash", "Table Tennis"], correct: 1 },
    { id: "spt3", category: "sports", difficulty: "easy", question: "How many rings are on the Olympic flag?", answers: ["3", "4", "5", "6"], correct: 2 },
    { id: "spt4", category: "sports", difficulty: "easy", question: "What sport is played at Wimbledon?", answers: ["Cricket", "Golf", "Tennis", "Polo"], correct: 2 },
    { id: "spt5", category: "sports", difficulty: "medium", question: "Which country won the 2022 FIFA World Cup?", answers: ["France", "Brazil", "Argentina", "Germany"], correct: 2 },
    { id: "spt6", category: "sports", difficulty: "medium", question: "How many points is a touchdown worth in American football?", answers: ["3", "5", "6", "7"], correct: 2 },
    { id: "spt7", category: "sports", difficulty: "medium", question: "What is the maximum score in a single frame of bowling?", answers: ["10", "20", "30", "50"], correct: 2 },
    { id: "spt8", category: "sports", difficulty: "hard", question: "Who holds the record for the most Grand Slam tennis titles (men's singles)?", answers: ["Roger Federer", "Rafael Nadal", "Novak Djokovic", "Pete Sampras"], correct: 2 },
    { id: "spt9", category: "sports", difficulty: "hard", question: "In which year were the first modern Olympic Games held?", answers: ["1892", "1896", "1900", "1904"], correct: 1 },
    { id: "spt10", category: "sports", difficulty: "hard", question: "What is the diameter of a basketball hoop in inches?", answers: ["16", "17", "18", "19"], correct: 2 },
  ],

  movies: [
    { id: "mov1", category: "movies", difficulty: "easy", question: "What animated film features a character named Simba?", answers: ["Finding Nemo", "Shrek", "The Lion King", "Toy Story"], correct: 2 },
    { id: "mov2", category: "movies", difficulty: "easy", question: "Who directed the movie 'Titanic'?", answers: ["Steven Spielberg", "James Cameron", "Martin Scorsese", "Ridley Scott"], correct: 1 },
    { id: "mov3", category: "movies", difficulty: "easy", question: "What is the name of the wizard school in Harry Potter?", answers: ["Narnia Academy", "Hogwarts", "Westeros School", "Middle Earth Academy"], correct: 1 },
    { id: "mov4", category: "movies", difficulty: "easy", question: "Which superhero is also known as 'The Dark Knight'?", answers: ["Superman", "Spider-Man", "Iron Man", "Batman"], correct: 3 },
    { id: "mov5", category: "movies", difficulty: "medium", question: "Which film won the Academy Award for Best Picture in 2020?", answers: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"], correct: 2 },
    { id: "mov6", category: "movies", difficulty: "medium", question: "Who played the Joker in 'The Dark Knight' (2008)?", answers: ["Jack Nicholson", "Jared Leto", "Joaquin Phoenix", "Heath Ledger"], correct: 3 },
    { id: "mov7", category: "movies", difficulty: "medium", question: "What is the highest-grossing film of all time (unadjusted)?", answers: ["Avengers: Endgame", "Avatar", "Titanic", "Star Wars: The Force Awakens"], correct: 1 },
    { id: "mov8", category: "movies", difficulty: "hard", question: "In 'Inception', what is the name of the spinning top used as a totem?", answers: ["The Dreamer", "The Spinner", "It has no specific name", "The Architect"], correct: 2 },
    { id: "mov9", category: "movies", difficulty: "hard", question: "Which 1994 film was based on a Stephen King novella called 'Rita Hayworth and Shawshank Redemption'?", answers: ["The Green Mile", "Stand By Me", "The Shawshank Redemption", "Misery"], correct: 2 },
    { id: "mov10", category: "movies", difficulty: "hard", question: "Who composed the iconic score for the 'Star Wars' franchise?", answers: ["Hans Zimmer", "Howard Shore", "John Williams", "Ennio Morricone"], correct: 2 },
  ],

  music: [
    { id: "mus1", category: "music", difficulty: "easy", question: "Which band performed 'Bohemian Rhapsody'?", answers: ["The Beatles", "Queen", "Led Zeppelin", "Pink Floyd"], correct: 1 },
    { id: "mus2", category: "music", difficulty: "easy", question: "How many strings does a standard guitar have?", answers: ["4", "5", "6", "7"], correct: 2 },
    { id: "mus3", category: "music", difficulty: "easy", question: "Who is known as the 'King of Pop'?", answers: ["Prince", "Elvis Presley", "Michael Jackson", "Stevie Wonder"], correct: 2 },
    { id: "mus4", category: "music", difficulty: "easy", question: "What instrument does a drummer play?", answers: ["Guitar", "Piano", "Drums", "Violin"], correct: 2 },
    { id: "mus5", category: "music", difficulty: "medium", question: "Which artist released the album '25' in 2015?", answers: ["Taylor Swift", "Beyoncé", "Adele", "Rihanna"], correct: 2 },
    { id: "mus6", category: "music", difficulty: "medium", question: "What is the highest female singing voice type?", answers: ["Alto", "Mezzo-Soprano", "Soprano", "Contralto"], correct: 2 },
    { id: "mus7", category: "music", difficulty: "medium", question: "Which composer wrote 'The Four Seasons'?", answers: ["Mozart", "Beethoven", "Bach", "Vivaldi"], correct: 3 },
    { id: "mus8", category: "music", difficulty: "hard", question: "In music theory, how many semitones are in an octave?", answers: ["8", "10", "12", "14"], correct: 2 },
    { id: "mus9", category: "music", difficulty: "hard", question: "Which Beethoven symphony is known as 'Ode to Joy'?", answers: ["5th", "7th", "9th", "3rd"], correct: 2 },
    { id: "mus10", category: "music", difficulty: "hard", question: "What is the BPM range typically associated with 'Allegro' tempo?", answers: ["60-80", "80-100", "100-120", "120-156"], correct: 3 },
  ],

  history: [
    { id: "his1", category: "history", difficulty: "easy", question: "Who was the first President of the United States?", answers: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"], correct: 2 },
    { id: "his2", category: "history", difficulty: "easy", question: "In which country were the ancient pyramids built?", answers: ["Greece", "Mexico", "Egypt", "China"], correct: 2 },
    { id: "his3", category: "history", difficulty: "easy", question: "What was the name of the ship that sank in 1912?", answers: ["Lusitania", "Britannic", "Titanic", "Olympic"], correct: 2 },
    { id: "his4", category: "history", difficulty: "easy", question: "Which ancient civilization built the Colosseum?", answers: ["Greek", "Egyptian", "Roman", "Persian"], correct: 2 },
    { id: "his5", category: "history", difficulty: "medium", question: "In which year did World War II end?", answers: ["1943", "1944", "1945", "1946"], correct: 2 },
    { id: "his6", category: "history", difficulty: "medium", question: "Who discovered America in 1492?", answers: ["Vasco da Gama", "Ferdinand Magellan", "Christopher Columbus", "Amerigo Vespucci"], correct: 2 },
    { id: "his7", category: "history", difficulty: "medium", question: "What wall divided Berlin from 1961 to 1989?", answers: ["The Iron Curtain", "The Berlin Wall", "The Great Wall", "Hadrian's Wall"], correct: 1 },
    { id: "his8", category: "history", difficulty: "hard", question: "Which empire was ruled by Genghis Khan?", answers: ["Ottoman Empire", "Roman Empire", "Mongol Empire", "Persian Empire"], correct: 2 },
    { id: "his9", category: "history", difficulty: "hard", question: "The Treaty of Versailles ended which war?", answers: ["World War II", "World War I", "The Napoleonic Wars", "The Franco-Prussian War"], correct: 1 },
    { id: "his10", category: "history", difficulty: "hard", question: "In which year did the French Revolution begin?", answers: ["1776", "1789", "1799", "1804"], correct: 1 },
  ],

  geography: [
    { id: "geo1", category: "geography", difficulty: "easy", question: "What is the capital of Ghana?", answers: ["Accra", "Kumasi", "Takoradi", "Tamale"], correct: 0 },
    { id: "geo2", category: "geography", difficulty: "easy", question: "Which is the largest continent by area?", answers: ["Africa", "North America", "Europe", "Asia"], correct: 3 },
    { id: "geo3", category: "geography", difficulty: "easy", question: "What is the longest river in the world?", answers: ["Amazon", "Mississippi", "Nile", "Yangtze"], correct: 2 },
    { id: "geo4", category: "geography", difficulty: "easy", question: "Which country is known as the Land of the Rising Sun?", answers: ["China", "Japan", "South Korea", "Thailand"], correct: 1 },
    { id: "geo5", category: "geography", difficulty: "medium", question: "What is the smallest country in the world?", answers: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], correct: 1 },
    { id: "geo6", category: "geography", difficulty: "medium", question: "Which desert is the largest hot desert in the world?", answers: ["Gobi", "Kalahari", "Arabian", "Sahara"], correct: 3 },
    { id: "geo7", category: "geography", difficulty: "medium", question: "Mount Everest is located on the border of which two countries?", answers: ["India and China", "Nepal and China", "Nepal and India", "Pakistan and China"], correct: 1 },
    { id: "geo8", category: "geography", difficulty: "hard", question: "What is the deepest point in the world's oceans?", answers: ["Tonga Trench", "Mariana Trench", "Puerto Rico Trench", "Java Trench"], correct: 1 },
    { id: "geo9", category: "geography", difficulty: "hard", question: "Which African country has the largest population?", answers: ["South Africa", "Ethiopia", "Egypt", "Nigeria"], correct: 3 },
    { id: "geo10", category: "geography", difficulty: "hard", question: "What is the capital of Kazakhstan?", answers: ["Almaty", "Astana", "Bishkek", "Tashkent"], correct: 1 },
  ],
};

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQuestions(categoryId, difficulty) {
  const questions = quizData[categoryId];
  if (!questions) return [];
  const filtered = questions.filter((q) => q.difficulty === difficulty);
  return shuffle(filtered).map((q) => {
    const answerPairs = q.answers.map((text, idx) => ({ text, originalIndex: idx }));
    const shuffled = shuffle(answerPairs);
    const newCorrect = shuffled.findIndex((a) => a.originalIndex === q.correct);
    return { ...q, answers: shuffled.map((a) => a.text), correct: newCorrect };
  });
}

export function getCategoryQuestionCount(categoryId) {
  return quizData[categoryId]?.length || 0;
}

export function getDifficultyBreakdown(categoryId) {
  const questions = quizData[categoryId];
  if (!questions) return { easy: 0, medium: 0, hard: 0 };
  return {
    easy: questions.filter((q) => q.difficulty === "easy").length,
    medium: questions.filter((q) => q.difficulty === "medium").length,
    hard: questions.filter((q) => q.difficulty === "hard").length,
  };
}
