import React, { useState, useEffect } from "react";
import AddCourseFunctionBox from "../../FunctionBox/AddCoursesFunctionBox/addCoursesFunctionBox";

const AddCourses = (props) => {
  const [addCourseDetails, setAddCourseDetails] = useState({
    email: props.emailMap[props.account],
    year: "",
    numCourses: "",
    courses: [
      {
        name: "",
        code: "",
        sem: "",
        students: "",
      },
    ],
  });

  const [addCourseErrors, setAddCourseErrors] = useState({
    email: "",
    year: "",
    numCourses: "",
    courses: [
      {
        name: "",
        code: "",
        sem: "",
        students: "",
      },
    ],
  });

  useEffect(() => {
    const course = { name: "", code: "", sem: "", students: "" };
    let updatedCourses = [];
    for (var i = 0; i < addCourseDetails.numCourses; i++)
      updatedCourses.push(course);

    setAddCourseDetails({
      ...addCourseDetails,
      courses: updatedCourses,
    });

    let updatedCourseErrors = [];
    for (var j = 0; j < addCourseDetails.numCourses; j++)
      updatedCourseErrors.push(course);

    setAddCourseErrors({
      ...addCourseErrors,
      courses: updatedCourseErrors,
    });
    // eslint-disable-next-line
  }, [addCourseDetails.numCourses]);

  // Validators
  const validateAddCourseInput = (field, value, updatedErrors) => {
    switch (field) {
      case "email":
        var re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value.length === 0) updatedErrors[field] = "Cannot be empty";
        else if (!re.test(value)) updatedErrors[field] = "Invalid email!";
        else if (
          !(value.endsWith("@itbhu.ac.in") || value.endsWith("@iitbhu.ac.in"))
        )
          updatedErrors[field] =
            "Invalid domain, accepted domains are @itbhu.ac.in or @iitbhu.ac.in";
        else updatedErrors[field] = "";
        break;
      case "year":
        if (value.length === 0) updatedErrors[field] = "Cannot be empty";
        else if (!/^\d+$/.test(value))
          updatedErrors[field] = "Year should be numerical";
        else if (value.length !== 4)
          updatedErrors[field] = "Length should be exacty 4";
        else if (!(value > 2000))
          updatedErrors[field] = "Year should be greater than 2000";
        else updatedErrors[field] = "";
        break;
      case "numCourses":
        if (value.length === 0) updatedErrors[field] = "Cannot be empty";
        else if (!/^\d+$/.test(value))
          updatedErrors[field] = "Should be numerical";
        else if (value === 0) updatedErrors[field] = "Cannot be 0";
        else updatedErrors[field] = "";
        break;
      case "name":
      case "code":
        if (value.length === 0) updatedErrors[field] = "Cannot be empty";
        else if (value.length > 50)
          updatedErrors[field] = "Length should be smaller than 50";
        else updatedErrors[field] = "";
        break;
      case "sem":
        if (value.length === 0) updatedErrors[field] = "Cannot be empty";
        else if (!(value === 0 || value === 1))
          updatedErrors[field] = "Can only be Even or Odd";
        else updatedErrors[field] = "";
        break;
      case "students":
        if (value.length === 0) updatedErrors[field] = "Cannot be empty";
        else if (!/^\d+$/.test(value))
          updatedErrors[field] = "Should be numerical";
        else if (value.length > 3)
          updatedErrors[field] = "Not more than three digits";
        else updatedErrors[field] = "";
        break;
      default:
        break;
    }
    return updatedErrors;
  };

  // Asyncs:
  const writeToBlockChain = async () => {
    const feedbackData = props.contracts.feedbackData;
    const courses = addCourseDetails.courses;
    if (feedbackData) {
      for (var i = 0; i < courses.length; i++) {
        const { name, code, sem, students } = courses[i];
        let result = await feedbackData.methods
          .addCourse(
            addCourseDetails.year,
            addCourseDetails.email,
            name,
            code,
            sem,
            students
          )
          .send({ from: props.account });

        console.log(result);
        if (result === undefined)
          props.onToastChange(
            `INTERNAL-ERROR: No response for TxN[${i + 1}, ${code}]`,
            "error",
            true
          );
      }
    } else {
      props.onToastChange(
        "INTERNAL-ERROR: Feedback contract not deployed",
        "error",
        true
      );
      console.log("Feedback contract not deployed");
    }
  };

  // Handlers
  const handleAddCourseInputChange = (event) => {
    setAddCourseDetails({
      ...addCourseDetails,
      [event.target.name]: event.target.value,
    });

    let updatedErrors = { ...addCourseErrors };
    updatedErrors = validateAddCourseInput(
      event.target.name,
      event.target.value,
      updatedErrors
    );
    setAddCourseErrors({ ...updatedErrors });
  };

  const handleCourseChange = (event, index) => {
    let updatedCourses = [...addCourseDetails.courses];
    let updatedCourse = { ...updatedCourses[index] };
    updatedCourse[event.target.name] = event.target.value;
    updatedCourses[index] = updatedCourse;

    setAddCourseDetails({
      ...addCourseDetails,
      courses: updatedCourses,
    });

    let updatedErrorses = [...addCourseErrors.courses];
    let updatedErrors = { ...updatedErrorses[index] };
    updatedErrors = validateAddCourseInput(
      event.target.name,
      event.target.value,
      updatedErrors
    );
    updatedErrorses[index] = updatedErrors;
    setAddCourseErrors({ ...addCourseErrors, courses: updatedErrorses });
  };

  const handlerAddCourseSubmit = () => {
    props.onLoading(true);
    let updatedErrors = { ...addCourseErrors };
    let updatedCourseErrorses = [...addCourseErrors.courses];

    for (var key in addCourseDetails) {
      if (addCourseDetails.hasOwnProperty(key)) {
        if (!Array.isArray(addCourseDetails[key])) {
          updatedErrors = validateAddCourseInput(
            key,
            addCourseDetails[key],
            updatedErrors
          );
        } else {
          for (var i = 0; i < addCourseDetails.courses.length; i++) {
            for (var akey in addCourseDetails.courses[i]) {
              if (addCourseDetails.courses[i].hasOwnProperty(akey)) {
                let updatedCourseErrors = { ...updatedCourseErrorses[i] };
                updatedCourseErrors = validateAddCourseInput(
                  akey,
                  addCourseDetails.courses[i][akey],
                  updatedCourseErrors
                );
                updatedCourseErrorses[i] = updatedCourseErrors;
              }
            }
          }
        }
      }
    }
    setAddCourseErrors({ ...updatedErrors, courses: updatedCourseErrorses });
    const fastaddCourseErrors = {
      ...updatedErrors,
      courses: updatedCourseErrorses,
    };

    let ready = true;
    for (var fkey in fastaddCourseErrors) {
      if (fastaddCourseErrors.hasOwnProperty(fkey)) {
        if (!Array.isArray(fastaddCourseErrors[fkey])) {
          if (fastaddCourseErrors[fkey] !== "") ready = false;
        } else {
          if (fastaddCourseErrors[fkey].length === 0) ready = false;
          for (var j = 0; j < fastaddCourseErrors.courses.length; j++)
            for (var ffkey in fastaddCourseErrors.courses[j])
              if (fastaddCourseErrors.courses[j].hasOwnProperty(ffkey))
                if (fastaddCourseErrors.courses[j][ffkey] !== "") ready = false;
        }
      }
    }

    console.log("Ready:", ready);
    console.log(addCourseDetails);

    if (ready) {
      writeToBlockChain()
        .then((r) => {
          console.log(r);
          props.onLoading(false);
          props.onToastChange(
            "TxN SUCCESS: Course(s) have been added",
            "success",
            true
          );
          setTimeout(() => props.closeModal(), 3500);
        })
        .catch((e) => {
          console.log(e);
          if (e.code === "INVALID_ARGUMENT")
            props.onToastChange("ERROR: INVALID_ARGUMENT", "error", true);
          else if (e.code === "4001")
            props.onToastChange("TxN WARN: Denied by user", "warning", true);
          else
            props.onToastChange(
              "TxN ERROR: Something went wrong",
              "error",
              true
            );
        })
        .finally(() => props.onLoading(false));
    }
  };

  return (
    <div className="cards">
      <AddCourseFunctionBox
        data={addCourseDetails}
        errors={addCourseErrors}
        handleInputChange={handleAddCourseInputChange}
        handleCourseChange={handleCourseChange}
        handleSubmit={handlerAddCourseSubmit}
      />
    </div>
  );
};

export default AddCourses;
