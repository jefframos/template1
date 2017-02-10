import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen';

export default class LoadScreen extends Screen{
	constructor(label){
		super(label);
	}
	build(){
		super.build();
		
		this.mapSrc = './assets/map.json';

		// this.screenManager.change('GameScreen')

		this.startLoad();
	}

	toGame(){
		this.screenManager.change('GameScreen')
	}
	startLoad(){
		let loader = new PIXI.loaders.Loader(); // you can also create your own if you want

		loader.add(this.mapSrc);

		loader.once('complete',this.onAssetsLoaded.bind(this));

		loader.load();
	}
	onAssetsLoaded(evt){

		let map = evt.resources[this.mapSrc].data;
		let mapLayers = map.layers;

		config.tileWidth = map.tilewidth;
		// console.log(map.tilewidth);
		// console.log(mapLayers);


		this.levels = [];


		for (var i = 0; i < mapLayers.length; i++) {
			let levelObj = {
				walls:[],
				diamonds:[],
				coins:[],
				enemies:[],
				redCoins:[],
				itens:[],
				portals:[],
				beginZone:null,
				label:null,
				endZone:[],
				first:false,
				debug:false,
				height:0,
				middle:0,
				straight:false,
				singleLane:true,
				playerSide:1,
				playerPosition:{x:0,y:0}
			}
			if(mapLayers[i].visible && mapLayers[i].name.indexOf('Pattern')  !== -1){
				// console.log(mapLayers[i]);
				if(mapLayers[i].properties && mapLayers[i].properties.first){
					levelObj.first = true;
				}
				if(mapLayers[i].properties && mapLayers[i].properties.debug){
					levelObj.debug = true;
				}
				levelObj.label = mapLayers[i].name;
				for (var j = 0; j < mapLayers[i].objects.length; j++) {
					let obj = mapLayers[i].objects[j];
					if(obj.type.indexOf('wall')  !== -1){

						levelObj.walls.push(obj);
					}
					if(obj.type == 'enemy'){
						levelObj.enemies.push(obj);
					}
					if(obj.type == 'coin'){
						levelObj.coins.push(obj);
					}
					if(obj.type.indexOf('chain')  !== -1){
						levelObj.redCoins.push(obj);
					}

					if(obj.type.indexOf('portal')  !== -1){
						levelObj.portals.push(obj);
					}

					if(obj.type.indexOf('item')  !== -1){
						levelObj.itens.push(obj);
					}
					if(obj.type == 'diamond'){
						levelObj.diamonds.push(obj);
					}
					if(obj.type == 'beginzone'){
						levelObj.beginZone = obj
					}
					if(obj.type == 'endzone'){
						levelObj.endZone.push(obj);
					}
					if(obj.type == 'player'){
						// console.log(obj.gid > 8);
						if(obj.gid > 8){
							levelObj.playerSide = -1
						}
						levelObj.playerPosition.x = obj.x + obj.width;
						levelObj.playerPosition.y = obj.y;
					}
				}

				levelObj.height = levelObj.beginZone.y - levelObj.endZone[0].y;
				levelObj.middle = -levelObj.beginZone.x//levelObj.beginZone.polyline[1].x - levelObj.beginZone.x - config.width / 2;
				if(levelObj.endZone.length > 1){
					levelObj.singleLane = false
				}else{
					levelObj.straight = utils.distance(levelObj.beginZone.x,0,levelObj.endZone[0].x,0) < 64;
				}
				levelObj.endZone.sort(utils.xCompare);
				levelObj.redCoins.sort(utils.alphabetCompare);
				// console.log(levelObj.redCoins);
				this.levels.push(levelObj);				
			}
		}

		for (var i = 0; i < this.levels.length; i++) {
			let level = this.levels[i];
			level.beginZone.x += level.middle + config.tileWidth;
			level.playerPosition.x += level.middle + config.tileWidth;
			// console.log(level.playerPosition.y , level.beginZone.y , level.height);
			level.playerPosition.y = level.playerPosition.y - level.beginZone.y;
			for (var j = 0; j < level.endZone.length; j++) {
				level.endZone[j].x += level.middle + config.tileWidth;
			}

			for (var j = 0; j < level.walls.length; j++) {
				level.walls[j].x += level.middle + config.tileWidth;
				level.walls[j].y += level.endZone[0].y;
			}

			for (var j = 0; j < level.coins.length; j++) {
				level.coins[j].x += level.middle + level.coins[j].width + config.tileWidth - (level.coins[j].width * 0.5);
				level.coins[j].y += level.endZone[0].y - level.coins[j].height/2;
			}

			for (var j = 0; j < level.redCoins.length; j++) {
				level.redCoins[j].x += level.middle + level.redCoins[j].width + config.tileWidth - (level.redCoins[j].width * 0.5);
				level.redCoins[j].y += level.endZone[0].y - level.redCoins[j].height/2;
			}

			for (var j = 0; j < level.portals.length; j++) {
				level.portals[j].x += level.middle + level.portals[j].width + config.tileWidth - (level.portals[j].width * 0.5);
				level.portals[j].y += level.endZone[0].y - level.portals[j].height/2;
			}

			for (var j = 0; j < level.itens.length; j++) {
				level.itens[j].x += level.middle + level.itens[j].width + config.tileWidth - (level.itens[j].width * 0.5);
				level.itens[j].y += level.endZone[0].y - level.itens[j].height/2;
			}

			for (var j = 0; j < level.diamonds.length; j++) {
				level.diamonds[j].x += level.middle + level.diamonds[j].width + config.tileWidth - (level.diamonds[j].width * 0.5);
				level.diamonds[j].y += level.endZone[0].y - level.diamonds[j].height/2;
			}

			for (var j = 0; j < level.enemies.length; j++) {
				level.enemies[j].x += level.middle + level.enemies[j].width + config.tileWidth - (level.enemies[j].width * 0.5);
				level.enemies[j].y += level.endZone[0].y - level.enemies[j].height/2;
			}
			
		}

		console.log(this.levels);
		config.levels = this.levels;
		this.toGame();
	}
}
