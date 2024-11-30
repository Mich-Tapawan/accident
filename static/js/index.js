document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-btn");
  const barGraph = document.getElementById("bar-graph");
  const heatMap = document.getElementById("heat-map");
  const searchResult = document.getElementById("search-result");

  const monthName = document.getElementById("month-value");
  const totalValue = document.getElementById("total-value");
  const percentage = document.getElementById("percentage-value");

  // Bar graph and Heat map toggle
  toggleBtn.addEventListener("click", () => {
    toggleBtn.innerHTML =
      toggleBtn.innerHTML == "VIEW HEAT MAP"
        ? "VIEW BAR GRAPH"
        : "VIEW HEAT MAP";

    if (toggleBtn.innerHTML == "VIEW HEAT MAP") {
      barGraph.style.display = "block";
      heatMap.style.display = "none";
    } else {
      barGraph.style.display = "none";
      heatMap.style.display = "block";
    }
    searchResult.style.display = "none";
  });

  // Toggle between years
  const donutCharts = document.querySelectorAll(".donut-chart");
  const toggleYearBtns = document.querySelectorAll(".toggle-year-btns");
  const yearValue = document.getElementById("year-value");
  let currentYear = 2022;

  toggleYearBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const btnDirection = event.target.id;
      if (btnDirection == "left") {
        currentYear = currentYear == 2022 ? 2024 : currentYear - 1;
      } else {
        currentYear = currentYear == 2024 ? 2022 : currentYear + 1;
      }

      //
      donutCharts.forEach((chart) => {
        chart.classList.remove("active");
      });

      // Show the chart for the selected year
      if (currentYear == 2022) {
        donutCharts[0].classList.add("active");
      } else if (currentYear == 2023) {
        donutCharts[1].classList.add("active");
      } else {
        donutCharts[2].classList.add("active");
      }

      yearValue.innerHTML = currentYear;
      monthName.innerHTML = "n/a";
      totalValue.innerHTML = 0;
      percentage.innerHTML = "0%";
    });
  });

  // Generate month buttons
  const monthBtns = document.getElementById("month-btns");
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  colors = ["#EBEB55", "#D4D700", "#55A630", "#007F5F"];
  colorCount = 0;

  months.forEach((month) => {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const div = document.createElement("div");

    p.innerHTML = month;

    //Change colors per quarter
    if (colorCount < 3) {
      div.style.backgroundColor = colors[0];
    } else if (colorCount < 6) {
      div.style.backgroundColor = colors[1];
    } else if (colorCount < 9) {
      div.style.backgroundColor = colors[2];
    } else {
      div.style.backgroundColor = colors[3];
    }

    colorCount += 1;

    li.appendChild(p);
    li.appendChild(div);

    li.addEventListener("click", () => {
      fetchMonthData(currentYear, month);
    });

    monthBtns.appendChild(li);
  });

  // Search barangay accident percentage
  const barangay = document.getElementById("brgy");
  const hour = document.getElementById("hour");
  const searchBtn = document.getElementById("search");
  const barangayText = document.getElementById("brgy-value");
  const hourText = document.getElementById("hr-value");
  const percentageText = document.getElementById("percent-result");

  searchBtn.addEventListener("click", () => {
    if (barangay.value == "" || hourText.value == "") {
      return;
    } else {
      fetchAccidentPercentage(barangay.value, hour.value);
      barGraph.style.display = "none";
      heatMap.style.display = "none";
      searchResult.style.display = "flex";
    }
  });

  async function fetchMonthData(year, month) {
    try {
      let response = await fetch("http://localhost:5000/getMonthData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: year, month: month }),
      });
      let monthData = await response.json();
      monthName.innerHTML = month;
      totalValue.innerHTML = monthData.totalAccidents;
      percentage.innerHTML = `${monthData.percentage}%`;
    } catch (error) {
      console.error("Error fetching month data: ", error);
    }
  }

  async function fetchAccidentPercentage(barangay, hour) {
    try {
      let response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barangay: barangay.toUpperCase(), hour: hour }),
      });

      let data = await response.json();
      barangayText.innerHTML = barangay.toUpperCase();
      hourText.innerHTML = `HOUR: ${hour}`;
      percentageText.innerHTML = data;
    } catch (error) {
      console.error("Error fetching accident percentage: ", error);
    }
  }
});
