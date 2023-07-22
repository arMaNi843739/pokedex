import { useEffect, useState } from 'react';
import Pokemon from '../types/Pokemon';
import axios from 'axios';
import { API_ROOT } from '../definisions';
import { Grid, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Type from '../types/Type';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const POKEMONS_PER_PAGE = 20;

function Pokedex() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [page, setPage] = useState<number>(0);
  const [maxPage, setMaxPage] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getPokemons = async () => {
      try {
        const rs = await axios.get(API_ROOT + `/pokemon/?limit=${POKEMONS_PER_PAGE}&offset=${page * POKEMONS_PER_PAGE}`);

        const rawList: Pokemon[] = await Promise.all(
          rs.data.results.map(async (raw: { name: string; url: string }) => {
            const rs = await axios.get(raw.url);
            const p = rs.data;
            return {
              id: p.id,
              name: p.name,
              sprites: p.sprites['front_default'],
              types: p.types.map((t: {slot: number; type: {name: string; url: string}}) => t.type as Type)
            } as Pokemon
          })
        );

        setPokemons(rawList);
        setMaxPage(Math.floor(rs.data['count'] / POKEMONS_PER_PAGE));
      } catch (err: any) {
        console.error("API Error");
      }
    };
    getPokemons();
  }, [page]);

  return (
    <>
      <Stack
        alignItems="center"
        justifyItems="center"
        justifySelf="center"
        justifyContent="center"
        spacing={2}
        sx={{mt:2, mb: 2}}
      >
        <Grid item xs={5}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell align='center'>ID</TableCell>
                  <TableCell align='center'>Name</TableCell>
                  <TableCell align='center'>Types</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pokemons.map((p) => {
                  let typeName: string = p.types[0].name;
                  for (let i = 1; i < p.types.length; ++i) {
                    typeName += " / " + p.types[i].name;
                  }
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <IconButton aria-label='search' onClick={() => navigate(`/pokemon/${p.name}`)}>
                          <SearchIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align='center' style={{width: 100, height: 100}}>
                        {(() => {
                          if(p.sprites === null) {
                            return <Typography>No Image</Typography>;
                          } else {
                            return <img src={p.sprites} alt={p.name} />
                          }
                        })()}
                      </TableCell>
                      <TableCell align='center'>{p.id}</TableCell>
                      <TableCell align='center'>{p.name}</TableCell>
                      <TableCell align='center'>{typeName}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      <Pagination count={maxPage} color="primary" onChange={(e, newPage) => {console.log(newPage); setPage(newPage);}} />
      </Stack>
    </>
  );
}

export default Pokedex;