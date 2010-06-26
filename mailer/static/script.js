var sendSound = null;

function getPostcard() {
    return document.getElementById("postcard");
}

function drawContext() {
    var canvas = document.getElementById("address");
    var context = canvas.getContext("2d");
    
    context.strokeStyle = "rgba(200,200,200,1.0)";
    
    var x = 20;
    var endX = canvas.clientWidth - x * 2;
    
    var firstY = 80;
    var delta = 40;
    
    context.beginPath();
    
    context.moveTo(x, firstY);
    context.lineTo(endX, firstY);
    
    context.moveTo(x, firstY + delta);
    context.lineTo(endX, firstY + delta);
    
    context.moveTo(x, firstY + delta * 2);
    context.lineTo(endX, firstY + delta * 2);
    
    context.closePath();
    context.stroke();

    // spam prevention
    var user = "matt.rajca";
    var host = "me.com";
    
    var baseline = 4;
    var indent = 60;

    context.font = "26px Angelina";
    context.fillText("Matt Rajca", indent, firstY - baseline);
    context.fillText(user + "@" + host, indent, firstY + delta - baseline);
    context.fillText("United States", indent, firstY + delta * 2 - baseline);
}

function loaded() {
    if (window['Audio']) {
        sendSound = new Audio('');
        sendSound.autobuffer = true;

        canPlayOgg = (sendSound.canPlayType("audio/ogg") != "no") && (sendSound.canPlayType("audio/ogg") != "");
        canPlayMp3 = (sendSound.canPlayType("audio/mpeg") != "no") && (sendSound.canPlayType("audio/mpeg") != "");
        
        if (canPlayMp3) {
            sendSound.src = "/static/send.mp3";
        }
        else if (canPlayOgg) {
            sendSound.src = "/static/send.oga";
        }
        else {
            sendSound = null;
        }
    }
    
    // center
    getPostcard().style.left = (document.body.clientWidth / 2) + "px";
    
    drawContext();
    
    // this is necessary if the custom fon't hasn't loaded by the time the page loads
    setTimeout("drawContext();", 1000);
}

function sendMessage() {
    var req = new XMLHttpRequest();
    req.open("POST", "/sendMessage", true);
    req.send(document.getElementById("messageArea").value);
    
    if (sendSound) {
        sendSound.play();
    }
    
    var pc = getPostcard();
    var x = (document.body.clientWidth / 2) + 362;
    var transform = "rotate(-2deg) translateX(" + x + "px)";
    
    if ('MozTransform' in document.body.style) {
        pc.style.MozTransform = transform;
        displaySuccessDialog(); // moz-transition currently doesn't animate moz-transform's
    }
    
    if ('webkitTransform' in document.body.style) {
        pc.addEventListener('webkitTransitionEnd', displaySuccessDialog, false);
        pc.style.webkitTransform = transform;
    }
}

function displaySuccessDialog (event) {
    var dialog = document.createElement("div");
    dialog.className = "dialog";
    
    var p = document.createElement("p");
    var text = document.createTextNode("Your feedback was sent! Thanks!");
    p.appendChild(text);
    
    dialog.appendChild(p);
    
    document.body.appendChild(dialog);
}
