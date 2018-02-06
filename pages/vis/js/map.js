var width = 1300;
var height = 850;

var svg = d3.select("#china-map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");

var projection = d3.geo.mercator()
    .center([107, 31])
    .scale(700)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);


  queue()
      .defer(d3.json, "data/map_data.json")
      .defer(d3.json, "data/full_aqi_data.json")
      .await(ready);


function ready(error, map, citydata) {
      if (error) throw error;

      let all_city = citydata
      let filter_city = citydata

      // color scale
// var aqi_min = Math.min(...citydata.map( a => a.value[2])) + 11;
// var aqi_max = Math.max(...citydata.map( a => a.value[2])) - 63;
var aqi_min = Math.min(...citydata.map( a => a.value[2])) + 9;
var aqi_max = Math.max(...citydata.map( a => a.value[2])) - 25;
var aqi_quarter1 = aqi_min + (aqi_max - aqi_min) / 3;
var aqi_quarter2 = aqi_max - (aqi_max - aqi_min) / 3;

  var dotColorScale = d3.scale.linear()
      .domain([aqi_min, aqi_quarter1, aqi_quarter2, aqi_max])
      // .range(['#2980b9', '#f1c40f', '#e67e22','#e74c3c']);
      .range(['#2196F3', '#FFC107', '#FF5722','#F44336']);
      // .range(['#FFC107', '#FF9800', '#FF5722','#F44336']);

  // var dotRadiusScale = d3.scale.linear()
  //     .domain([aqi_min, aqi_max])
  //     .range([3, 12]);

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
      svg.selectAll("circle").remove();
      aqiScatter(filter_city, dotColorScale, tooltip_aqi);
  }));

  }


  function chinaMap(root, tooltip_map){
    svg.selectAll("path")
        .data(root.features)
        .enter()
        .append("path")
        .attr("stroke", "#111")
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

  function aqiScatter(slide_data, dotColorScale, tooltip_aqi){
      svg.selectAll("circle")
          .data(slide_data)
          .enter()
          .append("circle")
          .attr("class","map")
          .attr("cx",function(d) {return projection([d.value[0],d.value[1]])[0]})
          .attr("cy",function(d) {return projection([d.value[0],d.value[1]])[1]})
          .attr("r", 4.5)
          // .attr("r", function(d){return dotRadiusScale(d.value[2])})
          .style("fill", function(d) {return dotColorScale(d.value[2])})
          .style("opacity",.8)
          .on("mouseover", function(d) {
            d3.select(this).attr("r", 14);
            d3.select(this).attr("opacity", 1);
            tooltip_aqi.transition()
                .duration(200)
                .style("opacity", 0.9);

            tooltip_aqi.html(d.name + "<br>AQI: " + d.value[2])
                .style("left", (d3.event.pageX + 20) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
              })
          .on("mouseout", function(d) {
            d3.select(this).attr("r", 4.5);
            // d3.select(this).attr("r", function(d){return dotRadiusScale(d.value[2])});
            d3.select(this).attr("opacity", .8);
            tooltip_aqi.transition()
                .duration(500)
                .style("opacity", 0);
          })

          // tian ma
          .on("click", function(d){

          });
  }
