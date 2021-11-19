//my lastFM API key, host and shared secret
var apiKey = "1dc459d3b860f7223e792e3d93287dad";
var host ='https://ws.audioscrobbler.com/2.0/';
var secret ="163a2390a29cdf9a123cbda2ca4eef21";

//xmlhttprequests for getting album and artist
var getArtist = new XMLHttpRequest();
var getAlbum = new XMLHttpRequest();
var getTopArtists = new XMLHttpRequest();
var getAlbumSongs = new XMLHttpRequest();

//eventlistener for form
var formsubmit = document.getElementById("myform");
formsubmit.addEventListener("submit", sendRequest);

//function for artist and album results when clicking artist name in sidecolumn or searching
function showResult () {
	document.getElementById("album-song").innerHTML = ('');
    if (getArtist.readyState == 4 && getArtist.status==200)
	{
		
		var jsonArtist = JSON.parse(getArtist.responseText);
		//getting artist 
		var resultName = "<strong>"+jsonArtist.artist.name+"</strong>";
		var resultBibliography = "<br/>"+"<br/>"+jsonArtist.artist.bio.summary;
		//lastfm does not provide pictures anymore this returns a star picture. Just adding here to let know I know how to get pictures from api
		var image = jsonArtist.artist.image[2]["#text"];
		//fetching images from musicbrainz by using mbid provided by lastfm api code from https://github.com/hugovk/now-playing-radiator/blob/master/js/lastfm.js
		const mbid = jsonArtist.artist.mbid;
		if (mbid) {
		   const url = 'https://musicbrainz.org/ws/2/artist/' + mbid + '?inc=url-rels&fmt=json';
			fetch(url)
				.then(res => res.json())
				.then((out) => {
					const relations = out.relations;
					// Find image relation
					for (let i = 0; i < relations.length; i++) {
						if (relations[i].type === 'image') {
							let imageurl = relations[i].url.resource;
							if (imageurl.startsWith('https://commons.wikimedia.org/wiki/File:')) {
								const filename = imageurl.substring(imageurl.lastIndexOf('/') + 1);
								imageurl = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + filename;
							}
							//if image is found returns name, image and bibliography
							document.getElementById("artist-info").innerHTML = `<h4>${resultName}</h4><img src=${imageurl}><p>${resultBibliography}</p>`; 
						}
					}
				})
		} 
		//if artist doesn't have a picture the function goes here and returns only name and bibliography   
		document.getElementById("artist-info").innerHTML = `<h4>${resultName}</h4><p>${resultBibliography}</p>`; 
	}
	//albums of the artist
	if (getAlbum.readyState == 4 && getAlbum.status==200) {
        var jsonAlbum = JSON.parse(getAlbum.responseText);
		//album variant
		var albumName = new Array();
		var i=0;
		//getting albums of the artist
		for (var i=0; i < jsonAlbum.topalbums.album.length; i++)
		{
			//giving onclick for album name that uses searchalbum function					
			albumName[i] = `<li onclick="searchAlbum('${jsonAlbum.topalbums.album[i].name}', '${jsonAlbum.topalbums.album[i].artist.name}')">${jsonAlbum.topalbums.album[i].name}</li>`;			
		}
		//list of albumnames	
		document.getElementById("album").innerHTML = albumName.join('');		
    }
}

//function to get top50 artists as list. List items can be clicked so that info of the artist opens
function getAllArtists() {
	if (getTopArtists.readyState == 4 && getTopArtists.status==200) {
		var jsonTopArtist = JSON.parse(getTopArtists.responseText);
		var artistsNames= new Array();
		// //results to artists as a list
		 for (var i=0; i < jsonTopArtist.artists.artist.length; i++) {
			 //getting artist names and adding onclick to get searchArtist function
			artistsNames[i] = `<li onclick="searchArtist('${jsonTopArtist.artists.artist[i].name}')">${jsonTopArtist.artists.artist[i].name}</li>`;			
		}
		//sending artist names to html div that has id artists
		document.getElementById("artists").innerHTML = artistsNames.join('');
	}
}

//getting songs of the albums
function albumSongs() {
	if (getAlbumSongs.readyState == 4 && getAlbumSongs.status==200) {
		var jsonSongs = JSON.parse(getAlbumSongs.responseText);
		var albumSongs= new Array();
		// //results to artists as a list
		for (var j=0; j < jsonSongs.album.tracks.track.length; j++) {
			albumTitle = `<h5>Album name: ${jsonSongs.album.name}<h5>`;
			albumSongs[j] = `<li><a href= ${jsonSongs.album.tracks.track[j].url} target="_blank">${jsonSongs.album.tracks.track[j].name}</a></li>`;				
			document.getElementById("album-song").innerHTML = albumTitle + albumSongs.join('')
		}			
	} else {
			document.getElementById("album-song").innerHTML = "There is no album details for this album";
		}
	
}

function openNewWindow() {
	window.open("")
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
    getArtist.open("GET",host+"?method="+methodartist+"&artist="+artist+"&api_key="+apiKey+"&format=json",true);
    getArtist.send();
	
	var methodalbums = "artist.gettopalbums";
	getAlbum.onreadystatechange = showResult;
	//getting top albums and limiting those to top10
	getAlbum.open("GET",host+"?method="+methodalbums+"&artist="+artist+"&api_key="+apiKey+"&format=json"+"&limit=10",true);
	getAlbum.send();
}
//function to get search albums and using that to get album tracks
function searchAlbum(album, artist) {
	var methodalbuminfo = "album.getinfo"
	getAlbumSongs.onreadystatechange = albumSongs;
    getAlbumSongs.open("GET",host+"?method="+methodalbuminfo+"&api_key="+apiKey+"&artist="+artist+"&album="+album+"&format=json",true);
    getAlbumSongs.send();
}