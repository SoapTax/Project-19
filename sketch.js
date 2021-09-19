var player;
var bulletGroup;
var time = -49;
var gameState;
var obstacles;
var obstacleGroup;
var dead;
var score;
var coinGroup;
var invGround;
var invWall;
var restart;

function preload(){
bulletImg = loadImage("bullet.png");
groundImg = loadImage("ground.png");
playerImg = loadImage("giphy.gif");
coinImg = loadImage("coin.png");
obstacleImg = loadImage("obstacle.png");
deadImg = loadImage("dead.png");
restartImg = loadImage("restart.png")
}

function setup() {
canvas = createCanvas(1500, 750);

edges=createEdgeSprites();
score = 0;
gameState = "play";

restart = createSprite(2000, 375);
restart.addImage("restart", restartImg);
restart.visible = false;

bulletGroup = new Group();
coinGroup = new Group();

obstacleGroup = new Group()
obstacles = [];

ground = createSprite(680, 830);
ground.addImage("ground", groundImg);
ground.scale = 3;
ground.velocityX = -20;

invGround = createSprite(750, 630, 1500, 10);
invGround.visible = false;

invWall = createSprite(0, 375, 10, 750);
invWall.visible = false;

player = createSprite(200, 450);
player.addImage("player", playerImg);
player.scale = 0.5;
player.setCollider("rectangle", 0, 30, 190, 320);

dead = createSprite();
dead.addImage("dead", deadImg);
dead.visible = false;
dead.scale = 0.02;
}

function draw() {
    background("cyan");
    player.velocityY = player.velocityY + 3;
    player.collide(invGround);
    player.collide(edges);
    time = time + Math.round(getFrameRate()/10);
    textSize(30);
    text("Score: "+ score, 740, 40);

if(gameState === "play"){
    if(ground.x < ground.width/4){
        ground.x = 680;
    }
    if(keyWentDown("space")){
        player.velocityY = -30;
    }
    if(mouseWentDown()){
        shoot();
    }
    if(time%67 === 0){
     spawnObstacle();
    }
    if(time%157 === 0){
        spawnCoin();
       }
    if(player.isTouching(obstacleGroup)){
        gameState = "end";
    }
    if(player.isTouching(coinGroup)){
        coinGroup.destroyEach();
        score = score + 10;
    }
    if(bulletGroup.isTouching(obstacleGroup)){
        obstacleGroup.destroyEach();
    }
    if(invWall.isTouching(obstacleGroup)){
        gameState = "end";
    }
} else if(gameState === "end"){
    ground.velocityX = 0;
    obstacleGroup.destroyEach();
    bulletGroup.destroyEach();
    player.visible = false;
    dead.x = player.x;
    dead.y = player.y;
    dead.visible = true;
    coinGroup.destroyEach();
    restart.visible = true;
    restart.x = 750;
    if(mousePressedOver(restart)){
        gameState = "play";
        player.visible = true;
        time = 0;
        score = 0;
        ground.velocityX = -20;
        dead.visible = false;
        restart.x = 2000;
    }
}
 drawSprites();

}

function shoot(){
    var bullet = createSprite();
    bullet.addImage("bullet", bulletImg);
    bullet.x = player.x;
    bullet.y = player.y;
    bullet.velocityX = 25;
    bullet.scale = 0.1;
    bullet.lifetime = 50;
    bulletGroup.add(bullet);
}

function spawnCoin(){
    var coin = createSprite(1500, Math.round(random(0, 600)));
    coin.velocityX = -20;
    coin.addImage("coin", coinImg);
    coin.scale = 0.1;
    coinGroup.add(coin);
    coin.setCollider("circle", 0, 0, 100); 
}

function spawnObstacle(){
    var obstacle = createSprite(1500, Math.round(random(15, 600)));
    obstacle.addImage("obstacle", obstacleImg);
    obstacle.velocityX = -20 - Math.round(time/400);
    obstacle.scale = 0.5;
    obstacleGroup.add(obstacle);
    obstacle.setCollider("rectangle", 0, 0, 150, 150); 
    obstacle.lifetime = 300
}