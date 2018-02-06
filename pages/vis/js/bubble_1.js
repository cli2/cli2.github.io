
  //Width and height
  bb_parent = d3.select('#chart')
  w = parseInt(bb_parent.style("width"))
  h = 600;
  padding = 90;

  p1 = ""
  p2 = ""
  p3 = ""

  unit = {
    "GDP": {
      "label": "GDP",
      "unit": "millions USD"
    },
    "GDP_per_capita": {
      "label": "GDP per capita",
      "unit": "USD"
    },
    "secondary_industry_percentage": {
      "label": "Seceondary Industry as Percentage to GDP",
      "unit": "%"
    },
    "dust_removed": {
      "label": "Volume of Industrial Soot Removed",
      "unit": "tons"
    },
    "dust_emission": {
      "label": "Volume of Industrial Soot Emission",
      "unit": "tons"
    },
    "population": {
      "label": "Population",
      "unit": "millions"
    },
    "Population_Density": {
      "label": "Population Density",
      "unit": "persons/sq.km"
    },
    "aqi": {

      "label": "Air Quality Index",
      "unit": ""
    },
    "Green_Covered_Area_percentage": {
      "label": "Green Covered Area as Percentage to Completed Area",
      "unit": "%"
    },
    "persons_employed_in_mining": {
      "label": "Persons Employed in Mining",
      "unit": "thousands persons"
    },
    "persons_employed_in_manufacturing": {
      "label": "Persons Employed in Manufactoring",
      "unit": "thousands persons"
    },
    "persons_employed_in_p_egw": {
      "label": "Persons Employed in Production of Electricity, Gas and Water",
      "unit": "1000 persons"
    },
    "persons_employed_in_construction": {
      "label": "Persons Employed in Construction",
      "unit": "1000 persons"
    }

  }


  ///dataset used for the chart
  dataset = []

  ///data for regression
  x_values = []
  y_values = []

  ///pick useful data from raw data and add to dataset
  function update_dataset() {
    dataset = [];
    x_values = []
    y_values = []
    for (var i in mydata) {

      group = []
      if (p1 in mydata[i] && p2 in mydata[i] && p3 in mydata[i]) {
        value_x = mydata[i][p1]
        value_y = mydata[i][p2]
        value_z = mydata[i][p3]

        if (typeof(value_x) === 'number' && typeof(value_y) === 'number' && typeof(value_z) === 'number' && mydata[i]['City']) {
          group.push(value_x, value_y, value_z, mydata[i]['City'])
          x_values.push(value_x)
          y_values.push(value_y)
          dataset.push(group)
          // console.log(group)
        }

      }
    }
    // console.log(dataset)

  };

  function update_parameters(a, b, c) {
    p1 = a
    p2 = b
    p3 = c
    update_dataset()
    // console.log('parameters updated')
  };
  update_parameters('GDP', 'aqi', 'population')


  //Create scale functions
  var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {
      // return d['aqi'];
      return d[0]
    })])
    .range([padding, w - padding]);


  var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {

      return d[1]
    })])
    .range([h - padding, 5]);

  var BubbleRadiusScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {

      return d[2]
    })])
    .range([3, 50]);

  //Define X axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(10);

  //Define Y axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(10);

  //Create SVG element
  var svg3 = d3.select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  // Define clipping path
  // svg.append("clipPath") //Make a new clipPath
  //   .attr("id", "chart-area") //Assign an ID
  //   .append("rect") //Within the clipPath, create a new rect
  //   .attr("x", padding) //Set rect's position and size…
  //   .attr("y", padding)
  //   .attr("width", w - padding * 3)
  //   .attr("height", h - padding * 2);

  //Create circles
  svg3.append("g") //Create new g
    .attr("id", "circles") //Assign ID of 'circles'
    // .attr("clip-path", "url(#chart-area)") //Add reference to clipPath
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) {

      return xScale(d[0])
      // return xScale(d[0])
    })
    .attr("cy", function(d) {
      if (d[1]) {
        return yScale(d[1])
      }

      // return yScale(d[1])
    })
    .attr("opacity", 0.2)
    .attr("r", function(d) {
      // return BubbleRadiusScale(d[2])
      return 5
    })
    .style("fill", "#00e4cf");


  //Create X axis
  svg3.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .style("fill", "rgba(255,255,255,0.4)")
    .call(xAxis);

  //Create Y axis
  svg3.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ",0)")
    .style("fill", "rgba(255,255,255,0.4)")
    .call(yAxis);

  // text label for the x axis
  label_x = svg3.append("text")
    .attr("transform",
      "translate(" + (w / 2 - 0.5 * padding) + " ," +
      (h - 0.3 * padding) + ")")
    .style("text-anchor", "middle")
    .style("fill", "rgba(255,255,255,0.5)")
    .text(function() {
      if (unit[p1]['unit'] != "") {
        return unit[p1]['label'] + ' (' + unit[p1]['unit'] + ')'
      } else {
        return unit[p1]['label']
      }
    })
    .style("font-size", 14);
  // text label for the y axis
  label_y = svg3.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 10)
    .attr("x", 0 - (h / 2))
    .attr("dy", "1em")
    .style("font-size", 14)
    .style("text-anchor", "middle")
    .style("fill", "rgba(255,255,255,0.5)")
    .text(function() {
      if (unit[p2]['unit'] != "") {
        return unit[p2]['label'] + ' (' + unit[p2]['unit'] + ')'
      } else {
        return unit[p2]['label']
      }
    });


  //On dropdown update, update with new data
  function update_chart() {
    // d3.select("p")
    //   .on("click", function() {

    //     update_parameters("no2","o3","GDP_per_capita")

    //Update scale domains
    xScale.domain([0, d3.max(dataset, function(d) {
      return d[0];
    })]);
    yScale.domain([0, d3.max(dataset, function(d) {
      return d[1];
    })]);
    // BubbleRadiusScale=d3.scale.linear()
    // .domain([0, d3.max(dataset, function(d) {
    // 	// return d['pm10'];
    // 	return d[2]
    // })])
    // .range([3, 50]);


    //Update X axis
    svg3.select(".x.axis")
      .transition()
      .duration(1000)
      .call(xAxis);

    //Update Y axis
    svg3.select(".y.axis")
      .transition()
      .duration(1000)
      .call(yAxis);


    //Update all circles
    svg3.selectAll("circle")
      .data(dataset)
      .transition()
      .duration(1000)
      // .each("start", function() { // <-- Executes at start of transition
      //    			d3.select(this)

      // 			// .attr("fill", "magenta")
      // 			// .attr("r", 3);
      // })
      .attr("cx", function(d) {
        return xScale(d[0])
      })
      .attr("cy", function(d) {
        if (d[1]) {
          return yScale(d[1]);
        }
      })
      .attr("r", function(d) {
        return BubbleRadiusScale(d[2])
        // return 5
      })
      .attr("opacity", 0.2)
      .style("fill", "#00e4cf")
      .attr("r", function(d) {
        // return BubbleRadiusScale(d[2]);
        return 5
      });



    lr = linearRegression(y_values, x_values);
    max = d3.max(x_values);
    myLine
      .transition()
      .duration(1000)
      .attr("x1", xScale(0))
      .attr("y1", yScale(lr.intercept))
      .attr("x2", xScale(max))
      .attr("y2", yScale((max * lr.slope) + lr.intercept))
      .style("stroke", "#5ba4ff");

    ///update axis labels
    label_x.transition().duration(1000).text(function() {
      if (unit[p1]['unit'] != "") {
        return unit[p1]['label'] + ' (' + unit[p1]['unit'] + ')'
      } else {
        return unit[p1]['label']
      }
    });
    label_y.transition().duration(1000).text(function() {
      if (unit[p2]['unit'] != "") {
        return unit[p2]['label'] + ' (' + unit[p2]['unit'] + ')'
      } else {
        return unit[p2]['label']
      }
    });
  }




  ///tooltips
  var tooltip_div = d3.select('body')
    .append('div')
    .attr("class", "bb_tooltips");

  var ToolTips = tooltip_div.append("div")
    .attr("class", 'tooltip')
    .style("display", "none")
    .style('position', "absolute")
    .style("fill", "black");

  function handleMouseOver(d, i) {
    ////hover over color
    d3.select(this).style("fill", "#ffc107");
    d3.select(this).style("opacity", "0.5");
    ////tooltips
    formatComma = d3.format(",")
    ToolTips.style("display", "inline")
      .html("<div class='city-name'>" + d[3] + "</div>" +
        "<div>" + "<span class='bb-tt-label'>" + unit[p1]['label'] + ": " + "</span>" + formatComma(d[0]) + " " + unit[p1]['unit'] + "</div>" +
        "<div>" + "<span class='bb-tt-label'>" + unit[p2]['label'] + ": " + "</span>" + formatComma(d[1]) + " " + unit[p2]['unit'] + "</div>")
      // "<div>"+"<span class='bb-tt-label'>"+unit[p3]['label']+": "+"</span>"+d[2]+" "+unit[p3]['unit']+"</div>")
      // .attr("data-html", "true")
      .style("left", (d3.event.pageX - 100) + "px")
      .style("top", (d3.event.pageY - 120) + "px")
      .style("cursor", "default")
      .style("padding", "10px")
      .style("border-radius", "3px")
      .style("background", "rgba(255,255,255,0.1)");
  }

  function handleMouseOut(d, i) {
    ////hover over color
    d3.select(this).style("fill", "00e4cf")
      .style("opacity", "0.2");
    ToolTips.style("display", "none");
  }

  svg3.selectAll("circle")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);


  input1 = document.getElementById("p1-input");
  input1.oninput = function() {
    console.log(input1.value)
    p1 = input1.value
    update_parameters(p1, p2, p3);
    update_chart()
  }
  input2 = document.getElementById("p2-input");
  input2.oninput = function() {
    console.log(input1.value)
    p2 = input2.value
    update_parameters(p1, p2, p3);
    update_chart()
  }

  function linearRegression(y, x) {
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

      sum_x += x[i];
      sum_y += y[i];
      sum_xy += (x[i] * y[i]);
      sum_xx += (x[i] * x[i]);
      sum_yy += (y[i] * y[i]);
    }

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
    lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

    return lr;
  }
  var lr = linearRegression(y_values, x_values);
  var max = d3.max(x_values);
  var myLine = svg3.append("line")
    .attr("x1", xScale(0))
    .attr("y1", yScale(lr.intercept))
    .attr("x2", xScale(max))
    .attr("y2", yScale((max * lr.slope) + lr.intercept))
    .style("stroke", "#5ba4ff")
    .style("stroke-width", "1");
  // console.log(max,lr.intercept,lr.slope);
