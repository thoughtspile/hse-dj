function renderCafePopup(cafe) {
  const table = [
    ['Chain size', cafe.chain_size],
    ['City', cafe.location.city],
    ['Price range', cafe['price.message']],
    ['Rating', cafe.rating]
  ].filter(([k, v]) => !!v).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');
  return `
    <h3>${cafe.canonicalNmae || cafe.name}</h3>
    <table>${table}</table>`;
}

function drawLayer(data, options = {}) {
  const colorBy = options.colorBy || (d => d.rating);
  const colorMap = d3.scaleSequential(d3.interpolateCool).domain(d3.extent(data, colorBy));
  var layer = L.layerGroup();
  data.forEach(d => {
    var circle = L.circle([d.location.lat, d.location.lng], {
      fillColor: colorMap(colorBy(d)),
      fillOpacity: 1,
      weight: 0,
      radius: 20
    }).addTo(layer);
    circle.bindPopup(renderCafePopup(d));
  });
  return layer;
}

function drawStats(data, container) {
  console.log(data);
}

function loadData() {
  return fetch('../city-cafes.json').then(d => d.json());
}


const state = {
  data: [],
  colorBy: d => d['price.tier'],
  map: null,
  layer: null,
};
const actions = {
  drawMap() {
    if (state.layer) state.map.removeLayer(state.layer);
    const layer = drawLayer(state.data, { colorBy: state.colorBy });
    state.layer = layer;
    state.map.addLayer(layer);
  },
  initMap() {
    const data = state.data;

    const el = document.getElementById('map-vis');
    const c = {
      lat: d3.mean(d3.extent(data, d => d.location.lat)),
      lng: d3.mean(d3.extent(data, d => d.location.lng))
    };

    var cafeMap = L.map(el, { preferCanvas: true }).setView([c.lat, c.lng], 2);
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 19
    }).addTo(cafeMap);

    state.map = cafeMap;
  },
  setColorBy(attr) {
    state.colorBy = d => d[attr];
    this.drawMap();
  },
  initApp() {
    loadData().then(data => {
      data.forEach(d => {
        d.location = {
          city: d['location.city'],
          lat: d['location.lat'],
          lng: d['location.lng'],
          state: d['location.state']
        };
      });
      state.data = data;

      this.initMap();
      this.drawMap();

      drawStats(data, document.getElementById('stat-vis'));
    });
  }
};

actions.initApp();
