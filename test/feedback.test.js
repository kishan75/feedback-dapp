const { assert, expect } = require("chai");

const FeedbackData = artifacts.require("FeedbackData");

require("chai").use(require("chai-as-promised")).should();

contract("FeedbackData", ([]) => {
  let feedbackData;

  before(async () => {
    feedbackData = await FeedbackData.new();
  });

  describe("Professors data", async () => {
    it("Has a blank professors ids list", async () => {
      let result = await feedbackData.getProfessorIds();
      expect(result).to.be.empty;
    });

    let prof1;

    it("is creating professor", async () => {
      const name = "kk sir";
      const email = "kk@gmail.com";
      let result = await feedbackData.createProfessor(name, email);
      result = result.logs[0].args["professor"];
      prof1 = result;
      assert.equal(result["name"], name, "name is correct");
      assert.equal(result["email"], email, "email is correct");
      assert.equal(result["rating"]["preDecimal"], 0, "rating is correct");
      assert.equal(result["rating"]["postDecimal"], 0, "rating is correct");
      assert.notEqual(result["addressId"], 0x0, "address id is not null");
    });

    it("Has professors id list with length 1", async () => {
      let result = await feedbackData.getProfessorIds();
      expect(result).to.have.lengthOf(1).to.include(prof1["email"]);
    });

    let ids = ["1@gmail", "2@gm", "3", "4"].map((email) => {
      it("is creating professor", async () => {
        const name = "kk sir";
        let result = await feedbackData.createProfessor(name, email);
        result = result.logs[0].args["professor"];
        prof1 = result;
        assert.equal(result["name"], name, "name is correct");
        assert.equal(result["email"], email, "email is correct");
        assert.equal(result["rating"]["preDecimal"], 0, "rating is correct");
        assert.equal(result["rating"]["postDecimal"], 0, "rating is correct");
        assert.notEqual(result["addressId"], 0x0, "address id is not null");
      });
      return email;
    });

    it(
      "Has professors id list with length " + (ids.length + 1).toString,
      async () => {
        let result = await feedbackData.getProfessorIds();
        expect(result)
          .to.have.lengthOf(ids.length + 1)
          .to.include.members(ids);
      }
    );
  });
});
