//my lastFM API key, host and shared secret
var apiKey = "1dc459d3b860f7223e792e3d93287dad";
var host ='https://ws.audioscrobbler.com/2.0/';
var secret ="163a2390a29cdf9a123cbda2ca4eef21";

//xmlhttprequests for getting album and artist
var getArtist = new XMLHttpRequest();
var getAlbum = new XMLHttpRequest();
var getTopArtists = new XMLHttpRequest();
var searchBar=document.getElementById("searchbar");

//function for artist and album results
function showResult () {

    if (getArtist.readyState == 4 && getArtist.status==200)
	{
		var json = JSON.parse(getArtist.responseText);
		//getting artist 
		var resultName = "Artist Name:"+json.artist.name;
		var resultBibliography = "Biography:"+json.artist.bio.summary;
		//results to artist-info as a list
        document.getElementById("artist-info").innerHTML = "<ul>"+resultName+"</ul>"+"<ul>"+resultBibliography+"</ul>";
	}
	//albums of the artist
	if (getAlbum.readyState == 4 && getAlbum.status==200) {
        var json = JSON.parse(getAlbum.responseText);
		//album variant
		var albumName = new Array();
		var i=0;
		//getting top 10 albums of the artist. Goes through loop until i is not less than 10
		for (var i=0; i < json.topalbums.album.length; i++)
		{					
			albumName[i] = `<li><a href="${json.topalbums.album[i].url}">${json.topalbums.album[i].name}</a></li>`;			
		}	
		document.getElementById("album").innerHTML = albumName.join('');		
    }
}

function getAllArtists() {
	if (getTopArtists.readyState == 4 && getTopArtists.status==200) {
		var json = JSON.parse(getTopArtists.responseText);
		var artistsNames= new Array();
		// //results to artists as a list
		 for (var i=0; i < json.artists.artist.length; i++) {
			artistsNames[i] = `<li onclick="searchArtist('${json.artists.artist[i].name}')">${json.artists.artist[i].name}</li>`;			
		}
		console.log(artistsNames, json);
		document.getElementById("artists").innerHTML = artistsNames.join('');
	}
}

var methodartistsurl = "chart.gettopartists";
getTopArtists.onreadystatechange = getAllArtists;
getTopArtists.open("GET",host+"?method="+methodartistsurl+"&api_key="+apiKey+"&format=json",true);
getTopArtists.send();

function sendRequest(event) {
	event.preventDefault();
	var artist = document.getElementById("searchbar").value;
	searchArtist(artist);
	return false;		
}

function searchArtist(artist) {
	var methodartist = "artist.getinfo";
	getArtist.onreadystatechange = showResult;
    getArtist.open("GET",host+"?method="+methodartist+"&artist="+artist+ "&api_key="+ apiKey + "&format=json",true);
    getArtist.send();
	
	var methodalbums = "artist.gettopalbums";
	getAlbum.onreadystatechange = showResult;
	getAlbum.open("GET",host+"?method="+methodalbums+"&artist="+artist+"&api_key="+apiKey+"&format=json"+"&limit=10",true);
	getAlbum.send();
}