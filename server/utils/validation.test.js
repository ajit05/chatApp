const expect=require('expect');

const {isRealString}=require('./validation');

describe('valiadateUserNameAndRoom',()=>
{
    it('should pass string value',()=>
    {
    var res=isRealString('oppp');
    expect(res).toBe(true);
    });
});

describe('validationUserNameAndRoom',()=>
{
    it('should not pass number argument',()=>
    {
        var res=isRealString(26);
        expect(res).toBe(false);

    });
});

describe('validationUserNameAndRoom',()=>
{  it('should not empty value',()=>
{
   var res=isRealString(' ');
   expect(res).toBe(false);
});
});