// =========================
// LEADERBOARD LOGIC
// =========================

// Player data structure
let leaderboardData = [];
let currentFilter = "balance";
let currentUser = {
  name: "John Doe",
  balance: 15000,
  savings: 5000,
  loan: 0,
  rewardPoints: 0,
};

// Initialize leaderboard
function initializeLeaderboard() {
  loadUserData();
  loadLeaderboardData();
  displayLeaderboard();
  updateStats();
}

// Load current user data from main app
function loadUserData() {
  const saved = localStorage.getItem("bankAccount");
  if (saved) {
    const account = JSON.parse(saved);
    currentUser = {
      name: account.name || "John Doe",
      balance: account.balance || 0,
      savings: account.savings || 0,
      loan: account.loan || 0,
      rewardPoints: account.rewardPoints || 0,
    };
  }
}

// Load leaderboard data from localStorage
function loadLeaderboardData() {
  const saved = localStorage.getItem("leaderboardData");
  if (saved) {
    leaderboardData = JSON.parse(saved);
  } else {
    // Initialize with current user
    leaderboardData = [
      {
        name: currentUser.name,
        balance: currentUser.balance,
        savings: currentUser.savings,
        loan: currentUser.loan,
        rewardPoints: currentUser.rewardPoints,
        isCurrentUser: true,
      },
    ];
    saveLeaderboardData();
  }

  // Update current user in leaderboard
  const userIndex = leaderboardData.findIndex((p) => p.isCurrentUser);
  if (userIndex !== -1) {
    leaderboardData[userIndex] = {
      ...leaderboardData[userIndex],
      ...currentUser,
      isCurrentUser: true,
    };
  }
  saveLeaderboardData();
}

// Save leaderboard data
function saveLeaderboardData() {
  localStorage.setItem("leaderboardData", JSON.stringify(leaderboardData));
}

// Calculate net worth
function calculateNetWorth(player) {
  return player.balance + player.savings - player.loan;
}

// Sort leaderboard by filter
function getSortedLeaderboard() {
  const sorted = [...leaderboardData].sort((a, b) => {
    let valueA, valueB;

    switch (currentFilter) {
      case "balance":
        valueA = a.balance;
        valueB = b.balance;
        break;
      case "savings":
        valueA = a.savings;
        valueB = b.savings;
        break;
      case "rewardPoints":
        valueA = a.rewardPoints;
        valueB = b.rewardPoints;
        break;
      default:
        valueA = calculateNetWorth(a);
        valueB = calculateNetWorth(b);
    }

    return valueB - valueA;
  });

  return sorted;
}

// Display leaderboard table
function displayLeaderboard() {
  const tbody = document.getElementById("leaderboardBody");
  const sortedData = getSortedLeaderboard();

  tbody.innerHTML = "";

  sortedData.forEach((player, index) => {
    const rank = index + 1;
    const row = document.createElement("tr");
    const netWorth = calculateNetWorth(player);
    const isCurrentUser = player.isCurrentUser;

    const playerClass = isCurrentUser ? "current-user" : "";

    row.innerHTML = `
      <td>
        <div class="rank-badge rank-${rank > 3 ? "default" : rank}">
          ${rank}
        </div>
      </td>
      <td>
        <div class="player-name ${playerClass}">
          <div class="player-avatar">${player.name.charAt(0)}</div>
          <span>${player.name}${isCurrentUser ? " (You)" : ""}</span>
        </div>
      </td>
      <td>
        <span class="balance-value">$${player.balance.toLocaleString()}</span>
      </td>
      <td>
        <span class="savings-value">$${player.savings.toLocaleString()}</span>
      </td>
      <td>
        <span class="loan-value">$${player.loan.toLocaleString()}</span>
      </td>
      <td>
        <span class="points-value">${player.rewardPoints}</span>
      </td>
      <td>
        <span class="networth-value">$${netWorth.toLocaleString()}</span>
      </td>
    `;

    row.style.animationDelay = `${index * 0.05}s`;
    tbody.appendChild(row);
  });
}

// Filter leaderboard
function filterLeaderboard(filter) {
  currentFilter = filter;

  // Update active button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  displayLeaderboard();
}

// Update stats section
function updateStats() {
  const sortedData = getSortedLeaderboard();
  const userIndex = sortedData.findIndex((p) => p.isCurrentUser);

  // Total players
  document.getElementById("totalPlayers").innerText = leaderboardData.length;

  // Your rank
  document.getElementById("yourRank").innerText =
    userIndex !== -1
      ? `#${userIndex + 1} of ${leaderboardData.length}`
      : "Unranked";

  // Total wealth
  const totalWealth = leaderboardData.reduce((sum, p) => sum + calculateNetWorth(p), 0);
  document.getElementById("totalWealth").innerText = "$" + totalWealth.toLocaleString();

  // Your position card
  displayYourPosition(userIndex);
}

// Display your position
function displayYourPosition(rank) {
  const card = document.getElementById("yourPositionCard");

  if (rank === -1) {
    card.innerHTML = "<p>You are not in the leaderboard yet!</p>";
    return;
  }

  const netWorth = calculateNetWorth(currentUser);
  const position = rank + 1;

  card.innerHTML = `
    <div class="position-content">
      <div class="position-item">
        <label>Your Rank</label>
        <value>#${position}</value>
      </div>
      <div class="position-item">
        <label>Balance</label>
        <value>$${currentUser.balance.toLocaleString()}</value>
      </div>
      <div class="position-item">
        <label>Savings</label>
        <value>$${currentUser.savings.toLocaleString()}</value>
      </div>
      <div class="position-item">
        <label>Loan</label>
        <value>$${currentUser.loan.toLocaleString()}</value>
      </div>
      <div class="position-item">
        <label>Reward Points</label>
        <value>${currentUser.rewardPoints}</value>
      </div>
      <div class="position-item">
        <label>Net Worth</label>
        <value>$${netWorth.toLocaleString()}</value>
      </div>
    </div>
  `;

  card.style.animation = "slideInUp 0.6s ease";
}

// Generate random players for demo
function generateRandomPlayers() {
  const names = [
    "Alice Johnson",
    "Bob Smith",
    "Charlie Brown",
    "Diana Prince",
    "Eve Wilson",
    "Frank Castle",
    "Grace Lee",
    "Henry Ford",
    "Iris West",
    "Jack Sparrow",
  ];

  const existingNames = leaderboardData.map((p) => p.name);
  const availableNames = names.filter((n) => !existingNames.includes(n));

  if (availableNames.length === 0) {
    alert("❌ All demo players already added!");
    return;
  }

  const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];

  const newPlayer = {
    name: randomName,
    balance: Math.floor(Math.random() * 50000) + 5000,
    savings: Math.floor(Math.random() * 20000),
    loan: Math.floor(Math.random() * 10000),
    rewardPoints: Math.floor(Math.random() * 500),
    isCurrentUser: false,
  };

  leaderboardData.push(newPlayer);
  saveLeaderboardData();
  displayLeaderboard();
  updateStats();

  notify(`✅ ${randomName} joined the leaderboard!`);
}

// Refresh leaderboard
function refreshLeaderboard() {
  loadUserData();
  loadLeaderboardData();
  displayLeaderboard();
  updateStats();

  notify("🔄 Leaderboard refreshed!");
}

// Theme toggle for leaderboard
function toggleLeaderboardTheme() {
  const body = document.body;
  body.classList.toggle("light-mode");

  body.style.transition = "background 0.5s ease, color 0.5s ease";

  const currentTheme = body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("leaderboardTheme", currentTheme);

  notify(`✨ Switched to ${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)} Mode`);
}

// Load theme on page load
function loadLeaderboardTheme() {
  const savedTheme = localStorage.getItem("leaderboardTheme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
}

// Notification system
function notify(msg) {
  const notification = document.createElement("div");
  notification.className = "notification show";
  notification.innerText = msg;
  notification.style.position = "fixed";
  notification.style.right = "30px";
  notification.style.top = "30px";
  notification.style.background = "#22c55e";
  notification.style.color = "#fff";
  notification.style.padding = "18px 25px";
  notification.style.borderRadius = "12px";
  notification.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.3)";
  notification.style.zIndex = "9999";
  notification.style.transition = "all 0.4s ease";
  notification.style.animation = "slideInRight 0.3s ease";

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(300px)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add CSS animation dynamically
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(300px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);

// Initialize on page load
window.addEventListener("load", () => {
  loadLeaderboardTheme();
  initializeLeaderboard();

  // Refresh data every 5 seconds
  setInterval(() => {
    loadUserData();
    loadLeaderboardData();
    displayLeaderboard();
    updateStats();
  }, 5000);
});

// Update when user returns from dashboard
window.addEventListener("focus", () => {
  refreshLeaderboard();
});
