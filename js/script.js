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
const filterDate = document.getElementById("filter-date");
const filterMonth = document.getElementById("filter-month");

function filterTransactions() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = filterCategory.value;
  const selectedDate = filterDate.value;
  const selectedMonth = filterMonth.value;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory =
      category === "all" ||
      (category === "income" && transaction.amount > 0) ||
      (category === "expense" && transaction.amount < 0);

    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm);

    const transactionDate = new Date(transaction.date);
    const matchesDate = selectedDate
      ? transactionDate.toISOString().split("T")[0] === selectedDate
      : true;

    const matchesMonth = selectedMonth
      ? transactionDate.getMonth() + 1 === parseInt(selectedMonth)
      : true;

    return matchesCategory && matchesSearch && matchesDate && matchesMonth;
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
  const incomeData = Array(12).fill(0); // Untuk menyimpan pemasukan per bulan
  const expenseData = Array(12).fill(0); // Untuk menyimpan pengeluaran per bulan

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    if (transactionDate.getFullYear() === currentYear) {
      const month = transactionDate.getMonth();
      if (transaction.amount > 0) {
        incomeData[month] += transaction.amount; // Jika pemasukan
      } else {
        expenseData[month] += transaction.amount; // Jika pengeluaran
      }
    }
  });

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    series: [
      {
        name: "Pemasukan",
        data: incomeData,
      },
      {
        name: "Pengeluaran",
        data: expenseData,
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
filterDate.addEventListener("input", filterTransactions);
filterMonth.addEventListener("change", filterTransactions);

// Initial Render
updateUI();
