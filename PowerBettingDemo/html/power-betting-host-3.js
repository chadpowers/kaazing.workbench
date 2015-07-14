
const frameRate = 30; //frames per second

const horseNames = ["Secretariat", "Man o' War", "Kelso", "Affirmed", "Citation", "Dr. Frager", "Seattle Slew", "Native Dancer", "Spectacular Bid", "Buckpasser", "Forego", "Count Fleet", "Ruffian", "Damascus", "Round Table", "Swaps", "Zenyatta", "Tom Fool", "War Admiral", "Colin", "Assault", "Domino", "John Henry", "Seabiscuit", "American Pharoah"];
var horseNameOpt = horseNames.slice(0);

var onSplashScreen = true;
var splashing = false;
var playing = false;

var bets = new Array();
var betsToDisplay = 10;

var oddsPublisher     = null;
var controlPublisher = null;

// game control
var bettingOpened = false;
var raceStarted   = false;
var bettingClosed = false;
var raceFinishing = false;
var raceEnded     = false;

var timeStart     = null;

RACE_OVER_DISTANCE       = 1000.0;
BETTING_CLOSED_DISTANCE  = 0.8 * RACE_OVER_DISTANCE;
RACE_FINISHING_DISTANCE  = RACE_OVER_DISTANCE - 100;


// cache for drawing
var recentLeaderPosition = 0;
var recentLeaderDrawPosition = 0;

var topicNumber = null;

// EASELJS VARs
var stage, w, h, loader;
var background, spashhorse, horses, fense_back, fence_front, connectQR, finish, finish_shadow;
var textNumber, textName, textOdds, textBetName, textBetNumber, textBetAmount, textTime;

function init() {
  // screen set up
  viewport = document.querySelector("meta[name=viewport]");
  viewport.setAttribute('content', 'width=device-width, initial-scale=' + (window.width + 0.1)/1366.0 + ', maximum-scale=' + (window.width + 0.1)/1366.0 + ', user-scalable=0');
  console.log(viewport);
  
  if (topicNumber == null)
    topicNumber = (Math.random()*900 + 100) | 0;

  // start gateway

  // easelJS
  stage = new createjs.Stage("canvas");
  w = stage.canvas.width;
  h = stage.canvas.height;

  manifest = [
    {src: "spritesheet_horse0.png", id: "horse0"},
    {src: "spritesheet_horse1.png", id: "horse1"},
    {src: "spritesheet_horse2.png", id: "horse2"},
    {src: "spritesheet_horse3.png", id: "horse3"},
    {src: "spritesheet_shadow.png", id: "shadow"},
    {src: "0.png",                  id: "icon0"},
    {src: "1.png",                  id: "icon1"},
    {src: "2.png",                  id: "icon2"},
    {src: "3.png",                  id: "icon3"},
    {src: "background.png",         id: "background"},
    {src: "fences-front.png",       id: "fence-front"},
    {src: "fences-back.png",        id: "fence-back"},
    {src: "finish.png",             id: "finish"},
    {src: "finish-shadow.png",      id: "finish-shadow"}
  ];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleComplete);
  loader.loadManifest(manifest, true, "../images/");
}

function handleComplete() {
  background = new createjs.Shape();
  background.graphics.beginBitmapFill(loader.getResult("background")).drawRect(0, 0, w, h);

  var fence_backImg = loader.getResult("fence-back");
  fence_back = new createjs.Shape();
  fence_back.graphics.beginBitmapFill(fence_backImg).drawRect(0, 0, fence_backImg.width, fence_backImg.height);
  fence_back.y = 0;

  var fence_frontImg = loader.getResult("fence-front");
  fence_front = new createjs.Shape();
  fence_front.graphics.beginBitmapFill(fence_frontImg).drawRect(0, 0, fence_frontImg.width, fence_frontImg.height);
  fence_front.y = 0;

  var finishImg = loader.getResult("finish");
  finish = new createjs.Shape();
  finish.graphics.beginBitmapFill(finishImg).drawRect(0, 0, finishImg.width, finishImg.height);
  finish.y = 360;

  var finish_shadowImg = loader.getResult("finish-shadow");
  finish_shadow = new createjs.Shape();
  finish_shadow.graphics.beginBitmapFill(finish_shadowImg).drawRect(0, 0, finish_shadowImg.width, finish_shadowImg.height);
  finish_shadow.y = 360;

  var clientURL = "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=" + window.location.href.replace("host-3", "client") + "?topic="+topicNumber+"&bgcolor=F47D31&color=ffffff"
  //"https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=demos.kaazing.com/powerbetting?topic="+topicNumber+"&bgcolor=F47D31&color=ffffff"
  connectQR = new createjs.Bitmap(clientURL);
  connectQR.x = w/2 - 260/2;
  connectQR.y = 190;

  splashHorse = new Horse(1);
  splashHorse.sprite.gotoAndPlay("freeze");
  splashHorse.shadow.gotoAndPlay("freeze");

  horses = [];
  for (var i = 0; i < 4; i++)
    horses.push(new Horse(i));

  textNumber   = new createjs.Text("", "small-caps 300 32px Muli", "#ffffff");
  textNumber.y = 220;
  textNumber.x = 190;
  textNumber.lineHeight = 38;
  textName = new createjs.Text("", "small-caps 300 32px Muli", "#ffffff");
  textName.y   = 220;
  textName.x   = 235;
  textName.lineHeight = 38;
  textOdds = new createjs.Text("", "small-caps 300 32px Muli", "#ffffff");
  textOdds.y   = 220;
  textOdds.x   = 530;
  textOdds.lineHeight = 38;
  textBetName = new createjs.Text("", "small-caps 300 20px Muli", "#ffffff");
  textBetName.y   = 220;
  textBetName.x   = 827;
  textBetName.lineHeight = 24;
  textBetNumber = new createjs.Text("", "small-caps 300 20px Muli", "#ffffff");
  textBetNumber.y   = 220;
  textBetNumber.x   = 1027;
  textBetNumber.lineHeight = 24;
  textBetAmount = new createjs.Text("", "small-caps 300 20px Muli", "#ffffff");
  textBetAmount.y   = 220;
  textBetAmount.x   = 1127;
  textBetAmount.lineHeight = 24;
  textTopic = new createjs.Text("" + topicNumber, "small-caps 300 32px Muli", "#ffffff");
  textTopic.x = 898;
  textTopic.y = 515;
  textTime = new createjs.Text("", "small-caps 300 40px Muli", "#ffffff");
  textTime.x = 1238;
  textTime.y = 62;


  // add children
  stage.addChild(background, finish_shadow, fence_back, finish, splashHorse.shadow, splashHorse.sprite, textTopic, textTime);
  stage.addChild(fence_front);
  stage.addChild(connectQR);


  document.getElementById("canvas").onclick = function() {
      handleClick()
    };

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", tick);
}

function handleClick() {
  if (onSplashScreen) {
    splashing = true;
    splashHorse.sprite.gotoAndPlay("run");
    splashHorse.shadow.gotoAndPlay("run");
    setTimeout(function() {
      splashing = false;
      onSplashScreen = false;
      stage.removeChild(connectQR, splashHorse.sprite, splashHorse.shadow);
      for (var i = 0; i < horses.length; i++) {
        stage.addChild(horses[i].shadow);
        stage.addChild(horses[i].icon);
      }
      for (var i = 0; i < horses.length; i++) {
        stage.addChild(horses[i].sprite);
      }
      stage.addChild(textNumber, textName, textOdds, textBetName, textBetNumber, textBetAmount);
      recentLeaderPosition = leadingHorsePosition();
      recentLeaderDrawPosition = leadingHorseDrawPosition();
      updateView();
      startClock();
    }, 5000);
  } else if (!playing) {
    // disabled click to start
    // playing = true;
    // for (var i = 0; i < horses.length; i++) {
    //   horses[i].shadow.gotoAndPlay("start");
    //   horses[i].sprite.gotoAndPlay("start");
    // }
  } else if (raceEnded) {
    reset();
  }
}

function tick(event) {
  var deltaS = event.delta / 1000;

  // check for start
  if (!raceStarted && !onSplashScreen && !playing) {
    if (timeStart < new Date().getTime()/1000) {
      playing = true;
      for (var i = 0; i < horses.length; i++) {
        horses[i].shadow.gotoAndPlay("start");
        horses[i].sprite.gotoAndPlay("start");
      }
    }
  }

  updateModel(deltaS);
  updateProbs();
  updateView();
  stage.update(event);
  sendOdds();
}

function startClock() {
  timeStart = new Date().getTime()/1000 + 15;
}

function reset() {
  controlPublisher.onNext("-1:null");
  bettingOpened = false;
  raceStarted   = false;
  bettingClosed = false;
  raceFinishing = false;
  raceEnded     = false;
  bets = new Array();

  for(var i = 0; i < horses.length; i++) {
    horses[i].rating = 4.0;
    horses[i].position = 0.0;
    horses[i].newName();
  }

  playing = false;

  recentLeaderPosition = leadingHorsePosition();
  recentLeaderDrawPosition = leadingHorseDrawPosition();
  updateView();
  for (var i = 0; i < horses.length; i++) {
    horses[i].shadow.gotoAndPlay("still");
    horses[i].sprite.gotoAndPlay("still");
  }
  updateProbs();
  startClock();
}


// updates pieces' positions
function updateModel(deltaS) {
  if (splashing)
    splashHorse.updatePosition(deltaS);
  else if (playing) {
    for(var i = 0; i < horses.length; i++)
      horses[i].updatePosition(deltaS);
    recentLeaderPosition = leadingHorsePosition();
    recentLeaderDrawPosition = leadingHorseDrawPosition();
  }
}

function updateView() {
  // horses + fences
  splashHorse.updateDrawLocation();
  for(var i = 0; i < horses.length; i++)
    horses[i].updateDrawLocation();
  if (!raceFinishing) {
    fence_front.x   = (recentLeaderDrawPosition - recentLeaderPosition*10 - 1328) % 1316;
    fence_back.x    = (recentLeaderDrawPosition - recentLeaderPosition*9  - 1328) % 1292;
    finish.x        = (recentLeaderDrawPosition + (RACE_OVER_DISTANCE - recentLeaderPosition)*10) + 105;
    finish_shadow.x = (recentLeaderDrawPosition + (RACE_OVER_DISTANCE - recentLeaderPosition)*10) + 105;
  }

  var secondsLeft = (Math.max(timeStart - new Date().getTime()/1000, -1));
  if (secondsLeft < 0)
    secondsLeft = -1;
  secondsLeft = (secondsLeft | 0);
  var minutes = (((secondsLeft + 1) / 60) | 0);
  var seconds = ((secondsLeft + 1) % 60);
  if (seconds < 10)
    textTime.text = "" + minutes + ":0" + seconds;
  else
    textTime.text = "" + minutes + ":" + seconds;

  // text values
  t0 = "";
  t1 = "";
  t2 = "";
  t3 = "";
  t4 = "";
  t5 = "";

  for(var i = 0; i < horses.length; i++) {
    t0 += horses[i].num + "\n";
    t1 += horses[i].name + "\n";
    t2 += stringOdds(horses[i].prob) + "\n";
  }

  for(var i = 0; i < bets.length && i < betsToDisplay; i++) {
    t3 += bets[bets.length-i-1].client       + "\n";
    t4 += bets[bets.length-i-1].horse        + "\n";
    t5 += "$" + bets[bets.length-i-1].amount + "\n";
  }

  textNumber.text    = t0;
  textName.text      = t1;
  textOdds.text      = t2;
  textBetName.text   = t3;
  textBetNumber.text = t4;
  textBetAmount.text = t5;
}



function drawTopicNumber(ctx) {
  if (topicNumber != null) {
    ctx.save();
    ctx.font = "small-caps 28px Muli";
    ctx.fillText("" + topicNumber, 902, 540);
    ctx.restore();
  }
}




/*     ####       ####
 *     ####       ####
 *     ####       ####
 *     ####       ####
 *     ###############
 *     ###############
 *     ###############
 *     ####       ####
 *     ####       ####
 *     ####       ####
 *     ####       ####
 */
function Horse(num) {
  this.rating = 4;
  this.num = num;
  this.name = "";
  this.position = 0.0;
  this.prob = 0;
  this.sprite = null;
  this.shadow = null;
  this.icon   = null;

  this.init = function() {
    // horse
    this.newName();
    var randStart = Math.random()*10 | 0;
    var spriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        "images": [loader.getResult("horse" + this.num)],
        "frames": {"regX": 0, "height": 115, "regY": 0, "width": 222},
        // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        "animations": {
          "run": [1, 11, "run", 0.7],
          "start": [randStart, 11, "run", 0.7],
          "still": 0,
          "freeze": 1
        }
      });
    this.sprite = new createjs.Sprite(spriteSheet, "still");
    this.sprite.y = 540 + this.num*20;

    // shadow
    var spriteSheet = new createjs.SpriteSheet({
        framerate: 30,
        "images": [loader.getResult("shadow")],
        "frames": {"regX": 0, "height": 115, "regY": 0, "width": 222},
        // define two animations, run (loops, 1.5x speed) and jump (returns to run):
        "animations": {
          "run": [1, 11, "run", 0.7],
          "start": [randStart, 11, "run", 0.7],
          "still": 0,
          "freeze": 1
        }
      });
    this.shadow = new createjs.Sprite(spriteSheet, "still");
    this.shadow.y = 540 + this.num*20;

    // icon
    var iconImg = loader.getResult("icon" + this.num);
    this.icon = new createjs.Shape();
    this.icon.graphics.beginBitmapFill(iconImg).drawRect(0, 0, iconImg.width, iconImg.height);
    this.icon.y = 808 + this.num*3;
  }
  
  this.updatePosition = function(deltaS) {
    // move in some way
    this.rating += (Math.random() - 0.47)/3;
    if (this.rating > 6)
      this.rating = 6;
    //this.position += this.rating/6.0;
    this.position += this.rating*8.3*deltaS;

    // check for key endings
    if (this.position > BETTING_CLOSED_DISTANCE && !bettingClosed)
      closeBetting();
    if (this.position > RACE_FINISHING_DISTANCE && !raceFinishing)
      raceFinishing = true;
    if (this.position > RACE_OVER_DISTANCE && ! raceEnded)
      endRace(this.num);
  };

  this.updateDrawLocation = function() {
    this.sprite.x = this.drawX();
    this.shadow.x = this.sprite.x;
    this.icon.x   = this.iconX();
  }


  // x draw location, slide left to right
  this.drawX = function() {
    if (this.num == 1 && onSplashScreen) {
      return 270.0 + (1010.0 - 270.0)*(this.position/70.0);
    }
    return (this.position - recentLeaderPosition)*10 + recentLeaderDrawPosition;
  }

  this.iconX = function() {
    var maxPosition = Math.min(horses[num].position, RACE_OVER_DISTANCE);
    return 315 + (1220.0 - 315.0)*(maxPosition)/RACE_OVER_DISTANCE;
  }

  this.newName = function() {
    if (horseNames.length == 0)
      horseNameOpt = horseNames.slice(0);
    var i = Math.random()*horseNames.length | 0;
    this.name = horseNames[i];
    horseNames.splice(i, 1);
  }

  this.init();
}



function leadingHorseDrawPosition() {
  var percent = recentLeaderPosition / RACE_OVER_DISTANCE;
  //console.log(percent);
  if (percent <= 0.2) {
    return 300 + percent*1500;
  } else if (percent < RACE_FINISHING_DISTANCE/RACE_OVER_DISTANCE) {
    return 600 + Math.sin((percent - 0.2)*15)*200 - 500*(percent - 0.2);
  } else {
    return 600 + Math.sin((RACE_FINISHING_DISTANCE/RACE_OVER_DISTANCE - 0.2)*15)*200 - 500*(RACE_FINISHING_DISTANCE/RACE_OVER_DISTANCE - 0.2)+ (recentLeaderPosition - RACE_FINISHING_DISTANCE)*10;
  } 
}

//
function leadingHorsePosition() {
  maxPosition = -1;
  for (var i = 0; i < horses.length; i++) {
    if (maxPosition < horses[i].position)
      maxPosition = horses[i].position;
  }
  return maxPosition;
}


/*       ###########
 *      #############
 *    #####       ##### 
 *    ####         ####
 *    ####         ####
 *    ####         ####
 *    ####         ####
 *    ####         ####  
 *    ####         ####
 *    #####       #####
 *      #############
 *       ###########
 */


function updateProbs() {
  var totalInverseDistance = 0;
  for (var i = 0; i < horses.length; i++) {
    var modDistanceToGo = RACE_OVER_DISTANCE - horses[i].position + 10;
    if (modDistanceToGo < 0.1)
      modDistanceToGo = 0.1;
    totalInverseDistance += Math.pow(modDistanceToGo, -10);
  }
  for (var i = 0; i < horses.length; i++) {
    var modDistanceToGo = RACE_OVER_DISTANCE - horses[i].position + 10;
    if (modDistanceToGo < 0.1)
      modDistanceToGo = 0.1;
    horses[i].prob = Math.pow(modDistanceToGo, -10) / totalInverseDistance;
  }
}

function stringOdds(prob) {
  var odds = (1.0 - prob)/prob;
  if (odds > 1000)
    odds = 1000;
  var num = 1.0;
  var den = 1.0;
  while (Math.abs(odds - num/den) > oddsError(odds)) {
    if (num/den < odds)
      if (num >= 25)
        num += 5;
      else
        num++;
    else
      den++;
  }
  // do rounding later
  return num + ":" + den;
}

function oddsError(odds) {
  if (odds < 2)
    return 0.1;
  else if (odds < 6)
    return 0.25;
  else if (odds < 25)
    return 0.5;
  else
    return 2.5;
}


function Bet(message) {
  var comp = message.split(',');
  this.client = comp[0]; 
  this.horse  = comp[1]; 
  this.amount = comp[2]; 
  this.odds   = comp[3]; 

  this.draw = function(ctx, h) {
    
  }
}



/*        ##########
 *      ##############
 *    ######       ##### 
 *    ####         #####
 *    #### 
 *    #### 
 *    ####     #########
 *    ####     #########  
 *    ####         #####
 *    #####        #####
 *      ###############
 *       ###########
 */

function sendOdds() {
  var message = "";
  for (var i = 0; i < horses.length; i++) {
    message += horses[i].num  + ","
    message += horses[i].name + ","
    message += stringOdds(horses[i].prob);
    if (i != horses.length - 1)
      message += ";"
  }
  if (oddsPublisher != null)
    oddsPublisher.onNext(message);
}


(function() {
  if (topicNumber == null) {
    topicNumber = (Math.random()*900 + 100) | 0;
  }
//"ws://localhost:8000/jms"
//"ws://wallet.kaazing.com/jms"
//"ws://127.0.0.0:8000/jms"
  Kaazing.Messaging.newContext("ws://wallet.kaazing.com/jms")
      .then(function(context) {
          context.newPublisher(topicNumber + "odds")
             .then(function(pub) {
                 oddsPublisher = pub; //
             });
             
          context.newPublisher(topicNumber + "control")
             .then(function(pub) {
                 controlPublisher = pub; //
                 openBetting();
             });

          context.newSubscriber (topicNumber + "bet")
            .then(function(subscriber) {
                subscriber.map (function (bet) {
                  //console.log(bet);
                  return bet;
                })
                .filter (function(stock) {
                  // return stock[1] == "MSFT";
                  return true;
                })
                .forEach(function (betInfo) {
                  bets.push(new Bet(betInfo));
                });
            });
          context.newSubscriber (topicNumber + "sc")
            .then(function(subscriber) {
                subscriber.map (function (bet) {
                  betInfo = bet.split(',');
                  return betInfo;
                })
                .filter (function(stock) {
                  // return stock[1] == "MSFT";
                  return true;
                })
                .forEach(function (betInfo) {
                  if (betInfo[0] == 0) {
                    horses[betInfo[1]].rating  = 0;
                  } else if (betInfo[0] == 1) {
                    horses[betInfo[1]].rating -= 0.5;
                  } else if (betInfo[0] == 2) {
                    horses[betInfo[1]].rating += 0.5;
                  }
                });
            });
      });
}());

// GAME CONTROL METHODS
function openBetting() {
  if (!bettingOpened) {
    bettingOpened = true;
    // post message to clients
    controlPublisher.onNext("0:null");
  }
}

function startRace() {
  if (!raceStarted) {
    raceStarted = true;
    // post message to clients
    controlPublisher.onNext("1:null");
  }
}

function closeBetting() {
  if (!bettingClosed) {
    bettingClosed = true;
    // post message to clients
    controlPublisher.onNext("2:null");
  }
}

function endRace(winnerNum) {
  if (!raceEnded) {
    raceEnded = true;
    // post message to clients
    controlPublisher.onNext("3:" + winnerNum); // send winner
  }
}

init();
