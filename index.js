const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024
canvas.height = 576
c.fillRect(0,0, canvas.width, canvas.height)
var gravity = 0.2
var p1dmg = 2
var p2dmg = 10
    
const background = new sprite({
    position: {
        x: 0,
        y: -60
    },
    imagesrc: "spritesheet.png",
    scale: 1.15,
    framesmax: 8

})
const leftWall = {
    x: -200, // x position of the wall
    y: 0, // y position of the wall
    width: 0, // width of the wall
    height: canvas.height // height of the wall
  };
  
  const rightWall = {
    x: 675, // x position of the wall
    y: 0, // y position of the wall
    width: 0, // width of the wall
    height: canvas.height // height of the wall
  };
const player = new fighter({
    position: {
    x:0,
    y:0
    },
    velocity: {
    x: 0,
    y: 0
    },
    imagesrc: 'Sprites/Idle.png',
    framesmax: 8,
    scale: 3,
    offset: {
        x: 0,
        y: 225
    },
    sprites: {
        idle: {
            imagesrc: 'Sprites/Idle.png',
            framesmax: 8
        },
        run: {
            imagesrc: 'Sprites/Run.png',
            framesmax: 8,
        },
        jump: {
            imagesrc: 'Sprites/Jump.png',
            framesmax: 2,
        },
        fall:
        {
            imagesrc: 'Sprites/Fall.png',
            framesmax: 2
        },
        attack1: {
            imagesrc: 'Sprites/Attack1.png',
            framesmax: 6,
        },
        takehit: {
            imagesrc: 'Sprites/Take hit.png',
            framesmax: 4
        },
        death: {
            imagesrc: 'Sprites/Death.png',
            framesmax: 6
        }

    },
    attackBox: {
        offset: {
            x:-300,
            y: 0
        },
        width: 270,
        height: 50
    },
    hurtbox:{
        offset:{
            x:-260,
            y:0
        },
        width: 75,
        height: 200
    }
})
const enemy = new fighter({
    position: {
    x:400,
    y:0
    },
    velocity: {
    x: 0,
    y: 0
    },
    imagesrc: 'kenji/Idle.png',
    framesmax: 4,
    scale: 3,
    offset: {
        x: 0,
        y: 245
    },
    sprites: {
        idle: {
            imagesrc: 'kenji/Idle.png',
            framesmax: 4
        },
        run: {
            imagesrc: 'kenji/Run.png',
            framesmax: 8,
        },
        jump: {
            imagesrc: 'kenji/Jump.png',
            framesmax: 2,
        },
        fall:
        {
            imagesrc: 'kenji/Fall.png',
            framesmax: 2
        },
        attack1: {
            imagesrc: 'kenji/Attack1.png',
            framesmax: 4,
        },
        takehit: {
            imagesrc: 'kenji/Take hit.png',
            framesmax: 3
        },
        death: {
            imagesrc: 'kenji/Death.png',
            framesmax: 7
        }
    },
    attackBox: {
        offset: {
            x:-50,
            y:0
        },
        width: 250,
        height: 50
    },
    hurtbox:{
        offset:{
            x: -270,
            y: 0
        },
        width: 75,
        height: 200
    },
})

console.log(player)
const keys = {
    a: {
     pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    space: {
        pressed: false
    }
}
function rectcollision(p1,p2) 
    {
    return (p1.attackBox.position.x + p1.attackBox.width >= p2.hurtbox.position.x
        && p1.attackBox.position.x <= p2.hurtbox.position.x + p2.hurtbox.width
        && p1.attackBox.position.y + p1.attackBox.height >= p2.hurtbox.position.y
        && p1.attackBox.position.y <= p2.hurtbox.position.y + p2.hurtbox.height)
}
function determineWinner({player,enemy, timerid}){
    clearTimeout(timerid)
    document.querySelector('#display').style.display = 'flex'
    if (player.health === enemy.health){
        document.querySelector('#display').innerHTML = 'Tie!'
    } else if (player.health > enemy.health){
        document.querySelector('#display').innerHTML = 'Player 1 Wins!'
    } else {
        document.querySelector('#display').innerHTML = 'Player 2 Wins!'
    }
}


let timer = 120
let timerid
function dectime(){
    if(timer > 0){
    timerid = setTimeout(dectime, 1000)
    timer -= 1
    document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0){
    determineWinner({player,enemy,timerid})}
}
dectime()
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    player.update()
    enemy.update()
    //player movement
    player.velocity.x = 0
    player.frameshold = 15
    enemy.frameshold = 15
    if (keys.a.pressed && player.lastKey === 'a' && player.position.x >= leftWall.x) {
        player.switchsprite('run')
        player.velocity.x = -4
    } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x <= rightWall.x) {
        player.switchsprite('run')
        player.velocity.x = 4
    } 
    else if (player.position.y === 426) {
        player.switchsprite('idle')
    }
    if (player.velocity.y < 0 && keys.w.pressed){
        player.switchsprite('jump')
    } else if (player.velocity.y > 0){
        player.switchsprite('fall')
    }

    //enemy movement
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x >= leftWall.x) {
        enemy.switchsprite('run')
        enemy.velocity.x = -4
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x <= rightWall.x) {
        enemy.switchsprite('run')
        enemy.velocity.x = 4
    } else if (enemy.position.y === 426) {
        enemy.switchsprite('idle')
    }
    if (enemy.velocity.y < 0){
        enemy.switchsprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchsprite('fall')
    }
    //detect collision
    if(rectcollision(player,enemy)&& player.isattacking && player.framecurrent === 3)
    {
        player.isattacking = false
        enemy.takehit()
        
        //document.querySelector('#enemyhp').style.width = enemy.health + "%"
        gsap.to('#enemyhp', {
            width: enemy.health + '%'
        })
        
    }
    if (player.isattacking && player.framecurrent === 3){
        player.isattacking = false
    }
    if(rectcollision(enemy,player)&& enemy.isattacking && enemy.framecurrent === 2){
        player.takehit()
        enemy.isattacking = false
        //document.querySelector('#playerhp').style.width = player.health + "%"
        gsap.to('#playerhp', {
            width: player.health + '%'
        })
       
        
    }
    if (enemy.isattacking && enemy.framecurrent === 2){
        enemy.isattacking = false
    }

    //end game
    if (enemy.health <= 0 || player.health <=0){
        determineWinner({player,enemy,timerid})
    }
    //wall sliding

}

animate()
// player jump functions
function jump() {
    if (jumpCount < jumpMax){
        player.velocity.y = -10

    }
}
var jumpMax = 3
var jumpCount = 0
function checkjump(){

    if (jumpCount < jumpMax) {
        jump();
        jumpCount+= 1;
    }
}

//enemy jump functions
function jumpenemy() {
    if (ejumpCount < ejumpMax){
        enemy.velocity.y = -10

    }
}
var ejumpMax = 3
var ejumpCount = 0
function checkjumpenemy(){

    if (ejumpCount < ejumpMax) {
        jumpenemy();
        ejumpCount+= 1;
    }
}
window.addEventListener('keydown',(event) =>{
    if (player.dead === false){
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            keys.w.pressed = true
            if (player.velocity.y === 0){
                jumpCount = 0
            }
            checkjump()
            break
        case ' ':
            player.attack()
            break}}
        //Enemy controls
    if (enemy.dead === false){
    switch(event.key){       
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            if (enemy.velocity.y === 0){
                ejumpCount = 0
            }
            checkjumpenemy()
            break
        case 'Control':
            enemy.attack()
            break
    }}
})

window.addEventListener('keyup',(event) =>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }

    // enemy keys
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break

    }
})
