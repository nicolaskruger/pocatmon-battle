const catFrame00 = [
  "---------@----@--",
  "---------@@--@@--",
  "---------@@@@@@--",
  "--------@@@@@@@@-",
  "--------@@@@@@@@-",
  "---------@@@@@@--",
  "----------@@@@---",
  "---------@@@@@@--",
  "---------@@@@@@--",
  "--------@@@@@@@@-",
  "--------@@@@@@@@-",
  "-------@@@@@@@@@@",
  "-------@@@@@@@@@@",
]

const catFrame01 = [
  "---------@----@--",
  "---------@@--@@--",
  "---------@@@@@@--",
  "--------@@@@@@@@-",
  "---@----@@@@@@@@-",
  "----@----@@@@@@--",
  "----@-----@@@@---",
  "-----@---@@@@@@--",
  "------@--@@@@@@--",
  "-------@@@@@@@@@-",
  "--------@@@@@@@@-",
  "-------@@@@@@@@@@",
  "-------@@@@@@@@@@",
]

const catFrames = [catFrame00, catFrame01]
const can = document.getElementById("can") as HTMLCanvasElement;
const ctx = can.getContext("2d")!;

const width = 400;
const heigth = 400;

const fps = 60;
const mspf = Math.floor(1000 / 60);

const renderClear = () => {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, heigth);
}

const renderFrame = (x: number, y: number, frame: string[], mult = 1) => {
  const translate: { [key: string]: string } = {
    "@": "black",
    "-": "white"
  }
  frame.flatMap((line, yOff) =>
    line.split("")
      .map((pixel, xOff) => ({ color: translate[pixel], yOff, xOff })
      ))
    .forEach(data => {
      ctx.fillStyle = data.color;
      ctx.fillRect((x + mult * data.xOff), (y + mult * data.yOff), mult, mult)
    })
}

const renderCat = () => {
  ctx.fillStyle = "black";
}

const renderTitle = () => {
  ctx.font = "48px Roboto";
  ctx.textAlign = "center";
  ctx.fillText("open the door", 200, 200)
  ctx.font = "12px Roboto";
  ctx.fillText("<press space/>", 200, 250)
}

let space = false;

const spacePress = () => space = true;
const spaceRealese = () => space = false;

const controllAction = (act: () => void) => (event: KeyboardEvent) => event.code == "Space" && act();

document.addEventListener("keydown", controllAction(spacePress));
document.addEventListener("keyup", controllAction(spaceRealese));

const start = async () => {
  if (space) states = onStart
  ctx.fillStyle = "black";
  renderTitle();
}

let fade = 0;
const onStart = async () => {
  ctx.fillStyle = `rgb(${fade},${fade},${fade})`;;
  renderTitle();
  fade += 10;
  if (fade >= 255) states = catFloor
}

const catFloor = async () => {
  const mult = 2;
  const [cat00] = catFrames
  const y = heigth - mult * cat00.length;
  const x = width / 2;
  renderFrame(x, y, cat00, mult)
}

let states = start;

const loop = async () => {
  renderClear();
  await states();
}

const run = async () => {
  const begin = performance.now();
  await loop();
  const end = performance.now();

  const duration = end - begin;

  const negativeDefault = (value: number, def: number) => value > 0 ? value : def;

  setTimeout(run, negativeDefault(mspf - duration, 100))
}

run();
