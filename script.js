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

document.addEventListener("DOMContentLoaded", async () => {
  var pos = null;
  await getLocation().then((location) => {
    if (location) {
      console.log("Standort:", location);
      pos = location;
    } else {
      console.log("Konnte den Standort nicht abrufen.");
    }
  });

  console.log("Standort:", pos);

  var map = L.map("map").setView([pos.latitude, pos.longitude], 19);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
});

async function placeMarker() {
  var pos = null;
  await getLocation().then((location) => {
    if (location) {
      console.log("Standort:", location);
      pos = location;
    } else {
      console.log("Konnte den Standort nicht abrufen.");
    }
  });

  var circle = L.circle([pos.latitude, pos.longitude], { radius: 200 }).addTo(
    map
  );
}
