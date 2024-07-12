import { attackers } from "./evaluate.js";
import { Chess } from "chess.js";


describe("attackers: note a piece is an attacker even if it's pinned", () => {
  it("black", () => {
    let game = new Chess(
      "r1b1kbnr/pppp1pp1/2n4p/3N4/1q2P3/P2p1N2/1PPB1PPP/R2QKB1R b KQkq - 1 9"
    );
    expect(attackers("b4", "b", game)).toEqual(
      expect.arrayContaining([
        { type: "b", color: "b", square: "f8" },
        { type: "n", color: "b", square: "c6" },
      ])
    );
  });

  it("white", () => {
    let game = new Chess(
      "r1b1kbnr/pppp1pp1/2n4p/3N4/1q2P3/P2p1N2/1PPB1PPP/R2QKB1R b KQkq - 1 9"
    );
    expect(attackers("b4", "w", game)).toEqual(
      expect.arrayContaining([
        { type: "p", color: "w", square: "a3" },
        { type: "n", color: "w", square: "d5" },
        { type: "b", color: "w", square: "d2" },
      ])
    );
    expect(attackers("e1", "w", game)).toEqual(
      expect.arrayContaining([
        { type: "n", color: "w", square: "f3" },
        { type: "q", color: "w", square: "d1" },
        { type: "b", color: "w", square: "d2" },
      ])
    );
  });
});
