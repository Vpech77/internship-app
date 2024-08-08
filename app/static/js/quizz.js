const map = new maplibregl.Map({
    container: 'map',
    style:
        'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
    center: [2, 48],
    zoom: 2,
    minZoom:2
});
map.addControl(new maplibregl.NavigationControl());

map.on('zoom', onMapZoom);

function onMapZoom(e) {
  let zl = Math.floor(map.getZoom()*100)/100;
  console.log(map.getZoom())
  app.zl = 'ZoomLevel : '+ zl;

}


let app = Vue.createApp({
  data() {
    return {
      puntos: null,
      zl:'ZoomLevel : 2',
      layersIDs: [],
      layersOnMap:[],
      isDisabled:false,
      categorySelected: ["known_mapdata", "presumptive_mapdata", "user_mapdata"],
    };
  },
  
  mounted(){
    fetch("/data")
    .then(function(response) {
    return response.json();
    })
    .then(function(data) {
      addData("presumptive_mapdata", data['c'], 'dodgerblue');
      addData("known_mapdata", data['b'], 'red');
      addData("user_mapdata", data['a'], 'purple');
    });
  },

  methods: {
    hello(){
      console.log("hello !");
    },

    showCategoryLayer(){
      hideLayers();
      this.categorySelected.map(layer => {
        map.setLayoutProperty(layer, 'visibility', 'visible');
      });
    },

    showInitMap(){
      let init = ["known_mapdata"];
      hideLayers();
      init.map(layer => {
        map.setLayoutProperty(layer, 'visibility', 'visible');
      });
      this.isDisabled = false;
    }
  },

}).mount('#app');

function addData(name, jsonData, color){
  map.addSource(name, {
    type: 'geojson',
    data: jsonData
  });

  map.addLayer({
    id: name,
    type: "circle",
    source: name,
    paint: {
      "circle-color": color,
      "circle-radius": ['coalesce',['get', 'radius'], 2],
      "circle-stroke-width": 1,
      "circle-stroke-color": "black",
    }
  });
  app.layersIDs.push(name);
};

function addDataPoly(name, jsonData, color){
  map.addSource(name, {
    type: 'geojson',
    data: jsonData
  });
  map.addLayer({
    id: name,
    type: "fill",
    source: name,
    paint: {
      'fill-color': color,
      'fill-opacity': 0.8,
    }
  });
  app.layersIDs.push(name);
};

function hideLayers(){
  if (app.layersIDs) {
    app.layersIDs.map(id => {
        map.setLayoutProperty(id, 'visibility', 'none');
    });
  }
};