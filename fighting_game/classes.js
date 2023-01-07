class sprite {
    constructor({position, imagesrc, scale = 1, framesmax = 1, offset = {x:0, y:0}}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imagesrc
        this.scale = scale
        this.framesmax = framesmax
        this.framecurrent = 0
        this.frameselapsed = 0
        this.frameshold = 30
        this.offset = offset
    }

    draw() {
        c.drawImage(this.image,
        this.framecurrent * (this.image.width / this.framesmax),
        0,    
        this.image.width / this.framesmax,
        this.image.height,
        this.position.x - this.offset.x, 
        this.position.y - this.offset.y,
        (this.image.width/this.framesmax) * this.scale,
        this.image.height * this.scale)
    }
    
    animateframes(){
        this.frameselapsed += 1
        if (this.frameselapsed % this.frameshold === 0){
        if (this.framecurrent < this.framesmax - 1){
        this.framecurrent += 1
        } else {
            this.framecurrent = 0
        }}
    }
    update() {
        this.draw()
        this.animateframes()
    }

}
class fighter extends sprite{
    constructor({position, velocity, color = 'red', imagesrc, scale = 1, framesmax = 1,
    offset = {x:0,y:0},
    sprites,
    attackBox = {offset: {},width: undefined,
    height: undefined},
    hurtbox = {offset: {},width: undefined,
    height: undefined}}) {
        super({
            position,
            imagesrc,
            scale,
            framesmax,
            offset
        })
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.hurtbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: hurtbox.offset,
            width: hurtbox.width,
            height: hurtbox.height
        }
        this.color = color
        this.isattacking = false
        this.health = 100
        this.framecurrent = 0
        this.frameselapsed = 0
        this.frameshold = 30
        this.sprites = sprites
        this.dead = false
        this.damage = 3.5
        for (const sprite in this.sprites){
         sprites[sprite].image = new Image()
         sprites[sprite].image.src = sprites[sprite].imagesrc   
        }
    }


    update() {
        this.draw()
        if (this.dead === false){this.animateframes()}
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x
        this.attackBox.position.y = this.position.y
        this.hurtbox.position.x = this.position.x - this.hurtbox.offset.x
        this.hurtbox.position.y = this.position.y
        
        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y,this.attackBox.width,this.attackBox.height)
        //c.fillRect(this.hurtbox.position.x, this.hurtbox.position.y,this.hurtbox.width,this.hurtbox.height)


        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
            this.position.y = 426
        } else
        this.velocity.y += gravity
    }
    
    attack() {
        this.switchsprite('attack1')
        this.isattacking = true
        
    }
    takehit(){
        this.health -= this.damage
        if (this.health <= 0){
            this.switchsprite('death')
        } else this.switchsprite('takehit')
  
    }
    switchsprite(sprite){
        if (this.image === this.sprites.death.image) {
        if (this.framecurrent === this.sprites.death.framesmax -1) this.dead = true
            return    }
        if (this.image === this.sprites.attack1.image && this.framecurrent < this.sprites.attack1.framesmax -1
            ) return
        if (this.image === this.sprites.takehit.image && this.framecurrent < this.sprites.takehit.framesmax -1
            ) return    
        switch (sprite) {
            case 'idle':
                if (this.image!== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.framesmax = this.sprites.idle.framesmax
                    this.framecurrent = 0
                }
                break
            case 'run':
                if (this.image!== this.sprites.run.image){
                this.image = this.sprites.run.image
                this.framesmax = this.sprites.run.framesmax
                this.framecurrent = 0    
            }
                break
            case 'jump':
                if (this.image!== this.sprites.jump.image){
                this.image = this.sprites.jump.image
                this.framesmax = this.sprites.jump.framesmax
                this.framecurrent = 0

            }
            break
            case 'fall':
                if (this.image!== this.sprites.fall.image){
                this.image = this.sprites.fall.image
                this.framesmax = this.sprites.fall.framesmax
                this.framecurrent = 0

            }
            break
            case 'attack1':
                if (this.image!== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesmax = this.sprites.attack1.framesmax
                    this.framecurrent = 0
                }
                break
            case 'takehit':
                if (this.image!== this.sprites.takehit.image){
                    this.image = this.sprites.takehit.image
                    this.framesmax = this.sprites.takehit.framesmax
                    this.framecurrent = 0
                }
                break
            case 'death':
                if (this.image!== this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.framesmax = this.sprites.death.framesmax
                    this.framecurrent = 0
                }
                break
        }
    }
}
