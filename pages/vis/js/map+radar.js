
  var w = parseInt(d3.select("#line-chart").style("width"), 10) / 3.5,
    h = parseInt(d3.select("#line-chart").style("width"), 10) / 3.5;

  var colorscale = d3.scale.category10();

  //Legend titles
  var LegendOptions = ['Beijing'];

  //Data
  var social = [
    [{
        axis: "GDP",
        value: 0.9016855545631348
      },
      {
        axis: "GDP per capita",
        value: 0.3017333866481376
      },
      {
        axis: "Green Covered Area",
        value: 0.6552526166
      },
      {
        axis: "Secondary Industry",
        value: 0.2232
      },
      {
        axis: "Population Density",
        value: 0.30184264398717114
      },
      {
        axis: "Population",
        value: 0.3857065576726573
      }
    ]
  ];

  //Options for the Radar chart, other than default
  var mycfg = {
    w: w,
    h: h,
    maxValue: 0.6,
    levels: 6,
    ExtraWidthX: 300
  }

  //Call function to draw the Radar chart
  //Will expect that data is in %'s
  RadarChart.draw("#RadarChart", social, mycfg);

  ////////////////////////////////////////////
  /////////// Initiate legend ////////////////
  ////////////////////////////////////////////

  var svg1 = d3.select('#myChart')
    .selectAll('svg')
    .append('svg')
    .attr("width", w + 300)
    .attr("height", h)
  //Create the title for the legend
  // var legend_text = svg1.append("text")
  //   .attr("class", "title")
  //   .attr('transform', 'translate(90,0)')
  //   .attr("x", w - 20)
  //   .attr("y", 10)
  //   .attr("font-size", "12px")
  //   .attr("fill", "#fff")
  //   .text("Cities")
  //   .attr("font-family", "Open Sans");

  //Initiate Legend
  var radar_legend = svg1.append("g")
    .attr("class", "radar_legend")
    .attr("height", 100)
    .attr("width", 200)
    .attr('transform', 'translate(90,20)');
  //Create colour squares
  radar_legend.selectAll('rect')
    .data(LegendOptions)
    .enter()
    .append("rect")
    .attr("x", w - 25)
    .attr("y", function(d, i) {
      return i * 20 - 20;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d, i) {
      return colorscale(i);
    });
  //Create text next to squares
  radar_legend.selectAll('text')
    .data(LegendOptions)
    .enter()
    .append("text")
    .attr("x", w - 10)
    .attr("y", function(d, i) {
      return i * 20 - 9;
    })
    .attr("font-size", "14px")
    .attr("fill", "#737373")
    .text(function(d) {
      return d;
    })
    .attr("font-family", "Open Sans");
  var parent_map = d3.select("#china-map");
  var width_map = parseInt(parent_map.style("width"), 10) - margin.left - margin.right
  var height_map = 550
  // var width_map = 1300;
  // var height_map = 850;

  var svg2 = d3.select("#china-map").append("svg")
    .attr("width", width_map)
    .attr("height", height_map)
    .append("g")
    .attr("transform", "translate(0,0)");

  var projection = d3.geo.mercator()
    // .center([107, 31])
    .center([118, 38])
    .scale(620)
    .translate([width_map / 2, height_map / 2]);

  var path = d3.geo.path()
    .projection(projection);


  queue()
    .defer(d3.json, "data/map_data.json")
    .defer(d3.json, "data/all.json")
    .await(ready);


  function ready(error, map, citydata) {
    if (error) throw error;

    let all_city = citydata
    let filter_city = citydata

    var aqi_min = Math.min(...citydata.map(a => a.value[2])) + 9;
    var aqi_max = Math.max(...citydata.map(a => a.value[2])) - 25;
    var aqi_quarter1 = aqi_min + (aqi_max - aqi_min) / 3;
    var aqi_quarter2 = aqi_max - (aqi_max - aqi_min) / 3;

    var dotColorScale = d3.scale.linear()
      .domain([aqi_min, aqi_quarter1, aqi_quarter2, aqi_max])
      .range(['#2196F3', '#FFC107', '#FF5722', '#F44336']);

    // map tooltip
    var tooltip_map = d3.select("body")
      .append("div")
      .attr("class", "tooltip_map")
      .style("opacity", 0);

    // aqi scatter tooltip
    var tooltip_aqi = d3.select("body")
      .append("div")
      .attr("class", "tooltip_aqi")
      .style("opacity", 0);

    // draw map
    chinaMap(map, tooltip_map);

    // draw scatter
    aqiScatter(all_city, dotColorScale, tooltip_aqi);

    // slider for scatter
    d3.select('#slider').call(d3.slider().value([0, 180]).axis(true).min(0).max(180).on("slide", function(evt, value) {
      filter_city = citydata.filter(a => a.value[2] > value[0] && a.value[2] < value[1]);
      svg2.selectAll("circle").remove();
      aqiScatter(filter_city, dotColorScale, tooltip_aqi);
    }));
  }


  function chinaMap(root, tooltip_map) {
    svg2.selectAll("path")
      .data(root.features)
      .enter()
      .append("path")
      .attr("stroke", "rgba(0,0,0,0.2)")
      .attr("stroke-width", 1)
      .attr("fill", function(d, i) {
        return "#323c48";
      })
      .attr("d", path)
      .on("mouseover", function(d, i) {
        d3.select(this).attr("fill", "#2a333d");
        tooltip_map.transition()
          .duration(200)
          .style("opacity", .9);

        tooltip_map.html(d.properties.name)
          .style("color", "#bbb")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d, i) {
        d3.select(this).attr("fill", "#323c48");
        tooltip_map.transition()
          .duration(500)
          .style("opacity", 0);
      });
  }

  function aqiScatter(slide_data, dotColorScale, tooltip_aqi) {
    svg2.selectAll("circle")
      .data(slide_data)
      .enter()
      .append("circle")
      .attr("class", "map")
      .attr("cx", function(d) {
        return projection([d.value[0], d.value[1]])[0]
      })
      .attr("cy", function(d) {
        return projection([d.value[0], d.value[1]])[1]
      })
      .attr("r", 4)
      // .attr("r", function(d){return dotRadiusScale(d.value[2])})
      .style("fill", function(d) {
        return dotColorScale(d.value[2])
      })
      .style("opacity", .8)
      .on("mouseover", function(d) {
        d3.select(this).attr("r", 10);
        d3.select(this).attr("opacity", 1);
        tooltip_aqi.transition()
          .duration(200)
          .style("opacity", 0.9);

        // tooltip_aqi.html(d.name + "<br>AQI: " + d.value[2])
        //   .style("left", (d3.event.pageX + 20) + "px")
        //   .style("top", (d3.event.pageY - 28) + "px");

        tooltip_aqi.html("<div class='map_aqi_title'>" + d.name + "</div>" +
            "<div class='map_aqi_text'>" + "<b>" + "AQI" + ": " + "</b>" + d.value[2] + "</div>")
          .style("left", (d3.event.pageX + 20) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("r", 4);
        // d3.select(this).attr("r", function(d){return dotRadiusScale(d.value[2])});
        d3.select(this).attr("opacity", .8);
        tooltip_aqi.transition()
          .duration(500)
          .style("opacity", 0);
      })

      // tian ma
      .on("click", function(d) {
        if (LegendOptions.length >= 3) {
          LegendOptions = [];
          social = [];
        }
        LegendOptions.push(d['name']);
        social.push(
          [{
              axis: "GDP",
              value: d['social']['GDP']
            },
            {
              axis: "GDP per capita",
              value: d['social']['GDP_per_capita']
            },
            {
              axis: "Green Covered Area %",
              value: d['social']['Green_Covered_Area_percentage']
            },
            {
              axis: "Secondary Industry %",
              value: d['social']['secondary_industry_percentage']
            },
            {
              axis: "Population Density",
              value: d['social']['Population_Density']
            },
            {
              axis: "Population",
              value: d['social']['population']
            }
          ])
        RadarChart.draw("#RadarChart", social, mycfg);
        svg1 = d3.select('#myChart')
          .selectAll('svg')
          .append('svg')
          .attr("width", 500)
          .attr("height", 200)
        //Create the title for the legend

        //Initiate Legend
        radar_legend = svg1.append("g")
          .attr("class", "radar_legend")
          .attr("height", 100)
          .attr("width", 200)
          .attr('transform', 'translate(90,20)');
        //Create colour squares
        radar_legend.selectAll('rect')
          .data(LegendOptions)
          .enter()
          .append("rect")
          .attr("x", 175)
          .attr("y", function(d, i) {
            return i * 20 - 20;
          })
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", function(d, i) {
            return colorscale(i);
          });
        //Create text next to squares
        radar_legend.selectAll('text')
          .data(LegendOptions)
          .enter()
          .append("text")
          .attr("x", 190)
          .attr("y", function(d, i) {
            return i * 20 - 9;
          })
          .attr("font-size", "14px")
          .attr("fill", "#737373")
          .text(function(d) {
            return d;
          });
      });
  }
