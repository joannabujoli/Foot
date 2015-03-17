var liste, texte;
liste = document.getElementById("selecte2");
texte = liste.options[liste.selectedIndex].text;

var liste1, texte1;
liste1 = document.getElementById("selecte1");
texte1 = liste.options[liste.selectedIndex].text;


var margin = {top: 20, right: 20, bottom: 115, left: 100},
width = 960 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.ticks(10);

var svg2 = d3.select("body").select("#chart").append("svg")
.attr("id",chart)
.attr("width",width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("viewBox","0 0 960 500").attr("preserveAspectRatio","xMidYMid");


var Data = []

d3.csv("bar-data.csv",function(error, data) {
       Data = data
       
       data.forEach(function(d) {
                    d.points2013 = +d.points2013;
                    });
       
       x.domain(data.map(function(d) { return d.club; }));
       y.domain([0, d3.max(data, function(d) { return d.points2013+10; })]);
       
       svg2.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
       .selectAll("text")
       .style("fill","#fff")
       .style("text-anchor", "end")
       .attr("dx", "-.4em")
       .attr("dy", ".33em")
       .attr("transform", "rotate(-90)" );
       
       svg2.append("g")
       .attr("class", "y axis")
       .style("fill","#fff")
       .call(yAxis)
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 8)
       .attr("dy", ".90em")
       .style("text-anchor", "end")
       .text(texte) ;
       
       svg2.selectAll(".bar")
       .data(data)
       .enter().append("rect")
       .attr("class", "bar")
       .attr("x", function(d) { return x(d.club); })
       .attr("width", x.rangeBand())
       .attr("y", function(d) { return y(d.points2013); })
       .attr("height", function(d) { return height - y(d.points2013); })
       .on("click", clickBar);
       
       function clickBar(data) {
       d3.select("body").select("#info2").selectAll("p").remove();
       d3.select("body").select("#info2").append("p").html( function(d){
                                                           return data.club + " : " + data.points2013;
                                                           });
       }
       
       });

var update2 = function(feature){
  
  var liste, texte,valeur, nb;
  liste = document.getElementById("selecte2");
  texte = liste.options[liste.selectedIndex].text;
  valeur = document.getElementById("selecte1").options[document.getElementById('selecte1').selectedIndex].value;
  
  var liste1, texte1;
  liste1 = document.getElementById("selecte1");
  texte1 = liste.options[liste.selectedIndex].value;
  nb = texte1+valeur;
  
  d3.csv("bar-data.csv", function(error, data) {
         data.forEach(function(d) {
                      d[nb] = +d[nb];
                      });
         
         x.domain(data.map(function(d) { return d.club; }));
         y.domain([0, d3.max(data, function(d) { return d[nb]+10; })]);
         
         svg2.selectAll("g.x.axis")
         .style("fill","#fff")
         .attr("transform", "translate(0," + height + ")")
         .call(xAxis)
         .selectAll("text")
         .style("text-anchor", "end")
         .attr("dx", "-.4em")
         .attr("dy", ".33em")
         .attr("transform", "rotate(-90)" );
         
         svg2.select(".y.axis").remove();
         svg2.append("g")
         .attr("class", "y axis")
         .style("fill","#fff")
         .call(yAxis)
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 8)
         .attr("dy", ".90em")
         .style("text-anchor", "end")
         .text(texte) ;
         
         var  rects = d3.selectAll("rect")
         rects.transition().duration(2000).ease(d3.ease("quad"))
         .attr("class", "bar")
         .attr("x", function(d) { return x(d.club); })
         .attr("width", x.rangeBand())
         .attr("y", function(d) { return y(d[nb]); })
         .attr("height", function(d) { return height - y(d[nb])})
         
         
         svg2.selectAll(".bar")
         .on("click", clickBar);
         
         function clickBar(data) {
         var liste, texte;
         liste = document.getElementById("selecte2");
         texte = document.getElementById("selecte2").options[document.getElementById('selecte2').selectedIndex].value;
         var valeur;
         
         valeur = document.getElementById("selecte1").options[document.getElementById('selecte1').selectedIndex].value;
         valeur = texte+valeur;
         
         d3.select("body").select("#info2").selectAll("p").remove();
         d3.select("body").select("#info2").append("p").html( function(d){
                                                             return data.club + " : " + data[valeur];
                                                             });
         }
         });
}