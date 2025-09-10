"use strict";
const can = document.getElementById("can");
const ctx = can.getContext("2d");
const fps = 60;
const mspf = Math.floor(1000 / 60);
ctx.font = "48px Roboto";
ctx.textAlign = "center";
ctx.fillText("open the door", 200, 200);
ctx.font = "12px Roboto";
ctx.fillText("<press space/>", 200, 250);
let count = 0;
const loop = async () => {
    console.log(++count);
};
const run = async () => {
    const begin = performance.now();
    await loop();
    const end = performance.now();
    const duration = end - begin;
    const negativeDefault = (value, def) => value > 0 ? value : def;
    setTimeout(run, negativeDefault(mspf - duration, 100));
};
run();
