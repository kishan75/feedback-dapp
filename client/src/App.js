import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import {
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
  const [profCourses, setProfCourses] = useState(null);
  const [feedbacks, setFeedbacks] = useState(null);

  const [account, setAccount] = useState(null);
  const [showLoader, setLoader] = useState(true);
  const [contracts, setContracts] = useState(null);

  const [skills, setSkills] = useState(null);
  const [isProf, setIsProf] = useState(false);

  // React useEffects
  useEffect(() => {
    (async () => {
      const accountAddress = await setupMetamask();
      setAccount(accountAddress);

      const deployedContracts = await loadContracts();
      setContracts(deployedContracts);

      console.log(deployedContracts);
      const skills = await loadSkills(deployedContracts);
      setSkills(skills);

      const emails = await loadEmails(deployedContracts);
      setProfEmails(emails);

      const profs = await loadProfsByEmail(deployedContracts, emails);
      setProfsDetails(profs.profsDetails);
      setAddressToEmail(profs.addressToEmail);
      setIsProf(profs.addressToEmail[accountAddress] !== undefined);

      const courses = await loadCourses(deployedContracts, emails);
      setProfCourses(courses);

      const { feedbacks, updatedCourses } = await loadFeedbacks(
        deployedContracts,
        emails,
        courses
      );
      setFeedbacks(feedbacks);
      //TODO update course with added feedbacks
      console.log(feedbacks, updatedCourses);

      const { skillsUpvote, updatedProfsDetail } = await loadSkillsCount(
        deployedContracts,
        emails,
        profs
      );
      setSkillCount(skillsUpvote);
      //TODO update profdetails with skills
      console.log(skillsUpvote, updatedProfsDetail);
    })();
    setLoader(false);
  }, []);

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
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
