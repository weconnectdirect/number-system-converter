function convert() {
    const numberInput = document.getElementById("numberInput").value.trim();
    const fromBase = document.getElementById("fromBase").value;
    const toBase = document.getElementById("toBase").value;
    let result = '';

    // Clear any previous error message
    document.getElementById("result").innerText = '';

    // Input validation
    if (numberInput === "") {
        displayError("Please enter a number.");
        return;
    }

    // Check if the number is valid based on the selected base
    if (!isValidInput(numberInput, fromBase)) {
        displayError(`Invalid input for ${fromBase} base.`);
        return;
    }

    try {
        let decimalNumber;

        // Convert the input number to decimal based on the selected base
        if (fromBase === "decimal") {
            decimalNumber = parseInt(numberInput, 10);
        } else if (fromBase === "binary") {
            decimalNumber = parseInt(numberInput, 2);
        } else if (fromBase === "octal") {
            decimalNumber = parseInt(numberInput, 8);
        } else if (fromBase === "hexadecimal") {
            decimalNumber = parseInt(numberInput, 16);
        }

        // Ensure the number was parsed correctly
        if (isNaN(decimalNumber)) {
            displayError("Conversion error: Invalid number format.");
            return;
        }

        // Convert decimal to the selected target base
        result = convertToBase(decimalNumber, toBase);

    } catch (error) {
        displayError("An unexpected error occurred during conversion.");
        console.error(error);
        return;
    }

    document.getElementById("result").innerText = `Converted Result: ${result}`;
}

// Function to validate input based on the selected base
function isValidInput(input, base) {
    const regexMap = {
        decimal: /^[0-9]+$/,
        binary: /^[01]+$/,
        octal: /^[0-7]+$/,
        hexadecimal: /^[0-9A-Fa-f]+$/
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
