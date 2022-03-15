import React from "react";
import Modal from "@mui/material/Modal";
import LinearProgress from "@mui/material/LinearProgress";

export const Loader = (props) => {
  return (
    <div>
      <Modal open={props.show}>
        <LinearProgress />
      </Modal>
    </div>
  );
};
