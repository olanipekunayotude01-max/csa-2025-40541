const student = requireAuth("student");
document.getElementById("who").textContent = student.name + " · " + student.cls;
renderAnnouncements(document.getElementById("announcements"));

function grade(s) { return s >= 70 ? "A" : s >= 60 ? "B" : s >= 50 ? "C" : s >= 45 ? "D" : "F"; }

const mine = load("abd_scores", []).filter(r => r.studentId === student.id);
document.getElementById("results").innerHTML = mine.length
  ? mine.map(r => `<tr><td>${esc(r.subject)}</td><td>${r.score}</td><td>${grade(r.score)}</td></tr>`).join("")
  : '<tr><td colspan="3" class="empty">No results published yet.</td></tr>';

const calculatorDisplay = document.getElementById("calcDisplay");
let calcValue = "0";
let calcStored = null;
let calcOperator = null;
let calcWaiting = false;

function formatCalcValue(value) {
  if (!Number.isFinite(value)) return "Error";
  if (Object.is(value, -0)) value = 0;
  return Number(value.toPrecision(12)).toString();
}

function updateCalcDisplay(value) {
  calcValue = value;
  calculatorDisplay.textContent = value;
}

function inputCalcDigit(digit) {
  if (calcValue === "Error") clearCalc();
  updateCalcDisplay(calcWaiting || calcValue === "0" ? digit : calcValue + digit);
  calcWaiting = false;
}

function inputCalcDecimal() {
  if (calcValue === "Error") clearCalc();
  if (calcWaiting) {
    updateCalcDisplay("0.");
    calcWaiting = false;
  } else if (!calcValue.includes(".")) {
    updateCalcDisplay(calcValue + ".");
  }
}

function clearCalc() {
  calcStored = null;
  calcOperator = null;
  calcWaiting = false;
  updateCalcDisplay("0");
}

function backspaceCalc() {
  if (calcValue === "Error") return clearCalc();
  if (calcWaiting) return;
  updateCalcDisplay(calcValue.length > 1 ? calcValue.slice(0, -1) : "0");
}

function percentCalc() {
  if (calcValue === "Error") return;
  updateCalcDisplay(formatCalcValue(parseFloat(calcValue) / 100));
}

function calculate(first, second, operator) {
  const a = parseFloat(first);
  const b = parseFloat(second);
  if (operator === "+") return a + b;
  if (operator === "-") return a - b;
  if (operator === "*") return a * b;
  if (operator === "/") return b === 0 ? NaN : a / b;
  return b;
}

function chooseCalcOperator(operator) {
  if (calcValue === "Error") return;
  if (calcOperator && !calcWaiting) {
    calcStored = formatCalcValue(calculate(calcStored, calcValue, calcOperator));
    if (calcStored === "Error") {
      updateCalcDisplay("Error");
      calcOperator = null;
      calcWaiting = true;
      return;
    }
  } else {
    calcStored = calcValue;
  }
  calcOperator = operator;
  calcWaiting = true;
  updateCalcDisplay(calcStored);
}

function equalsCalc() {
  if (!calcOperator || calcStored === null || calcValue === "Error") return;
  const result = formatCalcValue(calculate(calcStored, calcValue, calcOperator));
  calcOperator = null;
  calcStored = null;
  calcWaiting = true;
  updateCalcDisplay(result);
}

document.querySelectorAll(".calc-key").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "digit") inputCalcDigit(button.dataset.value);
    if (action === "decimal") inputCalcDecimal();
    if (action === "clear") clearCalc();
    if (action === "backspace") backspaceCalc();
    if (action === "percent") percentCalc();
    if (action === "operator") chooseCalcOperator(button.dataset.value);
    if (action === "equals") equalsCalc();
  });
});

document.addEventListener("keydown", event => {
  if (event.target.matches("input, textarea, select")) return;
  if (/^\d$/.test(event.key)) inputCalcDigit(event.key);
  else if (event.key === ".") inputCalcDecimal();
  else if (["+", "-", "*", "/"].includes(event.key)) chooseCalcOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") equalsCalc();
  else if (event.key === "Escape") clearCalc();
  else if (event.key === "Backspace") backspaceCalc();
  else if (event.key === "%") percentCalc();
  else return;
  event.preventDefault();
});
