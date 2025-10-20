import { Groq } from 'groq-sdk';

  export interface GroqBattleScene {
  scene_number: number;
  scene_type: string;
    scene_title: string;
    scene_description: string;
  char1_health_after: number;

    char2_health_after: number;
  char1_dialogue: string;
    char2_dialogue: string;
      image_prompt: string;

  damage_dealt?: number;
  who_attacked?: string;
}

export interface GroqBattleResponse {

  character_1: {
    name: string;
    initial_health: number;
  };

  character_2: {
    name: string;
    initial_health: number;
  };

  winner: string;
  total_scenes: number;
  battle_scenes: GroqBattleScene[];

  battle_summary?: {
    total_damage_char1: number;
    total_damage_char2: number;
    battle_duration_seconds: number;

        most_powerful_attack: {

          scene_number: number;
          
          attacker: string;
      damage: number;
      attack_name: string;
    };
  };
}

const GROQ_SYSTEM_PROMPT = `
SYSTEM INSTRUCTION:

You are an AI comic battle scene generator. Your task is to create an **epic comic book style visual narrative** of a battle between two characters based on user input. Generate highly detailed image prompts and associated dialogue for each battle scene. Follow the instructions below:

INPUT FROM USER:
- Character 1 Name
- Character 1 Powers/Weapons
- Character 2 Name
- Character 2 Powers/Weapons
- Battle Location / Environment

OUTPUT REQUIREMENTS:
1. Decide the number of battle scenes dynamically based on the intensity and progression of the fight.
2. For each scene, provide:
   - Scene Number
   - Scene Type (e.g., opening stance, first attack, counter attack, mid-battle clash, ultimate move, victory pose, etc.)
   - Scene Title (short, dramatic)
   - Scene Description (what is happening, atmosphere, and visual cues)
   - Character 1 Health Before and After Scene
   - Character 2 Health Before and After Scene
   - Character 1 Dialogue
   - Character 2 Dialogue
   - Image Prompt (detailed, comic-book style, including action, perspective, lighting, motion lines, energy effects, environmental details, and comic-onomatopoeia if applicable)
   - Damage Dealt in the Scene
   - Who Attacked (Character 1 / Character 2 / Both / None)

3. Provide a **battle summary** including:
   - Total damage dealt by Character 1
   - Total damage dealt by Character 2
   - Total duration of the battle (in seconds)
   - Most powerful attack with scene number, attacker, damage, and attack name

4. Style Notes for Image Prompts:
   - Comic book style, bold outlines, exaggerated expressions
   - Dynamic poses, action lines, motion blur for attacks
   - Vibrant color gradients, dramatic lighting, high contrast
   - Include sound effects in panels (like "CRASH!", "BOOM!", "THOOM!")
   - Emphasize powers and weapons visually (glowing hammers, energy blasts, lightning, fire, etc.)
   - Environment should reflect battle intensity (cracked ground, flying debris, energy waves, stormy sky, destroyed locations)
   - Characters should have readable expressions matching the intensity of the scene
   - Use cinematic angles for dramatic effect (low-angle shots, close-ups, perspective showing scale)

5. Formatting Notes:
   - Use English variable names consistently:
     - character_1, character_2
     - initial_health (always 100 for both players), final_health
     - winner_name
     - total_scenes
     - battle_scenes
     - scene_number, scene_type, scene_title, scene_description
     - char1_health_before, char1_health_after
     - char2_health_before, char2_health_after
     - char1_dialogue, char2_dialogue
     - image_prompt
     - damage_dealt, who_attacked
     - battle_summary

6. Each scene must **feel sequentially connected**, showing progression from opening stance to final clash and victory pose. Include dialogues reflecting each character's personality, attitude, and power.

INSTRUCTION TO AI:
- Generate the battle scenes JSON dynamically based on the inputs provided.
- Each scene should have a **unique, creative image prompt** suitable for AI image generation.
- Output the final result in **JSON format** following the structure above, including battle_summary.

final json like :
{
  "character_1": {
    "name": "Iron Man",
    "initial_health": 100,//(always 100 for both players)
  },
  "character_2": {
    "name": "Thor",
    "initial_health": 100,//(always 100 for both players)
  },
  "winner": "Iron Man",
  "total_scenes": 12,
  "battle_scenes": [
{
  "scene_number": 1,
  "scene_type": "opening_stance",
  "scene_title": "Battle Begins",
  "scene_description": "Both warriors stand in a dramatic battle stance, tension building up.",
  "char1_health_after": 100,
  "char2_health_after": 120,
  "char1_dialogue": "Prepare yourself! Today I test your strength!",
  "char2_dialogue": "You'll regret challenging me!",
  "image_prompt": "Epic comic book style illustration, Character 1 and Character 2 facing each other, dramatic lighting, bold action pose, intense expressions, comic book lines and color",
}...]
}`;


    
    export async function generate_battle_with_groq(

  character1_name: string,

  character1_power: string,
  character1_weapon: string,
  character2_name: string,
  character2_power: string,
  character2_weapon: string,
  location: string,
  environment: string ): Promise<GroqBattleResponse> {


  const groq = new Groq({apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true});

const user_prompt = `
Location: ${location} (${environment})
---------------------------
# ${character1_name} - Powers & Weapons
Special Power: ${character1_power}
Weapon: ${character1_weapon}
---------------------------
# ${character2_name} - Powers & Weapons
Special Power: ${character2_power}
Weapon: ${character2_weapon}
`;

try {
     
    const chatCompletion = await groq.chat.completions.create({
          messages: [
        {
          role: "system",
          content: GROQ_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: user_prompt
        }
      ],
      model: "qwen/qwen3-32b",
      temperature: 0.6,
      max_completion_tokens: 4096,
      top_p: 0.95,
      stream: false,
      response_format: {
        type: "json_object"
      }
  });

    const response_content = chatCompletion.choices[0].message.content;
    
    if (!response_content) {
      throw new Error("No response.. maybe kuch error hoga");
    }

const battle_data: GroqBattleResponse = JSON.parse(response_content);
    
  console.log("response: ", battle_data);
    
return battle_data;

  } catch (error) {
    console.error("error hogya.:", error);
    throw error;
  }
}
