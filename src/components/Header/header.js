import React, { useState, useEffect } from "react";
import { stack as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import ProfessorDetails from "../Modals/ProfessorDetails/professorDetails";
import GenerateTickets from "../Modals/GenerateTickets/generateTickets";
import AddCourseDetails from "../Modals/AddCourses/addCourses";
import Canteen from "../Modals/Canteen/canteen";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { red } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import Modal from "@mui/material/Modal";

import "./header.scss";

import Logo from "./../../assets/bhu-logo.png";
import LogoMin from "./../../assets/bhu-logo-min.png";

const Header = (props) => {
  const breakpoint1 = 100;
  const breakpoint2 = 630;
  const professor = props.isProf;

  const [width, setWidth] = useState(window.innerWidth);
  const [breakpoint, setBreakpoint] = useState(breakpoint1);
  const [displayTokens, setDisplayTokens] = useState(false);

  // For ProfessorRegtry Modal
  const [openProfessorRegistry, setOpenProfessorRegistry] = useState(false);
  const handleOpenProfessorRegistry = () => setOpenProfessorRegistry(true);
  const handleCloseProfessorRegistry = () => setOpenProfessorRegistry(false);

  // For GenerateTickets Modal
  const [openGenerateTickets, setOpenGenerateTickets] = useState(false);
  const handleOpenGenerateTickets = () => setOpenGenerateTickets(true);
  const handleCloseGenerateTickets = () => setOpenGenerateTickets(false);

  // For AddCourses Modal
  const [openAddCourses, setOpenAddCourses] = useState(false);
  const handleOpenAddCourses = () => setOpenAddCourses(true);
  const handleCloseAddCourses = () => setOpenAddCourses(false);

  // For Canteen Modal
  const [openCanteen, setOpenCanteen] = useState(false);
  const handleOpenCanteen = () => setOpenCanteen(true);
  const handleCloseCanteen = () => setOpenCanteen(false);

  const resizeHeaderOnScroll = () => {
    const distanceY = window.pageYOffset || document.documentElement.scrollTop,
      shrinkOn = 10,
      headerEl = document.getElementById("header");

    if (distanceY > shrinkOn) {
      if (headerEl) headerEl.classList.add("sticky");
      setBreakpoint(69420);
    } else {
      if (headerEl) headerEl.classList.remove("sticky");
      setBreakpoint(100);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
    window.addEventListener("scroll", resizeHeaderOnScroll);
  }, []);

  return (
    <header className="header" id="header">
      {width > breakpoint2 ? (
        <div className="wrap">
          <div className="logo">
            <Link to="/">
              {width > breakpoint ? (
                <img src={Logo} alt="BHU Logo" />
              ) : (
                <img src={LogoMin} alt="BHU Logo" />
              )}
            </Link>
          </div>

          <div className="navbar">
            <ul>
              <li>
                {professor ? (
                  width > breakpoint ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleOpenGenerateTickets}
                    >
                      {" "}
                      Generate Tickets{" "}
                    </Button>
                  ) : (
                    <Button
                      color="error"
                      size="small"
                      onClick={handleOpenGenerateTickets}
                    >
                      {" "}
                      Generate Tickets{" "}
                    </Button>
                  )
                ) : width > breakpoint ? (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleOpenCanteen}
                  >
                    {" "}
                    Virtual Canteen{" "}
                  </Button>
                ) : (
                  <Button
                    color="error"
                    size="small"
                    onClick={handleOpenCanteen}
                  >
                    {" "}
                    Virtual Canteen{" "}
                  </Button>
                )}
              </li>
              <Modal
                open={openGenerateTickets}
                onClose={handleCloseGenerateTickets}
                aria-labelledby="generate-tickets"
                aria-describedby="For ticket distribution via mail"
              >
                <Box sx={styleGenTickets}>
                  <GenerateTickets
                    {...props}
                    closeModal={handleCloseGenerateTickets}
                  />
                </Box>
              </Modal>

              <Modal
                open={openCanteen}
                onClose={handleCloseCanteen}
                aria-labelledby="canteen"
                aria-describedby="For ordering from canteen"
              >
                <Box sx={styleGenTickets}>
                  <Canteen {...props} closeModal={handleCloseCanteen} />
                </Box>
              </Modal>
              <li>
                {professor ? (
                  width > breakpoint ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleOpenAddCourses}
                    >
                      {" "}
                      Add Courses{" "}
                    </Button>
                  ) : (
                    <Button
                      color="error"
                      size="small"
                      onClick={handleOpenAddCourses}
                    >
                      {" "}
                      Add Courses{" "}
                    </Button>
                  )
                ) : width > breakpoint ? (
                  <Button variant="outlined" color="error">
                    {" "}
                    Chat Box{" "}
                  </Button>
                ) : (
                  <Button color="error" size="small">
                    {" "}
                    Chat Box{" "}
                  </Button>
                )}
              </li>
              <Modal
                open={openAddCourses}
                onClose={handleCloseAddCourses}
                aria-labelledby="generate-tickets"
                aria-describedby="For ticket distribution via mail"
              >
                <Box sx={styleAddCourses}>
                  <AddCourseDetails
                    {...props}
                    closeModal={handleCloseAddCourses}
                  />
                </Box>
              </Modal>
              <li>
                {width > breakpoint ? (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleOpenProfessorRegistry}
                  >
                    {" "}
                    Professor Registry{" "}
                  </Button>
                ) : (
                  <Button
                    color="error"
                    size="small"
                    onClick={handleOpenProfessorRegistry}
                  >
                    {" "}
                    Professor Registry{" "}
                  </Button>
                )}
              </li>
              <Modal
                open={openProfessorRegistry}
                onClose={handleCloseProfessorRegistry}
                aria-labelledby="professor-registry"
                aria-describedby="Register professor to database"
              >
                <Box sx={styleProfessorDetails}>
                  <ProfessorDetails
                    {...props}
                    closeModal={handleCloseProfessorRegistry}
                  />
                </Box>
              </Modal>
            </ul>
          </div>

          <div className="statistics">
            <ul>
              <li>
                {width > breakpoint ? (
                  <div className="addressFont"> ADDRESS: {props.account}</div>
                ) : null}
                {width > breakpoint ? (
                  <div className="tokenFont"> BALANCE </div>
                ) : null}
                <Avatar
                  sx={{ bgcolor: red[900] }}
                  onClick={() => setDisplayTokens(!displayTokens)}
                >
                  {displayTokens ? (
                    props.balance
                  ) : width > breakpoint ? (
                    <CurrencyBitcoinIcon fontSize="large" />
                  ) : (
                    <CurrencyBitcoinIcon fontSize="small" />
                  )}
                </Avatar>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        [
          <div className="wrap">
            <div className="logo">
              <Link to="/">
                <img src={LogoMin} alt="BHU Logo" />
              </Link>
            </div>
          </div>,
          <div className="statistics">
            <Avatar
              sx={{ bgcolor: red[900] }}
              onClick={() => setDisplayTokens(!displayTokens)}
            >
              {displayTokens ? (
                props.balance
              ) : (
                <CurrencyBitcoinIcon fontSize="large" />
              )}
            </Avatar>
          </div>,
          <Menu right>
            <Button color="error" size="small">
              {" "}
              Redeem Tokens{" "}
            </Button>
            <Button color="error" size="small">
              {" "}
              Virtual Canteen{" "}
            </Button>
          </Menu>,
        ]
      )}
    </header>
  );
};

export default Header;

const styleProfessorDetails = {
  position: "absolute",
  top: "50%",
  left: "50%",
  overflow: "scroll",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "50%",
  bgcolor: "#00000099",
  border: "2px solid #000",
  boxShadow: 24,
  p: 0,
};

const styleAddCourses = {
  ...styleProfessorDetails,
  width: "50%",
  height: "70%",
};

const styleGenTickets = {
  ...styleProfessorDetails,
  width: "50%",
  height: "70%",
};
