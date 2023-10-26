import React from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Grid, Paper } from "@mui/material";
import Overlay from './Overlay';


export default function LoadingOverlay(props) {

  return (
    <>
      {props.loading && (
        <Overlay>
          <Paper>
          
            <Grid container>
            
              <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
          <CircularProgress size={50} sx={{marginRight: 3}} />
          <Typography variant="h4">Proszę czekać</Typography>
          </Box>
          </Grid>
          
          </Grid>
          </Paper>
        </Overlay>
        
      )}
    </>
  );
};