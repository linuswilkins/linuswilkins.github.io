document.addEventListener("DOMContentLoaded", () => {
  function getLocation() {
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
        }
      );
    });
  }

  var map = L.map("map").setView([2, 2], 19);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  placeMarker();

  async function placeMarker() {
    try {
      const location = await getLocation();
      console.log("Standort:", location);

      // Platziere einen Kreis auf der Karte
      L.circle([location.latitude, location.longitude], {
        radius: 200,
      }).addTo(map);

      // Karte zentrieren
      map.setView([location.latitude, location.longitude], 19);
    } catch (error) {
      console.error("Fehler:", error.message);
      alert(error.message); // Zeige eine Fehlermeldung an den Benutzer
    }
  }

  document.querySelector("#start").addEventListener("click", placeMarker);
});
