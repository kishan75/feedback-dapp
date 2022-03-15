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
  const [feedbacks, setFeedbacks] = useState(null);

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
        setFeedbacks(feedbacks);
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

        setLoader(false);
      })();
    }
  }, [contracts]);

  const professorCreated = (err, data) => {
    if (err) alert("something is wrong");
    const { professor } = data["returnValues"];
    const { name, email, profilePicture, addressId, rating } = professor;
    setProfsDetails((prev) => ({
      ...prev,
      [email]: { name, email, profilePicture, addressId, rating },
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
