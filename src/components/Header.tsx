import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-around"}}>
          <Button
            variant="text"
            style={{ color: "white", textTransform: "none", fontSize: "20px" }}
            onClick={() => navigate("/")}
          >
            Pokedex
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}