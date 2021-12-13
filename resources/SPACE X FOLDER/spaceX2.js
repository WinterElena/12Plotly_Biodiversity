// sample to print hello to console.
// d3.json("samples.json").then(function(data){
//     console.log("hello");
// });

// //parse samples.json file
// d3.json("samples.json").then(function(data){
//     console.log(data);
// });


d3.json("samples.json").then(function(data){
    firstPerson = data.metadata[0];
    Object.entries(firstPerson).forEach(([key, value]) =>
      {console.log(key + ': ' + value);});
});