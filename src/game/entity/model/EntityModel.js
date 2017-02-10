export default class EntityModel{
    constructor (name, label, stats, modifiers, graphicsData, config){

        this.level = 1;
        this.name = name;
        this.label = label;
        this.stats = stats;
        this.modifiers = modifiers;
        this.graphicsData = graphicsData;
        this.config = config;

        if(!name){
            this.playerClass = 'warrior';
        }else{
            this.playerClass = name;
        }


        this.vigor = this.stats.vigor;
        this.speed = this.stats.speed;
        this.stamina = this.stats.stamina;
        this.magicPower = this.stats.magicPower;
        this.battlePower = this.stats.battlePower;
        this.defense = this.stats.defense;
        this.magicDefense = this.stats.magicDefense;

        //modifiers
        this.baseHPModifier = this.modifiers.baseHPModifier;
        this.baseMPModifier = this.modifiers.baseMPModifier;
        this.vigorModifier = this.modifiers.vigorModifier;
        this.speedModifier = this.modifiers.speedModifier;
        this.staminaModifier = this.modifiers.staminaModifier;
        this.magicPowerModifier = this.modifiers.magicPowerModifier;
        this.battlePowerModifier = this.modifiers.battlePowerModifier;
        this.defenseModifier = this.modifiers.defenseModifier;
        this.magicDefenseModifier = this.modifiers.magicDefenseModifier;
                    
        this.hpMin = this.stats.hpMin;

        this.baseHP = this.level * (20 / this.baseHPModifier);

        this.spellPower = 20; //speel do bolt
        this.weaponPower = 30; //mithirl knife
        this.defenseArmor = 0;//no armor
        this.magicDefenseArmor = 0;//no armor
        this.hpMax = this.hpMin + (this.baseHP*(this.stamina + 32))/32;
        this.hp = this.hpMax;

        this.baseMP = this.level* (20 / this.baseMPModifier);
        this.mpMax = (this.baseMP*(this.magicPower+32))/32;
        this.mp = this.mpMax;

        // console.log(this.baseMP, this.mpMax);
        this.critialChance = 0.0;
        this.speedStatus = 'normal';
        this.vigor2 = this.vigor*2;
        if(this.vigor >= 128){
            this.vigor2 = 255;
        }
        this.attack = this.battlePower + this.vigor2;
        this.xp = 0;

        // this.velocity = 6 - (255 - this.speed) / 25 + 5;
        this.updateVelocity();

        this.fireFreq = ((255 - this.speed) / (this.speed * 0.4)) * 1.3;


        this.entity = null;


        this.csvStr = 'level,hp,mp,vigor,speed,stamina,magicPower,battlePower,defense,attack,magicDefense,velocity,fireFreq,demagePhysical,demageMagical\n';
        this.csvStr += this.level+','+
        Math.floor(this.hpMax)+','+
        Math.floor(this.mpMax)+','+
        Math.floor(this.vigor)+','+
        Math.floor(this.speed)+','+
        Math.floor(this.stamina)+','+
        Math.floor(this.magicPower)+','+
        Math.floor(this.battlePower)+','+
        Math.floor(this.defense)+','+
        Math.floor(this.attack)+','+
        Math.floor(this.magicDefense)+','+
        Math.floor(this.velocity)+','+
        Math.floor(this.fireFreq)+','+
        Math.floor(this.getDemage('physical'))+','+
        Math.floor(this.getDemage('magical'))+'\n';

        // console.log('PlayerModel', this);

        // this.levelUp(this.level);

        var nextl = this.level;
        var befl = this.level - 1;
        this.toNextLevel = (nextl*nextl+nextl+3)/4* 20 * nextl;
        this.toBeforeLevel = (befl*befl+befl+3)/4* 20 * befl;

    }
    updateVelocity(){
        this.velocity = 8 - (255 - this.speed) / 35 + 2;
        this.velocity /= 2;
    }

    getNormalizedAtt(){
        return {
            speed:Math.floor(this.speed)/255,
            stamina:Math.floor(this.stamina)/255,
            vigor:Math.floor(this.vigor)/255,
            magicPower:Math.floor(this.magicPower)/255,
            battlePower:Math.floor(this.battlePower)/255,
            defense:Math.floor(this.defense)/255,
            attack:Math.floor(this.attack)/255,
            magicDefense:Math.floor(this.magicDefense)/255,
            velocity:Math.floor(this.velocity)/255,
            fireFreq:Math.floor(this.fireFreq)/255
        }
    }

    log(){
        console.log();
        console.log('stats');
        console.log('class,', this.playerClass);
        console.log('level,',Math.floor(this.level));
        console.log('hp,',Math.floor(this.hpMax));
        console.log('mp,',Math.floor(this.mpMax));
        console.log('vigor,',Math.floor(this.vigor));
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
    clone(){
        return new PlayerModel(this.name,
                    this.label,
                    this.stats,
                    this.modifiers,
                    this.graphicsData,
                    this.config);
    }
    logCSV(){
        console.log(this.csvStr);
    }
    levelUp(){
        this.level ++;
        
        var nextl = this.level;
        var befl = this.level - 1;
        this.toNextLevel = (nextl*nextl+nextl+3)/4* 20 * nextl;
        this.toBeforeLevel = (befl*befl+befl+3)/4* 20 * befl;

        this.vigor += (this.vigor*this.vigor+this.vigor+3)/4*this.vigorModifier;
        this.speed += (this.speed*this.speed+this.speed+3)/4*this.speedModifier;
        this.stamina += (this.stamina*this.stamina+this.stamina+3)/4*this.staminaModifier;
        this.magicPower += (this.magicPower*this.magicPower+this.magicPower+3)/4*this.magicPowerModifier;
        this.battlePower += (this.battlePower*this.battlePower+this.battlePower+3)/4*this.battlePowerModifier;
        this.defense += (this.defense*this.defense+this.defense+3)/4*this.defenseModifier;
        // this.attack += (this.attack*this.attack+this.attack+3)/4*this.attackModifier;
        this.magicDefense += (this.magicDefense*this.magicDefense+this.magicDefense+3)/4*this.magicDefenseModifier;

        this.vigorModifier -=0.0005;
        this.speedModifier -=0.0005;
        this.staminaModifier -=0.0005;
        this.magicPowerModifier -=0.0005;
        this.battlePowerModifier -=0.0005;
        this.defenseModifier -=0.0005;
        this.magicDefenseModifier -=0.0005;

        if(this.vigorModifier <= 0.001)
        {
            this.vigorModifier = 0.001;
        }
        if(this.speedModifier <= 0.001)
        {
            this.speedModifier = 0.001;
        }
        if(this.staminaModifier <= 0.001)
        {
            this.staminaModifier = 0.001;
        }
        if(this.magicPowerModifier <= 0.001)
        {
            this.magicPowerModifier = 0.001;
        }
        if(this.battlePowerModifier <= 0.001)
        {
            this.battlePowerModifier = 0.001;
        }
        if(this.defenseModifier <= 0.001)
        {
            this.defenseModifier = 0.001;
        }
        if(this.magicDefenseModifier <= 0.001)
        {
            this.magicDefenseModifier = 0.001;
        }

        this.vigor2 = this.vigor*2;
        if(this.vigor >= 128){
            this.vigor2 = 255;
        }
        this.attack = this.battlePower + this.vigor2;



        if(this.vigor > 255){
            this.vigor = 255;
        }
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

// this.baseMP = this.level* (20 / this.baseMPModifier);
//      this.mpMax = (this.baseMP*(this.magicPower-32))/32;

        this.baseHPModifier -= 0.0085;
        this.baseMPModifier += 0.02;
        this.baseHP = this.level* (20 / this.baseHPModifier);
        this.baseMP = this.level* (20 / this.baseMPModifier);

        this.hpMax += (this.baseHP*(this.stamina+32))/32;
        this.hp = this.hpMax;

        this.mpMax += (this.baseMP*(this.magicPower+32))/32;
        this.mp = this.mpMax;

        // this.velocity = 8 - (255 - this.speed) / 35  + 2;// + 5;
        // this.velocity /= 3;
        this.updateVelocity();
        this.fireFreq = ((255 - this.speed) / (this.speed * 0.4)) * (1.1 + (this.speedModifier*1000));
        if(this.fireFreq <= 4)
        {
            this.fireFreq = 4;
        }
        if(this.fireFreq >= 25)
        {
            this.fireFreq = 25;
        }
        if(this.velocity >= 9)
        {
            this.velocity = 9;
        }
        if(this.velocity <= 2)
        {
            this.velocity = 2;
        }

        // console.log(this.level,'<- levelUp, xp ->',this.xp);


        this.csvStr += this.level+','+
        Math.floor(this.hpMax)+','+
        Math.floor(this.mpMax)+','+
        Math.floor(this.vigor)+','+
        Math.floor(this.speed)+','+
        Math.floor(this.stamina)+','+
        Math.floor(this.magicPower)+','+
        Math.floor(this.battlePower)+','+
        Math.floor(this.defense)+','+
        Math.floor(this.attack)+','+
        Math.floor(this.magicDefense)+','+
        Math.floor(this.velocity)+','+
        Math.floor(this.fireFreq)+','+
        Math.floor(this.getDemage('physical'))+','+
        Math.floor(this.getDemage('magical'))+'\n';

        if(this.entity){
            this.entity.levelUp();
        }

    }
    updateLevel(){
        // console.log((this.level*this.level+this.level+3)/4, 'compare');
        for (var i = this.level; i <= 99; i++) {
            var calcXP = (i*i+i+3)/4* 20 * i;
            // console.log(this.xp, calcXP, 'level', i);

            if(this.xp > calcXP){
                this.levelUp();
            }else
            {
                break;
            }
        }
    }
    resetPoints(){
        this.hp = this.hpMax;
        this.mp = this.mpMax;
    }
    updateXp(xp){
        // console.log('xp', xp);
        this.xp += xp;
        this.updateLevel();
        if(this.entity){
            this.entity.updateXP(xp);
        }
    }
    getDemage(type = 'physical'){
        var damageMultiplierCritical = Math.random() < this.critialChance ? 0.5 : 2;
        var damageMultiplier = (Math.random()/2) + 1;
        var demage = 0;
        if(type === 'physical'){
            demage = this.battlePower * this.level + ((this.level * this.attack * this.weaponPower) / 256) * 3 / 2;
            // demage = this.battlePower + ((this.level * this.level * this.attack * this.weaponPower) / 256) * 3 / 2;
        }else if(type === 'magical'){
            demage = this.spellPower * 4 + (this.level * this.magicPower * this.spellPower / 32);
        }else if(type === 'range'){
            demage = this.speed *0.25* this.level + ((this.level * this.attack * this.weaponPower) / 256) * 0.1;
        }
        //o demage comentado abaixo funciona muito bem em um rpg de turno
        //demage = damageMultiplier * demage + ((demage / 2) * damageMultiplierCritical);

        //por enquanto está retornando 30% do dano padrão pelos algoritimos do final fantasy 6 -> http://www.rpglegion.com/ff6/ff6alg.txt
        demage = (damageMultiplier * demage + ((demage / 2) * damageMultiplierCritical)) * 0.3;
        return demage;
    }
    getHurt(demage, type = 'physical'){
        if(type === 'physical'){
            demage = (demage * (255 - this.defense - this.defenseArmor +(3 - Math.random() * 10)) / 256) + 1;
        }else if(type === 'magical'){
            demage = (demage * (255 - this.magicDefense - this.magicDefenseArmor +(3 - Math.random() * 10)) / 256) + 1;
        }

        return demage;
    }
    getSpeed(type = 'normal'){
        var currentSpeed
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