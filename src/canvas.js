import utils from "./utils";
import React, { useState } from "react";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];
// const [gravity, setGravity] = useState(2);
var gravity = 2;
var yFriction = 0.9;
var xFriction = 0.3;

// Objects
class Ball {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.stroke();
    c.closePath();
  }

  update() {
    if (this.y + this.radius + this.dy > canvas.height) {
      this.dy = -this.dy * yFriction;
    } else {
      this.dy += gravity;
    }

    if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius <= 0)
      this.dx = -this.dx * 0.6;

    this.x += this.dx * xFriction;
    this.y += this.dy;
    this.draw();
  }
}
var ballArray = [];
// Implementation
let objects;
function init() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  objects = [];
  var radius = 30;
  for (let i = 0; i < 400; i++) {
    var radius = utils.randomIntFromRange(10, 30);
    var x = utils.randomIntFromRange(0, canvas.width - radius / 2);
    var y = utils.randomIntFromRange(0, canvas.height / 2 - radius);
    var dx = utils.randomIntFromRange(-2, 2);
    var dy = utils.randomIntFromRange(-2, 2);
    var color = utils.randomColor(colors);
    ballArray.push(new Ball(x, y, dx, dy, radius, color));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  ballArray.forEach(ball => {
    ball.update();
  });
}

export function addListener(status = false) {
  if (status) {
    // ReactDOM.render(element, document.getElementById('root'));
    document.getElementById("clear").addEventListener(
      "click",
      function() {
        c.clearRect(0, 0, canvas.width, canvas.height);
      },
      false
    );
  }
}

init();
animate();
