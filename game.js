var canvas;
var ctx;
window.onload = function(){

  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.focus();

  init();
  newRow();
  newRow();
  drawMap();
  playerTurn();
}

var gameover = false;

var mouseDown = false;

var animOn = false;

var colors = ["#ddca7e","#96b38a","#809bbd","#9a8297","#d0782a"];

var score = 0;
var roundNo = 1;

var balls = [];

for (var i = 0; i < 1; i++){
  
  var ball = {x: 250,y: 630,direction: 0,addX: 0,addY: 0,no: i};
  
  balls.push(ball);
}

function init(){
  ctx.strokeStyle = "#ccc";
  ctx.fillStyle = "#ccc";
  ctx.font = "18px Verdana";

  ctx.strokeRect(10.5, 40.5, canvas.width - 20, canvas.height - 50);
}

//ctx.fillRect(20, 400, 500, 300);

function hasValue(obj, key, value) {
  return obj.hasOwnProperty(key) && obj[key] === value;
}

function drawLine(x, y, toX, toY) {

  ctx.lineWidth = 0.1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}

var boxes = [];

function newRow() {

  var amount = Math.round(Math.random() * 3) + 1;
  var row = [];

  var addBall = Math.random();

  if (addBall > 0.15) {

    var ball = {}

    ball["type"] = "addBall";
    ball["position"] = Math.round(Math.random() * 7);
    ball["durability"] = 1;

    row.push(ball);
  }

  for (var i = 0; i < amount; i++) {

    //var addBall = Math.random();
    var position = Math.round(Math.random() * 7);

    while (row.some(function(block) {
        return hasValue(block, "position", position)
      })) {
      position = Math.round(Math.random() * 7);
    }
    
    var durability = Math.round((Math.random() * roundNo) + roundNo - (roundNo / 10));
    //var durability = Math.round(Math.random() * 2 + ((boxes.length) / 2)) + 1;

    var block = {};

    block["type"] = "block";
    block["position"] = position;
    block["durability"] = durability;
    //block["color"] = colors[Math.round(Math.random()*(colors.length-1))];
      //generate random color
   //"#"+((1<<24)*Math.random()|0).toString(16);

    row.push(block);
  }
  
  //push to front of array
  boxes.unshift(row);
  //console.log(boxes);
}

function drawMap() {
  
  ctx.strokeStyle = "#ccc";
  ctx.fillStyle = "#ccc";
  
  ctx.lineWidth = 1;
  
  ctx.strokeRect(10.5, 40.5, canvas.width - 20, canvas.height - 50);
  
  ctx.fillText("Score: " + score, canvas.width - 100, 25);
  
  ctx.lineWidth = 2;
  
  var max = 0;
  var min = 1000;//boxes[0][0]["durability"];
  
   for (var d = 0; d < boxes.length; d++){
     for (var m = 0; m < boxes[d].length; m++){
       
       if (boxes[d][m]["durability"] < min){
         min = boxes[d][m]["durability"]; 
       }
       
       if (boxes[d][m]["durability"] > max){
         max = boxes[d][m]["durability"];
       }
     }
   }
  
  var tierStep = (max-min) / colors.length;
  //var colorTiers = {tierStep: colors[0], tierStep:};

  console.log("MAX: " + max + ", MIN: " + min);
  
  for (var k = 0; k < boxes.length; k++) {

    for (var n = 0; n < boxes[k].length; n++) {
      
      var box = boxes[k][n];
      
      if (box["type"] == "addBall") {

        var x = box["position"] * 55 + 15 + 0.5;
        var y = 55 * k + 45.5;

        ctx.beginPath();
        ctx.arc(x + 25, y + 25, 10, 0, 2 * Math.PI);
        ctx.stroke();

        drawLine(x + 22, y + 25, x + 28, y + 25);
        drawLine(x + 25, y + 22, x + 25, y + 28);

      } else if (box["durability"] > 0) {
        
        var color;
        var durability = box["durability"];
        
        if (durability > (tierStep * 5)){
          color = colors[0];
        } else if (durability > (tierStep * 4)){
          color = colors[1];
        } else if (durability > (tierStep * 3)){
          color = colors[2];
        } else if (durability > (tierStep * 2)){
          color = colors[3];
        } else if (durability > (tierStep * 1)){
          color = colors[4];
        }
        
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
                   
        ctx.lineWidth = 2;
        //ctx.strokeStyle = boxes[k][n]["color"];
        //ctx.fillStyle = boxes[k][n]["color"];
        
        var x = box["position"] * 55 + 15 + 0.5;
        var y = 55 * k + 45.5;
        //ctx.beginPath();
        ctx.strokeRect(x, y, 50, 50);
        //ctx.strokeRect(x, y, 50, 50);
        //drawLine(x,y,x+50,y+50);
        //drawLine(x,y+50,x+50,y);
        
        //Making sure numbers are centered
        if (box["durability"] >= 100){
          ctx.fillText(box["durability"], x + 9, y + 31);
        } else if (box["durability"] >= 10){
          ctx.fillText(box["durability"], x + 14, y + 31);
        } else {
          ctx.fillText(box["durability"], x + 19, y + 31);
        }
        //ctx.stroke();

        //ctx.fillText("Score: " + score, canvas.width - 100, 25);
      }
    }

  }

  //console.log(boxes);
}

function renderLossScreen(){
  
  var width = canvas.width;
  var height = canvas.height;
  
  //ctx.clearRect(0,0,width,height);
  ctx.fillStyle = "rgba(0,0,0,0.7)"
  ctx.fillRect(0,0,width,height);
  
  ctx.fillStyle = "#ccc";
  ctx.font = "28px Verdana";
  
  var metrics = ctx.measureText("Game over!");
  ctx.fillText("Game over!", (width - metrics.width)/2, (height/2)-50);
  metrics = ctx.measureText("Your score: " + score);
  ctx.fillText("Your score: " + score, (width - metrics.width)/2, (height/2));
}


function playerTurn() {

  var x = 250.5;
  var y = canvas.height - 25.5;
  
  ctx.strokeStyle = "#ccc";
  ctx.fillStyle = "#ccc";
  
  var nY = y - Math.sqrt(400 * 400 - (change * change));
  controlY = nY;
  
  drawLine(x, y, controlX, controlY);
  
  ctx.beginPath()
  ctx.arc(x,y+9,5,0,Math.PI*2);
  ctx.fill();

}

var change = 0;
var controlX = 250.5;
var controlY = 660 - 20.5;//canvas.height - 20.5;

window.onmousedown = function(e){
  
  e.preventDefault();
  console.log("abc");
  
    
  if (gameover){
    newRow();
    newRow();
    drawMap();
    playerTurn();
    gameover = false;
  }
  
  mouseDown = true;
}

window.onmouseup = function(e){
  
  e.preventDefault();
  mouseDown = false;
}

window.onmousemove = function(e){
  
  if (mouseDown){
    
    e.preventDefault();
    //console.log("move");
    
    var mouseX = parseInt(e.clientX - ((window.innerWidth - canvas.width) / 2));
    var mouseY = parseInt(e.clientY - 30);
    
    //console.log(mouseX, mouseY);
    
    var x = 250.5;
    var y = canvas.height - 25.5;
    
    change = -(x - mouseX);
    var nY = y - Math.sqrt(400 * 400 - (change * change));
    
    controlY = nY;
    controlY = Math.sqrt(400 * 400 - (change * change));
    console.log(controlY);
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    drawMap();
    ctx.strokeStyle = "#ccc";
    ctx.fillStyle = "#ccc";
    
    drawLine(x, y, mouseX, nY);
    drawLine(x, y, mouseX, nY);
    
    ctx.beginPath()
    ctx.arc(x,y+9,5,0,Math.PI*2);
    ctx.fill();
  }
}

window.onkeydown = function(e) {

  if (gameover){
    newRow();
    newRow();
    drawMap();
    playerTurn();
    
    gameover = false;
  }
  
  var x = 250.5;
  var y = canvas.height - 20.5;

  var key = e.keyCode ? e.keyCode : e.which;
  
  console.log(key);
  
  if (key == 39) {
 //   console.log("right");

    change += 5;
  }

  if (key == 37) {
  //  console.log("left");

    change += -5;
  }

  if (key == 32) {
    e.preventDefault();
    //shoot balls
    console.log("shoottheball");
    if (!animOn){
      shoot();
    }
  }
  
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawMap();
  ctx.clearRect(50, canvas.height - 121.5, canvas.width - 100, 110);

  //ctx.fillStyle = "white";
  ctx.lineWidth = 2;

  controlX = x + change;
  controlY = y - Math.sqrt(400 * 400 - (change * change)) //y - 100; //+ Math.abs(change) + 0.5

  drawLine(x, y, controlX, controlY);
  drawLine(x, y, controlX, controlY);

}

//ball.add = controlX / controlY;
//ctx.strokeRect(0,0,10,10);

var ballsToAdd = 0;

function drawBalls() {
  
  var ballsFinished = 0;
  
  //var add = controlX / controlY;
  //ball.add = add;

  //ctx.clearRect(ball.x - (add + 5 * 2),ball.y + 1 + 6, 10, 10);

  ctx.clearRect(0, 0, canvas.width, canvas.height); //39);
  //ctx.clearRect(11, 41, canvas.width - 22, canvas.height - 52);

  drawMap();
  
  ctx.fillStyle = "#ccc";
  
  balls.forEach( function(ball){
    
    //console.log(ball["x"]);
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 5, 0, 2 * Math.PI);
    //ctx.stroke();
    ctx.fill();

    ball.x += ball.addX; //controlX / controlY;//0.61;
    ball.y -= ball.addY;

    //checkCollisionWithBoxes(ball);

    if (((ball.x + ball.addX > (canvas.width - 14)) || ((ball.x + ball.addX) < 14)) && (ball.y < canvas.height)) {

      ball.addX = -ball.addX;
      ball.direction = "left";

      //console.log(ball.addX);

     // console.log("overBound");
    }

    if ((ball.y < 46)) {

      ball.addY = -ball.addY;
     // console.log("y Over");
    }

    for (var i = 0; i < boxes.length; i++) {
      for (var b = 0; b < boxes[i].length; b++) {
        
        var boxX = boxes[i][b]["position"] * 55 + 15-1;
        var boxLength = 51;
        var boxW = 51;
        
        var boxY = i * 55 + 45-1;
        var boxHeight = 51;
        var boxH = 51;
        
        var ballRadius = 5;
        var ballDim = 5;
        
        if ((ball.y - ballRadius > boxY + boxHeight/2)){
              
        }
        
       /* var distX = Math.abs(ball.x - boxX-boxW/2);
        var distY = Math.abs(ball.y - boxY-boxH/2);

        if (distX > (boxW/2 + ballR)) { continue;}//return false; }
        if (distY > (boxH/2 + ballR)) { continue;}//return false; }

        if (distX <= (boxW/2)) { alert("true")}//return true; } 
        if (distY <= (boxH/2)) { alert("true")}//return true; }

        var dx=distX-boxW/2;
        var dy=distY-boxH/2;
        
        alert(dx*dx+dy*dy<=(ballR*ballR));*/
        
        if (ball.x + ballDim > boxX &&
            boxX + boxLength + ballDim > ball.x &&
            ball.y + ballDim > boxY &&
            boxY + boxHeight + ballDim > ball.y - ballDim){
          
          //alert("touched");
          
          if (boxes[i][b]["type"] == "addBall"){
            
            ballsToAdd += 1;
            
            boxes[i].splice(b, 1);
            continue;
          }
          
          if ((ball.x + -2*ball.addX > boxX + boxLength)){
            
            console.log("right");
            ball.addX = -ball.addX;
              boxes[i][b]["durability"] -= 1;

              if (boxes[i][b]["durability"] < 1) {

                boxes[i].splice(b, 1);
              //  score += 1;
              }
            continue;
          }
          
          if (ball.x + -2*ball.addX < boxX){
            console.log("left");
            ball.addX = -ball.addX;
              boxes[i][b]["durability"] -= 1;

              if (boxes[i][b]["durability"] < 1) {

                boxes[i].splice(b, 1);
              //  score += 1;
              }
            
            continue;
          }
          
          if (ball.y + ballRadius + 2*ball.addY > boxY - boxHeight){//((ball.y + ball.addY < boxY)){
            
            console.log("top");
            ball.addY = -ball.addY;
              boxes[i][b]["durability"] -= 1;

              if (boxes[i][b]["durability"] < 1) {

                boxes[i].splice(b, 1);
               // score += 1;
              }
            continue;
          }
          
          if (ball.y - ballRadius - 2*ball.addY > boxY + boxHeight){//(ball.y + ball.addY > boxY + boxHeight - ballDim){
            
            console.log("bottom");
            
            ball.addY = -ball.addY;
              boxes[i][b]["durability"] -= 1;

              if (boxes[i][b]["durability"] < 1) {

                boxes[i].splice(b, 1);
                //score += 1;
              }
            continue;
          }
          
          //console.log("detected");
        }
      }
    }
 

    if (ball.y > canvas.height - 15) {
      
      ballsFinished += 1;
    }
    
     /* window.cancelAnimationFrame(anim);
      console.log("stopped");

      ball.x = 250;
      ball.y = 580;
      ball.addX = 0;
      ball.addY = 0;

      ctx.clearRect(11, 41, canvas.width - 22, canvas.height - 52);
      newRow();
      drawMap();
      //cancel animation and start new "round"
    } else {

      shoot();
    }*/

    /*for (var ball in balls){
      
    }*/
    //shoot();
  })
  
  if (ballsFinished >= balls.length) {
      
    score += 1;
    roundNo += 1;
    
    window.cancelAnimationFrame(anim);
    console.log("stopped");
    
    animOn = false;
    //var ballNo = 0;
    
    balls.forEach(function(ball){
      
      ball.x = 250;
      ball.y = 620;// + ballNo * 10;
      ball.addX = 0;
      ball.addY = 0;
      
      //ballNo += 1;
    })
    
    for(var b = 0; b < ballsToAdd; b++){
      var ball = {x: 250,y: 630,direction: 0,addX: 0,addY: 0,no: balls.length};
  
      balls.push(ball);
      //console.log(balls);
    }
    
    console.log(balls);
    
    ballsToAdd = 0;
      
    ctx.clearRect(0,0,canvas.width, canvas.height);
      //ctx.clearRect(11, 41, canvas.width - 22, canvas.height - 52);
    newRow();
    //drawMap();
    drawMap();
    
    playerTurn();
    
    console.log(boxes);
    
    for (var i = 0; i < boxes.length; i++){
      
      if (boxes[i].length == 0 && i == boxes.length-1){
        //if (boxes[i+1])
        boxes.splice(i, 1);
      }
    }
    
    if (boxes[boxes.length-1][0]["type"] == "addBall" && boxes[boxes.length-1].length == 1 && boxes.length > 10){
      
      boxes.splice(boxes.length-1,1);
      drawMap();
    } else if (boxes.length > 10){

        drawMap();

        //alert("you lost")
        
        renderLossScreen();
      
        ctx.font = "18px Verdana";
      
        boxes = [];
        score = 0;
        roundNo = 1;
        balls = [];
        
        var ball={x: 250,y: 630,direction:0,addX:0,addY:0,no: 0};
        balls.push(ball);
        
        gameover = true;
      
       /* newRow();
        newRow();
        drawMap();
        playerTurn();*/
      
    }
      //cancel animation and start new "round"
    } else {

      shoot();
    }
  
}


var anim;

function shoot() {
  
  balls.forEach( function(ball){
    
    //console.log(balls, ball);
    
    if (ball.addX == 0) {
      
      ball.addX = change / 65;
      //ball.addX = (change / (canvas.height - 20.5 - controlY)) * 5;
      // controlX / controlY;
      ball.x -= ball.addX * ball.no * 4;
    }

    if (ball.addY == 0) {
      
      ball.addY = controlY / 65;//5;
      ball.y += ball.addY * ball.no * 4;
    }
    
    animOn = true;
    //console.log(balls, ball);
  });
                

  //window.setInterval(drawBalls, 10);
  anim = window.requestAnimationFrame(drawBalls, 10);
  //drawBalls();
}
