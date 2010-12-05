var originalPhotos = new Array();
var filteredPhotos = new Array();

function Photo (n, title, url) {
	this.n = n;
	this.title = title;
	this.url = url;
}

function findMatches (query) {
	var matches = new Array();
	
	for (var n = 0; n < originalPhotos.length; n++) {
		var photo = originalPhotos[n];
		
		if (photo.title.toLowerCase().indexOf(query) != -1) {
			matches.push(photo);
		}
	}
	
	return matches;
}

function search (sender) {
	var matches = findMatches(sender.value);
	var gallery = document.getElementById("gallery");
	
	var leftIdx = 0;
	var rightIdx = 0;
	
	var idx = 0;
	
	while (leftIdx < filteredPhotos.length || rightIdx < matches.length) {
		var leftPhoto = filteredPhotos[leftIdx];
		var rightPhoto = matches[rightIdx];
		
		var leftN = leftPhoto == undefined ? undefined : leftPhoto.n;
		var rightN = rightPhoto == undefined ? undefined : rightPhoto.n;
		
		var x = (idx % 9) * 85;
		var y = Math.floor(idx / 9) * 85;
		
		if (leftN == rightN) {
			var photoDiv = document.getElementById(rightN);
			photoDiv.style.webkitTransform = "translate(" + x + "px, " + y + "px)";
			
			leftIdx++;
			rightIdx++;
			
			idx++;
		}
		else if (leftN < rightN || rightN == undefined) {
			document.getElementById(leftN).style.visibility = "hidden";
			leftIdx++;
		}
		else if (leftN > rightN || leftN == undefined) {
			var photoDiv = document.getElementById(rightN);
			
			photoDiv.style.webkitTransform = "translate(" + x + "px, " + y + "px)";
			photoDiv.style.visibility = "visible";
			
			rightIdx++;
			idx++;
		}
	}
	
	filteredPhotos = matches;
}

function flickResponse (resp) {
	var photos = resp["photos"]["photo"];
	var gallery = document.getElementById("gallery");
	
	for (var n = 0; n < photos.length; n++) {
		var photo = photos[n];
		var url = "http://farm" + photo["farm"] + ".static.flickr.com/" + photo["server"] + "/" + photo["id"] +  "_" + photo["secret"] + "_s.jpg";
		
		var ph = new Photo(n, photo["title"], url);
		originalPhotos.push(ph);
		
		var x = (n % 9) * 85;
		var y = Math.floor(n / 9) * 85;
		
		var img = document.createElement("div");
		img.id = n;
		img.style.backgroundImage = "url('" + url + "')";
		img.style.webkitTransform = "translate(" + x + "px, " + y + "px)";
		
		gallery.appendChild(img);
	}
	
	filteredPhotos = originalPhotos.slice(); // clone
}

function loaded() {
	var script = document.createElement("script");
	script.src = "http://www.flickr.com/services/rest/?method=flickr.interestingness.getList&format=json&jsoncallback=flickResponse&api_key=78bcb62f001aea68ccab5c6e145334e8";
	
	document.head.appendChild(script);
}
