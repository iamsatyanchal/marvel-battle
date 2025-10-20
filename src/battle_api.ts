import { get_character_by_naam } from "./marvel_data";
import { generate_battle_with_groq, GroqBattleResponse, GroqBattleScene } from "./groq_battle_api";


   export interface BattleConfig_Interface {
  character_1_naam: string;
  character_2_naam: string;
  location_naam: string;

  environment_type: string;
  char1_selected_power: string;
  char2_selected_power: string;
  char1_selected_weapon: string;

  char2_selected_weapon: string;
}


export interface BattleResult_Interface {
  winner_naam: string;
  char1_final_health: number;
  char2_final_health: number;
  char1_dialogues: string[];
  char2_dialogues: string[];
  battle_events: Array<{
     turn_number: number;
    attacker: string;
    defender: string;
      damage_dealt: number;
    event_description: string;
  }>;
  total_turns: number;
    battle_scenes_data?: GroqBattleScene[];
  groq_response?: GroqBattleResponse;
}

export async function simulate_battle_with_ai(
  config: BattleConfig_Interface
): Promise<BattleResult_Interface> {
        try {
          
        const groq_response = await generate_battle_with_groq(
    config.character_1_naam,
      config.char1_selected_power,
      config.char1_selected_weapon,
    config.character_2_naam,
    config.char2_selected_power,
      config.char2_selected_weapon,
    config.location_naam,
      config.environment_type
    );

    console.log("okaay generate hogya:", groq_response);

      const winner_naam = groq_response.winner;
    const battle_scenes = groq_response.battle_scenes;
    
    const last_scene = battle_scenes[battle_scenes.length - 1];

     const char1_final_health = last_scene.char1_health_after;
    const char2_final_health = last_scene.char2_health_after;

    const battle_events_array = battle_scenes.map((scene) => ({
      turn_number: scene.scene_number,
       attacker: scene.who_attacked || "Both",

      defender: scene.who_attacked === config.character_1_naam ? config.character_2_naam : config.character_1_naam,

      damage_dealt: scene.damage_dealt || 0,

      event_description: scene.scene_description,
    }));

    
    
    const char1_dialogues = battle_scenes.map(scene => scene.char1_dialogue);
    const char2_dialogues = battle_scenes.map(scene => scene.char2_dialogue);

    return {
      winner_naam,

      char1_final_health: Math.max(0, char1_final_health),

      char2_final_health: Math.max(0, char2_final_health),

      char1_dialogues, char2_dialogues,
      battle_events: battle_events_array,

      total_turns: battle_scenes.length,

      battle_scenes_data: battle_scenes,
          groq_response: groq_response,

    };
  } catch (error) {
    console.error("Error hogya:", error);
    return simulate_battle_fallback(config);
  }
}

  function simulate_battle_fallback(
  config: BattleConfig_Interface ): BattleResult_Interface {

  const char1_data = get_character_by_naam(config.character_1_naam)

  const char2_data = get_character_by_naam(config.character_2_naam);

  if (!char1_data || !char2_data) {
    
    
    throw new Error("Character me error hogya bhaii..");

  }

  
  let char1_current_health = 100;

  let char2_current_health = 100;

  const char1_attack_power = char1_data.base_attack + Math.floor(Math.random() * 20);

  const char2_attack_power = char2_data.base_attack + Math.floor(Math.random() * 20);

  const battle_events_array = [];
  let turn_counter = 0;

  let current_attacker = Math.random() > 0.5 ? 1 : 2;

  while ( char1_current_health > 0 && char2_current_health > 0 && turn_counter < 20 ) {

    turn_counter++;

    if (current_attacker === 1) {
      const damage_amount = Math.max( 5, char1_attack_power - char2_data.base_defense + Math.floor(Math.random() * 15));


      char2_current_health -= damage_amount;

      battle_events_array.push({
        turn_number: turn_counter,

        attacker: config.character_1_naam,

        defender: config.character_2_naam,
        damage_dealt: damage_amount,

        event_description: `${config.character_1_naam} attacks with ${config.char1_selected_power} dealing ${damage_amount} damage..`,
      });

      current_attacker = 2;

    } 
    
    else {
      const damage_amount = Math.max( 5, char2_attack_power - char1_data.base_defense + Math.floor(Math.random() * 15));

      char1_current_health -= damage_amount;

      battle_events_array.push({
        turn_number: turn_counter,
        
        attacker: config.character_2_naam,


        defender: config.character_1_naam,
        damage_dealt: damage_amount,

        event_description: `${config.character_2_naam} attacks with ${config.char2_selected_power} dealing ${damage_amount} damage..`,
      });

      current_attacker = 1;
    }
  }



  let winner_naam = char1_current_health > char2_current_health ? config.character_1_naam : config.character_2_naam;

  const char1_dialogues = ["Ready to fight!", "Here I come!", "Take this!", "Not bad...", "Final move!", "Victory!"];

  const char2_dialogues = ["Bring it on!", "Is that all?", "My turn!", "You'll regret this!", "Time to end this!", "Game over!"];

  return {
    winner_naam,

    char1_final_health: Math.max(0, char1_current_health),
    char2_final_health: Math.max(0, char2_current_health),

    char1_dialogues, char2_dialogues,
    
    battle_events: battle_events_array,
    total_turns: turn_counter,
  };
}
