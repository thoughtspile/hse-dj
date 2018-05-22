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
    circle.on('mouseover', () => circle.openPopup());
    circle.on('mouseout', () => circle.closePopup());
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
      return (value.count > 5 || value.byCity.length > 3) && value.meanRating;
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

  const plotSplits = [
    labelWidth + (width - labelWidth) / 3,
    labelWidth + (width - labelWidth) * 2 / 3,
  ];
  var xRating = d3.scaleLinear()
    .range([labelWidth, plotSplits[0]])
    .domain([0, 10]);
  var xChainSize = d3.scaleLinear()
    .range([plotSplits[0], plotSplits[1]])
    .domain([0, d3.max(byChain, c => c.cafes.length) * 1.1]);
  var xCityCount = d3.scaleLinear()
    .range([plotSplits[1], width])
    .domain([0, d3.max(byChain, c => c.byCity.length) * 1.1]);
  var y = d3.scaleBand()
    .range([height, 0])
    .round(true)
    .domain(byChain.map(c => c.name))
    .paddingInner(1);
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
  plotSplits.forEach(plotSplit => {
    wrap.append('line')
      .attr("class", "pop")
      .attr('x1', plotSplit)
      .attr('x2', plotSplit)
      .attr('y1', 0)
      .attr('y2', '100%')
  });
  wrap.append('text').text('Average rating')
    .attr('transform', `translate(${labelWidth + 10})`);
  wrap.append('text').text('Cafe count')
    .attr('transform', `translate(${plotSplits[0] + 10})`);
  wrap.append('text').text('City count')
    .attr('transform', `translate(${plotSplits[1] + 10})`);

  const sel = wrap.selectAll('.dot').data(byChain);
  const chainEnter = sel.enter().append('g');
  chainEnter.append('line')
    .attr('class', 'pop')
    .attr('x1', xRating(0))
    .attr('x2', width)
    .attr('y1', d => y(d.name))
    .attr('y2', d => y(d.name));
  chainEnter.append('circle')
    .attr('class', 'dot')
    .attr('r', 3)
    .attr('cx', d => xRating(d.meanRating))
    .attr('cy', d => y(d.name));
  chainEnter.append('circle')
    .attr('class', 'dot')
    .attr('r', 3)
    .attr('cx', d => xChainSize(d.cafes.length))
    .attr('cy', d => y(d.name));
  chainEnter.append('circle')
    .attr('class', 'dot')
    .attr('r', 3)
    .attr('cx', d => xCityCount(d.byCity.length))
    .attr('cy', d => y(d.name));

  chainEnter.on('mouseenter', function (d) {
    d3.select(this).classed('active', true);
  }).on('mouseout', function (d) {
    d3.select(this).classed('active', false);
  });
}

function loadData() {
  return fetch('./city-cafes.json').then(d => d.json());
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
