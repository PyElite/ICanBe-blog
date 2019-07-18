
// WRITTEN BY TRUMAN HEBERLE
// var COLOR = "#52E6FF"
var COLOR = "#1abc9c"
var MESSAGE = document.getElementById("title-desktop").textContent || "ICanBe";

var FONT_SIZE = 40;
var AMOUNT = 2000;
var SIZE = 2;
var INITIAL_DISPLACEMENT = 500;
var INITIAL_VELOCITY = 5;
var VELOCITY_RETENTION = 0.95;
var SETTLE_SPEED = 1;
var FLEE_SPEED = 1;
var FLEE_DISTANCE = 50;
var FLEE = true;
var SCATTER_VELOCITY = 3;
var SCATTER = true;

var cw  = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
var ch = window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;
var LOCAL_X = cw -140;  // 坐标x
var LOCAL_Y = ch -100;  // 坐标y

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  // Mobile

  FONT_SIZE = 20;
  AMOUNT = 300;
  SIZE = 2;
  INITIAL_DISPLACEMENT = 100;
  SETTLE_SPEED = 1;
  FLEE = false;
  SCATTER_VELOCITY = 2;
}

const canvas_title = document.getElementById("spring-text");
const ctx = canvas_title.getContext("2d");

var POINTS = [];
var MOUSE = {
  x: 0,
  y: 0
}

function Point(x,y,r,g,b,a) {
  var angle = Math.random() * 6.28;
  this.dest_x = x;
  this.dest_y = y;
  this.original_r = r;
  this.original_g = g;
  this.original_a = a;
  this.x = LOCAL_X - x + (Math.random() - 0.5) * INITIAL_DISPLACEMENT;
  this.y = LOCAL_Y - y + (Math.random() - 0.5) * INITIAL_DISPLACEMENT;
  this.velx = INITIAL_VELOCITY * Math.cos(angle);
  this.vely = INITIAL_VELOCITY * Math.sin(angle);
  this.target_x = LOCAL_X - x;
  this.target_y = LOCAL_Y - y;
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;

  this.getX = function() {
    return this.x;
  }

  this.getY = function() {
    return this.y;
  }

  this.resetTarget = function () {
    this.target_x = LOCAL_X - this.dest_x;
    this.target_y = LOCAL_Y - this.dest_y;
  }

  this.fleeFrom = function(x, y) {
    this.velx -= ((MOUSE.x - this.x) * FLEE_SPEED / 10);
    this.vely -= ((MOUSE.y - this.y) * FLEE_SPEED / 10);
  }

  this.settleTo = function(x, y) {
    this.velx += ((this.target_x - this.x) * SETTLE_SPEED / 100);
    this.vely += ((this.target_y - this.y) * SETTLE_SPEED / 100);
    this.velx -= this.velx * (1-VELOCITY_RETENTION);
    this.vely -= this.vely * (1-VELOCITY_RETENTION);
  }

  this.scatter = function() {
    var unit = this.unitVecToMouse();
    var vel = SCATTER_VELOCITY * 10 * (0.5 + Math.random() / 2);
    this.velx = -unit.x * vel;
    this.vely = -unit.y * vel;
  }

  this.move = function() {
    if (this.distanceToMouse() <= FLEE_DISTANCE) {
      this.fleeFrom(MOUSE.x, MOUSE.y);
    }
    else {
      this.settleTo(this.target_x, this.target_y);
    }

    if (this.x + this.velx < 0 || this.x + this.velx >= canvas_title.width) {
      this.velx *= -1;
    }
    if (this.y + this.vely < 0 || this.y + this.vely >= canvas_title.height) {
      this.vely *= -1;
    }

    this.x += this.velx;
    this.y += this.vely;
  }

  this.distanceToTarget = function() {
    return this.distanceTo(this.target_x, this.target_y);
  }

  this.distanceToMouse = function() {
    return this.distanceTo(MOUSE.x, MOUSE.y);
  }

  this.distanceTo = function(x, y) {
    return Math.sqrt((x - this.x)*(x - this.x) + (y - this.y)*(y - this.y));
  }

  this.unitVecToTarget = function() {
    return this.unitVecTo(this.target_x, this.target_y);
  }

  this.unitVecToMouse = function() {
    return this.unitVecTo(MOUSE.x, MOUSE.y);
  }

  this.unitVecTo = function(x, y) {
    var dx = x - this.x;
    var dy = y - this.y;
    return {
      x: dx / Math.sqrt(dx*dx + dy*dy),
      y: dy / Math.sqrt(dx*dx + dy*dy)
    };
  }
}

window.addEventListener("resize", function() {
  resizecanvas_title()
  adjustText()
});

if (FLEE) {
  window.addEventListener("mousemove", function(event) {
    MOUSE.x = event.clientX;
    MOUSE.y = event.clientY;
  });
}

if (SCATTER) {
  window.addEventListener("click", function(event) {
    MOUSE.x = event.clientX;
    MOUSE.y = event.clientY;
    for (var i=0; i<POINTS.length; i++) {
      POINTS[i].scatter();
    }
  });
}

function resizecanvas_title() {
    canvas_title.width = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
    canvas_title.height = window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;
}

function adjustText() {
    ctx.fillStyle = COLOR;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "oblique normal normal " + FONT_SIZE + "px Arial";
    ctx.fillText(MESSAGE, LOCAL_X, LOCAL_Y);
    var textWidth = ctx.measureText(MESSAGE).width;
    if (textWidth == 0) {
        return;
    }
    var minX = LOCAL_X - textWidth/2;
    var minY = LOCAL_Y - FONT_SIZE/2;
    var data = ctx.getImageData(minX, minY, textWidth, FONT_SIZE).data;
    var isBlank = true;
    for (var i=0; i<data.length; i++) {
        if (data[i] != 0) {
            isBlank = false;
            break;
        }
    }

    if (!isBlank) {
        var count = 0;
        var curr = 0;
        var num = 0;
        var x = 0;
        var y = 0;
        var w = Math.floor(textWidth);
        POINTS = [];
        while (count < AMOUNT) {
            while (curr == 0) {
                num = Math.floor(Math.random() * data.length);
                curr = data[num];
            }
            num = Math.floor(num / 4);
            x = w/2 - num%w;
            y = FONT_SIZE/2 - Math.floor(num/w);
            POINTS.push(new Point(x,y,data[num*4],data[num*4 + 1],data[num*4 + 2],data[num*4 + 3]));
            curr = 0;
            count++;
        }
    }
}

function init() {
  resizecanvas_title()
  adjustText()
  window.requestAnimationFrame(animate);
}

function animate() {
  update();
  draw();
}

function update() {
  var point;
  for (var i=0; i<POINTS.length; i++) {
    point = POINTS[i];
    point.move();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas_title.width, canvas_title.height);

  var point;
  for (var i=0; i<POINTS.length; i++) {
    point = POINTS[i];
    ctx.fillStyle = "rgba("+point.r+","+point.g+","+point.b+","+point.a+")";
    ctx.beginPath();
    ctx.arc(point.getX(),point.getY(),SIZE,0,2*Math.PI);
    ctx.fill();
  }

  window.requestAnimationFrame(animate);
}

init();