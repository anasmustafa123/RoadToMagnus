const StatsClass = require("./_Stats");

describe("StatsClass", () => {
  let statsclass = new StatsClass();
  it("filter()", async () => {
    expect(
      statsclass.filter(
        { good: 5, great: 20, goood: 20, god: 15, greet: 30 },
        "cl"
      )
    ).toEqual({
      good: 5,
      great: 20,
    });
    expect(
      statsclass.filter(
        {
          win: { good: 5, agree: 5 },
          draw: { res: 0, ress: 15, agree: 0, stll: 15, stall: 0, rep: 0 },
          good: 5,
          great: 20,
          goood: 20,
          god: 15,
          greet: 30,
        },
        "gr_outer"
      )
    ).toEqual({
      win: { agree: 5 },
      draw: { res: 0, agree: 0, stall: 0, rep: 0 },
    });

    expect(
      statsclass.filter(
        {
          win: { check: 5 },
          lose: {},
        },
        "gr_outer"
      )
    ).toEqual({ win: { check: 5 }, lose: {} });
  });
});
