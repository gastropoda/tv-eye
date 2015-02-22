(function() {

  var img = document.getElementById("snapshot");
  var counts = {
    pink: document.getElementById("pinkCount"),
    green: document.getElementById("greenCount"),
    yellow: document.getElementById("yellowCount"),
  }

  var voteSocket = new WebSocket("ws://localhost:8000/api/ws/votes");

  voteSocket.onmessage = function(event) {
    var json = JSON.parse(event.data);
    processVotes(json);
  };

  function processVotes(msg) {
    console.log(msg);
    img.src = msg.snapshot;
    counts.pink.innerHTML = msg.payload.pink.length;
    counts.green.innerHTML = msg.payload.green.length;
    counts.yellow.innerHTML = msg.payload.yellow.length;
  }

})();
