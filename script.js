/*SIDEBAR TOGGLE*/
const sidebar = document.querySelector(".sidebar");
const toggler = document.querySelector(".sidebar-toggler");

if (toggler && sidebar) {
  toggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  sidebar.addEventListener("mouseenter", () => {
    if (window.innerWidth > 720) sidebar.classList.remove("collapsed");
  });

  sidebar.addEventListener("mouseleave", () => {
    if (window.innerWidth > 720) sidebar.classList.add("collapsed");
  });
}

/*DARK MODE*/
const darkToggle = document.getElementById("darkmode-toggle");

if (darkToggle) {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    darkToggle.checked = true;
  }

  darkToggle.addEventListener("change", () => {
    if (darkToggle.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });
}

/*DASHBOARD SUMMARY (Checks if elements exist)*/
if (document.getElementById("balanceValue")) {
  document.getElementById("balanceValue").textContent = "RM 2,888.00";
  document.getElementById("incomeValue").textContent = "RM 5,000.00";
  document.getElementById("expensesValue").textContent = "RM 1,112.00";
  document.getElementById("savingsValue").textContent = "RM 1,000.00";
}

/*DONUT BREAKDOWN (Dashboard Only)*/
if (document.getElementById("expenseChart")) {
  const expenseChart = new Chart(document.getElementById("expenseChart"), {
    type: "doughnut",
    data: {
      labels: ["Food", "Transport", "Shopping", "Bills"],
      datasets: [
        {
          data: [150, 80, 200, 120],
          backgroundColor: ["#ff7043", "#42a5f5", "#7e57c2", "#26a69a"],
          borderWidth: 0
        }
      ]
    },
    options: {
      cutout: "65%",
      plugins: { legend: { display: false } },
      responsive: true,
      maintainAspectRatio: false
    }
  });

  if (document.getElementById("donutCenter")) {
    document.getElementById("donutCenter").textContent = "RM 550";
  }

  if (document.getElementById("donutLegend")) {
    let html = "";
    const labels = ["Food", "Transport", "Shopping", "Bills"];
    const colors = ["#ff7043", "#42a5f5", "#7e57c2", "#26a69a"];

    labels.forEach((item, i) => {
      html += `
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="width:12px;height:12px;border-radius:4px;background:${colors[i]}"></span>
          ${item}
        </div>`;
    });

    document.getElementById("donutLegend").innerHTML = html;
  }
}

/* 
      CASH FLOW — BAR CHART*/
const cashFlowCtx = document.getElementById('cashFlowChart').getContext('2d');

new Chart(cashFlowCtx, {
    type: 'bar',   // <-- BAR CHART
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Income",
                data: [500, 700, 600, 800, 750, 1100],
                backgroundColor: "rgba(37, 197, 94, 0.7)", // Green bars
                borderRadius: 8
            },
            {
                label: "Expenses",
                data: [300, 450, 500, 550, 650, 900],
                backgroundColor: "rgba(239, 68, 68, 0.7)", // Red bars
                borderRadius: 8
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false, // Important for mobile layout
        plugins: {
            legend: {
                position: "top",
                labels: { font: { size: 12 } }
            }
        },
        scales: {
            x: {
                grid: { display: false }
            },
            y: {
                beginAtZero: true,
                ticks: { font: { size: 12 } }
            }
        }
    }
});

/*TRANSACTION FILTERS (if table exists)*/
function filterCategory() {
  const table = document.getElementById("transactionTable");
  if (!table) return;

  const category = document.getElementById("categoryFilter").value;
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  const rows = table.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const dateText = rows[i].cells[2].innerText.split(" ")[0];
    const categoryText = rows[i].cells[4].innerText.trim();

    let show = true;

    if (category !== "All" && categoryText !== category) show = false;
    if (fromDate && dateText < fromDate) show = false;
    if (toDate && dateText > toDate) show = false;

    rows[i].style.display = show ? "" : "none";
  }
}

/* SUMMARY */
function updateSummary() {
  const rows = document.querySelectorAll("#transactionTable tbody tr");
  if (!rows.length) return;

  let totalSpent = 0;
  let totalTransactions = 0;
  let categoryCount = {};

  rows.forEach(row => {
    const amount = parseFloat(row.children[3].textContent);
    const category = row.children[4].innerText.trim();

    if (!isNaN(amount)) {
      totalSpent += amount;
      totalTransactions++;

      if (!categoryCount[category]) categoryCount[category] = 0;
      categoryCount[category]++;
    }
  });

  let mostCategory = "-";
  let maxCount = 0;

  for (let cat in categoryCount) {
    if (categoryCount[cat] > maxCount) {
      maxCount = categoryCount[cat];
      mostCategory = cat;
    }
  }

  document.getElementById("totalSpent").textContent = "RM " + totalSpent.toFixed(2);
  document.getElementById("mostCategory").textContent = mostCategory;
  document.getElementById("totalTransactions").textContent = totalTransactions;
}

if (document.getElementById("transactionTable")) updateSummary();

/* =======================================================
   BILLS PAGE — CLEAN FIXED VERSION (NO ID CONFLICTS)
==========================================================*/

if (document.getElementById("billList")) {

    /* ------------------------------
       BILL DATA
    ------------------------------ */
    const bills = [
        { name: "Telco", amount: 40, color: "#ff6384" },
        { name: "Netflix", amount: 20, color: "#36a2eb" },
        { name: "SPayLater", amount: 60, color: "#ffcd56" },
        { name: "Rent", amount: 500, color: "#4bc0c0" },
        { name: "Water", amount: 30, color: "#9966ff" },
        { name: "Electricity", amount: 80, color: "#ff9f40" }
    ];

    const total = bills.reduce((sum, bill) => sum + bill.amount, 0);

    /* ------------------------------
       ESTIMATED BILL LIST
    ------------------------------ */
    document.getElementById("totalAmount").textContent = "RM " + total;

    const billList = document.getElementById("billList");
    billList.innerHTML = ""; // clean insert

    bills.forEach(bill => {
        billList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between">
                <span>${bill.name}</span>
                <span class="fw-bold">RM ${bill.amount}</span>
            </li>
        `;
    });

    /* ------------------------------
       DONUT CHART
    ------------------------------ */
    if (document.getElementById("donutChart")) {
        new Chart(document.getElementById("donutChart"), {
            type: "doughnut",
            data: {
                labels: bills.map(b => b.name),
                datasets: [{
                    data: bills.map(b => b.amount),
                    backgroundColor: bills.map(b => b.color),
                    borderWidth: 2
                }]
            },
            options: {
                cutout: "70%",
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    /* ------------------------------
       PERCENTAGE BARS
    ------------------------------ */
    const percentContainer = document.getElementById("percentageBars");
    percentContainer.innerHTML = "";

    bills.forEach(bill => {
        const percent = ((bill.amount / total) * 100).toFixed(1);

        percentContainer.innerHTML += `
            <div class="category-row mb-2">
                <div class="d-flex justify-content-between">
                    <span>${bill.name}</span>
                    <span>${percent}%</span>
                </div>
                <div class="progress">
                    <div class="progress-bar" 
                        style="width:${percent}%; background:${bill.color}">
                    </div>
                </div>
            </div>
        `;
    });

    /* ------------------------------
       CASH FLOW BAR CHART (UNIQUE ID)
    ------------------------------ */
    if (document.getElementById("billsCashFlow")) {
        new Chart(document.getElementById("billsCashFlow"), {
            type: "bar",
            data: {
                labels: [
                    "Jan","Feb","Mar","Apr","May","Jun",
                    "Jul","Aug","Sep","Oct","Nov","Dec"
                ],
                datasets: [{
                    label: "Cash Flow (RM)",
                    data: [320,410,390,450,480,530,510,550,600,580,610,640],
                    backgroundColor: "#36a2eb"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

/* ------------------------------
   PERCENTAGE COLLAPSE TOGGLER
------------------------------ */
const percentToggle = document.getElementById("percentToggle");
const percentContent = document.getElementById("percentageBars");

if (percentToggle && percentContent) {
    percentToggle.addEventListener("click", () => {
        percentContent.classList.toggle("collapsed");

        // Change icon when collapsing
        const icon = percentToggle.querySelector("span");
        if (percentContent.classList.contains("collapsed")) {
            icon.textContent = "expand_more";  // down arrow
        } else {
            icon.textContent = "expand_less";  // up arrow
        }
    });
}

