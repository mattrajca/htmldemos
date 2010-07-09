function getVideo() {
	return document.getElementsByTagName("video")[0];
}

function menu() {
	getVideo().currentTime = 0;
}

function playPause() {
	var video = getVideo();
	
	if (video.paused) {
		video.play();
	}
	else {
		video.pause();
	}
}

function fastForward() {
	getVideo().currentTime += 4;
}

function rewind() {
	getVideo().currentTime -= 4;
}
