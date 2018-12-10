
window.onload = init;
var match;
var currentGame;
var diceElements = new Array();
var playerTdArrays; 
var currentRound;
var buttonRollDice;
var tdArrayAll; 
var faceDescr; //array with text to show after clicking on face
var divFaceDescription; // div where to show text
var message; 
function init() {
    initSelectPlayerQuantity();
    //createANewGame();
    initTdArray();
    initPlayerTdArrays();
    initDice();

    initButtonRollDice();
    initFaceDescription();
    initTitleAttrFaceName();
    initMessaging();
}
function initSelectPlayerQuantity() {
    var select = document.getElementById("selectPlayer");
    select.removeAttribute("disabled"); 
    select.value = "0"; 
    select.onchange = decidePlayerQuantity;
}
function decidePlayerQuantity() {
    var select = document.getElementById("selectPlayer");
    
    var quantity = parseInt(select.value);
    //skapa match
    match = new Match(quantity);
    changePlayer();
    //match.toggleGames();
    //initColumn(currentGame.playerName);
    msg = "Det kommer til å være " + quantity + " spillere.";
    msg += "\nOm du vil endre antall spillere, oppdater siden.";
    msg += "\nTrykk på \"Kast terninger\"!";
    showMessage(msg);
    select.disabled = "disabled";
}
function changePlayer() {
    match.toggleGames();
    emphasizeColumn(currentGame.playerName, true);
    showMessage("Nå er det på tide med " + currentGame.playerName);
}

function initPlayerTdArrays() {
    playerTdArrays = new Array();
    playerTdArrays["player1"] = getTdArrayForAClass(tdArrayAll, "player1");
    playerTdArrays["player2"] = getTdArrayForAClass(tdArrayAll, "player2");
    playerTdArrays["player3"] = getTdArrayForAClass(tdArrayAll, "player3");
    playerTdArrays["player4"] = getTdArrayForAClass(tdArrayAll, "player4");

}
function initDice() {
    for (var i = 0; i < 5; i++) {
        diceElements[i] = document.getElementById("die"+i);
    }
}
function initTitleAttrFaceName() {
    var faceNameTdArray = getTdArrayForAClass(tdArrayAll, "faceName");
    for(td in faceNameTdArray) {
       
        faceNameTdArray[td].title = "Klikk for å se regler i denne";
        addEvent(faceNameTdArray[td], "click", showDescr);
    }
}
function initFaceDescription() {
    divFaceDescription = document.getElementById("faceDescription");
}
function initMessaging() {
    communicationScreen = document.getElementById("communicationScreen");
}
function initTdArray() {
    tdArrayAll = document.getElementsByTagName("td");
    //emphasizeColumn(currentGame.playerName, true);
}
function emphasizeColumn(playerName, isToEmphasize) {
    var tdArrayForPlayer = playerTdArrays[playerName];
    for (var i = 0; i < tdArrayForPlayer.length; i++) {
        var td = tdArrayForPlayer[i];
        if(isToEmphasize) {
            addClass(td, "emphasized");
        }
        else {
            removeClass(td, "emphasized");
        }
    //enableClickingPlayerColumn(player, true);
    /*
        if(!(hasClass(td, "upperSum") || hasClass(td, "bonus") || hasClass(td, "lowerSum"))) {
            addEvent(td, "click", enterPoints);
        }
        */
    }
}
function enableClickingPlayerColumn(playerName, booleanValue) {
    var tdArrayForPlayer = playerTdArrays[playerName];
    for (var i = 0; i < tdArrayForPlayer.length; i++) {
        var td = tdArrayForPlayer[i];
        var tdClass = getFirstClass(td);
        //alert(tdClass);
        if (booleanValue) {
            if(!(tdClass == "upperSum" || tdClass == "bonus" || tdClass == "lowerSum")) { 
                //alert(tdClass);
                if (!currentGame.faceArray[tdClass].face.reported) { 
                    addEvent(td, "click", enterPoints);
                }
            }
            
        }
        else {
            //td.onclick = null;
            removeEvent(td, "click", enterPoints);
        }
    }
}
function getTdArrayForAClass(tdArray, theClassName) {
    var tds = new Array();
    var index = 0;
    for (var i = 0; i < tdArray.length; i++) {
        if (hasClass(tdArray[i], theClassName)) {
            tds[index] = tdArray[i];
            index++;
        }
    }
    return tds;
}
function getFacePlayerCell(player, face) {
    var tdArrayPart = getTdArrayForAClass(tdArrayAll, player);
    var tdArrayPartPart = getTdArrayForAClass(tdArrayPart, face);
    var searchedCell = tdArrayPartPart[0];
    return searchedCell;

}
//init functions onload
function initButtonRollDice() {
    buttonRollDice = document.getElementById("rollDice");
    addEvent(buttonRollDice, "click", rollDice);
}

//game functions
function rollDice() {
       
    if (currentGame.rounds.length == 0) {
        currentGame.roll();
        updateDice();
        makeDiceImagesLockable(true);
        enableClickingPlayerColumn(currentGame.playerName, true);
        showMessage("Bra! Du har alltid 3 forsøk på å kaste terninger.");
        
    }   
    else {
        var currentRound = currentGame.rounds[currentGame.rounds.length-1]; 
        if (!currentRound.booked) {
            try {
                currentRound.roll();
                updateDice();
            }
            catch (err) {
                showMessage(err);
            }

        }
        else {
            try {
                currentGame.roll(); 
                updateDice();
                makeDiceImagesLockable(true);
                enableClickingPlayerColumn(currentGame.playerName, true);
            }
            catch (err) {
                showMessage(err);
            }
        }
    }   
}

function makeDiceImagesLockable(lockable) {
    for (var i = 0; i < 5; i++) {
        if(lockable) {
            addEvent(diceElements[i], "click", handleLocking);
            diceElements[i].title = "Klikk for å låse";
        }
        else {
            removeEvent(diceElements[i], "click", handleLocking);
            diceElements[i].title = "";
        }
    }
}

function handleLocking(event) { 
    var clickedDie = getEventTarget(event);
    var dieIndex = parseInt(clickedDie.id.charAt(3)); 
    
    var folder = "img/dice/";
    var extension = ".png";

    var currentRound = currentGame.rounds[currentGame.rounds.length-1];
    var die = currentRound.dice[dieIndex];
    var dieFace = die.amount;
    if (!die.locked) {
        die.locked = true;
        clickedDie.src = folder + "locked" + dieFace + extension;
        clickedDie.title = "Klikk for å låse ";
    }
    else {
        die.locked = false;
        clickedDie.src = folder + dieFace + extension;
        clickedDie.title = "Klikk for å låse opp";
    }
}

function updateDice() {
    
    var round = currentGame.rounds[currentGame.rounds.length-1];
    for (var i = 0; i < 5; i++) {        
        var die = round.dice[i];
        if (!die.locked) {
            var face = die.amount;
            diceElements[i].src = "img/dice/" + face + ".png";
        }
    }
}

function enterPoints(event) {
    var currentRound = currentGame.rounds[currentGame.rounds.length-1];
    var clickedCell = getEventTarget(event);

    var faceName = getFirstClass(clickedCell);
    var face = currentGame.faceArray[faceName];
    face.updatePotential(currentRound.dice);
    face.face.report();
    

    var score = face.face.score;
    
    
    writeText(clickedCell, score);
    
    currentRound.booked = true;
    updateSumAndBonusCells();
    communicateToUser();
    makeDiceImagesLockable(false); 
    enableClickingPlayerColumn(currentGame.playerName, false);
    emphasizeColumn(currentGame.playerName, false);
    changePlayer();
}
function updateSumAndBonusCells() {
    currentGame.updateSums();

    var upperSumCell = getFacePlayerCell(currentGame.playerName, "upperSum");
    var bonusCell = getFacePlayerCell(currentGame.playerName, "bonus");
    var lowerSumCell = getFacePlayerCell(currentGame.playerName, "lowerSum");

    replaceCellNumber(upperSumCell, currentGame.upperSum);
    replaceCellNumber(bonusCell, currentGame.bonus);
    replaceCellNumber(lowerSumCell, currentGame.lowerSum);

}
function replaceCellNumber(cell, number) {
    
    while (cell.hasChildNodes()) {
        cell.removeChild(cell.firstChild);
    }
    var textNode = document.createTextNode(number);
    cell.appendChild(textNode);
}
function showDescr(event) {    
    var clickedCell = getEventTarget(event);   
    var faceName = getFirstClass(clickedCell);
    writeText(divFaceDescription, Game.faceDescr[faceName]);
}
function showMessage(msg) {
    writeText(communicationScreen, msg);
    
    
    var t = setTimeout("removeContent(communicationScreen)", 10000);
}
function communicateToUser() {
    if (currentGame.currentRoundNr == 15) {
        msg = "Grattis, " + currentGame.playerName + "! Du har fått " + currentGame.lowerSum + " poeng.";
        if(currentGame.lowerSum > 200) {
            msg += "\nBra jobba!";
        }
        else if (currentGame.lowerSum > 300) {
            msg += "\nWow, sånt skjer ikke ofte!";
        }
    }
    else {
        msg = currentGame.playerName + " har " + (maxRounds - currentGame.currentRoundNr) + " runder hver.";
    }
    showMessage(msg);
}



