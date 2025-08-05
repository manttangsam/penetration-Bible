let bibleData = [];
let userKey = "";
let checkedStatus = {};

function startTracking() {
  const name = document.getElementById("nameInput").value.trim();
  if (!name) return alert("이름을 입력해주세요.");
  userKey = "bibleReading_" + name;
  checkedStatus = JSON.parse(localStorage.getItem(userKey) || "{}");
  document.getElementById("progressSection").style.display = "block";
  document.getElementById("progressTitle").innerText = `${name}님의 성경 통독 현황입니다.`;
  loadTable();
}

async function loadTable() {
  const res = await fetch("bible_data.json");
  bibleData = await res.json();
  const tbody = document.querySelector("#bibleTable tbody");
  tbody.innerHTML = "";
  let done = 0;

  bibleData.forEach(row => {
    const tr = document.createElement("tr");
    ["회차", "시작", "종료", "시편", "잠언"].forEach(key => {
      const td = document.createElement("td");
      td.textContent = row[key];
      tr.appendChild(td);
    });

    const tdCheck = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const isChecked = checkedStatus[row.회차];
    checkbox.checked = !!isChecked;
    checkbox.onchange = () => {
      if (checkbox.checked) {
        checkedStatus[row.회차] = new Date().toISOString().slice(0, 10);
      } else {
        delete checkedStatus[row.회차];
      }
      localStorage.setItem(userKey, JSON.stringify(checkedStatus));
      loadTable(); // refresh
    };
    tdCheck.appendChild(checkbox);
    tr.appendChild(tdCheck);

    const tdDate = document.createElement("td");
    tdDate.textContent = checkedStatus[row.회차] || "-";
    tr.appendChild(tdDate);

    if (isChecked) done++;
    tbody.appendChild(tr);
  });

  const percent = Math.round((done / bibleData.length) * 100);
  document.getElementById("doneCount").innerText = done;
  document.getElementById("donePercent").innerText = percent + "%";
  document.getElementById("remainingCount").innerText = bibleData.length - done;
  drawChart(done, bibleData.length - done);
}

function drawChart(done, left) {
  const ctx = document.getElementById("progressChart").getContext("2d");
  if (window.chart) window.chart.destroy();
  window.chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['완료', '남음'],
      datasets: [{
        data: [done, left],
        backgroundColor: ['#4caf50', '#ccc'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}
