var startTime;
var endGame = false;
getMaxScore();

//Variables
{
  var width = "350";
  var height = "400";
  var canvasId = "gameCanvas";
  var fontSize = 20;
  var nextlocAdd = 70;
  var nextlocinit = 50;
  var useColors = ["Red", "Green", "Blue", "Gold", "Chocolate"];
  var padding = 30;
}

modeSetup("mode1", 1);
modeSetup("mode2", 2);

// Setup Modes
function modeSetup(id, modeVal) {
  var modecanvas = document.getElementById(id);
  modecanvas.width = width;
  modecanvas.height = padding * 2 + fontSize + 10;
  var modecontext = modecanvas.getContext('2d');
  modecontext.fillStyle = "#eee";
  modecontext.fillRect(0, 0, width, nextlocinit * 2 + fontSize + 10);
  modecontext.font = fontSize + 'px sans-serif';
  modecontext.fillStyle = (modeVal == 1) ? colourNameToHex("chocolate") : colourNameToHex("red");
  modecontext.fillRect(width - modecontext.measureText("Red").width - padding - 5, padding, modecontext.measureText("Red").width + 20, fontSize + 10);
  modecontext.strokeStyle = colourNameToHex("chocolate");
  modecontext.lineWidth = 1;
  modecontext.strokeRect(padding, padding, modecontext.measureText("Red").width + 20, fontSize + 10);
  modecontext.fillStyle = colourNameToHex("chocolate");
  modecontext.fillText("Red", padding + 10, padding + fontSize + fontSize / 33);
  modecontext.beginPath();
  var Xdist = 130;
  var Ydist = padding + 5;
  modecontext.lineWidth = 2;
  modecontext.moveTo(Xdist + 20, Ydist + 5);
  modecontext.lineTo(Xdist + 20, Ydist + (fontSize - 5) + 5);
  modecontext.lineTo(Xdist + 50, Ydist + (fontSize - 5) + 5);
  modecontext.lineTo(Xdist + 50, Ydist + (fontSize - 5) + 5 + 10);
  modecontext.lineTo(Xdist + 90, Ydist + (fontSize - 5) / 2 + 5);
  modecontext.lineTo(Xdist + 50, Ydist - 5);
  modecontext.lineTo(Xdist + 50, Ydist + 5);
  modecontext.lineTo(Xdist + 20, Ydist + 5);
  modecontext.stroke();
}

//codeVariables
{
  grabbed = false;
  grabbedIndex = 0;
  grabloc = {
    "x": 0,
    "y": 0
  };
  var atexts = [];
  var cboxes = [];
  var maxWidth = 0;
  var offsetX;
  var offsetY;
  var context;
  var gameMode;
  var won;
}

function startGame() {
  if (document.fullscreenEnabled) {
    document.documentElement.requestFullscreen();
  }

  { //initiating
    //UI Changes
    document.getElementById("rules").style.display = "none";
    document.getElementById("btn").style.display = "none";
    document.getElementById(canvasId).style.display = "inline";
    document.getElementById("btn1").style.display = "inline";
    gameMode = Math.floor((Math.random() * 2) + 1);
    document.getElementById("hrules" + gameMode.toString()).style.display = "inline-block";

    document.getElementById("demo").style.display = "inline";
    modeSetup("demo", gameMode)

    //initSetup
    var canvas = document.getElementById(canvasId);
    canvas.width = width;
    canvas.height = height;
    var canvasOffset = {
      "top": document.getElementById(canvasId).offsetTop,
      "left": document.getElementById(canvasId).offsetLeft
    };
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;
    context = canvas.getContext('2d');

    setup();
    draw();
    startTime();
  }
}

function setup() {
  var dupUseColors = useColors.slice();
  useColors.forEach(function (color) {
    var randcolor = Math.floor(Math.random() * dupUseColors.length);
    atexts.push({
      "data": color,
      "color": colourNameToHex(dupUseColors[randcolor])
    });
    dupUseColors.splice(randcolor, 1);
  });
  var nextloc = nextlocinit;
  context.font = fontSize + 'px sans-serif';

  atexts.forEach(function (atext, index) {
    atext.dim = {
      "posX": padding,
      "posY": nextloc,
      "width": context.measureText(atext.data).width + 20,
      "height": fontSize + 10
    };
    if (maxWidth < context.measureText(atext.data).width + 20) {
      maxWidth = context.measureText(atext.data).width + 20;
    }
    nextloc += nextlocAdd;
  });
  var dupUseColors = useColors.slice();

  var nextloc = nextlocinit;
  atexts.forEach(function (atext) {
    var randcolor = Math.floor(Math.random() * dupUseColors.length);
    cboxes.push({
      "posX": width - maxWidth - padding - 5,
      "posY": nextloc,
      "width": maxWidth,
      "height": fontSize + 15,
      "color": colourNameToHex(dupUseColors[randcolor])
    });
    nextloc += nextlocAdd;
    dupUseColors.splice(randcolor, 1);
  });


}

function draw() {
  //Setting Background
  context.fillStyle = "#eee";
  context.fillRect(0, 0, width, height);


  //Draw Receiveable Blocks
  cboxes.forEach(function (cbox, index) {
    context.fillStyle = cbox.color;
    context.fillRect(cbox.posX, cbox.posY, cbox.width, cbox.height);
    if (cboxHasABox(cbox).has) {
      context.fillStyle = "#00000055";
      context.fillRect(cbox.posX, cbox.posY, cbox.width, cbox.height);
    }
  });

  //Draw Coloured Names
  context.font = fontSize + 'px sans-serif';
  atexts.forEach(function (atext, index) {
    if (grabbed && index == grabbedIndex) {
      context.strokeStyle = "#FFFFFF";
      context.lineWidth = 5;
    } else {
      context.strokeStyle = atext.color;
      context.lineWidth = 1;
    }
    context.strokeRect(atext.dim.posX, atext.dim.posY, atext.dim.width, atext.dim.height);
    context.fillStyle = atext.color;
    context.fillText(atext.data, atext.dim.posX + 10, atext.dim.posY + fontSize + fontSize / 33);
  });

  if (endGame) {
    console.log(endGame);
    context.fillStyle = "#00000022";
    context.fillRect(0, 0, width, height);
    if (won) {

      context.fillStyle = "#ffffff";
      context.fillText("New Highscore 🏆🏆", padding, padding);
    } else {
      context.fillStyle = "#ffffff";
      context.fillText("You Missed the HighScore 😱", padding, padding);
      context.fillText("Be Quick Next time 💨", padding, padding + fontSize + 10);
    }
  }
}

//input Handelers
{
  function mousedown(e) {
    if (!endGame) {
      handleMouseDown(e);
    }
  };

  function mousemove(e) {
    if (!endGame) {
      handleMouseMove(e);
    }
  };

  function mouseup(e) {
    if (!endGame) {
      handleMouseUp(e);
    }
  };

  function mouseout(e) {
    if (!endGame) {
      handleMouseOut(e);
    }
  };
}

//timer and Finish Checker
function startTime() {
  startTime = Date.now();
  var timer = setInterval(function () {
    var difftime = Date.now();
    var diff = difftime - startTime;
    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    document.getElementById("time").innerHTML = (get2D(mm) + ":" + get2D(ss) + ":" + get2D(msec));

    if (gameMode == 1) {
      var allhas = true;
      cboxes.forEach(function (cbox, index) {
        var t = cboxHasABox(cbox);
        if (t.has) {
          if (atexts[t.index].color != cbox.color) {
            allhas = false;
          }
        } else {
          allhas = false;
        }
      });
    } else {
      var allhas = true;
      cboxes.forEach(function (cbox, index) {
        var t = cboxHasABox(cbox);
        if (t.has) {
          if (colourNameToHex(atexts[t.index].data) != cbox.color) {
            allhas = false;
          }
        } else {
          allhas = false;
        }
      });
    }

    if (allhas) {
      endGame = true;
      won = setMaxScore(diff);
      draw();
      clearInterval(timer);
    }
  }, 100);
}

//Helper Functions
function handleMouseDown(e) {
  console.log("mousedown");
  canMouseX = parseInt(e.clientX - offsetX);
  canMouseY = parseInt(e.clientY - offsetY);
  atexts.forEach(function (atext, index) {
    console.log("mousedown loop");
    if (isInBox(e, atext)) {
      document.getElementById(canvasId).style.cursor = 'grab';
      grabbedIndex = index;
      grabbed = true;
      console.log("setGrabbed True");
      grabloc = {
        "x": canMouseX - atext.dim.posX,
        "y": canMouseY - atext.dim.posY,
      };
      console.log(grabloc);
    }
  });

}

function handleMouseUp(e) {
  console.log("mouseup");
  canMouseX = parseInt(e.clientX - offsetX);
  canMouseY = parseInt(e.clientY - offsetY);

  console.log("setGrabbed mouseUp");
  grabbed = false;
}

function handleMouseMove(e) {
  console.log("mousemove");
  canMouseX = parseInt(e.clientX - offsetX);
  canMouseY = parseInt(e.clientY - offsetY);
  console.log("mouseX: ", canMouseX)
  console.log("mouseY: ", canMouseY)
  // setting cursor to converted over box
  if (!grabbed) {
    var isgrab = false;
    atexts.forEach(function (atext) {
      if (isInBox(e, atext)) {
        document.getElementById(canvasId).style.cursor = 'grab';
        isgrab = true;
      }
    });

    if (!isgrab) {
      document.getElementById(canvasId).style.cursor = 'auto';
    }
  } else {
    atexts[grabbedIndex].dim.posX = canMouseX - grabloc.x;
    atexts[grabbedIndex].dim.posY = canMouseY - grabloc.y;
  }
  draw();
}

function handleMouseOut(e) {
  console.log("mouseoput");
  handleMouseUp(e);
}

function isInBox(e, atext) {
  canMouseX = parseInt(e.clientX - offsetX);
  canMouseY = parseInt(e.clientY - offsetY);
  if (canMouseX > atext.dim.posX && canMouseX < atext.dim.posX + atext.dim.width && canMouseY > atext.dim.posY && canMouseY < atext.dim.posY + atext.dim.height) {
    return true;
  }
  return false;
}

function cboxHasABox(cbox) {
  var toReturn = false;
  var toReturnIndex = 0;
  atexts.forEach(function (atext, index) {
    if (atext.dim.posX > cbox.posX && atext.dim.posX < cbox.posX + cbox.width && atext.dim.posY > cbox.posY && atext.dim.posY < cbox.posY + cbox.height) {
      toReturn = true;
      toReturnIndex = index;
    }
    if (atext.dim.posX > cbox.posX && atext.dim.posX < cbox.posX + cbox.width && atext.dim.posY + atext.dim.height > cbox.posY && atext.dim.posY + atext.dim.height < cbox.posY + cbox.height) {
      toReturn = true;
      toReturnIndex = index;
    }
    if (atext.dim.posX + atext.dim.width > cbox.posX && atext.dim.posX + atext.dim.width < cbox.posX + cbox.width && atext.dim.posY > cbox.posY && atext.dim.posY < cbox.posY + cbox.height) {
      toReturn = true;
      toReturnIndex = index;
    }
    if (atext.dim.posX + atext.dim.width > cbox.posX && atext.dim.posX + atext.dim.width < cbox.posX + cbox.width && atext.dim.posY + atext.dim.height > cbox.posY && atext.dim.posY + atext.dim.height < cbox.posY + cbox.height) {
      toReturn = true;
      toReturnIndex = index;
    }
  });
  return {
    "has": toReturn,
    "index": toReturnIndex
  };
}

function setMaxScore(score) {
  if (getCookie("et") == "") {
    setCookie("et", score.toString(), 50);
    return true;
  } else {
    if (score < parseInt(getCookie("et"))) {
      setCookie("et", score.toString(), 50);
      getMaxScore();
      return true;
    }
  }
  return false;
}

function colourNameToHex(colour) {
  var colours = {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "black": "#000000",
    "blanchedalmond": "#ffebcd",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "gray": "#808080",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred ": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgrey": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370d8",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "navy": "#000080",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#d87093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "rebeccapurple": "#663399",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32"
  };

  if (typeof colours[colour.toLowerCase()] != 'undefined')
    return colours[colour.toLowerCase()];

  return false;
}

function get2D(num) {
  if (num.toString().length < 2) {
    return "0" + num;
  }
  if (num.toString().length > 2) {
    return num.toString().substring(0, 2);
  }
  return num.toString();
}

function getMaxScore() {
  if (getCookie("et") != "") {
    var msec = getCookie("et");
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    document.getElementById("score").innerHTML = (get2D(mm) + ":" + get2D(ss) + ":" + get2D(msec));
  }
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}