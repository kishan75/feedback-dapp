import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const toast = (props) => {
  return (
    <Snackbar
      autoHideDuration={4500}
      open={props.show}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={props.onClose}
    >
      <Alert severity={props.type} sx={{ width: "100%" }}>
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default toast;
