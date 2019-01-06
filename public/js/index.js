

var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});



socket.on('newMessage', function (message) {
  console.log('newMessage', message);

  var li=jQuery('<li></li>');
  li.text(`${message.from}:${message.text}`) ;
  jQuery('#message').append(li);
});
//   socket.emit('createMessage',
//   {
//       from:'browser',
//       text:'Hi server'
//   },function(data)
//   {
//       console.log(data);
//   });

  jQuery('#message-form').on('submit',function(e)
  {
      e.preventDefault();
      socket.emit('createMessage',{
          from:'user',
          text: jQuery('[name=message]').val()
      },function()
      {
            console.log()
      });
  });

  socket.on('disconnect', function () {
    console.log('Disconnected from server');
  });
