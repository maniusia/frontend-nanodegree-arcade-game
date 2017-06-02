/** Global */
'use strict;';
var MAP = {
    row: [0, 83, 166, 249, 332, 415],
    col: [0, 101, 202, 303, 404, 505]
};

var PLAYER_START = {
    row: 5,
    col: 3
};

var SPRITE_WIDTH = 101,
    SPRITE_HEIGHT = 83,
    ENEMY_COUNT = 3,
    GEM_COUNT = 1;

var allEnemies = [];

var allGems = [];

// ******** Score Class ********

var Score = function(x, y) {
    this.x = x;
    this.y = y;
    this.points = 0;
};

// Displays score

Score.prototype.render = function() {
    var x = 210;
    ctx.clearRect(x, 0, 200, 50);
    ctx.font = "20px Verdana";
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + this.points, x, 30);
};

Score.prototype.reset = function() {
    this.points = 0;
};

// ******** Gem class ********

var Gem = function(row, x, speed) {
    this.sprite = 'images/Gem Orange.png';
    this.row = row - 1;
    this.x = x;
    this.y = MAP.row[this.row] - 20;
    this.speed = speed;
    this.scoreImpact = 1;

};

// ******** Updates gem position ********

Gem.prototype.update = function(dt) {
    if (this.x <= ctx.canvas.width) {
        this.x += dt * this.speed;
    } else {
        this.reset();
    }

    // check for player collision

    if (this.row === player.row) {
        var cells = this.getLocation();
        for (var cell in cells) {
            if (player.col === cells[cell].col) {
                score.points += this.scoreImpact;
                this.reset();

                // displays win message

                if (score.points === 15) {
                    alert("YOU WIN, CONGRATULATIONS!");
                    document.location.reload();
                }
            }

        }
    }
};


// Draws gems on screen

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Gets gems location

Gem.prototype.getLocation = function() {
    var cells = [];
    var gemRightEdge = this.x + SPRITE_WIDTH;

    // locate the cell where the gems left edge is located
    // if enemy is off the screen then do not run through the loop

    if (this.x < MAP.col[MAP.col.length - 1] && gemRightEdge > 0) {
        for (var columns = 1; columns < MAP.col.length; columns++) {
            if (this.x < MAP.col[columns]) {
                var section = {};
                section.row = this.row;
                section.col = columns + 1;
                cells.push(section);
                break;
            }
        }

        // locate the cell where the gems right edge is located

        if (gemRightEdge > MAP.col[0] && gemRightEdge < MAP.col[MAP.col.length - 1]) {
            for (var column = 1; column < MAP.col.length; column++) {
                if (gemRightEdge < MAP.col[column]) {
                    var cell = {};
                    cell.row = this.row;
                    cell.col = column - 1;
                    cells.push(cell);
                    break;
                }
            }
        }
    }

    return cells;
};

// Reset the gems locations

Gem.prototype.reset = function() {
    this.x = Math.floor((Math.random() * (-500)) - SPRITE_WIDTH);
    this.row = (Math.floor((Math.random() * 3) + 2)) - 1;
    this.y = MAP.row[this.row] - 20;
};



// ******** Enemy Class ********

var Enemy = function(row, x, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.row = row - 1;
    this.x = x;
    this.y = MAP.row[this.row] - 20;
    this.speed = speed;
};

// updates enemy position

Enemy.prototype.update = function(dt) {
    if (this.x <= ctx.canvas.width) {
        this.x += dt * this.speed;
    } else {
        this.reset();
    }

    // check for player collision

    if (this.row === player.row) {
        var cells = this.getLocation();
        for (var cell in cells) {
            if (player.col === cells[cell].col) {
                player.reset();

                break;
            }
        }
    }
};

// Draws enemy on screen

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Gets enemy location

Enemy.prototype.getLocation = function() {
    var cells = [];
    var enemyRightEdge = this.x + SPRITE_WIDTH;

    // locate the cell where the enemy left edge is located
    // if enemy is off the screen then do not run through the loop

    if (this.x < MAP.col[MAP.col.length - 1] && enemyRightEdge > 0) {
        for (var column = 1; column < MAP.col.length; column++) {
            if (this.x < MAP.col[column]) {
                var cell = {};
                cell.row = this.row;
                cell.col = column - 1;
                cells.push(cell);
                break;
            }
        }

        // locate the cell where the enemy right edge is located

        if (enemyRightEdge > MAP.col[0] && enemyRightEdge < MAP.col[MAP.col.length - 1]) {
            for (var columns = 1; columns < MAP.col.length; columns++) {
                if (enemyRightEdge < MAP.col[columns]) {
                    var section = {};
                    section.row = this.row;
                    section.col = columns - 1;
                    cells.push(section);
                    break;
                }
            }
        }
    }

    return cells;
};


// Reset the enemy locations

Enemy.prototype.reset = function() {
    this.x = Math.floor((Math.random() * (-500)) - SPRITE_WIDTH);
    this.row = (Math.floor((Math.random() * 3) + 2)) - 1;
    this.y = MAP.row[this.row] - 20;
};


// ******** Player Class ********

var Player = function(row, col) {

    //Player character

    this.sprite = 'images/char-cat-girl.png';
    this.row = row - 1;
    this.col = col - 1;
    this.x = MAP.col[this.col];
    this.y = MAP.row[this.row] - 13;
    this.score = 0;
    this.move = '';

};

// Resets the player's position coordinates

Player.prototype.reset = function() {
    this.row = PLAYER_START.row - 1;
    this.col = PLAYER_START.col - 1;
    this.x = MAP.col[this.col];
    this.y = MAP.row[this.row] - 13;

};

//Updates the player location.

Player.prototype.update = function() {
    var maxWidth = MAP.col[MAP.col.length - 1];
    var maxHeight = MAP.row[MAP.row.length - 1];
    switch (this.move) {
        case 'left':
            if (this.x >= SPRITE_WIDTH) {
                this.x -= SPRITE_WIDTH;
                this.col--;
            }
            break;
        case 'right':
            if (this.x + SPRITE_WIDTH < maxWidth) {
                this.x += SPRITE_WIDTH;
                this.col++;
            }
            break;
        case 'down':
            if (this.y + SPRITE_HEIGHT < maxHeight) {
                this.y += SPRITE_HEIGHT;
                this.row++;
            }
            break;
        case 'up':
            if (this.y >= SPRITE_HEIGHT - 13) {
                this.y -= SPRITE_HEIGHT;
                this.row--;
            }
            break;
        default:
            break;
    }
    this.move = '';

    // Check if player fell in water

    if (this.row === 0) {
        this.reset();
    }
};


// Displays the player on the screen.

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Handles pressed keyboard keys.

Player.prototype.handleInput = function(key) {
    this.move = key;


};

// This instantiates the various objects

var player = new Player(PLAYER_START.row, PLAYER_START.col);
var score = new Score();
generateGems(GEM_COUNT);
generateEnemies(ENEMY_COUNT);


// ******** Additional functions ********

// Creates a number of enemies in random locations on the screen

function generateEnemies(maxEnemies) {
    for (var i = 0; i < maxEnemies; i++) {
        var row = Math.floor((Math.random() * 3) + 1);
        var leftPoint = Math.floor((Math.random() * (-500)) - SPRITE_WIDTH);
        var speed = Math.floor((Math.random() * 200) + 50);

        //generate new enemy object with a starting row, point and a set speed)

        var enemy = new Enemy(row, leftPoint, speed);
        allEnemies.push(enemy);
    }
}

// Creates a gem in random locations on the screen

function generateGems(maxGems) {
    for (var i = 0; i < maxGems; i++) {
        var row = Math.floor((Math.random() * 3) + 1);
        var leftPoint = Math.floor((Math.random() * (-500)) - SPRITE_WIDTH);
        var speed = Math.floor((Math.random() * 200) + 50);

        // Generate new gem object with a starting row, point and a set speed)

        var gem = new Gem(row, leftPoint, speed);
        allGems.push(gem);
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method.

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'pauseToggle',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

// This disables scrolling.

document.addEventListener('keydown', function(e) {
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
