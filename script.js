const form = document.getElementById("finance-form");
const transactionsList = document.getElementById("transactions");
const balance = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Update UI
function updateUI() {
  filterTransactions();
  renderMonthlyChart();
}

// Add Transaction
function addTransaction(e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (description.trim() === "" || isNaN(amount))
    return alert("Masukkan data yang valid!");

  transactions.push({
    description,
    amount,
    date: new Date().toISOString(),
  });
  updateUI();

  form.reset();
}

// Delete Transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

// Filter Transactions
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filter-category");

function filterTransactions() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = filterCategory.value;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory =
      category === "all" ||
      (category === "income" && transaction.amount > 0) ||
      (category === "expense" && transaction.amount < 0);
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  renderTransactions(filteredTransactions);
}

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
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Render Monthly Chart
function renderMonthlyChart() {
  const currentYear = new Date().getFullYear();
  const monthlyData = Array(12).fill(0);

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    if (transactionDate.getFullYear() === currentYear) {
      const month = transactionDate.getMonth();
      monthlyData[month] += transaction.amount;
    }
  });

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    series: [
      {
        name: "Total Transaksi",
        data: monthlyData,
      },
    ],
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
    },
    yaxis: {
      title: {
        text: "Jumlah (Rp)",
      },
    },
    title: {
      text: `Laporan Bulanan ${currentYear}`,
      align: "center",
    },
  };

  const chart = new ApexCharts(
    document.querySelector("#monthly-chart"),
    options
  );
  chart.render();
}

// Add event listeners
form.addEventListener("submit", addTransaction);
searchInput.addEventListener("input", filterTransactions);
filterCategory.addEventListener("change", filterTransactions);

// Initial Render
updateUI();
