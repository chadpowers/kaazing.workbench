/**
 * Created by pmoskovi on 5/14/15.
 */

var money = 0;
var moneyTable = null;

var horseList = [];
var horseTable = document.getElementById("horseTable");

var scPublisher = null;
var bettingOpen  = true;

var clientName = "NAME WILL GO HERE"

function init() {

}

function Zo(horseNum) {
  scPublisher.onNext("0," + horseNum);
}

function Dn(horseNum) {
  scPublisher.onNext("1," + horseNum);
}

function Up(horseNum) {
  scPublisher.onNext("2," + horseNum);
}


function mouseDn(id) {
  image = document.getElementById(id);
  if (id.charAt(0) == 'O')
    image.src = '../images/icon_O_grey.png';
  else if (id.charAt(0) == '-')
    image.src = '../images/icon_-_grey.png';
  else if (id.charAt(0) == '+')
    image.src = '../images/icon_+_grey.png';
}

function mouseUp(id) {
  image = document.getElementById(id)
  if (id.charAt(0) == 'O')
    image.src = '../images/icon_O.png';
  else if (id.charAt(0) == '-')
    image.src = '../images/icon_-.png';
  else if (id.charAt(0) == '+')
    image.src = '../images/icon_+.png';
}

// message code 0
function bettingOpened() {
  console.log("bettingOpened");
  bettingOpen = true;
}

// message code 1
function raceStarted() {
  console.log("raceStarted");
}

// message code 2
function bettingClosed() {
  console.log("bettingClosed");
  bettingOpen = false;
}

// message code 3
function raceFinshed(winner) {
  console.log("raceFinshed with winner: " + winner);
}

// message code -1
function reset() {
  bettingOpen  = true;
}

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

(function() {

  //var horseList = [];
  //var horseTable = document.getElementById("horseTable");

  Kaazing.Messaging.newContext("ws://wallet.kaazing.com/jms")
      .then(function(context) {
          context.newPublisher(get("topic") + "sc")
             .then(function(pub) {
                console.log("pub");
                 scPublisher = pub; //
             });

          context.newSubscriber (get("topic") + "odds")
            .then(function(subscriber) {
                subscriber.map (function (horseL) {
                  var horses = horseL.split(";");
                  return horses;
                })
                .filter (function(stock) {
                  // return stock[1] == "MSFT";
                  return true;
                })
                .forEach(function (horses) {
                  for (var i = 0; i < horses.length; i++) {
                    horseInfo = horses[i].split(",");
                    if (horseList.indexOf(horseInfo[0]) < 0) {
                      horseList.push(horseInfo[0]);
                      horseRow = horseTable.insertRow(horseList.length);
                      horseRow.insertCell(0).innerHTML = horseInfo[0];
                      horseRow.insertCell(1).innerHTML = horseInfo[1];
                      horseRow.insertCell(2).innerHTML = horseInfo[2];
                      horseRow.insertCell(3).innerHTML = "" + 
                        "<img id='O" + horseInfo[0] + "' src = '../images/icon_O.png' height=40 width = 40  onclick='Zo(" + horseInfo[0] + ")' onmousedown='mouseDn(id)' onmouseup='mouseUp(id)'/>" + 
                        "<img id='-" + horseInfo[0] + "' src = '../images/icon_-.png' height=40 width = 40  onclick='Dn(" + horseInfo[0] + ")' onmousedown='mouseDn(id)' onmouseup='mouseUp(id)'/>" + 
                        "<img id='+" + horseInfo[0] + "' src = '../images/icon_+.png' height=40 width = 40  onclick='Up(" + horseInfo[0] + ")' onmousedown='mouseDn(id)' onmouseup='mouseUp(id)'/>";
                    } else {
                      horseTable.rows[horseList.indexOf(horseInfo[0])+1].cells[2].innerHTML = horseInfo[2];
                      horseTable.rows[horseList.indexOf(horseInfo[0])+1].cells[1].innerHTML = horseInfo[1];
                    }
                  }
                });
            });

          context.newSubscriber (get("topic") + "control")
            .then(function(subscriber) {
                subscriber.map (function (message) {
                  var  parts = message.split(":");
                  return parts;
                })
                .filter (function(stock) {
                  // return stock[1] == "MSFT";
                  return true;
                })
                .forEach(function (messageInfo) {
                  console.log(messageInfo);
                  if (messageInfo[0] == "0") {
                    bettingOpened();
                  } else if (messageInfo[0] == "1") {
                    raceStarted();
                  } else if (messageInfo[0] == "2") {
                    bettingClosed();
                  } else if (messageInfo[0] == "3") {
                    raceFinshed(messageInfo[1]);
                  } else if (messageInfo[0] == "-1") {
                    reset();
                  }
                });
            });
      });
}());

init();
