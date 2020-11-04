//Create variables here
var dog,happydog,database;
var foodS,foodstock;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var foodStock,lastFed;
var gameState,readgameState;
function preload()

{
  //load images here
  dogImage = loadImage("images/Dog.png")
  hdogImage = loadImage("images/happydog.png")
  bedroom = loadImage("images/Bed Room.png")
  garden = loadImage("images/Garden.png")
  washroom = loadImage("images/Wash Room.png")
}

function setup() {
  createCanvas(750,750);
  database = firebase.database();
  foodObj = new Food();
  dog = createSprite(400,250,50,50);
  dog.scale = 0.15
  dog.addImage(dogImage);
 
  foodstock = database.ref('Food');
  foodstock.on("value",readStock);
  
  feed = createButton("feed the dog");
  feed.position(450,95);
  feed.mousePressed(feedDog);

  addFood = createButton("add food");
  addFood.position(600,95);
  addFood.mousePressed(addFoods);

  fedTime=database.ref('FeedTime');
   fedTime.on("value",function(data){
      lastFed=data.val(); 
    });

  readgameState = database.ref('gameState');
  readgameState.on("value",function(data){
    gameState = data.val();
  });
}


  function feedDog(){
    dog.addImage(hdogImage);

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food : foodObj.getFoodStock(),
      fedTime:hour()
    })
  }

  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food : foodS
    })
  }
  


function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

function writeStock(x){
  if(x<=0){
     x=0; 
    }
    else{
       x=x-1; 
      }
       database.ref('/').update({
          Food:x 
        })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}


  function draw() {  
   background(46,139,87);
  currentTime = hour();
  if(currentTime == (lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
 }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
   update("Bathing");
   foodObj.washroom();
 }else{
   update("hungry");
   foodObj.display();
 }  
 if (gameState != "hungry"){
   feed.hide()
   addFood.hide()
   dog.remove()
 }
   else{
     feed.show()
   addFood.show()
   dog.addImage(dogImage)
   }

 
   
  drawSprites();
  
    
     }



