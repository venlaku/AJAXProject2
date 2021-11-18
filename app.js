//my lastFM API key, host and shared secret
var apiKey = "1dc459d3b860f7223e792e3d93287dad";
var host ='https://ws.audioscrobbler.com/2.0/';
var secret ="163a2390a29cdf9a123cbda2ca4eef21";

//xmlhttprequests for getting album and artist
var getArtist = new XMLHttpRequest();
var getAlbum = new XMLHttpRequest();
var getTopArtists = new XMLHttpRequest();
var getAlbumSongs = new XMLHttpRequest();

//function for artist and album results when clicking artist name in sidecolumn or searching
function showResult () {
    if (getArtist.readyState == 4 && getArtist.status==200)
	{
		var json = JSON.parse(getArtist.responseText);
		//getting artist 
		var resultName = "<strong>"+json.artist.name+"</strong>";
		var resultBibliography = "<br/>"+"<br/>"+json.artist.bio.summary;
		//lastfm does not provide pictures anymore this returns a star picture
		var image = json.artist.image[2]["#text"];
		document.getElementById("artist-info").innerHTML = `<h4>${resultName}</h4><img scr=${image}><p>${resultBibliography}</p>`;     
	}
	//albums of the artist
	if (getAlbum.readyState == 4 && getAlbum.status==200) {
        var json = JSON.parse(getAlbum.responseText);
		//album variant
		var albumName = new Array();
		var i=0;
		//getting albums of the artist
		for (var i=0; i < json.topalbums.album.length; i++)
		{
			//giving onclick for album name that uses searchalbum function					
			albumName[i] = `<li onclick="searchAlbum('${json.topalbums.album[i].name}')">${json.topalbums.album[i].name}</li>`;			
		}
		//list of albumnames	
		document.getElementById("album").innerHTML = albumName.join('');		
    }
}

//function to get top50 artists as list. List items can be clicked so that info of the artist opens
function getAllArtists() {
	if (getTopArtists.readyState == 4 && getTopArtists.status==200) {
		var json = JSON.parse(getTopArtists.responseText);
		var artistsNames= new Array();
		// //results to artists as a list
		 for (var i=0; i < json.artists.artist.length; i++) {
			 //getting artist names and adding onclick to get searchArtist function
			artistsNames[i] = `<li onclick="searchArtist('${json.artists.artist[i].name}')">${json.artists.artist[i].name}</li>`;			
		}
		//sending artist names to html div that has id artists
		document.getElementById("artists").innerHTML = artistsNames.join('');
	}
}

//getting songs of the albums
function albumSongs() {
	if (getAlbumSongs.readyState == 4 && getAlbumSongs.status==200) {
		var json = JSON.parse(getAlbumSongs.responseText);
		var albumSongs= new Array();
		// //results to artists as a list
		 for (var i=0; i < json.album.tracks.length; i++) {
			albumSongs[i] = `<li>${json.album.tracks.track[i].name}</li>`;			
		}
		document.getElementById("album-song").innerHTML = albumSongs.join('');
	}
}
//getting list of top50 artists when app is opened
var methodartistsurl = "chart.gettopartists";
getTopArtists.onreadystatechange = getAllArtists;
getTopArtists.open("GET",host+"?method="+methodartistsurl+"&api_key="+apiKey+"&format=json",true);
getTopArtists.send();

//function to send request when using search bar
function sendRequest(event) {
	//preventing default enter to use enter as form submit as well
	event.preventDefault();
	var artist = document.getElementById("searchbar").value;
	searchArtist(artist);
	document.getElementById("searchbar").value= '';
	return false;		
}
//function to search artists an their top albums
function searchArtist(artist) {
	var methodartist = "artist.getinfo";
	getArtist.onreadystatechange = showResult;
    getArtist.open("GET",host+"?method="+methodartist+"&artist="+artist+"&autocorrect[1]"+"&api_key="+apiKey+"&format=json",true);
    getArtist.send();
	
	var methodalbums = "artist.gettopalbums";
	getAlbum.onreadystatechange = showResult;
	//getting top albums and limiting those to top10
	getAlbum.open("GET",host+"?method="+methodalbums+"&artist="+artist+"&api_key="+apiKey+"&format=json"+"&limit=10",true);
	getAlbum.send();
}
//function to get search albums and using that to get album tracks
function searchAlbum(artist) {
	var methodalbuminfo = "album.getinfo"
	var album = document.getElementById("album").value;
	getAlbumSongs.onreadystatechange = showResult;
    getAlbumSongs.open("GET",host+"?method="+methodalbuminfo+"&api_key="+apiKey+"&artist="+artist+"&album="+album+"&format=json",true);
    getAlbumSongs.send();
}