
import { Typography, Paper, Box, TextField, Button, Grid, Switch, ToggleButton, ToggleButtonGroup, FormControl, FilledInput, FormHelperText, OutlinedInput, Divider, makeStyles, ListItem, ListItemButton, ListItemText, Chip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Stack, textAlign } from '@mui/system';
import { MyContext } from './App';
import { FixedSizeList as List } from 'react-window';

function Row(props) {
  const { index, style, data } = props;
  const { items, variant } = data;  // <== Note this change
  const item = items[index];        // <== Note this change
  

  return (
    <ListItem key={index} component="div" disablePadding spacing={5} style={{ ...style, width: "100%" }}>
      <ListItemText sx={{ background: "rgba(255,0,0,0.2)", width: "100%", p: 1 }}>
         <Box display="flex" justifyContent="flex-end" alignItems="flex-start">
            
            <ListItemText primary={"Kod SAP: " + item[5]} secondary={"Numer seryjny: " + item[6]} />
            { variant == "nok" && (
              <ListItemText sx={{ textAlign: "right" }} primary={"Anomalia: " + item[12]} secondary={"Data wystąpienia: " + item[8]} />
            )}

            { variant == "ok" && (
              <ListItemText sx={{ textAlign: "right" }} primary={"Data: " + item[8]} />
            )}
            
         </Box>
      </ListItemText>
    </ListItem>
  );
}



export default function InfoCard(props) {

  const { notify, last, setLast } = useContext(MyContext);
  const { variant } = props;
  const itemSize = 60; // Set a fixed size for each item. You might want to adjust this value.
  const [open, setOpen] = useState(false);


return (
  <Grid item xs={12} sx={{height: variant == "ok" ? "75%" : "25%"}}>
<Paper elevation={1} className="myPaper" style={{ height: "100%", border: variant == "nok" && "10px solid red" }}>
      <Stack spacing={3} style={{ width: "100%", display: "flex", textAlign: "center" }}>
      

      
      <Stack direction={"column"} sx={{ width: "100%", display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center", background: variant == "ok" ? (last != null && last[variant] != null && last[variant].length && last["needed"])  ?  (last[variant].length / last["needed"] >= 1.0) ? "green" : (last[variant].length / last["needed"] >= 0.9) ? "yellow" : "red" : "black" : "black", height: !open ? "100%" : "auto", p: 1 }}>


      <Typography variant="h1" sx={{ color: variant =="nok" &&"red", fontWeight: "bold" }}>

{ variant == "ok" ? "OK" : variant == "nok" ? "NOK" : "N/A"}
  
  </Typography>


      <Stack direction={"row"} spacing={1}>
      <Chip 
    style={{ 
        width: variant === "nok" ? 400 : 150, 
        height: 100 
    }} 
    label={
        (
          <Typography variant='h2'>
            { 
              last?.[variant]?.length ?? 0
            }
            { 
              variant === "nok" && 
              (
                (last?.ok ?? 0) === 0 
                  ? " (0%)" 
                  : " (" + ((last?.nok?.length ?? 0) / (last?.ok?.length || 1) * 100).toFixed(2) + "%)"
              )
            }
          </Typography>
        )
    } 
/>






      { variant == "ok" && (
        <React.Fragment>
        <Typography variant='h1'>/</Typography>
          <Chip style={{ width: 150, height: 100 }} label={
            (
              <Typography variant='h2'>
                { last != null && last["needed"] }
              </Typography>
            )
          } />
      </React.Fragment>
      )}
      

      </Stack>

        
        
</Stack>
          
{ open && (
  <React.Fragment>
  <hr style={{ display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center", margin: 20 }} />
  <Box sx={{ background: "red", width: "100%", p: 1 }}>
    <Typography variant="h6">Historia:</Typography>
    
  </Box>
  <List
height={600} // Set the height of the visible window
itemCount={(last != null && last[variant] != null) ? last[variant].length : 0}
itemSize={itemSize}
itemData={{ items: (last != null && last[variant] != null) ? last[variant] : [], variant: variant }}
width="100%"
>
{Row}
</List>
</React.Fragment>
)}
        

        </Stack>
        
      </Paper>
      </Grid>
)
}