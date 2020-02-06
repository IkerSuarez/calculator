const display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");

let currentDisplay = "0";
let operatorActive = false;
let operatorName;
let equalOperatorName;
let equalActive = false;
let accumulated;

const operators = {
  add: (add = (num1, num2 = 0) => num1 + num2),
  subtract: (subtract = (num1, num2 = 0) => num1 - num2),
  multiply: (multiply = (num1, num2 = 1) => num1 * num2),
  divide: (divide = (num1, num2 = 1) => num1 / num2)
};

const operate = (operator, num1, num2) => {
  accumulated = Math.round(operators[operator](num1, num2) * 1000000) / 1000000;
  if (accumulated.toString().length > 11) {
    accumulated = accumulated.toExponential(6);
  }
};

display.textContent = currentDisplay;

buttons.forEach(elem =>
  elem.addEventListener("click", e => {
    switch (e.target.dataset.type) {
      case "number":
        if (equalActive) {
          accumulated = undefined;
          equalActive = false;
          equalOperatorName = undefined;
        }
        if (operatorActive) {
          currentDisplay = e.target.value;
          display.textContent = currentDisplay;
          operatorActive = false;
        } else if (
          currentDisplay.length < 11 ||
          (currentDisplay.length < 12 && currentDisplay.includes("."))
        ) {
          currentDisplay == "0"
            ? (currentDisplay = e.target.value)
            : (currentDisplay += e.target.value);
          display.textContent = currentDisplay;
        }
        break;

      case "period":
        if (operatorActive) {
          currentDisplay = "0.";
          display.textContent = currentDisplay;
          operatorActive = false;
        }
        if (!currentDisplay.includes(".") && currentDisplay.length < 11) {
          currentDisplay += ".";
          display.textContent = currentDisplay;
        }
        break;

      case "operator":
        equalActive = false;
        if (operatorName && !operatorActive) {
          operate(operatorName, accumulated * 1, currentDisplay * 1);
          operatorName = e.target.value;
          operatorActive = true;
          display.textContent = accumulated;
        } else if (accumulated == undefined) {
          accumulated = currentDisplay;
          operatorName = e.target.value;
          operatorActive = true;
        } else {
          operatorName = e.target.value;
          operatorActive = true;
        }
        break;

      case "clear":
        equalActive = false;
        operatorActive = false;
        operatorName = undefined;
        accumulated = undefined;
        equalOperatorName = undefined;
        currentDisplay = "0";
        display.textContent = currentDisplay;
        break;

      case "equal":
        equalActive = true;
        if (operatorName || equalOperatorName) {
          operate(
            operatorName || equalOperatorName,
            accumulated * 1,
            currentDisplay * 1
          );
          if (operatorName) {
            equalOperatorName = operatorName;
            operatorName = undefined;
          }
          display.textContent = accumulated;
          operatorActive = true;
        }
        break;
    }
  })
);
