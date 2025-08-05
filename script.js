let bibleData = window.bibleData;
let userKey = '';

function startReading() {
  const name = document.getElementById('username').value.trim();
  if (!name) {
    alert('이름을 입력해주세요.');
    return;
  }
  userKey = 'bible_' + name;
  document.getElementById('stats').classList.remove('hidden');
  document.getElementById('chartContainer').classList.remove('hidden');
  document.getElementById('tableContainer').classList.remove('hidden');
  renderTable();
}

function renderTable() {
  const tbody = document.getElementById('bibleBody');
  tbody.innerHTML = '';
  let done = 0;
  const saved = JSON.parse(localStorage.getItem(userKey) || '{}');
  bibleData.forEach((row, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.회차}</td>
      <td>${row.시작}</td>
      <td>${row.종료}</td>
      <td>${row.시편}</td>
      <td>${row.잠언}</td>
      <td><input type="checkbox" id="cb${i}"></td>
      <td id="dt${i}">-</td>
    `;
    tbody.appendChild(tr);
    const cb = document.getElementById('cb' + i);
    const dt = document.getElementById('dt' + i);
    cb.checked = !!saved[row.회차];
    dt.textContent = saved[row.회차] || '-';
    if (cb.checked) done++;
    cb.addEventListener('change', () => {
      if (cb.checked) saved[row.회차] = new Date().toISOString().split('T')[0];
      else delete saved[row.회차];
      localStorage.setItem(userKey, JSON.stringify(saved));
      renderTable();
    });
  });
  document.getElementById('doneCount').textContent = done;
  document.getElementById('percent').textContent = Math.round(done / bibleData.length * 100) + '%';
  document.getElementById('leftCount').textContent = bibleData.length - done;
  drawChart(done, bibleData.length - done);
}

function drawChart(done, left) {
  const ctx = document.getElementById('chartCanvas').getContext('2d');
  if (window.myChart) myChart.destroy();
  myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['완료', '남은'],
      datasets: [{ data: [done, left], backgroundColor: ['#4caf50', '#ccc'] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startButton').addEventListener('click', startReading);
});