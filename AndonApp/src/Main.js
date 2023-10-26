import logo from './logo.svg';
import './App.css';
import { Typography, Paper, Box, TextField, Button, Grid, Switch, ToggleButton, ToggleButtonGroup, FormControl, FilledInput, FormHelperText, OutlinedInput, Divider, makeStyles, ListItem, ListItemButton, ListItemText, Chip, List } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { useRef } from 'react';
import { Stack, textAlign } from '@mui/system';
import { ThemeContext } from '@emotion/react';
import { FixedSizeList } from 'react-window';
import { MyContext } from './App';
import { useParams } from 'react-router-dom';
import InfoCard from './InfoCard';





export default function Main(props) {

  const { machineName } = useParams();
  const { notify, last, setLast} = useContext(MyContext);


  function fetchData() {
    if(!machineName) {
      return;
    }

    fetch("/api/fetch_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        machine: machineName
      })
    })
    .then(response => {
      if(!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      setLast(data);
    })
    .catch(error => {
      notify("error", "contact");
    });
}



  
  
  


  




  useEffect(() => {
      fetchData();
      setInterval(() => {
        fetchData()
      }, 30000)
    }, [machineName])




  return (
      <Grid container spacing={2} p={2} sx={{ width: "100%", height: "100%" }}>
          <InfoCard variant="ok" />
      




      <InfoCard variant="nok" />

      </Grid>
      
  );
  
}
