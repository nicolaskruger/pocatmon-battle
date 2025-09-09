const can = document.getElementById("can") as HTMLCanvasElement;
const ctx = can.getContext("2d")!;

ctx.font = "48px Roboto";
ctx.textAlign = "center";
ctx.fillText("open the door", 200, 200)
ctx.font = "12px Roboto";
ctx.fillText("<press space/>", 200, 250)
