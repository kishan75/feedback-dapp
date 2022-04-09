import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router";
import FeedbackSubmit from "../FeedbackSubmit/feedbackSubmit";
import Header from "../Header/header";

import "./feedbacks.scss";

export const FeedbackCard = (props) => {
  const [expandAccordian, setAccordian] = useState(false);
  const [accordianHeader, setAccordianHeader] = useState(null);

  useEffect(() => {
    let head = "";
    if (props.content.length <= 20) {
      head = props.content;
    } else {
      head = props.content.slice(0, 20);
    }
    head += "...";
    setAccordianHeader(head);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="feedbackCard">
      {{ accordianHeader } && (
        <Card
          onMouseEnter={() => setAccordian(true)}
          onMouseLeave={() => setAccordian(false)}
          style={{
            backgroundColor: "#181818",
            boxShadow: "none",
            border: "4px solid",
            borderColor: "red",
          }}
        >
          <CardContent>
            <Accordion expanded={expandAccordian}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {!expandAccordian && (
                  <Typography variant="h5" color="text.primary">
                    {accordianHeader}
                  </Typography>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="h5" color="text.primary">
                  {props.content}
                </Typography>
              </AccordionDetails>
            </Accordion>
            {props.skills.map((skill) => {
              return (
                <Button
                  color="error"
                  style={{
                    margin: "5px",
                  }}
                  variant="outlined"
                >
                  {skill}
                </Button>
              );
            })}{" "}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export const Feedbacks = (props) => {
  const [feedbacks, setFeedbacks] = useState(null);
  const { email, year, sem, courseCode } = useParams();

  useEffect(() => {
    if (props.courses && email) {
      setFeedbacks(props.courses[email][year][sem][courseCode].feedbacks);
    }
    // eslint-disable-next-line
  }, [props.courses, email]);
  return (
    <div>
      <Header {...props} />
      {feedbacks == null
        ? props.showLoader(true)
        : [
            <FeedbackSubmit
              {...props}
              course={props.courses[email][year][sem][courseCode]}
              prof={props.profs[email]}
            />,
            <h1 className="coursesHead"> FEEDBACKS </h1>,
            <Box m={4} sx={{ padding: "1rem" }}>
              <Grid container spacing={4}>
                {feedbacks.map((feedback, i) => {
                  return (
                    <Grid item xs={3} key={i.toString()}>
                      <FeedbackCard {...feedback}></FeedbackCard>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>,
            <div className="feedbackExtender"> </div>,
          ]}
    </div>
  );
};
