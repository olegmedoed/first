import { expect } from "chai";
import { clearState, becomeUser, goToPage, authUser } from "../helpers";
import {
  challenge,
  clickOnPawn,
  clickOnOfficer,
  startAFightAsChallanger,
  turn
} from "./helpers";

const { ORIGIN } = process.env;

describe("fighting: when user was challenger", function() {
  before(startAFightAsChallanger);

  it("user can't pick a warrior", async function() {
    await clickOnPawn(this.page);
    const len = await this.page.evaluate(
      () =>
        document.querySelectorAll("#my_warriors_positions > div:not(:empty)")
          .length
    );
    expect(len).to.be.equal(0);
  });

  it("user can't click on turn button", async function() {
    const button = await this.page.$("button#turn[disabled]");
    expect(button).is.exist;
  });

  context("when opponent make his step", async function() {
    before(async function() {
      await turn(this.other.page, this.page);
    });

    it("user can pick yet another warrior", async function() {
      await clickOnPawn(this.page);
      const len = await this.page.evaluate(
        () =>
          document.querySelectorAll("#my_warriors_positions #warrior_on_field")
            .length
      );
      expect(len).to.be.equal(1);
    });
  });

  after(async function() {
    await clearState(this.page);
    await clearState(this.other.page);
    await this.db.dropDatabase();
  });
});
