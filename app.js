//my lastFM API key, host and shared secret
var apiKey = "1dc459d3b860f7223e792e3d93287dad";
var host ='https://ws.audioscrobbler.com/2.0/';
var secret ="163a2390a29cdf9a123cbda2ca4eef21";

//xmlhttprequests for getting album and artist
var getArtist = new XMLHttpRequest();
var getAlbum = new XMLHttpRequest();

//function for artist and album results
function showResult () {

    if (getArtist.readyState == 4)
	{
		var json = JSON.parse(getArtist.responseText);
        var str = JSON.stringify(json,undefined,2);
		//getting artist name
		var resultName = "Artist Name: "+ json.artist.name;
		//getting artist image
		var src = json.artist.image[3];
		var img = src["#text"];
		//image of the artist
		var resultImage = "<img title='image' src='"+img+"'/>";
		//artist bibliography
		var resultBibliography = "Biography:"+json.artist.bio.summary+"Debut Place: "
		+json.artist.bio.placeformed+"Debut Year: "+json.artist.bio.yearformed;
		//results to artist-info as a list
        document.getElementById("artist-info").innerHTML = "<ul>"+resultName+"</ul>"+"<ul>"+resultImage+"</ul>"+"<ul>"+resultBibliography+"</ul>";
	}
	//albums of the artist
	if (getAlbum.readyState == 4)
	
	{
        var json = JSON.parse(getAlbum.responseText);
        var str = JSON.stringify(json,undefined,2);
		//album variants
		var albumSource;
		var albumImage;
		var albumName = new Array();
		var i=0;
		//getting top 10 albums of the artist. Goes through loop until 1 is not less than 10
		while (i<10)
		{					
			albumSource =  json.artist.getTopAlbums[i].image[2];
			albumImage = albumSource["#text"];
			
			albumName[i] = "<li>"+json.artist.getTopAlbums[i].name
							+"<a href='"+json.artist.getTopAlbums[i].url+"'>Album info</a>"
							+"<img title='image' src='"+albumImage+"'/>"+"</li>";			
							i++;
		}
		
		document.getElementById("album").innerHTML = "<ul>"+albumName+"</ul>";		
    }
	
}


function sendRequest() {

	var methodartists = "artist.getinfo";
	getArtist.onreadystatechange = showResult;
	var artist = document.getElementById("searchbar").value;
    getArtist.open("GET",host+"?method="+methodartists+"&artist="+artist+ "&api_key="+ apiKey + "&format=json",true);
    getArtist.withCredentials = "true";
    getArtist.send();
	

	var methodalbums = "artist.getAlbums";
	getAlbum.onreadystatechange = showResult;
	var artist = document.getElementById("searchbar").value;
	getAlbum.open("GET",host+"?method="+methodalbums+"&artist="+artist+"&api_key="+apiKey+"&format=json",true);
	getAlbum.withCredentials = "true";
	getAlbum.send();
	
}