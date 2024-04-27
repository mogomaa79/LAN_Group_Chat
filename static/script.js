var $messages = $('.messages-content'),
    d, h, m;

var socket = io.connect('http://' + document.domain + ':' + location.port);

$(window).load(function() {
  $messages.mCustomScrollbar();
});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}

// Insert typed message in the chat
function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') { // Check if message is empty
    return false;
  }
  socket.emit('message', msg); // Send message to server
  
  // Add message to chat 
  $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
  setDate();
  $('.message-input').val(null);
  updateScrollbar();
}

// Send message on submit
$('.message-submit').click(function() {
  insertMessage();
});

// Send message on pressing enter/return key
$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false; // Prevent default action
  }
})

// Enter name on pressing enter/return key
$(document).ready(function() {
  $('#nameInput').on('keydown', function(e) {
      if (e.which == 13) {
          $('#nameForm').submit();
          return false; // Prevent default action
      }
  });
});

// Receive message from server
function receiveMessage(msg, name) {
    $('<div class="message new">' + name + ': ' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new'); // Add received message to chat
    setDate();
    updateScrollbar();
    socket.emit('current_users'); // Request current users list
}

// Join chat
$('#nameForm').submit(function() {
    var name = $('#nameInput').val();
    socket.emit('join', name);
});

// Update users list
socket.on('current_users', function(users) {
  $('#users').text(users.join(', '));
});


// Receive message from server
socket.on('message', function(response) {
    receiveMessage(response.msg, response.name);
});