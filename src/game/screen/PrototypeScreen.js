import * as PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen';
import InputManager from '../InputManager';
import Camera from '../Camera';
import Cupcake from '../entity/Cupcake';
import StandardEnemy from '../entity/enemies/StandardEnemy';
import NestEntity from '../entity/enemies/NestEntity';
import Tanker from '../entity/enemies/Tanker';
import Bomber from '../entity/enemies/Bomber';
import Ranger from '../entity/enemies/Ranger';
import StandardBullet from '../entity/bullets/StandardBullet';
import TowerBullet from '../entity/bullets/TowerBullet';
import EnemyBullet from '../entity/bullets/EnemyBullet';
import Rock from '../entity/environment/Rock';
import Pine from '../entity/environment/Pine';
import Bush from '../entity/environment/Bush';
import Tower from '../entity/towers/Tower';
import Nest from '../entity/nest/Nest';
import Spawner from '../entity/spawner/Spawner';
import UITower from '../ui/UITower';
import UISpawner from '../ui/UISpawner';

export default class PrototypeScreen extends Screen{
	constructor(label){
		super(label);

		this.mapSrc = './assets/data/map_data_2.json';

		this.updateable = false;

		this.startLoad();

		this.oldStats = '';
	}

	startLoad(){
		let loader = new PIXI.loaders.Loader(); // you can also create your own if you want

		loader.add(this.mapSrc);

		loader.once('complete',this.onAssetsLoaded.bind(this));

		loader.load();
	}
	onAssetsLoaded(evt){

		if(this.buildedOnce){
			this.destroyGame();
		}

		this.buildedOnce = true;

		this.enemyList = [];
		this.environmentList = [];
		this.bulletList = [];
		this.uiList = [];
		this.spawnerList = [];

		// console.log(evt.resources['./assets/data/map1Data.json'].data.layers)//.data.layers);
		let map = evt.resources[this.mapSrc].data;
		let mapLayers = map.layers;
		config.worldBounds = [];
		config.towerList = [];
		config.spawnerList = [];
		config.nestList = [];
		config.players = [];
		config.wayPath = [];
		// console.log(map);
		this.worldBounds = {x:0,y:0, w:map.width * map.tilewidth, h:map.height * map.tileheight}
		// console.log(this.worldBounds);
		for (var i = 0; i < mapLayers.length; i++) {
			if(mapLayers[i].name == 'Ways'){
				for (var k = 0; k < mapLayers[i].objects.length; k++) {
					let path = []
					if(mapLayers[i].objects[k].visible){
						let polyline = (mapLayers[i].objects[k].polyline);
						for (var j = 0; j < polyline.length; j++) {
							path.push(polyline[j].x);
							path.push(polyline[j].y);
						}
						// console.log(mapLayers[i].objects[k]);

						if(mapLayers[i].objects[k].name == 'pathDown1'){
							console.log(path);
							// let cut = 44;
							// path.splice(cut, path.length -cut)
							// this.scaleArrayPoints(path)
							console.log(this.scaleArrayPoints(path, true));
						}
							// path.push(polyline[0].x);
							// path.push(polyline[0].y);
						config.wayPath.push(path)
					}
				}
				// console.log(polyline);
			}
			if(mapLayers[i].name == 'WorldBounds'){
				let polyline = (mapLayers[i].objects[0].polyline);
				for (var j = 1; j < polyline.length; j++) {
					config.worldBounds.push(polyline[j].x)
					config.worldBounds.push(polyline[j].y)
				}
			}
			if(mapLayers[i].name.indexOf('Towers') !== -1){
				let towers = mapLayers[i].objects;
				for (var j = 0; j < towers.length; j++) 
				{
					let tower = towers[j];
					// console.log(tower.name);
					config.towerList.push({name:tower.name, x:tower.x,y:tower.y,team:tower.properties.team});
				}
			}
			if(mapLayers[i].name.indexOf('Hero') !== -1){
				let hero = mapLayers[i].objects[0];
				config.players.push({team:hero.properties.team, x:hero.x,y:hero.y, name:hero.name, type:hero.type});
			}
			if(mapLayers[i].name.indexOf('Nests') !== -1){
				for (var j = 0; j < mapLayers[i].objects.length; j++) {
					let nest = mapLayers[i].objects[j];
					config.nestList.push({name:nest.name, x:nest.x, y:nest.y});
				}
			}
			if(mapLayers[i].name.indexOf('Spawner') !== -1 && mapLayers[i].visible){
				console.log(mapLayers[i]);
				let spawers = mapLayers[i].objects;
				let spwPosition = {x:0,y:0};
				let spawnerObject = {pos:null, team:-1, waypoints:[]};
				for (var j = 0; j < spawers.length; j++) {
					let data = spawers[j];
					if(data.name.indexOf('spawner') !== -1){
						spawnerObject.pos = {x:data.x,y:data.y};
						spawnerObject.team = data.properties.team;
					}
					else if(data.name.indexOf('waypoints') !== -1){
						let waypoints = [];
						// console.log(data);
						// if(data.properties.invertList){
						// 	for (var k = data.polyline.length - 1; k >= 1; k--) {
						// 	 	let wayPos = {x:data.polyline[k].x,y:data.polyline[k].y}
						// 	 	spawnerObject.waypoints.push(wayPos);
						// 	}
						// }else{
							for (var k = 1; k<data.polyline.length; k++) {
								let wayPos = {x:data.polyline[k].x,y:data.polyline[k].y}
								spawnerObject.waypoints.push(wayPos);
							}
						// }
					}
				}
				config.spawnerList.push(spawnerObject);
			}

		}

		this.configGame();
	}

	destroyGame(){
		for (var i = 0; i < this.spawnerList.length; i++) {
			this.spawnerList[i].kill = true;
		}
		for (var i = 0; i < this.towerList.length; i++) {
			this.towerList[i].kill = true;
		}
		for (var i = 0; i < this.nestList.length; i++) {
			this.nestList[i].kill = true;
		}
		for (var i = 0; i < this.bulletList.length; i++) {
			this.bulletList[i].kill = true;
		}
		for (var i = 0; i < this.enemyList.length; i++) {
			this.enemyList[i].kill = true;
		}

		for (var i = 0; i < this.uiList.length; i++) {
			this.uiList[i].kill = true;
		}

		this.cupcake.kill = true;

		this.cleanContainer(this.gameContainer)
		this.cleanContainer(this.entityContainer)
		this.cleanContainer(this.floorContainer)
		this.cleanContainer(this.UIContainer)

		// while(this.gameContainer.children){
		// 	this.gameContainer.removeChild(this.gameContainer.children[0]);
		// }

		// while(this.entityContainer.children){
		// 	this.entityContainer.removeChild(this.entityContainer.children[0]);
		// }

		// while(this.floorContainer.children){
		// 	this.floorContainer.removeChild(this.floorContainer.children[0]);
		// }
		// entityContainer
		// for (var i = 0; i < this.entitiesList.length; i++) {
		// 	this.entitiesList[i].kill = true;
		// }
	}
	cleanContainer(container){
		for (var i = container.children.length - 1; i >= 0; i--) {
			container.removeChild(container.children[i]);
		}
	}
	configGame(){
		// console.log('config');
		// this.gameContainer.scale.set(0.3)

		this.inputManager = new InputManager(this);
		this.gameContainer = new PIXI.Container();
		this.addChild(this.gameContainer);

		
		this.polyPts = this.scaleArrayPoints(config.worldBounds);

		// this.scaleArrayPoints(this.polyPts)
		var worldBoundsGraphic = new PIXI.Graphics();
		worldBoundsGraphic.beginFill(0xbbffff);
		worldBoundsGraphic.alpha = 0.2
		worldBoundsGraphic.drawPolygon(this.polyPts);
		worldBoundsGraphic.endFill();

		this.gameContainer.addChild(worldBoundsGraphic)


// console.log('way path', config.wayPath);
		for (var i = config.wayPath.length - 1; i >= 0; i--) {
			
			let wayGraphic = new PIXI.Graphics();
			wayGraphic.beginFill(0xffffff);
			wayGraphic.alpha = 0.1
			wayGraphic.drawPolygon(this.scaleArrayPoints(config.wayPath[i]));
			wayGraphic.endFill();
			wayGraphic.cacheAsBitmap = true;

			this.gameContainer.addChild(wayGraphic)
		}


		this.worldPolygon = new PIXI.Polygon(this.polyPts)


		this.floorContainer = new PIXI.Container();
		this.gameContainer.addChild(this.floorContainer);

		this.entityContainer = new PIXI.Container();
		this.gameContainer.addChild(this.entityContainer);

		let cupPos = this.scaleSinglePoint({x:config.players[0].x,y:config.players[0].y})

		this.cupcake = new Cupcake(this, cupPos, config.players[0].team);
		this.entityContainer.addChild(this.cupcake)
		this.addOnUpdateList(this.cupcake)


		// this.bomber = new Ranger(this, -1);
		// this.bomber.x = cupPos.x + 350
		// this.bomber.y = cupPos.y + 350
		// this.bomber.build()
		// this.bomber.setWaypoints([{x:cupPos.x + 150, y:cupPos.y + 150}])
		// this.entityContainer.addChild(this.bomber)
		// this.addOnUpdateList(this.bomber)
		// this.enemyList.push(this.bomber);


		for (var i = 0; i < config.spawnerList.length; i++) {
			var spawnerData = config.spawnerList[i];
			
			let spawner = new Spawner(this, spawnerData.team);
			this.entityContainer.addChild(spawner)
			this.addOnUpdateList(spawner)
			this.spawnerList.push(spawner);
			let tempPoint = this.scaleSinglePoint({x:spawnerData.pos.x,y:spawnerData.pos.y})
			spawner.x = tempPoint.x
			spawner.y = tempPoint.y
			spawner.build();
			this.setScales(spawner);

			for (var j = 1; j < spawnerData.waypoints.length; j++) {
				tempPoint = this.scaleSinglePoint({x:spawnerData.waypoints[j].x,y:spawnerData.waypoints[j].y})
				spawner.addWaypoint(tempPoint.x,tempPoint.y);
			}
		}

		this.towerList = [];
		for (var i = 0; i < config.towerList.length; i++) {
			var towerData = config.towerList[i];
			let tower = new Tower(this, towerData.team);
			tower.name = towerData.name;
			this.entityContainer.addChild(tower)
			this.addOnUpdateList(tower)
			this.towerList.push(tower);

			let tempPoint = this.scaleSinglePoint({x:towerData.x,y:towerData.y})

			tower.x = tempPoint.x;
			tower.y = tempPoint.y;

			this.setScales(tower);

			tower.build();
		}


		this.nestList = [];
		for (var j = 0; j < config.nestList.length; j++) {
			var nestData = config.nestList[j];

			let nest = new Nest(this);
			nest.name = nestData.name;

			this.entityContainer.addChild(nest)
			this.addOnUpdateList(nest)
			this.nestList.push(nest);

			let tempPoint = this.scaleSinglePoint({x:nestData.x,y:nestData.y})

			nest.x = tempPoint.x;
			nest.y = tempPoint.y;
			this.setScales(nest);

			nest.build();
		}

		
		// for (var i = 0; i < config.environmentList.length; i++) {
		// 	var envData = config.environmentList[i];
		// 	// console.log(envData);
		// 	var environmentEntity;

		// 	if(envData[0] == 'pine'){
		// 		environmentEntity = new Pine(this, true);
		// 	}else if(envData[0].indexOf('rock') !== -1){
		// 		console.log(envData[0]);
		// 		environmentEntity = new Rock(this, true);
		// 	}else if(envData[0].indexOf('bush') !== -1){
		// 		environmentEntity = new Bush(this, true);
		// 	}

		// 	this.entityContainer.addChild(environmentEntity)
		// 	//this.addOnUpdateList(environmentEntity)

		// 	environmentEntity.x = envData[1];
		// 	environmentEntity.y = envData[2];

		// 	environmentEntity.side = envData[3]
		// 	environmentEntity.starterScale = envData[4] * 2


		// 	// environmentEntity.y = Math.random() < 0.6? Math.random() * (config.height * 0.2) + config.height * 0.2: Math.random() * (this.worldBounds.h * 0.5) + config.height * 0.7;
		// 	this.setScales(environmentEntity);

		// 	this.environmentList.push(environmentEntity);

		// }


		this.updateable = true;



		this.camera = new Camera(this, this.gameContainer);
		this.speedUpValue = 1;


		this.timer = 0;

		// this.build();

		this.initUI();

		this.initGame();

	}
	
	gameOver(winner){
		this.oldStats += 'time: '+this.formatDate(this.timer)+ ' - team:'+ winner +'\n';
		this.updateable = false;
		this.startLoad();
	}
	updateUI(delta){
		for (var i = 0; i < this.uiList.length; i++) {
			if(this.uiList[i].updateable){
				this.uiList[i].update(delta);
			}
		}
	}
	formatDate(sec){
		var seconds = sec;
		// multiply by 1000 because Date() requires miliseconds
		var date = new Date(seconds * 1000);
		var hh = date.getUTCHours();
		var mm = date.getUTCMinutes();
		var ss = date.getSeconds();
		// If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
		// if (hh > 12) {hh = hh % 12;}
		// These lines ensure you have two-digits
		if (hh < 10) {hh = "0"+hh;}
		if (mm < 10) {mm = "0"+mm;}
		if (ss < 10) {ss = "0"+ss;}
		// This formats your string to HH:MM:SS
		var t = hh+":"+mm+":"+ss;
		return t
	}
	initUI(){
		this.UIContainer = new PIXI.Container();
		this.addChild(this.UIContainer);

		this.timerLabel = new PIXI.Text('0');
		this.UIContainer.addChild(this.timerLabel);

		this.statsLabel = new PIXI.Text(this.oldStats);
		this.UIContainer.addChild(this.statsLabel);
		this.statsLabel.scale.set(0.4);
		this.statsLabel.x = config.width / 2;

		let t1acc = 0;
		let t2acc = 0;
		let acc = 0;
		for (var i = this.towerList.length - 1; i >= 0; i--) {
			let tower = this.towerList[i]
			let uiTower = new UITower(this, tower);
			this.UIContainer.addChild(uiTower);
			uiTower.scale.set(0.4)
			if(tower.team == 0){
				t1acc ++
				acc = t1acc;
			}else{
				t2acc ++
				acc = t2acc;
				uiTower.x = config.width// - tower.width;
				uiTower.scale.x *= -1
			}

			uiTower.y = acc * 55;

			this.uiList.push(uiTower);
		}

		t1acc = 0;
		t2acc = 0;
		for (var i = this.spawnerList.length - 1; i >= 0; i--) {
			let spawner = this.spawnerList[i]
			let uiSpawner = new UISpawner(this, spawner);
			this.UIContainer.addChild(uiSpawner);
			uiSpawner.scale.set(0.6)

			if(spawner.team == 0){
			 	t1acc ++
			 	acc = t1acc;
				uiSpawner.x = (acc - 1) * 150 + 20
			}else{
			 	t2acc ++
			 	acc = t2acc;
			// 	uiTower.x = config.width// - tower.width;
			 	//uiSpawner.scale.x *= -1
				uiSpawner.x = -(acc - 1) * 150 - 20 + config.width - 120
			}

			uiSpawner.y = config.height - uiSpawner.height;


			uiSpawner.build();

			this.uiList.push(uiSpawner);
		}


	}
	initGame(){
		this.speedUpValue = 1;
		for (var i = this.spawnerList.length - 1; i >= 0; i--) {
			this.spawnerList[i].start();
		}

		// console.log();
		let wholeScale = 0.8//(config.width / 2) / this.worldBounds.w
		this.camera.zoom(wholeScale, 1, 0.5);
		// this.camera.zoom(0.35, 1, 0.2);
		this.camera.follow(this.cupcake);

		// this.gameOver()
	}
	addEnemy(type, position, waypoints, team){

		var tempEnemy;
		if(type == 'standard'){
			tempEnemy = new StandardEnemy(this, team);
		}else if(type == 'tanker'){
			tempEnemy = new Tanker(this, team);
		}else if(type == 'ranger'){
			tempEnemy = new Ranger(this, team);
		}else if(type == 'bomber'){
			tempEnemy = new Bomber(this, team);
		}else{
			tempEnemy = new NestEntity(this, team);
		}


		tempEnemy.setWaypoints(waypoints)


		this.entityContainer.addChild(tempEnemy)
		this.addOnUpdateList(tempEnemy)



		tempEnemy.x = position.x;
		tempEnemy.y = position.y;


		tempEnemy.build();


		// tempEnemy.setTarget({x:this.towerList[0].x,y:this.towerList[0].y})
		this.enemyList.push(tempEnemy);

		return tempEnemy;

	}
	build(){
		this.lastAction = null;
		super.build();

	}
	update ( delta ) {

		if(!this.updateable){
			return;
		}
		let newDelta = delta * this.speedUpValue;


		this.timer += newDelta;
		this.timerLabel.text = this.formatDate(this.timer);
		super.update(newDelta)


		this.camera.update(newDelta);
		this.inputManager.update();

		//let scaleFactor = 

		for (var i = 0; i < this.bulletList.length; i++) {
			if(this.bulletList[i].killed){
				this.floorContainer.addChild(this.bulletList[i]);
				this.bulletList.splice(i,1)
			}else{
				this.setScales(this.bulletList[i]);
			}
		}

		for (var i = 0; i < this.enemyList.length; i++) {
			if(this.enemyList[i].killed){
				this.floorContainer.addChild(this.enemyList[i]);
				this.enemyList.splice(i,1)
			}else{
				this.setScales(this.enemyList[i]);
			}
		}
		//console.log(scale *0.3 + 0.2);
		this.setScales(this.cupcake);

		this.entityContainer.children.sort(utils.depthCompare);

		this.environmentCollision(this.cupcake);

		// console.log(this.enemyList);
		// if(this.enemyList)
		// 	console.log(this.enemyList.length);
		//console.log(this.worldCollision(this.cupcake));
		this.updateUI(delta);
		
	}
	worldCollision(x,y) {
		if(this.worldPolygon.contains(x,y)){
			return false
		}else{
			return true
		}
	}
	environmentCollision(entity) {
	 	let collideList = [];
 		for (var i = 0; i < this.environmentList.length; i++) {
 			let colEnt = this.environmentList[i];	
 			if(colEnt.y > entity.y){
	 			let dist = utils.distance(entity.x,entity.y, colEnt.x,colEnt.y)
	 			let distFactor = entity.getExternalRadius() * 4;
	 			if(dist < distFactor){

	 				this.environmentList[i].updateAlpha((dist / (distFactor) )*0.9+0.1);

	 				// let angle = Math.atan2(entity.y - colEnt.y, entity.x - colEnt.x) * 180 / 3.14
	 				// let ableToHit = Math.abs(angle) > 150 || Math.abs(angle) < 30;
	 				// let left = Math.abs(angle) > 150 && entity.side == 1;
	 				// let right = Math.abs(angle) < 30 && entity.side == -1;

	 				// collideList.push({entity:colEnt, angle:angle, dist:dist, ableToHit: ableToHit, left:left, right:right});
	 			}else{
	 				this.environmentList[i].updateAlpha(1);
	 			}
 			}else{
 				this.environmentList[i].updateAlpha(1);
 			}
 		}

	 	//collideList.sort(utils.distCompare);

	 	//return collideList
	 }

	getSingleCollisionList(type){

		let entitiesList = [];
		if(type == 'enemy'){
			entitiesList = this.enemyList;
		}else if(type == 'player'){
			entitiesList.push(this.cupcake);
		}else if(type == 'tower'){
			entitiesList = this.towerList;
		}
		return entitiesList

	}
	getCollisionsArray(type){

		let entitiesList = [];

		if(typeof type === 'object'){
			for (var i = type.length - 1; i >= 0; i--) {
				if(entitiesList.length == 0){
					entitiesList = this.getSingleCollisionList(type[i]);
				}else{
					entitiesList = entitiesList.concat(this.getSingleCollisionList(type[i]));
				}
			}
		}else{
			entitiesList = this.getSingleCollisionList(type);
		}
		return entitiesList
	}

	getExternalColisionList(entity, type, rival) {
		if(!entity.collidable){
			return;
		}
	 	let collideList = [];
	 	let entitiesList = this.getCollisionsArray(type);
	 	
 		for (var i = 0; i < entitiesList.length; i++) {
 			let colEnt = entitiesList[i];
 			if(!rival || (rival && entity.team != colEnt.team)){
	 			if(colEnt.collidable){	 				
		 			let dist = utils.distance(entity.x,entity.y, colEnt.x,colEnt.y)
		 			if(dist < colEnt.getExternalRadius() + entity.getExternalRadius()){

		 				let angle = Math.atan2(entity.y - colEnt.y, entity.x - colEnt.x) * 180 / 3.14
		 				let ableToHit = Math.abs(angle) > 150 || Math.abs(angle) < 30;
		 				let left = Math.abs(angle) > 150 && entity.side == 1;
		 				let right = Math.abs(angle) < 30 && entity.side == -1;

		 				let trueLeft = colEnt.x > entity.x;//Math.abs(angle) > 150;
		 				let trueRight = colEnt.x < entity.x;// Math.abs(angle) < 30;

		 				collideList.push({entity:colEnt, angle:angle, dist:dist, ableToHit: ableToHit, left:left, right:right,
								trueLeft:trueLeft,
		 						trueRight:trueRight});
		 			}
		 		}
	 		}
 		}

	 	collideList.sort(utils.distCompare);
	 	return collideList
	 }

	 getCollisionList(entity, type, rival) {
	 	if(!entity.collidable){
			return;
		}
	 	let collideList = [];
	 	let entitiesList = this.getCollisionsArray(type);
	 	// console.log(entitiesList);
 		for (var i = 0; i < entitiesList.length; i++) {
 			let colEnt = entitiesList[i];
 			if(!rival || (rival && entity.team != colEnt.team)){
	 			if(colEnt.collidable){		 			
		 			let dist = utils.distance(entity.x,entity.y, colEnt.x,colEnt.y)
		 			if(dist < colEnt.getRadius() + entity.getRadius()){
		 				let angle = Math.atan2(entity.y - colEnt.y, entity.x - colEnt.x) * 180 / 3.14
		 				let ableToHit = Math.abs(angle) > 150 || Math.abs(angle) < 30;
		 				let left = Math.abs(angle) > 150 && entity.side == 1;
		 				let right = Math.abs(angle) < 30 && entity.side == -1;
		 				let trueLeft = Math.abs(angle) > 150;
		 				let trueRight = Math.abs(angle) < 30;
		 				collideList.push(
		 					{
		 						entity:colEnt,
		 						angle:angle,
		 						dist:dist,
		 						ableToHit: ableToHit,
		 						left:left,
		 						right:right ,
								trueLeft:trueLeft,
		 						trueRight:trueRight
		 					}
		 				);
		 			}
				}
			}
	 		collideList.sort(utils.distCompare);	 			
 		}
	 	return collideList
	 }

	 getSimpleEntityCollision(entity1, entity2, rival) {
	 	if(!entity1.collidable){
			return;
		}
		if((rival && entity1.team == entity2.team)){
			return;
		}

	 	let collideList = [];
		let colEnt = entity2;
		if(colEnt.collidable){		 			
 			let dist = utils.distance(entity1.x,entity1.y, colEnt.x,colEnt.y)
 			if(dist < colEnt.getRadius() + entity1.getRadius()){
 				let angle = Math.atan2(entity1.y - colEnt.y, entity1.x - colEnt.x) * 180 / 3.14
 				let ableToHit = Math.abs(angle) > 150 || Math.abs(angle) < 30;
 				let left = Math.abs(angle) > 150 && entity1.side == 1;
 				let right = Math.abs(angle) < 30 && entity1.side == -1;

 				let trueLeft = Math.abs(angle) > 150;
 				let trueRight = Math.abs(angle) < 30;

 				collideList.push(
 					{
 						entity1:colEnt,
 						angle:angle,
 						dist:dist,
 						ableToHit: ableToHit,
 						left:left,
 						right:right ,
						trueLeft:trueLeft,
 						trueRight:trueRight
 					}
 				);
 			}
		}
	 	return collideList
	 }

	 getMapWidthDistanceFactor(x, y, debug){

	 	//////////////////////////////////////////////TA ROLANDO com alguns resultados estranhos ainda
	 	// normalmente no calculo de alguns paths
	 	let w = this.worldBounds.w / 2;

	 	let value = 0;

	 	let hFactor = this.getMapHeightDistanceFactor(y)
	 	value = Math.abs(utils.distance(x,0,w,0) / w) * -1

	 	if(x >= w){
	 		value *= -1
	 		//hFactor = 1-hFactor
	 	}
	 	let inc = 0.7
	 	// value =  value * 0.5 + (0.5 * (hFactor * value))
	 	value =  value * inc 
	 	value *= hFactor
	 	// value =  value * inc + ((hFactor * (value)))

	 	if(debug){
	 		console.log('------',x, y, value, hFactor);
	 	}
	 	return value
	 }

	 getMapHeightDistanceFactor(y){
	 	let h = this.worldBounds.h;

	 	let value = 1-utils.distance(0,y,0,h) / h +  0.3
	 	value = value * 0.7 + 0.3

	 	return value
	 }
	 scaleSinglePoint(point){
	 	let rpoint = {x:point.x+ (this.worldBounds.w*0.6* this.getMapWidthDistanceFactor(point.x, point.y)),y:point.y * this.getMapHeightDistanceFactor(point.y)};
	 	
	 	return rpoint
	 }

	 scaleArrayPoints(arr, debug){
	 	let rArr = [];
	 	for (var i = 1; i < arr.length; i+=2) {	
		 	if(debug){
		 		console.log(arr[i-1], this.worldBounds.w*0.6, this.getMapWidthDistanceFactor(arr[i-1], arr[i], debug));
		 	}
		 	rArr.push(
		 		Math.floor(
		 			arr[i-1] + 
		 			(
		 				this.worldBounds.w*0.6* this.getMapWidthDistanceFactor(arr[i-1], arr[i]))
		 			)
		 		)
		 	rArr.push(
		 		Math.floor(
		 			arr[i] * this.getMapHeightDistanceFactor(arr[i])
		 			)
		 		)
	 	}

	 	return rArr
	 }

	setScales(entity){

		if(!entity.setDistance){
			return;
		}

		// console.log(entity, 1-utils.distance(0,entity.y,0,config.height) / config.height);
		//console.log('2'+entity);

		let h = this.worldBounds.h;
		entity.setDistance(1-utils.distance(0,entity.y,0,h) / h +  0.3);

	}
	updateKeyUp(key){
		this.updateKeyDown();

		if(key == 'action5'){
			this.cupcake.speedNormal();
		}
	}
	addBullet(params){
		var bullet = null;
		if(params.type == 'enemy'){
			bullet = new EnemyBullet(this, params);
		}else{
			bullet = new StandardBullet(this, params);
		}
		bullet.build();
		this.entityContainer.addChild(bullet)
		this.addOnUpdateList(bullet)
		bullet.position.x = params.pos.x
		bullet.position.y = params.pos.y

		this.bulletList.push(bullet);

		this.setScales(bullet);

	}
	addTowerBullet(params){
		// console.log(src);
		let bullet = new TowerBullet(this, params);
		bullet.build();
		this.entityContainer.addChild(bullet)
		this.addOnUpdateList(bullet)
		bullet.position.x = params.pos.x
		bullet.position.y = params.pos.y

		this.bulletList.push(bullet);

		this.setScales(bullet);

	}
	updateKeyDown(){
		this.speedUpValue = 1;
		// window.game.frameskip = 1;
		for (var i = 0; i < this.inputManager.keys.length; i++) {
			if(this.inputManager.keys[i] == 'action1'){
				//console.log('space');

				
				//this.gameOver()
				this.lastAction = this.inputManager.keys[i];
				this.cupcake.attack();
			}
			if(this.inputManager.keys[i] == 'action2'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				this.cupcake.jump();
			}
			if(this.inputManager.keys[i] == 'action3'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				this.cupcake.rangeAttack();
			}
			if(this.inputManager.keys[i] == 'action4'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				// console.log(this.cupcake);
				this.cupcake.areaAttack();
			}
			if(this.inputManager.keys[i] == 'action5'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				this.cupcake.speedUp();
			}
			if(this.inputManager.keys[i] == 'action6'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				window.game.frameskip = 3;
				//this.speedUpValue = 5;
				// this.cupcake.die();
			}
			if(this.inputManager.keys[i] == 'action7'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				if(window.game.frameskip == 1){
					window.game.frameskip = 15;
				}else{
					window.game.frameskip = 1
				}
				//this.speedUpValue = 10;
				// this.cupcake.die();
			}
			if(this.inputManager.keys[i] == 'action8'){
				//console.log('space');
				this.gameOver();
				//this.speedUpValue = 10;
				// this.cupcake.die();
			}
			if(this.inputManager.keys[i] == 'zoomIn'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				this.camera.zoom2(0.1);
				//this.speedUpValue = 10;
				// this.cupcake.die();
			}
			if(this.inputManager.keys[i] == 'zoomOut'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				this.camera.zoom2(-0.1);
				//this.speedUpValue = 10;
				// this.cupcake.die();
			}
		}

		// console.log('axes',this.inputManager.leftAxes);
		this.cupcake.move(this.inputManager.leftAxes);

		if(this.inputManager.rightAxes && this.inputManager.rightAxes[1]){
			let zoomValue = this.inputManager.rightAxes[1] + 0;
			if(Math.abs(zoomValue) > 0.1){
				this.camera.zoom2(zoomValue * -0.001);
			}
		}
		
	}
	
	stopAction(type){
	}
	transitionIn(){

	}
}