var apiKey = "1dc459d3b860f7223e792e3d93287dad";

var getArtist = new XMLHttpRequest();
var getAlbum = new XMLHttpRequest();

function showResult () {

    if (getArtist.readyState == 4)
	{
		var json = JSON.parse(getArtist.responseText);
        var str = JSON.stringify(json,undefined,2);
		
		var result1_1 = "Artist Name: "+ json.artist.name;
		
		var src = json.artist.image[3];
		var img = src["#text"];
		
		var result1_2 = "<img title='image' src='"+img+"'/>";
		
		var result1_3 = "Biography:"+json.artist.bio.summary+"Debut Place: "
		+json.artist.bio.placeformed+"Debut Year: "+json.artist.bio.yearformed;
		
        document.getElementById("artist-info").innerHTML = "<ul>"+result1_1+"</ul>"+"<ul>"+result1_2+"</ul>"+"<ul>"+result1_3+"</ul>";
	}
	
	if (getAlbum.readyState == 4)
	
	{
        var json = JSON.parse(getAlbum.responseText);
        var str = JSON.stringify(json,undefined,2);
		
		var albumSource;
		var albumImage;
		var albumName = new Array();
		var i=0;
		while (i<10)
		{
					
			albumSource =  json.topalbums.album[i].image[2];
			albImg = albumSource["#text"];
			
			albumName[i] = "<li>"+json.topalbums.album[i].name
							+"<a href='"+json.topalbums.album[i].url+"'>Album info</a>"
							+"<img title='image' src='"+albumImage+"'/>"+"</li>";			
							i++;
		}
		
		document.getElementById("album").innerHTML = "<ul>"+albumName+"</ul>";		
    }
	
}


function sendRequest() {

	var host ='https://ws.audioscrobbler.com/2.0/?method=';
	var methodartists = "artist.getinfo";
	getArtist.onreadystatechange = showResult;
	var artist = document.getElementById("searchbar").value;
    getArtist.open("GET",host+methodartists+"&artist="+artist+ "&api_key="+ apiKey + "&format=json",true);
    getArtist.withCredentials = "true";
    getArtist.send(null);
	

	var methodalbums = "artist.getAlbums";
	getAlbum.onreadystatechange = showResult;
	var artist = document.getElementById("searchbar").value;
	getAlbum.open("GET",host+methodalbums+"&artist="+artist+ "&api_key="+ apiKey + "&format=json",true);
	getAlbum.withCredentials = "true";
	getAlbum.send(null);
	
}