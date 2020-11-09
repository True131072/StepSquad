function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  this.score = 0;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 590295810358705700000) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  var outputtext = new Array();
  outputtext[0] = "0";
  outputtext[1] = "1";
  outputtext[2] = "3";
  outputtext[3] = "6";
  outputtext[4] = "10";
  outputtext[5] = "15";
  outputtext[6] = "21";
  outputtext[7] = "28";
  outputtext[8] = "36";
  outputtext[9] = "45";
  outputtext[10] = "55";
  outputtext[11] = "66";
  outputtext[12] = "78";
  outputtext[13] = "91";
  outputtext[14] = "105";
  outputtext[15] = "120";
  outputtext[16] = "136";
  outputtext[17] = "153";
  outputtext[18] = "171";
  outputtext[19] = "190";
  outputtext[20] = "210";
  outputtext[21] = "231";
  outputtext[22] = "253";
  outputtext[23] = "276";
  outputtext[24] = "300";
  outputtext[25] = "325";
  outputtext[26] = "351";
  outputtext[27] = "378";
  outputtext[28] = "406";
  outputtext[29] = "435";
  outputtext[30] = "465";
  outputtext[31] = "496";
  outputtext[32] = "528";
  outputtext[33] = "561";
  outputtext[34] = "595";
  outputtext[35] = "630";
  outputtext[36] = "666";
  outputtext[37] = "703";
  outputtext[38] = "741";
  outputtext[39] = "780";
  outputtext[40] = "820";
  outputtext[41] = "861";
  outputtext[42] = "903";
  outputtext[43] = "946";
  outputtext[44] = "990";
  outputtext[45] = "1035";
  outputtext[46] = "1081";
  outputtext[47] = "1128";
  outputtext[48] = "1176";
  outputtext[49] = "1225";
  outputtext[50] = "1275";
  outputtext[51] = "1326";
  outputtext[52] = "1378";
  outputtext[53] = "1431";
  outputtext[54] = "1485";
  outputtext[55] = "1540";
  outputtext[56] = "1596";
  outputtext[57] = "1653";
  outputtext[58] = "1711";
  outputtext[59] = "1770";
  outputtext[60] = "1830";
  outputtext[61] = "1891";
  outputtext[62] = "1943";
  outputtext[63] = "2006";
  outputtext[64] = "2070";
  outputtext[65] = "2135";
  outputtext[66] = "2201";
  outputtext[67] = "2268";
  outputtext[68] = "2336";
  outputtext[69] = "2405";
  outputtext[70] = "2475";

  inner.classList.add("tile-inner");
  inner.textContent = outputtext[(Math.log(tile.value) / Math.LN2)] || '';

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
