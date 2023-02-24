console.log("linked!")

const FRAME_HEIGHT = 600;
const FRAME_WIDTH = 600; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// create dimensions for visualization sizes
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left -MARGINS.right;

//data for bar chart



const FRAME1 = d3.select("#vis1")
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_WIDTH)
						.attr("class", "frame");

const FRAME2 = d3.select("#vis2")
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_WIDTH)
						.attr("class", "frame");

const FRAME3 = d3.select("#vis3")
					.append("svg")
						.attr("height", FRAME_HEIGHT)
						.attr("width", FRAME_WIDTH)
						.attr("class", "frame");

function plot_scatters() {
d3.csv("/data/iris.csv").then((data) => {
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
						.range(["red", "orange", "blue"]);


	// plotting the circles onto the viz

	FRAME1.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("cx", (d) => {return X_SCALE(d.Sepal_Length) + MARGINS.left})
				.attr("cy", (d) => {return Y_SCALE(d.Petal_Length) + MARGINS.top})
				.attr("r", 5)
				.attr("class", "point")
				.attr("fill-opacity", "50%")
				.attr("fill", d => colorScale(d.Species));

	//adding a title
	FRAME1.append("text")
			.attr("x", (VIS_WIDTH / 2))
			.attr("y", (MARGINS.top / 2))
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
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


	FRAME2.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
				.attr("cx", (d) => {return X_SCALE2(d.Sepal_Width) + MARGINS.left})
				.attr("cy", (d) => {return Y_SCALE2(d.Petal_Width) + MARGINS.top})
				.attr("r", 5)
				.attr("class", "point")
				.attr("fill-opacity", "50%")
				.attr("fill", d => colorScale(d.Species));

	//adding a title
	FRAME2.append("text")
			.attr("x", (VIS_WIDTH / 2))
			.attr("y", (MARGINS.top / 2))
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
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

	
	});
};

plot_scatters();

function plot_bar() {
const data = [
  {species: "setosa", count: 75},
  {species: "versicolor", count: 75},
  {species: "virginica", count: 50},
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
  .range(["aquamarine", "orange", "red"]);

const FRAME = d3.select("#vis3")
  .append("svg")
  .attr("height", FRAME_HEIGHT)
  .attr("width", FRAME_WIDTH)
  .attr("class", "frame");

const bars = FRAME3.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", d => X_SCALE(d.species) + MARGINS.left)
  .attr("y", d => Y_SCALE(d.count) + MARGINS.top)
  .attr("width", X_SCALE.bandwidth())
  .attr("height", d => VIS_HEIGHT - Y_SCALE(d.count))
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
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text("Counts of Species");



};

plot_bar();


