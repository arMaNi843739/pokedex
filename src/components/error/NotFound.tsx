import { Grid, Typography } from '@mui/material';

function NotFound() {
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

export default NotFound;