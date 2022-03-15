import BHUTokenJSON from "../contracts/BHUToken.json";
import FeedbackDataJSON from "../contracts/FeedbackData.json";
import Web3 from "web3";

export const loadContracts = async () => {
  const networkId = await window.web3.eth.net.getId();
  let bhuTokenNetwork = BHUTokenJSON.networks[networkId];
  var bhuToken = null;
  if (bhuTokenNetwork) {
    bhuToken = new window.web3.eth.Contract(
      BHUTokenJSON.abi,
      bhuTokenNetwork.address
    );
  } else {
    alert(" BhuToken contract is not deployed on this blockchain");
  }
  let feedbackDataNetwork = FeedbackDataJSON.networks[networkId];
  var feedbackData = null;
  if (feedbackDataNetwork) {
    feedbackData = new window.web3.eth.Contract(
      FeedbackDataJSON.abi,
      feedbackDataNetwork.address
    );
  } else {
    alert(" Feedback contract is not deployed on this blockchain");
  }
  return { bhuToken, feedbackData };
};

// Web3 loading needs to be updated
export const setupMetamask = async () => {
  if (!window.ethereum) {
    alert("please install metamask first");
    return;
  }
  window.ethereum.on("accountsChanged", () => {
    window.location.reload();
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });

  window.web3 = new Web3(window.ethereum);
  window.web3.eth.handleRevert = true;

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  if (accounts.length && accounts[0]) return accounts[0];
  else {
    alert("please connect to metamask first");
    return null;
  }
};

export const loadSkills = async (contracts) => {
  let result = await contracts.feedbackData.methods.getFacultySkills().call();
  return result;
};

export const loadEmails = async (contracts) => {
  let result = await contracts.feedbackData.methods.getProfessorIds().call();
  return result;
};

export const loadProfsByEmail = async (contracts, emails) => {
  let result = await contracts.feedbackData.methods
    .getProfessorsDetailsByIds(emails)
    .call();
  let profsDetails = {};
  let addressToEmail = {};

  result.forEach((prof) => {
    let { name, email, profilePicture, addressId, rating } = prof;
    addressId.toLowerCase();

    profsDetails[email] = {
      name,
      email,
      profilePicture,
      addressId,
      rating,
    };
    addressToEmail[addressId] = email;
  });

  return { profsDetails, addressToEmail };
};

export const loadCourses = async (contracts, emails) => {
  let result = await contracts.feedbackData.methods
    .getCoursesByEmails(emails)
    .call();
  let profCourses = {};
  for (let i = 0; i < emails.length; i++) {
    let email = emails[i];
    let courses = result[i];
    let yearWise = {};
    courses = [].concat(...courses);

    courses.forEach((course) => {
      const { name, code, semester, year, studentCount } = course;
      if (yearWise[year] === undefined) yearWise[year] = {};
      if (yearWise[year][semester] === undefined) yearWise[year][semester] = {};
      yearWise[year][semester][code] = {
        name,
        code,
        semester,
        year,
        studentCount,
        feedbacks: [],
      };
    });

    profCourses[email] = yearWise;
  }
  return profCourses;
};

export const loadFeedbacks = async (contracts, emails, courses) => {
  let result = await contracts.feedbackData.methods
    .getFeedbacksByEmails(emails)
    .call();
  let feedbacks = {};
  for (let i = 0; i < emails.length; i++) {
    let email = emails[i];
    let courseFeedbacks = result[i];
    let yearWise = {};
    courseFeedbacks = [].concat(...courseFeedbacks);

    courseFeedbacks.forEach((feedback) => {
      const { code, semester, year, content, skills } = feedback;

      if (yearWise[year] === undefined) yearWise[year] = {};
      if (yearWise[year][semester] === undefined) yearWise[year][semester] = {};

      yearWise[year][semester][code] = {
        code,
        semester,
        year,
        content,
        skills,
      };

      courses[email][year][semester][code].feedbacks.push({ content, skills });
    });

    feedbacks[email] = yearWise;
    let updatedCourses = courses;
  }
  return { feedbacks, updatedCourses };
};

export const loadSkillsCount = async (contracts, emails, profsDetails) => {
  let result = await contracts.feedbackData.methods
    .getSkillsUpvotesByEmails(emails)
    .call();

  let skillsUpvote = {};
  for (let i = 0; i < emails.length; i++) {
    let email = emails[i];
    let skills = {};

    result[i].forEach((skill) => {
      const { name, count } = skill;

      skills[name] = count;
    });

    skillsUpvote[email] = skills;
    profsDetails["skillsUpvote"] = skills;
  }

  return { skillsUpvote, updatedProfsDetail: profsDetails };
};

export const getBalance = async (contracts, address) => {
  let balance = await contracts.feedbackData.methods
    .checkBalance(address)
    .call();
  return balance;
};
