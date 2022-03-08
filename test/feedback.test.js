const web3Utils = require("web3-utils");
const { assert, expect } = require("chai");

const FeedbackData = artifacts.require("FeedbackData");

require("chai").use(require("chai-as-promised")).should();

contract("FeedbackData", ([]) => {
  let feedbackData;
  let profData = {};
  let profEmails = [];

  before(async () => {
    feedbackData = await FeedbackData.new();
  });

  describe("Professors data", async () => {
    it("Has a blank professors ids list", async () => {
      let result = await feedbackData.getProfessorIds();
      expect(result).to.be.empty;
    });

    let prof1;

    it("is checking generate token for professor", async () => {
      let result = await feedbackData.generateTokenForProfReg();
      result = result.logs[0].args["token"];
      console.log(result);
      expect(result).to.not.be.undefined;
    });

    it("is creating professor", async () => {
      const name = "kk sir";
      const email = "kk@gmail.com";
      let key = await feedbackData.generateTokenForProfReg();
      key = key.logs[0].args["token"];

      let result = await feedbackData.createProfessor(name, email, key);
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
        let key = await feedbackData.generateTokenForProfReg();
        key = key.logs[0].args["token"];

        let result = await feedbackData.createProfessor(name, email, key);
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
      let year = 2023;
      let profEmail = profEmails[0];
      let name = "network security";
      let code = "SB124";
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
      console.log(result.logs[0].args["course"]);
    });
  });

  describe("Getting Professors data", async () => {
    it("fetched prof course detail count", async () => {
      let result = await feedbackData.getProfesssorAllDetails(profEmails[0]);
      console.log(result);
    });
  });

  describe("Course creation check", async () => {
    ["just", "one", "just"].forEach(async (code) => {
      it("creating new multiple course", async () => {
        let year = 2023;
        let profEmail = profEmails[0];
        let name = "network security";
        let code = "SB124";
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
      });
    });
  });
  describe("Getting Professors data", async () => {
    it("fetched prof course detail count", async () => {
      let result = await feedbackData.getProfesssorAllDetails(profEmails[0]);
      console.log(result);
    });
  });

});
