const words = {
  general: {
    easy: [
      { word: 'CAT', hint: 'A small domestic feline pet' },
      { word: 'DOG', hint: "Man's best friend" },
      { word: 'SUN', hint: 'The star at the center of our solar system' },
      { word: 'BOOK', hint: 'A written or printed work' },
      { word: 'FISH', hint: 'An aquatic vertebrate with fins' },
      { word: 'BIRD', hint: 'A feathered animal that can fly' },
      { word: 'TREE', hint: 'A tall woody plant' },
      { word: 'RAIN', hint: 'Water droplets falling from clouds' },
      { word: 'WIND', hint: 'Moving air' },
      { word: 'MOON', hint: 'Earth\'s natural satellite' },
      { word: 'STAR', hint: 'A luminous celestial body' },
      { word: 'FIRE', hint: 'Rapid oxidation producing heat and light' },
      { word: 'SNOW', hint: 'Frozen precipitation' },
      { word: 'ROAD', hint: 'A path for vehicles' },
      { word: 'CAKE', hint: 'A sweet baked dessert' },
    ],
    medium: [
      { word: 'GARDEN', hint: 'An outdoor area for growing plants' },
      { word: 'FLOWER', hint: 'A blooming part of a plant' },
      { word: 'BRIDGE', hint: 'A structure spanning an obstacle' },
      { word: 'CASTLE', hint: 'A large medieval fortified building' },
      { word: 'MARKET', hint: 'A place where goods are bought and sold' },
      { word: 'WINDOW', hint: 'An opening in a wall for light and air' },
      { word: 'FOREST', hint: 'A large area covered with trees' },
      { word: 'PLANET', hint: 'A celestial body orbiting a star' },
      { word: 'MIRROR', hint: 'A reflective surface' },
      { word: 'DESERT', hint: 'A dry barren landscape' },
      { word: 'JUNGLE', hint: 'A dense tropical forest' },
      { word: 'CANDLE', hint: 'A wax cylinder that provides light when burned' },
      { word: 'BOTTLE', hint: 'A container for liquids' },
      { word: 'BUTTER', hint: 'A dairy product made from cream' },
      { word: 'PILLOW', hint: 'A soft cushion for your head' },
    ],
    hard: [
      { word: 'ADVENTURE', hint: 'An unusual and exciting experience' },
      { word: 'BEAUTIFUL', hint: 'Pleasing to the senses or mind' },
      { word: 'KNOWLEDGE', hint: 'Facts and information acquired through experience' },
      { word: 'CELEBRATE', hint: 'To mark a special occasion with festivities' },
      { word: 'SYMPHONY', hint: 'An elaborate musical composition' },
      { word: 'WILDERNESS', hint: 'A wild and uncultivated region' },
      { word: 'GEOGRAPHY', hint: 'The study of Earth\'s physical features' },
      { word: 'COMMUNITY', hint: 'A group of people living in the same place' },
      { word: 'BUTTERFLY', hint: 'An insect with large colorful wings' },
      { word: 'CHOCOLATE', hint: 'A sweet food made from cacao seeds' },
      { word: 'TELESCOPE', hint: 'An instrument for viewing distant objects' },
      { word: 'EDUCATION', hint: 'The process of receiving instruction' },
      { word: 'FANTASTIC', hint: 'Extraordinarily good or imaginative' },
      { word: 'LANDSCAPE', hint: 'All visible features of an area of land' },
      { word: 'VOLUNTEER', hint: 'A person who freely offers to do something' },
    ],
  },
  technology: {
    easy: [
      { word: 'CODE', hint: 'Instructions written for a computer' },
      { word: 'DATA', hint: 'Facts and statistics collected for reference' },
      { word: 'FILE', hint: 'A collection of stored information' },
      { word: 'CHIP', hint: 'A small semiconductor device' },
      { word: 'BYTE', hint: 'A unit of digital information (8 bits)' },
      { word: 'WIFI', hint: 'Wireless network technology' },
      { word: 'DISK', hint: 'A magnetic storage device' },
      { word: 'BOOT', hint: 'To start up a computer' },
      { word: 'HTML', hint: 'Markup language for web pages' },
      { word: 'LINK', hint: 'A clickable connection to another resource' },
      { word: 'LOOP', hint: 'A programming structure that repeats' },
      { word: 'PORT', hint: 'A connection point on a computer' },
      { word: 'ICON', hint: 'A small graphical symbol' },
      { word: 'FONT', hint: 'A set of typeface characters' },
      { word: 'GRID', hint: 'A network of lines crossing at right angles' },
    ],
    medium: [
      { word: 'PYTHON', hint: 'A popular programming language' },
      { word: 'LAPTOP', hint: 'A portable personal computer' },
      { word: 'SERVER', hint: 'A computer that provides data to others' },
      { word: 'CURSOR', hint: 'A movable indicator on a screen' },
      { word: 'DRIVER', hint: 'Software that controls hardware devices' },
      { word: 'KERNEL', hint: 'The core of an operating system' },
      { word: 'BINARY', hint: 'A number system using only 0s and 1s' },
      { word: 'BUFFER', hint: 'Temporary storage area for data' },
      { word: 'DOCKER', hint: 'A containerization platform' },
      { word: 'ROUTER', hint: 'A device that forwards network packets' },
      { word: 'SYNTAX', hint: 'Rules governing the structure of code' },
      { word: 'COOKIE', hint: 'Small data stored by a web browser' },
      { word: 'BRANCH', hint: 'A diverging version in version control' },
      { word: 'WIDGET', hint: 'A small application or interface element' },
      { word: 'THREAD', hint: 'A sequence of instructions in a process' },
    ],
    hard: [
      { word: 'ALGORITHM', hint: 'A step-by-step procedure for solving a problem' },
      { word: 'DEBUGGING', hint: 'The process of finding and fixing errors in code' },
      { word: 'FRAMEWORK', hint: 'A platform for developing software applications' },
      { word: 'INTERFACE', hint: 'A point of interaction between systems' },
      { word: 'PROCESSOR', hint: 'The brain of a computer that executes instructions' },
      { word: 'BANDWIDTH', hint: 'The maximum data transfer rate of a network' },
      { word: 'RECURSION', hint: 'A function that calls itself' },
      { word: 'ENCRYPTION', hint: 'Converting data into a coded form' },
      { word: 'BLOCKCHAIN', hint: 'A distributed ledger technology' },
      { word: 'REPOSITORY', hint: 'A storage location for version-controlled code' },
      { word: 'KUBERNETES', hint: 'A container orchestration system' },
      { word: 'MIDDLEWARE', hint: 'Software connecting operating system to applications' },
      { word: 'JAVASCRIPT', hint: 'A scripting language for web development' },
      { word: 'DEPLOYMENT', hint: 'The process of releasing software to production' },
      { word: 'MICROSERVICE', hint: 'An architectural style with small independent services' },
    ],
  },
  sports: {
    easy: [
      { word: 'BALL', hint: 'A round object used in many sports' },
      { word: 'GOAL', hint: 'The target to score in many sports' },
      { word: 'RACE', hint: 'A competition of speed' },
      { word: 'SWIM', hint: 'To move through water' },
      { word: 'KICK', hint: 'To strike with the foot' },
      { word: 'JUMP', hint: 'To propel oneself upward' },
      { word: 'TEAM', hint: 'A group playing together' },
      { word: 'GAME', hint: 'A competitive activity' },
      { word: 'SHOT', hint: 'An attempt to score' },
      { word: 'PASS', hint: 'To transfer the ball to a teammate' },
      { word: 'RUN', hint: 'To move quickly on foot' },
      { word: 'BAT', hint: 'A wooden club used in cricket or baseball' },
      { word: 'NET', hint: 'A mesh barrier in many sports' },
      { word: 'LAP', hint: 'One circuit of a track' },
      { word: 'DIVE', hint: 'To plunge headfirst into water' },
    ],
    medium: [
      { word: 'SOCCER', hint: 'A sport played with a round ball using feet' },
      { word: 'TENNIS', hint: 'A sport played with rackets and a ball' },
      { word: 'HOCKEY', hint: 'A sport played with sticks and a puck' },
      { word: 'BOXING', hint: 'A combat sport using fists' },
      { word: 'ROWING', hint: 'Propelling a boat with oars' },
      { word: 'SPRINT', hint: 'Running at full speed over a short distance' },
      { word: 'TACKLE', hint: 'To bring down an opponent in football' },
      { word: 'DRIBBLE', hint: 'To move with the ball under control' },
      { word: 'PITCHER', hint: 'The player who throws in baseball' },
      { word: 'REFEREE', hint: 'An official who enforces rules in a sport' },
      { word: 'TROPHY', hint: 'An award given to a winner' },
      { word: 'LEAGUE', hint: 'A group of sports teams that compete' },
      { word: 'JERSEY', hint: 'A sports shirt worn by team members' },
      { word: 'HURDLE', hint: 'A barrier jumped over in track events' },
      { word: 'PENALTY', hint: 'A punishment for breaking rules in sports' },
    ],
    hard: [
      { word: 'BADMINTON', hint: 'A racket sport played with a shuttlecock' },
      { word: 'TRIATHLON', hint: 'A race combining swimming, cycling, and running' },
      { word: 'GYMNASTICS', hint: 'An acrobatic sport requiring balance and coordination' },
      { word: 'VOLLEYBALL', hint: 'A team sport where players hit a ball over a net' },
      { word: 'BASKETBALL', hint: 'A sport where players shoot a ball through a hoop' },
      { word: 'TOURNAMENT', hint: 'A series of contests determining a champion' },
      { word: 'CHAMPIONSHIP', hint: 'A competition to determine the best team or player' },
      { word: 'QUARTERBACK', hint: 'The key player position in American football' },
      { word: 'DECATHLON', hint: 'An athletic contest of ten different events' },
      { word: 'SKATEBOARD', hint: 'A narrow board with wheels for tricks or transport' },
      { word: 'ARCHERY', hint: 'The sport of shooting with a bow and arrows' },
      { word: 'WRESTLING', hint: 'A combat sport involving grappling techniques' },
      { word: 'SNOWBOARD', hint: 'A board used to descend snow-covered slopes' },
      { word: 'EQUESTRIAN', hint: 'Relating to horse riding as a sport' },
      { word: 'FENCING', hint: 'The sport of fighting with swords' },
    ],
  },
  science: {
    easy: [
      { word: 'ATOM', hint: 'The smallest unit of an element' },
      { word: 'CELL', hint: 'The basic structural unit of living organisms' },
      { word: 'WAVE', hint: 'A disturbance that transfers energy' },
      { word: 'HEAT', hint: 'Thermal energy transferred between objects' },
      { word: 'MASS', hint: 'The amount of matter in an object' },
      { word: 'ACID', hint: 'A substance with pH less than 7' },
      { word: 'BASE', hint: 'A substance with pH greater than 7' },
      { word: 'GENE', hint: 'A unit of heredity in living organisms' },
      { word: 'SALT', hint: 'Formed when acid and base react' },
      { word: 'LENS', hint: 'A curved piece of glass that bends light' },
      { word: 'VOLT', hint: 'A unit of electrical potential' },
      { word: 'GERM', hint: 'A microorganism that causes disease' },
      { word: 'VEIN', hint: 'A blood vessel carrying blood to the heart' },
      { word: 'BONE', hint: 'A rigid connective tissue forming the skeleton' },
      { word: 'IRON', hint: 'A metallic element, symbol Fe' },
    ],
    medium: [
      { word: 'OXYGEN', hint: 'A gas essential for respiration' },
      { word: 'CARBON', hint: 'A nonmetallic element found in all organic compounds' },
      { word: 'PHOTON', hint: 'A particle of light' },
      { word: 'NEURON', hint: 'A nerve cell that transmits signals' },
      { word: 'PROTON', hint: 'A positively charged particle in an atom\'s nucleus' },
      { word: 'ENZYME', hint: 'A biological catalyst' },
      { word: 'PLASMA', hint: 'The fourth state of matter' },
      { word: 'FOSSIL', hint: 'Preserved remains of an ancient organism' },
      { word: 'MAGNET', hint: 'An object that attracts iron' },
      { word: 'PRISM', hint: 'A transparent object that refracts light' },
      { word: 'FUNGUS', hint: 'A kingdom of organisms including mushrooms and mold' },
      { word: 'TECTONIC', hint: 'Relating to the structure of the Earth\'s crust' },
      { word: 'ISOTOPE', hint: 'Variants of an element with different neutron numbers' },
      { word: 'NEUTRON', hint: 'A neutral particle in an atom\'s nucleus' },
      { word: 'NUCLEUS', hint: 'The center of an atom or cell' },
    ],
    hard: [
      { word: 'CHEMISTRY', hint: 'The study of matter and its properties' },
      { word: 'MOLECULES', hint: 'The smallest units of a chemical compound' },
      { word: 'EVOLUTION', hint: 'The process of species changing over time' },
      { word: 'ECOSYSTEM', hint: 'A community of organisms and their environment' },
      { word: 'HYPOTHESIS', hint: 'A proposed explanation for an observation' },
      { word: 'MITOSIS', hint: 'Cell division producing two identical daughter cells' },
      { word: 'RADIATION', hint: 'Energy emitted as waves or particles' },
      { word: 'ATMOSPHERE', hint: 'The layer of gases surrounding Earth' },
      { word: 'CHROMOSOME', hint: 'A thread-like structure carrying genetic information' },
      { word: 'QUANTUM', hint: 'The minimum amount of energy in physics' },
      { word: 'THERMODYNAMICS', hint: 'The branch of physics dealing with heat and energy' },
      { word: 'PHOTOSYNTHESIS', hint: 'Process by which plants make food from sunlight' },
      { word: 'GRAVITATIONAL', hint: 'Relating to the force of gravity' },
      { word: 'CENTRIFUGAL', hint: 'An apparent force acting outward on a rotating body' },
      { word: 'ELECTROMAGNETIC', hint: 'Relating to the interaction of electricity and magnetism' },
    ],
  },
};

function scrambleWord(word) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const scrambled = arr.join('');
  // Make sure it's actually scrambled
  if (scrambled === word && word.length > 1) {
    return scrambleWord(word);
  }
  return scrambled;
}

function getWord(category, difficulty) {
  const catWords = words[category]?.[difficulty];
  if (!catWords || catWords.length === 0) {
    throw new Error(`No words found for ${category}/${difficulty}`);
  }
  const entry = catWords[Math.floor(Math.random() * catWords.length)];
  return {
    ...entry,
    scrambled: scrambleWord(entry.word),
    category,
    difficulty,
  };
}

// Returns `count` unique shuffled words — no repeats within the same batch
function getWords(category, difficulty, count = 10) {
  const catWords = words[category]?.[difficulty];
  if (!catWords || catWords.length === 0) {
    throw new Error(`No words found for ${category}/${difficulty}`);
  }
  // Fisher-Yates shuffle on a copy
  const shuffled = [...catWords].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  return selected.map(entry => ({
    ...entry,
    scrambled: scrambleWord(entry.word),
    category,
    difficulty,
  }));
}

function getCategories() {
  return Object.keys(words).map(cat => ({
    id: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    difficulties: Object.keys(words[cat]),
  }));
}

module.exports = { getWord, getWords, getCategories, scrambleWord };
