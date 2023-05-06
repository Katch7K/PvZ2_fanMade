class Entity{
    constructor(x,y,width,height){
        this.hp = 100;
        this.x =x;
        this.y =y;
        this.width = x-width;
        this.height = height;
        this.velocity = 1;

        this.damage = 10;
        this.isWalking = true;
        this.delayDamage = 20;
        this.delayDamageCounter = 0;
        this.frameAnimation = 0;
        this.frameSpriteIndex = 0;
    }
    getHp(){
        return this.hp;
    }

    hit(damage){
        this.hp-=damage;
    }
    

    update(plantsMap){
        this.frameAnimation = (this.frameAnimation+1)%60;
        //ogni 60 tick cambio zona dell'immagine
        if((this.frameAnimation+1)%60 == 0){
            this.frameSpriteIndex = (this.frameSpriteIndex+1) % 6;
        }

        if(this.isWalking){
            this.x = this.x - this.velocity; // rappresenta il movimento verso la casa, quindi addosso alle piante
        }
        this.isWalking = true;
        this.checkCollision(plantsMap)
    }
    
    checkCollision(plantsMap){
        const row = plantsMap[this.y/tileSize];
        //se c'è una pianta davanti a lui nella mappa
        const col = Math.floor(this.x/tileSize);
        if(row[col]!=null || row[col]!=null){
            this.isWalking = false;
        }

        if(!this.isWalking){
            this.delayDamageCounter++;
            if(this.delayDamageCounter === this.delayDamage){
                this.delayDamageCounter = 0;
                row[col].hit(this.damage);
            }
            
        }
        
    }
}

class Plant{
    constructor(x, y, hitbox){
        this.attackState = false;
        this.hp = 100;
        this.x = x;
        this.y = y;
        this.width = hitbox;
        this.height = hitbox;
        this.frameAnimation = 1;
    }

    updateFrame(){
        this.frameAnimation++;
        if(this.frameAnimation >59){
            this.frameAnimation = 0;
        }
    }

    hit(damage){
        this.hp -=damage;
    }
    getHp(){
        return this.hp;
    }
    
}

class Sun{
    constructor(xDestination,yDestination){
        this.x = xDestination;
        this.y = -tileSize;
        this.yDestination = yDestination;
        this.isArrived = false; // rappresenta se il sole è arrivato alla casella
    }

    update(){
        if(!this.isArrived){
            this.y++;
            this.isArrived = (this.y === this.yDestination);
        }
    }
}