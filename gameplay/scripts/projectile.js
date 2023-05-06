class Projectile{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 20;
        this.hasHitted = false; //variabile che rappresenta lo stato di aver colpito o meno uno zombi
        this.damage = 20; // danno dello sparasemi
    }

    update(zombies){ // qua passo un zombies[] per verificare se il proiettile colpisce lo zombi
        this.x+=10;

        
        //se colpisce uno zombi
        for (const zombie of zombies) {
            
            this.checkCollision(zombie);
            if(this.hasHitted){
                return;
            }
        }
    }

    checkCollision(zombie){
        //codice tratto da quello di java.awt.Rectangle
        let tw = this.width;
        let th = this.height;
        let zw = zombie.width;
        let zh = zombie.height;
        if (zombie.width <= 0 || zombie.height <= 0 || this.height <= 0 || this.height <= 0) {
            return false;
        }
        let tx = this.x;
        let ty = this.y;
        let zx = zombie.x;
        let zy = zombie.y;

        zw += zx; //coordinate zombie 2° vertice
        zh += zy;

        tw += tx;
        th += ty;
        
/*
        Xd -> vertice destro    Xs -> vertice sinistro 
    controllo che Xd del hitbox zombie
    sia maggiore della coordinata xS del proiettile e che
    la coordinata x del vertice sinistro del rettangolo 2 sia minore di 
    xD del rettangolo 1, in questo caso ci
    sarebbe un'intersezione sull'asse x.
    stessa roba per y.
*/ 
        this.hasHitted = 
                ((zw < zx || zw > tx) &&
                (zh < zy || zh > ty) &&
                (tw < tx || tw > zx) &&
                (th < ty || th > zy));
        if(this.hasHitted){
            zombie.hit(this.damage);
            // console.log(zombie.getHp());
        }
    }
    
}