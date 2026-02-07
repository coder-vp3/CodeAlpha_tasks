class Calculator {
    constructor() {
        this.displayElement = document.getElementById('display');
        this.historyElement = document.getElementById('history');
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetDisplay = false;

        // Cache DOM references and defaults
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        // Hook up all button clicks
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                const key = button.dataset.key;
                this.handleInput(key);
            });
        });

        // Global keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    handleKeyboard(e) {
        const keyMap = {
            'Enter': 'enter',
            '=': 'enter',
            'Backspace': 'backspace',
            'Delete': 'backspace',
            'c': 'c',
            'C': 'c',
            'Escape': 'c',
            '/': '/',
            '*': '*',
            '-': '-',
            '+': '+',
            '%': '%',
            '.': '.'
        };

        let key = keyMap[e.key] || e.key;

        // Allow digits and mapped control keys
        if (/^[0-9]$/.test(key) || Object.values(keyMap).includes(key)) {
            e.preventDefault();
            this.handleInput(key);
        }
    }

    handleInput(key) {
        if (!key) return;

        if (key === 'c') {
            this.clear();
        } else if (key === 'backspace') {
            this.delete();
        } else if (key === 'enter') {
            this.calculate();
        } else if (['+', '-', '*', '/', '%'].includes(key)) {
            this.setOperation(key);
        } else if (key === '.') {
            this.addDecimal();
        } else if (/^[0-9]$/.test(key)) {
            this.addNumber(key);
        }
    }

    addNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentInput = num;
            this.shouldResetDisplay = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
    }

    addDecimal() {
        if (this.shouldResetDisplay) {
            this.currentInput = '0.';
            this.shouldResetDisplay = false;
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }

    setOperation(op) {
        // Store operation and prepare for next input
        if (this.previousInput !== '' && this.currentInput !== '0') {
            this.calculate();
        }

        this.operation = op;
        this.previousInput = this.currentInput;
        this.shouldResetDisplay = true;
        this.updateHistory();
    }

    calculate() {
        // Compute result for the stored operation
        if (!this.operation || this.previousInput === '') return;

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentInput = 'Error';
                    this.updateDisplay();
                    setTimeout(() => {
                        this.clear();
                    }, 1500);
                    return;
                }
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
        }

        // Round to avoid floating noise
        result = Math.round(result * 100000000) / 100000000;
        this.currentInput = result.toString();
        this.operation = null;
        this.previousInput = '';
        this.shouldResetDisplay = true;

        this.updateDisplay();
        this.historyElement.textContent = '';
    }

    delete() {
        // Backspace one character
        if (this.shouldResetDisplay) return;

        this.currentInput = this.currentInput.slice(0, -1);
        if (this.currentInput === '' || this.currentInput === '-') {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    clear() {
        // Reset everything to defaults
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
        this.historyElement.textContent = '';
    }

    updateDisplay() {
        // Paint current value on screen
        this.displayElement.textContent = this.currentInput;
    }

    updateHistory() {
        // Show previous value and operator
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
            '%': '%'
        };

        if (this.operation && this.previousInput) {
            this.historyElement.textContent = `${this.previousInput} ${symbols[this.operation]}`;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
