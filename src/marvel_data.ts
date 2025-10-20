export const marvel_characters_list = [
  {
    naam: "Iron Man",
    small_image: "/images/characters/iron-man-large.png",
    base_attack: 85,
    base_defense: 70,
    speed_stat: 75,
    special_abilities: ["Arc Reactor Blast", "Repulsor Rays", "Unibeam", "Missile Barrage"],
    weapons_available: ["Mark 50 Armor", "Nano Tech", "J.A.R.V.I.S. AI", "Holographic Shield"]
  },
  {
    naam: "Captain America",
    small_image: "/images/characters/captain-america-large.png",
    base_attack: 75,
    base_defense: 90,
    speed_stat: 70,
    special_abilities: ["Shield Throw", "Super Soldier Serum", "Tactical Mind", "Vibranium Defense"],
    weapons_available: ["Vibranium Shield", "Combat Suit", "Magnetic Recall", "Shield Bash"]
  },
  {
    naam: "Thor",
    small_image: "/images/characters/thor-large.png",
    base_attack: 95,
    base_defense: 85,
    speed_stat: 60,
    special_abilities: ["Lightning Strike", "Mjolnir Summon", "God of Thunder", "Bifrost Teleport"],
    weapons_available: ["Mjolnir", "Stormbreaker", "Asgardian Armor", "Thunder Blast"]
  },
  {
    naam: "Hulk",
    small_image: "/images/characters/hulk-small.png",
    base_attack: 100,
    base_defense: 80,
    speed_stat: 50,
    special_abilities: ["Rage Mode", "Thunder Clap", "Hulk Smash", "Regeneration"],
    weapons_available: ["Bare Fists", "Environmental Objects", "Seismic Stomp", "Berserker Fury"]
  },
  {
    naam: "Black Widow",
    small_image: "/images/characters/black-widow-large.png",
    base_attack: 70,
    base_defense: 65,
    speed_stat: 95,
    special_abilities: ["Widow's Bite", "Stealth Mode", "Acrobatic Combat", "Espionage Tactics"],
    weapons_available: ["Dual Batons", "Grappling Hook", "Smoke Bombs", "Shock Gauntlets"]
  },
  {
    naam: "Spider-Man",
    small_image: "https://pngimg.com/uploads/spider_man/spider_man_PNG54.png",
    base_attack: 75,
    base_defense: 70,
    speed_stat: 100,
    special_abilities: ["Web Slinging", "Spider Sense", "Wall Crawling", "Web Shooter Variants"],
    weapons_available: ["Web Shooters", "Impact Webbing", "Web Bombs", "Taser Webs"]
  },
  {
    naam: "Black Panther", 
    small_image: "/images/characters/black-panther-small.png",
    base_attack: 80,
    base_defense: 85,
    speed_stat: 90,
    special_abilities: ["Vibranium Suit", "Panther Claws", "Kinetic Energy Pulse", "Ancestral Power"],
    weapons_available: ["Vibranium Claws", "Energy Daggers", "Panther Habit", "Sonic Disruptors"]
  },
  {
    naam: "Doctor Strange",
    small_image: "/images/characters/doctor-strange-large.webp",
    base_attack: 90,
    base_defense: 75,
    speed_stat: 65,
    special_abilities: ["Time Manipulation", "Mirror Dimension", "Mystic Arts", "Portals"],
    weapons_available: ["Eye of Agamotto", "Cloak of Levitation", "Eldritch Whips", "Crimson Bands"]
  },
  {
    naam: "Scarlet Witch",
    small_image: "/images/characters/scarlet-witch-small.png",
    base_attack: 95,
    base_defense: 60,
    speed_stat: 70,
    special_abilities: ["Chaos Magic", "Reality Warping", "Telekinesis", "Mind Control"],
    weapons_available: ["Hex Bolts", "Energy Shields", "Psionic Blasts", "Reality Alteration"]
  },
  {
    naam: "Loki",
    small_image: "/images/characters/loki-large.png",
    base_attack: 75,
    base_defense: 70,
    speed_stat: 80,
    special_abilities: ["Illusion Casting", "Shape Shifting", "Frost Giant Power", "Trickster Magic"],
    weapons_available: ["Scepter", "Tesseract Energy", "Daggers", "Mind Control"]
  },
  {
    naam: "Thanos",
    small_image: "/images/characters/thanos-large.png",
    base_attack: 100,
    base_defense: 95,
    speed_stat: 55,
    special_abilities: ["Infinity Gauntlet", "Titan Strength", "Energy Projection", "Reality Control"],
    weapons_available: ["Double-Bladed Sword", "Infinity Stones", "Cosmic Power", "Death Grip"]
  },
  {
    naam: "Vision",
    small_image: "/images/characters/vision-large.png",
    base_attack: 85,
    base_defense: 80,
    speed_stat: 75,
    special_abilities: ["Mind Stone Power", "Density Manipulation", "Phase Through Matter", "Solar Beam"],
    weapons_available: ["Mind Stone Beam", "Vibranium Body", "Flight", "Energy Absorption"]
  }
];

export const battle_locations_list = [
  { naam: "New York City Streets", environment_type: "Urban" },
  { naam: "Asgard Throne Room", environment_type: "Mythical" },
  { naam: "Wakanda Jungle", environment_type: "Nature" },
  { naam: "Stark Tower Rooftop", environment_type: "Urban" },
  { naam: "Sanctum Sanctorum", environment_type: "Mystical" },
  { naam: "Titan Ruins", environment_type: "Alien" },
  { naam: "Sokovia Battle Zone", environment_type: "Destruction" },
  { naam: "Quantum Realm", environment_type: "Microscopic" }
];

export function get_character_by_naam(naam: string) {
  return marvel_characters_list.find(char => char.naam === naam);
}

