import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import mapStyles from "./map-styles";
import gundata from "../jsonFiles/gundata.json";
import { defaultScatterObj, defaultHeatObj, defaultHexObj } from "./layers";
import getFilteredData from "./getFilteredData";
import {
  openModal,
  closeModal,
  filterInputs,
  scatterBtn,
  heatBtn,
  hexBtn,
  loader,
  filtersArr
} from "./selectors";

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

const scatterplot = () =>
  new ScatterplotLayer({
    id: "scatter",
    data: gundata,
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
        <span style="color: rgb(200, 0, 40, 150)">${n_killed}</span> Dead ${
          n_killed ? strCount(n_killed, "killed") : ""
        }<br> 
        <span style="color: rgb(255, 140, 0, 100)">${n_injured}</span> Injured ${
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
    data: gundata,
    getPosition: d => [d.longitude, d.latitude],
    getWeight: d => d.n_killed + d.n_injured * 0.5,
    radiusPixels: 80
  });

const hexagon = () =>
  new HexagonLayer({
    id: "hex",
    data: gundata,
    getPosition: d => [d.longitude, d.latitude],
    getElevationWeight: d => d.n_killed * 2 + d.n_injured,
    elevationScale: 100,
    extruded: true,
    radius: 1609,
    opacity: 0.6,
    coverage: 0.88,
    lowerPercentile: 50
  });

//inititialize google maps and layers
window.initMap = () => {
  var scatterVisible = true,
    heatVisible = true,
    hexVisible = true;

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

      if (loader.parentNode && lastLayerArr.length) {
        loader.parentNode.removeChild(loader);
      }
    }
  });

  overlay.setMap(map);

  //1. set up listeners for each filter category
  openModal.addEventListener("click", () => {
    closeModal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    closeModal.style.display = "none";
  });

  //2. determine what keyword to filter each element by
  filterInputs.forEach(input => {
    var conditions = [];

    input.addEventListener("change", () => {
      conditions = filtersArr.filter(filter => {
        return filter.checked === true;
      });
      var conditionVals = [];
      conditions.forEach(condition => {
        conditionVals.push(condition.value.toLowerCase());
      });

      //3. filter by each conditionVal
      const renderData = getFilteredData(gundata, conditionVals);
      overlay.setProps({
        layers: [
          scatterVisible
            ? new ScatterplotLayer({
                ...defaultScatterObj,
                data: renderData,
                updateTriggers: {
                  getPosition: d => [d.longitude, d.latitude],
                  getFillColor: d =>
                    d.n_killed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100]
                }
              })
            : null,
          heatVisible
            ? new HeatmapLayer({
                ...defaultHeatObj,
                data: renderData,
                updateTriggers: {
                  getPosition: d => [d.longitude, d.latitude],
                  getWeight: d => d.n_killed + d.n_injured * 0.5
                }
              })
            : null,
          hexVisible
            ? new HexagonLayer({
                ...defaultHexObj,
                data: renderData,
                updateTriggers: {
                  getPosition: d => [d.longitude, d.latitude],
                  getElevationWeight: d => d.n_killed * 2 + d.n_injured
                }
              })
            : null
        ]
      });
    });
  });

  //filter by scatter plot
  scatterBtn.addEventListener("click", () => {
    if (scatterVisible) {
      overlay.setProps({
        layers: [heatVisible ? heatmap() : null, hexVisible ? hexagon() : null]
      });
      scatterVisible = false;
    } else if (!scatterVisible) {
      overlay.setProps({
        layers: [
          scatterplot(),
          heatVisible ? heatmap() : null,
          hexVisible ? hexagon() : null
        ]
      });
      scatterVisible = true;
    }
    scatterBtn.classList.toggle("enabled");
  });

  //filter by heat plot
  heatBtn.addEventListener("click", () => {
    if (heatVisible) {
      overlay.setProps({
        layers: [
          scatterVisible ? scatterplot() : null,
          hexVisible ? hexagon() : null
        ]
      });
      heatVisible = false;
    } else if (!heatVisible) {
      overlay.setProps({
        layers: [
          heatmap(),
          scatterVisible ? scatterplot() : null,
          hexVisible ? hexagon() : null
        ]
      });
      heatVisible = true;
    }
    heatBtn.classList.toggle("enabled");
  });

  //filter by hex plot
  hexBtn.addEventListener("click", () => {
    if (hexVisible) {
      overlay.setProps({
        layers: [
          scatterVisible ? scatterplot() : null,
          heatVisible ? heatmap() : null
        ]
      });
      hexVisible = false;
    } else if (!hexVisible) {
      overlay.setProps({
        layers: [
          hexagon(),
          scatterVisible ? scatterplot() : null,
          heatVisible ? heatmap() : null
        ]
      });
      hexVisible = true;
    }
    hexBtn.classList.toggle("enabled");
  });
};
