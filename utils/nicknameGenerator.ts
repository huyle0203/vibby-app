import { SHA256 } from 'crypto-js';

const adjectives = [
  // Common adjectives
  'Big', 'Small', 'Tall', 'Short', 'Fast', 'Slow', 'Loud', 'Quiet', 'Happy', 'Sad',
  'Bright', 'Dark', 'Hot', 'Cold', 'Smooth', 'Rough', 'Heavy', 'Light', 'Strong', 'Weak',
  
  // Funny and sarcastic adjectives
  'Lazy', 'Not Funny', 'Unserious', 'Clumsy', 'Dramatic', 'Awkward', 'Confused', 'Sleepy',
  'Grumpy', 'Hangry', 'Procrastinating', 'Overconfident', 'Indecisive', 'Forgetful', 'Sassy',
  'Caffeinated', 'Unimpressed', 'Sarcastic', 'Mischievous', 'Quirky',
  
  // Original adjectives (keeping some for variety)
  'Mysterious', 'Laughing', 'Clever', 'Daring', 'Gentle', 'Witty', 'Brave', 'Calm', 'Eager',
  'Kind', 'Lively', 'Proud', 'Silly', 'Thankful', 'Victorious', 'Zealous', 'Charming', 'Friendly',
  'Curious', 'Energetic', 'Fantastic', 'Graceful', 'Imaginative', 'Joyful', 'Optimistic', 'Peaceful'
];

const nouns = [
  // Animals (keeping some for variety)
  'Penguin', 'Tiger', 'Unicorn', 'Dragon', 'Phoenix', 'Platypus',
  
  // Objects
  'Pencil', 'Guitar', 'Teacup', 'Umbrella', 'Balloon', 'Pillow', 'Telescope', 'Compass', 'Backpack',
  'Hammer', 'Paintbrush', 'Candle', 'Microphone', 'Camera', 'Bicycle', 'Rocket', 'Toaster', 'Cactus',
  
  // Food and Drinks
  'Pizza', 'Taco', 'Sushi', 'Cupcake', 'Popcorn', 'Donut', 'Coffee', 'Smoothie', 'Burrito', 'Pancake',
  
  // Nature
  'Mountain', 'River', 'Forest', 'Desert', 'Ocean', 'Volcano', 'Galaxy', 'Tornado', 'Rainbow', 'Glacier',
  
  // Concepts and Abstract Nouns
  'Dream', 'Idea', 'Mystery', 'Adventure', 'Riddle', 'Joke', 'Melody', 'Whisper', 'Legend', 'Secret',
  
  // Professions
  'Ninja', 'Wizard', 'Pirate', 'Astronaut', 'Chef', 'Detective', 'Superhero', 'Scientist', 'Artist',
  
  // Technology
  'Robot', 'Hologram', 'Satellite', 'Cyborg', 'Pixel', 'Emoji', 'Glitch', 'Meme', 'Selfie', 'Hashtag',
  
  // Mythical Creatures
  'Mermaid', 'Centaur', 'Goblin', 'Fairy', 'Yeti', 'Kraken', 'Gnome', 'Gremlin', 'Chimera', 'Basilisk'
];

export const generateNickname = (userId: string, postId: string): string => {
  const seed = SHA256(userId + postId).toString();
  const adjectiveIndex = parseInt(seed.substr(0, 8), 16) % adjectives.length;
  const nounIndex = parseInt(seed.substr(8, 8), 16) % nouns.length;
  
  return `${adjectives[adjectiveIndex]} ${nouns[nounIndex]}`;
};