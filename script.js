// Transaction object that holds details of each transaction
const Transaction = {
    create(type, amount, description) {
        return {
            type: type, // 'income' or 'expense'
            amount: amount,
            description: description,
            date: new Date(),

            // Getter for formatted date
            getFormattedDate() {
                return this.date.toLocaleDateString();
            }
        };
    }
};

// FinanceTracker object that will handle transactions
const FinanceTracker = {
    transactions: [], // A collection of transactions

    // Add a transaction
    addTransaction(type, amount, description) {
        const transaction = Transaction.create(type, amount, description);
        this.transactions.push(transaction);
        this.updateUI(); // Update the UI every time a transaction is added
    },

    // Calculate current balance
    calculateBalance() {
        let balance = 0;
        this.transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                balance += transaction.amount;
            } else if (transaction.type === 'expense') {
                balance -= transaction.amount;
            }
        });
        return balance;
    },

    // Serialize transactions to JSON
    serialize() {
        return JSON.stringify(this.transactions);
    },

    // Deserialize JSON to transactions
    deserialize(json) {
        const data = JSON.parse(json);
        this.transactions = data.map(item => {
            const transaction = Transaction.create(item.type, item.amount, item.description);
            transaction.date = new Date(item.date);
            return transaction;
        });
    },

    // Update the UI with transactions and balance
    updateUI() {
        // Update transaction list
        const transactionList = document.getElementById('transactionList');
        transactionList.innerHTML = ''; // Clear the list
        this.transactions.forEach(transaction => {
            const li = document.createElement('li');
            li.classList.add('transaction-item');
            li.textContent = `${transaction.getFormattedDate()} - ${transaction.type} - $${transaction.amount} - ${transaction.description}`;
            transactionList.appendChild(li);
        });

        // Update balance
        const balance = document.getElementById('balance');
        balance.textContent = this.calculateBalance().toFixed(2);
    }
};

// Interface to interact with the user
const UI = {
    start() {
        // Load saved data if available
        const savedData = localStorage.getItem('financeData');
        if (savedData) {
            FinanceTracker.deserialize(savedData);
            FinanceTracker.updateUI();
        }
    },

    addIncome() {
        const amount = parseFloat(document.getElementById('incomeAmount').value);
        const description = document.getElementById('incomeDescription').value;
        if (!isNaN(amount) && amount > 0) {
            FinanceTracker.addTransaction('income', amount, description);
            localStorage.setItem('financeData', FinanceTracker.serialize());
        }
    },

    addExpense() {
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const description = document.getElementById('expenseDescription').value;
        if (!isNaN(amount) && amount > 0) {
            FinanceTracker.addTransaction('expense', amount, description);
            localStorage.setItem('financeData', FinanceTracker.serialize());
        }
    }
};

// Start the application
UI.start();
