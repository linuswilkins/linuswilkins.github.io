document.addEventListener("DOMContentLoaded", () => {
  const locationOutput = document.getElementById("locationOutput");
  const getLocationButton = document.getElementById("getLocation");

  // Funktion zum Standortabrufen
  const getLocation = () => {
    // Prüfen, ob Geolocation unterstützt wird
    if (!navigator.geolocation) {
      locationOutput.textContent =
        "Geolocation wird von deinem Browser nicht unterstützt.";
      return;
    }

    // Standort abrufen
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        locationOutput.innerHTML = `
            <p>Breitengrad: ${latitude.toFixed(5)}</p>
            <p>Längengrad: ${longitude.toFixed(5)}</p>
          `;
        map.setView([latitude, longitude], 13);
        var latlngs = [
          [
            [45.51, -122.68],
            [37.77, -122.43],
            [34.04, -118.2],
          ],
          [
            [40.78, -73.91],
            [41.83, -87.62],
            [32.76, -96.72],
          ],
        ];
        var polyline = L.polyline(latlngs, { color: "red" }).addTo(map);
      },
      (error) => {
        // Fehlerbehandlung
        switch (error.code) {
          case error.PERMISSION_DENIED:
            locationOutput.textContent =
              "Erlaubnis verweigert. Standort kann nicht abgerufen werden.";
            break;
          case error.POSITION_UNAVAILABLE:
            locationOutput.textContent =
              "Standortinformationen sind nicht verfügbar.";
            break;
          case error.TIMEOUT:
            locationOutput.textContent =
              "Die Anfrage zum Abrufen des Standorts ist abgelaufen.";
            break;
          default:
            locationOutput.textContent =
              "Ein unbekannter Fehler ist aufgetreten.";
        }
      }
    );
  };

  // Button-Klick-Event

  var map = L.map("map").setView([4, 8.72], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  getLocationButton.addEventListener("click", getLocation);
});
