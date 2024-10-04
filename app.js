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
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
});
}

// function to build both charts
function buildCharts(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      const samples = data.samples;
      const result = samples.filter(sampleData => sampleData.id === sample)[0];
  
      if (!result) {
        console.error(`Sample ${sample} not found`);
        return;
      }
  
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
          x: 0.05
        },
        margin: { t: 30, l: 60 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Number Of Bacteria" },
        autosize: true, 
        font: { family: "Times" } 
      };
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
      // Prepare data for the Bar Chart
      let sortedData = otu_ids.map(otuid=>`OTU ${otuid}`)
  
      let barDataArray = [{
        x: sample_values.slice(0,10).reverse(),
        y: sortedData.slice(0,10).reverse(),
        type: 'bar',
        text: otu_labels.slice(0,10).reverse(),
        orientation: 'h'
      }];
  
      let barLayout = {
        title: 'Top 10 Bacteria Cultures Found',
        xaxis: { title: 'Number of Bacteria' },
        yaxis: { title: 'OTU IDs' }
      };
    
      Plotly.newPlot('bar', barDataArray, barLayout);
    
    }); // Closing brace for d3.json
}
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
                    .text(sample)
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
