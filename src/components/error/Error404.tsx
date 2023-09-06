import { Grid, Typography } from '@mui/material';

// "404 Not Found"を表示するコンポーネント
function Error400() {
  return (
    <Grid
      alignItems="center"
      justifyItems="center"
      justifySelf="center"
      justifyContent="center"
      spacing={2}
      sx={{mt:2, mb: 2}}
    >
      <Typography variant="h3" align="center">404 Not Found</Typography>
    </Grid>
  )
}

export default Error400;