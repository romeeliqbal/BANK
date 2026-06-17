// =========================
// THEME TOGGLE
// =========================

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("light-mode");
  
  // Save theme preference
  const currentTheme = body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("bankTheme", currentTheme);
  
  notify(`Switched to ${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)} Mode`);
}

// Load theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem("bankTheme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
}

// =========================
// BANK SAAS LOGIC
// =========================

const account = {
  name: "John Doe",
  accountNumber: generateAccountNumber(),
  pin: "1234",
  balance: 15000,
  savings: 5000,
  loan: 0,
  rewardPoints: 0,
  transactions: [],
  dailyTransferLimit: 10000,
  transferredToday: 0,
};

function generateAccountNumber() {
  return "AC" + Math.floor(100000000 + Math.random() * 900000000);
}

// Save Data
function saveData() {
  localStorage.setItem("bankAccount", JSON.stringify(account));
}

// Load Data
function loadData() {
  const saved = localStorage.getItem("bankAccount");

  if (saved) {
    Object.assign(account, JSON.parse(saved));
  }
}

// Add Transaction
function addTransaction(type, amount) {
  account.transactions.unshift({
    type,
    amount,
    balance: account.balance,
    date: new Date().toLocaleString(),
  });

  saveData();
  renderTransactions();
  updateDashboard();
}

// Dashboard
function updateDashboard() {
  document.getElementById("balance").innerText =
    "$" + account.balance.toLocaleString();

  document.getElementById("saving").innerText =
    "$" + account.savings.toLocaleString();

  document.getElementById("loan").innerText =
    "$" + account.loan.toLocaleString();

  document.getElementById("points").innerText = account.rewardPoints;
}

// Deposit
function deposit() {
  const amount = Number(document.getElementById("amount").value);

  if (amount <= 0) return alert("Invalid Amount");

  account.balance += amount;

  account.rewardPoints += Math.floor(amount / 100);

  addTransaction("Deposit", amount);
  
  document.getElementById("amount").value = "";
}

// Withdraw
function withdraw() {
  const amount = Number(document.getElementById("amount").value);

  if (amount > account.balance) return alert("Insufficient Balance");

  account.balance -= amount;

  addTransaction("Withdraw", amount);
  
  document.getElementById("amount").value = "";
}

// Transfer
function transfer() {
  const amount = Number(document.getElementById("amount").value);

  if (amount > account.balance) return alert("Not Enough Balance");

  if (account.transferredToday + amount > account.dailyTransferLimit) {
    return alert("Daily Transfer Limit Reached");
  }

  account.balance -= amount;

  account.transferredToday += amount;

  addTransaction("Transfer", amount);
  
  document.getElementById("amount").value = "";
}

// Loan
function requestLoan() {
  const amount = Number(prompt("Loan Amount"));

  if (amount <= 0) return;

  if (amount > 50000) {
    alert("Loan Rejected");
    return;
  }

  account.loan += amount;

  account.balance += amount;

  addTransaction("Loan Approved", amount);
}

// Pay Loan
function payLoan() {
  if (account.loan == 0) {
    alert("No Loan");
    return;
  }

  let payment = Math.min(account.loan, account.balance);

  account.loan -= payment;

  account.balance -= payment;

  addTransaction("Loan Payment", payment);
}

// Savings Deposit
function addSavings() {
  let amount = Number(prompt("Savings Amount"));

  if (amount > account.balance) {
    alert("Not enough balance");
    return;
  }

  account.balance -= amount;

  account.savings += amount;

  addTransaction("Savings Deposit", amount);
}

// Interest
function addMonthlyInterest() {
  let interest = account.savings * 0.02;

  account.savings += interest;

  addTransaction("Interest", interest);
}

// Reward Redemption
function redeemRewards() {
  if (account.rewardPoints < 100) {
    alert("Need 100 points");
    return;
  }

  account.rewardPoints -= 100;

  account.balance += 50;

  addTransaction("Reward Redeemed", 50);
}

// Search
function searchTransactions() {
  let keyword = document.getElementById("search").value.toLowerCase();

  const filtered = account.transactions.filter((t) =>
    t.type.toLowerCase().includes(keyword),
  );

  render(filtered);
}

// Render
function renderTransactions() {
  render(account.transactions);
}

function render(list) {
  const history = document.getElementById("history");

  history.innerHTML = "";

  list.forEach((item) => {
    history.innerHTML += `
        <div class="transaction">

            <h3>${item.type}</h3>

            <p>$${item.amount}</p>

            <span>${item.date}</span>

            <small>Balance: $${item.balance}</small>

        </div>
        `;
  });
}

// Download Statement
function downloadStatement() {
  let text = "BANK STATEMENT\n\n";

  account.transactions.forEach((t) => {
    text += `${t.date}
${t.type}
$${t.amount}
Balance:${t.balance}

`;
  });

  const blob = new Blob([text], {
    type: "text/plain",
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = "statement.txt";

  link.click();
}

// Clear History
function clearHistory() {
  if (confirm("Clear all transaction history?")) {
    account.transactions = [];
    saveData();
    renderTransactions();
  }
}

// Logout
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    alert("Logged out successfully!");
  }
}

// Reset
function resetAccount() {
  if (confirm("Reset Everything?")) {
    localStorage.removeItem("bankAccount");

    location.reload();
  }
}

// Notifications
function notify(msg) {
  const box = document.getElementById("notification");

  box.innerText = msg;

  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 3000);
}

// Initialize
loadTheme();
loadData();
updateDashboard();
renderTransactions();
