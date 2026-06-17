// ===============================
// BANK SAAS JAVASCRIPT
// ===============================

// User Data
let account = {
  name: "John Doe",
  balance: 5000,
  transactions: [],
};

// Elements
const balance = document.getElementById("balance");
const amount = document.getElementById("amount");
const history = document.getElementById("history");

// Display Balance
function updateBalance() {
  balance.innerHTML = "$" + account.balance.toFixed(2);
}

// Add Transaction
function addTransaction(type, money) {
  const transaction = {
    type,
    amount: money,
    date: new Date().toLocaleString(),
  };

  account.transactions.unshift(transaction);

  displayTransactions();
}

// Display Transactions
function displayTransactions() {
  history.innerHTML = "";

  account.transactions.forEach((item) => {
    history.innerHTML += `
            <div class="transaction ${item.type}">
                <h4>${item.type.toUpperCase()}</h4>
                <p>$${item.amount}</p>
                <small>${item.date}</small>
            </div>
        `;
  });
}

// Deposit
function deposit() {
  const money = Number(amount.value);

  if (money <= 0 || isNaN(money)) {
    alert("Enter a valid amount");
    return;
  }

  account.balance += money;

  addTransaction("deposit", money);

  updateBalance();

  amount.value = "";
}

// Withdraw
function withdraw() {
  const money = Number(amount.value);

  if (money <= 0 || isNaN(money)) {
    alert("Enter a valid amount");
    return;
  }

  if (money > account.balance) {
    alert("Insufficient Balance");
    return;
  }

  account.balance -= money;

  addTransaction("withdraw", money);

  updateBalance();

  amount.value = "";
}

// Transfer
function transfer() {
  const money = Number(amount.value);

  if (money <= 0 || isNaN(money)) {
    alert("Enter a valid amount");
    return;
  }

  if (money > account.balance) {
    alert("Insufficient Balance");
    return;
  }

  account.balance -= money;

  addTransaction("transfer", money);

  updateBalance();

  amount.value = "";

  alert("Transfer Successful");
}

// Search Transactions
function searchTransaction(text) {
  history.innerHTML = "";

  const filtered = account.transactions.filter((item) =>
    item.type.toLowerCase().includes(text.toLowerCase()),
  );

  filtered.forEach((item) => {
    history.innerHTML += `
            <div class="transaction ${item.type}">
                <h4>${item.type}</h4>
                <p>$${item.amount}</p>
                <small>${item.date}</small>
            </div>
        `;
  });
}

// Clear History
function clearHistory() {
  if (confirm("Delete all transactions?")) {
    account.transactions = [];

    displayTransactions();
  }
}

// Logout
function logout() {
  if (confirm("Logout?")) {
    location.reload();
  }
}

// Dark Mode
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Initialize
updateBalance();
displayTransactions();
