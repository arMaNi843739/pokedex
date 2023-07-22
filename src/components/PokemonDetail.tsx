import { useEffect, useState } from 'react'
import { API_ROOT } from '../definisions'
import axios from 'axios'
import Pokemon from '../types/Pokemon'
import Type from '../types/Type';
import { Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// const Item = styled(Paper)(({ theme }) => ({
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ffffff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const initialState: Pokemon = {
  id: 0,
  name: "",
  base_experience: 0,
  height: 0,
  weight: 0,
  // abilities: 
  // forms:
  // game_indices:
  // held_items:
  // location_area_encounters:
  // moves:
  // past_types:
  sprites: "",
  // species:
  stats: {hp: 0, atk: 0, dfns: 0, spc_atk: 0, spc_dfns: 0, speed: 0},
  types: [{name: "", url: ""}],
}

function PokemonDetail() {
  const { name } = useParams();

  const [pokemon, setPokemon] = useState<Pokemon>(initialState);

  useEffect(() => {
    const getPokemon = async () => {
      try {
        const rs = await axios.get(API_ROOT + `/pokemon/${name}`);
        const p = rs.data;
        setPokemon({
          id: p['id'],
          name: p['name'],
          base_experience: p['base_experience'],
          height: p['height'],
          weight: p['weight'],
          sprites: p['sprites']['other']['official-artwork']['front_default'],
          stats: {
            hp: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "hp")['base_stat'],
            atk: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "attack")['base_stat'],
            dfns: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "defense")['base_stat'],
            spc_atk: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "special-attack")['base_stat'],
            spc_dfns: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "special-defense")['base_stat'],
            speed: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "speed")['base_stat'],
          },
          types: p['types'].map((t: {slot: number; type: Type;}) => t.type)
        });
      } catch(err: any) {
        console.error('API ERROR')
      }
    }

    getPokemon();
  }, [])

  return (
      <Grid
        container
        alignItems="center"
        justifyItems="center"
        justifySelf="center"
        justifyContent="center"
        spacing={2}
        sx={{mt:2}}
      >
        <Stack direction='row'>
          <Item>
            {(() => {
              if(pokemon.sprites === null){
                return <Typography align='center' style={{height: 500, width: 500}}>No Image</Typography>
              } else {
                return <img src={pokemon.sprites} alt={pokemon.name} />;
              }
            })()}
          </Item>
          <Item>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2} align='center'>Identities</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key="id">
                    <TableCell>ID</TableCell>
                    <TableCell>{pokemon.id}</TableCell>
                  </TableRow>
                  <TableRow key="name">
                    <TableCell>Name</TableCell>
                    <TableCell>{pokemon.name}</TableCell>
                  </TableRow>
                  <TableRow key="type">
                    <TableCell>Type</TableCell>
                    <TableCell>
                      <Table>
                        <TableBody>
                          {pokemon.types.map((p) => (
                            <TableRow key={p.name}>
                              <TableCell sx={{padding: 0}} style={{borderBottom: 'none'}}>{p.name}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                  <TableRow key="base-experience">
                    <TableCell>Base Experience</TableCell>
                    <TableCell>{pokemon.base_experience}</TableCell>
                  </TableRow>
                  <TableRow key="height">
                    <TableCell>Height</TableCell>
                    <TableCell>{pokemon.height}</TableCell>
                  </TableRow>
                  <TableRow key="weight">
                    <TableCell>Weight</TableCell>
                    <TableCell>{pokemon.weight}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Item>
          <Item>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2} align='center'>
                      Base Stats
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key="hp">
                    <TableCell>HP</TableCell>
                    <TableCell>{pokemon.stats.hp}</TableCell>
                  </TableRow>
                  <TableRow key="atk">
                    <TableCell>Attack</TableCell>
                    <TableCell>{pokemon.stats.atk}</TableCell>
                  </TableRow>
                  <TableRow key="dfns">
                    <TableCell>Defense</TableCell>
                    <TableCell>{pokemon.stats.dfns}</TableCell>
                  </TableRow>
                  <TableRow key="spc-atk">
                    <TableCell>Special Attack</TableCell>
                    <TableCell>{pokemon.stats.spc_atk}</TableCell>
                  </TableRow>
                  <TableRow key="spc-dfns">
                    <TableCell>Special Defense</TableCell>
                    <TableCell>{pokemon.stats.spc_dfns}</TableCell>
                  </TableRow>
                  <TableRow key="speed">
                    <TableCell>Speed</TableCell>
                    <TableCell>{pokemon.stats.speed}</TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </TableContainer>
          </Item>

        </Stack>
      </Grid>
  )
}

export default PokemonDetail;