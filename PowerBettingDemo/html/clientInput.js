function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

if (get("topic") != undefined) {
	console.log(get("topic"));
	document.getElementById("topic").value = get("topic");
	document.getElementById("topic").readOnly = true;
}