"use strict";
const button = document.getElementById("count");
const p = document.getElementById("counter");
let count = 0;
const doCount = () => ++count;
const doShow = () => p.innerHTML = `${count}`;
const doDo = () => [doCount, doShow].forEach(fun => fun());
button.addEventListener("click", doDo);
