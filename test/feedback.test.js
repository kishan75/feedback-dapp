const { assert, expect } = require("chai");

const FeedbackData = artifacts.require("FeedbackData");
const BHUToken = artifacts.require("BHUToken");

require("chai").use(require("chai-as-promised")).should();

function tokensToWei(n) {
  return web3.utils.toWei(n, "ether");
}

contract("FeedbackData", ([]) => {
  let feedbackData;
  let profData = {};
  let profEmails = [];
  var adminKey = "password";

  before(async () => {
    bhuToken = await BHUToken.new();
    feedbackData = await FeedbackData.new(adminKey, bhuToken.address);
    await bhuToken.transfer(feedbackData.address, tokensToWei("1000000"));
  });

  describe("Professors data", async () => {
    it("Has a blank professors ids list", async () => {
      let result = await feedbackData.getProfessorIds();
      expect(result).to.be.empty;
    });

    let prof1;

    it("is checking generate token for professor", async () => {
      let result = await feedbackData.generateTokenForProfReg(adminKey);
      result = result.logs[0].args["token"];
      console.log(result);
      expect(result).to.not.be.undefined;
    });

    it("is creating professor", async () => {
      const name = "kk sir";
      const email = "kk@gmail.com";
      const profilePicture = "";
      let key = await feedbackData.generateTokenForProfReg(adminKey);
      key = key.logs[0].args["token"];

      let result = await feedbackData.createProfessor(
        name,
        email,
        profilePicture,
        key
      );
      result = result.logs[0].args["professor"];

      profData = { ...profData, [email]: result };
      profEmails = [...profEmails, email];

      assert.equal(result["name"], name, "name is correct");
      assert.equal(result["email"], email, "email is correct");
      assert.equal(result["rating"]["preDecimal"], 0, "rating is correct");
      assert.equal(result["rating"]["postDecimal"], 0, "rating is correct");
      assert.notEqual(result["addressId"], 0x0, "address id is not null");
    });

    it("Has professors id list with length 1", async () => {
      let result = await feedbackData.getProfessorIds();
      expect(result).to.have.lengthOf(1).to.include(profEmails[0]);
    });

    ["1@gmail", "2@gm"].forEach((email) => {
      it("is creating professor", async () => {
        const name = "kk sir";
        const profilePicture = "";
        let key = await feedbackData.generateTokenForProfReg(adminKey);
        key = key.logs[0].args["token"];

        let result = await feedbackData.createProfessor(
          name,
          email,
          profilePicture,
          key
        );
        result = result.logs[0].args["professor"];

        profData = { ...profData, [email]: result };
        profEmails = [...profEmails, email];

        assert.equal(result["name"], name, "name is correct");
        assert.equal(result["email"], email, "email is correct");
        assert.equal(result["rating"]["preDecimal"], 0, "rating is correct");
        assert.equal(result["rating"]["postDecimal"], 0, "rating is correct");
        assert.notEqual(result["addressId"], 0x0, "address id is not null");
      });
    });

    it(
      "Has professors id list with length " +
        (profEmails.length + 1).toString(),
      async () => {
        let result = await feedbackData.getProfessorIds();
        expect(result)
          .to.have.lengthOf(profEmails.length)
          .to.include.members(profEmails);
      }
    );
  });

  // describe("all test function are here", async () => {
  //   it("able to create ", async () => {
  //     let result = await feedbackData.testFunction();
  //     console.log(result);
  //   });
  // });

  describe("Course creation check", async () => {
    it("creating new course", async () => {
      let year = 2024;
      let profEmail = profEmails[0];
      let name = "hjhk";
      let code = "hjk";
      let sem = 0;
      let studentCount = 21;
      let result = await feedbackData.addCourse(
        year,
        profEmail,
        name,
        code,
        sem,
        studentCount
      );

      expect(result.logs[0].args["course"]).to.not.be.undefined;
    });
  });

  describe("Getting Professors data", async () => {
    it("fetched prof course detail count", async () => {
      let result = await feedbackData.getCourses(profEmails[0]);
      expect(result).to.have.lengthOf(1);
    });
  });

  describe("Course creation check", async () => {
    [2001, 2005, 2007].forEach(async (year) => {
      it("creating new multiple course", async () => {
        let profEmail = profEmails[1];
        let name = "network security";
        let sem = 0;
        let code = "hkjhk";
        let studentCount = 21;
        let result = await feedbackData.addCourse(
          year,
          profEmail,
          name,
          code,
          sem,
          studentCount
        );

        expect(result.logs[0].args["course"]).to.not.be.undefined;
      });
    });
  });

  describe("Getting Professors data", async () => {
    it("fetched prof course detail count", async () => {
      // let result = await feedbackData.getProfesssorAllDetails(profEmails[1]);
      // let {
      //   name,
      //   code,
      //   semester,
      //   year,
      //   studentCount,
      //   ticketGenerated,
      //   tickets,
      // } = result[1][0][0];
      // console.log(
      //   name,
      //   code,
      //   semester,
      //   year,
      //   studentCount,
      //   ticketGenerated,
      //   tickets
      // );
      // console.log(result[1]);
    });
  });

  describe("ticket generation", async () => {
    const email = "7878@gmail.com";
    const year = 2024;
    const code = "hjk";
    const sem = 0;
    const studentCount = 15;

    it("is creating professor", async () => {
      let name = "kk sir";
      const profilePicture = "";
      let key = await feedbackData.generateTokenForProfReg(adminKey);
      key = key.logs[0].args["token"];

      let result = await feedbackData.createProfessor(
        name,
        email,
        profilePicture,
        key
      );
      result = result.logs[0].args["professor"];
      expect(result).to.not.be.undefined;
    });

    it("creating new course", async () => {
      let name = "hjhk";
      let result = await feedbackData.addCourse(
        year,
        email,
        name,
        code,
        sem,
        studentCount
      );
      expect(result.logs[0].args["course"]).to.not.be.undefined;
    });

    it(`is generating ticket for email : ${email}, year : ${year}, code : ${code}`, async () => {
      let seed = "just one";
      let result = await feedbackData.generateTickets(
        email,
        year,
        sem,
        code,
        seed
      );
      expect(result.logs[0].args["tickets"]).to.have.lengthOf(studentCount);
    });
  });

  describe("feedbacks", async () => {
    const email = "78";
    const year = 202;
    const code = "hjfgk";
    const sem = 1;
    const studentCount = 15;
    const updatedRating = {
      preDecimal: 3,
      postDecimal: 4,
    };

    it("is creating professor", async () => {
      let name = "kk sir";
      const profilePicture = "";
      let key = await feedbackData.generateTokenForProfReg(adminKey);
      key = key.logs[0].args["token"];

      let result = await feedbackData.createProfessor(
        name,
        email,
        profilePicture,
        key
      );
      result = result.logs[0].args["professor"];
      expect(result).to.not.be.undefined;
    });

    it("creating new course", async () => {
      let name = "hjhk";
      let result = await feedbackData.addCourse(
        year,
        email,
        name,
        code,
        sem,
        studentCount
      );
      expect(result.logs[0].args["course"]).to.not.be.undefined;
    });

    it("generating tickets and feedback submission", async () => {
      let seed = "just one";

      let result = await feedbackData.generateTickets(
        email,
        year,
        sem,
        code,
        seed
      );
      expect(result.logs[0].args["tickets"]).to.have.lengthOf(studentCount);
      let tickets = result.logs[0].args["tickets"];

      result = await feedbackData.getFacultySkills();
      let skills = result;

      for (let i = 0; i < studentCount; i++) {
        let ticket = tickets[i];
        let feedback = {
          code,
          semester: sem,
          year,
          content: "best prof in the world",
          skills,
        };

        let result = await feedbackData.submitFeedback(
          email,
          ticket,
          updatedRating,
          feedback
        );
        // console.log(result.logs[0], result.logs[1]);
        // expect(result.logs[0].args["skills"])
        //   .to.be.an("array")
        //   .include.all.members(skills);
        // expect(result.logs[0].args["content"]).to.equal(feedback.content);
      }
    });
  });

  describe("Get all details", async () => {
    it("fetching all emails and data", async () => {
      let emails = await feedbackData.getProfessorIds();
      result = await feedbackData.getCoursesByEmails(emails);
      console.log(result);
    });
  });
});
