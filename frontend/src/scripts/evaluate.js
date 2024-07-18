const attackers = (square, plColor, game) => {
  let y = square[0].charCodeAt(0),
    x = parseInt(square[1]);
  let attackers = [];
  // check rank
  console.log("checking rankfile");
  let filerankinc = [
    { xinc: 0, yinc: 1 },
    { xinc: 1, yinc: 0 },
    { xinc: 0, yinc: -1 },
    { xinc: -1, yinc: 0 },
  ];

  filerankinc.forEach((value) => {
    let newx = x + value.xinc;
    let newy = y + value.yinc;
    for (let i = 1; i < 8; i++) {
      if (
        (newx == x && newy == y) ||
        ((newx > 8 || newx < 0) && newy > "h".charCodeAt(0)) ||
        newy < "a".charCodeAt(0)
      )
        break;
      let possibleAttacker = game.get(`${String.fromCharCode(newy)}${newx}`);
      console.log(`${String.fromCharCode(newy)}${newx}`);
      console.log(possibleAttacker);
      if (
        possibleAttacker &&
        possibleAttacker.color == plColor &&
        (possibleAttacker.type == "r" ||
          possibleAttacker.type == "q" ||
          (possibleAttacker.type == "k" && Math.abs(newx - x) == 1))
      ) {
        console.log("added");
        attackers.push({
          ...possibleAttacker,
          square: `${String.fromCharCode(newy)}${newx}`,
        });
        break;
      } else if (possibleAttacker) {
        break;
      }
      newx += value.xinc;
      newy += value.yinc;
    }
  });

  //diagonal work
  let diagonalInc = [
    { xinc: 1, yinc: 1 },
    { xinc: -1, yinc: 1 },
    { xinc: 1, yinc: -1 },
    { xinc: -1, yinc: -1 },
  ];
  diagonalInc.forEach((value) => {
    let newx = x + value.xinc;
    let newy = y + value.yinc;
    for (let i = 1; i < 8; i++) {
      if (
        (newx != x && newy == y) ||
        ((newx > 8 || newx < 0) && newy > "h".charCodeAt(0)) ||
        newy < "a".charCodeAt(0)
      )
        break;
      let possibleAttacker = game.get(`${String.fromCharCode(newy)}${newx}`);
      if (
        possibleAttacker &&
        possibleAttacker.color == plColor &&
        (possibleAttacker.type == "b" ||
          possibleAttacker.type == "q" ||
          (possibleAttacker.type == "p" && x - newx == 1))
      ) {
        attackers.push({
          ...possibleAttacker,
          square: `${String.fromCharCode(newy)}${newx}`,
        });
        break;
      } else if (possibleAttacker) {
        break;
      }
      newx += value.xinc;
      newy += value.yinc;
    }
  });

  let nightDirec = [
    { xinc: 2, yinc: -1 },
    { xinc: 2, yinc: 1 },
    { xinc: -2, yinc: 1 },
    { xinc: -2, yinc: -1 },
    { xinc: -1, yinc: 2 },
    { xinc: 1, yinc: 2 },
    { xinc: -1, yinc: -2 },
    { xinc: 1, yinc: -2 },
  ];
  nightDirec.forEach((val) => {
    let newx = x + val.xinc,
      newy = y + val.yinc;
    if (newx <= 8 || newy <= "h".charCodeAt(0)) {
      let possibleAttacker = game.get(`${String.fromCharCode(newy)}${newx}`);
      if (
        possibleAttacker &&
        possibleAttacker.type == "n" &&
        possibleAttacker.color == plColor
      ) {
        attackers.push({
          ...possibleAttacker,
          square: `${String.fromCharCode(newy)}${newx}`,
        });
      }
    }
  });

  return attackers;
};

const pinned = () => {};

export { attackers };
