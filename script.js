var view;


function getWeather()
{
	
	$("#table").append('<tr id="row1"><td id="now" colspan="3"></td><td id="later" colspan="2"></td></tr>')
	
	
	fetch('https://api.weather.gov/gridpoints/OKX/31,34/forecast')
  .then(response => {
    return response.json()
  })
  .then(data => {
    // Work with JSON data here
    forecast = data.properties.periods
	
	now = data.properties.periods[0]
	later = data.properties.periods[1]
	
	console.log(now)
	
	celsius = Math.round((now.temperature - 32) * 5/9 )
	
	$("#now").html("<div class='container'>" + renderIcon(now.shortForecast,now.isDaytime) + "<h1>" + now.name + "</h1><h2>" + now.temperature + "&#176;F (" + celsius + "&#176;C)</h2><p>" + now.detailedForecast + "</p></div>")
	
	
	celsius = Math.round((later.temperature - 32) * 5/9 )
	
	$("#later").html("<div class='container'>" + renderIcon(later.shortForecast,later.isDaytime) + "<h1>" + later.name + "</h1><h2>" + later.temperature + "&#176;F (" + celsius + "&#176;C)</h2><p>" + later.shortForecast + "</p><p>Wind: " + later.windSpeed + "</p></div>")
  
  })
  
}

function getHourlyWeather()
{
	fetch('https://api.weather.gov/gridpoints/OKX/31,34/forecast/hourly')
  .then(response => {
    return response.json()
  })
  .then(data => {

  for (i = 0; i < 7; i++) {
			period = data.properties.periods[i]
			celsius = Math.round((period.temperature - 32) * 5/9 )
			
			hour = period.endTime.split(":")[0].split("T")[1]
			
			$("#table").append("<tr><td class='hourly'>" + hour + ":00 " + renderIcon(period.shortForecast,period.isDaytime) + "</td><td colspan='4' class='hourly'>" + period.shortForecast + " - " + period.temperature + "&#176;F (" + celsius + "&#176;C) - " + period.windSpeed + " " + period.windDirection + "</td></tr>")
  }
  })
}

function getPATH()
{
	fetch('https://path.api.razza.dev/v1/stations/grove_street/realtime')
  .then(response => {
    return response.json()
  })
  .then(data => {

  for (i = 0; i < data.upcomingTrains.length; i++) {
			train = data.upcomingTrains[i]
			
			if(train.status = "ON_TIME") {
			    status = "<b style='color:green'>On Time</b>"
			} else{
			    status = "<b style='color:red'>" + train.status + "</b>"
			}
			
			traintime = new Date(train.projectedArrival).getTime()
			now = new Date().getTime()
			
			minstoarrive = ((traintime - now) / 1000) / 60
			
			if(minstoarrive < 1)
			{
			    minstoarrive = "< 1 min"
			}
			else
			{
			    minstoarrive = Math.round(minstoarrive) + " mins"
			}
			
			$("#table").append("<tr><td><b>" + minstoarrive + "</b></td><td>" + status + "</td><td colspan='3'><strong style='color:" + train.lineColors[0] + "'>" + train.headsign + "</strong></tr>")
  }
  })
}


function getAlerts()
{
	
  
  $("#table").append('<tr id="row1"><td id="alerts" colspan="5"></td></tr>')
  
  fetch('https://api.weather.gov/alerts/active?area=NJ')
  .then(response => {
    return response.json()
  }).then(data => {
	  
		 if(data.features.length === 0) { $("#alerts").append( "<h2>No Alerts</b></h2>") }
		 else{
			 $("#alerts").append("<ul>")
		  for (i = 0; i < data.features.length; i++) {
			  item = data.features[i].properties
			  
			  $("#alerts").append("<li><b>" + item.severity + "</b>: " + item.headline + "</li>")
		  }
		 }
		$("#alerts").append("</ul>")
  })
}

function updateImage(id)
{
    console.log("blash")
}

function getRadar()
{
      
	
	var d = new Date();
	
	console.log(d.getHours())
	console.log(d.getMinutes())
	
	$("#table").append('<tr id="row1" rowspan="3"><td id="radar" colspan="5"></td></tr>')
	//$("#radar").append("<img src='https://radar.weather.gov/ridge/Overlays/Topo/Short/OKX_Topo_Short.jpg'>")
	$("#radar").append("<img src='https://radar.weather.gov/ridge/Overlays/County/Short/OKX_County_Short.gif'>")
	$("#radar").append("<img id='current' onError='updateImage(this.id)' src='https://radar.weather.gov/ridge/RadarImg/NCR/OKX_NCR_0.gif'>")
	
	
	
}

function get5DayWeather()
{
	$("#table").append('<tr rowspan="3"><td id="forecast1" class="forecast"></td><td id="forecast2" class="forecast"></td><td id="forecast3" class="forecast"></td><td id="forecast4" class="forecast"></td><td id="forecast5" class="forecast"></td></tr>')
	
	fetch('https://api.weather.gov/gridpoints/OKX/31,34/forecast')
  .then(response => {
    return response.json()
  })
  .then(data => {

	j = 1
  
  for (i = 2; i < (data.properties.periods.length - 2); i++) {
	period = data.properties.periods[i]
	
	if(period.isDaytime)
	{
	celsius = Math.round((period.temperature - 32) * 5/9 )
	
	$("#forecast" + j ).html("<h2>" + period.name + "</h2>" + renderIcon(period.shortForecast,period.isDaytime) + "<div><h3>" + period.temperature + "&#176;F (" + celsius + "&#176;C)</h3><p>" + period.shortForecast + "</p></div>")

	 j++
	}
  }
  })
}

function rotateView()
{
    $("#table").html()
    
    if(view === "hourly")
	    {
	        
	        window.location = "index.html?view=5day"
	    }
	 if(view === "radar")
	    {

	        window.location = "index.html?view=hourly"
	    }
	    if(view === "5day")
	    {
	        window.location = "index.html?view=alerts"
	    }
	    if(view === "alerts")
	    {
	        window.location = "index.html"
	    }
	    if(view === null)
	    {
	        window.location = "index.html?view=radar"
	    }
}

$( document ).ready(function() {
	const urlParams = new URLSearchParams(window.location.search);
	view = urlParams.get('view');
	
	$("#time").html(Date().toLocaleString("en-GB",{ timeZoneName: "short"}))

	
	if(view === "hourly") {getHourlyWeather()}
	if(view === "5day") {get5DayWeather()}
	if(view === "alerts") {getAlerts()}
	if(view === "radar") {getRadar()}
	if(view === "train") {getPATH()}
	if(view === null) { getWeather()} 

	setTimeout(function(){rotateView(view)}, 10000);
	    
});

function renderIcon(weather, isDaytime)
{
	if(isDaytime){
		time = "day"
	}
	else{
		time = "night"
	}
	
	output = "<i class='wi wi-"+time+"-sunny sunny' />"
	
	if(weather.includes("Sleet")){
		output = "<i class='wi wi-"+time+"-sleet' />"
	}
	
	if(weather.includes("Snow")){
		output = "<i class='wi wi-"+time+"-snow' />"
	}
	if(weather.includes("Cloudy"))
	{
	    output = "<i class='wi wi-"+time+"-cloudy' />"
	}
	if(weather.includes("Partly Cloudy"))
	{
	    output = "<i class='wi wi-"+time+"-cloudy sunny' />"
	}
	if(weather.includes("Storm")){
		output = "<i class='wi wi-"+time+"-lightning sunny' />"
	}
	if(weather.includes("Lightning")){
		output = "<i class='wi wi-"+time+"-lightning sunny' />"
	}
	if(weather.includes("Sunny")){
		output = "<i class='wi wi-"+time+"-sunny sunny' />"
	}
	if(weather.includes("Rain")){
		output = "<i class='wi wi-"+time+"-rain wet' />"
	}
	if(weather.includes("Rain Showers Likely")){
		output = "<i class='wi wi-"+time+"-rain wet' />"
	}
	if(weather.includes("Light Rain")){
	    output = "<i class='wi wi-"+time+"-showers wet' />"
	}
	if(weather.includes("Slight Chance Rain")){
	    output = "<i class='wi wi-"+time+"-sunny sunny' />"
	}
	if(weather.includes("Slight Chance Rain Showers") && weather.includes("Partly Sunny"))
	{
	    output = "<i class='wi wi-"+time+"-cloudy sunny' />"
	}
	if(weather.includes("Clear")){
		output = "<i class='wi wi-"+time+"-clear' />"
	}
	
	return output
}