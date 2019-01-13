
$(document).ready(function () {

    var players = {

        "Walker King": {
            name: "Walker King",
            life: 180,
            attack: 7,
            picLink: "assets/media/images/whiteWalkerKing.gif",
            foolResponse: 25
        },

        "Dragon": {
            name: "Dragon",
            life: 120,
            attack: 8,
            picLink: "assets/media/images/dragon.gif",
            foolResponse: 15
        },

        "Queen of Dragons": {
            name: "Queen of Dragons",
            life: 75,
            attack: 50,
            picLink: "assets/media/images/queenDragon.gif",
            foolResponse: 20
        },

        "Ice Dragon": {
            name: "Ice Dragon",
            life: 100,
            attack: 14,
            picLink: "assets/media/images/iceDragon.gif",
            foolResponse: 5
        },

    };

    var foolSeen;

    var benchFools = [];

    var foolLoc;

    var turnCounter = 1;

    var killCount = 0;

    var audio = new Audio("assets/media/audio/cannon.mp3");


    var playerInfo = function (player, renderArea) {


        var playSpace = $("<div class='player' data-name='" + player.name + "'>");

        var playTitle = $("<div class='player-name'>").text(player.name);

        var playPic = $("<img alt='image' class='player-image'>").attr("src", player.picLink);

        var playLife = $("<div class='player-life'>").text(player.life);
        playSpace.append(playTitle).append(playPic).append(playLife);
        $(renderArea).append(playSpace);
    };

    var loadPlayers = function () {

        for (var key in players) {
            playerInfo(players[key], "#pickHero");
        }
    };


    loadPlayers();

    var syncPlayer = function (charObj, areaRender) {

        $(areaRender).empty();
        playerInfo(charObj, areaRender);
    };

    var syncEnemies = function (foolArr) {
        for (var i = 0; i < foolArr.length; i++) {
            playerInfo(foolArr[i], "#attackView");
        }
    };

    var gameSpeak = function (message) {

        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);
    };

    var killMoreNow = function (resultMessage) {

        var killReset = $("<button>Kill More!!!</button>").click(function () {
            location.reload();
        });

        var battleDec = $("<div class='groupTitle'>").text(resultMessage);

        $("main").append(battleDec);
        $("main").append(killReset);
    };

    var clearMessage = function () {
        var gameMessage = $("#game-message");

        gameMessage.text("");
    };

    $("#pickHero").on("click", ".player", function () {
        var name = $(this).attr("data-name");

        if (!foolSeen) {

            foolSeen = players[name];

            for (var key in players) {
                if (key !== name) {
                    benchFools.push(players[key]);
                }
            }

            $("#pickHero").hide();

            syncPlayer(foolSeen, "#heroSelView");
            syncEnemies(benchFools);
        }
    });

    $("#attackView").on("click", ".player", function () {

        var name = $(this).attr("data-name");

        if ($("#foolLoc").children().length === 0) {
            foolLoc = players[name];
            syncPlayer(foolLoc, "#foolLoc");

            $(this).remove();
            clearMessage();
        }
    });

    $("#attack-button").on("click", function () {

        if ($("#foolLoc").children().length !== 0) {
  
            var landedBlow = "The " + foolLoc.name + " lost " + foolSeen.attack * turnCounter + " life points.";
            var revengeHit = foolLoc.name + " responded with an assault that took " + foolLoc.foolResponse + " life points you.";
            clearMessage();


            foolLoc.life -= foolSeen.attack * turnCounter;

            if (foolLoc.life > 0) {
   
                syncPlayer(foolLoc, "#foolLoc");

                gameSpeak(landedBlow);
                gameSpeak(revengeHit);

                foolSeen.life -= foolLoc.foolResponse;

                syncPlayer(foolSeen, "#heroSelView");

                if (foolSeen.life <= 0) {
                    clearMessage();
                    killMoreNow("Your death agrees with you!!!");
                    $("#attack-button").off("click");
                }
            }
            else {

                $("#foolLoc").empty();

                var loserTalk = "You honor was taken by the " + foolLoc.name + ", choose another fool to reclaim it.";
                gameSpeak(loserTalk);


                killCount++;

                if (killCount >= benchFools.length) {
                    clearMessage();
                    $("#attack-button").off("click");
                    killMoreNow("The warm embrace of victory is yours!!!!");
                }
            }

            turnCounter++;

        }
        else {

            clearMessage();
            gameSpeak("Fool, you must select an enemy.");
        }

        audio.play();


    });
});
