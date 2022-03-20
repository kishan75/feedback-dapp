import React, { useState, useEffect } from "react";
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

// Pages
import HomePage from "./pages/HomePage/homePage";
import FeedbackSubmit from "./components/FeedbackSubmit/feedbackSubmit";

// Utils
import Toast from "./components/utils/toast";

//CSS
import "./App.css";
import Loader from "./components/utils/Loader";
import { Courses } from "./components/Courses";
import { Feedbacks } from "./components/feedbacks";

require("dotenv").config();

const App = () => {
  const [profEmails, setProfEmails] = useState(null);
  const [addressToEmail, setAddressToEmail] = useState(null);

  const [profsDetails, setProfsDetails] = useState(null);
  const [skillCount, setSkillCount] = useState(null);
  const [courses, setCourses] = useState(null);

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showLoader, setLoader] = useState(true);
  const [toast, setToast] = useState(null);
  const [contracts, setContracts] = useState(null);

  const [skills, setSkills] = useState(null);
  const [isProf, setIsProf] = useState(false);

  // React useEffects
  useEffect(() => {
    (async () => {
      const account = await setupMetamask();
      setAccount(account);

      const contracts = await loadContracts();
      setContracts(contracts);

      const toast = { message: "", type: "", show: false };
      setToast(toast);
    })();
  }, []);

  useEffect(() => {
    if (contracts) {
      (async () => {
        const skills = await loadSkills(contracts);
        setSkills(skills);

        const balance = await getBalance(contracts, account);
        setBalance(balance);

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

        const { feedbacks, updatedCourses } = await loadFeedbacks(
          contracts,
          profEmails,
          courses
        );
        setCourses(updatedCourses);

        const { skillsUpvote, updatedProfsDetail } = await loadSkillsCount(
          contracts,
          profEmails,
          profsDetails
        );
        setSkillCount(skillsUpvote);
        setProfsDetails(updatedProfsDetail);

        contracts.feedbackData.events.professorCreated((err, data) =>
          professorCreated(err, data)
        );
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

        setLoader(false);
      })();
    }
  }, [contracts]);

  const balanceUpdated = (err, data) => {
    if (err) alert("something is wrong");

    if (account == data["returnValues"].account)
      setBalance(data["returnValues"].balance);
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

    setProfsDetails((prev) => ({
      ...prev,
      [email]: {
        name,
        email,
        profilePicture,
        addressId,
        rating,
        skillsUpvote: [],
      },
    }));

    setProfEmails((prev) => [...prev, email]);
    setAddressToEmail((prev) => ({
      ...prev,
      [addressId]: email,
    }));
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
                  code,
                  semester,
                  year,
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

  // Very toasty
  const handleToastClose = (_, reason) => {
    if (reason === "clickaway") return;
    setToast({ ...toast, show: false });
  };

  const handleToastChange = (message, severity, open) => {
    console.log(message, severity, open);
    setToast({ message: message, type: severity, show: open });
  };

  const handleLoaderChange = (show) => {
    setLoader(show);
  };

  return (
    <div className="App">
      <Loader show={showLoader} />
      {toast ? (
        <Toast
          onClose={handleToastClose}
          message={toast.message}
          show={toast.show}
          type={toast.type}
        />
      ) : null}
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
              balance={balance}
              onLoading={handleLoaderChange}
              onToastChange={handleToastChange}
              isProf={isProf}
            />
          }
        />
        <Route
          exact
          path=":email/:year"
          element={
            <Courses showLoader={() => handleLoaderChange} courses={courses} />
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
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
