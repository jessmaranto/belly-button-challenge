// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(meta => meta.id === parseInt(sample))[0];


    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.filter(sampleData => sampleData.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    const bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Earth'
        }
    }];
    const bubbleLayout = {
        title: { 
          text: "Bacteria Cultures Per Sample",
        x: 0.05 // Set the title position to the left
      },
        margin: { t: 30, l: 60 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Number Of Bacteria" },
        autosize: true, 
      font: { family: "Times" } 
    };
    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
// Map otu_ids to a list of strings for y-ticks
let yTicks = otu_ids.map(id => `OTU ${id}`);

// Sort and slice the data to get the top 10 values
let sortedData = sample_values.map((value, index) => {
    return { value: value, id: otu_ids[index], label: otu_labels[index] };
}).sort((a, b) => b.value - a.value).slice(0, 10);

// Reverse the sorted data for Plotly
sortedData.reverse();

// Prepare data for Plotly
let barDataArray = [{
    x: sortedData.map(data => data.value),
    y: sortedData.map(data => `OTU ${data.id}`), // Use the mapped y-ticks
    type: 'bar',
    text: sortedData.map(data => data.label), // Tooltips
    orientation: 'h' // Horizontal bar chart
}];

// Layout for the bar chart
let barLayout = {
    title: 'Top 10 Bateria Cultures Found',
    xaxis: { title: 'Number of Bacteria' },
    yaxis: { title: 'OTU IDs' }
};

    // Render the Bar Chart
    Plotly.newPlot('bar', barDataArray, barLayout);

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
        dropdownMenu.append("option")
                    .text(sample) /
                    .property("value", sample); 
      });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
