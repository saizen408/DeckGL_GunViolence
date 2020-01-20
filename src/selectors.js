const openModal = document.getElementById("open-modal");
const closeModal = document.getElementById("close-modal");
const filterInputs = document.querySelectorAll("input");
const filterDriveBy = document.getElementById("Drive-by");
const filterHomeInv = document.getElementById("HomeInvasion");
const filterSuicide = document.getElementById("Suicide");
const filterDefense = document.getElementById("DefensiveUse");
const filterArmedRob = document.getElementById("Armedrobbery");
const filterDrugInv = document.getElementById("Druginvolvement");
const filterGangInv = document.getElementById("Ganginvolvement");
const filterOfficerInv = document.getElementById("OfficerInvolved");
const filterMassShooting = document.getElementById("MassShooting");

const scatterBtn = document.getElementById("scatter");
const heatBtn = document.getElementById("heat");
const hexBtn = document.getElementById("hex");
const loader = document.getElementById("loading");

const filtersArr = [
  filterDriveBy,
  filterHomeInv,
  filterSuicide,
  filterDefense,
  filterArmedRob,
  filterDrugInv,
  filterGangInv,
  filterOfficerInv,
  filterMassShooting
];

export {
  openModal,
  closeModal,
  filterInputs,
  scatterBtn,
  heatBtn,
  hexBtn,
  loader,
  filtersArr
};
