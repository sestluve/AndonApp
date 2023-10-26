import React from "react";
import Main from "./Main";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { Box } from "@mui/system";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingOverlay from './LoadingOverlay';
import { Button, CssBaseline, Grid, Paper, Typography } from "@mui/material";
import Overlay from './Overlay';
import { createTheme, ThemeProvider } from "@mui/material";

export const MyContext = React.createContext();

export default function App(props) {

  const [loading, setLoading] = useState(false);

  const [contactErrorInfo, setContactErrorInfo] = useState(false);


  const [last, setLast] = useState();


  const showLoadingScreen = () => {
    setLoading(true);
  };
  
  const hideLoadingScreen = () => {
    setLoading(false);
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });












  const notify = (action, text) => {
    if(action == "success") {
      toast.success(text, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else if(action == "info") {
      toast.info(text, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    } else if(action == "error") {
      if(text == "contact") {
        //notify("error", "Wystąpił błąd podczas przetwarzania żądania. Skontaktuj się z programistą działu IT!")
        setContactErrorInfo(true)
      } else {
        toast.error(text, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
  }
    } else if(action == "warning") {
      toast.warn(text, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  };










return (
  <MyContext.Provider value={{ notify, last, setLast }}>
  <Box component="main" sx={{ p: 0, m: 0, height: "100vh", width: "100vw", position: "absolute", top: 0, left: 0 }}>
      <LoadingOverlay loading={loading} />
      {contactErrorInfo && (
        <Overlay>
          <Paper>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5, textAlign: 'center' }}>
            <Grid container>
              <Grid item xs={12}>
          <Typography variant="h4">
          Wystąpił błąd podczas przetwarzania żądania. Spróbuj ponownie wykonać ostatnią operację. Jeśli problem nadal będzie się pojawiał skontaktuj się z programistą działu IT!
          </Typography>
          </Grid>
          <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, textAlign: 'center' }}>
          <Button variant="contained" onClick={() => {setContactErrorInfo(false)}}>Zamknij</Button>
          </Box>
          </Grid>
          </Grid>
          </Box>
          
          </Paper>
        </Overlay>
        
      )}
      <ToastContainer />
      <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Router>
              <Routes>
                  <Route exact path="/:machineName" element={(
                    <Main notify={(action, text) => { notify(action, text) }} showLoadingScreen={showLoadingScreen} hideLoadingScreen={hideLoadingScreen} />
                    )} />
                  </Routes>
                  </Router>
                  </ThemeProvider>
                  
          </Box>
          </MyContext.Provider >
          
)
}