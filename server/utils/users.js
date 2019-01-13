class User
{
    constructor()
    {
        this.users=[];
    }
    addUser(id,name,room)
    {
        var user={id,name,room};
        this.users.push(user);

    }
    removeUser(id)
    {
        var users=this.getUser(id);
        if(users)
        {
            this.users.filter((x)=>x.id!=id)
        }
        return users;
    }
    getUser(id)
    {
            var users=this.users.filter((user)=>user.id===id);
            var idArray=users.map((x)=>x.id);
            return idArray;
    }
    getUserList(room)
    {
        var users=this.users.filter((user)=>user.room===room);
        var namesArray=users.map((x)=>x.name);
        return namesArray;
    }
}
module.exports={User};