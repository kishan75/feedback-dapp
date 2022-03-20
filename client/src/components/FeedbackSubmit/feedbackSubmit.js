import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { getErrorMsg } from "../../scripts/common";

// List
import List from "@mui/material/List";
import { red } from "@mui/material/colors";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

import "./feedbackSubmit.scss";

const FeedbackSubmit = (props) => {
  const [feedbackDetails, setFeedbackDetails] = useState({
    feedback: "",
    ticket: "",
    skills: [],
  });

  const [feedbackErrors, setFeedbackErrors] = useState({
    feedback: "",
    ticket: "",
  });

  // List state
  const [checked, setChecked] = useState([]);

  // List handler
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) newChecked.push(value);
    else newChecked.splice(currentIndex, 1);

    setChecked(newChecked);
    setFeedbackDetails({ ...feedbackDetails, skills: newChecked });

    console.log(feedbackDetails);
  };

  // Input handler
  const handleInputChange = (event) => {
    setFeedbackDetails({
      ...feedbackDetails,
      [event.target.name]: event.target.value,
    });

    let updatedErrors = { ...feedbackErrors };
    updatedErrors = validateInput(
      event.target.name,
      event.target.value,
      updatedErrors
    );
    setFeedbackErrors({ ...updatedErrors });
  };

  // Submit handler
  const handleFeedbackSubmit = async () => {
    //props.onLoading(true);
    let updatedErrors = { ...feedbackErrors };

    for (var key in feedbackErrors)
      if (feedbackDetails.hasOwnProperty(key))
        updatedErrors = validateInput(key, feedbackDetails[key], updatedErrors);

    setFeedbackErrors({ ...updatedErrors });
    const fastFeedbackErrors = { ...updatedErrors };

    let ready = true;
    for (var key in fastFeedbackErrors) {
      if (fastFeedbackErrors.hasOwnProperty(key))
        if (fastFeedbackErrors[key] != "") ready = false;
    }

    console.log("Ready:", ready);
    console.log(feedbackDetails);

    try {
      props.showLoader(true);

      let isAbusive = await checkAbusive(feedbackDetails.feedback);
      if (isAbusive) {
        props.showLoader(false);
        props.toast("your content is abusive", "warning", true);
        return null;
      }

      let updatedRating = await getUpdatedRating([
        ...props.course.feedbacks,
        feedbackDetails.feedback,
      ]);

      let res = await submitToContract(
        props.prof.email,
        feedbackDetails.ticket,
        updatedRating,
        {
          code: props.course.code,
          semester: props.course.semester,
          year: props.course.year,
          content: "",
          skills: [],
        },
        props.account
      );
      if (res) {
        props.showLoader(false);
        props.toast(res, "success", true);
      }
    } catch (err) {
      props.showLoader(false);
      err = getErrorMsg(err);
      props.toast(err, "error", true);
    }
  };

  const checkAbusive = (content) => {
    props.toast("checking abusiveness of content", "info", true);

    let promise = new Promise((resolve, reject) => {
      //TODO add model call
      resolve(false);
    });
    return promise;
  };

  const getUpdatedRating = (contents) => {
    props.toast("calculating updated rating", "success", true);

    let updatedRating = {
      preDecimal: 3,
      postDecimal: 4,
    };
    let promise = new Promise((resolve, reject) => {
      //TODO add model call
      resolve(updatedRating);
    });
    return promise;
  };

  const submitToContract = (
    _email,
    _ticket,
    _updatedRating,
    _feedback,
    _account
  ) => {
    props.toast("writing data to contract", "info", true);
    console.log(_email, _ticket, _updatedRating, _feedback);

    let promise = new Promise((resolve, reject) => {
      props.contracts.feedbackData.methods
        .submitFeedback(_email, _ticket, _updatedRating, _feedback)
        .send({ from: _account })
        .then(() => {
          resolve("feedback submitted");
        })
        .catch((err) => {
          //TODO parse error
          console.log(err);
          if (err && err.message) err = err.message;
          else if (err && err.code) err = err.code;
          else err = "";
          reject(err);
        });
    });
    return promise;
  };

  // Validators
  const validateInput = (field, value, updatedErrors) => {
    switch (field) {
      case "feedback":
        if (value.length == 0) updatedErrors[field] = "Cannot be empty";
        else if (value.length < 10)
          updatedErrors[field] = "Length should be greater than 10";
        else if (value.length > 5000)
          updatedErrors[field] = "Length should be less than 5000";
        else if (!/^[a-zA-Z0-9\s]*$/.test(value))
          updatedErrors[field] =
            "Feedback should only contain letters and numbers";
        else updatedErrors[field] = "";
        break;
      case "ticket":
        if (value.length == 0) updatedErrors[field] = "Cannot be empty";
        else if (value.length < 10)
          updatedErrors[field] = "Length should be greater than 10";
        else if (value.length > 100)
          updatedErrors[field] = "Length should be smaller than 100";
        else updatedErrors[field] = "";
        break;
    }
    return updatedErrors;
  };

  return (
    <div className="feedbackSubmit">
      <div className="feedbackSideStats">
        <h1> Course Information </h1>
        <ul>
          <li key={"1"}> Professor: {props.prof.name} </li>
          <li key={"2"}> Course: {props.course.name} </li>
          <li key={"3"}> Code: {props.course.code} </li>
          <li key={"4"}> Year: {props.course.year} </li>
          <li key={"5"}> Semester: {props.course.semester} </li>
          <li key={"6"}> Strength: {props.course.studentCount} </li>
        </ul>
      </div>

      <div className="feedbackMain">
        <h1> Feedback Submission </h1>
        <div className="feedbackInput">
          <CssTextField
            id="feedback-input"
            name="feedback"
            label="FEEDBACK"
            multiline
            rows={5}
            value={feedbackDetails.feedback}
            onChange={handleInputChange}
            error={feedbackErrors.feedback}
            helperText={feedbackErrors.feedback}
          />

          <List
            sx={{
              border: "1px solid white",
              borderRadius: "3px",
              marginLeft: "1rem",
              width: "80%",
              maxWidth: 320,
              bgcolor: "#1f1f1f",
              position: "relative",
              overflow: "auto",
              maxHeight: 150,
              "& ul": { padding: 0 },
            }}
          >
            {props.skills.map((value, i) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={i.toString()} disablePadding>
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(value)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        sx={{
                          color: red[800],
                          "&.Mui-checked": {
                            color: red[600],
                          },
                        }}
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </div>
        <div className="hr" />
        <div className="feedbackFinal">
          <CssTextField
            sx={{ margin: "1rem" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ConfirmationNumberIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
            }}
            id="input-ticket"
            name="ticket"
            value={feedbackDetails.ticket}
            onChange={handleInputChange}
            label="UNIQUE TICKET"
            error={feedbackErrors.ticket}
            helperText={feedbackErrors.ticket}
          />

          <Button
            sx={{ margin: "1rem", width: 300, height: 55, fontSize: "1rem" }}
            size="large"
            color="error"
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleFeedbackSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSubmit;

const CssTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    color: "white",
  },
  "& label": {
    color: "white",
  },
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#ce3333",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "#ce3333",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ce3333",
    },
  },

  "& .MuiFormLabel-root.Mui-error": {
    color: "#ffdd00 !important",
  },
  "& label.Mui-focused.Mui-error": {
    color: "white !important",
  },
  "& .MuiOutlinedInput-root.Mui-error": {
    "& fieldset": {
      borderColor: "#ffdd00 !important",
    },
    "&:hover fieldset": {
      borderColor: "#ffdd00 !important",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ffdd00 !important",
    },
  },
});
