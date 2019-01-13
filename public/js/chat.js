
var socket = io();

function scrollToBottom () {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
  
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      messages.scrollTop(scrollTop);
    }
  }

socket.on('connect', function () {
  console.log('Connected to server');
  var params = jQuery.deparam(window.location.search);
  socket.emit('join',params,function(err)
  {
      if(err)
      { alert(err);
        window.location.href='/';
      }
      else{
            console.log('no error');
      }

  });
});


// listenning  from server
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  var formatedTime=moment(message.createdAt).format('h:mm:a');
    var template=jQuery('#message-template').html();
    var html=Mustache.render(template,
        {   from:message.from,
            text:message.text,
            createdAt: formatedTime
        });
    jQuery('#message').append(html);     
    scrollToBottom();                              

});

socket.on('newLocationMessage',function(message)
{
    var formatedTime=moment(message.createdAt).format('h:mm:a');
    var template=jQuery('#location-message-template').html();
    var html=Mustache.render(template,
        {
            url:message.url,
            from:message.from,
            createdAt:formatedTime

        });
        jQuery('#message').append(html);
        scrollToBottom();
//  var li=jQuery('<li></li>');
//  var a=jQuery('<a target="_blank"> My current location</a>');   
// 
//  li.text(`${message.from}:${formatedTime}`  );
//  a.attr('href',message.url);
//  li.append(a);
//  jQuery('#message').append(li);
});


//sending message to server
  jQuery('#message-form').on('submit',function(e)
  {
      e.preventDefault();
      socket.emit('createMessage',{
          from:message.from,
         
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
 
socket.on('updateUserList',function(users)
{ 
    console.log(users);
    var ol=jQuery('<ol></ol>');
    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
        
    });
    jQuery('#users').html(ol);
});


  socket.on('disconnect', function () {
    console.log('Disconnected from server');
  });
