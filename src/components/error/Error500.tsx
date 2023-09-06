import { Grid, Typography } from '@mui/material';

// "500 Internal Server Error"を表示するコンポーネント
function Error500() {
  return (
    <Grid
      alignItems="center"
      justifyItems="center"
      justifySelf="center"
      justifyContent="center"
      spacing={2}
      sx={{mt:2, mb: 2}}
    >
      <Typography variant="h3" align="center">500 Internal Server Error</Typography>
    </Grid>
  )
}

export default Error500;