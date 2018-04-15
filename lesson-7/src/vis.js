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

function cafesByChain(data) {
  return d3.nest()
    .key(d => d.name)
    .rollup(cafes => ({
      cafes,
      meanRating: d3.mean(cafes, c => c.rating),
      count: cafes.length,
      byCity: d3.nest().key(c => c.city).rollup(ct => ct.length).entries(cafes)
    }))
    .entries(data)
    .filter(({ value }) => {
      return (value.count > 3 || value.byCity.length > 2) && value.meanRating;
    })
    .map(({ key, value }) => {
      value.name = key;
      return value;
    })
    .sort((a, b) => a.cafes.length - b.cafes.length);
}

function drawStats(data, container) {
  const byChain = cafesByChain(data);

  const labelWidth = 140;
  const width = container.getBoundingClientRect().width;
  const height = 10 * byChain.length;

  var wrap = d3.select(container)
    .attr("width", width)
    .attr("height", height)
    .append("g");

  var x = d3.scaleLinear().range([labelWidth, width]).domain([0, 10]);
  var y = d3.scaleBand()
    .range([height, 0])
    .domain(byChain.map(c => c.name))
    .paddingInner(1)
    .paddingOuter(1);
  var xAxis = d3.axisBottom().scale(x);
  var yAxis = d3.axisLeft().scale(y);

  wrap.append("g")
    .attr("class", "axis axis--y")
    .attr('transform', `translate(${labelWidth})`)
    .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  const chainEnter = wrap.selectAll('.dot').data(byChain).enter();
  chainEnter.append('line')
    .attr('class', 'pop')
    .attr('x1', x(0))
    .attr('x2', d => x(d.meanRating))
    .attr('y1', d => y(d.name))
    .attr('y2', d => y(d.name));
  chainEnter.append('circle')
    .attr('class', 'dot')
    .attr('r', 1)
    .attr('cx', d => x(d.meanRating))
    .attr('cy', d => y(d.name));
}

function loadData() {
  return fetch('../city-cafes.json').then(d => d.json());
}


const state = {
  data: [],
  colorBy: () => null,
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

      const colorBySelect = document.getElementById('color-by');
      Object.keys(data[0]).filter(key => {
        return data.some(d => typeof d[key] === 'number');
      }).forEach(key => {
        const op = document.createElement('option');
        op.value = key;
        op.innerHTML = key;
        colorBySelect.appendChild(op);
      });
      colorBySelect.value = 'rating';
      const onColorByChange = () => actions.setColorBy(colorBySelect.value);
      colorBySelect.addEventListener('change', onColorByChange);
      // also draws map
      onColorByChange();


      drawStats(data, document.getElementById('stat-vis'));
    });
  }
};

actions.initApp();
