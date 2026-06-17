// =========================
// SMOOTH ANIMATIONS & INTERACTIONS
// =========================

// Animate counter changes
function animateCounter(element, startValue, endValue, duration = 500) {
  const startTime = Date.now();
  const difference = endValue - startValue;

  const timer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(startValue + difference * progress);

    element.textContent = "$" + currentValue.toLocaleString();

    if (progress === 1) clearInterval(timer);
  }, 10);
}

// Add smooth fade-in animation to transactions
function addTransactionAnimation(element) {
  element.style.opacity = "0";
  element.style.transform = "translateY(-10px)";
  
  setTimeout(() => {
    element.style.transition = "all 0.3s ease";
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
  }, 10);
}

// Smooth scroll to element
function smoothScroll(element) {
  element.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// =========================
// THEME TOGGLE
// =========================

function toggleTheme() {
  const body = document.body;
  const wasLight = body.classList.contains("light-mode");
  
  body.classList.toggle("light-mode");
  
  // Add smooth transition effect
  body.style.transition = "background 0.5s ease, color 0.5s ease";
  
  // Save theme preference
  const currentTheme = body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("bankTheme", currentTheme);
  
  notify(`Switched to ${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)} Mode ✨`);
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

// Add Transaction with smooth animation
function addTransaction(type, amount) {
  account.transactions.unshift({
    type,
    amount,
    balance: account.balance,
    date: new Date().toLocaleString(),
  });

  saveData();
  renderTransactions();
  updateDashboardSmooth();
}

// Dashboard with smooth animations
function updateDashboard() {
  const balanceElement = document.getElementById("balance");
  const savingElement = document.getElementById("saving");
  const loanElement = document.getElementById("loan");
  const pointsElement = document.getElementById("points");

  balanceElement.innerText = "$" + account.balance.toLocaleString();
  savingElement.innerText = "$" + account.savings.toLocaleString();
  loanElement.innerText = "$" + account.loan.toLocaleString();
  pointsElement.innerText = account.rewardPoints;
}

// Smooth dashboard update with animation
function updateDashboardSmooth() {
  const balanceElement = document.getElementById("balance");
  const savingElement = document.getElementById("saving");
  const loanElement = document.getElementById("loan");
  const pointsElement = document.getElementById("points");

  // Add pulse animation
  balanceElement.style.transition = "transform 0.3s ease";
  balanceElement.style.transform = "scale(1.05)";
  
  setTimeout(() => {
    balanceElement.innerText = "$" + account.balance.toLocaleString();
    balanceElement.style.transform = "scale(1)";
  }, 150);

  savingElement.innerText = "$" + account.savings.toLocaleString();
  loanElement.innerText = "$" + account.loan.toLocaleString();
  pointsElement.innerText = account.rewardPoints;
}

// Deposit
function deposit() {
  const amount = Number(document.getElementById("amount").value);

  if (amount <= 0) {
    notify("❌ Invalid Amount");
    return;
  }

  account.balance += amount;
  account.rewardPoints += Math.floor(amount / 100);

  addTransaction("Deposit", amount);
  notify(`✅ Deposited $${amount.toLocaleString()}`);
  
  document.getElementById("amount").value = "";
}

// Withdraw
function withdraw() {
  const amount = Number(document.getElementById("amount").value);

  if (amount > account.balance) {
    notify("❌ Insufficient Balance");
    return;
  }

  account.balance -= amount;
  addTransaction("Withdraw", amount);
  notify(`💰 Withdrew $${amount.toLocaleString()}`);
  
  document.getElementById("amount").value = "";
}

// Transfer
function transfer() {
  const amount = Number(document.getElementById("amount").value);

  if (amount > account.balance) {
    notify("❌ Not Enough Balance");
    return;
  }

  if (account.transferredToday + amount > account.dailyTransferLimit) {
    notify(`⚠️ Daily Limit: $${account.dailyTransferLimit}`);
    return;
  }

  account.balance -= amount;
  account.transferredToday += amount;

  addTransaction("Transfer", amount);
  notify(`📤 Transferred $${amount.toLocaleString()}`);
  
  document.getElementById("amount").value = "";
}

// Loan
function requestLoan() {
  const amount = Number(prompt("💳 Enter Loan Amount:"));

  if (amount <= 0 || isNaN(amount)) return;

  if (amount > 50000) {
    notify("❌ Loan Rejected - Max: $50,000");
    return;
  }

  account.loan += amount;
  account.balance += amount;

  addTransaction("Loan Approved", amount);
  notify(`✅ Loan Approved: $${amount.toLocaleString()}`);
}

// Pay Loan
function payLoan() {
  if (account.loan == 0) {
    notify("ℹ️ No Active Loan");
    return;
  }

  let payment = Math.min(account.loan, account.balance);

  account.loan -= payment;
  account.balance -= payment;

  addTransaction("Loan Payment", payment);
  notify(`✅ Paid $${payment.toLocaleString()} Towards Loan`);
}

// Savings Deposit
function addSavings() {
  let amount = Number(prompt("🏦 Enter Savings Amount:"));

  if (amount <= 0 || isNaN(amount)) return;

  if (amount > account.balance) {
    notify("❌ Not Enough Balance");
    return;
  }

  account.balance -= amount;
  account.savings += amount;

  addTransaction("Savings Deposit", amount);
  notify(`✅ Saved $${amount.toLocaleString()}`);
}

// Interest
function addMonthlyInterest() {
  let interest = account.savings * 0.02;

  account.savings += interest;

  addTransaction("Interest", interest);
  notify(`💹 Interest Added: $${interest.toLocaleString()}`);
}

// Reward Redemption
function redeemRewards() {
  if (account.rewardPoints < 100) {
    notify(`🎁 Need ${100 - account.rewardPoints} more points`);
    return;
  }

  account.rewardPoints -= 100;
  account.balance += 50;

  addTransaction("Reward Redeemed", 50);
  notify(`🎉 Redeemed! +$50`);
}

// Search with smooth animation
function searchTransactions() {
  let keyword = document.getElementById("search").value.toLowerCase();

  const filtered = account.transactions.filter((t) =>
    t.type.toLowerCase().includes(keyword),
  );

  render(filtered);
}

// Render with smooth animations
function renderTransactions() {
  render(account.transactions);
}

function render(list) {
  const history = document.getElementById("history");
  history.innerHTML = "";

  list.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "transaction";
    div.innerHTML = `
      <h3>${item.type}</h3>
      <p>$${item.amount}</p>
      <span>${item.date}</span>
      <small>Balance: $${item.balance}</small>
    `;

    // Add smooth animation with stagger effect
    div.style.opacity = "0";
    div.style.transform = "translateX(-20px)";
    history.appendChild(div);

    setTimeout(() => {
      div.style.transition = "all 0.4s ease";
      div.style.opacity = "1";
      div.style.transform = "translateX(0)";
    }, index * 50);
  });
}

// Download Statement with animation
function downloadStatement() {
  let text = "BANK STATEMENT\n\n";

  account.transactions.forEach((t) => {
    text += `${t.date}
${t.type}
$${t.amount}
Balance: $${t.balance}

`;
  });

  const blob = new Blob([text], {
    type: "text/plain",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "statement.txt";

  notify("📄 Downloading Statement...");
  link.click();
}

// Clear History with animation
function clearHistory() {
  if (confirm("⚠️ Clear all transaction history? This cannot be undone.")) {
    const history = document.getElementById("history");
    history.style.opacity = "1";
    history.style.transition = "opacity 0.3s ease";
    
    setTimeout(() => {
      history.style.opacity = "0";
    }, 100);

    setTimeout(() => {
      account.transactions = [];
      saveData();
      renderTransactions();
      history.style.opacity = "1";
      notify("✅ History Cleared");
    }, 300);
  }
}

// Logout
function logout() {
  if (confirm("👋 Are you sure you want to logout?")) {
    notify("👋 Logging out...");
    setTimeout(() => {
      alert("Logged out successfully!");
    }, 500);
  }
}

// Reset
function resetAccount() {
  if (confirm("🔄 Reset Everything? All data will be lost!")) {
    notify("🔄 Resetting...");
    setTimeout(() => {
      localStorage.removeItem("bankAccount");
      location.reload();
    }, 500);
  }
}

// Enhanced Notifications with smooth animations
function notify(msg) {
  const box = document.getElementById("notification");

  box.innerText = msg;
  box.style.transition = "all 0.4s ease";
  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 3000);
}

// Smooth page load animations
window.addEventListener("load", () => {
  document.querySelectorAll(".card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "all 0.5s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 100);
  });
});

// Initialize
loadTheme();
loadData();
updateDashboard();
renderTransactions();
