import { styled } from '@mui/material/styles';

const Overlay = styled('div')(({ theme }) => ({
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: theme.zIndex.modal + 1,
    color: 'white'
  }));

  export default Overlay;