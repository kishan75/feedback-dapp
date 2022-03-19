import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Link,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import { BootstrapTooltip } from "./utils/common";
import { useParams } from "react-router-dom";

export const CourseCard = (props) => {
  return (
    <div>
      <Link
        href={`/${props.email}/${props.year}/${props.semester}/${props.code}`}
        underline="none"
      >
        <BootstrapTooltip title="Exapnd this course">
          <Card
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
            <CardHeader title={props.name} subheader={props.code} />
            <CardContent>
              <Typography variant="body1" color="text.primary">
                {`taught in ${
                  props.semester == 0 ? "even" : "odd"
                } semester, enrolled ${props.studentCount} students`}
              </Typography>
            </CardContent>
          </Card>
        </BootstrapTooltip>
      </Link>
    </div>
  );
};

export const Courses = (props) => {
  const [courses, setCourses] = useState(null);
  const { email, year } = useParams();

  useEffect(() => {
    if (email && year && props.courses) {
      let courses = Object.values(props.courses[email][year]);
      if (courses.length) {
        courses =
          courses.length == 2
            ? [...Object.values(courses[0]), ...Object.values(courses[1])]
            : [...Object.values(courses[0])];
        setCourses(courses);
      } else setCourses([]);
    }
  }, [email, year, props.courses]);
  return (
    <div>
      {courses == null ? (
        props.showLoader(true)
      ) : (
        <Box m={4}>
          <Grid container spacing={4}>
            {courses.map((course) => {
              return (
                <Grid item xs={3} key={course.code}>
                  <CourseCard email={email} {...course}></CourseCard>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </div>
  );
};
