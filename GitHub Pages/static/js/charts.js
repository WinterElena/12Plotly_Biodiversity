//Bar and Bubble charts

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// Create the buildCharts function.
function buildCharts(sample) {

  // Use d3.json to load and retrieve the samples.json file 
  d3.json("static/js/samples.json").then((data) => {

    // Create a variable that holds the samples array. 
    var samples = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var filterSample = samples.filter(newObj => newObj.id == sample);

    //  Create a variable that holds the first sample in the array.
    var first_sample = filterSample[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = first_sample.otu_ids;
    var otuLabels = first_sample.otu_labels.slice(0, 10).reverse();
    var sampleData = first_sample.sample_values.slice(0, 10).reverse();

    var allLabels = first_sample.otu_labels;
    var allValues = first_sample.sample_values;

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.map(newObj => "OTU" + newObj + "  ").slice(0, 10).reverse();
    console.log(yticks)

    // Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: sampleData,
      type: "bar",
     // opacity: 0.5,
     // marker: {
     //   color: 'rgb(158,202,225)',
     //   line: {
     //     color: 'rgb(8,48,107)',
     //     width: 1.5
      orientation: "h",
          text: otuLabels
        }];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
      // font: {
      //family: 'Arial Rounded MT Bold',
      //       size: 18,
      //       color: '#7f7f7f'
      //     }
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    //----------------------------------------------------------//
    // Deliverable 2

    // Create the trace for the bubble chart.

    var bubbleData = [{
      x: otuIds,
      y: allValues,
      text: allLabels,
      mode: 'markers',
      marker: {
        size: allValues,
        color: allValues,
        colorscale: "Blackbody"
      }
    }

    ];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      hovermode: 'closest',
      autosize: true,
      automargin: true,
      pad: 5
    };

    //Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    //----------------------------------------------------------//
    // Deliverable 3

    //Create a variable that filters the metadata array for the object with the desired sample number.

    // Create a variable that holds the first sample in the array.
    var metadata = data.metadata;
    var gaugeArray = metadata.filter(sampleObj => sampleObj.id == sample);

    //Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeArray[0];

    //Create a variable that holds the washing frequency.
    var washing = gaugeResult.wfreq;

    //Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: washing,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week" },
      dtick: 2,
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ]

      }

    }];

    //Create the layout for the gauge chart.
    var gaugeLayout = {
      automargin: true
    };

    //Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}