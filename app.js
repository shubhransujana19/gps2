let map;
let marker;
let trackingInterval;
let previousLocation;
let routeCoordinates = []; // Array to store route coordinates

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 0, lng: 0 },
    zoom: 10,
  });
}

function startTracking() {
  if (trackingInterval) {
    alert('Tracking is already active.');
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    map.setCenter({ lat: latitude, lng: longitude });

    marker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      title: 'Current Location',
    });

    previousLocation = {
      latitude: latitude,
      longitude: longitude,
    };

    trackingInterval = setInterval(() => {
      updateLocation();
    }, 5000);

    $('#statusInfo').text('Active');
    $('#internetInfo').text(navigator.onLine ? 'On' : 'Off');

    updateStatusLights(); // Call updateStatusLights
  });
}

function stopTracking() {
  clearInterval(trackingInterval);
  if (marker) {
    marker.setMap(null);
  }

  previousLocation = null;
  trackingInterval = null;

  $('#statusInfo').text('Inactive');

  updateStatusLights(); // Call updateStatusLights
}

function updateLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;

    if (marker) {
      marker.setPosition({ lat: latitude, lng: longitude });
    }

    reverseGeocode(latitude, longitude, (address) => {
      $('#locationInfo').text(address);
    });

    const distance = calculateDistance(
      previousLocation.latitude,
      previousLocation.longitude,
      latitude,
      longitude
    );

    $('#distanceInfo').text(distance.toFixed(2));

    // Draw route polyline
    routeCoordinates.push({ lat: latitude, lng: longitude });
    drawRoute();

    previousLocation = {
      latitude: latitude,
      longitude: longitude,
    };
  });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function reverseGeocode(lat, lon, callback) {
  const geocoder = new google.maps.Geocoder();
  const latlng = { lat: lat, lng: lon };

  geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === 'OK' && results[0]) {
      callback(results[0].formatted_address);
    } else {
      callback('Address not found');
    }
  });
}

function drawRoute() {
  const routePath = new google.maps.Polyline({
    path: routeCoordinates,
    geodesic: true,
    strokeColor: '#4285f4', // Change this color as needed
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  routePath.setMap(map);
}







 function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}


document.getElementById('darkModeSwitch').addEventListener('change', function () {
  toggleDarkMode();
});

function updateStatusLights() {
    const trackingLight = document.getElementById('trackingLight');
    const internetLight = document.getElementById('internetLight');
  
    // Update tracking light
    if (trackingInterval) {
      trackingLight.classList.remove('red-light');
      trackingLight.classList.add('green-light');
    } else {
      trackingLight.classList.remove('green-light');
      trackingLight.classList.add('red-light');
    }
  
    // Update internet light
    if (navigator.onLine) {
      internetLight.classList.remove('red-light');
      internetLight.classList.add('green-light');
    } else {
      internetLight.classList.remove('green-light');
      internetLight.classList.add('red-light');
    }
  }

  // Update internet status event listeners
window.addEventListener('online', () => {
    $('#internetInfo').text('On');
    updateStatusLights(); // Call updateStatusLights
  });
  
  window.addEventListener('offline', () => {
    $('#internetInfo').text('Off');
    updateStatusLights(); // Call updateStatusLights
  });