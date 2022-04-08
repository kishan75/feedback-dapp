import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import {
  getBalance,
  loadContracts,
  loadCourses,
  loadEmails,
  loadFeedbacks,
  loadProfsByEmail,
  loadSkills,
  loadSkillsCount,
  setupMetamask,
} from "./scripts/loader";
import { useSnackbar } from "notistack";

// Pages
import HomePage from "./pages/HomePage/homePage";

// Utils

//CSS
import "./App.css";
import Loader from "./components/utils/Loader";
import { Courses } from "./components/Courses/courses";
import { Feedbacks } from "./components/Feedbacks/feedbacks";

require("dotenv").config();

const App = (props) => {
  const [profEmails, setProfEmails] = useState(null);
  const [addressToEmail, setAddressToEmail] = useState(null);

  const [profsDetails, setProfsDetails] = useState(null);
  const [courses, setCourses] = useState(null);

  const [account, setAccount] = useState(null);
  const accountRef = useRef(account);

  const [balance, setBalance] = useState(null);

  const [showLoader, setLoader] = useState(true);
  const [contracts, setContracts] = useState(null);

  const [skills, setSkills] = useState(null);
  const skillsRef = useRef(skills);

  const [isProf, setIsProf] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  // React useEffects
  useEffect(() => {
    (async () => {
      const account = await setupMetamask();
      accountRef.current = account;
      setAccount(account);

      const contracts = await loadContracts();
      setContracts(contracts);

      const skills = await loadSkills(contracts);
      skillsRef.current = skills;
      setSkills(skills);
    })();
  }, []);

  useEffect(() => {
    if (contracts) {
      (async () => {
        const balance = await getBalance(contracts, account);
        setBalance(balance === "0" ? balance : balance.slice(0, -18));

        const profEmails = await loadEmails(contracts);
        setProfEmails(profEmails);

        const { profsDetails, addressToEmail } = await loadProfsByEmail(
          contracts,
          profEmails
        );
        setProfsDetails(profsDetails);
        setAddressToEmail(addressToEmail);
        setIsProf(addressToEmail[account] !== undefined);

        const courses = await loadCourses(contracts, profEmails);
        setCourses(courses);

        const { updatedCourses } = await loadFeedbacks(
          contracts,
          profEmails,
          courses
        );
        setCourses(updatedCourses);

        const { updatedProfsDetail } = await loadSkillsCount(
          contracts,
          profEmails,
          profsDetails
        );
        setProfsDetails(updatedProfsDetail);

        contracts.feedbackData.events.courseUpdated((err, data) =>
          addCourse(err, data)
        );
        contracts.feedbackData.events.feedbackSubmitted((err, data) =>
          feedbackSubmitted(err, data)
        );
        contracts.feedbackData.events.ticketGenerated((err, data) =>
          ticketGenerated(err, data)
        );
        contracts.feedbackData.events.skillsUpvoted((err, data) =>
          skillsUpvoted(err, data)
        );
        contracts.feedbackData.events.ratingUpdated((err, data) =>
          ratingUpdated(err, data)
        );
        contracts.feedbackData.events.balanceUpdated((err, data) =>
          balanceUpdated(err, data)
        );
        contracts.feedbackData.events.professorCreated((err, data) =>
          professorCreated(err, data)
        );

        setLoader(false);
      })();
    }
    // eslint-disable-next-line
  }, [contracts]);

  const balanceUpdated = (err, data) => {
    if (err) alert("something is wrong");

    if (accountRef.current === data["returnValues"].account.toLowerCase()) {
      setBalance(
        data["returnValues"].balance === "0"
          ? data["returnValues"].balance
          : data["returnValues"].balance.slice(0, -18)
      );
    }
  };

  const ratingUpdated = (err, data) => {
    if (err) alert("something is wrong");
    const { email, rating } = data["returnValues"];

    setProfsDetails((prev) => ({
      ...prev,
      [email]: { ...prev[email], rating },
    }));
  };

  const skillsUpvoted = (err, data) => {
    if (err) alert("something is wrong");
    const { email, skills } = data["returnValues"];

    setProfsDetails((prev) => ({
      ...prev,
      [email]: { ...prev[email], skillsUpvote: skills },
    }));
  };

  const professorCreated = (err, data) => {
    if (err) alert("something is wrong");
    const { professor } = data["returnValues"];
    let { name, email, profilePicture, addressId, rating } = professor;
    addressId = addressId.toLowerCase();
    let skillsUpvote = {};
    skillsRef.current.every((skill) => (skillsUpvote[skill] = "0"));

    setProfsDetails((prev) => ({
      ...prev,
      [email]: {
        name,
        email,
        profilePicture,
        addressId,
        rating,
        skillsUpvote,
      },
    }));

    setProfEmails((prev) => {
      return prev.includes(email) ? [...prev] : [...prev, email];
    });
    setAddressToEmail((prev) => ({
      ...prev,
      [addressId]: email,
    }));

    setIsProf(addressId === accountRef);
  };

  const ticketGenerated = (err, data) => {
    if (err) alert("something is wrong");
    const { email, year, sem, code } = data["returnValues"];
    setCourses((prev) => ({
      ...prev,
      [email]: {
        ...prev[email],
        [year]: {
          ...prev[email][year],
          [sem]: {
            ...prev[email][year][sem],
            [code]: {
              ...prev[email][year][sem][code],
              ticketGenerated: true,
            },
          },
        },
      },
    }));
  };

  const feedbackSubmitted = (err, data) => {
    if (err) alert("something is wrong");
    const { email, feedback } = data["returnValues"];
    const { code, semester, year, content, skills } = feedback;

    setCourses((prev) => ({
      ...prev,
      [email]: {
        ...prev[email],
        [year]: {
          ...prev[email][year],
          [semester]: {
            ...prev[email][year][semester],
            [code]: {
              ...prev[email][year][semester][code],
              feedbacks: [
                ...prev[email][year][semester][code].feedbacks,
                {
                  content,
                  skills,
                },
              ],
            },
          },
        },
      },
    }));
  };

  const addCourse = (err, data) => {
    if (err) alert("something is wrong");

    const { email, year, course } = data["returnValues"];
    const { name, code, semester, studentCount, ticketGenerated } = course;

    setCourses((prev) => {
      return prev[email] ? { ...prev } : { ...prev, [email]: {} };
    });

    setCourses((prev) => {
      return prev[email][year]
        ? { ...prev }
        : {
            ...prev,
            [email]: {
              ...prev[email],
              [year]: {},
            },
          };
    });

    setCourses((prev) => {
      return prev[email][year][semester]
        ? { ...prev }
        : {
            ...prev,
            [email]: {
              ...prev[email],
              [year]: {
                ...prev[email][year],
                [semester]: {},
              },
            },
          };
    });

    setCourses((prev) => ({
      ...prev,
      [email]: {
        ...prev[email],
        [year]: {
          ...prev[email][year],
          [semester]: {
            ...prev[email][year][semester],
            [code]: {
              name,
              email,
              code,
              semester,
              year,
              studentCount,
              ticketGenerated,
              feedbacks: [],
            },
          },
        },
      },
    }));
  };

  const handleToastChange = (message, severity, open) => {
    enqueueSnackbar(message, { variant: severity });
  };

  const handleLoaderChange = (show) => {
    setLoader(show);
  };

  return (
    <div className="App">
      <Loader show={showLoader} />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <HomePage
              contracts={contracts}
              profsDetails={profsDetails}
              profsEmails={profEmails}
              account={account}
              emailMap={addressToEmail}
              courses={courses}
              isProf={isProf}
              balance={balance}
              onLoading={handleLoaderChange}
              onToastChange={handleToastChange}
            />
          }
        />
        <Route
          exact
          path=":email/:year"
          element={
            <Courses
              showLoader={() => handleLoaderChange}
              contracts={contracts}
              profsDetails={profsDetails}
              profsEmails={profEmails}
              account={account}
              emailMap={addressToEmail}
              courses={courses}
              isProf={isProf}
              balance={balance}
              onLoading={handleLoaderChange}
              onToastChange={handleToastChange}
            />
          }
        />
        <Route
          exact
          path=":email/:year/:sem/:courseCode"
          element={
            <Feedbacks
              contracts={contracts}
              account={account}
              skills={skills}
              profs={profsDetails}
              showLoader={() => handleLoaderChange}
              courses={courses}
              toast={handleToastChange}
              profsDetails={profsDetails}
              profsEmails={profEmails}
              emailMap={addressToEmail}
              isProf={isProf}
              balance={balance}
              onLoading={handleLoaderChange}
              onToastChange={handleToastChange}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
