var api_key = "1dc459d3b860f7223e792e3d93287dad";

var getArtist = new XMLHttpRequest();
var getAlbum = new XMLHttpRequest();

function showResult () {

    if (getArtist.readyState == 4)
	{
		var json = JSON.parse(request1.responseText);
        var str = JSON.stringify(json,undefined,2);
		
		var result1_1 = "<br/>"+"<strong>Artist Name:</strong> "+ json.artist.name+"<br/><br/>";
		
		var src = json.artist.image[3];
		var img = src["#text"];
		
		var result1_2 = "<center><img width= '100' height='100' title='image' src='"+img+"'/></center>"+"<br/><br/>";
		
		var result1_3 = "<strong>Biography:</strong><br/>"+json.artist.bio.summary+"<br/><br/><strong>Debut Place:</strong> "
		+json.artist.bio.placeformed+"<br/><br/><strong>Debut Year: </strong>"+json.artist.bio.yearformed+"<br/>";
		
        document.getElementById("output1").innerHTML = "<ul>"+result1_1+"</ul>"+"<ul>"+result1_2+"</ul>"+"<ul>"+result1_3+"</ul>";
	}
	
	if (getAlbum.readyState == 4)
	
	{
        var json = JSON.parse(request2.responseText);
        var str = JSON.stringify(json,undefined,2);
		
		var albSrc;
		var albImg;
		var albumName = new Array();
		var i=0;
		while (i<10)
		{
					
			albSrc =  json.topalbums.album[i].image[2];
			albImg = albSrc["#text"];
			
			albumName[i] = "<li>"+json.topalbums.album[i].name+"<br/>"
							+"<a href='"+json.topalbums.album[i].url+"'>Album info</a>"+"<br/>"
							+"<img width= '100' height='100' title='image' src='"+albImg+"'/>"+"<br/><br/></li>";
			
							i++;
		}
		
		document.getElementById("output2").innerHTML = "<ul>"+albumName+"</ul>";		
    }
	
}


function sendRequest() {
	
	var method1 = "artist.info";
	getArtist.onreadystatechange = showResult;
	var artist = document.getElementById("searchbar").value;
    getArtist.open("GET","",true);
    getArtist.withCredentials = "true";
    getArtist.send(null);
	

	var method2 = "artist.getTopAlbums";
	getAlbum.onreadystatechange = showResult;
	var artist = document.getElementById("searchbar").value;
	getAlbum.open("GET","",true);
	getAlbum.withCredentials = "true";
	getAlbum.send(null);
	
}