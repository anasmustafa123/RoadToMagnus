export class StatsClass {
  constructor() {
    this.specification = {
      book: 0,
      brilliant: 0,
      great: 0,
      best: 0,
      excellent: 0,
      good: 0,
      forced: 0,
      inaccuracy: 0,
      mistake: 0,
      blunder: 0,
      missed: 0,
      botezgambit: 0,
    };
    this.gameType = {
      rapid: 0,
      blitz: 0,
      bullet: 0,
      daily: 0,
    };
    this.innergameResult = {
      time: 0,
      check: 0,
      res: 0,
      agree: 0,
      stall: 0,
      rep: 0,
      ins: 0,
      timeinsuf: 0,
      fifty: 0,
    };
    this.gameResult = {
      win: { ...this.innergameResult },
      lose: { ...this.innergameResult },
      draw: { ...this.innergameResult },
    };
  }
  readonly innergameResult;
  readonly gameResult;
  readonly gameType;
  readonly specification;

  private getinitial = (key: "cl" | "gt" | "gr_inner" | "gr_outer") => {
    let initialMap = {
      cl: this.specification,
      gt: this.gameType,
      gr_outer: this.gameResult,
      gr_inner: this.innergameResult,
    };
    return initialMap[key];
  };

  filter(obj: any, type: "cl" | "gt" | "gr_inner" | "gr_outer") {
    const initialMap = this.getinitial(type);
    let newobj: any = {};
    Object.keys(obj).forEach((key) => {
      // @ts-ignore
      if (typeof obj[key] == "object" && type === "gr_outer") {
        newobj[key] = this.filter(obj[key], "gr_inner");
      } else {
        if (key in initialMap) {
          newobj[key] = obj[key];
        }
      }
    });

    return newobj;
  }

  /**
   * @param props.type: "cl": classificatio | "gt": gametype | "gr": gameresult;
   * @param props.initial if not given will merge the input object with emoty object
   * @functionality merge the inital object with the input object
   *  incase of missing initial object it add missing keys with 0 values
   */
  merge: (props: {
    type: "cl" | "gt" | "gr_inner" | "gr_outer";
    input: any;
    initial?: any;
  }) => {
    result: string;
    verbose: any;
  } = ({ type, input, initial }) => {
    if (!initial) {
      initial = {...this.getinitial(type)};
    }
    let verbose: any[] = [];
    if (type === "gr_outer" || type === "gr_inner") {
      Object.keys(input).forEach((outerkey) => {
        if (
          outerkey in initial &&
          outerkey in input &&
          typeof input[outerkey] === "object"
        ) {
          verbose.push({ [outerkey]: [] });
          Object.keys(input[outerkey]).forEach((innerkey) => {
            if (innerkey in initial[outerkey] && innerkey in input[outerkey])
              verbose[verbose.length - 1][outerkey].push({
                [innerkey]: {
                  from: initial[outerkey][innerkey],
                  to: initial[outerkey][innerkey] + input[outerkey][innerkey],
                },
              });
            initial[outerkey][innerkey] =
              initial[outerkey][innerkey] + input[outerkey][innerkey];
          });
        }
      });
      console.log(initial);
      console.log(JSON.stringify(initial));
      return { result: JSON.stringify(initial), verbose };
    } else {
      let verbose: object[] = [];
      Object.keys(input).forEach((key) => {
        if (key in initial && key in input)
          verbose.push({
            [key]: { from: initial[key], to: initial[key] + input[key] },
          });
        initial[key] = initial[key] + input[key];
      });
      console.log(initial);
      console.log(JSON.stringify(initial));
      return { result: JSON.stringify(initial), verbose };
    }
  };
}

//module.exports = StatsClass;
