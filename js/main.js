console.log("linked!")

const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 600; 
const MARGINS = {left: 100, right: 100, top: 50, bottom: 50};

// create dimensions for visualization sizes
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left -MARGINS.right;


const FRAME1 = d3.select("#vis1")
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_WIDTH)
						.attr("class", "frame");

const FRAME2 = d3.select("#vis2")
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_WIDTH)
						.attr("class", "frame")
						.lower();

const FRAME3 = d3.select("#vis3")
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_WIDTH)
						.attr("class", "frame");

d3.csv("data/iris.csv").then((data) => {
	console.log(data);

	const max_sepal_length = d3.max(data, (d) => {return parseFloat(d.Sepal_Length)});
	const max_sepal_width = d3.max(data, (d) => {return parseFloat(d.Sepal_Width )});
	const max_petal_length = d3.max(data, (d) => {return parseFloat(d.Petal_Length)});
	const max_petal_width = d3.max(data, (d) => {return parseFloat(d.Petal_Width)});
	// sepal length on x axis and petal length on y axis
	

	console.log(max_sepal_length, max_petal_length);

	const X_SCALE = d3.scaleLinear()
						.domain([0, Math.ceil(max_sepal_length)])
						.range([0, VIS_WIDTH]);

	const Y_SCALE = d3.scaleLinear()
						.domain([0, Math.ceil(max_petal_length)])
						.range([VIS_HEIGHT, 0]);

	const colorScale = d3.scaleOrdinal()
						.domain(data.map(d => d.Species))
						.range(["aquamarine", "lightsalmon", "lightsteelblue"]);

	const brush = d3.brush()
  .extent([[MARGINS.left, MARGINS.top], [MARGINS.left + VIS_WIDTH, MARGINS.top + VIS_HEIGHT]])
  .on("brush end", brushed);


	// plotting the circles onto the viz

	FRAME1.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("cx", (d) => {return X_SCALE(d.Sepal_Length) + MARGINS.left})
				.attr("cy", (d) => {return Y_SCALE(d.Petal_Length) + MARGINS.top})
				.attr("r", 5)
				.attr("class", "point")
				.attr("fill-opacity", 0.5)
				.attr("fill", d => colorScale(d.Species))
				.attr("id", (d) => `length-${d.id}`);

	//adding a title
	FRAME1.append("text")
			.attr("x", (VIS_WIDTH / 2 + MARGINS.left))
			.attr("y", (MARGINS.top / 2))
			.attr("text-anchor", "middle")
			.style("font-size", "20px")
			.style("font-weight", "bold")
			.text("Petal_Length vs. Sepal_Length");

	// adding the two axis

	FRAME1.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
			.call(d3.axisBottom(X_SCALE).ticks(10))
			.attr("font-size", "14px")
			.attr("font-family", "Arial");

	FRAME1.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
			.call(d3.axisLeft(Y_SCALE).ticks(10))
			.attr("font-size", "14px")
			.attr("font-family", "Arial");


	// creating the second visualization

	const X_SCALE2 = d3.scaleLinear()
						.domain([0, Math.ceil(max_sepal_width)])
						.range([0, VIS_WIDTH]);

	const Y_SCALE2 = d3.scaleLinear()
						.domain([0, Math.ceil(max_petal_width)])
						.range([VIS_HEIGHT, 0]);

	// declaring a circles variable here for the brushing later on					
	const circles = FRAME2.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("cx", (d) => {return X_SCALE2(d.Sepal_Width) + MARGINS.left})
				.attr("cy", (d) => {return Y_SCALE2(d.Petal_Width) + MARGINS.top})
				.attr("r", 5)
				.attr("class", "point")
				.attr("fill-opacity", 0.5)
				.attr("fill", d => colorScale(d.Species));

	//adding a title
	FRAME2.append("text")
			.attr("x", (VIS_WIDTH / 2 + MARGINS.left))
			.attr("y", (MARGINS.top / 2))
			.attr("text-anchor", "middle")
			.style("font-size", "20px")
			.style("font-weight", "bold")
			.text("Petal_Width vs. Sepal_Width");

	// adding the two axis

	FRAME2.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
			.call(d3.axisBottom(X_SCALE2).ticks(10))
			.attr("font-size", "14px")
			.attr("font-family", "Arial");

	FRAME2.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
			.call(d3.axisLeft(Y_SCALE2).ticks(10))
			.attr("font-size", "14px")
			.attr("font-family", "Arial");

	FRAME2.select("text")
  .attr("fill", "black");

  // calling the brushing onto the second viz using d3.brush
	FRAME2.call(d3.brush() 
      					.extent([[MARGINS.left, MARGINS.top],[FRAME_WIDTH - MARGINS.left, FRAME_HEIGHT - MARGINS.top],]) 
      					.on("start brush", updateChart));

	// creating the brushing and updateChart functions to work on all three visualizations
	let extent = undefined;
  function updateChart(event) {
    extent = event.selection;
    let highlightSpecies = {
      setosa: false,
      versicolor: false,
      virginica: false,
    };
    circles.classed("selected", function (d) {
      const brushed = isBrushed(
        extent,
        X_SCALE2(d["Sepal_Width"]) + MARGINS.left,
        Y_SCALE2(d["Petal_Width"]) + MARGINS.top
      );
      d3.select(`#length-${d.id}`).attr("class", brushed ? "selected" : null);
      highlightSpecies[d["Species"]] =
        highlightSpecies[d["Species"]] || brushed;

      return brushed;
    });
    Object.entries(highlightSpecies).forEach(([k, brushed]) => {
      if (brushed) {
        d3.select(`#bar-${k}`).attr("class", "selected");
      } else {
        d3.select(`#bar-${k}`).attr("class", null);
      }
    });
  };

  function isBrushed(brush_coords, cx, cy) {
    let x0 = brush_coords[0][0];
    let x1 = brush_coords[1][0];
    let y0 = brush_coords[0][1];
    let y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
  };
	
	let selectedPoints;

	function brushed(event) {
  
};
	
	});



// creating bar chart

const data = [
  {species: "virginica", count: 50},
  {species: "versicolor", count: 50},
  {species: "setosa", count: 50},
];

const X_SCALE = d3.scaleBand()
  .domain(data.map(d => d.species))
  .range([0, VIS_WIDTH])
  .padding(0.2);

const Y_SCALE = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.count) + 10])
  .range([VIS_HEIGHT, 0]);

const colorScale = d3.scaleOrdinal()
  .domain(data.map(d => d.species))
  .range(["lightsteelblue", "lightsalmon", "aquamarine"]);


const bars = FRAME3.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => X_SCALE(d.species) + MARGINS.left)
  .attr("y", d => Y_SCALE(d.count) + MARGINS.top)
  .attr("width", X_SCALE.bandwidth())
  .attr("height", d => VIS_HEIGHT - Y_SCALE(d.count))
  .attr("fill-opacity", 0.5)
  .attr("id", (d) => `bar-${d.species}`)
  .attr("fill", d => colorScale(d.species));

const xAxis = d3.axisBottom(X_SCALE);

const yAxis = d3.axisLeft(Y_SCALE);

FRAME3.append("g")
			.attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
			.call(xAxis)
			.attr("font-size", "14px")
			.attr("font-family", "Arial");

FRAME3.append("g")
		.attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
		.call(yAxis)
		.attr("font-size", "14px")
		.attr("font-family", "Arial");

//adding a title
FRAME3.append("text")
  .attr("x", VIS_WIDTH / 2 + MARGINS.left)
  .attr("y", MARGINS.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "20px")
  .style("font-weight", "bold")
  .text("Counts of Species");
