import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Pokedex from './Pokedex';
import PokemonDetail from './PokemonDetail';
import NotFound from './error/NotFound';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App;
