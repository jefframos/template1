export default class CookieManager{
	constructor(){
	}

	createCookie(name,value,days) {
	  if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	  }
	  else var expires = "";
	  document.cookie = name+"="+value+expires+"; path=/";
	}
	getCookie(name) {
	  var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
	  var result = regexp.exec(document.cookie);
	  return (result === null) ? null : result[1];
	}
	deleteCookie(name, path, domain) {
	  // If the cookie exists
	  if (getCookie(name))
		createCookie(name, "", -1, path, domain);
	}
}