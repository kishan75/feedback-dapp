import React, { useState } from "react";
import axios from "axios";
import ProfessorDetailsFunctionBox from "../../FunctionBox/ProfessorDetailsFunctionBox/professorDetailsFunctionBox";

import "./professorDetails.css";
import { PYTHON_BASE_URL } from "../../../constants";

const ProfessorDetails = (props) => {
  const uploadEndpoint = `${PYTHON_BASE_URL}upload`;

  const [professorDetails, setProfessorDetails] = useState({
    address: props.account,
    ticket: "",
    name: "Dr. ",
    email: "",
    file: "",
  });

  const [professorErrors, setProfessorErrors] = useState({
    address: "",
    ticket: "",
    name: "",
    email: "",
    file: "",
  });

  const [disableUpload, setDisableUpload] = useState({
    message: "",
    disabled: false,
  });

  // Asyncs:
  const writeToBlockChain = async () => {
    const feedbackData = props.contracts.feedbackData;
    if (feedbackData !== undefined) {
      let result = await feedbackData.methods
        .createProfessor(
          professorDetails.name,
          professorDetails.email,
          "",
          professorDetails.ticket
        )
        .send({ from: professorDetails.address });
      console.log(result);
      return result;
    } else {
      props.onToastChange(
        "INTERNAL-ERROR: Contract not deployed",
        "error",
        true
      );
      console.log("Feedback contract not deployed");
    }
  };

  // Handlers
  const handleProfessorInputChange = (event) => {
    setProfessorDetails({
      ...professorDetails,
      [event.target.name]: event.target.value,
    });

    let updatedErrors = { ...professorErrors };
    updatedErrors = validateProfessorInput(
      event.target.name,
      event.target.value,
      updatedErrors
    );
    setProfessorErrors({ ...updatedErrors });
  };

  const handlerProfessorSubmit = () => {
    props.onLoading(true);
    let updatedErrors = { ...professorErrors };

    for (var key in professorDetails)
      if (professorDetails.hasOwnProperty(key))
        updatedErrors = validateProfessorInput(
          key,
          professorDetails[key],
          updatedErrors
        );

    setProfessorErrors({ ...updatedErrors });
    const fastProfessorErrors = { ...updatedErrors };

    let ready = true;
    for (var fkey in fastProfessorErrors) {
      if (fastProfessorErrors.hasOwnProperty(fkey))
        if (fastProfessorErrors[fkey] !== "") ready = false;
    }

    console.log("Ready:", ready);
    console.log(professorDetails);

    if (ready) {
      writeToBlockChain()
        .then((r) => {
          console.log(r);

          const data = new FormData();
          data.append("image", professorDetails.file);
          data.append("address", professorDetails.address);
          const config = {
            headers: {
              "Content-type": "multipart/form-data",
            },
          };
          axios
            .post(uploadEndpoint, data, config)
            .then((res) => {
              console.log(res);
              props.onToastChange(
                "UPLOAD SUCCESS: Picture uploaded",
                "success",
                true
              );
            })
            .catch((err) => {
              props.onToastChange(
                "UPLOAD ERROR: Something went wrong or already uploaded with current account",
                "error",
                true
              );
              console.log(err);
            });

          props.onToastChange(
            "TxN SUCCESS: You have been registered",
            "success",
            true
          );
          setTimeout(() => props.closeModal(), 3500);
        })
        .catch((e) => {
          if (e.code === "INVALID_ARGUMENT")
            props.onToastChange(
              "ERROR: Ticket should be in hex",
              "error",
              true
            );
          else if (e.code === "4001")
            props.onToastChange("TxN WARN: Denied by user", "warning", true);
          else if (e.code === "-32603")
            props.onToastChange("TxN ERROR: Invalid ticket", "error", true);
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

  // const convertBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader();
  //     fileReader.readAsDataURL(file);
  //     fileReader.onload = () => {
  //       resolve(fileReader.result);
  //     };
  //     fileReader.onerror = (error) => {
  //       console.log(error);
  //       reject(error);
  //     };
  //   });
  // };

  const handleImageFileUpload = async (e) => {
    switch (e.target.name) {
      case "pic":
        // const file = e.target.files[0];
        // const base64 = await convertBase64(file)
        // console.log(base64);
        setDisableUpload({
          message: "Uploaded",
          disabled: true,
        });
        setProfessorDetails({ ...professorDetails, file: e.target.files[0] });

        break;
      default:
        props.onToastChange("ERROR: While uploading file", "error", true);
        console.error("Error while uploading file");
        break;
    }
  };

  // Validators
  const validateProfessorInput = (field, value, updatedErrors) => {
    switch (field) {
      case "name":
        if (value.length === 0)
          updatedErrors[field] = "Cannot be empty";
        else if (value.length < 5)
          updatedErrors[field] = "Length should be greater than 5";
        else if (value.length > 30)
          updatedErrors[field] = "Length should be smaller than 30";
        else updatedErrors[field] = "";
        break;
      case "ticket":
      case "address":
        if (value.length === 0)
          updatedErrors[field] = "Cannot be empty";
        else if (value.length < 10)
          updatedErrors[field] = "Length should be greater than 10";
        else if (value.length > 100)
          updatedErrors[field] = "Length should be smaller than 100";
        else updatedErrors[field] = "";
        break;
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
      case "file":
        if (value.length === 0)
          updatedErrors[field] = ""; // Must upload display picture
        else updatedErrors[field] = "";
        break;
      default:
        break;
    }
    return updatedErrors;
  };

  return (
    <div className="cards">
      <ProfessorDetailsFunctionBox
        data={professorDetails}
        errors={professorErrors}
        handleInputChange={handleProfessorInputChange}
        handleSubmit={handlerProfessorSubmit}
        handleFileChange={handleImageFileUpload}
        disableUpload={disableUpload}
      />
    </div>
  );
};

export default ProfessorDetails;
