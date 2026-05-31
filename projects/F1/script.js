const driverModel = {
  "Kimi Antonelli": {
    team: "Mercedes",
    image: "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/mercedes/andant01/2026mercedesandant01right.webp",
    teamImage: "https://media.formula1.com/image/upload/c_lfill%2Cw_3392/q_auto/v1740000001/common/f1/2026/mercedes/2026mercedescarright.webp",
    teamForm: 70,
    trackHistory: 0,
    note: "Mercedes owns the strongest 2026 team form, so Antonelli stays the model pick."
  },
  "George Russell": {
    team: "Mercedes",
    image: "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/mercedes/georus01/2026mercedesgeorus01right.webp",
    teamImage: "https://media.formula1.com/image/upload/c_lfill%2Cw_3392/q_auto/v1740000001/common/f1/2026/mercedes/2026mercedescarright.webp",
    teamForm: 70,
    trackHistory: 0,
    note: "Russell gets the same Mercedes team-form boost, but trails Antonelli in the driver table."
  },
  "Charles Leclerc": {
    team: "Ferrari",
    image: "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/ferrari/chalec01/2026ferrarichalec01right.webp",
    teamImage: "https://media.formula1.com/image/upload/c_lfill%2Cw_3392/q_auto/v1740000001/common/f1/2026/ferrari/2026ferraricarright.webp",
    teamForm: 47,
    trackHistory: 12,
    note: "Leclerc gets a Monaco-specialist bump, but Ferrari's team form is still behind Mercedes."
  },
  "Lewis Hamilton": {
    team: "Ferrari",
    image: "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/ferrari/lewham01/2026ferrarilewham01right.webp",
    teamImage: "https://media.formula1.com/image/upload/c_lfill%2Cw_3392/q_auto/v1740000001/common/f1/2026/ferrari/2026ferraricarright.webp",
    teamForm: 47,
    trackHistory: 6,
    note: "Hamilton's Ferrari form is improving, though the model still wants more team pace."
  },
  "Lando Norris": {
    team: "McLaren",
    image: "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/mclaren/lannor01/2026mclarenlannor01right.webp",
    teamImage: "https://media.formula1.com/image/upload/c_lfill%2Cw_3392/q_auto/v1740000001/common/f1/2026/mclaren/2026mclarencarright.webp",
    teamForm: 34,
    trackHistory: 30,
    note: "Norris gets the biggest track-history boost as the 2025 Monaco winner."
  },
  "Oscar Piastri": {
    team: "McLaren",
    image: "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/mclaren/oscpia01/2026mclarenoscpia01right.webp",
    teamImage: "https://media.formula1.com/image/upload/c_lfill%2Cw_3392/q_auto/v1740000001/common/f1/2026/mclaren/2026mclarencarright.webp",
    teamForm: 34,
    trackHistory: 18,
    note: "Piastri benefits from McLaren's 2025 Monaco win, but less than Norris."
  },
  "Max Verstappen": {
    team: "Red Bull Racing",
    image: "https://media.formula1.com/image/upload/c_fill%2Cw_720/q_auto/v1740000001/common/f1/2026/redbullracing/maxver01/2026redbullracingmaxver01right.webp",
    teamImage: "https://media.formula1.com/image/upload/c_lfill%2Cw_3392/q_auto/v1740000001/common/f1/2026/redbullracing/2026redbullracingcarright.webp",
    teamForm: 18,
    trackHistory: 8,
    note: "Verstappen is always live, but Red Bull's 2026 team form keeps the score modest."
  }
};

const select = document.querySelector("#driver");
const button = document.querySelector("#predictButton");
const output = document.querySelector("#prediction");
const breakdown = document.querySelector("#scoreBreakdown");
const driverPreview = document.querySelector("#driverPreview");

function renderPrediction() {
  const pick = driverModel[select.value];
  const total = pick.teamForm + pick.trackHistory;
  const leader = total >= 70 ? "contender" : "outside pick";

  driverPreview.innerHTML = `
    <img class="preview-driver-photo" src="${pick.image}" alt="">
    <div>
      <strong>${select.value}</strong>
      <span><img class="preview-team-photo" src="${pick.teamImage}" alt="">${pick.team}</span>
    </div>
  `;
  output.textContent = `${select.value}: ${leader}. ${pick.note} Score: ${total}/100.`;
  breakdown.innerHTML = `
    <div><dt>Team form</dt><dd>${pick.teamForm}</dd></div>
    <div><dt>Track history</dt><dd>${pick.trackHistory}</dd></div>
    <div><dt>Total</dt><dd>${total}</dd></div>
  `;
}

button.addEventListener("click", renderPrediction);
select.addEventListener("change", renderPrediction);
