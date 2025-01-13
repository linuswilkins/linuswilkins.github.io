document.addEventListener("DOMContentLoaded", async () => {
  var shotLocations = [];
  var polyline = null;

  function getLocation() {
    console.log("getting location...");
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error("Geolocation wird von diesem Browser nicht unterstützt.")
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error("Fehler bei der Standortabfrage:", error);
          let errorMessage = "Unbekannter Fehler";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Standortzugriff wurde verweigert.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Standortinformationen sind nicht verfügbar.";
              break;
            case error.TIMEOUT:
              errorMessage = "Die Anfrage zur Standortabfrage ist abgelaufen.";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          // temporary fix for Firefox
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 6000,
        }
      );
    });
  }

  async function placeMarker(location) {
    try {
      // Platziere einen Kreis auf der Karte
      return L.circle([location.latitude, location.longitude], {
        radius: 1,
      }).addTo(map);

      // Karte zentrieren
      map.setView([location.latitude, location.longitude], 19);
    } catch (error) {
      console.error("Fehler:", error.message);
      alert(error.message); // Zeige eine Fehlermeldung an den Benutzer
    }
  }

  console.log("Start script");

  const locationOnLoad = await getLocation();
  console.log("Location: ", locationOnLoad);

  var map = L.map("map").setView(
    [locationOnLoad.latitude, locationOnLoad.longitude],
    19
  );

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  async function startGame() {
    console.log("Game started");

    const location = await getLocation();

    console.log("Location: ", location);

    shotLocations.push([location.latitude, location.longitude]);

    const marker = await placeMarker(location);

    marker.bindPopup("Start").openPopup();

    polyline = L.polyline(shotLocations, { color: "red" }).addTo(map);

    document.querySelector("#add-shot").classList.remove("hidden");
    document.querySelector("#start").classList.add("hidden");

    setStats();
  }

  async function addShot() {
    console.log("add shot");

    const location = await getLocation();

    console.log("Location: ", location);

    shotLocations.push([location.latitude, location.longitude]);
    placeMarker(location);

    polyline.setLatLngs(shotLocations);

    console.log("Shot locations: ", shotLocations);

    // Show stats

    setStats();
  }

  // !!check values!!
  function calculateDistance(startCoord, endCoord) {
    const [lat1, lon1] = startCoord;
    const [lat2, lon2] = endCoord;

    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in meters

    return distance;
  }

  function setStats() {
    // Show stats
    document.querySelector("span#current-shot").textContent =
      shotLocations.length - 1;

    if (shotLocations.length > 1) {
      const start = shotLocations[shotLocations.length - 2];
      const end = shotLocations[shotLocations.length - 1];
      const lastShotDistance = calculateDistance(start, end);

      document.querySelector("span#last-shot-distance").textContent =
        lastShotDistance.toFixed(2) + " m";

      var totalShotDistance = 0;
      for (let i = 0; i < shotLocations.length - 1; i++) {
        const shotStart = shotLocations[i];
        const shotEnd = shotLocations[i + 1];
        const shotDistance = calculateDistance(shotStart, shotEnd);
        totalShotDistance += shotDistance;
      }

      document.querySelector("span#total-shot-distance").textContent =
        totalShotDistance.toFixed(2) + " m";

      const first = shotLocations[0];
      const last = shotLocations[shotLocations.length - 1];
      totalDistance = calculateDistance(first, last);

      document.querySelector("span#total-distance").textContent =
        totalDistance.toFixed(2) + " m";
    }
  }

  function reloadPage() {
    location.reload(); // Seite neu laden
  }

  // Event-Listener for buttons

  document.querySelector("#start").addEventListener("click", startGame);
  document.querySelector("#add-shot").addEventListener("click", addShot);
  document.querySelector("#reset").addEventListener("click", reloadPage);
});
