var margin = 20
var width  = 850
var height =650

var svg = d3.select("body").select("#mapp").append("svg").attr("id",chart).attr("width",width).attr("height",height).attr("viewBox","0 0 850 500").attr("preserveAspectRatio","xMidYMid");


// echelle pour les cercles
var scalecircle = d3.scale.sqrt().range([0, 15]).domain([0,30])

// echelle de couleur aussi facile
var scalecolor = d3.scale.linear().range(["#fff","#f22"]).domain([0,30])

// projection !
var projection = d3.geo.mercator()
.scale(width*3)
.center([2,45.2])
.translate([width / 2, height / 2]);


var aspect = 850 / 650,
chart = $("#chart");
$(window).on("resize", function() {
             var targetWidth = chart.parent().width();
             chart.attr("width", targetWidth);
             chart.attr("height", targetWidth / aspect);
             // update projection
             projection
             .translate([targetWidth / 2, (height/aspect) / 2])
             .scale(width*3);
             
             });

// la magie de d3 retourne une fonction de génération de path
// prendra en entrée un bout de geojson et le dessinera en utilisant la projection
var path = d3.geo.path().projection(projection)

var Data = []

// defer, await
queue()
.defer(d3.json, 'departements.geojson')
.defer(d3.csv, 'donnees_ligue.csv') // geojson points
.await(function(error,departements,data){
       // une ligne de code pour dessiner le fond de carte cf path()
       svg.append("g").attr("id","dep").selectAll("path").data(departements.features).enter().append("path").attr("d",path).style("fill","#FFF")
       
       console.log(data)
       Data = data
       
       
       var circles = svg.selectAll("circle").data(data)
       
       
       circles.enter().append("circle")
       .attr("cx",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[0]})
       .attr("cy",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[1]})
       .attr("r",function(d){if(d.X2013==":" || d.X2013=="0" ){return 5} else{return scalecircle(d.X2013)}})
       
       .style("fill",function(d){if(d.X2013==":"  || d.X2013=="0" ){return "#555"}else{return scalecolor(d.X2013)}})
       .style("stroke",function(d){if(d.X2013==":" || d.X2013=="0"){ return"#000" }else{ return d3.rgb(scalecolor(d.X2013)).darker()}})
       .on("click", mouseClick);
       
       
       function mouseClick(data) {
       var liste, texte;
       liste = document.getElementById("selecte");
       texte = liste.options[liste.selectedIndex].text;
       var valeur;
       valeur = document.getElementById("selecte").options[document.getElementById('selecte').selectedIndex].value;
       d3.select("body").select("#info").selectAll("p").remove();
       d3.select("body").select("#info").append("p").html( function(d){
                                                          if(data[valeur]=="0"){
                                                          return data.Club + " <br /> Date cr&eacute;ation  : " + data.Date + "<br />" + "Stade : " + data.Stade + "<br /> " + texte +" : NC"
                                                          } else {
                                                          return data.Club + " <br /> Date cr&eacute;ation  : " + data.Date + "<br />" + "Stade : " + data.Stade +  "<br /> " + texte + " : " + data[valeur] + " millions"
                                                          }
                                                          });
       }
       
       var labels = svg.selectAll("text").data(data)
       labels.enter().append("text")
       .attr("x",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[0]-15})
       .attr("y",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[1]-10})
       .html(function(d){return d.Club})
       .style("text")
       
       
       })



var update = function(feature){
  var circles = d3.select("#mapp").selectAll("circle")
  // d3.rgb("#ag4444").darker()
  circles.transition().duration(2000).ease(d3.ease("quad"))
  .attr("cx",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[0]})
  .attr("cy",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[1]})
  .attr("r",function(d){if(d[feature]==":"  || d[feature]=="0"){return "5" }else{return scalecircle(d[feature])}})
  .style("fill",function(d){if(d[feature]==":"  || d[feature]=="0"){return "#555" }else{return scalecolor(d[feature])}})
  .style("stroke",function(d){if(d[feature]==":"  || d[feature]=="0"){return "#555"}else{return  d3.rgb(scalecolor(d[feature])).darker() }})

}

