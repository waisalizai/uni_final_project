  
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

  //chart

  const margin = { top: 30, right: 50, bottom: 100, left: 70 },
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const color1 = d3.scaleOrdinal()
    .domain(["Local", "Foreign"])
    .range(["#1380A1", "#5AB8E5"]);

  const tooltip = d3.select("#tooltip");

  d3.csv("data/local_foreign_journalists.csv", d => ({
    Year: d.Year.trim(),
    Local: +d["Local"],
    Foreign: +d["Foreign"]
  })).then(data => {
    const stack = d3.stack().keys(["Local", "Foreign"]);
    const stackedData = stack(data);

    const x = d3.scaleBand()
      .domain(data.map(d => d.Year))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Local + d.Foreign)])
      .nice()
      .range([height, 0]);

  
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

  
    svg.append("g")
      .call(d3.axisLeft(y));

   
    svg.selectAll("g.layer")
      .data(stackedData)
      .join("g")
      .attr("class", "layer")
      .attr("fill", d => color1(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d.data.Year))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", (event, d) => {
        const key = event.target.parentNode.__data__.key;
        tooltip.style("opacity", 1)
          .html(`Year: ${d.data.Year}<br>${key}: ${d[1] - d[0]}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    const labelYears = {
      "1997": "Local",
      "1994": "Foreign"
    };

    Object.entries(labelYears).forEach(([year, labelText]) => {
      const barData = data.find(d => d.Year === year);
      const total = barData.Local + barData.Foreign;
      svg.append("text")
        .attr("x", x(year) + x.bandwidth() / 2)
        .attr("y", y(total) - 6)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text(labelText);
    });

   
    svg.append("text")
      .attr("x", 0)
      .attr("y", height + 60)
      .attr("font-size", "20px")
      .attr("fill", "black")
      .attr("text-anchor", "start")
      .text("Source: CPJ data; chart created with D3");
  });

//chart

  const container = d3.select("#chart1");

  const margin1 = { top: 30, right: 270, bottom: 180, left: 70 },
        width1 = 1000 - margin1.left - margin1.right,
        height1 = 500 - margin1.top - margin1.bottom;

  const svg1 = d3.select("#chart1")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height1 + margin1.top + margin1.bottom)
    .attr("viewBox", `0 0 ${width1 + margin1.left + margin1.right} ${height1 + margin1.top + margin1.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin1.left},${margin1.top})`);
    const tooltip1 = d3.select("#tooltip1");

  const filters = [
    { id: "Deaths", label: "All", isActive: true },
    { id: "female", label: "Female", isActive: false },
    { id: "male", label: "Male", isActive: false }
  ];

  const color = d3.scaleOrdinal()
    .domain(["Male", "Female"])
    .range(["#1380A1", "#990000"]);

  d3.csv("data/journalists_killed.csv", d => ({
    Year: +d.Year,
    Male: +d.Male,
    Female: +d.Female
  })).then(data => {
    const x = d3.scaleBand()
      .domain(data.map(d => d.Year))
      .range([0, width1])
      .padding(0.1);

    const y = d3.scaleLinear().range([height1, 0]);

    svg1.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height1})`);

    svg1.append("g")
      .attr("class", "y-axis");

    svg1.select(".x-axis")
      .call(d3.axisBottom(x).tickValues(x.domain().filter((d, i) => i % 2 === 0)))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

    const updateChart = (data, filterId) => {
      let keys;
      if (filterId === "Deaths") keys = ["Male", "Female"];
      else if (filterId === "male") keys = ["Male"];
      else if (filterId === "female") keys = ["Female"];

      const stackedData = d3.stack().keys(keys)(data);

      y.domain([0, d3.max(data, d => keys.reduce((sum, k) => sum + d[k], 0))]).nice();
      svg1.select(".y-axis").transition().duration(500).call(d3.axisLeft(y));

      const groups = svg1.selectAll("g.layer")
        .data(stackedData, d => d.key);

      groups.exit().remove();

      const newGroups = groups.enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key));

      const mergedGroups = newGroups.merge(groups);

      const rects = mergedGroups.selectAll("rect")
        .data(d => d, d => d.data.Year);

      rects.enter()
        .append("rect")
        .on("mouseover", (event, d) => {
          const key = d3.select(event.currentTarget.parentNode).datum().key;
          tooltip1.style("opacity", 1)
            .html(`Year: ${d.data.Year}<br>${key}: ${d.data[key]}`);
        })
        .on("mousemove", (event) => {
          tooltip1
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
          tooltip1.style("opacity", 0);
        })
        .merge(rects)
        .transition().duration(500)
        .attr("x", d => x(d.data.Year))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

      rects.exit().remove();
    };

    const populateFilters = (data) => {
      d3.select("#filters")
        .selectAll(".filter")
        .data(filters)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (event, d) => {
          filters.forEach(f => f.isActive = f.id === d.id);
          populateFilters(data);
          updateChart(data, d.id);
        })
        .order();
    };

    populateFilters(data);
    updateChart(data, "Deaths");

    svg1.append('text')
      .attr('x', -70)          
      .attr('y', height1 + 50)
      .attr('font-size', '12px')
      .attr('fill', 'black')
      .attr('text-anchor', 'start')   
      .text('Data includes only journalists, not media workers, killed with confirmed motive');

    svg1.append('text')
      .attr('x', width1 + 5)  
      .attr('y', height1 + 50)
      .attr('font-size', '12px')
      .attr('fill', 'black')
      .attr('text-anchor', 'end')    
      .text('Source: CPJ data; chart created with D3');
  });

//progress bar

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
  });

//map

  import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
  import { scaleSequential } from 'https://cdn.jsdelivr.net/npm/d3-scale@4/+esm';
  import { interpolateYlGnBu } from 'https://cdn.jsdelivr.net/npm/d3-scale-chromatic@3/+esm';
  import {
    annotation,
    annotationCalloutElbow
  } from 'https://cdn.skypack.dev/d3-svg-annotation';

  const width2 = 1230;
  const height2 = 620;

  const svg2 = d3.select("#map")
    .append("svg")
    .attr("viewBox", `0 0 ${width2} ${height2}`)
    .attr("width", width2)
    .attr("height", height2);

  const projection = d3.geoEqualEarth()
    .translate([width2 / 2, height2 / 2])
    .scale(250);

  const geoPathGenerator = d3.geoPath().projection(projection);
  const graticuleGenerator = d3.geoGraticule();

  const countryColorScale = scaleSequential(interpolateYlGnBu).domain([1, 82]);

  Promise.all([
    d3.json("data/world.geojson"),
    d3.csv("data/journalists_map.csv")
  ]).then(([world, journalists]) => {

    svg2.append("g")
      .attr("fill", "none")
      .attr("stroke", "#666")
      .attr("stroke-opacity", 0.2)
      .append("path")
      .datum(graticuleGenerator())
      .attr("d", geoPathGenerator);

    const countsByCountry = {};
    journalists.forEach(d => {
      const country = d.Country.trim();
      countsByCountry[country] = (countsByCountry[country] || 0) + 1;
    });

    world.features.forEach(d => {
      const countryName = d.properties.ADMIN || d.properties.name || d.properties.country;
      d.properties.journalists = countsByCountry[countryName] || 0;
    });

    const showTooltip = (text) => {
      d3.select("#map-tooltip")
        .text(text)
        .transition()
        .style("opacity", 1);
    };

    const hideTooltip = () => {
      d3.select("#map-tooltip")
        .transition()
        .style("opacity", 0);
    };

    svg2.selectAll(".country-path")
      .data(world.features)
      .join("path")
      .attr("class", "country-path")
      .attr("d", geoPathGenerator)
      .attr("fill", d => d.properties.journalists > 0
        ? countryColorScale(d.properties.journalists)
        : "#f8fcff")
      .attr("stroke", "#09131b")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 0.5)
      .on("mouseenter", (event, d) => {
        const count = d.properties.journalists;
        const name = d.properties.ADMIN || d.properties.name || d.properties.country;
        const label = count === 1 ? "journalist" : "journalists";
        const text = `${name}: ${count} ${label} killed`;
        showTooltip(text);
      })
      .on("mouseleave", hideTooltip)
      .append("title")
      .text(d => {
        const name = d.properties.ADMIN || d.properties.name || d.properties.country;
        const count = d.properties.journalists;
        return `${name}: ${count} journalist${count === 1 ? '' : 's'}`;
      });

    const sortedCountries = world.features
      .filter(d => d.properties.journalists > 0)
      .sort((a, b) => b.properties.journalists - a.properties.journalists);

    const topN = 5; 
    const topCountriesForAnnotation = sortedCountries.slice(0, topN);

    const annotationOffsets = {
        "Palestine": { dx: -80, dy: -60 }, 
        "Sudan": { dx: 60, dy: -40 },
        "Pakistan": { dx: -80, dy: -20 },
        "Mexico": { dx: 80, dy: 60 },
        "Syria": { dx: 50, dy: -50 }
    };
    const russia = sortedCountries.find(d => {
  const name = d.properties.ADMIN || d.properties.name || d.properties.country;
  return name === "Russia";
});

if (russia && !topCountriesForAnnotation.includes(russia)) {
  topCountriesForAnnotation.push(russia);
}

    const annotations = topCountriesForAnnotation.map(d => {
      const [x, y] = projection(d3.geoCentroid(d));
      const countryName = d.properties.ADMIN || d.properties.name || d.properties.country;

      const offset = annotationOffsets[countryName] || { dx: (Math.random() * 60) - 30, dy: (Math.random() * 40) - 20 };

      return {
        note: {
          title: countryName, 
          label: `${d.properties.journalists} journalist${d.properties.journalists === 1 ? '' : 's'} killed`,
          wrap: 150,
          align: "middle", 
          padding: 10,
          bgPadding: 5,
          fontSize: 50, 
          lineType: "horizontal"

        },
        x,
        y,
        dx: offset.dx,
        dy: offset.dy,
        type: annotationCalloutElbow,
        connector: {
          end: "arrow",
          stroke: "#d62728",
          strokeWidth: 2,
          elbow: 10,
          radius: 5
        },
        subject: {
          radius: 4,
          fill: "#d62728",
          stroke: "#fff",
          strokeWidth: 1.5
        }
      };
    });

    const makeAnnotations = annotation()
      .type(annotationCalloutElbow)
      .annotations(annotations)
      .accessors({
        x: d => d.x,
        y: d => d.y
      });

    svg2.append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);

    svg2.append('text')
      .attr('x', width2 - 10)
      .attr('y', height2 + 60)
      .attr('text-anchor', 'end')
      .attr('font-size', '20px')
      .attr('fill', '#555')
      .style('font-family', 'Roboto')
      .text('Source: CPJ data, map created with D3');

      d3.select('head').append('style').text(`
  .annotation-note-label tspan.bold-number {
    font-weight: bold;
  }
`);

    const zoomHandler = d3.zoom()
      .scaleExtent([1, 5])
      .translateExtent([[0, 0], [width2 * 1.5, height2 * 1.5]])
      .on("zoom", (e) => {
        svg2.selectAll(".country-path")
          .attr("transform", e.transform);
        svg2.selectAll(".annotation-group")
          .attr("transform", e.transform);

        const resetButton = d3.select("#map-reset");

        if (e.transform.k !== 1 || e.transform.x !== 0 || e.transform.y !== 0) {
          resetButton.classed("hidden", false);
        } else {
          resetButton.classed("hidden", true);
        }
      });

    svg2.call(zoomHandler);

    const legendHeight = 350;
    const legendWidth = 12;
    const legendX = 20;
    const legendY = height2 / 2 - legendHeight / 2;

    const defs = svg2.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "legend-gradient-vertical")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "100%")
      .attr("y2", "0%");

    const legendSteps = 10;
    const domain = countryColorScale.domain();

    for (let i = 0; i <= legendSteps; i++) {
      const t = i / legendSteps;
      gradient.append("stop")
        .attr("offset", `${t * 100}%`)
        .attr("stop-color", countryColorScale(domain[0] + t * (domain[1] - domain[0])));
    }

    const legendGroup = svg2.append("g")
      .attr("transform", `translate(${legendX}, ${legendY})`);

    legendGroup.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient-vertical)")
      .style("stroke", "#ccc")
      .style("stroke-width", 1);

    const legendScale = d3.scaleLinear()
      .domain(domain)
      .range([legendHeight, 0]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(6)
      .tickFormat(d3.format("d"));

    legendGroup.append("g")
      .attr("transform", `translate(${legendWidth}, 0)`)
      .call(legendAxis);

    legendGroup.append("text")
      .attr("x", -20)
      .attr("y", -10)
      .attr("text-anchor", "start")
      .style("font-size", "15px")
      .text("Journalists Killed");

    d3.select("#map-reset")
      .classed("hidden", true)
      .on("click", () => {
        svg2.transition()
          .duration(750)
          .call(zoomHandler.transform, d3.zoomIdentity);
      });

  }).catch(error => {
    console.error("Error loading data or rendering map:", error);
  });



//chart

  const margin3 = { top: 30, right: 30, bottom: 100, left: 70 },
        width3 = 900 - margin3.left - margin3.right,
        height3 = 500 - margin3.top - margin3.bottom;

  const svg3 = d3.select("#chart3")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height3 + margin3.top + margin3.bottom)
    .attr("viewBox", `0 0 ${width3 + margin3.left + margin3.right} ${height3 + margin3.top + margin3.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${margin3.left},${margin3.top})`);

  const tooltip3 = d3.select("#tooltip");

  d3.csv("journalist_jailed.csv", d => ({
    Year: d.Year.trim(),
    Imprisoned: +d.Imprisoned
  })).then(data => {
   
    const x = d3.scaleBand()
      .domain(data.map(d => d.Year))
      .range([0, width3])
      .padding(0.1);

    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Imprisoned)])
      .nice()
      .range([height3, 0]);

   
    svg3.append("g")
      .attr("transform", `translate(0,${height3})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

   
    svg3.append("g")
      .call(d3.axisLeft(y));

   
    function drawBars(data) {
      svg3.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.Year))
        .attr("width", x.bandwidth())
        .attr("y", height3) 
        .attr("height", 0)  
        .attr("fill", "#1380A1")
        .on("mouseover", (event, d) => {
          tooltip3.style("opacity", 1)
            .html(`Year: ${d.Year}<br>Imprisoned: ${d.Imprisoned}`);
        })
        .on("mousemove", (event) => {
          tooltip3
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
          tooltip3.style("opacity", 0);
        })
        .transition()
.duration(800)
.ease(d3.easeCubicOut)

        .delay((d, i) => i * 50)
        .attr("y", d => y(d.Imprisoned))
        .attr("height", d => height3 - y(d.Imprisoned));
    }

    
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        drawBars(data); 
        observer.disconnect(); 
      }
    }, { threshold: 0.5 });

    observer.observe(document.querySelector("#chart3-container"));

    
    svg3.append("text")
      .attr("x", 0)
      .attr("y", height3 + 60)
      .attr("font-size", "20px")
      .attr("fill", "black")
      .attr("text-anchor", "start")
      .text("Source: CPJ data; chart created with D3");
  });

 