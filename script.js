document.addEventListener('DOMContentLoaded', () => {
  let bibleData = [];
  fetch('bible_data.json').then(r=>r.json()).then(data=>bibleData=data);

  const startButton = document.getElementById('startButton');
  const nameInput = document.getElementById('nameInput');
  const progressSection = document.getElementById('progressSection');
  const tbody = document.querySelector('#bibleTable tbody');
  const doneCountEl = document.getElementById('doneCount');
  const donePercentEl = document.getElementById('donePercent');
  const remainingCountEl = document.getElementById('remainingCount');

  startButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) { alert('이름을 입력해주세요.'); nameInput.focus(); return; }
    const userKey = 'bibleReading_' + name;
    const checked = JSON.parse(localStorage.getItem(userKey) || '{}');
    progressSection.classList.remove('hidden');
    renderTable(checked, userKey);
  });

  function renderTable(checked, userKey) {
    tbody.innerHTML = '';
    let done = 0;
    bibleData.forEach(row => {
      const tr = document.createElement('tr');
      ['회차','시작','종료','시편','잠언'].forEach(k=>{
        const td = document.createElement('td'); td.textContent = row[k]; tr.appendChild(td);
      });
      const tdChk = document.createElement('td');
      const cb = document.createElement('input'); cb.type='checkbox'; cb.checked=!!checked[row.회차];
      cb.addEventListener('change', () => {
        if(cb.checked) checked[row.회차] = new Date().toISOString().split('T')[0];
        else delete checked[row.회차];
        localStorage.setItem(userKey, JSON.stringify(checked));
        renderTable(checked, userKey);
      });
      tdChk.appendChild(cb); tr.appendChild(tdChk);
      const tdDate = document.createElement('td');
      tdDate.textContent = checked[row.회차]||'-'; tr.appendChild(tdDate);
      if(checked[row.회차]) done++;
      tbody.appendChild(tr);
    });
    doneCountEl.textContent = done;
    const percent = bibleData.length ? Math.round(done / bibleData.length * 100) : 0;
    donePercentEl.textContent = percent + '%';
    remainingCountEl.textContent = bibleData.length - done;
    drawChart(done, bibleData.length - done);
  }

  function drawChart(done, left) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    if(window.chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type:'doughnut',
      data:{labels:['완료','남은'],datasets:[{data:[done,left],backgroundColor:['#A8E6CF','#FFEB3B','#F8BBD0']}]},
      options:{responsive:true,plugins:{legend:{position:'bottom'}}}
    });
  }
});