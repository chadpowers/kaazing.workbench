function JmsClient(){var M='',dc='\n-',ub='" for "gwt:onLoadErrorFn"',sb='" for "gwt:onPropertyErrorFn"',Sb='"<script src=\\"',fb='"><\/script>',W='#',cc=');',Wb='-\n',ec='-><\/scr',Tb='.cache.js\\"><\/scr" + "ipt>"',Y='/',ib='//',Jb='29B34061A4DE811F3272E20CDA1C0D03',Kb='74973D4CDFFA7403FECD05538A985ADC',Lb='8A3CB2745A0EB0C9B711EEF086977C63',Pb=':',mb='::',Ub='<scr',eb='<script id="',pb='=',X='?',rb='Bad handler "',Mb='C0AE1D519FA811485CA7099402A41C1E',Gb='Cross-site hosted mode not yet implemented. See issue ',Nb='D2B385E9001DC38B8BBEA3EC6D00029D',Qb='DOMContentLoaded',Ob='F9AE2DCF645112B922C23FB2E4444471',N='JmsClient',bb='JmsClient.nocache.js',lb='JmsClient::',gb='SCRIPT',db='__gwt_marker_JmsClient',hb='base',_='baseUrl',Q='begin',P='bootstrap',$='clear.cache.gif',ob='content',bc='document.write(',V='end',Zb='evtGroup: "loadExternalRefs", millis:(new Date()).getTime(),',_b='evtGroup: "moduleStartup", millis:(new Date()).getTime(),',Db='gecko',Eb='gecko1_8',R='gwt.codesvr.JmsClient=',S='gwt.hosted=',T='gwt.hybrid',tb='gwt:onLoadErrorFn',qb='gwt:onPropertyErrorFn',nb='gwt:property',Hb='http://code.google.com/p/google-web-toolkit/issues/detail?id=2079',Cb='ie6',Bb='ie8',Ab='ie9',Z='img',fc='ipt>',Vb='ipt><!-',Rb='loadExternalRefs',jb='meta',Yb='moduleName:"JmsClient", sessionId:window.__gwtStatsSessionId, subSystem:"startup",',U='moduleStartup',zb='msie',kb='name',wb='opera',yb='safari',ab='script',Ib='selectingPermutation',O='startup',$b='type: "end"});',ac='type: "moduleRequested"});',cb='undefined',Fb='unknown',vb='user.agent',xb='webkit',Xb='window.__gwtStatsEvent && window.__gwtStatsEvent({';var m=window,n=document,o=m.__gwtStatsEvent?function(a){return m.__gwtStatsEvent(a)}:null,p=m.__gwtStatsSessionId?m.__gwtStatsSessionId:null,q,r,s=M,t={},u=[],v=[],w=[],x=0,y,z;o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:P,millis:(new Date).getTime(),type:Q});if(!m.__gwt_stylesLoaded){m.__gwt_stylesLoaded={}}if(!m.__gwt_scriptsLoaded){m.__gwt_scriptsLoaded={}}function A(){var b=false;try{var c=m.location.search;return (c.indexOf(R)!=-1||(c.indexOf(S)!=-1||m.external&&m.external.gwtOnLoad))&&c.indexOf(T)==-1}catch(a){}A=function(){return b};return b}
function B(){if(q&&r){q(y,N,s,x);o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:U,millis:(new Date).getTime(),type:V})}}
function C(){function e(a){var b=a.lastIndexOf(W);if(b==-1){b=a.length}var c=a.indexOf(X);if(c==-1){c=a.length}var d=a.lastIndexOf(Y,Math.min(c,b));return d>=0?a.substring(0,d+1):M}
function f(a){if(a.match(/^\w+:\/\//)){}else{var b=n.createElement(Z);b.src=a+$;a=e(b.src)}return a}
function g(){var a=E(_);if(a!=null){return a}return M}
function h(){var a=n.getElementsByTagName(ab);for(var b=0;b<a.length;++b){if(a[b].src.indexOf(bb)!=-1){return e(a[b].src)}}return M}
function i(){var a;if(typeof isBodyLoaded==cb||!isBodyLoaded()){var b=db;var c;n.write(eb+b+fb);c=n.getElementById(b);a=c&&c.previousSibling;while(a&&a.tagName!=gb){a=a.previousSibling}if(c){c.parentNode.removeChild(c)}if(a&&a.src){return e(a.src)}}return M}
function j(){var a=n.getElementsByTagName(hb);if(a.length>0){return a[a.length-1].href}return M}
function k(){var a=n.location;return a.href==a.protocol+ib+a.host+a.pathname+a.search+a.hash}
var l=g();if(l==M){l=h()}if(l==M){l=i()}if(l==M){l=j()}if(l==M&&k()){l=e(n.location.href)}l=f(l);s=l;return l}
function D(){var b=document.getElementsByTagName(jb);for(var c=0,d=b.length;c<d;++c){var e=b[c],f=e.getAttribute(kb),g;if(f){f=f.replace(lb,M);if(f.indexOf(mb)>=0){continue}if(f==nb){g=e.getAttribute(ob);if(g){var h,i=g.indexOf(pb);if(i>=0){f=g.substring(0,i);h=g.substring(i+1)}else{f=g;h=M}t[f]=h}}else if(f==qb){g=e.getAttribute(ob);if(g){try{z=eval(g)}catch(a){alert(rb+g+sb)}}}else if(f==tb){g=e.getAttribute(ob);if(g){try{y=eval(g)}catch(a){alert(rb+g+ub)}}}}}}
function E(a){var b=t[a];return b==null?null:b}
function F(a,b){var c=w;for(var d=0,e=a.length-1;d<e;++d){c=c[a[d]]||(c[a[d]]=[])}c[a[e]]=b}
function G(a){var b=v[a](),c=u[a];if(b in c){return b}var d=[];for(var e in c){d[c[e]]=e}if(z){z(a,d,b)}throw null}
v[vb]=function(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(wb)!=-1}())return wb;if(function(){return b.indexOf(xb)!=-1}())return yb;if(function(){return b.indexOf(zb)!=-1&&n.documentMode>=9}())return Ab;if(function(){return b.indexOf(zb)!=-1&&n.documentMode>=8}())return Bb;if(function(){var a=/msie ([0-9]+)\.([0-9]+)/.exec(b);if(a&&a.length==3)return c(a)>=6000}())return Cb;if(function(){return b.indexOf(Db)!=-1}())return Eb;return Fb};u[vb]={gecko1_8:0,ie6:1,ie8:2,ie9:3,opera:4,safari:5};JmsClient.onScriptLoad=function(a){JmsClient.onScriptLoad=null;q=a;B()};if(A()){alert(Gb+Hb);return}D();C();o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:P,millis:(new Date).getTime(),type:Ib});var H;try{F([Cb],Jb);F([Bb],Kb);F([Eb],Lb);F([yb],Mb);F([wb],Nb);F([Ab],Ob);H=w[G(vb)];var I=H.indexOf(Pb);if(I!=-1){x=Number(H.substring(I+1));H=H.substring(0,I)}}catch(a){return}var J;function K(){if(!r){r=true;B();if(n.removeEventListener){n.removeEventListener(Qb,K,false)}if(J){clearInterval(J)}}}
if(n.addEventListener){n.addEventListener(Qb,function(){K()},false)}var J=setInterval(function(){if(/loaded|complete/.test(n.readyState)){K()}},50);o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:P,millis:(new Date).getTime(),type:V});o&&o({moduleName:N,sessionId:p,subSystem:O,evtGroup:Rb,millis:(new Date).getTime(),type:Q});var L=Sb+s+H+Tb;n.write(Ub+Vb+Wb+Xb+Yb+Zb+$b+Xb+Yb+_b+ac+bc+L+cc+dc+ec+fc)}
JmsClient();