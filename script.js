function convert() {
  let numberInput = document.getElementById("numberInput").value.trim(); // changed to 'let'
  const fromBase = document.getElementById("fromBase").value;
  const toBase = document.getElementById("toBase").value;
  let result = "";
  let decimalNumber; // 🟢 declare it here so it's available everywhere in the function

  // Clear any previous error message and explanation
  document.getElementById("result").innerText = "";
  document.getElementById("explanationText").innerText = "";

  if (fromBase === "hexadecimal") {
    numberInput = numberInput.toUpperCase();
  }

  if (numberInput === "") {
    displayError("Please enter a number.");
    document.getElementById("explanationText").innerText = "";
    return;
  }

  if (!isValidInput(numberInput, fromBase)) {
    displayError(`Invalid input for ${fromBase} base.`);
    return;
  }

  try {
    // Convert input to decimal
    if (fromBase === "decimal") {
      decimalNumber = parseInt(numberInput, 10);
    } else if (fromBase === "binary") {
      decimalNumber = parseInt(numberInput, 2);
    } else if (fromBase === "octal") {
      decimalNumber = parseInt(numberInput, 8);
    } else if (fromBase === "hexadecimal") {
      decimalNumber = parseInt(numberInput, 16);
    }

    if (isNaN(decimalNumber)) {
      displayError("Conversion error: Invalid number format.");
      return;
    }

    result = convertToBase(decimalNumber, toBase);
  } catch (error) {
    displayError("An unexpected error occurred during conversion.");
    console.error(error);
    return;
  }

  const resultEl = document.getElementById("result");
  resultEl.innerText = `Converted Result: ${result}`;
  resultEl.style.color = "green";

  resultEl.classList.remove("result-animate");
  void resultEl.offsetWidth;
  resultEl.classList.add("result-animate");

  // Now this works fine
  generateExplanation(numberInput, fromBase, toBase, decimalNumber, result);
}

document
  .getElementById("numberInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      convert();
    }
  });

// Function to validate input based on the selected base
function isValidInput(input, base) {
  const regexMap = {
    decimal: /^[0-9]+$/,
    binary: /^[01]+$/,
    octal: /^[0-7]+$/,
    hexadecimal: /^[0-9A-Fa-f]+$/,
  };

  return regexMap[base].test(input);
}

// Function to convert decimal to another base
function convertToBase(decimalNumber, toBase) {
  switch (toBase) {
    case "decimal":
      return decimalNumber;
    case "binary":
      return decimalNumber.toString(2);
    case "octal":
      return decimalNumber.toString(8);
    case "hexadecimal":
      return decimalNumber.toString(16).toUpperCase();
    default:
      return "Invalid target base.";
  }
}

// Function to display error messages
function displayError(message) {
  document.getElementById("result").style.color = "red";
  document.getElementById("result").innerText = `Error: ${message}`;
}

function swapBases() {
  const from = document.getElementById("fromBase");
  const to = document.getElementById("toBase");
  [from.value, to.value] = [to.value, from.value];
}
function clearAll() {
  document.getElementById("numberInput").value = "";
  document.getElementById("result").innerText = "";
  document.getElementById("result").style.color = "";
  document.getElementById("explanationText").innerText = "";
}

function copyResult() {
  const text = document
    .getElementById("result")
    .innerText.replace("Converted Result: ", "");
  navigator.clipboard
    .writeText(text)
    .then(() => alert("Result copied to clipboard!"))
    .catch((err) => alert("Failed to copy: " + err));
}
function generateExplanation(input, fromBase, toBase, decimalNumber, result) {
  const explanationEl = document.getElementById("explanationText");
  let explanation = "";

  // Step 1: Converting to decimal (if not already)
  if (fromBase !== "decimal") {
    explanation += `🔢 Step 1: Convert <b>${input}</b> from <b>${fromBase}</b> to decimal:<br>`;
    
    const baseMap = { binary: 2, octal: 8, hexadecimal: 16 };
    const base = baseMap[fromBase];

    const digits = input.toUpperCase().split('').reverse();
    let steps = digits.map((char, idx) => {
      const value = parseInt(char, base);
      return `${char} × ${base}<sup>${idx}</sup> = ${value * Math.pow(base, idx)}`;
    });

    explanation += steps.reverse().join("<br>") + `<br>`;
    explanation += `➡️ Sum = <b>${decimalNumber}</b><br><br>`;
  } else {
    explanation += `🔢 Step 1: The input is already in decimal: <b>${decimalNumber}</b><br><br>`;
  }

  // Step 2: Convert from decimal to target base
  if (toBase !== "decimal") {
    explanation += `🔄 Step 2: Convert <b>${decimalNumber}</b> from decimal to <b>${toBase}</b>:<br>`;

    const baseMap = { binary: 2, octal: 8, hexadecimal: 16 };
    const base = baseMap[toBase];

    let number = decimalNumber;
    let steps = [];

    while (number > 0) {
      let remainder = number % base;
      let quotient = Math.floor(number / base);
      let formatted = (toBase === "hexadecimal" && remainder >= 10)
        ? `${remainder} → ${remainder.toString(16).toUpperCase()}`
        : remainder;

      steps.push(`${number} ÷ ${base} = ${quotient} remainder ${formatted}`);
      number = quotient;
    }

    explanation += steps.join("<br>");
    explanation += `<br>➡️ Final result (reversed remainders): <b>${result}</b>`;
  } else {
    explanation += `✅ Step 2: Target base is decimal. Final result: <b>${result}</b>`;
  }

  explanationEl.innerHTML = explanation;
}

