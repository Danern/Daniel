
var maxRounds = 15; 
var maxThrowings = 3;
function Match(quantityOfPlayers) {
    this.gamesArrayIndex = 0; 
    this.quantityOfPlayers = quantityOfPlayers;
    this.games = this.getANewGamesArray(quantityOfPlayers);
}
Match.prototype.getANewGamesArray = function(quantityOfPlayers) {
    
    var gamesArray = new Array(quantityOfPlayers);
    for(var i = 0; i < quantityOfPlayers; i++) {
        var playerName = "player" + (i+1); 
        gamesArray[i] = new Game(i, playerName);
        
    }
    return gamesArray;
};
Match.prototype.toggleGames = function() {
    currentGame = this.games[this.gamesArrayIndex];
    
    this.gamesArrayIndex = ++this.gamesArrayIndex % this.quantityOfPlayers;
};
function Game(nr, name) {
    this.playerNr = nr;
    this.playerName = name;
    this.currentRoundNr = 0;
    this.upperSum = 0;
    this.bonus = 0;
    this.lowerSum = 0;
    this.rounds = [];

    this.faceArray = [];
    
    this.faceArray.aces = new Aces();
    this.faceArray.twos = new Twos();
    this.faceArray.threes = new Threes();
    this.faceArray.fours = new Fours();
    this.faceArray.fives = new Fives();
    this.faceArray.sixes = new Sixes();

    
    this.faceArray.onePair = new OnePair();
    this.faceArray.twoPair = new TwoPair();
    this.faceArray.threeOfAKind = new ThreeOfAKind();
    this.faceArray.fourOfAKind = new FourOfAKind();
    this.faceArray.smallStraight = new SmallStraight();
    this.faceArray.largeStraight = new LargeStraight();
    this.faceArray.fullHouse = new FullHouse();
    this.faceArray.chance = new Chance();
    this.faceArray.yahtzee = new Yahtzee();
}
Game.faceDescr = {
    "aces":             "Ener: Gir samme antall poeng som antall øyne på enere.",
    "twos":             "Toere: Gir samme antall poeng som antall øyne på toere.",
    "threes":           "Treere: Gir samme antall poeng som antall øyne på treere.",
    "fours":            "Firere: Gir samme antall poeng som antall øyne på  firere.",
    "fives":            "Femmere: Gir samme antall poeng som antall øyne på femmere.",
    "sixes":            "Seksere: Gir samme antall poeng som antall øyne på seksere.",
    "upperSum":         "Sum: Hvis du har 63 eller flere poeng fra 1,2,3 osv får du 50 poeng bonus.",
    "bonus":            "BONUS: En spiller som får over 63 poeng får 50 poeng bonus.",
    "onePair":          "1 PAR: To like terninger, gir samme antall poeng som øynene på terningene som inngår i paret.",
    "twoPair":          "2 PAR: Kombinasjon av to like terninger og to like terninger av en annen verdi, gir samme antall poeng som antall øyne på terningen som inngår i paret.",
    "threeOfAKind":     "Tre like: Tre like terninger, gir samme antall poeng som øyne på de like terningene.",
    "fourOfAKind":      "Fire like: Fire like terninger, gir samme antall poeng som øyne på de fire like terningene.",
    "smallStraight":    "Liten Straight: Kombinasjonen 1-2-3-4-5, gir 15 poeng.",
    "largeStraight":    "Stor Straight: Kombinasjonen 2-3-4-5-6, gir 20 poeng.",
    "fullHouse":        "Hus: Kombinasjonen av tre like terninger og to like terninger av en annen verdi. Gir samme antall poeng som øyne.",
    "chance":           "Vilkårlig kombinasjon, gir samme antall poeng som øyne.",
    "yahtzee":          "YATZY: Fem like terninger, gir 50 poeng."
};
Game.prototype = {
    roll : function() {
        if (this.currentRoundNr < maxRounds) {
            this.rounds[this.currentRoundNr] = new Round();
            try {
                this.rounds[this.currentRoundNr].roll();
                this.currentRoundNr++;
            }
            catch(err) {
                throw err;
            }
    
        }
        else {
            throw "Du har sløst bort alle rundene dine!";
        }
    },
    updateSums : function() {
        this.updateUpperSum();
        this.updateBonus();
        this.updateLowerSum();
    },
    updateUpperSum : function() {
        this.upperSum =
        this.faceArray.aces.face.score
        + this.faceArray.twos.face.score
        + this.faceArray.threes.face.score
        + this.faceArray.fours.face.score
        + this.faceArray.fives.face.score
        + this.faceArray.sixes.face.score;
    },
    updateBonus : function() {
        if (this.upperSum > 62) {
            this.bonus = 50;
        }
    },
    updateLowerSum : function() {
        this.lowerSum = this.upperSum 
        + this.bonus
        + this.faceArray.onePair.face.score
        + this.faceArray.twoPair.face.score
        + this.faceArray.threeOfAKind.face.score
        + this.faceArray.fourOfAKind.face.score
        + this.faceArray.smallStraight.face.score
        + this.faceArray.largeStraight.face.score
        + this.faceArray.fullHouse.face.score
        + this.faceArray.chance.face.score
        + this.faceArray.yahtzee.face.score;
    }
};

function Round() {
    this.throwing = 0; 
    this.dice = new Array(new Die(), new Die(), new Die(), new Die(), new Die()); 
    this.booked = false; 
}
Round.prototype.roll = function() {
    if(this.throwing < maxThrowings) {
        for (var i = 0; i < 5; i++) {
            if (!this.dice[i].locked) {
                
                
                var random = Math.random();
                var zeroToFive = Math.floor(random*6);
                var oneToSix = zeroToFive + 1;
                this.dice[i].amount = oneToSix;
            }
        }
        this.throwing++; 
    }
    else {
        throw "Du får bare kaste tre ganger!";
    
    }
};
function Die() {
    this.amount = 0;
    this.locked = false; 
}

// faces
function Face() { 
    this.score = 0; 
    this.potential = 0; 
    this.reported = false;
}
Face.prototype = { 
    report: function() {
        this.score = this.potential;
        this.potential = 0;
        this.reported = true;
    }
};

//helpers
function getSumOf(diceArray, faceNumber) {
    var sum = 0;
    for (var i = 0; i < 5; i++) {
        if (diceArray[i].amount == faceNumber) {
            sum += faceNumber;
        }
    }
    return sum;
}
function getQuantityOf(diceArray, faceNumber) {
    var quantity = 0;
    for (var i = 0; i < 5; i++) {
        //alert("inne i getQuantity → for");
        if (diceArray[i].amount == faceNumber) {
            quantity++;
        }
    }
    return quantity;
}
function Aces() {
    this.face = new Face();
}
Aces.prototype.updatePotential = function(dice) {
    this.face.potential = getSumOf(dice, 1);
};
function Twos() {
    this.face = new Face();
}
Twos.prototype.updatePotential = function(dice) {
    this.face.potential = getSumOf(dice, 2);
}
function Threes() {
    this.face = new Face();
}
Threes.prototype = {
    updatePotential : function(dice) {
        this.face.potential = getSumOf(dice, 3);
    }
};
function Fours() {
    this.face = new Face();
}
Fours.prototype.updatePotential = function(dice) {
    this.face.potential = getSumOf(dice, 4);
};
function Fives() {
    this.face = new Face();
}
Fives.prototype.updatePotential = function(dice) {
    this.face.potential = getSumOf(dice, 5);
}
function Sixes() {
    this.face = new Face();
}
Sixes.prototype.updatePotential = function(dice) {
    this.face.potential = getSumOf(dice, 6);
}
function OnePair() {
    this.face = new Face();
}
OnePair.prototype = {
    updatePotential: function(dice) {
        //get a pair of the same dice with the highest score
        var counter = 0;
        for (var i = 1; i <= 6; i++) {
            if (getQuantityOf(dice, i) >= 2) {
                //begin with 1 and go to 6 in order to get the highest possible
                this.face.potential = i * 2;
                counter++;
                //there can be only two pairs with same dice from five dice
                if (counter >= 2) {
                    break;
                }
            }
        }
    }
};
function TwoPair() {
    this.face = new Face();
}
TwoPair.prototype.updatePotential = function(dice) {
    var counter = 0;
    var sum = 0;
    for (var i = 1; i <= 6; i++) {
        if (getQuantityOf(dice, i) >= 2) {
            sum += i * 2;
            counter++;
            if (counter == 2) { 
                this.face.potential = sum;
                break;
            }
        }
    }
};
function ThreeOfAKind() {
    this.face = new Face();
}
ThreeOfAKind.prototype.updatePotential = function(dice) {
    for (var i = 1; i <= 6; i++) {
        if (getQuantityOf(dice, i) >= 3) {
            this.face.potential = i * 3;
            break;
        }
    }
}
function FourOfAKind() {
    this.face = new Face();
}
FourOfAKind.prototype.updatePotential = function(dice) {
    for (var i = 1; i <= 6; i++) {
        if (getQuantityOf(dice, i) >= 4) {
            this.face.potential = i * 4;
            break;
        }
    }
}
function SmallStraight() {
    this.face = new Face();
}
SmallStraight.prototype.updatePotential = function(dice) {
    if( (getQuantityOf(dice, 1) == 1)
        && (getQuantityOf(dice, 2) == 1)
        && (getQuantityOf(dice, 3) == 1)
        && (getQuantityOf(dice, 4) == 1)
        && (getQuantityOf(dice, 5) == 1)) {
        this.face.potential = 15;
    }
}
function LargeStraight() {
    this.face = new Face();
}
LargeStraight.prototype.updatePotential = function(dice) {
    if( (getQuantityOf(dice, 2) == 1)
        && (getQuantityOf(dice, 3) == 1)
        && (getQuantityOf(dice, 4) == 1)
        && (getQuantityOf(dice, 5) == 1)
        && (getQuantityOf(dice, 6) == 1)) {
        this.face.potential = 20;
    }
}
function FullHouse() {
    this.face = new Face();
}
FullHouse.prototype = {
    updatePotential: function(dice) {
        var counter = 0;
        var sum = 0;
        for (var i = 1; i <= 6; i++) {
            if (getQuantityOf(dice, i) == 2) {
                sum += i * 2;
                counter++;
            }
            if (getQuantityOf(dice, i) == 3) {
                sum += i * 3;
                counter++;
            }
        }
        if (counter == 2) {
            this.face.potential = sum;
        }
    }
}
function Chance() {
    this.face = new Face();
}
Chance.prototype = {
    updatePotential :  function(dice) {
        
        this.face.potential = 0;
        for (var i = 0; i < 5; i++) {
            this.face.potential += dice[i].amount;
        }
    }
};
function Yahtzee() {
    this.face = new Face();
}
Yahtzee.prototype = {
    updatePotential : function(dice) {
        if( (getQuantityOf(dice, 1) == 5)
            || (getQuantityOf(dice, 2) == 5)
            || (getQuantityOf(dice, 3) == 5)
            || (getQuantityOf(dice, 4) == 5)
            || (getQuantityOf(dice, 5) == 5)
            || (getQuantityOf(dice, 6) == 5)) {
            this.face.potential = 50;
        }
    }
};