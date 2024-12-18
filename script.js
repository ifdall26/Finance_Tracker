const form = document.getElementById("finance-form");
const transactionsList = document.getElementById("transactions");
const balance = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Update UI
function updateUI() {
  transactionsList.innerHTML = "";
  let totalBalance = 0;

  transactions.forEach((transaction, index) => {
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

// Add Transaction
function addTransaction(e) {
  e.preventDefault();

  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (description.trim() === "" || isNaN(amount))
    return alert("Masukkan data yang valid!");

  transactions.push({ description, amount });
  updateUI();

  form.reset();
}

// Delete Transaction
function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

// Event Listener
form.addEventListener("submit", addTransaction);

// Initial Render
updateUI();