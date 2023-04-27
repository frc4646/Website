document.getElementsByTagName("title")[0].innerHTML = "Wildcard 4646";
if (location.href.substring(0,5)!="https"){window.location.href=window.location.href.replace('http', 'https');};

const change = document.getElementById("updated")
const min = document.getElementById("updatedMIN")
const time = new Date(document.lastModified);
change.innerHTML = time.getFullYear()+"<br>"+time.getMonth()+"-"+time.getDate();
min.innerHTML = time.getHours()+"<br>"+time.getMinutes();
console.log("You seem to be a curious guy! Maybe this is your sign to join robotics!");