import Stats from './Stats';
import Type from './Type';

// ポケモンの情報を持つ型
type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprites: string;
  stats: Stats;
  types: Type[];
};

export default Pokemon;