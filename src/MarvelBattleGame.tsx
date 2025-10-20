import { useState, useEffect } from "react";
import { Swords, Zap, Trophy, RotateCcw } from "lucide-react";


import {
  marvel_characters_list, battle_locations_list,
      get_character_by_naam,
} from "./marvel_data";


import { simulate_battle_with_ai, BattleConfig_Interface, BattleResult_Interface } from "./battle_api";

import { GroqBattleScene } from "./groq_battle_api";

type GamePhase_Type =
  | "character_selection"
  | "battle_setup"
  | "battle_animation"
  | "voting"
  | "results";

interface BattleSceneWithImage extends GroqBattleScene { image_url: string;}


  export default function MarvelBattleGame() {

  const [current_game_phase, set_current_game_phase] = useState<GamePhase_Type>("character_selection");
  const [selected_char1, set_selected_char1] = useState<string | null>(null);

  const [selected_char2, set_selected_char2] = useState<string | null>(null);
  const [selected_location, set_selected_location] = useState<string>("");

  const [selected_environment, set_selected_environment] = useState<string>("");
  const [char1_power_selected, set_char1_power_selected] = useState<string>("");
  const [char2_power_selected, set_char2_power_selected] = useState<string>("");

  const [char1_weapon_selected, set_char1_weapon_selected] = useState<string>("");
  
      const [char2_weapon_selected, set_char2_weapon_selected] =  useState<string>("");
  
    const [battle_result_data, set_battle_result_data] = useState<BattleResult_Interface | null>(null);
  const [current_dialogue_idx, set_current_dialogue_idx] = useState<number>(0);

  const [user_vote_choice, set_user_vote_choice] = useState<string>("");
  const [vote_was_correct, set_vote_was_correct] = useState<boolean>(false);

  const [is_loading_battle, set_is_loading_battle] = useState<boolean>(false);
  const [battle_scenes, set_battle_scenes] = useState<BattleSceneWithImage[]>([ ]);

  const [current_scene_loading, set_current_scene_loading] = useState<boolean>(true);
  const [char1_current_health, set_char1_current_health] = useState<number>(100);

  const [char2_current_health, set_char2_current_health] = useState<number>(100);
  const [preloaded_images, set_preloaded_images] = useState<Set<number>>(new Set());

 const handle_character_click = (char_naam: string) => {

    if (!selected_char1) {
        set_selected_char1(char_naam);
    } 
    else if (!selected_char2 && char_naam !== selected_char1) {
      set_selected_char2(char_naam);
    } 
    else if (char_naam === selected_char1) {
      set_selected_char1(null);
    } 
    
  else if (char_naam === selected_char2) {
      set_selected_char2(null);
    }
  };

  
  
const start_battle_setup = () => {
    if (selected_char1 && selected_char2) {

      set_current_game_phase("battle_setup");
      const char1_data = get_character_by_naam(selected_char1);

      const char2_data = get_character_by_naam(selected_char2);
      if (char1_data && char2_data){

        set_char1_power_selected(char1_data.special_abilities[0]);
        set_char2_power_selected(char2_data.special_abilities[0]);
    set_char1_weapon_selected(char1_data.weapons_available[0]);

        set_char2_weapon_selected(char2_data.weapons_available[0]);
      }

      set_selected_location(battle_locations_list[0].naam);
    set_selected_environment(battle_locations_list[0].environment_type);
    }
};

  
  
const start_voting_phase = async () => {
    if (!selected_char1 || !selected_char2 || !selected_location) return;
    set_is_loading_battle(true);
    const battle_config: BattleConfig_Interface = {

      character_1_naam: selected_char1,
      character_2_naam: selected_char2,
      location_naam: selected_location, 
      environment_type: selected_environment, 

      char1_selected_power: char1_power_selected,  
      char2_selected_power: char2_power_selected, 
      char1_selected_weapon: char1_weapon_selected,
      
      char2_selected_weapon: char2_weapon_selected,
  };
    const result = await simulate_battle_with_ai(battle_config);

    set_battle_result_data(result);
    
    set_is_loading_battle(false);
    
    set_current_game_phase("voting");

  };

  const start_battle_animation = async () => {


    if (!user_vote_choice || !battle_result_data || !selected_char1 || !selected_char2) return;
    
    if (battle_result_data.battle_scenes_data && battle_result_data.battle_scenes_data.length > 0){

      const groq_scenes = battle_result_data.battle_scenes_data;
      
      set_char1_current_health(battle_result_data.groq_response?.character_1.initial_health || 100);

  set_char2_current_health(battle_result_data.groq_response?.character_2.initial_health || 100);
      
  const scenes_with_images: BattleSceneWithImage[] = await Promise.all(
    groq_scenes.map(async (scene) => {
      const encoded_prompt = encodeURIComponent(scene.image_prompt);
        const image_url = `https://image.pollinations.ai/prompt/${encoded_prompt}?width=1220&height=720&seed=701847532&enhance=true&nologo=true&model=flux`;
          
          return {

            ...scene,
            image_url: image_url
          };
   })
     
  
  );
      
  set_battle_scenes(scenes_with_images);
    
} 
    
    else {
      const simple_scenes: BattleSceneWithImage[] = [

        {
          scene_number: 1,
          scene_type: "opening_stance",
          scene_title: "BATTLE BEGINS",
          scene_description: `${selected_char1} and ${selected_char2} face off in an epic battle!`,
          char1_health_after: 100,
          char2_health_after: 100,
          char1_dialogue: "Let's do this!",
          char2_dialogue: "Bring it on!",
          image_prompt: `Epic comic book style, ${selected_char1} and ${selected_char2} facing each other in battle stance`,
          image_url: `https://image.pollinations.ai/prompt/${encodeURIComponent(`Epic comic book style, ${selected_char1} and ${selected_char2} facing each other in battle stance`)}?width=1220&height=720&seed=701847532&enhance=true&nologo=true&model=flux`
        },
        {
          scene_number: 2,
          scene_type: "final_clash",
          scene_title: "FINAL CLASH",
          scene_description: `${battle_result_data.winner_naam} emerges victorious!`,
          char1_health_after: battle_result_data.char1_final_health,
          char2_health_after: battle_result_data.char2_final_health,
          char1_dialogue: battle_result_data.winner_naam === selected_char1 ? "Victory!" : "I tried my best...",
          char2_dialogue: battle_result_data.winner_naam === selected_char2 ? "Victory!" : "I tried my best...",
          image_prompt: `${battle_result_data.winner_naam} victorious in comic book style`,
          image_url: `https://image.pollinations.ai/prompt/${encodeURIComponent(`${battle_result_data.winner_naam} victorious in comic book style`)}?width=1220&height=720&seed=701847532&enhance=true&nologo=true&model=flux`
        }

  ];
      
  set_battle_scenes(simple_scenes);
    

}
    
    set_current_game_phase("battle_animation");
    set_current_dialogue_idx(0);
    set_current_scene_loading(true);
};

  const preload_next_image = (next_idx: number) => {

    if (next_idx < battle_scenes.length && !preloaded_images.has(next_idx)){
      const img = new Image(); 
      img.src = battle_scenes[next_idx].image_url; 
    img.onload = () => {

        set_preloaded_images(prev => new Set(prev).add(next_idx));
        console.log(`preload img hai ${next_idx + 1}`);
      };

      img.onerror = () => {

    console.log(`fail hua preload:.. ${next_idx + 1}`);
      };
    }
  };

  const handle_image_loaded = () => {

    set_current_scene_loading(false);
    
 if (battle_scenes[current_dialogue_idx]) {

      const current_scene = battle_scenes[current_dialogue_idx];  
      set_char1_current_health(current_scene.char1_health_after); 
      
      set_char2_current_health(current_scene.char2_health_after);
  }
    
    const next_idx = current_dialogue_idx + 1;
    
    if (next_idx < battle_scenes.length) {

    preload_next_image(next_idx);
    
    }
  };

  const go_to_next_scene = () => {

    if (current_dialogue_idx < battle_scenes.length - 1) {
      const next_idx = current_dialogue_idx + 1;
      set_current_dialogue_idx(next_idx);

      set_current_scene_loading(!preloaded_images.has(next_idx));
      
  if (next_idx + 1 < battle_scenes.length) {
        preload_next_image(next_idx + 1);

      }
    }
  };

  const go_to_previous_scene = () => {
    
    
  if (current_dialogue_idx > 0) {
      const prev_idx = current_dialogue_idx - 1;
      set_current_dialogue_idx(prev_idx);
      set_current_scene_loading(false);
    }
  };
   




  const end_battle_now = () => {
    
     show_final_results();
  };

  useEffect(() => {
  
  
    return () => {
      set_current_scene_loading(true);

    }; }, [current_dialogue_idx]);  

  useEffect(() => {
    if (battle_scenes.length > 0 && current_game_phase === "battle_animation") {
      if (!preloaded_images.has(0)) {
        preload_next_image(0);
      }
      if (battle_scenes.length > 1 && !preloaded_images.has(1)) {
        setTimeout(() => preload_next_image(1), 500);
      }
    }
  }, 
[battle_scenes, current_game_phase]);

 const show_final_results = () => {

    set_current_game_phase("results");
    if (!battle_result_data) return;

    const sahi_jawaab = user_vote_choice === battle_result_data.winner_naam;


    set_vote_was_correct(sahi_jawaab);
  };

  const reset_full_game = () => {

    set_current_game_phase("character_selection");
    set_selected_char1(null);
    set_selected_char2(null);
    set_selected_location("");
  set_selected_environment("");
  
   set_char1_power_selected("");
      set_char2_power_selected("");
   set_char1_weapon_selected("");
    set_char2_weapon_selected("");
  
  set_battle_result_data(null);
    set_current_dialogue_idx(0);
set_user_vote_choice("");
    set_vote_was_correct(false);
    set_battle_scenes([]);
   
   
    set_current_scene_loading(true);

    set_char1_current_health(100);
    set_char2_current_health(100);
  
    set_preloaded_images(new Set());
  };

const char1_data_obj = selected_char1 ? get_character_by_naam(selected_char1) : null;

const char2_data_obj = selected_char2 ? get_character_by_naam(selected_char2) : null;

  return (
    <div className="min-h-screen bg-yellow-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

    
  <div className="bg-red-600 border-8 border-black p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
          
        <h1 className="text-5xl md:text-7xl font-black text-white text-center uppercase tracking-tight">
            
    Marvel Battle Arena
          </h1>
          
          
    <p className="text-center text-xl font-bold text-yellow-300 mt-2">
            Choose Your Fighter & Destroy Your Enemy!
          </p>
           </div>

        {current_game_phase === "character_selection" && (

          <div className="space-y-8">
   {(selected_char1 || selected_char2) && (
              <div className="bg-white border-8 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-center gap-8">
                
                
          {selected_char1 && (
                    <div className="text-center">
   <div className="w-32 h-32 flex items-center justify-center mb-2">
                        <img src={char1_data_obj?.small_image} 
                          className="max-h-full max-w-full object-contain"
                        />
   </div>   
                      <div className="text-2xl font-black">
                       
                       
                        {selected_char1}
                     
         </div>
                    </div>
                  )}
   {selected_char1 && selected_char2 && (
                  
                  
                  <div className="text-6xl font-black text-red-600">VS</div>
                 
                 
    )}
                
                
    {selected_char2 && (
                  
                  
      <div className="text-center">
                      <div className="w-32 h-32 flex items-center justify-center mb-2">
      <img src={char2_data_obj?.small_image} 
                          className="max-h-full max-w-full object-contain"
      />
                      </div>
      <div className="text-2xl font-black">
                        {selected_char2}
                      </div>
                   
                   
         </div>
                  )}
       
    </div>
              </div>
            )}

            <div className="bg-blue-500 border-8 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-black mb-6 text-white uppercase">
                
                
      Select 2 Characters
            </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                
                
      {marvel_characters_list.map((char) => {
          
      const is_selected = selected_char1 === char.naam || selected_char2 === char.naam;
                  
    return (
                    <div
                      key={char.naam}
                      onClick={() => handle_character_click(char.naam)}
                      className={`
bg-white border-6 border-black p-4 cursor-pointer
transform transition-all hover:scale-105
${
  is_selected
    ? "bg-yellow-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
}

`}>
        <div className="w-full h-32 flex items-center justify-center mb-2">
                        <img 
                          src={char.small_image} 
              className="max-h-full max-w-full object-contain"
                        />
      
      </div>
                      <div className="text-center font-black text-lg">
                        
                        
                        {char.naam}
                      </div>
                      
        <div className="text-center text-xs font-bold mt-1">
                        ATK: {char.base_attack} | DEF: {char.base_defense}
                      </div>
      </div>
                  );
                })}
              </div>
            </div>

           
           
 {selected_char1 && selected_char2 && (
              <button
                onClick={start_battle_setup}
                className="w-full bg-green-500 border-8 border-black p-6 text-3xl font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-4"
>
     <Swords size={40} />
                Setup Battle Configuration
     </button>
            )}
          </div>
        )}

  {current_game_phase === "battle_setup" && (
          <div className="space-y-6">
            <div className="bg-white border-8 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-3xl font-black mb-6 uppercase">
             
             
                Battle Location & Environment
             
              </h2>
    <div className="space-y-4">
                <div>
                  <label className="block font-black text-xl mb-2">
                 
                 
       Choose Location:
           
           
         </label>
                  <select
                    value={selected_location} onChange={(e) => {
                      set_selected_location(e.target.value);
                      const loc = battle_locations_list.find((l) => l.naam === e.target.value);
                      
                      if (loc) set_selected_environment(loc.environment_type);}}

                    className="w-full border-4 border-black p-3 text-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >{battle_locations_list.map((loc) => (
        
      <option key={loc.naam} value={loc.naam}>
                        
                        
        {loc.naam} ({loc.environment_type})
                      </option>
                    
                    
        )
    )
}
                  </select>
                </div>
 </div>
            </div>

      <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-400 border-8 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-black mb-4 text-white">
                
                
    {selected_char1} - Powers & Weapons
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-black mb-2">
      Special Power:
                    </label>
                    <select value={char1_power_selected} onChange={(e) => set_char1_power_selected(e.target.value)}
                      className="w-full border-4 border-black p-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        
    {char1_data_obj?.special_abilities.map((ability) => (
                       
  <option key={ability} value={ability}>  
      {ability}
 </option>
    )
)

}
</select>
</div>
  
   <div>
      <label className="block font-black mb-2">
        
        Weapon:
    </label>
      <select value={char1_weapon_selected}
        onChange={(e) =>
        set_char1_weapon_selected(e.target.value)}
        className="w-full border-4 border-black p-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
         {char1_data_obj?.weapons_available.map((weapon) => (
    <option key={weapon} value={weapon}>
 {weapon}
     </option>
      
    )
)
}
                    </select>
       </div>
  </div>
   </div>

   <div className="bg-blue-400 border-8 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
               
       <h3 className="text-2xl font-black mb-4 text-white">
                 
     {selected_char2} - Powers & Weapons
               
 </h3>
      <div className="space-y-4">
                  <div>
        <label className="block font-black mb-2">
                     
         Special Power:
                   
     </label>
          <select value={char2_power_selected} onChange={(e) => set_char2_power_selected(e.target.value)}
                      className="w-full border-4 border-black p-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           {char2_data_obj?.special_abilities.map((ability) => (
        
             <option key={ability} value={ability}>
               {ability}
            
           </option>
     )
  )
}
    </select>
        </div>
  <div>
        <label className="block font-black mb-2">
      Weapon:
  </label>
       <select value={char2_weapon_selected}  onChange={(e) =>
             
        set_char2_weapon_selected(e.target.value)} className="w-full border-4 border-black p-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           
     {char2_data_obj?.weapons_available.map((weapon) => (
  
         <option key={weapon} value={weapon}>
            
         {weapon}
          
     </option>
    )
  )
}
     </select>
    </div>
   </div>
  
 </div>
    </div>

    <button onClick={start_voting_phase}
              disabled={is_loading_battle}
              className="w-full bg-purple-500 border-8 border-black p-6 text-3xl font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-4 disabled:opacity-50" >
    <Zap size={40} />
    {is_loading_battle ? "Simulating Battle..." : "Start Battle & Vote"}
      
    </button>
  </div>
  )}

 {current_game_phase === "voting" && battle_result_data && (

<div className="space-y-6">
           
     <div className="bg-orange-500 border-8 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-4xl font-black mb-6 text-white text-center uppercase">
               
     Guess..Who Will Win?


   </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <button onClick={() => set_user_vote_choice(selected_char1 || "")}
          className={`
border-8 border-black p-8 text-2xl font-black uppercase 
shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
transition-all ${user_vote_choice === selected_char1 ? "bg-green-400" : "bg-white"}`}>
      
   <div className="w-full h-48 flex items-center justify-center mb-4">
         <img src={char1_data_obj?.small_image} 
                      className="max-h-full max-w-full object-contain"
                    /></div>
                  {selected_char1}
      
    </button>
              
      <button
                  onClick={() => set_user_vote_choice(selected_char2 || "")}
    className={`
border-8 border-black p-8 text-2xl font-black uppercase
shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
transition-all ${user_vote_choice === selected_char2 ? "bg-green-400" : "bg-white"}`}>
      
    <div className="w-full h-48 flex items-center justify-center mb-4">
         <img src={char2_data_obj?.small_image} 
                  className="max-h-full max-w-full object-contain"
                    /></div>
                  {selected_char2}
      
    </button>
      
  </div>
  
</div>

  {user_vote_choice && (
  <button onClick={start_battle_animation}
                className="w-full bg-red-600 border-8 border-black p-6 text-3xl font-black uppercase text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
               
                Watch The Battle!
  
  </button>
    )
  }
  </div>
)}

{current_game_phase === "battle_animation" && battle_result_data && battle_scenes.length > 0 && (
          <div className="fixed inset-0 z-50 bg-black overflow-hidden">
     <div className="absolute inset-0 flex items-center justify-center">
            
            
      {battle_scenes[current_dialogue_idx] && (
  <div key={`scene-${current_dialogue_idx}`}
                  className="absolute inset-0">
     {current_scene_loading && (
             <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                      <div className="bg-yellow-300 border-8 border-black p-8 rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-3xl font-black uppercase animate-pulse">
            Loading Scene...
    </p>
                      </div>
                    </div>
   )}

     <img src={battle_scenes[current_dialogue_idx].image_url}
 className={`w-full h-full object-cover transition-opacity duration-500 ${current_scene_loading ? 'opacity-0' : 'opacity-100'}`} onLoad={handle_image_loaded}
        onError={() => {
      console.error('Image load error');  handle_image_loaded();
     }}
   
  />
                  
    {!current_scene_loading && (
                    <>
     {battle_scenes[current_dialogue_idx].char1_dialogue && (
            <div className="absolute bottom-32 left-8 max-w-md animate-fade-in">
                          <div className="relative">
           <div className="bg-red-600 border-4 border-black px-3 py-1 inline-block mb-2 rounded-t-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
           <p className="font-black text-white text-xs uppercase">
        {selected_char1}
    </p>
       </div>
        
      <div className="bg-white border-4 border-black rounded-2xl rounded-tl-none px-5 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
       <p className="text-black text-base font-bold leading-snug">
                            
        {battle_scenes[current_dialogue_idx].char1_dialogue}
           
     </p>
          
   </div>
     </div>
          </div>
)}

  {battle_scenes[current_dialogue_idx].char2_dialogue && (
 <div className="absolute bottom-32 right-8 max-w-md animate-fade-in">
         <div className="relative">
          <div className="bg-blue-600 border-4 border-black px-3 py-1 inline-block mb-2 rounded-t-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ml-auto">
               
        <p className="font-black text-white text-xs uppercase">
      {selected_char2}
    </p>
            </div>
           
 <div className="bg-white border-4 border-black rounded-2xl rounded-tl-none px-5 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative">
              
          <p className="text-black text-base font-bold leading-snug">

{battle_scenes[current_dialogue_idx].char2_dialogue}

   </p>
         </div>
     </div>
       </div>
   )}

    <div className="absolute bottom-6 left-0 right-0 flex justify-center px-8 animate-fade-in">
      <p className="text-sm md:text-base font-bold text-white text-center leading-relaxed max-w-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-black bg-opacity-50 px-6 py-2 rounded">

 {battle_scenes[current_dialogue_idx].scene_description}
  </p>

</div>
    </>
  )}
    </div>
  )}
  </div>
            
   <div className="absolute top-8 left-8 z-10">
              <div className="bg-red-500 border-6 border-black px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
    
     <p className="font-black text-white text-xl">
    {selected_char1}: {char1_current_health} HP
    </p>
    
      <div className="w-48 h-4 bg-gray-800 border-2 border-black mt-2">
     <div className="h-full bg-green-400 transition-all duration-1000"
      style={{ 
        width: `${Math.max(0, char1_current_health)}%` 
    }}>
    </div>
  </div>
  </div>
   </div>

  <div className="absolute top-8 right-8 z-10">
    <div className="bg-blue-500 border-6 border-black px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black text-white text-xl">
    {selected_char2}: {char2_current_health} HP
    </p>
    
      <div className="w-48 h-4 bg-gray-800 border-2 border-black mt-2">
     <div className="h-full bg-green-400 transition-all duration-1000"
      style={{ 
        width: `${Math.max(0, char2_current_health)}%` 
    }}>
    </div>
                </div>
              </div>
            </div>

   <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-10">
     <button onClick={go_to_previous_scene}
      
  disabled={current_dialogue_idx === 0}
                className={`bg-yellow-300 border-6 border-black px-4 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  current_dialogue_idx === 0 ? 'opacity-40 cursor-not-allowed' : ''
   }`} >
    
     <span className="text-2xl font-black">←</span>
      
  </button>
  <div className="bg-yellow-300 border-6 border-black px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black text-black text-xl whitespace-nowrap">
                  Scene {current_dialogue_idx + 1} / {battle_scenes.length}
                </p>
              </div>

   {current_dialogue_idx < battle_scenes.length - 1 ? (
       <button onClick={go_to_next_scene}
                  disabled={!preloaded_images.has(current_dialogue_idx + 1)}
                  className={`bg-yellow-300 border-6 border-black px-4 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
       preloaded_images.has(current_dialogue_idx + 1)
                      ? 'hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'}`}>
  {!preloaded_images.has(current_dialogue_idx + 1) ? ( <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
                  
                ) : (
          
<span className="text-2xl font-black">→</span>
 )}
</button>
) : (

<button onClick={end_battle_now}
                  
className="bg-red-500 border-6 border-black px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">
     <span className="text-lg font-black text-white uppercase">
    End</span>
   
   </button>
  )}
            </div>
          </div> )}

    {current_game_phase === "results" && battle_result_data && (
    
    <div className="space-y-6">
            <div
              className={`border-8 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
                vote_was_correct ? "bg-green-400" : "bg-red-400" }`}>
   <h2 className="text-5xl font-black mb-4 text-white text-center uppercase flex items-center justify-center gap-4">
                <Trophy size={50} />
                Battle Results!
  </h2>
              <div className="text-center">
                <p className="text-3xl font-black mb-2">
                  
                  Winner: {battle_result_data.winner_naam}
        </p>
                <p className="text-2xl font-bold">
         Your Prediction:{" "}
                  
          {vote_was_correct ? "CORRECT! 🎉" : "WRONG! 😢"}
                </p>
   </div>
</div>

     <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-8 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-black mb-4">
                  {selected_char1} Stats
                </h3>
      <div className="space-y-2 font-bold">
  <p>
                   
 Final Health: {battle_result_data.char1_final_health} HP

</p> <p>Base Attack: {char1_data_obj?.base_attack}</p>
          <p>Defense: {char1_data_obj?.base_defense}</p>
        <p>Speed: {char1_data_obj?.speed_stat}</p>
         <p>Power Used: {char1_power_selected}</p>
        <p>Weapon: {char1_weapon_selected}</p>
   </div>
 </div>

    <div className="bg-white border-8 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-2xl font-black mb-4">
  {selected_char2} Stats
   </h3>
                <div className="space-y-2 font-bold">
    <p>
   Final Health: {battle_result_data.char2_final_health} HP
                  </p>
                  <p>Base Attack: {char2_data_obj?.base_attack}</p>
   <p>Defense: {char2_data_obj?.base_defense}</p>
      <p>Speed: {char2_data_obj?.speed_stat}</p>
                  <p>Power Used: {char2_power_selected}</p>
 <p>Weapon: {char2_weapon_selected}</p>
                </div>
              </div>
    </div>

    <div className="bg-white border-8 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
      <h3 className="text-2xl font-black mb-4">
      Battle Summary
    </h3>
    <div className="space-y-2">
                <p className="font-bold">Location: {selected_location}</p>
           <p className="font-bold">
                  Total Turns: {battle_result_data.total_turns}
     </p>
                <p className="font-bold">Environment: {selected_environment}</p>
    </div>
   </div>

 <button onClick={reset_full_game}
              className="w-full bg-blue-600 border-8 border-black p-6 text-3xl font-black uppercase text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-4">
     <RotateCcw size={40} />
              Start New Battle
</button>
  </div>
 )}
</div>
    </div>
  );

}