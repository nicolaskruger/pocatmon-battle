const button = document.getElementById("count") as HTMLButtonElement;
const p = document.getElementById("counter") as HTMLParagraphElement;
let count = 0;

const doCount = () => ++count;
const doShow = () => p.innerHTML = `${count}`;

const doDo = () => [doCount, doShow].forEach(fun => fun())

button.addEventListener("click", doDo);
