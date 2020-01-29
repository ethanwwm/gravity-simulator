import React, { useState } from "react";
import "./App.css";
import Fade from "react-reveal/Fade";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import CountUp from "react-countup";

const Title = () => {
  return (
    <div className="title-div">
      <h1 className="title">GRAVITY</h1>
      <p className="credits">Credits to Christopher Lis for the gravity algorithm.</p>
    </div>
  );
};

function App() {
  const canvas = document.querySelector("canvas");
  const c = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];
  let earthGravity = 0.97;
  const [gravity, setGravity] = useState(0.97);
  const [gravityCountup, setGravityCountup] = useState(9.8);
  let yFriction = 0.7;
  let xFriction = 0.3;
  let ballArray = [];
  let animationFrame;

  let earth = [
    { name: "1", y: 4.9 },
    { name: "2", y: 19.6 },
    { name: "3", y: 44.1 }
  ];

  let sun = [
    { name: "1", y: 137 },
    { name: "2", y: 548 },
    { name: "3", y: 1233 }
  ];

  let pluto = [
    { name: "1", y: 0.31 },
    { name: "2", y: 1.24 },
    { name: "3", y: 2.79 }
  ];

  let uranus = [
    { name: "1", y: 4.4 },
    { name: "2", y: 17.7 },
    { name: "3", y: 39.9 }
  ];

  const [planet, setPlanet] = useState(earth);

  function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
  }

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
  // Implementation

  function init() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    let radius = 30;
    for (let i = 0; i < 400; i++) {
      let radius = randomIntFromRange(10, 30);
      let x = randomIntFromRange(0, canvas.width - radius / 2);
      let y = randomIntFromRange(0, canvas.height / 2 - radius);
      let dx = randomIntFromRange(-2, 2);
      let dy = randomIntFromRange(-2, 2);
      let color = randomColor(colors);
      ballArray.push(new Ball(x, y, dx, dy, radius, color));
    }
  }

  function animate() {
    animationFrame = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    ballArray.forEach(ball => {
      ball.update();
    });
  }

  function clearCanvas(planetGravity) {
    console.log(planetGravity);
    cancelAnimationFrame(animationFrame);
    c.clearRect(0, 0, canvas.width, canvas.height);
    setGravity(earthGravity * planetGravity);
    console.log(gravity);
    ballArray = [];
    init();
    animate();
  }

  const Chart = () => {
    return (
      <React.Fragment>
        <div className="chart-div">
          <Fade>
            <LineChart
              width={600}
              height={300}
              data={planet}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="0 0 " />
              <XAxis dataKey="name" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Line type="monotone" dataKey="y" stroke="#FFFFFF" />
            </LineChart>
            <div className="x-axis">
              <p>Time (s)</p>
            </div>
          </Fade>
          <div className="y-axis">
            <Fade>
              <p>Total distance travelled (m)</p>
            </Fade>
          </div>
        </div>
        <div className="counter">
          <CountUp delay={1} decimals={2} end={gravityCountup} /> m/s²
        </div>
      </React.Fragment>
    );
  };

  function handleClick(newPlanet, newGravity) {
    if (newPlanet == earth) {
      setGravityCountup(9.8);
    } else if (newPlanet == sun) {
      setGravityCountup(278);
    } else if (newPlanet == pluto) {
      setGravityCountup(0.62);
    } else {
      setGravityCountup(8.87);
    }
    setPlanet(newPlanet);
    clearCanvas(newGravity);
  }

  const Buttons = () => {
    return (
      <div className="buttons">
        <Fade cascade>
          <input
            type="button"
            className="button"
            value="Earth"
            onClick={() => {
              handleClick(earth, 1);
            }}
          />
          <input
            type="button"
            className="button"
            value="Sun"
            onClick={() => {
              handleClick(sun, 27.9);
            }}
          />
          <input
            type="button"
            className="button"
            value="Pluto"
            onClick={() => {
              handleClick(pluto, 0.06);
            }}
          />
          <input
            type="button"
            className="button"
            value="Uranus"
            onClick={() => {
              handleClick(uranus, 0.9);
            }}
          />
        </Fade>
      </div>
    );
  };

  init();
  animate();

  return (
    <React.Fragment>
      <Fade top cascade>
        <div className="title-and-button">
          <Title />
          <Buttons />
        </div>
      </Fade>
      <Chart />
    </React.Fragment>
  );
}

export default App;
