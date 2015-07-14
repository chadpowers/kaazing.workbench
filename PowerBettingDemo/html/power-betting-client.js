/**
 * Created by pmoskovi on 5/14/15.
 */

var money = 0;
var moneyTable = null;

var horseList = [];
var horseTable = document.getElementById("horseTable");
var moneyCell = null;
var bettingLogCell = null;
var betList = [];
var betTable = document.getElementById("betTable");

var currentOdds = [];
var placedBets  = [];

var betPublisher = null;
var bettingOpen  = true;

var clientName = "NAME WILL GO HERE"

function init() {
  money = 100;
  clientName = get("name").replace("+", " ");
  moneyTable = document.getElementById('moneyTable');
  moneyRow = moneyTable.insertRow(1);
  moneyRow.insertCell(0).innerHTML = clientName;
  moneyCell = moneyRow.insertCell(1);
  moneyCell.innerHTML = "$" + money;
  bettingLogCell = moneyRow.insertCell(2);
  bettingLogCell.innerHTML = "";

}

function betUp(horseNum) {
  cell = horseTable.rows[horseList.indexOf(horseNum.toString())+1].cells[4];
  if (betList[horseNum] + 5 <= money) { // make sure no one can bet above what they have
    betList[horseNum] += 5;
    cell.innerHTML = "$" + betList[horseNum];
  }
  //horseTable.rows[horseList.indexOf(horseInfo[0])+1].cells[4].innerHTML = horseInfo[2];
}

function betDn(horseNum) {
  cell = horseTable.rows[horseList.indexOf(horseNum.toString())+1].cells[4];
  if (betList[horseNum] != 0) { // make sure no one can bet under zero
    betList[horseNum] -= 5;
    cell.innerHTML = "$" + betList[horseNum];
  }
}

function betZo(horseNum) {
  cell = horseTable.rows[horseList.indexOf(horseNum.toString())+1].cells[4];
  if (betList[horseNum] != 0) {
    betList[horseNum] = 0;
    cell.innerHTML = "$" + betList[horseNum];
  }
}

function betPl(horseNum) {
  if (betList[horseNum] != 0 && betList[horseNum] <= money && bettingOpen) {
    console.log("placed bet of " + betList[horseNum] + " on " + horseNum);
    if (betPublisher != null) {
      var newBet = new Bet(horseNum, betList[horseNum], currentOdds[horseNum]);
      placedBets.push(newBet);
      betPublisher.onNext(newBet.message());
      money -= newBet.amount;
      moneyCell.innerHTML = "$" + money;
      betZo(horseNum);
      betRow = betTable.insertRow(1);
      betRow.insertCell(0).innerHTML = newBet.horse;
      betRow.insertCell(1).innerHTML = newBet.odds;
      betRow.insertCell(2).innerHTML = newBet.amount;
      betRow.insertCell(3).innerHTML = newBet.returnIfWon();
    } else {
      console.log("cannot place bet, null publisher");
    }
  } else {
    console.log("illegal bet");
  }
}

function mouseDn(id) {
  image = document.getElementById(id);
  if (id.charAt(0) == 'O')
    image.src = '../images/icon_O_grey.png';
  else if (id.charAt(0) == '-')
    image.src = '../images/icon_-_grey.png';
  else if (id.charAt(0) == '+')
    image.src = '../images/icon_+_grey.png';
  else if (id.charAt(0) == 'B')
    image.src = '../images/bet_grey.png';
}

function mouseUp(id) {
  image = document.getElementById(id)
  if (id.charAt(0) == 'O')
    image.src = '../images/icon_O.png';
  else if (id.charAt(0) == '-')
    image.src = '../images/icon_-.png';
  else if (id.charAt(0) == '+')
    image.src = '../images/icon_+.png';
  else if (id.charAt(0) == 'B')
    image.src = '../images/bet.png';
}

// message code 0
function bettingOpened() {
  console.log("bettingOpened");
  bettingLogCell.innerHTML = "Betting Open";
  bettingOpen = true;
}

// message code 1
function raceStarted() {
  console.log("raceStarted");
}

// message code 2
function bettingClosed() {
  console.log("bettingClosed");
  bettingLogCell.innerHTML = "Betting Closed";
  bettingOpen = false;
}

// message code 3
function raceFinshed(winner) {
  console.log("raceFinshed with winner: " + winner);
  bettingLogCell.innerHTML = "Race Over: # " + winner + " horse won";
  // give winnings
  for (var i = 0; i < placedBets.length; i++) {
    if (winner == placedBets[i].horse) {
      money += placedBets[i].returnIfWon();
      console.log("Won " + placedBets[i].returnIfWon() + " with " + placedBets[i].message());
    }
  }
  moneyCell.innerHTML = "$" + money;
  placedBets = [];
}

// message code -1
function reset() {
  console.log("reset");
  bettingOpened();
  placedBets  = [];
  for (var i = 0; i < horseList.length; i++)
    betZo(i);
  while (betTable.rows.length > 1)
    betTable.deleteRow(1);
}



function Bet(horseNum, amount, odds) {
  this.horse = horseNum;
  this.amount = amount;
  this.odds = odds;

  this.message = function() {
    return clientName + "," + this.horse + "," + this.amount + "," + this.odds;
  }

  this.returnIfWon = function() {
    oddParts = this.odds.split(":");
    var r = parseFloat(oddParts[0]) / parseFloat(oddParts[1]) + 1;
    return this.amount * r; 
  }
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
          context.newPublisher(get("topic") + "bet")
             .then(function(pub) {
                 betPublisher = pub; //
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
                      betList.push(0);
                      currentOdds.push(horseInfo[2]);
                      horseRow = horseTable.insertRow(horseList.length);
                      horseRow.insertCell(0).innerHTML = horseInfo[0];
                      horseRow.insertCell(1).innerHTML = horseInfo[1];
                      horseRow.insertCell(2).innerHTML = horseInfo[2];
                      horseRow.insertCell(3).innerHTML = "" + 
                        "<img id='O" + horseInfo[0] + "' src = '../images/icon_O.png' height=40 width = 40  onclick='betZo(" + horseInfo[0] + ")' onmousedown='mouseDn(id)' onmouseup='mouseUp(id)'/>" + 
                        "<img id='-" + horseInfo[0] + "' src = '../images/icon_-.png' height=40 width = 40  onclick='betDn(" + horseInfo[0] + ")' onmousedown='mouseDn(id)' onmouseup='mouseUp(id)'/>" + 
                        "<img id='+" + horseInfo[0] + "' src = '../images/icon_+.png' height=40 width = 40  onclick='betUp(" + horseInfo[0] + ")' onmousedown='mouseDn(id)' onmouseup='mouseUp(id)'/>" + 
                        "<img id='B" + horseInfo[0] + "' src = '../images/bet.png'    height=40 width = 120 onclick='betPl(" + horseInfo[0] + ")' onmousedown='mouseDn(id)' onmouseup='mouseUp(id)'/>";
                      horseRow.insertCell(4).innerHTML = "$" + betList[i];
                    } else {
                      horseTable.rows[horseList.indexOf(horseInfo[0])+1].cells[2].innerHTML = horseInfo[2];
                      horseTable.rows[horseList.indexOf(horseInfo[0])+1].cells[1].innerHTML = horseInfo[1];
                      currentOdds[horseList.indexOf(horseInfo[0])] = horseInfo[2];
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
