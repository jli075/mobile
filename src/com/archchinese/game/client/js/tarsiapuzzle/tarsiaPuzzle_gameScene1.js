//the first play scene of this game. This scene runs after the title scene.
 tarsiaPuzzle.gameScene1 = (function() {		    
	var scene = fn_createScene(tarsiaPuzzle.getGameSceneOneId());
	
	// NOTE, this init method will be called by the framework first.It is called
	// before preload, create and update.
	scene.init = function() {
		this.chineseList = ["樱桃", "猕猴桃", "蓝莓", "桃子", "西瓜", "香蕉", "菠萝", "草莓", "柠檬", "菠萝", "草莓", "柠檬"];
		//
		//this.pinyinList = ["ying1 tao2","mi2 hou2 tao2", "lan2 mei2","tao2 zi5", "xi1 gua1","xiang1 jiao1", "bo1 luo2", "cao3 mei2", "ning2 meng2"];
		this.englishList = ["Cherry", "Kiwi", "Blueberry", "Peach", "Watermelon", "Banana", "Pineapple", "Strawberry", "Lemon", "Pineapple", "Strawberry", "Lemon"];
		//
		
	}
	
	scene.preload = function() {
		
		
	};
	
	scene.create = function() {
		this.colorBank = [0x800000, 0x9a6324, 0x808000, 0x008080, 0xe6194b, 0xf58231, 0xffe119, 0xbcf60c, 0x3cb44b, 0x46f0f0, 0x4363d8, 0x911eb4, 0xf032e6, 0x808080, 0xfabebe, 0xffd8b1, 0xfffac8, 0xaaffc3, 0xe6beff]
		fn_shuffle(this.colorBank);
		this.triangleMargins = 6;
		//1*triangleMargins for side
		//1.5*triangleMargins for corner
		this.triangleSize = 256;
		if(this.chineseList.length<=9){
			this.numTriangles = 9;
		}else if(this.chineseList.length<=18){
			this.numTriangles = 16;
		}
		this.contDepth = 5;
		
		this.combinedList = [];
		for(var i = 0; i <this.chineseList.length; i++){
			if(Math.random()<0.5){
				var arr = [this.chineseList[i], this.englishList[i]];
			}else{
				var arr = [this.englishList[i], this.chineseList[i]];
			}
			this.combinedList.push(arr);
		}
		while(this.combinedList.length<this.numTriangles){
			this.combinedList.push(["",""])
		}
		console.log(this.combinedList.length)
		this.triangleUps = []
		this.triangleDowns = [];
		
		fn_shuffle(this.combinedList);
		
		var tri1 = this.drawTriangleUp(this.triangleSize);
		var tri2 = this.drawTriangleUp(this.triangleSize);
		var tri3 = this.drawTriangleDown(this.triangleSize);
		var tri4 = this.drawTriangleUp(this.triangleSize);
		var tri5 = this.drawTriangleUp(this.triangleSize);
		var tri6 = this.drawTriangleDown(this.triangleSize);
		var tri7 = this.drawTriangleUp(this.triangleSize);
		var tri8 = this.drawTriangleDown(this.triangleSize);
		var tri9 = this.drawTriangleUp(this.triangleSize);
		this.triangleUps = [tri1,tri2,tri4,tri5,tri7,tri9]
		this.triangleDowns = [tri3,tri6,tri8]
		
		if(this.numTriangles == 16){
			var tri10 = this.drawTriangleUp(this.triangleSize);
			var tri11 = this.drawTriangleDown(this.triangleSize);
			var tri12 = this.drawTriangleUp(this.triangleSize);
			var tri13 = this.drawTriangleDown(this.triangleSize);
			var tri14 = this.drawTriangleUp(this.triangleSize);
			var tri15 = this.drawTriangleDown(this.triangleSize);
			var tri16 = this.drawTriangleUp(this.triangleSize);
			this.triangleUps = [tri1,tri2,tri4,tri5,tri7,tri9,tri10,tri12,tri14,tri16]
			this.triangleDowns = [tri3,tri6,tri8,tri11,tri13,tri15]
		}
		
		var arrInd = [];
		for(var i = 0; i<this.numTriangles; i++){
			arrInd.push(i);
		}
	
		
		var randNum = Math.floor(Math.random()*arrInd.length)
		tri1.bottomInd = arrInd[randNum];
		arrInd.splice(randNum,1);
		randNum = Math.floor(Math.random()*arrInd.length)
		tri2.rightInd = arrInd[randNum];
		arrInd.splice(randNum,1);
		randNum = Math.floor(Math.random()*arrInd.length)
		tri2.bottomInd = arrInd[randNum];
		arrInd.splice(randNum,1);
		tri3.topInd = tri1.bottomInd;
		tri3.leftInd = tri2.rightInd;
		randNum = Math.floor(Math.random()*arrInd.length)
		tri3.rightInd = arrInd[randNum];
		arrInd.splice(randNum,1);
		tri4.leftInd = tri3.rightInd
		randNum = Math.floor(Math.random()*arrInd.length)
		tri4.bottomInd = arrInd[randNum];
		arrInd.splice(randNum,1);
		randNum = Math.floor(Math.random()*arrInd.length)
		tri5.rightInd = arrInd[randNum];
		arrInd.splice(randNum,1);
		tri6.leftInd = tri5.rightInd;
		tri6.topInd = tri2.bottomInd;
		randNum = Math.floor(Math.random()*arrInd.length)
		tri6.rightInd = arrInd[randNum];
		arrInd.splice(randNum,1);
		tri7.leftInd = tri6.rightInd;
		randNum = Math.floor(Math.random()*arrInd.length)
		tri7.rightInd = arrInd[randNum];
		arrInd.splice(randNum,1);
		tri8.topInd = tri4.bottomInd;
		tri8.leftInd = tri7.rightInd;
		randNum = Math.floor(Math.random()*arrInd.length)
		tri8.rightInd = arrInd[randNum];
		arrInd.splice(randNum,1);
		tri9.leftInd = tri8.rightInd;
		
		if(this.numTriangles == 16){
			randNum = Math.floor(Math.random()*arrInd.length)
			tri5.bottomInd = arrInd[randNum];
			arrInd.splice(randNum,1);
			randNum = Math.floor(Math.random()*arrInd.length)
			tri7.bottomInd = arrInd[randNum];
			arrInd.splice(randNum,1);
			randNum = Math.floor(Math.random()*arrInd.length)
			tri9.bottomInd = arrInd[randNum];
			arrInd.splice(randNum,1);
			randNum = Math.floor(Math.random()*arrInd.length)
			tri10.rightInd = arrInd[randNum];
			arrInd.splice(randNum,1);
			randNum = Math.floor(Math.random()*arrInd.length)
			tri11.rightInd = arrInd[randNum];
			arrInd.splice(randNum,1);
			randNum = Math.floor(Math.random()*arrInd.length)
			tri12.rightInd = arrInd[randNum];
			arrInd.splice(randNum,1);
			randNum = Math.floor(Math.random()*arrInd.length)
			tri13.rightInd = arrInd[randNum];
			arrInd.splice(randNum,1);
			randNum = Math.floor(Math.random()*arrInd.length)
			tri14.rightInd = arrInd[randNum];
			arrInd.splice(randNum,1);
			randNum = Math.floor(Math.random()*arrInd.length)
			tri15.rightInd = arrInd[randNum];
			arrInd.splice(randNum,1);
			tri11.leftInd = tri10.rightInd;
			tri11.topInd = tri5.bottomInd;
			tri12.leftInd = tri11.rightInd;
			tri13.leftInd = tri12.rightInd;
			tri13.topInd = tri7.bottomInd;
			tri14.leftInd = tri13.rightInd;
			tri15.leftInd = tri14.rightInd;
			tri15.topInd = tri9.bottomInd;
			tri16.leftInd = tri15.rightInd;
			 
		}
		
		this.containerArr=[];
		
		this.triangles = [tri1,tri2,tri3,tri4,tri5,tri6,tri7,tri8,tri9];
		if(this.numTriangles == 16){
			this.triangles = [tri1,tri2,tri3,tri4,tri5,tri6,tri7,tri8,tri9,tri10,tri11,tri12,tri13,tri14,tri15,tri16];
		}
		for(var i = 0; i <this.triangles.length; i++){
			var temp = this.createTriangleContainer(this.triangles[i]);
			this.containerArr.push(temp);
		}
		
		this.locations = [[fn_getCanvasWidth()/2,fn_getCanvasHeight()/2-(this.triangleSize + 1.5*this.triangleMargins)*0.866],[fn_getCanvasWidth()/2-(this.triangleSize + 2*this.triangleMargins)/2, fn_getCanvasHeight()/2],[fn_getCanvasWidth()/2, fn_getCanvasHeight()/2],[fn_getCanvasWidth()/2+(this.triangleSize + 2*this.triangleMargins)/2, fn_getCanvasHeight()/2],[fn_getCanvasWidth()/2-(this.triangleSize + 2*this.triangleMargins), fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866],[fn_getCanvasWidth()/2-(this.triangleSize + 2*this.triangleMargins)/2, fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866],[fn_getCanvasWidth()/2, fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866],[fn_getCanvasWidth()/2+(this.triangleSize + 2*this.triangleMargins)/2, fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866],[fn_getCanvasWidth()/2+(this.triangleSize + 2*this.triangleMargins), fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866]];
		if(this.numTriangles == 16){
			this.locations = [
			                  [fn_getCanvasWidth()/2,fn_getCanvasHeight()/2-(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2-(this.triangleSize + 2*this.triangleMargins)/2, fn_getCanvasHeight()/2],
			                  [fn_getCanvasWidth()/2, fn_getCanvasHeight()/2],
			                  [fn_getCanvasWidth()/2+(this.triangleSize + 2*this.triangleMargins)/2, fn_getCanvasHeight()/2],
			                  [fn_getCanvasWidth()/2-(this.triangleSize + 2*this.triangleMargins), fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2-(this.triangleSize + 2*this.triangleMargins)/2, fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2, fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2+(this.triangleSize + 2*this.triangleMargins)/2, fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2+(this.triangleSize + 2*this.triangleMargins), fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2-(this.triangleSize + 2*this.triangleMargins)*1.5,fn_getCanvasHeight()/2+2*(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2-(this.triangleSize + 2*this.triangleMargins),fn_getCanvasHeight()/2+2*(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2-(this.triangleSize + 2*this.triangleMargins)/2, fn_getCanvasHeight()/2+2*(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2, fn_getCanvasHeight()/2+2*(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2+(this.triangleSize + 2*this.triangleMargins)/2, fn_getCanvasHeight()/2+2*(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2+(this.triangleSize + 2*this.triangleMargins), fn_getCanvasHeight()/2+2*(this.triangleSize + 1.5*this.triangleMargins)*0.866],
			                  [fn_getCanvasWidth()/2+(this.triangleSize + 2*this.triangleMargins)*1.5,fn_getCanvasHeight()/2+2*(this.triangleSize + 1.5*this.triangleMargins)*0.866]
			                  ];
		}

		this.upLocations = [this.locations[0],this.locations[1],this.locations[3],this.locations[4],this.locations[6],this.locations[8]]
		this.downLocations = [this.locations[2],this.locations[5],this.locations[7]]
		if(this.numTriangles == 16){
			this.upLocations = [this.locations[0],this.locations[1],this.locations[3],this.locations[4],this.locations[6],this.locations[8],this.locations[19],this.locations[11],this.locations[13],this.locations[15]]
			this.downLocations = [this.locations[2],this.locations[5],this.locations[7],this.locations[10],this.locations[12],this.locations[14]]
		}
		
		fn_shuffle(this.upLocations);
		fn_shuffle(this.downLocations);
		
		for(var i = 0; i<this.containerArr.length; i++){
			if(i==2||i==5||i==7||i==10||i==12||i==14){
				this.assignDownLocations(i);
			}else{
				this.assignUpLocations(i);
			}
		}
		//Phaser.Actions.PlaceOnEllipse(this.containerArr, new Phaser.Geom.Ellipse(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2, fn_getCanvasWidth()*0.6, fn_getCanvasHeight()*0.8, 0, 6.28))
		//(fn_getCanvasHeight()/2*3+(this.triangleSize + 1.5*this.triangleMargins)*0.866)/4
		
		var tempGraphics = this.add.graphics();
		tempGraphics.lineStyle(8, 0x000000, 1.0);
		//tempGraphics.strokeTriangle(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2-(this.triangleSize + 1.5*this.triangleMargins)*0.866*1.5, fn_getCanvasWidth()/2+(this.triangleSize + 2*this.triangleMargins)*1.5, fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866*1.5, fn_getCanvasWidth()/2-(this.triangleSize + 2*this.triangleMargins)*1.5, fn_getCanvasHeight()/2+(this.triangleSize + 1.5*this.triangleMargins)*0.866*1.5);
		
		var borderTri = new Phaser.Geom.Triangle.BuildEquilateral(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2-(1.5*this.triangleSize + 3.5*this.triangleMargins)*0.866, 3*this.triangleSize + 6*this.triangleMargins);
		
	    tempGraphics.strokeTriangleShape(borderTri);
	}
	
	scene.assignUpLocations = function(ind){
		var randInd = Math.floor(Math.random()*this.upLocations.length);
		this.containerArr[ind].setPosition(this.upLocations[randInd][0], this.upLocations[randInd][1]);
		this.upLocations.splice(randInd,1);
	}.bind(scene);

	scene.assignDownLocations = function(ind){
		var randInd = Math.floor(Math.random()*this.downLocations.length);
		this.containerArr[ind].setPosition(this.downLocations[randInd][0], this.downLocations[randInd][1]);
		this.downLocations.splice(randInd,1);
	}.bind(scene);
	
	scene.createTriangleContainer = function(triangle){
		var fontSize = 32;
	    this.graphics = this.add.graphics();
		
		if(typeof triangle.bottomInd != 'undefined'){
			if(this.combinedList[triangle.bottomInd][0]!=""){
				var text = this.add.text(0,this.triangleSize/2-48, this.combinedList[triangle.bottomInd][0], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				text.y = 128-bounds.height*1.75;
				
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=2;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				var container = this.add.container(500, 500, [triangle, text]);
				container.setSize(this.triangleSize, 0.866*this.triangleSize);
				this.combinedList[triangle.bottomInd][0]="";
			}else{
				var text = this.add.text(0,this.triangleSize/2-48, this.combinedList[triangle.bottomInd][1], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				text.y = 128-bounds.height*1.75;
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=2;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				var container = this.add.container(500, 500, [triangle, text]);
				container.setSize(this.triangleSize, 0.866*this.triangleSize);
				this.combinedList[triangle.bottomInd][1]="";
			}
			if(typeof triangle.rightInd != 'undefined'){
				if(this.combinedList[triangle.rightInd][0]!=""){
					var text = this.add.text(0+this.triangleSize/6,16, this.combinedList[triangle.rightInd][0], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
					var bounds = text.getBounds();
					while(bounds.width>((this.triangleSize/2))){
						fontSize-=2;
						text.setStyle({
						    fontSize: fontSize + 'px',
						});
						bounds = text.getBounds();
					}
					text.angle = 60;
					container.add(text);
					this.combinedList[triangle.rightInd][0]="";
				}else{
					var text = this.add.text(0+this.triangleSize/6,16, this.combinedList[triangle.rightInd][1], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
					var bounds = text.getBounds();
					while(bounds.width>((this.triangleSize/2))){
						fontSize-=2;
						text.setStyle({
						    fontSize: fontSize + 'px',
						});
						bounds = text.getBounds();
					}
					text.angle = 60;
					container.add(text);
					this.combinedList[triangle.rightInd][1]="";
				}
			}
			if(typeof triangle.leftInd !== 'undefined'){
				if(this.combinedList[triangle.leftInd][0]!=""){
					var text = this.add.text(0-this.triangleSize/6,16, this.combinedList[triangle.leftInd][0], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
					var bounds = text.getBounds();
					while(bounds.width>((this.triangleSize/2))){
						fontSize-=2;
						text.setStyle({
						    fontSize: fontSize + 'px',
						});
						bounds = text.getBounds();
					}
					text.angle = -60;
					container.add(text);
					this.combinedList[triangle.leftInd][0]="";
				}else{
					var text = this.add.text(0-this.triangleSize/6,16, this.combinedList[triangle.leftInd][1], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
					var bounds = text.getBounds();
					while(bounds.width>((this.triangleSize/2))){
						fontSize-=2;
						text.setStyle({
						    fontSize: fontSize + 'px',
						});
						bounds = text.getBounds();
					}
					text.angle = -60;
					container.add(text);
					this.combinedList[triangle.leftInd][1]="";
				}
			}
			this.setTriangleInteractive(container);
		}else if(typeof triangle.topInd !== 'undefined'){
			if(this.combinedList[triangle.topInd][0]!=""){
				var text = this.add.text(0,0-this.triangleSize/2+48, this.combinedList[triangle.topInd][0], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				text.y = -128+bounds.height*1.75;
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=2;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				var container = this.add.container(500, 500, [triangle, text]);
				container.setSize(this.triangleSize, 0.866*this.triangleSize);
				this.combinedList[triangle.topInd][0]="";
			}else{
				var text = this.add.text(0,0-this.triangleSize/2+48, this.combinedList[triangle.topInd][1], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				text.y = -128+bounds.height*1.75;
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=2;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				var container = this.add.container(500, 500, [triangle, text]);
				container.setSize(this.triangleSize, 0.866*this.triangleSize);
				this.combinedList[triangle.topInd][1]="";
			}
			if(typeof triangle.rightInd !== 'undefined'){
				if(this.combinedList[triangle.rightInd][0]!=""){
					var text = this.add.text(0+this.triangleSize/6,-16, this.combinedList[triangle.rightInd][0], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
					var bounds = text.getBounds();
					while(bounds.width>((this.triangleSize/2))){
						fontSize-=2;
						text.setStyle({
						    fontSize: fontSize + 'px',
						});
						bounds = text.getBounds();
					}
					text.angle = -60;
					container.add(text);
					this.combinedList[triangle.rightInd][0]="";
				}else{
					var text = this.add.text(0+this.triangleSize/6,-16, this.combinedList[triangle.rightInd][1], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
					var bounds = text.getBounds();
					while(bounds.width>((this.triangleSize/2))){
						fontSize-=2;
						text.setStyle({
						    fontSize: fontSize + 'px',
						});
						bounds = text.getBounds();
					}
					text.angle = -60;
					container.add(text);
					this.combinedList[triangle.rightInd][1]="";
				}
			}
			if(typeof triangle.leftInd !== 'undefined'){
				if(this.combinedList[triangle.leftInd][0]!=""){
					var text = this.add.text(0-this.triangleSize/6,-16, this.combinedList[triangle.leftInd][0], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
					var bounds = text.getBounds();
					while(bounds.width>((this.triangleSize/2))){
						fontSize-=2;
						text.setStyle({
						    fontSize: fontSize + 'px',
						});
						bounds = text.getBounds();
					}
					text.angle = 60;
					container.add(text);
					this.combinedList[triangle.leftInd][0]="";
				}else{
					var text = this.add.text(0-this.triangleSize/6,-16, this.combinedList[triangle.leftInd][1], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
					var bounds = text.getBounds();
					while(bounds.width>((this.triangleSize/2))){
						fontSize-=2;
						text.setStyle({
						    fontSize: fontSize + 'px',
						});
						bounds = text.getBounds();
					}
					text.angle = 60;
					container.add(text);
					this.combinedList[triangle.leftInd][1]="";
				}
			}	
		}else if(typeof triangle.rightInd == 'undefined'){
			if(this.combinedList[triangle.leftInd][0]!=""){
				var text = this.add.text(0-this.triangleSize/6,16, this.combinedList[triangle.leftInd][0], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=2;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				text.angle = -60;
				var container = this.add.container(500, 500, [triangle, text]);
				container.setSize(this.triangleSize, 0.866*this.triangleSize);
				this.combinedList[triangle.leftInd][0]="";
			}else{
				var text = this.add.text(0-this.triangleSize/6,16, this.combinedList[triangle.leftInd][1], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=2;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				text.angle = -60;
				var container = this.add.container(500, 500, [triangle, text]);
				container.setSize(this.triangleSize, 0.866*this.triangleSize);
				this.combinedList[triangle.leftInd][1]="";
			}
	
		}else if(typeof triangle.leftInd == 'undefined'){
			if(this.combinedList[triangle.rightInd][0]!=""){
				var text = this.add.text(0+this.triangleSize/6,16, this.combinedList[triangle.rightInd][0], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=2;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				text.angle = 60;
				var container = this.add.container(500, 500, [triangle, text]);
				container.setSize(this.triangleSize, 0.866*this.triangleSize);
				this.combinedList[triangle.rightInd][0]="";
			}else{
				var text = this.add.text(0+this.triangleSize/6,16, this.combinedList[triangle.rightInd][1], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=2;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				text.angle = 60;
				var container = this.add.container(500, 500, [triangle, text]);
				container.setSize(this.triangleSize, 0.866*this.triangleSize);
				this.combinedList[triangle.rightInd][1]="";
			}
		}else{
			if(this.combinedList[triangle.leftInd][0]!=""){
				var text = this.add.text(0-this.triangleSize/6,16, this.combinedList[triangle.leftInd][0], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=2;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				text.angle = -60;
				var container = this.add.container(500, 500, [triangle, text]);
				container.setSize(this.triangleSize, 0.866*this.triangleSize);
				this.combinedList[triangle.leftInd][0]="";
			}else{
				var text = this.add.text(0-this.triangleSize/6,16, this.combinedList[triangle.leftInd][1], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=2;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				text.angle = -60;
				var container = this.add.container(500, 500, [triangle, text]);
				container.setSize(this.triangleSize, 0.866*this.triangleSize);
				this.combinedList[triangle.leftInd][1]="";
			}
			if(this.combinedList[triangle.rightInd][0]!=""){
				var text = this.add.text(0+this.triangleSize/6,16, this.combinedList[triangle.rightInd][0], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=2;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				text.angle = 60;
				container.add(text);
				this.combinedList[triangle.rightInd][0]="";
			}else{
				var text = this.add.text(0+this.triangleSize/6,16, this.combinedList[triangle.rightInd][1], { font: 'bold 32px Arial', color: '#000000'}).setOrigin(0.5);
				var bounds = text.getBounds();
				while(bounds.width>((this.triangleSize/2))){
					fontSize-=1;
					text.setStyle({
					    fontSize: fontSize + 'px',
					});
					bounds = text.getBounds();
				}
				text.angle = 60;
				container.add(text);
				this.combinedList[triangle.rightInd][1]="";
			}
		}


		this.setTriangleInteractive(container);
		return container;
	}.bind(scene);
	
	scene.drawTriangleUp = function(triangleLength) {
		
		var graphics = this.make.graphics({ lineStyle: { width: this.triangleMargins, color: 0x000000 } });
		graphics.fillStyle(this.colorBank[0], 1);

		this.colorBank.shift();
	    var triangle = new Phaser.Geom.Triangle.BuildEquilateral(triangleLength/2+this.triangleMargins, this.triangleMargins, triangleLength);
	    graphics.strokeTriangleShape(triangle);
	    graphics.fillTriangleShape(triangle)
	    triangleLength+=this.triangleMargins*2;
	    var triangleId = fn_createId();
    	graphics.generateTexture(triangleId, triangleLength, 0.866*triangleLength);
    	var triangleFinal = this.add.sprite(0, 0, triangleId).setOrigin(0.5);
	    return triangleFinal;	
	    
	}.bind(scene);
	
	scene.drawTriangleDown = function(triangleLength) {
		var graphics = this.make.graphics({ lineStyle: { width: this.triangleMargins, color: 0x000000 } });
		graphics.fillStyle(this.colorBank[0], 1);
		this.colorBank.shift();
		
	    var triangle = new Phaser.Geom.Triangle.BuildEquilateral(triangleLength/2+this.triangleMargins, this.triangleMargins, triangleLength);

	    graphics.strokeTriangleShape(triangle);
	    graphics.fillTriangleShape(triangle)
	    triangleLength+=this.triangleMargins*2;
	    var triangleId = fn_createId();
    	graphics.generateTexture(triangleId, triangleLength, 0.866*triangleLength);
    	var triangleFinal = this.add.sprite(0,0, triangleId).setOrigin(0.5);
	    triangleFinal.angle = 180;
	    return triangleFinal;		
	}.bind(scene);

	scene.setTriangleInteractive = function(triangle){
		
		if(this.triangleUps.indexOf(triangle.getAt(0))<0){
			var shape = new Phaser.Geom.Triangle(0,0,triangle.width,0,triangle.width/2, triangle.height)
		}else{
			var shape = new Phaser.Geom.Triangle(triangle.width, triangle.height, 0, triangle.height, triangle.width/2, 0)
		}
		triangle.setInteractive(shape, Phaser.Geom.Triangle.Contains);
		this.input.setDraggable(triangle);
		triangle.on('dragstart', function(pointer){
			triangle.setDepth(this.contDepth);
			this.contDepth+=1;
		}.bind(scene));
		triangle.on('drag', function (pointer, dragX, dragY) {
	    	triangle.setPosition(dragX, dragY);
	        
	    }.bind(scene), this);
		triangle.on('dragend', function(pointer, dragX, dragY){
			this.checkPopIn(triangle);
			this.checkCorrect();
		}.bind(scene), this);

		
		
		
	}.bind(scene);
	
	scene.checkCorrect = function(){
		var correct = true;
		for(var i =0; i <this.containerArr.length; i++){
			if(this.containerArr[i].x != this.locations[i][0] || this.containerArr[i].y != this.locations[i][1]){
				correct = false;
			}
		}
		if(correct){
			console.log("Correct");
		}else{
			console.log("Incorrect")
		}
	}.bind(scene);
	
	scene.checkPopIn = function(triangle){
		var spaceOccupied = false;
		for(var i = 0; i < this.locations.length; i++){
			if(Math.abs(this.locations[i][0]-triangle.x)<=80 && Math.abs(this.locations[i][1]-triangle.y)<=80){
				var closeTriInd = i;
				i = this.locations.length;
			}
		}
		if(typeof closeTriInd != "undefined"){
			for(var i = 0; i < this.containerArr.length; i++){
				if(this.containerArr[i].x == this.locations[closeTriInd][0] && this.containerArr[i].y == this.locations[closeTriInd][1]){
					spaceOccupied = true;
				}
			}
			if(!spaceOccupied){
				triangle.x = this.locations[closeTriInd][0];
				triangle.y = this.locations[closeTriInd][1];
				
			}
		}else{
			return;
		}
		
		
	}.bind(scene);
	
	scene.update = function() {
	}
		
	scene.getAsset = function(name) {
		return tarsiaPuzzle.getAsset(name);
	}

	scene.loadMusic = function(id, mp3) {
		this.load.audio(id, [this.getAsset(mp3)]);		
	}.bind(scene)
		
	scene.navigateToGameOverScene = function() {
		//do not submit time if the user clicked the Stop button to abort the game
		//if we have more Chinese words or have remaining words on the wheel, do not record time
		scene.scene.stop(tarsiaPuzzle.getGameSceneOneId());
		scene.scene.stop(tarsiaPuzzle.getGameGlassId());
		scene.scene.start(tarsiaPuzzle.getGameOverId());				
    }.bind(scene);
        
	return scene;
})();
