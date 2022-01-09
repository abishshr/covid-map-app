//wanna create a map that shows the world data of Covid 19
//need to import the world map: https://docs.mapbox.com/api/maps/#static-images
//the data of covid 19: https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/10-13-2020.csv
//calculate the xpos, ypos of each countries with latitude and longitude based on the web mercator: https://en.wikipedia.org/wiki/Web_Mercator_projection
//use ellipse to express the different level of covid 19
//figure out how to use map to show the size of ellipse
//maybe add different conditions that are allowed users to check, such as confirmed number, death number, recovered number, and active number

var mapimg;

var centerlat = 0;
var centerlon = 0;

var lat = 0;
var lon = 0;

var zoom = 1;
var covid19;
var usrecover;


//load map image:https://docs.mapbox.com/api/maps/#static-images and covid 19 date:https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_daily_reports/10-13-2020.csv
function preload() {
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1/1024x512?access_token=pk.eyJ1IjoiZGFkYXdhbmciLCJhIjoiY2tnOTg1NmgxMDV3MTMybzN0eDlkc3VuZiJ9.BL3v9F3TP9KcmI7ozEn2wg');

  covid19 = loadStrings('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/10-13-2020.csv');

  usrecover = loadStrings('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports_us/10-13-2020.csv');
}


// change the latitude and longitude to xpos and ypos, get help from https://en.wikipedia.org/wiki/Web_Mercator_projection
function webmercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function webmercY(lat) {
  lat = radians(lat);
  var c = (256 / PI) * pow(2, zoom);
  var d = tan(PI / 4 + lat / 2);
  var e = PI - log(d);
  return c * e;
}

//I tried to use the typing way to check different status before but it doesnt work, then I found a new way: https://www.geeksforgeeks.org/p5-js-changed-function/
function setup() {
  createCanvas(1024, 600);

  cCheckbox = createCheckbox('Confirmed', false);
  cCheckbox.position(20, 10)
  cCheckbox.changed(cChanged);

  dCheckbox = createCheckbox('Death', false);
  dCheckbox.position(110, 10)
  dCheckbox.changed(dChanged);

  rCheckbox = createCheckbox('Recovered', false);
  rCheckbox.position(170, 10)
  rCheckbox.changed(rChanged);

  aCheckbox = createCheckbox('Active', false);
  aCheckbox.position(260, 10)
  aCheckbox.changed(aChanged);


  translate(width / 2, height / 2);
  imageMode(CENTER);
  image(mapimg, 0, 0);
}


//Confirmed == red
function cChanged() {
  translate(width / 2, height / 2);
  var cx = webmercX(centerlon);
  var cy = webmercY(centerlat);

  for (var i = 0; i < covid19.length; i++) {
    var data = covid19[i].split(/,/);

    var lat = data[5];
    var lon = data[6];
    var confirmed = data[7];
    var x = webmercX(lon) - cx;
    var y = webmercY(lat) - cy;

    if (this.checked()) {
      var maxconfirmed = log(confirmed) * 2;
      confirmed = pow(1, confirmed);
      var r = map(confirmed, 0, maxconfirmed, 0, 100);
      strokeWeight(2);
      stroke(255, 255, 255, 6);

      //Try to use different color to show the level before, but it looks very messy
      // if (maxconfirmed < 5){
      //  fill(255, 183, 33, 60);
      // }
      //   else{
      //  fill(255, 33, 33, 255);
      //  }
      fill(255, 33, 33, 100);
      ellipse(x, y, r, r);
    } else {
      clear()
      //since after clear(), the map image disappear as well, so I call it again.
      imageMode(CENTER);
      image(mapimg, 0, 0);
    }
  }
}


//Death == black
function dChanged() {
  translate(width / 2, height / 2);
  var cx = webmercX(centerlon);
  var cy = webmercY(centerlat);

  for (var i = 0; i < covid19.length; i++) {
    var data = covid19[i].split(/,/);

    var lat = data[5];
    var lon = data[6];
    var deaths = data[8];
    var x = webmercX(lon) - cx;
    var y = webmercY(lat) - cy;

    if (this.checked()) {
      var maxdeaths = log(deaths) * 2;
      deaths = pow(1, deaths);
      var r1 = map(deaths, 0, maxdeaths, 0, 100);
      strokeWeight(2);
      stroke(255, 255, 255, 6);
      fill(0, 33, 33, 100);
      ellipse(x, y, r1, r1);
    } else {
      clear()
      imageMode(CENTER);
      image(mapimg, 0, 0);
    }
  }
}


//Recovered == green
function rChanged() {
  translate(width / 2, height / 2);
  var cx = webmercX(centerlon);
  var cy = webmercY(centerlat);

  //world
  for (let i = 0; i < covid19.length + usrecover.length; i++) {
    let recovered;
    let x, y, lat, lon, data;
    if (i < covid19.length) {
      data = covid19[i].split(/,/);
      lat = data[5];
      lon = data[6];
      recovered = data[9];
      x = webmercX(lon) - cx;
      y = webmercY(lat) - cy;
    } else {
      data = usrecover[i - covid19.length].split(/,/);
      lat = data[3];
      lon = data[4];
      recovered = data[7];
      x = webmercX(lon) - cx;
      y = webmercY(lat) - cy;
    }

    if (this.checked()) {
      var maxrecovered = log(recovered) * 1;
      recovered = pow(1, recovered);
      var r2 = map(recovered, 0, maxrecovered, 0, 100);
      strokeWeight(2);
      stroke(255, 255, 255, 6);
      fill(54, 255, 11, 100);
      ellipse(x, y, r2, r2);
    } else {
      clear()
      imageMode(CENTER);
      image(mapimg, 0, 0);
    }
  }
}
// }

//Active == orange
function aChanged() {
  translate(width / 2, height / 2);
  var cx = webmercX(centerlon);
  var cy = webmercY(centerlat);

  for (var i = 0; i < covid19.length; i++) {
    var data = covid19[i].split(/,/);

    var lat = data[5];
    var lon = data[6];
    var active = data[10];
    var x = webmercX(lon) - cx;
    var y = webmercY(lat) - cy;

    if (this.checked()) {
      var maxactive = log(active) * 2;
      active = pow(1, active);
      var r3 = map(active, 0, maxactive, 0, 100);
      strokeWeight(2);
      stroke(255, 255, 255, 6);
      fill(255, 186, 0, 100);
      ellipse(x, y, r3, r3);
    } else {
      clear()
      imageMode(CENTER);
      image(mapimg, 0, 0);
    }
  }
}


function draw() {
  rectMode(CENTER);
  noStroke();
  fill(255, 255, 255);
  rect(0, 0, 1024, 88);
  noStroke();
  fill(0);
  textAlign(CENTER);
  textSize(15);
  text('Covid-19 World Map', width / 2, 25);
}
