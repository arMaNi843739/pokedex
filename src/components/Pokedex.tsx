import { useEffect, useState } from 'react';
import Pokemon from '../types/Pokemon';
import axios from 'axios';
import { ROOT_URL, API_ROOT } from '../definisions';
import { Grid, IconButton, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, Alert, Snackbar } from '@mui/material';
import Type from '../types/Type';
import SearchIcon from '@mui/icons-material/Search';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from 'react-router-dom';

// 1ページ当たりに表示するポケモン数
const POKEMONS_PER_PAGE = 20;

// ポケモンのリストを表示するコンポーネント
function Pokedex() {
  // APIから取得したポケモンのリストを保存する変数pokemonsと、
  // pokemons変数の値を設定するsetPokemons関数
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  // 現在のページ番号を保存する変数pageと、page変数の値を設定する関数setPage
  const [page, setPage] = useState<number>(0);

  // 全体のページ数を保存する変数maxPage（ポケモンの数 / 1ページ当たりに表示するポケモンの数、で求める）と、
  // maxPage変数の値を設定するsetMaxPage関数
  const [maxPage, setMaxPage] = useState<number>(0);

  // 他のページへ誘導するためのナビゲート変数
  const navigate = useNavigate();

  // ポケモンのリストを取得するためのフック
  // 「ページを開いた時」と「ページ更新時（次のページを選択した時など）」に実行される
  useEffect(() => {
    // 非同期でAPIサーバーからポケモンを取得する関数
    const getPokemons = async () => {
      try {
        // APIへGETリクエストを送信
        const rs = await axios.get(API_ROOT + `/pokemon/?limit=${POKEMONS_PER_PAGE}&offset=${page * POKEMONS_PER_PAGE}`);

        // 取得したデータからポケモンのリストを作成する
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

        // 先ほど作成したポケモンのリストを変数に設定する
        setPokemons(rawList);

        // 最大ページ数を変更
        setMaxPage(Math.floor(rs.data['count'] / POKEMONS_PER_PAGE));
      } catch (err: any) {
        // APIでエラーが発生した場合、"500 Internal Server Error"とする
        navigate(ROOT_URL + "/error500")
      }
    };

    // 上の非同期関数を実行する
    getPokemons();
  }, [page]);

  // エラー通知を表示するかどうかのフラグ用変数
  const [IsAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  // フラグをtrueにする関数
  const openAlert = () => setIsAlertOpen(true);
  // フラグをfalseにする関数
  const closeAlert = () => setIsAlertOpen(false);

  // 検索キーを保存する変数
  const [searchKey, setSearchKey] = useState<string>("");

  // ポケモンを検索する非同期関数
  const searchPokemon = async () => {
    // キーが空の場合は検索しない
    if(searchKey.length === 0) {
      return;
    }

    try {
      // 検索キーと一致するポケモンをAPIにリクエストする。
      // 無い場合は404 Not Foundが返ってくる
      const rs = await axios.get(API_ROOT + `/pokemon/${searchKey}`);
      // 見つかった場合、ポケモンの詳細データページに移動する
      navigate(ROOT_URL + `/pokemon/${rs.data['name']}`)
    } catch (err: any) {
      if(err.response.status === 404) {
        // 検索キーに一致するポケモンが見つからなかった場合、エラー通知を表示する
        openAlert();
      } else {
        // その他のAPIエラーは500 Internal Server Errorとする
        navigate(ROOT_URL + "/error500");
      }
    }
  }

  return (
    <>
      {/* エラー通知 表示したら2秒で消えるように設定している(autoHideDuration) */}
      <Snackbar
        anchorOrigin={{vertical: "top", horizontal: "right"}}
        open={IsAlertOpen}
        autoHideDuration={2000}
        onClose={closeAlert}
      >
        <Alert severity="error">Not Found</Alert>
      </Snackbar>

      <Stack
        alignItems="center"
        justifyItems="center"
        justifySelf="center"
        justifyContent="center"
        spacing={2}
        sx={{mt:2, mb: 2}}
      >
        <Grid item xs={5}>
          <Stack direction="row" sx={{ m: 2 }}>
            {/* 検索キーの入力フィールド。文字を入力するたびにsearchKey変数に検索キーが保存される */}
            <TextField
              id="search-by-name"
              label="Name or ID"
              variant="standard"
              onChange={(e) => setSearchKey(e.target.value)}
            />
            {/* 検索ボタン。クリックするとsearchPokemon関数が実行される */}
            <IconButton onClick={searchPokemon}>
              <SearchIcon />
            </IconButton>
          </Stack>

          {/* APIから取得したポケモンの表 */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell align='center'>ID</TableCell> {/* ポケモン図鑑番号 */}
                  <TableCell align='center'>Name</TableCell> {/* ポケモンの名前 */}
                  <TableCell align='center'>Types</TableCell> {/* ポケモンのタイプ */}
                </TableRow>
              </TableHead>
              <TableBody>
                {pokemons.map((p) => {
                  // ポケモンのタイプを表す文字列を作成
                  // タイプが複数ある場合は"/"で区切って表示
                  let typeName: string = p.types[0].name;
                  for (let i = 1; i < p.types.length; ++i) {
                    typeName += " / " + p.types[i].name;
                  }

                  return (
                    <TableRow key={p.id}>
                      {/* ポケモンの詳細ページへ移動するためのボタンのセル。ボタンがクリックされたら"/pokemon/{ポケモン名}"のページにナビゲートする */}
                      <TableCell>
                        <IconButton aria-label='search' onClick={() => navigate(ROOT_URL + `/pokemon/${p.name}`)}>
                          <ListAltIcon />
                        </IconButton>
                      </TableCell>
                      {/* ポケモンの画像を表示するセル。画像が無い場合は"No Image"と表示する */}
                      <TableCell align='center' style={{width: 100, height: 100}}>
                        {(() => {
                          if(p.sprites === null) {
                            return <Typography>No Image</Typography>;
                          } else {
                            return <img src={p.sprites} alt={p.name} />
                          }
                        })()}
                      </TableCell>
                      {/* ポケモンのID（図鑑番号）を表示するセル */}
                      <TableCell align='center'>{p.id}</TableCell>
                      {/* ポケモンの名前を表示するセル */}
                      <TableCell align='center'>{p.name}</TableCell>
                      {/* ポケモンのタイプを表示するセル */}
                      <TableCell align='center'>{typeName}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* ページネーションを表示。他のページがクリックされたらpage変数を新しいページに更新する */}
        <Pagination count={maxPage} color="primary" onChange={(e, newPage) => setPage(newPage-1)} />
      </Stack>
    </>
  );
}

export default Pokedex;