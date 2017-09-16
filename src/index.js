import $ from 'jquery';
import Peer from 'peerjs';

// Render first view
triggerView(false);

const peer = new Peer({ key: '4z56oe1wrwj3jtt9' });

peer.on('open', function(){
  $('#my-id').text(`Identification: ${peer.id}`);
});

peer.on('call', function(call) {
  getStream().then((localStream) => {
    call.answer(localStream);
    renderVideo(call, localStream);
  });
});


// PeerJS object
function triggerView(isConnected = false) {
  if(isConnected) {
    $('#before-connect').hide();
    $('#after-connect').show();
  } else {
    $('#before-connect').show();
    $('#after-connect').hide();
  }
}

$('#video-call').click(videoCall);
$('#send-message').click(sendMessage);
$('#make-call').click(openConversation);


// On receive connection from other user
peer.on('connection', function(conn) {
  conn.on('open', onConnect);
});

peer.on('error', function(error) {
  console.log('error', error.type);
});

function onConnect () {
  window.conn = this;
  triggerView(true);
  
  // Receive messages
  window.conn.on('data', (message) => printMessage(message, window.conn.peer)); // float left
}

function printMessage (message, owner) {
  const timestamp = Date.now();
  const element = `<div id="chat-message-${timestamp}">${owner}: ${message}</div>`;
  $('#chat-history').append(element);
}

function openConversation () {
  const callToId = $('#connectto-id').val();
  
  // To make a connection
  peer
    .connect(callToId)
    .on('open', onConnect);    
}

function sendMessage () {
  const { conn } = window;
  const message = $('#chat-message').val();

  conn.send(message);
  printMessage(message, peer.id); // can be "me:" and float right
}

function videoCall () {
  getStream().then((localStream) => {
    // Set your video displays
    const call = peer.call(window.conn.peer, stream);

    renderVideo(call, localStream);
  });
}

function renderStream (stream, type) {
  $(`#${type}`).prop('src', URL.createObjectURL(stream));
}

function getStream () {
  return new Promise((resolve, reject) => {
    navigator.getUserMedia({audio: true, video: true}, (stream) => {
      window.stream = stream;
      resolve(stream);
    }, reject);
  }) 
}

function renderVideo(call, localStream) {
  call.on('stream', function(visitantStream) {
    renderStream(localStream, 'owner');
    renderStream(visitantStream, 'visitant');
  });
}