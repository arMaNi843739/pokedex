import { useEffect, useState } from 'react'
import { API_ROOT } from '../definisions'
import axios from 'axios'
import Pokemon from '../types/Pokemon'
import Type from '../types/Type';
import { Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#ffffff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// Pokemon型の初期状態
const initialState: Pokemon = {
  id: 0,
  name: "",
  base_experience: 0,
  height: 0,
  weight: 0,
  sprites: "",
  stats: {hp: 0, atk: 0, dfns: 0, spc_atk: 0, spc_dfns: 0, speed: 0},
  types: [{name: "", url: ""}],
}

// 該当ポケモンの詳細を表示するコンポーネント
function PokemonDetail() {
  // URL("/pokemon/{ポケモンの名前})からポケモンの名前を取得する
  const { name } = useParams();

  // 他のページへ誘導するためのナビゲート変数
  const navigate = useNavigate();

  // ポケモンの情報を保存する変数pokemonと、変数にポケモンの情報を設定する関数setPokemon
  const [pokemon, setPokemon] = useState<Pokemon>(initialState);

  // ポケモンの情報を取得するフック
  // ページに移動したときに発火する
  useEffect(() => {
    // APIからポケモンの情報を取得する非同期関数
    const getPokemon = async () => {
      try {
        // APIにポケモンの情報をGETリクエストする
        const rs = await axios.get(API_ROOT + `/pokemon/${name}`);
        const p = rs.data;

        // APIから取得したデータからポケモンの情報を設定する
        setPokemon({
          id: p['id'], // 図鑑番号
          name: p['name'], // 名前
          base_experience: p['base_experience'], // 基礎経験値
          height: p['height'], // 身長
          weight: p['weight'], // 体重
          sprites: p['sprites']['other']['official-artwork']['front_default'], // 画像
          stats: { // ステータス
            hp: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "hp")['base_stat'], // HP
            atk: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "attack")['base_stat'], // こうげき
            dfns: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "defense")['base_stat'], // ぼうぎょ
            spc_atk: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "special-attack")['base_stat'], // とくこう
            spc_dfns: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "special-defense")['base_stat'], // とくぼう
            speed: p['stats'].find((s: {base_stat: number; effort: number; stat: {name: string; url: string}}) => s['stat']['name'] === "speed")['base_stat'], // すばやさ
          },
          types: p['types'].map((t: {slot: number; type: Type;}) => t.type) // タイプのリスト
        });
      } catch(err: any) {
        // APIでエラーが発生した場合、"500 Internal Server Error"とする
        navigate("/error500");
      }
    }

    // ポケモンのデータを取得
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
          {/* ポケモンの画像を表示。画像が無い場合はNo Imageと表示する */}
          <Item>
            {(() => {
              if(pokemon.sprites === null){
                return <Typography align='center' style={{height: 500, width: 500}}>No Image</Typography>
              } else {
                return <img src={pokemon.sprites} alt={pokemon.name} />;
              }
            })()}
          </Item>

          {/* ポケモンの基本情報を表示 */}
          <Item>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2} align='center'>Identities</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* 図鑑番号 */}
                  <TableRow key="id">
                    <TableCell>ID</TableCell>
                    <TableCell>{pokemon.id}</TableCell>
                  </TableRow>
                  {/* 名前 */}
                  <TableRow key="name">
                    <TableCell>Name</TableCell>
                    <TableCell>{pokemon.name}</TableCell>
                  </TableRow>
                  {/* タイプの表 */}
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
                  {/* 基礎経験値 */}
                  <TableRow key="base-experience">
                    <TableCell>Base Experience</TableCell>
                    <TableCell>{pokemon.base_experience}</TableCell>
                  </TableRow>
                  {/* 身長 */}
                  <TableRow key="height">
                    <TableCell>Height</TableCell>
                    <TableCell>{pokemon.height}</TableCell>
                  </TableRow>
                  {/* 体重 */}
                  <TableRow key="weight">
                    <TableCell>Weight</TableCell>
                    <TableCell>{pokemon.weight}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Item>

          {/* ポケモンのステータスを表示 */}
          <Item>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2} align='center'>
                      Stats
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* HP */}
                  <TableRow key="hp">
                    <TableCell>HP</TableCell>
                    <TableCell>{pokemon.stats.hp}</TableCell>
                  </TableRow>
                  {/* こうげき */}
                  <TableRow key="atk">
                    <TableCell>Attack</TableCell>
                    <TableCell>{pokemon.stats.atk}</TableCell>
                  </TableRow>
                  {/* ぼうぎょ */}
                  <TableRow key="dfns">
                    <TableCell>Defense</TableCell>
                    <TableCell>{pokemon.stats.dfns}</TableCell>
                  </TableRow>
                  {/* とくこう */}
                  <TableRow key="spc-atk">
                    <TableCell>Special Attack</TableCell>
                    <TableCell>{pokemon.stats.spc_atk}</TableCell>
                  </TableRow>
                  {/* とくぼう */}
                  <TableRow key="spc-dfns">
                    <TableCell>Special Defense</TableCell>
                    <TableCell>{pokemon.stats.spc_dfns}</TableCell>
                  </TableRow>
                  {/* すばやさ */}
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