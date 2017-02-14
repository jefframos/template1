imporst * as PIXI from 'pixi.js';
import config  from '../../config';
import TweenLite from 'gsap';
import Wall from '../entity/Wall';
import Coin from '../entity/Coin';
import RedCoin from '../entity/RedCoin';
import ChainBox from '../entity/ChainBox';
import Diamond from '../entity/Diamond';
import Enemy from '../entity/Enemy';
import Item from '../entity/Item';
import Portal from '../entity/Portal';

export default class LevelBuilder{
	constructor(game, data){
		this.game = game;
		this.coinPool = [];
		this.redCoinPool = [];
		this.portalPool = [];
		this.diamondPool = [];
		this.enemyPool = [];
		this.itemPool = [];
		this.wallPool = [];
	}
	reset(){
		this.currentPattern = null;
	}
	getPatternByLabel(label){
		for (var i = 0; i < config.levels.length; i++) {
			if(config.levels[i].label == label){
				return config.levels[i];
				break;
			}
		}
	}
	getAnyPattern(singleLane){

		console.log(this.game.levelPercentage);

		let id =Math.floor( Math.random() * config.levels.length);
		while(this.lastPattern.label == config.levels[id].label || config.levels[id].first || (singleLane && (!config.levels[id].singleLane || !config.levels[id].straight))){
			 id =Math.floor( Math.random() * config.levels.length);
		}
		// console.log('lastPattern',this.lastPattern.label, config.levels[id].label);
		return config.levels[id];
	}
	getFirstPattern(){
		if(this.debugging){
			for (var i = 0; i < config.levels.length; i++) {
				if(config.levels[i].first && config.levels[i].debug){
					return config.levels[i];
					break;
				}
			}
		}else{			
			for (var i = 0; i < config.levels.length; i++) {
				if(config.levels[i].first){
					return config.levels[i];
					break;
				}
			}
		}
	}
	getLastCheckPoints(){
		return this.game.checkPoints[this.game.checkPoints.length - 1]
	}
	buildPattern(first, middlePoint = null, singleLane = false, patternLabel = null){
		// let middlePoint = {x:0,y:0}
		let pattern;
		
			// if(patternLabel){
			// 	pattern = this.getPatternByLabel(patternLabel)
			// }else{
				if(first){
					this.currentPattern = this.getFirstPattern();
					pattern = this.currentPattern;
					this.firstPattern = pattern;
					middlePoint = {x:0,y:0}
					middlePoint.x = pattern.beginZone.x;
					middlePoint.y = -pattern.height;

					this.game.currentSpawnPoint.x = pattern.playerPosition.x
					this.game.currentSpawnPoint.y = pattern.playerPosition.y
					this.game.currentSpawnPoint.side = pattern.playerSide

					// this.currentHeight = -pattern.height;
					// console.log(middlePoint);
				}else{
					if(patternLabel){
						pattern = this.getPatternByLabel(patternLabel)
					}else{
						pattern = this.getAnyPattern(singleLane);
					}
					if(middlePoint && singleLane){
						middlePoint.y -= pattern.height;
					}
					if(!middlePoint){
						let lastCheck = this.getLastCheckPoints();
						if(lastCheck.boundsEnd.length > 1){
							middlePoint = {x:lastCheck.boundsEnd[1].x - 32,y:lastCheck.boundsEnd[1].y - pattern.height}
						}else{
							middlePoint = {x:lastCheck.boundsEnd[0].x - 32,y:lastCheck.boundsEnd[0].y - pattern.height}
						}
					}
				}
			// }

		for (var i = 0; i < pattern.walls.length; i++) {
			let wall = pattern.walls[i];
			this.addWall(wall, middlePoint);
		}


		for (var i = 0; i < pattern.coins.length; i++) {
			let coin = pattern.coins[i];
			this.addCoin(coin, middlePoint);
		}

		if(pattern.redCoins.length){
			let chain = {
				chainList:[],
				endChain:null,
			}
			let chainBox = null;
			for (var i = 0; i < pattern.redCoins.length; i++) {
				let coin = pattern.redCoins[i];

				//if(coin.)
				if(coin.type.indexOf('end') !== -1){
					let diamond = this.addDiamond(coin, middlePoint);
					chain.endChain = diamond;
					diamond.hide();
				}else if(coin.type.indexOf('start') !== -1){
					chainBox = this.addChainBox(coin, middlePoint);
				}else{
					let redCoin = this.addRedCoin(coin, middlePoint);
					chain.chainList.push(redCoin);
				}

			}
			if(chainBox){
				chainBox.chain = chain;
			}
		}

		if(pattern.portals.length){
			let portalData = {
				targets:[],
				portalEntry:null
			}
			let portalEntry = null;
			for (var i = 0; i < pattern.portals.length; i++) {
				let portalD = pattern.portals[i];

				//if(coin.)
				if(portalD.type.indexOf('entry') !== -1){
					portalEntry = this.addPortal(portalD, middlePoint);
					portalData.portalEntry = portalEntry;
				}else{
					let portal = this.addPortal(portalD, middlePoint);
					portalData.targets.push(portal);
				}

			}
			if(portalEntry){
				portalEntry.portalData = portalData;
			}
		}
		for (var i = 0; i < pattern.diamonds.length; i++) {
			let diamond = pattern.diamonds[i];
			this.addDiamond(diamond, middlePoint);
		}

		for (var i = 0; i < pattern.enemies.length; i++) {
			let enemy = pattern.enemies[i];
			this.addEnemy(enemy, middlePoint);
		}

		for (var i = 0; i < pattern.itens.length; i++) {
			let item = pattern.itens[i];
			this.addItem(item, middlePoint);
		}

		// for (var i = 0; i < pattern.portals.length; i++) {
		// 	let portal = pattern.portals[i];
		// 	this.addPortal(portal, middlePoint);
		// }

		this.addCheckpoint(pattern, middlePoint)

		if(!pattern.singleLane){
			let tempPattern = pattern;
			let lastCheck = this.getLastCheckPoints();
			// console.log(lastCheck.middlePoint);
			lastCheck.shape.tint = 0x006678;

			let tempPatternDup = null;
			let label = null
			for (var j = 0; j < tempPattern.endZone.length; j++) {
				let endZone = tempPattern.endZone[j]
				if(tempPatternDup){
					label = tempPatternDup.label;
					// console.log(tempPatternDup.label);
				}
				tempPatternDup = this.buildPattern(false,{x:endZone.x + lastCheck.middlePoint.x - 32, y:lastCheck.boundsEnd[0].y}, true, label);
			}
			this.game.forceSingleLane = 1;
		}

		this.lastPattern = pattern;
		return pattern
	}

	addCheckpoint(pattern, middlePoint={x:0,y:0}){

		let endZones = []
		let endShapes = []
		for (var i = 0; i < pattern.endZone.length; i++) {
			let checkEnd = new PIXI.Graphics().beginFill(0xffff00).drawRect(0,0,pattern.endZone[i].polyline[1].x, 50);
			checkEnd.alpha = 0;
			checkEnd.x = middlePoint.x + pattern.endZone[i].x;//middlePoint.x + this.player.getRadius()*2;
			checkEnd.y = middlePoint.y + pattern.endZone[i].y;
			//this.game.gameContainer.addChild(checkEnd);
			endZones.push({x:checkEnd.x,y:checkEnd.y,width:checkEnd.width,height:checkEnd.height})
			endShapes.push(checkEnd);
		}

		let check = new PIXI.Graphics().beginFill(0xff0000).drawRect(0,0,pattern.beginZone.polyline[1].x, 200);
		check.alpha = 0.5;
		check.x = middlePoint.x + pattern.beginZone.x;//middlePoint.x + this.game.player.getRadius()*2;
		check.y = middlePoint.y + pattern.beginZone.y - 200;
		// this.game.gameContainer.addChild(check);

		this.game.checkPoints.push({
			single:endZones.length == 1,
			shape:check,
			respawPoint:{
				x: pattern.playerPosition.x + middlePoint.x + pattern.beginZone.x - 32,
				y: pattern.playerPosition.y + middlePoint.y + pattern.beginZone.y - 32,
				side: pattern.playerSide
			},
			bounds:{x:check.x,y:check.y,width:check.width,height:check.height},
			boundsEnd:endZones,
			middlePoint: middlePoint
		})
	}

	getPortal(){
		// for (var i = 0; i < this.portalPool.length; i++) {
		// 	if(this.portalPool[i].kill){
		// 		return this.portalPool[i]
		// 	}
		// }
		let portal = new Portal(this.game);
		this.portalPool.push(portal);
		return portal;

	}

	addPortal(portalData, middlePoint = {x:0,y:0}){
		let portal = this.getPortal();
		portal.add();
		portal.build(portalData)
		this.game.gameContainer.addChild(portal)
		// this.game.portalList.push(portal);
		this.game.coinList.push(portal);
		portal.x = portalData.x + middlePoint.x;
		portal.y = portalData.y + middlePoint.y//this.game.currentHeight + middlePoint.y;
		this.game.updateList.push(portal);

		// console.log(portal.x, portal.y);

		return portal
	}
	getItem(){
		// for (var i = 0; i < this.itemPool.length; i++) {
		// 	if(!this.itemPool[i].isActive){
		// 		return this.itemPool[i]
		// 	}
		// }
		let item = new Item(this.game);
		this.itemPool.push(item);
		return item;

	}
	addItem(itemData, middlePoint = {x:0,y:0}){
		
		let item = this.getItem();
		item.add();
		item.build(itemData)
		this.game.gameContainer.addChild(item)
		this.game.itemList.push(item);
		this.game.coinList.push(item);
		item.x = itemData.x + middlePoint.x;
		item.y = itemData.y + middlePoint.y//this.game.currentHeight + middlePoint.y;
		this.game.updateList.push(item);

		return item
	}
	getEnemy(){
		for (var i = 0; i < this.enemyPool.length; i++) {
			if(this.enemyPool[i].kill){
				return this.enemyPool[i]
			}
		}
		let enemy = new Enemy(this.game);
		this.enemyPool.push(enemy);
		return enemy;

	}
	addEnemy(enemyData, middlePoint = {x:0,y:0}){
		
		let enemy = this.getEnemy()// new Enemy(this.game, enemyData);
		enemy.build(enemyData);
		this.game.gameContainer.addChild(enemy)
		this.game.enemyList.push(enemy);
		enemy.x = enemyData.x + middlePoint.x;
		enemy.y = enemyData.y + middlePoint.y//this.game.currentHeight + middlePoint.y;
		this.game.updateList.push(enemy);

		return enemy
	}
	getRedCoin(){
		for (var i = 0; i < this.redCoinPool.length; i++) {
			if(this.redCoinPool[i].kill){
				return this.redCoinPool[i]
			}
		}
		let coin = new RedCoin(this.game);
		this.redCoinPool.push(coin);
		return coin;

	}
	addRedCoin(redCoinData, middlePoint = {x:0,y:0}){
		
		let coin = this.getRedCoin()
		coin.add();
		coin.build(redCoinData);
		this.game.gameContainer.addChild(coin)
		this.game.coinList.push(coin);
		coin.x = redCoinData.x + middlePoint.x;
		coin.y = redCoinData.y + middlePoint.y//this.game.currentHeight + middlePoint.y;
		this.game.updateList.push(coin);

		return coin
	}
	addChainBox(chainData, middlePoint = {x:0,y:0}){
		
		let chainBox = new ChainBox(this.game);
		chainBox.add();
		chainBox.build(chainData);
		this.game.gameContainer.addChild(chainBox)
		this.game.coinList.push(chainBox);
		chainBox.x = chainData.x + middlePoint.x;
		chainBox.y = chainData.y + middlePoint.y//this.game.currentHeight + middlePoint.y;
		this.game.updateList.push(chainBox);

		return chainBox
	}
	getCoin(){
		for (var i = 0; i < this.coinPool.length; i++) {
			if(this.coinPool[i].kill){
				return this.coinPool[i]
			}
		}
		let coin = new Coin(this.game);
		this.coinPool.push(coin);
		return coin;

	}
	addCoin(coinData, middlePoint = {x:0,y:0}){
		
		let coin = this.getCoin();//new Coin(this.game, coinData);
		coin.add();
		coin.build(coinData);
		this.game.gameContainer.addChild(coin)
		this.game.coinList.push(coin);
		coin.x = coinData.x + middlePoint.x;
		coin.y = coinData.y + middlePoint.y//this.currentHeight + middlePoint.y;
		this.game.updateList.push(coin);

		return coin
	}
	getDiamond(){
		for (var i = 0; i < this.diamondPool.length; i++) {
			if(this.diamondPool[i].kill){
				return this.diamondPool[i]
			}
		}
		let diamond = new Diamond(this.game);
		this.diamondPool.push(diamond);
		return diamond;

	}
	addDiamond(diamondData, middlePoint = {x:0,y:0}){
		
		let diamond = this.getDiamond();
		diamond.add();
		diamond.build(diamondData);
		this.game.gameContainer.addChild(diamond)
		this.game.coinList.push(diamond);
		diamond.x = diamondData.x + middlePoint.x;
		diamond.y = diamondData.y + middlePoint.y//this.game.currentHeight + middlePoint.y;
		this.game.updateList.push(diamond);

		return diamond
	}
	getWall(){
		for (var i = 0; i < this.wallPool.length; i++) {
			if(this.wallPool[i].kill){
				return this.wallPool[i]
			}
		}
		let wall = new Wall(this.game);
		this.wallPool.push(wall);
		return wall;

	}
	addWall(wallData, middlePoint = {x:0,y:0}){
		// console.log(wallData);
		let shape = [0, 0, wallData.width, 0, wallData.width,wallData.height , 0, wallData.height]
		let type = 'standard';

		if(wallData.properties){
			if(wallData.properties.slippery){
				type = 'slippery';
			}
			if(wallData.properties.fast){
				type = 'fast';
			}
		}
		let wall = this.getWall();
		wall.build(shape, type)
		this.game.gameContainer.addChild(wall)
		this.game.wallList.push(wall);
		wall.x = wallData.x + middlePoint.x;
		wall.y = wallData.y + middlePoint.y//this.game.currentHeight + middlePoint.y;
		wall.velocity.y = this.game.gameSpeed;
		this.game.updateList.push(wall);

		// console.log(this.wallPool.length);
	}
}