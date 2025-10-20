# 🦸 Marvel Battle Arena

An interactive, AI-powered Marvel superhero battle simulator built with React, TypeScript and Groq AI. Watch your favorite Marvel characters clash in epic, dynamically generated comic-book style battles!

![Marvel Battle Arena](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.2-purple)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.1-cyan)

## 🎮 What is This Project?

Marvel Battle Arena is an interactive web application where users can pit their favorite Marvel superheroes against each other in AI-generated battles. The application uses the **Groq AI API** to create dynamic, narrative-driven battle scenes complete with dialogue, health tracking, and stunning visual descriptions.

### Key Highlights

- **AI-Powered Battle Narration**: Uses Groq's LLM to generate unique battle scenarios
- **Interactive Character Selection**: Choose from a roster of iconic Marvel heroes
- **Dynamic Battle Scenes**: Each battle unfolds through multiple AI-generated scenes
- **Visual Battle Progression**: Real-time health bars and animated battle sequences
- **Voting System**: Predict the winner before the battle concludes
- **Customizable Combat**: Select special abilities, weapons, and battle locations

## ✨ Features

### 🎯 Character Selection
- **8 Playable Marvel Characters**: Iron Man, Captain America, Thor, Hulk, Black Widow, Spider-Man, Doctor Strange, and Black Panther
- Each character has unique stats (Attack, Defense, Speed)
- Character-specific special abilities and weapons
- Visual character cards with images

### ⚔️ Battle Customization
- **Choose Special Abilities**: Select signature moves for each character
- **Weapon Selection**: Pick from character-specific arsenal
- **Battle Locations**: Multiple iconic Marvel locations (e.g., New York City, Asgard, Wakanda, Sanctum Sanctorum)
- **Environment Types**: Different environmental conditions affect battles

### 🤖 AI-Generated Battles
- **Dynamic Scene Generation**: Groq AI creates unique battle narratives
- **Comic Book Style**: Battles described with cinematic flair and comic book aesthetics
- **Character Dialogue**: AI-generated banter and battle cries
- **Health Tracking**: Real-time health updates throughout the battle
- **Damage Calculations**: Detailed damage tracking per scene

### 🎨 User Experience
- **Neobrutalism Design**: Bold, modern UI with Tailwind CSS
- **Smooth Animations**: Engaging visual transitions between phases
- **Responsive Layout**: Works on desktop and mobile devices
- **Interactive Icons**: Lucide React icons for enhanced UX
- **Battle Summary**: Comprehensive post-battle statistics

### 🏆 Voting & Results
- **Prediction System**: Vote for your predicted winner before results
- **Win/Loss Tracking**: See if your prediction was correct
- **Battle Summary**: Total damage, battle duration, most powerful attacks
- **Replay Option**: Reset and start a new battle

### AI Integration
- **Groq SDK 0.33.0** - Fast AI inference API
- Custom battle scene generation system
- Structured JSON response parsing

## 📦 Project Structure

```
marvel-battle-arena/
├── public/
│   └── images/
│       └── characters/          # Character images
├── src/
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   ├── MarvelBattleGame.tsx     # Core game component
│   ├── marvel_data.ts           # Character & location data
│   ├── groq_battle_api.ts       # Groq AI integration
│   ├── battle_api.ts            # Battle simulation logic
│   └── index.css                # Global styles
├── index.html                   # HTML entry point
├── package.json                 # Dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript config
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Groq API Key ([Get it here](https://console.groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rituraj_ko_placement_chahiye
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Groq API Key**
   - Create a `.env` file in the root directory
   - Add your Groq API key:
     ```
     VITE_GROQ_API_KEY=your_groq_api_key_here
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎮 How to Play

1. **Select Characters**: Click on two different Marvel characters to battle
2. **Start Battle Setup**: Click "Start Battle" to proceed
3. **Customize Battle**:
   - Choose special abilities for each character
   - Select weapons
   - Pick a battle location
4. **Vote for Winner**: Predict who will win before the battle
5. **Watch the Battle**: AI generates and displays battle scenes
6. **See Results**: View the winner and battle statistics
7. **Play Again**: Reset and try different matchups!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new Marvel characters
- Improve battle AI logic
- Enhance UI/UX design
- Add new battle locations
- Optimize performance

## 📝 License

This project is for educational and entertainment purposes. Marvel characters are property of Marvel Entertainment, LLC.

## 🙏 Acknowledgments

- Marvel Comics for the amazing characters
- Groq for the powerful AI API
- The React and TypeScript communities
- Tailwind CSS team for the excellent framework

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ⚡ by a Marvel fan for Marvel fans ~ SATYA**
