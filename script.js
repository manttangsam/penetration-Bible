let bibleData = [];
let userKey = '';
let checkedStatus = {};

async function startTracking() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) { alert('이름을 입력해주세요.'); document.getElementById('nameInput').focus(); return; }
  userKey = 'bibleReading_' + name;
  const saved = localStorage.getItem(userKey);
  checkedStatus = saved ? JSON.parse(saved) : {};
  document.getElementById('progressSection').classList.remove('hidden');
  if (!bibleData.length) {
    const res = await fetch('bible_data.json');
    bibleData = await res.json();
  }
  loadTable();
}

function loadTable() {
  const tbody = document.querySelector('#bibleTable tbody');
  tbody.innerHTML = '';
  let done = 0;
  bibleData.forEach((row, i) => {
    const tr = document.createElement('tr');
    ['회차','시작','종료','시편','잠언'].forEach(key => {
      const td = document.createElement('td');
      td.textContent = row[key];
      tr.appendChild(td);
    });
    const tdChk = document.createElement('td');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!checkedStatus[row.회차];
    cb.onchange = () => {
      if (cb.checked) checkedStatus[row.회차] = new Date().toISOString().slice(0,10);
      else delete checkedStatus[row.회차];
      localStorage.setItem(userKey, JSON.stringify(checkedStatus));
      loadTable();
    };
    tdChk.appendChild(cb);
    tr.appendChild(tdChk);
    const tdDate = document.createElement('td');
    tdDate.textContent = checkedStatus[row.회차] || '-';
    tr.appendChild(tdDate);
    if (checkedStatus[row.회차]) done++;
    tbody.appendChild(tr);
  });
  document.getElementById('doneCount').textContent = done;
  const pct = bibleData.length ? Math.round(done / bibleData.length * 100) : 0;
  document.getElementById('donePercent').textContent = pct + '%';
  document.getElementById('remainingCount').textContent = bibleData.length - done;
  drawChart(done, bibleData.length - done);
}

function drawChart(done, left) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  if (window.chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: { labels:['완료','남은'], datasets:[{ data:[done,left], backgroundColor:['#C8E6C9','#FFEB3B'] }] },
    options: { responsive:true, plugins:{ legend:{ position:'bottom' } } }
  });
}

window.startTracking = startTracking;
