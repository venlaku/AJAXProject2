//my lastFM API key, host and shared secret
var apiKey = "1dc459d3b860f7223e792e3d93287dad";
var host ='https://ws.audioscrobbler.com/2.0/';
var secret ="163a2390a29cdf9a123cbda2ca4eef21";

//xmlhttprequests for getting album and artist
var getArtist = new XMLHttpRequest();
var getAlbum = new XMLHttpRequest();
var searchButton=document.getElementById("searchbar");


//add by pressing enter. Does the same as clicking Btn
searchButton.addEventListener("keyup", function(e) {
    if (e.code === 'Enter') {
        document.getElementById("btn").click();
    }
});

//function for artist and album results
function showResult () {

    if (getArtist.readyState == 4)
	{
		var json = JSON.parse(getArtist.responseText);
		//getting artist 
		var resultName = "Artist Name: "+ json.artist.name;
		//artist bibliography
		var resultBibliography = "Biography:"+json.artist.bio.summary+"Debut Place: "
		+json.artist.bio.placeformed+"Debut Year: "+json.artist.bio.yearformed;
		//results to artist-info as a list
        document.getElementById("artist-info").innerHTML = "<ul>"+resultName+"</ul>"+"<ul>"+"<ul>"+resultBibliography+"</ul>";
	}
	//albums of the artist
	if (getArtist.readyState == 4) {
        var json = JSON.parse(getArtist.responseText);
		//album variant
		var albumName = new Array();
		var i=2;
		//getting top 10 albums of the artist. Goes through loop until 1 is not less than 10
		while (i<10)
		{					
			albumName[i] = "<li>"+json.topalbums+"</li>";			
			i++;
		}	
		document.getElementById("album").innerHTML = "<ul>"+albumName+"</ul>";		
    }
}

function artistList(){
	var json = JSON.parse(getArtist.responseText);
	var artistsNames= json.artist.name;
	//results to artists as a list
	document.getElementById("artists").innerHTML = "<li>"+artistsNames+"</li>";
	var methodartistsurl = "artist.getinfo";
	getArtist.onreadystatechange = showResult;
	getArtist.open("GET",host+"?method="+methodartistsurl+"&artist="+artist+"&api_key="+apiKey+"&format=json",true);
	getArtist.send();
}

function sendRequest() {

	var methodartist = "artist.getinfo";
	getArtist.onreadystatechange = showResult;
	var artist = document.getElementById("searchbar").value;
    getArtist.open("GET",host+"?method="+methodartist+"&artist="+artist+ "&api_key="+ apiKey + "&format=json",true);
    getArtist.send();
	
	var methodalbums = "artist.gettopalbums";
	getArtist.onreadystatechange = showResult;
	var artist = document.getElementById("searchbar").value;
	var album = '';
	getArtist.open("GET",host+"?method="+methodalbums+"&artist="+artist+"&album="+album+"&api_key="+apiKey+"&format=json",true);
	getArtist.send();	
}