
var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});


// listenning  from server
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var formatedTime=moment(message.createdAt).format('h:mm:a');
  var li=jQuery('<li></li>');
  li.text(`${message.from}:${formatedTime}:${message.text}`) ;
  jQuery('#message').append(li);
});

socket.on('newLocationMessage',function(message)
{
 var li=jQuery('<li></li>');
 var a=jQuery('<a target="_blank"> My current location</a>');   
 var formatedTime=moment(message.createdAt).format('h:mm:a');
 li.text(`${message.from}:${formatedTime}`  );
 a.attr('href',message.url);
 li.append(a);
 jQuery('#message').append(li);
});


//sending message to server
  jQuery('#message-form').on('submit',function(e)
  {
      e.preventDefault();
      socket.emit('createMessage',{
          from:'user',
          text: jQuery('[name=message]').val()
      },function()
      {
          text: jQuery('[name=message]').val('')
            
      });
  });

//sending location
var locationButton=jQuery('#send-location');
locationButton.on('click',function()
{
    if(!navigator.geolocation)
        alert('Geolocation is not supported in browser');
    locationButton.attr('disabled','disable').text('sendng location....');
    navigator.geolocation.getCurrentPosition(function(position)
        { locationButton.removeAttr('disabled').text('send location');
            socket.emit('createLocationMessage', 
            {  
                latitude:position.coords.latitude,
                longitude:position.coords.longitude 
            });
        },function()
        {  locationButton.removeAttr('disabled').text('send location');
            alert('unable to  fetch location');

        });
});


  socket.on('disconnect', function () {
    console.log('Disconnected from server');
  });
