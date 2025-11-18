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