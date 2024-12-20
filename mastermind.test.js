import { expect, test, describe, beforeEach } from "bun:test";
import { mastermind } from "./mastermind";

describe("Mastermind Game", () => {
  let consoleLogs = [];
  let promptResponses = [];
  let promptIndex = 0;

  beforeEach(() => {
    consoleLogs = [];
    promptIndex = 0;

    global.console.log = (message) => {
      consoleLogs.push(String(message));
    };

    global.prompt = () => {
      const response = promptResponses[promptIndex];
      promptIndex++;
      return response;
    };
  });

  test("should display correct initial messages", () => {
    promptResponses = [null];
    mastermind();

    expect(consoleLogs[0]).toContain("MASTERMIND");
    expect(consoleLogs[1]).toContain("CREATIVE COMPUTING");
    expect(consoleLogs[2]).toContain("MORRISTOWN, NEW JERSEY");
  });

  test("should handle invalid color input", () => {
    promptResponses = ["ZZZZ", null];
    mastermind();

    expect(consoleLogs.some((log) => log.includes("Invalid input!"))).toBe(
      true
    );
  });

  test("should show game board when requested", () => {
    promptResponses = ["BOARD", null];
    mastermind();

    expect(
      consoleLogs.some((log) => log.includes("GUESS    BLACKS  WHITES"))
    ).toBe(true);
  });

  test("should handle game quit", () => {
    promptResponses = ["QUIT"];
    mastermind();

    expect(
      consoleLogs.some((log) => log.includes("The secret code was:"))
    ).toBe(true);
  });

  test("should calculate pegs correctly for winning guess", () => {
    const originalRandom = Math.random;
    Math.random = () => 0; // This will make the secret code all 'R's

    promptResponses = ["RRRR", "NO"];
    mastermind();

    expect(consoleLogs.some((log) => log.includes("YOU WIN!!"))).toBe(true);

    Math.random = originalRandom;
  });

  test("should handle game over after max moves", () => {
    promptResponses = Array(10).fill("BBBB").concat(["NO"]);
    mastermind();

    expect(consoleLogs.some((log) => log.includes("SORRY, YOU LOSE"))).toBe(
      true
    );
  });
});
