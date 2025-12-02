  
  const map1 = L.map('map1').setView([48.723903, 37.567915], 15);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map1);

  const customIcon = L.icon({
  iconUrl: 'images/marker-icon.png', 
  iconSize:     [32, 32],
  iconAnchor:   [16, 32],
  popupAnchor:  [0, -32]
});

L.marker([48.723903, 37.567915], { icon: customIcon }).addTo(map1)
  .bindPopup(`
    <b>Ryan Evans</b><br />
    <i>Reuters</i><br />
    Killed in a missile strike that hit the Hotel Sapphire in Kramatorsk, Ukraine <br />
    <b>Date:</b> 23/08/2024 </br>
    <i>Source: <a href="https://cpj.org/data/people/ryan-evans/"> CPJ<i> <br/>
  `)
  .openPopup();
  const popup = L.popup();

  function onMapClick(e) {
    popup
      .setLatLng(e.latlng)
      .setContent(`You clicked the map at ${e.latlng.toString()}`)
      .openOn(map1);
  }

  map1.on('click', onMapClick);



  window.onscroll = function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("progress-bar").style.width = scrolled + "%";
  };
  const scroller = scrollama();

  scroller
    .setup({
      step: '.scrolly-step', 
      offset: 0.5, 
      debug: false,
    })
    .onStepEnter(response => {
      console.log('Step entered:', response.index, response.element, response.direction);
    })
    .onStepExit(response => {
      console.log('Step exited:', response.index, response.element, response.direction);
    });

  window.addEventListener('resize', scroller.resize);

