/**
 *
 * Ce fichier contient le code JavaScript concernant la création de la carte de France ainsi que la réccupération des données Budget et Recette sur les années 2009 et 2013
 *
 **/

var margin = 20
var width  = 850
var height =650

var svg = d3.select("body").select("#mapp").append("svg").attr("id",chart).attr("width",width).attr("height",height).attr("viewBox","0 0 850 500").attr("preserveAspectRatio","xMidYMid");


// echelle pour les cercles
var scalecircle = d3.scale.sqrt().range([0, 15]).domain([0,30])

// echelle de couleur aussi facile
var scalecolor = d3.scale.linear().range(["#fff","#f22"]).domain([0,30])

// projection
var projection = d3.geo.mercator()
.scale(width*3)
.center([2,45.2])
.translate([width / 2, height / 2]);


var aspect = 850 / 650,
chart = $("#chart");
//fonction resize fenetre
$(window).on("resize", function() {
             var targetWidth = chart.parent().width();
             chart.attr("width", targetWidth);
             chart.attr("height", targetWidth / aspect);
             projection
             .translate([targetWidth / 2, (height/aspect) / 2])
             .scale(width*3);
             
             });

var path = d3.geo.path().projection(projection)

var Data = []

queue()
.defer(d3.json, 'departements.geojson')
.defer(d3.csv, 'donnees_ligue.csv')
.await(function(error,departements,data){
       svg.append("g").attr("id","dep").selectAll("path").data(departements.features).enter().append("path").attr("d",path).style("fill","#FFF")
       
       Data = data
  
       var circles = svg.selectAll("circle").data(data)
       
       circles.enter().append("circle")
       .attr("cx",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[0]})
       .attr("cy",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[1]})
       .attr("r",function(d){if(d.Budget2013==":" || d.Budget2013=="0" ){return 5} else{return scalecircle(d.Budget2013)}})
       
       .style("fill",function(d){if(d.Budget2013==":"  || d.Budget2013=="0" ){return "#555"}else{return scalecolor(d.Budget2013)}})
       .style("stroke",function(d){if(d.Budget2013==":" || d.Budget2013=="0"){ return"#000" }else{ return d3.rgb(scalecolor(d.Budget2013)).darker()}})
       .on("click", mouseClick);
       
       //fonction qui affiche les informations dans la div #info lors du clic sur un cercle
       function mouseClick(data) {
       var liste, valeur,texte;
       liste = document.getElementById("selecte");
       valeur = document.getElementById("selecte").options[document.getElementById('selecte').selectedIndex].value;
       var liste2, texte2;
       liste2 = document.getElementById("selecte_br");
       var valeur2;
       valeur2 = document.getElementById("selecte_br").options[document.getElementById('selecte_br').selectedIndex].value;
       texte2 = valeur2+valeur
       d3.select("body").select("#info").selectAll("p").remove();
       d3.select("body").select("#info").append("p").html( function(d){
                                                          if(data[valeur]=="0"){
                                                          return data.Club + " <br /> Date cr&eacute;ation  : " + data.Date + "<br />" + "Stade : " + data.Stade + "<br /> " + valeur2 +" : NC"
                                                          } else if(valeur == "2013" && valeur2 == "Recette"){
                                                               return data.Club + " <br /> Date cr&eacute;ation  : " + data.Date + "<br />" + "Stade : " + data.Stade
                                                          }else {
                                                          return data.Club + " <br /> Classement : " + data["Classement"+valeur] + " <br /> Date cr&eacute;ation  : " + data.Date + "<br />" + "Stade : " + data.Stade +  "<br /> " + valeur2 + " : " + data[texte2] + " millions"
                                                          }
                                                          });
       }
       
       //ecrit le nom des clubs sur la carte
       var labels = svg.selectAll("text").data(data)
       labels.enter().append("text")
       .attr("x",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[0]-15})
       .attr("y",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[1]-10})
       .html(function(d){return d.Club})
       .style("text")
       
       
       })


//fonction de mise a jour
var update = function(feature){
  
  var liste, valeur,texte, liste2, texte2, valeur2;
  
  liste = document.getElementById("selecte");
  valeur = document.getElementById("selecte").options[document.getElementById('selecte').selectedIndex].value;
  liste2 = document.getElementById("selecte_br");
  valeur2 = document.getElementById("selecte_br").options[document.getElementById('selecte_br').selectedIndex].value;
  texte2 = valeur2+valeur
  console.log(texte2)
  
  var circles = d3.select("#mapp").selectAll("circle")
  circles.transition().duration(2000).ease(d3.ease("quad"))
    .attr("cx",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[0]})
    .attr("cy",function(d){var p = projection([+d.Longitude,+d.Latitude]); return p[1]})
    .attr("r",function(d){if(d[texte2]==":"  || d[texte2]=="0"){return "5" }else{return scalecircle(d[texte2])}})
    .style("fill",function(d){if(d[texte2]==":"  || d[texte2]=="0"){return "#555" }else{return scalecolor(d[texte2])}})
    .style("stroke",function(d){if(d[texte2]==":"  || d[texte2]=="0"){return "#555"}else{return  d3.rgb(scalecolor(d[texte2])).darker() }})

}

