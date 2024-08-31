
// version 1
/* async function a1() {
    throw new Error("error from a1");
  return await fetch("uuiii");
}
async function b1() {
  a1().then((d)=>{
    return d;
  })
}
async function c1() {
  try {
    let res = await b1();
    console.log(res);
  } catch (e) {
    console.error(`caught error ${e}`);
  }
}

c1(); */

// version 2
async function a2() {
  throw new Error("error from a2");
  //return await fetch("uuiii");
}
async function b2() {
  try {
    a2()
      .then((d) => {
        return d;
      })
      .catch((e) => {
        console.error(`caught error by b2-inner: ${e}`);
      });
  } catch (e) {
    console.error(`caught error by b2-outer: ${e}`);
  }
}
async function c2() {
  try {
    let res = await b2();
    console.log(res);
  } catch (e) {
    console.error(`caught error by c2 ${e}`);
  }
}

c2();
