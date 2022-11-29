import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SnackbarProvider } from "notistack";
import Collapse from "@material-ui/core/Collapse";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider
        maxSnack={4}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={Collapse}
      >
        {" "}
        <App />
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
