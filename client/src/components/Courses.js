import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import { Link } from 'react-router-dom'
import { BootstrapTooltip } from "./utils/common";
import { useParams } from "react-router-dom";

export const CourseCard = (props) => {
  return (
    <div>
      <Link
        to={`/${props.email}/${props.year}/${props.semester}/${props.code}`}
      >
        <BootstrapTooltip title="Exapnd this course">
          <Card
            style={{
              // backgroundColor: "white",
              boxShadow: "none",
              border: "4px solid",
              borderColor: "red",
            }}
          >
            <CardHeader
              style={{
                color: "white",
                fontFamily: "Arial",
                backgroundColor: "#181818",
                boxShadow: "none",
              }}
              titleTypographyProps={{ variant: "h4" }}
              title={props.name}
            />
            <CardContent
              style={{
                color: "white",
                fontFamily: "Arial",
                backgroundColor: "#181818",
                boxShadow: "none",
              }}
            >
              <Typography variant="body1">
                {`code:${props.code}, sem:${props.semester == 0 ? "even" : "odd"
                  }, students:${props.studentCount}`}
                <Divider orientation="vertical"></Divider>
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
