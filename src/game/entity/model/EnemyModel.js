export default class EnemyModel{
    constructor (name,stats,fire,graphicsData,config){
        // console.log('name,level,hp,stamina,speed,magicPower,battlePower,defense,magicDefense, xp\n', name,stats);
        this.name = name;
        this.stats = stats;
        this.fire = fire;
        this.graphicsData = graphicsData;
        this.config = config;
        this.initiallevel = stats.level;
        this.initialhp = stats.hp;
        this.initialstamina = stats.stamina;
        this.initialspeed = stats.speed;
        this.initialmagicPower = stats.magicPower;
        this.initialbattlePower = stats.battlePower;
        this.initialdefense = stats.defense;
        this.initialmagicDefense = stats.magicDefense;
        this.initialxp = stats.xp;

        // this.srcImg = graphicsData.srcImg;
        // this.srcJson = graphicsData.srcJson;
        // this.sourceLabel = graphicsData.sourceLabel;
        // this.frames = graphicsData.frames;


        this.level = stats.level;
        this.hpMax = stats.hp;
        this.speed = stats.speed;
        this.magicPower = stats.magicPower;
        this.battlePower = stats.battlePower;
        this.defense = stats.defense;
        this.magicDefense = stats.magicDefense;
        this.stamina = stats.stamina;
        this.critialChance = 0.0;
        this.speedStatus = 'normal';

        if(this.fire && this.fire.type){
            this.attackType = this.fire.type;
        }else{
            this.attackType = 'physical';
            if(stats.magicPower > stats.battlePower){
                this.attackType = 'magical';
            }
        }
        if(stats.xp > 0){
            this.xp = stats.xp;
        }else{
            this.xp = 100;
        }

        this.spellPower = 9; //speel do bolt


        this.speedModifier = 0.005;
        this.magicPowerModifier = 0.004;
        this.battlePowerModifier = 0.005;
        this.defenseModifier = 0.004;
        this.magicDefenseModifier = 0.004;
        this.baseHPModifier = 1.62;
        this.staminaModifier = 0.008;



        this.updateLevel(stats.level);
        
        // this.updateLevel(level);
    }
    log(){
        console.log();
        console.log('stats');
        console.log('class,', this.name);
        console.log('level,',Math.floor(this.level));
        console.log('hp,',Math.floor(this.hpMax));
        // console.log('vigor,',Math.floor(this.vigor));
        console.log('speed,',Math.floor(this.speed));
        console.log('stamina,',Math.floor(this.stamina));
        console.log('magicPower,',Math.floor(this.magicPower));
        console.log('battlePower,',Math.floor(this.battlePower));
        console.log('defense,',Math.floor(this.defense));
        console.log('attack,',Math.floor(this.attack));
        console.log('magicDefense,',Math.floor(this.magicDefense));
        console.log('velocity,',Math.floor(this.velocity));
        console.log('fireFreq,',Math.floor(this.fireFreq));
        console.log('demagePhysical,',Math.floor(this.getDemage('physical')));
        console.log('demageMagical,',Math.floor(this.getDemage('magical')));

    }
    getNormalizedAtt(){
        return {
            speed:Math.floor(this.speed)/255,
            stamina:Math.floor(this.stamina)/255,
            magicPower:Math.floor(this.magicPower)/255,
            battlePower:Math.floor(this.battlePower)/255,
            defense:Math.floor(this.defense)/255,
            attack:Math.floor(this.attack)/255,
            magicDefense:Math.floor(this.magicDefense)/255,
            velocity:Math.floor(this.velocity)/255,
            fireFreq:Math.floor(this.fireFreq)/255
        }
    }
        
    clone(){
        return new MonsterModel(
            this.name,
            this.stats,
            this.fire,
            this.graphicsData,
            this.config);
    }
    updateLevel(level){
        // console.log('updateLevel', level);
        this.level = level;
        this.speed += level * ((this.speed*this.speed+this.speed+3)/4*this.speedModifier);
        this.magicPower += level * ((this.magicPower*this.magicPower+this.magicPower+3)/4*this.magicPowerModifier);
        this.battlePower += level * ((this.battlePower*this.battlePower+this.battlePower+3)/4*this.battlePowerModifier);
        this.defense += level * ((this.defense*this.defense+this.defense+3)/4*this.defenseModifier);
        this.magicDefense += level * ((this.magicDefense*this.magicDefense+this.magicDefense+3)/4*this.magicDefenseModifier);
        this.stamina += (this.stamina*this.stamina+this.stamina+3)/4*this.staminaModifier;

        this.attack = this.battlePower;

        if(this.speed > 255){
            this.speed = 255;
        }
        if(this.stamina > 255){
            this.stamina = 255;
        }
        if(this.magicPower > 255){
            this.magicPower = 255;
        }
        if(this.battlePower > 255){
            this.battlePower = 255;
        }
        if(this.defense > 255){
            this.defense = 255;
        }
        if(this.attack > 255){
            this.attack = 255;
        }
        if(this.magicDefense > 255){
            this.magicDefense = 255;
        }

        this.baseHP = level * (20 / this.baseHPModifier);

        this.hpMax += (this.baseHP*(this.stamina+32))/32 *(level/2);
        this.hp = this.hpMax;
        this.velocity = 8 - (255 - this.speed) / 25 + 5;

        this.fireFreq = ((255 - this.speed) / (this.speed * 0.4)) * (1.8 + (this.speedModifier*1000));

        if(this.fireFreq <= 4)
        {
         this.fireFreq = 4;
        }
        if(this.fireFreq >= 150)
        {
         this.fireFreq = 150;
        }

        if(this.velocity >= 10)
        {
            this.velocity = 10;
        }
        if(this.velocity <= 3)
        {
            this.velocity = 3;
        }

        var curveAcentValue = 0.15;
        this.xp += Math.floor((level*(level/3)+level+3)/5 * this.xp * (level * curveAcentValue));

        // this.fireFreq = ((255 - this.speed) / (this.speed * 0.4)) * (1.1 + (this.speedModifier*1000));
        // if(this.fireFreq <= 4)
        // {
        //     this.fireFreq = 4;
        // }
        // if(this.fireFreq >= 25)
        // {
        //     this.fireFreq = 25;
        // }
        // if(this.velocity >= 9)
        // {
        //     this.velocity = 9;
        // }
        // if(this.velocity <= 2)
        // {
        //     this.velocity = 2;
        // }
        
        // console.log('enemy HP', this.hp, this.defenseModifier, level, this.xp, this.name);

        // var calcXP = (level*level+level+3)/4* 20 * level;
        // console.log(calcXP, 'level', level);
        // console.log('xp',this.xp,  Math.floor(calcXP / this.xp));
        // console.log('demages',this.getDemage('magical'),this.getDemage('physical'));
    }
    getDemage(type = 'physical'){
        var damageMultiplier = 0;//Math.random() < this.critialChance ? 0.5 : 2;
        var demage = 0;
        if(type === 'physical'){
            //mudar essa segunda divisao pra alterar significativamente o dano
            demage = this.battlePower * (this.level / 5) + ((this.level * (this.attack * (this.level / 20)) * 15) / 256) * 3 / 2;
        }else if(type === 'magical'){
            demage = this.spellPower * this.level + (this.level * (this.magicPower * 3/2) * this.spellPower / 32);
        }
        demage = demage + ((demage / 2) * damageMultiplier);
        // console.log(type, demage);
        return demage;
    }
    getHurt(demage, type = 'physical'){
        if(type === 'physical'){
            demage = (demage * (255 - this.defense) / 256) + 1;
        }else if(type === 'magical'){
            demage = (demage * (255 - this.magicDefense) / 256) + 1;
        }

        return demage;
    }
    getSpeed(type = 'normal'){
        var currentSpeed;
        if(type === 'normal'){
            currentSpeed = (96 * (this.speed + 20)) / 16;//normal
        }else if(type === 'haste'){
            currentSpeed = (126 * (this.speed + 20)) / 16;//haste
        }else if(type === 'slow'){
            currentSpeed = (48 * (this.speed + 20)) / 16; //slow
        }
        return currentSpeed;
    }
}