
  // set the dimensions and margins of the graph
  var year = d3.select("#year").node().value;
  var margin = {
      top: 20,
      right: 60,
      bottom: 30,
      left: 40
    },
    parent = d3.select('#line-chart'),
    width_line_chart = parseInt(parent.style("width"), 10) - margin.left - margin.right, // get the width dynamically using window width
    height_line_chart = 470 - margin.top - margin.bottom;
  // parse the date / time
  var parseTime = d3.time.format("%Y-%m").parse;
  // get all the checked regions
  var regions = $('.region-input');
  // set the ranges
  x = d3.time.scale().range([0, width_line_chart]);
  y = d3.scale.linear().range([height_line_chart, 0]);
  // define the line
  var valueline = d3.svg.line()
    .interpolate('cardinal')
    .x(function(d) {
      return x(d[0]);
    })
    .y(function(d) {
      return y(d[1]);
    });
  // append the svg object to the body of the page
  var svg = d3.select("#line-chart").append("svg")
    .attr("width", width_line_chart + margin.left + margin.right)
    .attr("height", height_line_chart + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // add color encoding for different cities
  var c1 = "rgb(128,216,255)",
    c2 = "rgb(140,158,255)",
    c3 = "rgb(255,138,128)",
    c4 = "rgb(234,128,252)",
    c5 = "rgb(255,209,128)",
    c6 = "rgb(102,187,106)";
  // color encoding for different regions
  var color = {
    "11": c1,
    "12": c1,
    "13": c1,
    "14": c1,
    "15": c1,
    "21": c2,
    "22": c2,
    "23": c2,
    "31": c3,
    "32": c3,
    "33": c3,
    "34": c3,
    "35": c3,
    "36": c3,
    "37": c3,
    "41": c4,
    "42": c4,
    "43": c4,
    "44": c4,
    "45": c4,
    "46": c4,
    "50": c5,
    "51": c5,
    "52": c5,
    "53": c5,
    "54": c5,
    "61": c6,
    "62": c6,
    "63": c6,
    "64": c6,
    "65": c6
  };
  // load city division pinyin encoding
  d3.json("data/all_city_pinyin.json", function(error, data) {
    if (error) throw error;
    // remove all existing charts so there is no overlap
    pinyin_data = data;
  });
  // function to capitalize a word
  function capitalizeFirstLetter(string) {
    if (string.slice(-3, ) == 'shi') {
      return string.charAt(0).toUpperCase() + string.slice(1, -3);
    } else {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
  // draw function
  function draw_line_chart(data) {
    // change width dynamically
    svg.attr('width', parseInt(parent.style("width"), 10) - margin.left - margin.right);
    var data = data;
    // parse the data to create a new array for drawing
    var all_data = [];
    for (var key of Object.keys(data)) {
      for (var item of data[key]) {
        all_data.push(item);
      }
    }
    // adding data smoothing so the line chart looks better
    all_data.push([year + "-02", 20]);
    all_data.push([year + "-02", 350]);
    // Scale the range of the data for all the lines
    x.domain(d3.extent(all_data, function(d) {
      return parseTime(d[0]);
    }));
    y.domain(d3.extent(all_data, function(d) {
      return d[1];
    }));
    // Add the X Axis
    console.log(height_line_chart);

    // add a reference line
    // svg.append("line")
    //   .attr("x1", 0)
    //   .attr("y1", 318)
    //   .attr("x2", width_line_chart)
    //   .attr("y2", 318)
    //   .style("stroke", "#F44336")
    //   .style("stroke-dasharray", ("5, 5"))
    //   .style("stroke-width", "2px")
    // svg.append("rect")
    //   .attr("x", width_line_chart-210)
    //   .attr("y", 350)
    //   .attr("width", 200)
    //   .attr("height", 25)
    //   .style("fill","white")

    // svg.append("text")
    //   .text("AQI safe level reference : 100")
    //   .attr("class", "line_safe_level")
    //   .attr("x", width_line_chart)
    //   .attr("y", 300)
    //   .style("stroke", "#fff")
    //   .style("font-size", "14px")
    //   .style("opacity",0.8)
    //   .style("background","rgba(255,255,255,0.3)")
    //   .style("border-radius","4px")
    //   .attr("text-anchor","end")


      // tooltip_aqi.html("<div class='map_aqi_title'>" + d.name + "</div>" +
      //     "<div class='map_aqi_text'>" + "<b>" + "AQI" + ": " + "</b>" + d.value[2] + "</div>")
      //   .style("left", (d3.event.pageX + 20) + "px")
      //   .style("top", (d3.event.pageY - 28) + "px");

      // .on("mouseover", function() {
      //   d3.select(this)
      //     .style("opacity", 1)
      //     .style("stroke-width", "3px")
      //   svg.append("text")
      //     .attr("id", "hover-test")
      //     .attr("x", width_line_chart)
      //     .attr("y", 80)
      //     .attr("font-size", 14)
      //     .attr("fill", color[division.substring(0, 2)])
      //     .attr("text-anchor", "end")
      //     .text("AQI safe level reference : 100");
      // })
      // hover out effect
      // .on("mouseout", function(d, i) {
      //   d3.select(this)
      //     .style("stroke-width", "2px");
      //   d3.select("#hover-test").remove();
      // });

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height_line_chart + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));
    // Add the Y Axis
    svg.append("g")
      .attr("class", "axis")
      .call(d3.svg.axis().scale(y).orient("left"));
    // function to draw one city
    function draw_one(data, division) {
      var sub_data = data[division]
      // Add the paths with different curves.
      svg.append("path")
        .datum(sub_data)
        .attr("class", "line")
        .style("stroke", function() { // Add the colours dynamically
          return color[division.substring(0, 2)];
        })
        .style("opacity", 0.4)
        .attr("d", d3.svg.line()
          .interpolate('cardinal')
          .x(function(d) {
            return x(parseTime(d[0]));
          })
          .y(function(d) {
            return y(d[1]);
          })
        )
        // hover over effect
        .on("mouseover", function() {
          d3.select(this)
            .style("opacity", 1)
            .style("stroke-width", "3px")
          svg.append("text")
            .attr("id", "hover-test")
            .attr("x", width_line_chart)
            .attr("y", 80)
            .attr("font-size", 14)
            .attr("fill", color[division.substring(0, 2)])
            .attr("text-anchor", "end")
            .text("City: " + capitalizeFirstLetter(pinyin_data[division]));
        })
        // hover out effect
        .on("mouseout", function(d, i) {
          d3.select(this)
            .style("opacity", 0.4)
            .style("stroke-width", "1px");
          d3.select("#hover-test").remove();
        });
      // end of draw_one function
    }
    // get selected regions (checkbox)
    var selected_regions = []
    for (var region of regions) {
      if (region.checked) {
        selected_regions.push(region.name)
      }
    }
    // draw the lines here, only draw the cities that are checked
    for (var key of Object.keys(data)) {
      if (data[key].length == 12 && selected_regions.indexOf(key.substring(0, 1)) != -1) {
        draw_one(data, key);
      }
    }
    // end of draw_line_chart function
  }
  // function to load data and draw data
  function load_and_draw() {
    year = d3.select("#year").node().value;
    d3.json("data/all_city_aqi_" + year + ".json", function(error, data) {
      if (error) throw error;
      // remove all existing charts so there is no overlap
      svg.selectAll("*").remove();
      draw_line_chart(data)
    });
  }
  // draw data when initializing the window
  load_and_draw(year);
  // dropdown box interactions
  d3.select("#year").on('change', function() {
    load_and_draw(year);
  });
  // checkbox interactions
  regions.each(function(d) {
    d3.select(this)
      .on('change', function() {
        load_and_draw(year);
      });
  });
  // resize window interactions - did not work for some unknow reason
  d3.select(window).on('resize', function() {
    console.log('resized');
    // console.log(svg.style('width'));
    load_and_draw(year);
  });
