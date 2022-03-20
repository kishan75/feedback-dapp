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
  Stack,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router";
import FeedbackSubmit from "./FeedbackSubmit/feedbackSubmit";

export const FeedbackCard = (props) => {
  const [expandAccordian, setAccordian] = useState(false);
  const [accordianHeader, setAccordianHeader] = useState(null);

  useEffect(() => {
    let splits = props.content.split(" ");
    let head = "";
    if (splits.length <= 4) {
      splits.forEach((word) => (head += word + " "));
    } else {
      head = `${splits[0]} ${splits[1]} ${splits[2]} ${splits[3]}`;
    }
    head += "...";
    setAccordianHeader(head);
  }, []);

  return (
    <div>
      {{ accordianHeader } && (
        <Card
          onMouseEnter={() => setAccordian(true)}
          onMouseLeave={() => setAccordian(false)}
          onClick={() => {
            window.location.href = `${props.email}/${props.year}/${props.semester}/${props.code}`;
          }}
          style={{
            backgroundColor: "white",
            boxShadow: "none",
            border: "4px solid",
            borderColor: "red",
            "&:hover": {
              backgroundColor: "blue !important",
            },
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
  }, [props.courses, email]);
  return (
    <div>
      {feedbacks == null
        ? props.showLoader(true)
        : [
            <FeedbackSubmit
              {...props}
              course={props.courses[email][year][sem][courseCode]}
              prof={props.profs[email]}
            />,
            <Box m={4}>
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
          ]}
    </div>
  );
};
