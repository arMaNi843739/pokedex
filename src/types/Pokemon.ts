import Stats from './Stats';
import Type from './Type';

type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  // abilities: 
  // forms:
  //// game_indices:
  // held_items:
  // location_area_encounters:
  // moves:
  //// past_types:
  sprites: string;
  //// species:
  stats: Stats;
  types: Type[];
};

export default Pokemon;