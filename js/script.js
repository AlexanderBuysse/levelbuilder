import { arrowCodes} from './globalV/gameSetting.js';
import Vector from './classes/Vector.js';
import Particle from './classes/Particle.js';
import CanvasDisplay from './classes/Canvas.js';
import Enemy from './classes/Enemy.js';
import Goal from './classes/Goal.js';
import Level from './classes/Level.js';
import Block from './classes/Block.js';
import Player from './classes/Player.js';



/*const $canvas = document.querySelector(`.canvas`),
  ctx = $canvas.getContext(`2d`)

  let arrows;*/

const $canvasLevelBuilder = document.querySelector(`#canvas`),
  ctxL = $canvasLevelBuilder.getContext(`2d`),
  blocks = [];

  let mouse;

const level = [[
  `                                 xxxxxxxxxx                                  `,
  `      xxxxxxxxxxxxxxxxxxxxxxxxxxxx   o    xxxxxxxxxxxxxxxxxxxxxxxxxx         `,
  `      x   v                      x        x                  v  v  x         `,
  `      x                                                            x         `,
  `      x                                                            x         `,
  `      x      xxxxxxxxxxxxxxx                       xxxxxxxxxx      x         `,
  `      x                    xxxxxxxxxxxxxxxxxxxxxxxxx               x         `,
  `      x                    x                       x               xxxxxxxx  `,
  `      xxxxxxxxxxxxxxx      x                       x               x!!!!!!x  `,
  `      x                    x                       xxxxxxxxxx      x      x  `,
  `      x                    x      x       x                 x      x      x  `,
  `      x      x             x      x       x                 x      x      x  `,
  `      x      x             x      x       x                 x      x      x  `,
  `      x      x   xxxxxxxxxxx      x       xxxxxxxxxxxx      x             x  `,
  `      x      x   x                x                  x      x             x  `,
  `      x      x   x                x                  x      x             x  `,
  `      x      x|||x                x                  x      x      x      x  `,
  `  xxxxx      xxxxx         xxxxxxxx       xxxxxxx    x             x      x  `,
  `  x                               x       x     x    x             x      x  `,
  `  x                               x   @   x          x             x      x  `,
  `  x                               x       x          x         |  |x||||||x  `,
  `  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  `,
  `                                                                             `,
  `                                                                             `,
  `                                                                             `,
  `                                                                             `,
  `                                                                             `,
  `                                                                                `
  ]];

const init = () => {
  mouse = new Vector($canvasLevelBuilder.width / 2, $canvasLevelBuilder.height / 2);
  //$canvas.addEventListener(`click`, event => clickHandler(event));
  $canvasLevelBuilder.addEventListener(`mousedown`, event => mouseDownHandler(event));
  $canvasLevelBuilder.addEventListener(`mouseup`, event => mouseUpHandler(event));
  draw();
  //arrows = trackKeys(arrowCodes);
  //runGame(level, CanvasDisplay);

};

const mouseDownHandler = event => {
  console.log(event)
  $canvasLevelBuilder.addEventListener(`mousemove`, event => mousemoveHandler(event));
};

const mouseUpHandler = event => {
  console.log(event)
  $canvasLevelBuilder.addEventListener(`mousemove`, event => mousemoveHandler(event));
};

const mousemoveHandler = event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  blocks.push(new Block($canvasLevelBuilder, mouse));
}

const resize = event => {
  $canvasLevelBuilder.width = window.innerWidth;
  $canvasLevelBuilder.height = window.innerHeight;
};

const draw = () => {
  ctxL.fillStyle = `black`;
  ctxL.fillRect(0, 0, $canvasLevelBuilder.width, $canvasLevelBuilder.height);
  blocks.forEach(block => block.draw());
  window.requestAnimationFrame(draw);
};



const trackKeys = codes => {
  let pressed = {};
  const handler = event => {
    if (codes.hasOwnProperty(event.keyCode)) {
      let down = event.type == `keydown`;
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  };
  addEventListener(`keydown`, handler);
  addEventListener(`keyup`, handler);
  return pressed;
};

const runAnimation = frameFunc => {
  let lastTime = null;
  const frame = time => {
    let stop = false;
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop) {
      requestAnimationFrame(frame);
    }
  };
  requestAnimationFrame(frame);
};

const runLevel = (level, Display, andThen) => {
  let display = new Display(level, $canvas, ctx);
  runAnimation(function (step) {
    //console.log(step);
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();
      if (andThen) {
        andThen(level.status);
      }
      return false;
    }
  });
};

const runGame = (plans, Display) => {
  const startLevel = n => {
    runLevel(new Level(plans[n]), Display, status => {
      if (status == `lost`) {
        const $buttonretry = document.querySelector(`.retry`)
        const buttonRetryHandler = e => {
          e.preventDefault
          startLevel(plans[n])
        }
        $buttonretry.addEventListener(`click`, buttonRetryHandler)
      } else if (n < plans.length - 1) {
        startLevel(n + 1);
      } else {
        const $title = document.querySelector(`.title`);
        const $buttonretry = document.querySelector(`.retry`);
        $buttonretry.textContent = ``;
        $title.textContent=`You win`;
        console.log(`You win!`);
      }
    });
  };

  startLevel(0);
};


init();
