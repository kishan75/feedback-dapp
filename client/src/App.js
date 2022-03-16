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

import "./App.css";
import { Loader } from "./components/utils/Loader";

require('dotenv').config()

const App = () => {
  const [profEmails, setProfEmails] = useState(null);
  const [addressToEmail, setAddressToEmail] = useState(null);

  const [profsDetails, setProfsDetails] = useState(null);
  const [skillCount, setSkillCount] = useState(null);
  const [courses, setCourses] = useState(null);

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [showLoader, setLoader] = useState(true);
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
    const { name, email, profilePicture, addressId, rating } = professor;
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

    setProfEmails([...profEmails, email]);
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
        [year]: {
          ...prev[email][year],
          [semester]: {
            ...prev[email][year][semester],
            [code]: {
              feedback: [
                ...prev[email][year][semester].feedback,
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

    if (courses[email] == undefined)
      setCourses((prev) => ({
        ...prev,
        [email]: {},
      }));

    if (courses[email][year] == undefined)
      setCourses((prev) => ({
        ...prev,
        [email]: {
          ...prev[email],
          [year]: {},
        },
      }));

    if (courses[email][year][semester] == undefined)
      setCourses((prev) => ({
        ...prev,
        [email]: {
          ...prev[email],
          [year]: {
            ...prev[email][year],
            [semester]: {},
          },
        },
      }));

    setCourses((prev) => ({
      ...prev,
      [email]: {
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

  return (
    <div className="App">
      <Loader show={showLoader}></Loader>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <HomePage
              contracts={contracts}
              profsDetails={profsDetails}
              account={account}
              emailMap={addressToEmail}
              courses={courses}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
