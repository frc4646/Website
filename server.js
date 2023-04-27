const express = require('express');
//const sqlite3 = require('sqlite3');
const fs = require('fs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//Web pages
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});
app.get('/edit', (req, res) => {
  res.sendFile(__dirname + '/edit.html');
});
app.get('/favicon.ico', (req, res) => {
  res.sendFile(__dirname + '/favicon.ico');
});

 var toreturn;
 function read(filename){ //Returns file contents
  var toreturn;
    try {
      const data = fs.readFileSync(filename, 'utf8');
      //console.log(data);
      toreturn = data
    } catch (err) {
      console.error(err);
}
 return toreturn;
 }

function login(username,password){
  let toReturn = "error"
  const pass = read('.data/.users')
  const passarr = pass.split("^")
  console.log(username+" "+password)
  passarr.forEach(function(val,index,arr){ 
    if (val.split('~')[0] == username){
      //console.log(username+'yes')
      if (val.split('~')[1] == password){
          //console.log("SUCCESS")
          toReturn = val.split('~')[2]
          }else{
            //console.log("FAIL")
            toReturn = false
          }            
    }//Return a user ID that is custom to each person. It is all stored in the .data file.
  })
  //console.log(passarr)
  return toReturn
}

function correct(userid,username){
  let toreturn = false
  //console.log(userid+username)
  const pass = read('.data/.users')
  const passarr = pass.split("^") //Make this work, it doesn't right now
  passarr.forEach(function(val,index,arr){ 
  //console.log(val.split('~')[2]==(userid+"\n"))//UserID errors
  if (val.split('~')[0] == username && val.split('~')[2]==(userid)){
    toreturn = true
  }
  });
  return toreturn
}
function isMod(userid,username){
  let toreturn = false
  //console.log(userid+username)
  const pass = read('.data/.mods')
  const passarr = pass.split("^") //Make this work, it doesn't right now
  passarr.forEach(function(val,index,arr){ 
  //console.log(val.split('~')[2]==(userid+"\n"))//UserID errors
  if (val.split('~')[0] == username && val.split('~')[2]==(userid)){
    toreturn = true
  }
  });
  return toreturn
}

function addMsg(username,message,time){ //Add the file to history
  fs.writeFileSync('.data/.history',(read('.data/.history')+"^"+username+"-"+time.toString()+": "+message))
  fs.writeFileSync('.data/.numberof',parseInt((read('.data/.numberof')))+1)
}
function clear(user){
  const now = new Date()
  fs.writeFileSync('.data/.history','CLEARED AS OF '+now.getFullYear()+"-"+now.getMonth()+"-"+now.getDate()+' BY '+user)
  fs.writeFileSync('.data/.numberof',1)
  io.emit('clear')
}

//Socket
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  //console.log('listening on *:3000');
});
io.on('connection', (socket) => {
  socket.on('prevMessages', () => {
    //console.log("Get messages")
    const msgs = read('.data/.history')
    for (var i = 0; i<read('.data/.numberof');i++){
      socket.emit('chat message', (msgs.split("^")[i]),"Loading","Please wait while I don't fix this issue")
      //console.log(msgs.split("^")[i])
    }
  });
  
  socket.on('chat message', (msg,userid,username) => {
    let date = new Date();
    date.setHours(date.getHours()-5);
    let time = (date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate()+"@"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()).toString();
    //console.log(userid+" "+username)
    if (correct(userid,username) == true){
      addMsg(username,msg,time)
      if (msg=="~//~" && isMod(userid,username) == true){
        clear(username)
      }
      else if (msg=="~//~" && isMod(userid,username) != true)
      {socket.emit('chat message',"Not mod!","Not mod!","Action dissalowed for normal members!")}
      else{
        io.emit('chat message', username+"-"+time.toString()+": "+msg,username,msg);
      }
    }
    else{
      socket.emit('chat message',"You are not logged in! Please visit /login or contact Robert by email ///\\\///"+'userid: '+userid+' username:'+username+' log:'+correct(userid,username))
    }
  });
    socket.on('login', (username,password) => {
      //console.log(username+" "+password)
      //console.log(login(username,password))
    socket.emit('success', login(username,password));
  });
    socket.on('getUsers', (userid,username) => {
      if (isMod(userid,username)==true){
        socket.emit('gotUsers', read(".data/.users"))        
      }
      else{socket.emit('gotUsers',"NOT MOD!")}

  });
    socket.on('newUsers', (contents,userid,username) => {
      if (isMod(userid,username)==true){
        fs.writeFileSync(".data/.users",contents)
      }
  });
    socket.on('signup', (username,password) => {
    let exists = false;
  
    const pass = read('.data/.users') //Detect if there is an existing user
    const passarr = pass.split("^")
    passarr.forEach(function(val,index,arr){ 
    if (val.split('~')[0] == username){exists=true}});
      
      if (exists == false){
        let random = Math.ceil(Math.random() * (99999 - 0) + 0);
      fs.writeFileSync(".data/.users",(read('.data/.users')+'^'+username+'~'+password+'~'+random))
      socket.emit('created','true',random)
    }else{
      socket.emit('created','exists')
    }
    });
});
