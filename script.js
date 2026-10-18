function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "ERROR";
    }

    return a / b;
}

function operate(operator, a, b) {
    switch (operator) {
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case "/":
            return divide(a, b);
        default:
            return null;
    }
}

let currentInput = "0";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let justCalculated = false;
let errorMessage = null;

const display = document.querySelector("#display");
const buttons = document.querySelector(".buttons");

function updateDisplay() {
    display.textContent = errorMessage ?? currentInput;
}

function clearCalculator() {
    currentInput = "0";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    justCalculated = false;
    errorMessage = null;

    updateDisplay();
}

function formatResult(number) {
    if (!Number.isFinite(number)) {
        return "ERROR";
    }

    return String(Number(number.toPrecision(10)));
}

function inputDigit(digit) {
    if (errorMessage) {
        clearCalculator();
    }

    if (justCalculated) {
        currentInput = digit;
        justCalculated = false;
        firstNumber = null;
        operator = null;
        waitingForSecondNumber = false;
        updateDisplay();
        return;
    }

    if (waitingForSecondNumber) {
        currentInput = digit;
        waitingForSecondNumber = false;
    } else if (currentInput === "0") {
        currentInput = digit;
    } else if (currentInput === "-0") {
        currentInput = "-" + digit;
    } else {
        currentInput += digit;
    }

    updateDisplay();
}

function inputDecimal() {
    if (errorMessage) {
        clearCalculator();
    }

    if (justCalculated) {
        currentInput = "0";
        justCalculated = false;
        firstNumber = null;
        operator = null;
        waitingForSecondNumber = false;
    }

    if (waitingForSecondNumber) {
        currentInput = "0.";
        waitingForSecondNumber = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function calculate() {
    if (
        operator === null ||
        firstNumber === null ||
        waitingForSecondNumber
    ) {
        return false;
    }

    const secondNumber = Number(currentInput);
    const result = operate(operator, firstNumber, secondNumber);

    if (result === "ERROR") {
        currentInput = "0";
        firstNumber = null;
        operator = null;
        waitingForSecondNumber = false;
        justCalculated = false;
        errorMessage = "Nice try! Can't divide by zero.";
        updateDisplay();
        return false;
    }

    currentInput = formatResult(result);
    firstNumber = Number(currentInput);
    operator = null;
    waitingForSecondNumber = false;
    justCalculated = true;
    errorMessage = null;

    updateDisplay();
    return true;
}

function inputOperator(nextOperator) {
    if (errorMessage) {
        clearCalculator();
        return;
    }

    if (operator !== null && !waitingForSecondNumber) {
        if (!calculate()) {
            return;
        }
    } else if (operator === null && !justCalculated) {
        firstNumber = Number(currentInput);
    }

    operator = nextOperator;
    waitingForSecondNumber = true;
    justCalculated = false;
}

function backspace() {
    if (errorMessage) {
        clearCalculator();
        return;
    }

    if (justCalculated) {
        clearCalculator();
        return;
    }

    if (waitingForSecondNumber) {
        return;
    }

    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);

        if (currentInput === "-") {
            currentInput = "0";
        }
    } else {
        currentInput = "0";
    }

    updateDisplay();
}

buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    if (button.dataset.digit !== undefined) {
        inputDigit(button.dataset.digit);
    } else if (button.dataset.operator) {
        inputOperator(button.dataset.operator);
    } else {
        switch (button.dataset.action) {
            case "clear":
                clearCalculator();
                break;
            case "equals":
                if (!errorMessage) {
                    calculate();
                }
                break;
            case "decimal":
                inputDecimal();
                break;
            case "backspace":
                backspace();
                break;
        }
    }
});

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        inputDigit(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
        inputOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();

        if (!errorMessage) {
            calculate();
        }
    } else if (key === ".") {
        inputDecimal();
    } else if (key === "Backspace") {
        backspace();
    } else if (key === "Escape" || key.toLowerCase() === "c") {
        clearCalculator();
    }
});

updateDisplay();
