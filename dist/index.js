"use strict";
const catFrame00 = [
    "--@----@--",
    "--@@--@@--",
    "--@@@@@@--",
    "-@@@@@@@@-",
    "-@@@@@@@@-",
    "--@@@@@@--",
    "---@@@@---",
    "--@@@@@@--",
    "--@@@@@@--",
    "-@@@@@@@@-",
    "-@@@@@@@@-",
    "@@@@@@@@@@",
    "@@@@@@@@@@",
];
const catFrame01 = [
    "--@----@--",
    "--@@--@@--",
    "--@@@@@@--",
    "-@@@@@@@@-",
    "-@@@@@@@@-",
    "--@@@@@@--",
    "-@-@@@@-@-",
    "--@@@@@@--",
    "--@@@@@@--",
    "-@@@@@@@@-",
    "-@@@@@@@@-",
    "-@@@@@@@@-",
    "-@@@@@@@@-",
    "-@@@@@@@@-",
    "-@@@@@@@@-",
    "--@@@@@@--",
    "--@-@@-@--",
    "--@-@@-@--",
    "----@@----",
    "----@@----",
    "----@@----",
];
const catFrames = [catFrame00, catFrame01];
const can = document.getElementById("can");
const ctx = can.getContext("2d");
const width = 400;
const heigth = 400;
const fps = 60;
const mspf = Math.floor(1000 / 60);
const renderClear = () => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, heigth);
};
const renderFrame = (x, y, frame, mult = 1) => {
    const translate = {
        "@": "black",
        "-": "white"
    };
    frame.flatMap((line, yOff) => line.split("")
        .map((pixel, xOff) => ({ color: translate[pixel], yOff, xOff })))
        .forEach(data => {
        ctx.fillStyle = data.color;
        ctx.fillRect((x + mult * data.xOff), (y + mult * data.yOff), mult, mult);
    });
};
const renderCat = () => {
    ctx.fillStyle = "black";
};
const renderTitle = () => {
    ctx.font = "48px Roboto";
    ctx.textAlign = "center";
    ctx.fillText("open the door", 200, 200);
    ctx.font = "12px Roboto";
    ctx.fillText("<press space/>", 200, 250);
};
let space = false;
const spacePress = () => space = true;
const spaceRealese = () => space = false;
const controllAction = (act) => (event) => event.code == "Space" && act();
document.addEventListener("keydown", controllAction(spacePress));
document.addEventListener("keyup", controllAction(spaceRealese));
const start = async () => {
    if (space)
        states = onStart;
    ctx.fillStyle = "black";
    renderTitle();
};
let fade = 0;
const onStart = async () => {
    ctx.fillStyle = `rgb(${fade},${fade},${fade})`;
    ;
    renderTitle();
    fade += 10;
    if (fade >= 255)
        states = catFloor;
};
const antiAlising = (pos) => Math.floor(pos) + 0.5;
const door = () => {
    const doorW = 100;
    const doorH = 200;
    const doorX = width / 2 - doorW / 2 - 25;
    const doorY = heigth - doorH;
    const render = () => {
        ctx.fillStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(antiAlising(doorX), antiAlising(doorY), doorW, doorH);
    };
    return { x: doorX, y: doorY, h: doorH, w: doorW, render };
};
const lock = () => {
    const { x: doorX, w: doorW, h: doorH } = door();
    const lockW = 20;
    const lockH = 5;
    const lockX = doorX + doorW - lockW - 5;
    const lockY = doorH + 79;
    const render = () => {
        ctx.fillStyle = "black";
        ctx.fillRect(lockX, lockY, lockW, lockH);
    };
    return { render, y: lockY };
};
const cat = (state) => {
    const { x, y, frame } = state ?? {};
    const mult = 2;
    const frameCat = frame ?? catFrames[0];
    const catY = y ?? (heigth - mult * frameCat.length);
    const catX = x ?? (width / 2);
    const render = () => renderFrame(catX, catY, frameCat, mult);
    return { frame: frameCat, x: catX, y: catY, render, pawY: catY + mult * 6 };
};
const renderAllDoor = () => {
    door().render();
    lock().render();
};
let miau = cat();
const catJumping = async () => {
    miau = cat({ frame: catFrame01, y: miau.y - 2 });
    miau.render();
    if (miau.pawY < lock().y)
        states = catEnd;
    renderAllDoor();
};
const catEnd = async () => {
    miau.render();
    renderAllDoor();
};
const catFloor = async () => {
    cat().render();
    renderAllDoor();
    if (space)
        states = catJumping;
};
let states = start;
const loop = async () => {
    renderClear();
    await states();
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
