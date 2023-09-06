import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Pokedex from './Pokedex';
import PokemonDetail from './PokemonDetail';
import Error404 from './error/Error404';
import Error500 from './error/Error500';

const ROOT_URL = process.env.PUBLIC_URL;

function App() {
  return (
    <div className="App">
      {/* アプリケーションのヘッダー */}
      <Header />

      {/* ルーティング */}
      <Routes>
        {/* "/"ではポケモンのリストを表示 */}
        <Route path={ROOT_URL} element={<Pokedex />} />

        {/* "/pokemon/:name"ではその名前のポケモンの詳細を表示 */}
        <Route path={ROOT_URL + "/pokemon/:name"} element={<PokemonDetail />} />

        {/* 上のルーティングに当てはまらない場合、404 Not Foundへリダイレクト */}
        <Route path="*" element={<Navigate replace to="/error404" />} />

        {/* 404 Not Foundのページ */}
        <Route path="/error404" element={<Error404 />} />

        {/* 500 Internal Server Errorのページ */}
        <Route path="/error500" element={<Error500 />} />
      </Routes>
    </div>
  )
}

export default App;
