# Marvel Battle Game - Groq AI Integration Setup

## Latest Updates

### Groq API Integration Complete! 🎉

The game now uses Groq AI to generate dynamic battle scenes with:
- **AI-Generated Battle Narratives**: Each battle is unique with custom scenes, dialogues, and outcomes
- **Dynamic Scene Titles**: Scene titles adjust their size based on content
- **Character Dialogues**: Each character speaks with their own dialogue bubbles (red for Character 1, blue for Character 2)
- **Real-time Health Updates**: Health bars update dynamically after each scene
- **Extended Scene Duration**: Each scene displays for 15-18 seconds (randomly varied)
- **Pollinations AI Image Generation**: Each scene prompt generates a unique comic-style image

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Groq API Key
1. Visit [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign up or log in
3. Create a new API key
4. Copy your API key

### 3. Configure Environment Variables
1. Open the `.env` file in the root directory
2. Replace `your_groq_api_key_here` with your actual Groq API key:
```
VITE_GROQ_API_KEY=gsk_your_actual_api_key_here
```

### 4. Run the Application
```bash
npm run dev
```

## How It Works

### Battle Flow
1. **Character Selection**: Choose 2 Marvel characters
2. **Battle Setup**: Select location, powers, and weapons
3. **Voting Phase**: Predict who will win
4. **Battle Animation**: Watch AI-generated battle scenes with:
   - Dynamic scene titles at the top
   - Character dialogues at the bottom (Character 1: left, Character 2: right)
   - Real-time health bars showing damage
   - 15-18 second display per scene
5. **Results**: See if your prediction was correct!

### Groq API Features
- **Model**: `qwen/qwen3-32b`
- **Temperature**: 0.6 (balanced creativity)
- **Max Tokens**: 4096
- **Response Format**: JSON with structured battle scenes

### Scene Data Structure
Each scene includes:
- Scene number and type
- Dynamic scene title
- Detailed description
- Character health updates
- Character dialogues
- AI image generation prompt
- Damage dealt and attacker info

## Technologies Used
- **React + TypeScript**: Frontend framework
- **Groq SDK**: AI battle generation
- **Pollinations AI**: Image generation
- **Tailwind CSS**: Styling
- **Vite**: Build tool

## Troubleshooting

### API Key Issues
- Make sure your `.env` file has `VITE_GROQ_API_KEY` (with `VITE_` prefix)
- Restart the dev server after updating `.env`

### Battle Generation Fails
- Check console for Groq API errors
- Verify API key is valid
- System falls back to old simulation if Groq fails

### Images Not Loading
- Pollinations API generates images on-the-fly, may take a few seconds
- Check your internet connection

## Features

✅ Groq AI battle scene generation  
✅ Dynamic scene titles with auto-sizing  
✅ Character-specific dialogue bubbles  
✅ Real-time health bar animations  
✅ 15-18 second scene display (randomized)  
✅ Pollinations AI image generation  
✅ Fallback to local simulation if API fails  
✅ Comic book style UI  

Enjoy the epic AI-generated battles! 🎮⚡
