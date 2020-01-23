const getGunData = async () => {
  const response = await fetch(
    "https://firebasestorage.googleapis.com/v0/b/deckgldatamap.appspot.com/o/gundata.json?alt=media&token=113ee5d6-c816-47d5-8000-fcbf00997f13"
  );
  const data = await response.json();
  return data;
};

export const gundata = getGunData();

export const defaultScatterObj = {
  id: "scatter",
  data: gundata,
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

export const defaultHeatObj = {
  id: "heat",
  data: gundata,
  getPosition: d => [d.longitude, d.latitude],
  getWeight: d => d.n_killed + d.n_injured * 0.5,
  radiusPixels: 80
};

export const defaultHexObj = {
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
};
