const form = document.getElementById("finance-form");
const transactionsList = document.getElementById("transactions");
const balance = document.getElementById("balance");

const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filter-category");
const filterDate = document.getElementById("filter-date");
const filterMonth = document.getElementById("filter-month");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Update UI
function updateUI() {
  filterTransactions();
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Add Transaction
function addTransaction(e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const date = new Date().toISOString().split("T")[0]; // Tanggal hari ini

  if (description.trim() === "" || isNaN(amount))
    return alert("Masukkan data yang valid!");

  transactions.push({ description, amount, date });
  updateUI();

  form.reset();
}

// Delete Transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

// Filter and search functionality
function filterTransactions() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = filterCategory.value;
  const selectedDate = filterDate.value;
  const selectedMonth = filterMonth.value;

  let filteredTransactions = transactions;

  // Filter by category
  filteredTransactions = filteredTransactions.filter((transaction) => {
    const matchesCategory =
      category === "all" ||
      (category === "income" && transaction.amount > 0) ||
      (category === "expense" && transaction.amount < 0);
    return matchesCategory;
  });

  // Filter by search term
  filteredTransactions = filteredTransactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm)
  );

  // Filter by date
  if (selectedDate) {
    filteredTransactions = filteredTransactions.filter(
      (transaction) => transaction.date === selectedDate
    );
  }

  // Filter by month
  if (selectedMonth) {
    filteredTransactions = filteredTransactions.filter((transaction) => {
      const transactionMonth = new Date(transaction.date).getMonth() + 1;
      return transactionMonth === parseInt(selectedMonth);
    });
  }

  renderTransactions(filteredTransactions);
}

// Render transactions to UI
function renderTransactions(filteredTransactions) {
  transactionsList.innerHTML = "";
  let totalBalance = 0;

  filteredTransactions.forEach((transaction, index) => {
    const li = document.createElement("li");
    li.classList.add(transaction.amount > 0 ? "income" : "expense");
    li.innerHTML = `
      ${transaction.description}
      <span>${transaction.amount > 0 ? "+" : ""}Rp ${transaction.amount}</span>
      <button onclick="deleteTransaction(${index})">x</button>
    `;
    transactionsList.appendChild(li);
    totalBalance += transaction.amount;
  });

  balance.textContent = `Rp ${totalBalance}`;
}

// Event Listeners
form.addEventListener("submit", addTransaction);
searchInput.addEventListener("input", filterTransactions);
filterCategory.addEventListener("change", filterTransactions);
filterDate.addEventListener("input", filterTransactions);
filterMonth.addEventListener("change", filterTransactions);

// Initial Render
updateUI();
