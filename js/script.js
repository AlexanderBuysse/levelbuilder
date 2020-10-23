import { arrowCodes} from './globalV/gameSetting.js';
import Vector from './classes/Vector.js';
import CanvasDisplay from './classes/Canvas.js';
import Level from './classes/Level.js';
import Block from './classes/Block.js';
import Player from './classes/Player.js';



const $canvas = document.querySelector(`.canvas`),
  ctx = $canvas.getContext(`2d`)

  let arrows;

const $canvasLevelBuilder = document.querySelector(`#canvas`),
  ctxL = $canvasLevelBuilder.getContext(`2d`),
  blocks = [];

  let mouse;
  let isLevelBuilding= true;

  let level = [];

const init = () => {
    document.querySelector(`.submit`).addEventListener(`click`, e => clickSubmitHandel(e));
    mouse = new Vector($canvasLevelBuilder.width / 2, $canvasLevelBuilder.height / 2);
    $canvasLevelBuilder.addEventListener(`click`, e => clickHandler(e));
    draw();
};

const clickSubmitHandel = e=>{
  isLevelBuilding= false;
}

const clickHandler = event => {
  mouse.x = posDecimalTen(event.clientX);
  mouse.y = posDecimalTen(event.clientY);
  if(!checkIfblock(mouse)){
    blocks.push(new Block($canvasLevelBuilder, mouse, checkWhichElement()));
  }
};

const checkIfblock=pos=>{
  let taken= false;

  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].pos.x == pos.x && blocks[i].pos.y == pos.y){
      taken=true;
    }
  }
  return taken;
}

const checkWhichElement=()=>{
  if (document.querySelector(`.wall`).checked) {
    return `lightblue`;
  } else if (document.querySelector(`.goal`).checked) {
    return `orange`;
  } else if(document.querySelector(`.enemy`).checked) {
    return `red`;
  }else{
    return `grey`;
  }
}

const posDecimalTen =pos=>{
  let strPos= pos.toString();
  let posAr= strPos.split(``);

  if (parseInt(posAr[posAr.length - 1])<=4){
    posAr[posAr.length - 1]=`0`;
  }else{
    posAr[posAr.length - 1] = `0`;
    if (posAr[posAr.length - 2]===`9`){
      posAr[posAr.length - 2] = 0;
      posAr[posAr.length - 3]= parseInt(posAr[posAr.length - 3])+1;
    }else{
      posAr[posAr.length - 2] =parseInt(posAr[posAr.length - 2])+1;
    }
  }
  return parseInt(posAr.join(``));
}


const draw = () => {
  if(isLevelBuilding){
    ctxL.fillStyle = `black`;
    ctxL.fillRect(0, 0, $canvasLevelBuilder.width, $canvasLevelBuilder.height);
    blocks.forEach(block => block.draw());
    window.requestAnimationFrame(draw);
  }else{
    let newPlan=[];
    for (let y = 0; y < 50; y++) {
      let lineY=[];
      for (let x = 0; x < 50; x++) {
        let lineX=[];
        blocks.forEach(block=>{
          if (block.pos.x==x*10&&block.pos.y==y*10){
            if(block.color==`orange`){
              lineX.push(`o`);
            } else if (block.color == `grey`) {
              lineX.push(`@`);
            } else if(block.color == `red`){
              lineX.push(`v`);
            }else{
              lineX.push(`x`);
            }
          }
        })
        
        if ( lineX.length ==0) {
          lineX.push(` `);
        }
        lineY.push(lineX);    
      }
      newPlan.push(lineY.join(``));
    }
    level.push(newPlan);

    arrows = trackKeys(arrowCodes);
    runGame(level, CanvasDisplay);
  }
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
