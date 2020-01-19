import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import mapStyles from "./map-styles";
import gundata from "../jsonFiles/gundata.json";

const sourceData = "./gundata.json";

const strCount = (count, type) => {
  let str = "";
  for (let i = 0; i < count; i++) {
    if (type === "killed") {
      str = str.concat("💀");
    } else if (type === "injured") {
      str = str.concat("🤕");
    }
  }
  return str;
};

/***************************************************************** */

const defaultScatterObj = {
  id: "scatter",
  data: sourceData,
  visible: true,
  opacity: 0.8,
  filled: true,
  radiusMinPixels: 2,
  radiusMaxPixels: 5,
  getPosition: d => [d.longitude, d.latitude],
  getFillColor: d => (d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100]),
  pickable: true,
  onHover: ({ object, x, y }) => {
    const el = document.getElementById("tooltip");
    if (object) {
      const {
        n_killed,
        incident_id,
        n_injured,
        date,
        notes,
        latitude,
        longitude
      } = object;
      el.innerHTML = `<div style="font-size: 1.0em">
          <strong>ID:${incident_id}</strong><br>
          <span style="color: rgb(200, 0, 40)">${n_killed}</span> Dead ${
        n_killed ? strCount(n_killed, "killed") : ""
      }<br> 
          <span style="color: rgb(255, 140, 0)">${n_injured}</span> Injured ${
        n_injured ? strCount(n_injured, "injured") : ""
      }<br>
          Went down on ${date}. ${notes}  
          <hr>
          <br><span style="font-size: 0.8em">Lat: ${latitude} , Lng: ${longitude}</span></div>
          `;
      el.style.display = "block";
      el.style.opacity = 0.9;
      el.style.left = x + "px";
      el.style.top = y + "px";
    } else {
      el.style.opacity = 0.0;
    }
  },

  onClick: ({ object, x, y }) => {
    window.open(
      `https://www.gunviolencearchive.org/incident/${object.incident_id}`
    );
  }
};

const defaultHeatObj = {
  id: "heat",
  data: sourceData,
  getPosition: d => [d.longitude, d.latitude],
  getWeight: d => d.n_killed + d.n_injured * 0.5,
  radiusPixels: 60
};

const defaultHexObj = {
  id: "hex",
  data: sourceData,
  getPosition: d => [d.longitude, d.latitude],
  getElevationWeight: d => d.n_killed * 2 + d.n_injured,
  elevationScale: 100,
  extruded: true,
  radius: 1609,
  opacity: 0.6,
  coverage: 0.88,
  lowerPercentile: 50
};

/***************************************************************** */

const scatterplot = () =>
  new ScatterplotLayer({
    id: "scatter",
    data: sourceData,
    visible: true,
    opacity: 0.8,
    filled: true,
    radiusMinPixels: 2,
    radiusMaxPixels: 5,
    getPosition: d => [d.longitude, d.latitude],
    getFillColor: d =>
      d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],
    pickable: true,
    onHover: ({ object, x, y }) => {
      const el = document.getElementById("tooltip");
      if (object) {
        const {
          n_killed,
          incident_id,
          n_injured,
          date,
          notes,
          latitude,
          longitude
        } = object;
        el.innerHTML = `<div style="font-size: 1.0em">
        <strong>ID:${incident_id}</strong><br>
        <span style="color: rgb(200, 0, 40)">${n_killed}</span> Dead ${
          n_killed ? strCount(n_killed, "killed") : ""
        }<br> 
        <span style="color: rgb(255, 140, 0)">${n_injured}</span> Injured ${
          n_injured ? strCount(n_injured, "injured") : ""
        }<br>
        Went down on ${date}. ${notes}  
        <hr>
        <br><span style="font-size: 0.8em">Lat: ${latitude} , Lng: ${longitude}</span></div>
        `;
        el.style.display = "block";
        el.style.opacity = 0.9;
        el.style.left = x + "px";
        el.style.top = y + "px";
      } else {
        el.style.opacity = 0.0;
      }
    },

    onClick: ({ object, x, y }) => {
      window.open(
        `https://www.gunviolencearchive.org/incident/${object.incident_id}`
      );
    }
  });

const heatmap = () =>
  new HeatmapLayer({
    id: "heat",
    data: sourceData,
    getPosition: d => [d.longitude, d.latitude],
    getWeight: d => d.n_killed + d.n_injured * 0.5,
    radiusPixels: 60
  });

const hexagon = () =>
  new HexagonLayer({
    id: "hex",
    data: sourceData,
    getPosition: d => [d.longitude, d.latitude],
    getElevationWeight: d => d.n_killed * 2 + d.n_injured,
    elevationScale: 100,
    extruded: true,
    radius: 1609,
    opacity: 0.6,
    coverage: 0.88,
    lowerPercentile: 50
  });

window.initMap = () => {
  var scatterVisible = true,
    heatVisible = true,
    hexVisible = true;

  const scatterBtn = document.getElementById("scatter");
  const heatBtn = document.getElementById("heat");
  const hexBtn = document.getElementById("hex");
  const loader = document.getElementById("loading");

  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.0, lng: -100.0 },
    zoom: 5,
    styles: mapStyles
  });

  var overlay = new GoogleMapsOverlay({
    layers: [scatterplot(), heatmap(), hexagon()],
    onAfterRender: () => {
      const layersArr = overlay.props.layers;
      let lastLayerIdx = layersArr.length - 1;

      if (layersArr[lastLayerIdx] !== null) {
        var lastLayerArr = layersArr[lastLayerIdx].props.data;
      }

      console.log(layersArr);
      if (loader.parentNode && lastLayerArr.length) {
        loader.parentNode.removeChild(loader);
      }
    }
  });

  overlay.setMap(map);

  //1. set up listeners for each filter category
  const filterDriveBy = document.getElementById("Drive-by");
  //   const filterHomeInv;
  //   const filterSuicide;
  //   const filterDefense;
  //   const filterArmedRob;
  //   const filterDrugInv;
  //   const filterOfficerInv;
  //   const filterMassShooting;
  //2. determine what keyword to filter each element by in "const layersArr = overlay.props.layers"
  const getFilteredData = () => {
    console.log("gundata:", { gundata });
    console.log(gundata[3].categories.includes("driveby"));

    // const newData = gundata.filter((el, idx) => {
    //   gundata[idx].notes.includes("driveby");
    // });
    // console.log(newData);
    // return newData;
    var newData = [];
    for (let i = 0; i < gundata.length; i++) {
      if (gundata[i].categories !== 0) {
        if (gundata[i].categories.toLowerCase().includes("drive-by")) {
          newData.push(gundata[i]);
        }
      }
    }
    console.log(newData);
    return newData;
  };

  filterDriveBy.addEventListener("change", () => {
    if (filterDriveBy.checked == false) {
      overlay.setProps({
        layers: [
          scatterVisible
            ? new ScatterplotLayer({
                ...defaultScatterObj,
                data: getFilteredData(gundata),
                updateTriggers: {
                  getPosition: d => [d.longitude, d.latitude],
                  getFillColor: d =>
                    d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100]
                }
              })
            : null, //do nothing,
          heatVisible
            ? new HeatmapLayer({
                ...defaultHeatObj,
                data: getFilteredData(gundata),
                updateTriggers: {
                  getPosition: d => [d.longitude, d.latitude],
                  getWeight: d => d.n_killed + d.n_injured * 0.5
                }
              })
            : null, //do nothing,
          hexVisible
            ? new HexagonLayer({
                ...defaultHexObj,
                data: getFilteredData(gundata),
                updateTriggers: {
                  getPosition: d => [d.longitude, d.latitude],
                  getElevationWeight: d => d.n_killed * 2 + d.n_injured
                }
              })
            : null
        ]
      });
    } else if (filterDriveBy.checked == true) {
      overlay.setProps({
        layers: [
          scatterVisible ? scatterplot() : null,
          heatVisible ? heatmap() : null,
          hexVisible ? hexagon() : null
        ]
      });
    }
  });

  //3. determine which array method returns the correct filter data most efficiently
  //Ensure that all layers receive equal filtering

  scatterBtn.addEventListener("click", () => {
    if (scatterVisible) {
      overlay.setProps({
        layers: [heatVisible ? heatmap() : null, hexVisible ? hexagon() : null]
      });
      scatterVisible = false;
      console.log("scatterVisible: ", scatterVisible);
    } else if (!scatterVisible) {
      overlay.setProps({
        layers: [
          scatterplot(),
          heatVisible ? heatmap() : null,
          hexVisible ? hexagon() : null
        ]
      });
      scatterVisible = true;
      console.log("scatterVisible: ", scatterVisible);
    }
    scatterBtn.classList.toggle("enabled");
  });

  heatBtn.addEventListener("click", () => {
    if (heatVisible) {
      overlay.setProps({
        layers: [
          scatterVisible ? scatterplot() : null,
          hexVisible ? hexagon() : null
        ]
      });
      heatVisible = false;
      console.log("heatVisible: ", heatVisible);
    } else if (!heatVisible) {
      overlay.setProps({
        layers: [
          heatmap(),
          scatterVisible ? scatterplot() : null,
          hexVisible ? hexagon() : null
        ]
      });
      heatVisible = true;
      console.log("heatVisible: ", heatVisible);
    }
    heatBtn.classList.toggle("enabled");
  });

  hexBtn.addEventListener("click", () => {
    if (hexVisible) {
      overlay.setProps({
        layers: [
          scatterVisible ? scatterplot() : null,
          heatVisible ? heatmap() : null
        ]
      });
      hexVisible = false;
      console.log("hexVisible: ", hexVisible);
    } else if (!hexVisible) {
      overlay.setProps({
        layers: [
          hexagon(),
          scatterVisible ? scatterplot() : null,
          heatVisible ? heatmap() : null
        ]
      });
      hexVisible = true;
      console.log("hexVisible: ", hexVisible);
    }
    hexBtn.classList.toggle("enabled");
  });
};
