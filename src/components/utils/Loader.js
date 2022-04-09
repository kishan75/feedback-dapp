import React from "react";
import Modal from "@mui/material/Modal";
import LinearProgress from "@mui/material/LinearProgress";
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';


const theme = createTheme({
  palette: {
    secondary: {
      main: '#d32f2f'
    }
  }
})


const Loader = (props) => {
  return (
    <div>
      <Modal open={props.show}>
        <MuiThemeProvider theme={theme}>
          <LinearProgress color="secondary" style={{ backgroundColor: '#d32f2f' }} />
        </MuiThemeProvider>
      </Modal>
    </div>
  );
};

export default Loader;
