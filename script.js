let bibleData = window.bibleData;
let userKey = '';
function startReading(){
  const name = document.getElementById('username').value.trim();
  if(!name) return alert('이름을 입력해주세요');
  userKey = 'bible_' + name;
  document.getElementById('stats').classList.remove('hidden');
  document.getElementById('progressChart').classList.remove('hidden');
  document.getElementById('bibleTable').classList.remove('hidden');
  renderTable();
}
function renderTable(){
  const tbody = document.querySelector('#bibleTable tbody');
  tbody.innerHTML = '';
  let done = 0;
  const saved = JSON.parse(localStorage.getItem(userKey)||'{}');
  bibleData.forEach((row,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.회차}</td><td>${row.시작}</td><td>${row.종료}</td><td>${row.시편}</td><td>${row.잠언}</td>
      <td><input type="checkbox" id="cb${i}"></td><td id="dt${i}">-</td>`;
    tbody.appendChild(tr);
    const cb = document.getElementById('cb'+i), dt = document.getElementById('dt'+i);
    cb.checked = !!saved[row.회차];
    dt.textContent = saved[row.회차]||'-';
    if(cb.checked) done++;
    cb.onchange = ()=>{
      if(cb.checked) saved[row.회차]=new Date().toISOString().split('T')[0];
      else delete saved[row.회차];
      localStorage.setItem(userKey, JSON.stringify(saved));
      renderTable();
    };
  });
  document.getElementById('doneCount').innerText = done;
  document.getElementById('percent').innerText = Math.round(done/bibleData.length*100) + '%';
  document.getElementById('leftCount').innerText = bibleData.length - done;
  drawChart(done, bibleData.length - done);
}
function drawChart(done,left){
  const ctx = document.getElementById('progressChart').getContext('2d');
  if(window.myChart) myChart.destroy();
  myChart = new Chart(ctx,{type:'doughnut',
    data:{labels:['완료','남은'],datasets:[{data:[done,left],backgroundColor:['#4caf50','#ccc']}]},
    options:{responsive:true,plugins:{legend:{position:'bottom'}}}
  });
}