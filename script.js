
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("startButton").addEventListener("click", function startReading() {
    const username = document.getElementById("username").value.trim();
    if (!username) {
      alert("이름을 입력해주세요.");
      return;
    }
    localStorage.setItem("bibleReaderName", username);
    document.getElementById("progress-section").classList.remove("hidden");
    document.getElementById("welcome").textContent = `${username}님의 성경 통독 현황입니다.`;

    const data = bibleData;

    const tbody = document.getElementById("bible-body");
    tbody.innerHTML = "";

    data.forEach((item, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.회차}</td>
        <td>${item.시작}</td>
        <td>${item.종료}</td>
        <td>${item.시편}</td>
        <td>${item.잠언}</td>
        <td><input type="checkbox" id="check${i}"></td>
        <td id="date${i}">-</td>
      `;
      tbody.appendChild(tr);

      const checkbox = tr.querySelector("input[type='checkbox']");
      const dateCell = tr.querySelector(`#date${i}`);
      const day = i + 1;
      const today = new Date().toISOString().split('T')[0];

      checkbox.checked = localStorage.getItem(`${username}_day${day}`) === '1';
      dateCell.textContent = localStorage.getItem(`${username}_date${day}`) || "-";

      checkbox.addEventListener("change", () => {
        const isChecked = checkbox.checked;
        localStorage.setItem(`${username}_day${day}`, isChecked ? '1' : '0');
        localStorage.setItem(`${username}_date${day}`, isChecked ? today : '');
        dateCell.textContent = isChecked ? today : "-";

        const updatedCount = [...document.querySelectorAll("input[type='checkbox']")].filter(cb => cb.checked).length;
        document.getElementById("summary").textContent = `진도율: ${updatedCount}/180회 (${Math.round((updatedCount / 180) * 100)}%) 완료됨`;
        renderProgressChart(updatedCount);
      });
    });

    const totalChecked = [...document.querySelectorAll("input[type='checkbox']")].filter(cb => cb.checked).length;
    document.getElementById("summary").textContent = `진도율: ${totalChecked}/180회 (${Math.round((totalChecked / 180) * 100)}%) 완료됨`;
    renderProgressChart(totalChecked);
  });

  function renderProgressChart(checked) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    if (window.progressChart) window.progressChart.destroy();
    window.progressChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['완료', '남은'],
        datasets: [{
          data: [checked, 180 - checked],
          backgroundColor: ['#4caf50', '#e0e0e0']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function(ctx) {
                return `${ctx.label}: ${ctx.parsed}회`;
              }
            }
          }
        }
      }
    });
  }
});
