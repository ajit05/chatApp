var expect = require('expect');

var {generateMessage,generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Jen';
    var text = 'Some message';
    var message = generateMessage(from, text);
    expect(typeof message.createdAt).toBe('number')
    expect(message).toMatchObject({from, text});
    
  });
});

describe('generateLocationMessage',()=>
{
  it('should generate correct message object',()=>
  {
    var from='Dev';
    var latitude=19;
    var longitude=15;
    var url='https://www.google.com/maps?q=19,15';
    var message=generateLocationMessage(from,latitude,longitude);
    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from,url});
  });
});
