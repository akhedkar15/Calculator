const display = document.getElementById('display');
const confettiVideo = document.getElementById('background-video');
let displayValue = '';
let internalValue = '';

function appendNumber(number) {
    displayValue += number.toString();
    internalValue += number.toString();
    updateDisplay();
}

function appendOperator(operator) {
    displayValue += operator;
    internalValue += operator;
    updateDisplay();
}

function appendDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
        internalValue += '.';
        updateDisplay();
    }
}

function clearDisplay() {
    displayValue = '';
    internalValue = '';
    updateDisplay();
    hideConfetti();
}

function deleteLast() {
    displayValue = displayValue.toString().slice(0, -1);
    internalValue = internalValue.toString().slice(0, -1);
    updateDisplay();
}

function calculateResult() {
    try {
        // Format the internal value to replace operators and functions
        let formattedExpression = internalValue
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/sin\(([^)]+)\)/g, 'Math.sin(toRadians($1))')
            .replace(/cos\(([^)]+)\)/g, 'Math.cos(toRadians($1))')
            .replace(/tan\(([^)]+)\)/g, 'Math.tan(toRadians($1))')
            .replace(/log\(([^)]+)\)/g, 'Math.log($1)')
            .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)');

        // Log the formatted expression for debugging
        console.log('Formatted Expression:', formattedExpression);

        // Safely evaluate the formatted expression
        let result = Function('"use strict";return (' + formattedExpression + ')')();
        
        // Check for Infinity or NaN results
        if (!isFinite(result) || isNaN(result)) {
            throw new Error('Invalid result');
        }
        
        displayValue = result.toString();
        internalValue = result.toString();
        showConfetti();
    } catch (error) {
        console.error('Calculation error:', error);
        displayValue = 'Error';
        internalValue = '';
    }
    updateDisplay();
}

function appendFunction(func) {
    const functionMappings = {
        'sin': 'Math.sin(toRadians(',
        'cos': 'Math.cos(toRadians(',
        'tan': 'Math.tan(toRadians(',
        'log': 'Math.log(',
        'sqrt': 'Math.sqrt('
    };

    displayValue += func + '(';
    if (func in functionMappings) {
        internalValue += functionMappings[func];
    } else {
        internalValue += func + '(';
    }
    updateDisplay();
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function updateDisplay() {
    display.innerText = displayValue || '0';
}

function showConfetti() {
    confettiVideo.classList.remove('hidden');
    confettiVideo.play();
}

function hideConfetti() {
    confettiVideo.classList.add('hidden');
    confettiVideo.pause();
    confettiVideo.currentTime = 0;
}
