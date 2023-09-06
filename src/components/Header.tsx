import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { ROOT_URL } from '../definisions';

// ヘッダーを表示するのコンポーネント
function Header() {
  // 他のページへ誘導するためのナビゲート変数
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-around"}}>
          {/* ヘッダー中央にある"Pokedex"と書かれたボタン。クリックしたら"/"に移動できる */}
          <Button
            variant="text"
            style={{ color: "white", textTransform: "none", fontSize: "20px" }}
            onClick={() => navigate(ROOT_URL + "/")}
          >
            Pokedex
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;