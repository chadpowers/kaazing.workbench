/*
 * Copyright (c) 2007-2014, Kaazing Corporation. All rights reserved.
 */
var Kaazing=Kaazing||{};
if(Kaazing.namespace!=="function"){Kaazing.namespace=function(d){var c=d.split("."),b=Kaazing,a;
if(c[0]===Kaazing){c=c.slice(1)
}for(a=0;
a<c.length;
a++){if(typeof b[c[a]]==="undefined"){b[c[a]]={}
}b=b[c[a]]
}return b
}
}(function(j){if(typeof j.ByteOrder==="undefined"){var g=function(){};
var h=g.prototype;
h.toString=function(){throw new Error("Abstract")
};
var d=function(o){return(o&255)
};
var k=function(o){return(o&128)?(o|-256):o
};
var c=function(o){return[((o>>8)&255),(o&255)]
};
var n=function(o,p){return(k(o)<<8)|(p&255)
};
var b=function(o,p){return((o&255)<<8)|(p&255)
};
var e=function(o,p,q){return((o&255)<<16)|((p&255)<<8)|(q&255)
};
var l=function(o){return[((o>>16)&255),((o>>8)&255),(o&255)]
};
var m=function(o,p,q){return((o&255)<<16)|((p&255)<<8)|(q&255)
};
var f=function(o){return[((o>>24)&255),((o>>16)&255),((o>>8)&255),(o&255)]
};
var i=function(r,o,p,q){return(k(r)<<24)|((o&255)<<16)|((p&255)<<8)|(q&255)
};
var a=function(t,o,q,s){var p=b(t,o);
var r=b(q,s);
return(p*65536+r)
};
g.BIG_ENDIAN=(function(){var p=function(){};
p.prototype=new g();
var o=p.prototype;
o._toUnsignedByte=d;
o._toByte=k;
o._fromShort=c;
o._toShort=n;
o._toUnsignedShort=b;
o._toUnsignedMediumInt=e;
o._fromMediumInt=l;
o._toMediumInt=m;
o._fromInt=f;
o._toInt=i;
o._toUnsignedInt=a;
o.toString=function(){return"<ByteOrder.BIG_ENDIAN>"
};
return new p()
})();
g.LITTLE_ENDIAN=(function(){var p=function(){};
p.prototype=new g();
var o=p.prototype;
o._toByte=k;
o._toUnsignedByte=d;
o._fromShort=function(q){return c(q).reverse()
};
o._toShort=function(q,r){return n(r,q)
};
o._toUnsignedShort=function(q,r){return b(r,q)
};
o._toUnsignedMediumInt=function(q,r,s){return e(s,r,q)
};
o._fromMediumInt=function(q){return l(q).reverse()
};
o._toMediumInt=function(t,u,v,q,r,s){return m(s,r,q,v,u,t)
};
o._fromInt=function(q){return f(q).reverse()
};
o._toInt=function(t,q,r,s){return i(s,r,q,t)
};
o._toUnsignedInt=function(t,q,r,s){return a(s,r,q,t)
};
o.toString=function(){return"<ByteOrder.LITTLE_ENDIAN>"
};
return new p()
})();
j.ByteOrder=g
}})(Kaazing);
(function(b){if(typeof b.Charset==="undefined"){var c=function(){};
var a=c.prototype;
a.decode=function(d){};
a.encode=function(e,d){};
c.UTF8=(function(){function f(){}f.prototype=new c();
var e=f.prototype;
e.decode=function(h){var m=h.remaining();
var p=m<10000;
var t=[];
var o=h.array;
var n=h.position;
var l=n+m;
var v,s,r,q;
for(var k=n;
k<l;
k++){v=(o[k]&255);
var g=d(v);
var j=l-k;
if(j<g){break
}var u=null;
switch(g){case 1:u=v;
break;
case 2:k++;
s=(o[k]&255);
u=((v&31)<<6)|(s&63);
break;
case 3:k++;
s=(o[k]&255);
k++;
r=(o[k]&255);
u=((v&15)<<12)|((s&63)<<6)|(r&63);
break;
case 4:k++;
s=(o[k]&255);
k++;
r=(o[k]&255);
k++;
q=(o[k]&255);
u=((v&7)<<18)|((s&63)<<12)|((r&63)<<6)|(q&63);
break
}if(p){t.push(u)
}else{t.push(String.fromCharCode(u))
}}if(p){return String.fromCharCode.apply(null,t)
}else{return t.join("")
}};
e.encode=function(l,h){var k=h.position;
var n=k;
var m=h.array;
for(var j=0;
j<l.length;
j++){var g=l.charCodeAt(j);
if(g<128){m[k++]=g
}else{if(g<2048){m[k++]=(g>>6)|192;
m[k++]=(g&63)|128
}else{if(g<65536){m[k++]=(g>>12)|224;
m[k++]=((g>>6)&63)|128;
m[k++]=(g&63)|128
}else{if(g<1114112){m[k++]=(g>>18)|240;
m[k++]=((g>>12)&63)|128;
m[k++]=((g>>6)&63)|128;
m[k++]=(g&63)|128
}else{throw new Error("Invalid UTF-8 string")
}}}}}h.position=k;
h.expandAt(k,k-n)
};
e.encodeAsByteArray=function(k){var h=new Array();
for(var j=0;
j<k.length;
j++){var g=k.charCodeAt(j);
if(g<128){h.push(g)
}else{if(g<2048){h.push((g>>6)|192);
h.push((g&63)|128)
}else{if(g<65536){h.push((g>>12)|224);
h.push(((g>>6)&63)|128);
h.push((g&63)|128)
}else{if(g<1114112){h.push((g>>18)|240);
h.push(((g>>12)&63)|128);
h.push(((g>>6)&63)|128);
h.push((g&63)|128)
}else{throw new Error("Invalid UTF-8 string")
}}}}}return h
};
e.encodeByteArray=function(l){var k=l.length;
var h=[];
for(var j=0;
j<k;
j++){var g=l[j];
if(g<128){h.push(g)
}else{if(g<2048){h.push((g>>6)|192);
h.push((g&63)|128)
}else{if(g<65536){h.push((g>>12)|224);
h.push(((g>>6)&63)|128);
h.push((g&63)|128)
}else{if(g<1114112){h.push((g>>18)|240);
h.push(((g>>12)&63)|128);
h.push(((g>>6)&63)|128);
h.push((g&63)|128)
}else{throw new Error("Invalid UTF-8 string")
}}}}}return String.fromCharCode.apply(null,h)
};
e.encodeArrayBuffer=function(m){var j=new Uint8Array(m);
var l=j.length;
var h=[];
for(var k=0;
k<l;
k++){var g=j[k];
if(g<128){h.push(g)
}else{if(g<2048){h.push((g>>6)|192);
h.push((g&63)|128)
}else{if(g<65536){h.push((g>>12)|224);
h.push(((g>>6)&63)|128);
h.push((g&63)|128)
}else{if(g<1114112){h.push((g>>18)|240);
h.push(((g>>12)&63)|128);
h.push(((g>>6)&63)|128);
h.push((g&63)|128)
}else{throw new Error("Invalid UTF-8 string")
}}}}}return String.fromCharCode.apply(null,h)
};
e.toByteArray=function(k){var n=[];
var q,o,m,l;
var h=k.length;
for(var j=0;
j<h;
j++){q=(k.charCodeAt(j)&255);
var g=d(q);
var p=null;
if(g+j>h){break
}switch(g){case 1:p=q;
break;
case 2:j++;
o=(k.charCodeAt(j)&255);
p=((q&31)<<6)|(o&63);
break;
case 3:j++;
o=(k.charCodeAt(j)&255);
j++;
m=(k.charCodeAt(j)&255);
p=((q&15)<<12)|((o&63)<<6)|(m&63);
break;
case 4:j++;
o=(k.charCodeAt(j)&255);
j++;
m=(k.charCodeAt(j)&255);
j++;
l=(k.charCodeAt(j)&255);
p=((q&7)<<18)|((o&63)<<12)|((m&63)<<6)|(l&63);
break
}n.push(p&255)
}return n
};
function d(g){if((g&128)===0){return 1
}if((g&32)===0){return 2
}if((g&16)===0){return 3
}if((g&8)===0){return 4
}throw new Error("Invalid UTF-8 bytes")
}return new f()
})();
b.Charset=c
}})(Kaazing);
(function(g){if(typeof g.ByteBuffer==="undefined"){var c=function(i){this.array=i||[];
this._mark=-1;
this.limit=this.capacity=this.array.length;
this.order=g.ByteOrder.BIG_ENDIAN
};
c.allocate=function(i){var j=new c();
j.capacity=i;
j.limit=i;
return j
};
c.wrap=function(i){return new c(i)
};
var b=c.prototype;
b.autoExpand=true;
b.capacity=0;
b.position=0;
b.limit=0;
b.order=g.ByteOrder.BIG_ENDIAN;
b.array=[];
b.mark=function(){this._mark=this.position;
return this
};
b.reset=function(){var i=this._mark;
if(i<0){throw new Error("Invalid mark")
}this.position=i;
return this
};
b.compact=function(){this.array.splice(0,this.position);
this.limit-=this.position;
this.position=0;
return this
};
b.duplicate=function(){var i=new c(this.array);
i.position=this.position;
i.limit=this.limit;
i.capacity=this.capacity;
return i
};
b.fill=function(i){f(this,i);
while(i-->0){this.put(0)
}return this
};
b.fillWith=function(i,j){f(this,j);
while(j-->0){this.put(i)
}return this
};
b.indexOf=function(j){var k=this.limit;
var m=this.array;
for(var l=this.position;
l<k;
l++){if(m[l]==j){return l
}}return -1
};
b.put=function(i){f(this,1);
this.array[this.position++]=i&255;
return this
};
b.putAt=function(j,i){d(this,j,1);
this.array[j]=i&255;
return this
};
b.putUnsigned=function(i){f(this,1);
this.array[this.position++]=i&255;
return this
};
b.putUnsignedAt=function(j,i){d(this,j,1);
this.array[j]=i&255;
return this
};
b.putShort=function(i){f(this,2);
a(this,this.position,this.order._fromShort(i));
this.position+=2;
return this
};
b.putShortAt=function(j,i){d(this,j,2);
a(this,j,this.order._fromShort(i));
return this
};
b.putUnsignedShort=function(i){f(this,2);
a(this,this.position,this.order._fromShort(i&65535));
this.position+=2;
return this
};
b.putUnsignedShortAt=function(j,i){d(this,j,2);
a(this,j,this.order._fromShort(i&65535));
return this
};
b.putMediumInt=function(i){f(this,3);
this.putMediumIntAt(this.position,i);
this.position+=3;
return this
};
b.putMediumIntAt=function(j,i){this.putBytesAt(j,this.order._fromMediumInt(i));
return this
};
b.putInt=function(i){f(this,4);
a(this,this.position,this.order._fromInt(i));
this.position+=4;
return this
};
b.putIntAt=function(j,i){d(this,j,4);
a(this,j,this.order._fromInt(i));
return this
};
b.putUnsignedInt=function(i){f(this,4);
this.putUnsignedIntAt(this.position,i&4294967295);
this.position+=4;
return this
};
b.putUnsignedIntAt=function(j,i){d(this,j,4);
this.putIntAt(j,i&4294967295);
return this
};
b.putString=function(i,j){j.encode(i,this);
return this
};
b.putPrefixedString=function(j,k,l){if(typeof(l)==="undefined"||typeof(l.encode)==="undefined"){throw new Error("ByteBuffer.putPrefixedString: character set parameter missing")
}if(j===0){return this
}f(this,j);
var i=k.length;
switch(j){case 1:this.put(i);
break;
case 2:this.putShort(i);
break;
case 4:this.putInt(i);
break
}l.encode(k,this);
return this
};
function a(m,k,j){var n=m.array;
for(var l=0;
l<j.length;
l++){n[l+k]=j[l]&255
}}b.putBytes=function(i){f(this,i.length);
a(this,this.position,i);
this.position+=i.length;
return this
};
b.putBytesAt=function(j,i){d(this,j,i.length);
a(this,j,i);
return this
};
b.putByteArray=function(j){f(this,j.byteLength);
var k=new Uint8Array(j);
for(var l=0;
l<k.byteLength;
l++){this.putAt(this.position+l,k[l]&255)
}this.position+=j.byteLength;
return this
};
b.putBuffer=function(k){var j=k.remaining();
f(this,j);
var o=k.array;
var n=k.position;
var m=this.position;
for(var l=0;
l<j;
l++){this.array[l+m]=o[l+n]
}this.position+=j;
return this
};
b.putBufferAt=function(l,k){var j=k.remaining();
f(this,j);
var p=k.array;
var o=k.position;
var n=this.position;
for(var m=0;
m<j;
m++){this.array[m+n]=p[m+o]
}return this
};
b.get=function(){h(this,1);
return this.order._toByte(this.array[this.position++])
};
b.getAt=function(i){e(this,i,1);
return this.order._toByte(this.array[i])
};
b.getUnsigned=function(){h(this,1);
var i=this.order._toUnsignedByte(this.array[this.position++]);
return i
};
b.getUnsignedAt=function(i){e(this,i,1);
return this.order._toUnsignedByte(this.array[i])
};
b.getBytes=function(l){h(this,l);
var j=new Array();
for(var k=0;
k<l;
k++){j.push(this.order._toByte(this.array[k+this.position]))
}this.position+=l;
return j
};
b.getBytesAt=function(k,m){e(this,k,m);
var j=new Array();
var n=this.array;
for(var l=0;
l<m;
l++){j.push(n[l+k])
}return j
};
b.getBlob=function(j){var i=this.array.slice(this.position,j);
this.position+=j;
return g.BlobUtils.fromNumberArray(i)
};
b.getBlobAt=function(j,k){var i=this.getBytesAt(j,k);
return g.BlobUtils.fromNumberArray(i)
};
b.getArrayBuffer=function(j){var i=new Uint8Array(j);
i.set(this.array.slice(this.position,j));
this.position+=j;
return i.buffer
};
b.getShort=function(){h(this,2);
var i=this.getShortAt(this.position);
this.position+=2;
return i
};
b.getShortAt=function(i){e(this,i,2);
var j=this.array;
return this.order._toShort(j[i++],j[i++])
};
b.getUnsignedShort=function(){h(this,2);
var i=this.getUnsignedShortAt(this.position);
this.position+=2;
return i
};
b.getUnsignedShortAt=function(i){e(this,i,2);
var j=this.array;
return this.order._toUnsignedShort(j[i++],j[i++])
};
b.getUnsignedMediumInt=function(){var i=this.array;
return this.order._toUnsignedMediumInt(i[this.position++],i[this.position++],i[this.position++])
};
b.getMediumInt=function(){var i=this.getMediumIntAt(this.position);
this.position+=3;
return i
};
b.getMediumIntAt=function(j){var k=this.array;
return this.order._toMediumInt(k[j++],k[j++],k[j++])
};
b.getInt=function(){h(this,4);
var i=this.getIntAt(this.position);
this.position+=4;
return i
};
b.getIntAt=function(i){e(this,i,4);
var j=this.array;
return this.order._toInt(j[i++],j[i++],j[i++],j[i++])
};
b.getUnsignedInt=function(){h(this,4);
var i=this.getUnsignedIntAt(this.position);
this.position+=4;
return i
};
b.getUnsignedIntAt=function(i){e(this,i,4);
var j=this.array;
return this.order._toUnsignedInt(j[i++],j[i++],j[i++],j[i++]);
return val
};
b.getPrefixedString=function(j,k){var i=0;
switch(j||2){case 1:i=this.getUnsigned();
break;
case 2:i=this.getUnsignedShort();
break;
case 4:i=this.getInt();
break
}if(i===0){return""
}var l=this.limit;
try{this.limit=this.position+i;
return k.decode(this)
}finally{this.limit=l
}};
b.getString=function(i){try{return i.decode(this)
}finally{this.position=this.limit
}};
b.slice=function(){return new c(this.array.slice(this.position,this.limit))
};
b.flip=function(){this.limit=this.position;
this.position=0;
this._mark=-1;
return this
};
b.rewind=function(){this.position=0;
this._mark=-1;
return this
};
b.clear=function(){this.position=0;
this.limit=this.capacity;
this._mark=-1;
return this
};
b.remaining=function(){return(this.limit-this.position)
};
b.hasRemaining=function(){return(this.limit>this.position)
};
b.skip=function(i){this.position+=i;
return this
};
b.getHexDump=function(){var o=this.array;
var n=this.position;
var j=this.limit;
if(n==j){return"empty"
}var m=[];
for(var k=n;
k<j;
k++){var l=(o[k]||0).toString(16);
if(l.length==1){l="0"+l
}m.push(l)
}return m.join(" ")
};
b.toString=b.getHexDump;
b.expand=function(i){return this.expandAt(this.position,i)
};
b.expandAt=function(k,l){var j=k+l;
if(j>this.capacity){this.capacity=j
}if(j>this.limit){this.limit=j
}return this
};
function f(j,i){if(j.autoExpand){j.expand(i)
}return j
}function h(k,j){var i=k.position+j;
if(i>k.limit){throw new Error("Buffer underflow")
}return k
}function e(l,j,k){var i=j+k;
if(j<0||i>l.limit){throw new Error("Index out of bounds")
}return l
}function d(l,j,k){var i=j+k;
if(j<0||i>l.limit){throw new Error("Index out of bounds")
}return l
}g.ByteBuffer=c
}})(Kaazing);
function URI(h){h=h||"";
var b=0;
var e=h.indexOf("://");
if(e!=-1){this.scheme=h.slice(0,e);
b=e+3;
var d=h.indexOf("/",b);
if(d==-1){d=h.length;
h+="/"
}var f=h.slice(b,d);
this.authority=f;
b=d;
this.host=f;
var c=f.indexOf(":");
if(c!=-1){this.host=f.slice(0,c);
this.port=parseInt(f.slice(c+1),10);
if(isNaN(this.port)){throw new Error("Invalid URI syntax")
}}}var g=h.indexOf("?",b);
if(g!=-1){this.path=h.slice(b,g);
b=g+1
}var a=h.indexOf("#",b);
if(a!=-1){if(g!=-1){this.query=h.slice(b,a)
}else{this.path=h.slice(b,a)
}b=a+1;
this.fragment=h.slice(b)
}else{if(g!=-1){this.query=h.slice(b)
}else{this.path=h.slice(b)
}}}(function(){var a=URI.prototype;
a.toString=function(){var e=[];
var d=this.scheme;
if(d!==undefined){e.push(d);
e.push("://");
e.push(this.host);
var c=this.port;
if(c!==undefined){e.push(":");
e.push(c.toString())
}}if(this.path!==undefined){e.push(this.path)
}if(this.query!==undefined){e.push("?");
e.push(this.query)
}if(this.fragment!==undefined){e.push("#");
e.push(this.fragment)
}return e.join("")
};
var b={http:80,ws:80,https:443,wss:443};
URI.replaceProtocol=function(c,e){var d=c.indexOf("://");
if(d>0){return e+c.substr(d)
}else{return""
}}
})();
Kaazing.JMS=Kaazing.namespace("JMS");
(function(){var a=Kaazing.JMS;
var b=Kaazing.Gateway;
(function(){var c=function(f,e){if(e){if(!(e instanceof a.JmsConnectionProperties)){throw new Error("Invalid value for argument - connectionProperties")
}}else{e=new a.JmsConnectionProperties()
}var g=this;
this.webSocketFactory=null;
if(b&&typeof(b.WebSocketFactory)==="function"){this.webSocketFactory=new b.WebSocketFactory()
}if(typeof c.init==="function"){c.init(g,f,g.webSocketFactory,e)
}this.createConnection=function(){var h=null;
var n=arguments.length;
var m=this;
var p;
var j=null;
var o=null;
var k="";
var q=false;
var i={};
if(n==1){p=arguments[0];
j=null;
o=null;
k=null
}else{if(n==3){j=arguments[0];
o=arguments[1];
p=arguments[2];
k=null
}else{if(n==4){j=arguments[0];
o=arguments[1];
k=arguments[2];
p=arguments[3]
}else{throw new Error("Wrong number of arguments to JmsConnectionFactory.createConnection()")
}}}function l(s){if(typeof c.init=="function"){c.init(m,f,m.webSocketFactory,e);
var r=c.createConnection(m,j,o,k,function(){if(r.value!==undefined){i.value=r.value
}else{if(r.exception!==undefined){i.exception=r.exception
}}i.getValue=function(){return r.getValue()
};
s()
})
}else{setTimeout(function(){l(s)
},50)
}}l(p);
return i
};
this.getWebSocketFactory=function(){return this.webSocketFactory
};
this.setWebSocketFactory=function(h){this.webSocketFactory=h
};
function d(){if(typeof c.init=="function"){c.init(g,f,g.webSocketFactory,e)
}else{setTimeout(function(){d()
},50)
}}d()
};
a.JmsConnectionFactory=c
})();
(function(){var c=function(){this.connectionTimeout=15000;
this.shutdownDelay=5000;
this.reconnectDelay=3000;
this.reconnectAttemptsMax=-1
};
a.JmsConnectionProperties=c
})();
if(typeof define==="function"&&define.amd){define([],function(){return a
})
}})();
if(/complete|interactive/.test(document.readyState)){var originalDocWrite=document.write;
document.write=function(n){var t=RegExp("(<script\\b[^>]*>)([\\s\\S]*?)(<\/script>)","i");
var j=t.exec(n);
var s=j[1];
var g=j[2];
var d=j[3];
var c=RegExp('<script?\\w+(?:\\s+(?:id="([^"]*)")|[^\\s>]+|\\s+)*>',"i");
var k=c.exec(s);
var m=k[1];
var h=RegExp('<script?\\w+(?:\\s+(?:src="([^"]*)")|[^\\s>]+|\\s+)*>',"i");
var e=h.exec(s);
var f=e[1];
var o=document.createElement("script");
if(m){o.setAttribute("id",m)
}if(f){var r=f.substring(f.lastIndexOf("/"),f.length);
var b=document.getElementsByTagName("SCRIPT");
var l="";
for(var q=0;
q<b.length;
q++){var p=b[q].src;
if(p&&p.indexOf("JMS.js")!=-1){l=p.substring(0,p.lastIndexOf("/"));
break
}}var a=l+r;
o.setAttribute("src",a)
}if(g.length>0){g=g.replace("<!--\n","");
g=g.replace("\n-->","");
o.text=g
}document.body.appendChild(o)
}
}function JmsClient(){var M="",dc="\n-",ub='" for "gwt:onLoadErrorFn"',sb='" for "gwt:onPropertyErrorFn"',Sb='"<script src=\\"',fb='"><\/script>',W="#",cc=");",Wb="-\n",ec="-></scr",Tb='.cache.js\\"></scr" + "ipt>"',Y="/",ib="//",Jb="29B34061A4DE811F3272E20CDA1C0D03",Kb="74973D4CDFFA7403FECD05538A985ADC",Lb="8A3CB2745A0EB0C9B711EEF086977C63",Pb=":",mb="::",Ub="<scr",eb='<script id="',pb="=",X="?",rb='Bad handler "',Mb="C0AE1D519FA811485CA7099402A41C1E",Gb="Cross-site hosted mode not yet implemented. See issue ",Nb="D2B385E9001DC38B8BBEA3EC6D00029D",Qb="DOMContentLoaded",Ob="F9AE2DCF645112B922C23FB2E4444471",N="JmsClient",bb="JmsClient.nocache.js",lb="JmsClient::",gb="SCRIPT",db="__gwt_marker_JmsClient",hb="base",_="baseUrl",Q="begin",P="bootstrap",$="clear.cache.gif",ob="content",bc="document.write(",V="end",Zb='evtGroup: "loadExternalRefs", millis:(new Date()).getTime(),',_b='evtGroup: "moduleStartup", millis:(new Date()).getTime(),',Db="gecko",Eb="gecko1_8",R="gwt.codesvr.JmsClient=",S="gwt.hosted=",T="gwt.hybrid",tb="gwt:onLoadErrorFn",qb="gwt:onPropertyErrorFn",nb="gwt:property",Hb="http://code.google.com/p/google-web-toolkit/issues/detail?id=2079",Cb="ie6",Bb="ie8",Ab="ie9",Z="img",fc="ipt>",Vb="ipt><!-",Rb="loadExternalRefs",jb="meta",Yb='moduleName:"JmsClient", sessionId:window.__gwtStatsSessionId, subSystem:"startup",',U="moduleStartup",zb="msie",kb="name",wb="opera",yb="safari",ab="script",Ib="selectingPermutation",O="startup",$b='type: "end"});',ac='type: "moduleRequested"});',cb="undefined",Fb="unknown",vb="user.agent",xb="webkit",Xb="window.__gwtStatsEvent && window.__gwtStatsEvent({";
var m=window,n=document,o=m.__gwtStatsEvent?function(a){return m.__gwtStatsEvent(a)
}:null,p=m.__gwtStatsSessionId?m.__gwtStatsSessionId:null,q,r,s=M,t={},u=[],v=[],w=[],x=0,y,z;
o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:P,millis:(new Date).getTime(),type:Q});
if(!m.__gwt_stylesLoaded){m.__gwt_stylesLoaded={}
}if(!m.__gwt_scriptsLoaded){m.__gwt_scriptsLoaded={}
}function A(){var b=false;
try{var c=m.location.search;
return(c.indexOf(R)!=-1||(c.indexOf(S)!=-1||m.external&&m.external.gwtOnLoad))&&c.indexOf(T)==-1
}catch(a){}A=function(){return b
};
return b
}function B(){if(q&&r){q(y,N,s,x);
o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:U,millis:(new Date).getTime(),type:V})
}}function C(){function e(a){var b=a.lastIndexOf(W);
if(b==-1){b=a.length
}var c=a.indexOf(X);
if(c==-1){c=a.length
}var d=a.lastIndexOf(Y,Math.min(c,b));
return d>=0?a.substring(0,d+1):M
}function f(a){if(a.match(/^\w+:\/\//)){}else{var b=n.createElement(Z);
b.src=a+$;
a=e(b.src)
}return a
}function g(){var a=E(_);
if(a!=null){return a
}return M
}function h(){var a=n.getElementsByTagName(ab);
for(var b=0;
b<a.length;
++b){if(a[b].src.indexOf(bb)!=-1){return e(a[b].src)
}}return M
}function i(){var a;
if(typeof isBodyLoaded==cb||!isBodyLoaded()){var b=db;
var c;
n.write(eb+b+fb);
c=n.getElementById(b);
a=c&&c.previousSibling;
while(a&&a.tagName!=gb){a=a.previousSibling
}if(c){c.parentNode.removeChild(c)
}if(a&&a.src){return e(a.src)
}}return M
}function j(){var a=n.getElementsByTagName(hb);
if(a.length>0){return a[a.length-1].href
}return M
}function k(){var a=n.location;
return a.href==a.protocol+ib+a.host+a.pathname+a.search+a.hash
}var l=g();
if(l==M){l=h()
}if(l==M){l=i()
}if(l==M){l=j()
}if(l==M&&k()){l=e(n.location.href)
}l=f(l);
s=l;
return l
}function D(){var b=document.getElementsByTagName(jb);
for(var c=0,d=b.length;
c<d;
++c){var e=b[c],f=e.getAttribute(kb),g;
if(f){f=f.replace(lb,M);
if(f.indexOf(mb)>=0){continue
}if(f==nb){g=e.getAttribute(ob);
if(g){var h,i=g.indexOf(pb);
if(i>=0){f=g.substring(0,i);
h=g.substring(i+1)
}else{f=g;
h=M
}t[f]=h
}}else{if(f==qb){g=e.getAttribute(ob);
if(g){try{z=eval(g)
}catch(a){alert(rb+g+sb)
}}}else{if(f==tb){g=e.getAttribute(ob);
if(g){try{y=eval(g)
}catch(a){alert(rb+g+ub)
}}}}}}}}function E(a){var b=t[a];
return b==null?null:b
}function F(a,b){var c=w;
for(var d=0,e=a.length-1;
d<e;
++d){c=c[a[d]]||(c[a[d]]=[])
}c[a[e]]=b
}function G(a){var b=v[a](),c=u[a];
if(b in c){return b
}var d=[];
for(var e in c){d[c[e]]=e
}if(z){z(a,d,b)
}throw null
}v[vb]=function(){var b=navigator.userAgent.toLowerCase();
var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])
};
if(function(){return b.indexOf(wb)!=-1
}()){return wb
}if(function(){return b.indexOf(xb)!=-1
}()){return yb
}if(function(){return b.indexOf(zb)!=-1&&n.documentMode>=9
}()){return Ab
}if(function(){return b.indexOf(zb)!=-1&&n.documentMode>=8
}()){return Bb
}if(function(){var a=/msie ([0-9]+)\.([0-9]+)/.exec(b);
if(a&&a.length==3){return c(a)>=6000
}}()){return Cb
}if(function(){return b.indexOf(Db)!=-1
}()){return Eb
}return Fb
};
u[vb]={gecko1_8:0,ie6:1,ie8:2,ie9:3,opera:4,safari:5};
JmsClient.onScriptLoad=function(a){JmsClient.onScriptLoad=null;
q=a;
B()
};
if(A()){alert(Gb+Hb);
return
}D();
C();
o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:P,millis:(new Date).getTime(),type:Ib});
var H;
try{F([Cb],Jb);
F([Bb],Kb);
F([Eb],Lb);
F([yb],Mb);
F([wb],Nb);
F([Ab],Ob);
H=w[G(vb)];
var I=H.indexOf(Pb);
if(I!=-1){x=Number(H.substring(I+1));
H=H.substring(0,I)
}}catch(a){return
}var J;
function K(){if(!r){r=true;
B();
if(n.removeEventListener){n.removeEventListener(Qb,K,false)
}if(J){clearInterval(J)
}}}if(n.addEventListener){n.addEventListener(Qb,function(){K()
},false)
}var J=setInterval(function(){if(/loaded|complete/.test(n.readyState)){K()
}},50);
o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:P,millis:(new Date).getTime(),type:V});
o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:Rb,millis:(new Date).getTime(),type:Q});
var L=Sb+s+H+Tb;
n.write(Ub+Vb+Wb+Xb+Yb+Zb+$b+Xb+Yb+_b+ac+bc+L+cc+dc+ec+fc)
}JmsClient();
if(originalDocWrite){document.write=originalDocWrite
};