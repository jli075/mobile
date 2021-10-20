//the first play scene of this game. This scene runs after the title scene.
 sentenceUnscrambler.gameScene1 = (function() {		    
	var scene = fn_createScene(sentenceUnscrambler.getGameSceneOneId());
	
	// NOTE, this init method will be called by the framework first.It is called
	// before preload, create and update.
	scene.init = function() {
		this.sentenceList = ["一家公立图书馆里挤满了家长和孩子和孩子", "你在学习中文", "一家公立图书馆里挤满了家长和孩子一家公立图书馆里挤满了家长和孩子", "我喜欢吃饭"];
		//习中
		this.pinyinList = ["yī jiā gōng lì tú shū guǎn lǐ jǐ mǎn le jiā zhǎng hé hái zi hé hái zi", "nǐ zài xué xí zhōng wén", "yī jiā gōng lì tú shū guǎn lǐ jǐ mǎn le jiā zhǎng hé hái zi yī jiā gōng lì tú shū guǎn lǐ jǐ mǎn le jiā zhǎng hé hái zi", "wǒ xǐ huān chī fàn"];
		this.progress = 0;
		//this.englishList = ["Cherry", "Kiwi", "Blueberry", "Peach", "Watermelon", "Banana", "Pineapple", "Strawberry", "Lemon"];
		this.pickupAudioId = fn_createId();
		this.cheerAudioId = fn_createId();
		this.musicId = fn_createId();
		
		this.isMusicOn = sentenceUnscrambler.isMusicOn();
		this.isSoundOn = sentenceUnscrambler.isSoundOn();
		
		
		this.boxSize = fn_getCanvasHeight()/5;
		
		this.blackImgId = fn_createId();
		
		this.btnBackgroundImgId = fn_createId();
		
		this.xAndCheckBtns = [];
		
		this.squareLocations = [];
		
		this.resetAndSubmitBtns = [];
		
	    this.colorBank = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0x00ffff, 0xff00ff, 0xfff000, 0x000fff, 0x0fff00, 0x00fff0]
	}
	
	scene.preload = function() {
		
		this.load.image(this.btnBackgroundImgId, this.getAsset("button-bg.png"));
		
		//load music
		if (this.isMusicOn) {
			this.loadMusic(this.pickupAudioId, "pickup.mp3");
			this.loadMusic(this.cheerAudioId, "cheer.mp3");
			this.loadMusic(this.musicId, "clearday.mp3");
	        this.pickupSound = this.sound.add(this.pickupAudioId);
	        this.cheerSound = this.sound.add(this.cheerAudioId);
	        this.music = fn_loopPlayMusic(this, this.musicId, fn_getBackgroundMusicVolume()*0.65);
		}
		

		this.splitSentence = [];
		for(var i=0; i<this.sentenceList.length; i++){
			var newArr = this.sentenceList[i].split("");
			//newArr.splice(newArr.indexOf(""),1);
			newArr = this.shuffleArray(newArr)
			this.splitSentence.push(newArr);
		}
		
		
		this.splitPinyin = []
		for(var i=0; i<this.pinyinList.length; i++){
			var newArr = this.pinyinList[i].split(" ");
			this.splitPinyin.push(newArr);
		}
		
		//this.setUpGameStatusLabels();
		
	};
	
	scene.create = function() {
		//fn_setToFullScreen(this);		
		
		this.isDragging = false;
		
		if(this.splitPinyin[this.progress].length<=16){
			this.boxSize = fn_getCanvasWidth()*0.9 / (this.splitSentence[this.progress].length + 1);
			if(this.boxSize > fn_getCanvasHeight()*0.2){
				this.boxSize = fn_getCanvasHeight()*0.2
			}
		}else{
			this.boxSize = fn_getCanvasWidth()*0.9 / (Math.floor(this.splitSentence[this.progress].length/2) + 2);
			if(this.boxSize > fn_getCanvasHeight()/7){
				this.boxSize = fn_getCanvasHeight()/7
			}
		}
		
		var fitFontSize = 64;
		
		this.depthNum = 100;
		
		this.createSquares(this.splitSentence, this.progress);
		
		this.createChineseBoard(this.splitSentence, this.progress);
		
		this.createPinyinBoard(this.splitPinyin, this.progress);
		
		/*
		this.pinyinText = this.add.text(fn_getCanvasWidth()/2, fn_getCanvasHeight()*3/5 + 128, this.pinyinList[this.progress], {font: '64px Arial'}).setOrigin(0.5);
		var bounds = this.pinyinText.getBounds();
		while(bounds.width > fn_getCanvasWidth()*0.9){
			fitFontSize-=4;
			this.pinyinText.setStyle({
			    fontSize: fitFontSize + 'px',
			});
			var bounds = this.pinyinText.getBounds();
		}
		*/
		
		var submitBtn = this.add.image(0,0,this.btnBackgroundImgId).setOrigin(0.5);
		
		submitBtn.x = fn_getCanvasWidth()*3/5;
		submitBtn.y = fn_getCanvasHeight()-submitBtn.height*0.75;
		submitBtn.setInteractive().on('pointerover', function(){
			if(!this.isDragging){
				submitBtn.scale = 1.1;
			}
		}.bind(scene)).on('pointerout', function(){
			submitBtn.scale = 1;
		});
		submitBtn.setInteractive().on('pointerdown', function(){
			this.checkCorrect(this.containerArr, this.squareLocations);
		}, this);
		var submitText = this.add.text(0,0,"Submit", {font: '48px Arial'});

		fn_nestedInCenter(submitText,submitBtn);
		
		var resetBtn = this.add.image(0,0,this.btnBackgroundImgId).setOrigin(0.5);
		resetBtn.x = fn_getCanvasWidth()*2/5;
		resetBtn.y = fn_getCanvasHeight()-resetBtn.height*0.75;
		resetBtn.setInteractive().on('pointerover', function(){
			if(!this.isDragging){
				resetBtn.scale = 1.1;
			}
		}.bind(scene)).on('pointerout', function(){
			resetBtn.scale = 1;
		}).on('pointerdown', function(){
			this.resetAll();
		}, this);
		var resetText = this.add.text(0,0,"Reset", {font: '48px Arial'});
		//resetBtn.setDepth(1000000);
		//resetText.setDepth(1000001);
		//submitBtn.setDepth(1000000);
		//submitText.setDepth(1000001);

		fn_nestedInCenter(resetText,resetBtn);
		
		this.resetAndSubmitBtns.push(resetText);
		this.resetAndSubmitBtns.push(resetBtn);
		this.resetAndSubmitBtns.push(submitText);
		this.resetAndSubmitBtns.push(submitBtn);
	}
	
	scene.drawSquare = function() {
		/*
		var id = fn_createId();
		var width = this.boxSize;
		var height = width;		
		var canvasTexture = scene.textures.createCanvas(id, width, height);
	    var src = canvasTexture.getSourceImage();		    
	    var context = src.getContext('2d');
	    		    
	    context.shadowBlur = width/20;	    
	    context.shadowColor = "rgba(0,0,0,0.2)";//black with alpha 0.2	    
	    context.shadowOffsetX = width/70;
	    context.shadowOffsetY = width/70;	    
        context.strokeStyle = 0x000000;
        context.fillStyle = 0x000000;
        context.lineWidth = 12;
        
	    context.beginPath();	    	    
	    context.moveTo(0, 0);
	    context.lineTo(width, 0);
	    context.lineTo(width, height);
	    context.lineTo(0, height);	
	    context.lineTo(0, 0);	
	    context.stroke();
	    
	    //Below is required only when running the game in WEBGL
	     canvasTexture.refresh();
			
	    return scene.add.image(0,0,id).setOrigin(0.5);
	    */
		
		var graphics = this.make.graphics({
            add: false
        });
		if(this.splitPinyin[this.progress].length<=16){
			var adjustSize = 12;
		}else{
			var adjustSize = 6;
		}
		graphics.lineStyle(adjustSize, 0x000000, 1);

    	graphics.strokeRoundedRect(adjustSize/2, adjustSize/2, this.boxSize, this.boxSize, Math.floor(this.boxSize/5.5));
    
		var squareId = fn_createId();
    	graphics.generateTexture(squareId, this.boxSize+adjustSize, this.boxSize+adjustSize);
    	var roundSquare = this.add.sprite(0, 0, squareId).setOrigin(0.5);
	    
	    return roundSquare;
		
	}.bind(scene);
	
	
	
	scene.createPinyinBoard = function(pinyinArr, index) {
		this.createPinyin = [];
		if(pinyinArr[index].length<=16){
			var screenDiv = pinyinArr[index].length+1;
			var textLocation = fn_getCanvasWidth()/screenDiv;
			for(var i=0; i<pinyinArr[index].length; i++){
				var newText = this.add.text(textLocation*(i+1), fn_getCanvasHeight()*3/5 + 48, pinyinArr[index][i], {font: '48px Arial'}).setOrigin(0.5);
				newText.setDepth(-5);
				this.createPinyin.push(newText);
			}
		}else {
			var shortSection = Math.floor(pinyinArr[index].length/2);
			var longSection = pinyinArr[index].length-shortSection;
			var screenDivTop = shortSection + 1;
			var screenDivBottom = longSection + 1;
			var textLocationTop = fn_getCanvasWidth()/screenDivTop;
			var textLocationBottom = fn_getCanvasWidth()/screenDivBottom;
			for(var i=0; i<shortSection; i++){
				var newText = this.add.text(textLocationTop*(i+1), this.squareLocations[0][1] + this.boxSize/2 + 32, pinyinArr[index][i], {font: '48px Arial'}).setOrigin(0.5);
				newText.setDepth(-5);
				this.createPinyin.push(newText);
			}
			for(var i=0; i<longSection; i++){
				var newText = this.add.text(textLocationBottom*(i+1), this.squareLocations[this.squareLocations.length-1][1] + this.boxSize/2 + 32, pinyinArr[index][i+shortSection], {font: '48px Arial'}).setOrigin(0.5);
				newText.setDepth(-5);
				this.createPinyin.push(newText);
			}
			
			
		}
	}.bind(scene);
	
	scene.createSquares = function(pinyinArr, index) {
		this.createSquareArr = [];
		if(pinyinArr[index].length<=16){
			var screenDiv = pinyinArr[index].length+1;
			var squareLocation = fn_getCanvasWidth()/screenDiv;
			for(var i=0; i<screenDiv-1; i++){
				var square = this.drawSquare();
				square.x = squareLocation*(i+1);
				square.y = fn_getCanvasHeight()*0.5;
				this.addToSquareArr(square.x, square.y, this.squareLocations);
				//this.add.text(square.x,20, i+1, {font: '24px Arial'}).setOrigin(0.5);
				this.createSquareArr.push(square);
			}
		}else {
			var shortSection = Math.floor(pinyinArr[index].length/2);
			var longSection = pinyinArr[index].length-shortSection;
			var screenDivTop = shortSection + 1;
			var screenDivBottom = longSection + 1;
			var squareLocationTop = fn_getCanvasWidth()/screenDivTop;
			var squareLocationBottom = fn_getCanvasWidth()/screenDivBottom;
			for(var i=0; i<shortSection; i++){
				var square = this.drawSquare();
				square.x = squareLocationTop*(i+1);
				square.y = fn_getCanvasHeight() * 0.5;
				this.addToSquareArr(square.x, square.y, this.squareLocations);
				//this.add.text(square.x,20, i+1, {font: '24px Arial'}).setOrigin(0.5);
				this.createSquareArr.push(square);
			}
			for(var i=0; i<longSection; i++){
				var square = this.drawSquare();
				square.x = squareLocationBottom*(i+1);
				square.y = fn_getCanvasHeight() * 0.715;
				this.addToSquareArr(square.x, square.y, this.squareLocations);
				//this.add.text(square.x,20, i+1, {font: '24px Arial'}).setOrigin(0.5);
				this.createSquareArr.push(square);
			}
		}
	}.bind(scene);
	
	scene.addToSquareArr = function(x, y, squareArr){
		var locationArr = [x, y];
		squareArr.push(locationArr);
	}.bind(scene);
	
	scene.createChineseBoard = function(chineseArr, index) {
		var adjustFontSize = this.boxSize * 0.7;
		if(adjustFontSize>128){
			adjustFontSize = 128;
		}
		this.containerArr = [];
		if(chineseArr[index].length<=16){
			var screenDiv = chineseArr[index].length+1;
			var textLocation = fn_getCanvasWidth()/screenDiv;
			for(var i=0; i<chineseArr[index].length; i++){
				var chineseText = this.add.text(0, 0, chineseArr[index][i], {font: 'bold 64px Arial', color: '#000000'}).setOrigin(0.5);
				chineseText.setStyle({
			    	fontSize: adjustFontSize + 'px',
			    	color: '#000000'
				});
				this.createChineseContainer(textLocation, fn_getCanvasHeight()/4, chineseText, i, this.squareLocations, this.containerArr);
			
			}
		}else{
			var shortSection = Math.floor(chineseArr[index].length/2);
			var longSection = chineseArr[index].length-shortSection;
			var screenDivTop = shortSection + 1;
			var screenDivBottom = longSection + 1;
			var textLocationTop = fn_getCanvasWidth()/screenDivTop;
			var textLocationBottom = fn_getCanvasWidth()/screenDivBottom;
			
			for(var i=0; i<shortSection; i++){
				var chineseText = this.add.text(0, 0, chineseArr[index][i], {font: 'bold 64px Arial', color: '#000000'}).setOrigin(0.5);
				chineseText.setStyle({
			    	fontSize: adjustFontSize + 'px',
			    	color: '#000000'
				});
				this.createChineseContainer(textLocationTop, fn_getCanvasHeight()*0.12, chineseText, i, this.squareLocations, this.containerArr);
			}
			for(var i=0; i<longSection; i++){
				var chineseText = this.add.text(0, 0, chineseArr[index][i+shortSection], {font: 'bold 64px Arial', color: '#000000'}).setOrigin(0.5);
				chineseText.setStyle({
			    	fontSize: adjustFontSize + 'px',
			    	color: '#000000'
				});
				this.createChineseContainer(textLocationBottom, fn_getCanvasHeight()*0.31, chineseText, i, this.squareLocations, this.containerArr);
			}
		}
	}.bind(scene);

	
	scene.createChineseContainer = function(textLocation, containerY, chineseText, i, squareArr, containerArr) {
		var popLength = this.boxSize/3.5;
		
		var graphics = this.make.graphics({
            add: false
        });

		if(squareArr.length<=16){
			var adjustFont = 12;
		}else{
			var adjustFont = 6;
		}
		

		graphics.lineStyle(adjustFont, 0x000000, 1);
		graphics.fillStyle(0xFFFFFF)

	    graphics.fillRoundedRect(adjustFont, adjustFont, this.boxSize-adjustFont, this.boxSize-adjustFont, Math.floor(this.boxSize/5.5));
	    graphics.strokeRoundedRect(adjustFont, adjustFont, this.boxSize-adjustFont, this.boxSize-adjustFont, Math.floor(this.boxSize/5.5));
	    
		var squareId = fn_createId();
        graphics.generateTexture(squareId, this.boxSize+adjustFont, this.boxSize+adjustFont);
        var whiteImg = this.add.sprite(0, 0, squareId);
	    
		
		var container = this.add.container(textLocation*(i+1), containerY, [whiteImg, chineseText ]);
	    container.setSize(this.boxSize, this.boxSize);
	    this.setContainerInteractive(container, squareArr, popLength, containerArr);
		containerArr.push(container);
	    
	    
	}.bind(scene);
	
	scene.setContainerInteractive = function(container, squareArr, popLength, containerArr){
		/*
		var containerTween = this.tweens.addCounter({
	        from: 1,
	        to: 1.05,
	        duration: 1000,
	        ease: "Circular",
	        onUpdate: function (tween)
	        {
	            var value = tween.getValue();

	            container.scale = value;
	        },
	        repeat: -1,
	        yoyo: true
	    });
		*/
		
		var containerTween = this.tweens.addCounter({
	        from: -7.5,
	        to: 7.5,
	        duration: 1000,
	        ease: "Circular",
	        onUpdate: function (tween)
	        {
	            var value = tween.getValue();

	            container.setAngle(value);
	        },
	        repeat: -1,
	        yoyo: true
	    });
		
		
		container.setInteractive({useHandCursor: true, draggable: true})
		.on('dragstart', function(pointer){
	    	if(container.depth<this.depthNum){
	    		container.setDepth(this.depthNum);
	        }
	    	container.scale=1.1;
	    	this.isDragging = true;
	    	containerTween.stop();
	    }.bind(scene), this)
	    .on('drag', function (pointer, dragX, dragY) {
	    	container.setPosition(dragX, dragY);
	        
	    }.bind(scene), this)
	    .on('dragend', function(pointer, dragX, dragY){
	    	this.depthNum++;
	    	container.scale = 1;
	    	this.lockInPiece(container, squareArr, popLength, containerArr);
	    	this.isDragging = false;
	    }.bind(scene), this);

		
		
		
	}.bind(scene);
	
	scene.lockInPiece = function(gameObject, squareArr, popLength, containerArr){
		var tf = true;
    	for(var l = 0; l < squareArr.length; l++){
			if(Math.abs(gameObject.x-squareArr[l][0])<popLength && Math.abs(gameObject.y-squareArr[l][1])<popLength){
				
				for(var i = 0; i < containerArr.length; i++){
					if(Math.floor(containerArr[i].x) == Math.floor(squareArr[l][0]) && Math.floor(containerArr[i].y) == Math.floor(squareArr[l][1])) {
						tf = false;
					}
				}
				
				if(tf){
					gameObject.x = squareArr[l][0];
					gameObject.y = squareArr[l][1];
					l = squareArr.length;
				}
				
			}
			
		}
    	console.log(tf);
	}.bind(scene);
	
	scene.shuffleArray = function(chineseArr) {
		for(var j = chineseArr.length-1; j>=0; j--) {
			var k = Math.floor(Math.random()*j);
			var temp = chineseArr[j];
			chineseArr[j] = chineseArr[k];
			chineseArr[k] = temp;
		}
		return chineseArr;
	}.bind(scene);
	
	scene.checkCorrect = function(containerArr, squareLocations) {
		var correctYTop = squareLocations[0][1];
		var correctYBottom = squareLocations[squareLocations.length-1][1];	
		for(var a = 0; a < containerArr.length; a++){
			if(containerArr[a].y!=correctYTop && containerArr[a].y!=correctYBottom){
				console.log("Incorrect Y");
				return;
				
			}
		}
		
		var checkSentence = "";
		for(var i = 0; i < containerArr.length; i++){
			containerArr[i].removeInteractive();
			for(var j = 0; j < containerArr.length; j++){
				if(containerArr[j].x == squareLocations[i][0] && containerArr[j].y == squareLocations[i][1]){
					checkSentence = checkSentence + containerArr[j].getAt(1).text;
				}
			}
		}
		if(checkSentence == this.sentenceList[this.progress]){
			for(var i = 0; i < containerArr.length; i++){
				var checkMarkBtn = this.drawCheckMark(containerArr[i])
				checkMarkBtn.alpha = 1;
				checkMarkBtn.setDepth(999999);
				this.xAndCheckBtns.push(checkMarkBtn);
				fn_nestedInCenter(checkMarkBtn,containerArr[i]);
			}
			if (this.isMusicOn) {
				fn_playSound(this.pickupSound, fn_getBackgroundMusicVolume(), false);
			}		
			this.time.delayedCall(1000, this.nextStep, [], this);
		}else {
			var tempContainerArr = containerArr;
			tempContainerArr.sort(function(a, b) {
			  return a.x - b.x;
			});
			var matchContainers = [];
			for(var i = 0; i < tempContainerArr.length; i++){
				if(tempContainerArr[i].getAt(1).text == this.sentenceList[this.progress][i]){
					var checkMarkBtn = this.drawCheckMark(tempContainerArr[i])
					checkMarkBtn.alpha = 1;
					this.xAndCheckBtns.push(checkMarkBtn);
					fn_nestedInCenter(checkMarkBtn,tempContainerArr[i]);
				}else {
					var xBtn = this.drawX(tempContainerArr[i])
					xBtn.alpha = 0.6;
					this.xAndCheckBtns.push(xBtn);
					
					fn_nestedInCenter(xBtn,tempContainerArr[i]);	
				}
			}
		}
	}.bind(scene);
	
	scene.nextStep = function() {
		this.progress++;
		if(this.progress<this.sentenceList.length){
			this.resetAll();
		}else {
			
			if (this.isMusicOn) {
				fn_playSound(this.cheerSound, fn_getBackgroundMusicVolume(), false);
				scene.music.pause();// stop background music
			}
			this.navigateToGameOverScene();
		}
	}.bind(scene);
	
	scene.resetAll = function() {
		this.squareLocations.splice(0, this.squareLocations.length);
		for(var i = 0; i<this.containerArr.length; i++){
			this.containerArr[i].destroy();
		}
		for(var i = 0; i<this.createSquareArr.length; i++){
			this.createSquareArr[i].destroy();
		}
		for(var i = 0; i<this.createPinyin.length; i++){
			this.createPinyin[i].destroy();
		}
		for(var i = 0; i < this.resetAndSubmitBtns.length; i++){
			this.resetAndSubmitBtns[i].destroy();
		}
		for(var i = 0; i < this.xAndCheckBtns.length; i++){
			this.xAndCheckBtns[i].destroy();
		}
		this.containerArr.splice(0, this.containerArr.length);
		this.createSquareArr.splice(0, this.createSquareArr.length);
		this.createPinyin.splice(0, this.createPinyin.length);
		this.resetAndSubmitBtns.splice(0, this.resetAndSubmitBtns.length);
		this.xAndCheckBtns.splice(0, this.xAndCheckBtns.length);
		//this.pinyinText.destroy();
		this.create();
	}.bind(scene);

	scene.drawX = function(toBeXedGameObject) {
		var id = fn_createId();
		
		var width = toBeXedGameObject.displayWidth*0.75;
		var height = toBeXedGameObject.displayHeight * 0.75;		
		var canvasTexture = this.textures.createCanvas(id, width, height);
	    var src = canvasTexture.getSourceImage();		    
	    var context = src.getContext('2d');
	    		    
	    context.shadowBlur = width/20;	    
	    context.shadowColor = "rgba(0,0,0,0.2)";//black with alpha 0.2	    
	    context.shadowOffsetX = width/70;
	    context.shadowOffsetY = width/70;	    
        context.strokeStyle = "#FF0000";
        context.fillStyle = "#FF0000";
        context.lineWidth = 12;
        
	    context.beginPath();	    	    
	    context.moveTo(0, 0);
	    context.lineTo(width, height);
	    context.moveTo(width, 0);
	    context.lineTo(0, height);	    
	    context.stroke();
	    
	    //Below is required only when running the game in WEBGL
	     canvasTexture.refresh();
			
	    return this.add.image(0,0,id);		
	}.bind(scene);
	
	
	scene.drawCheckMark = function(toBeCheckedGameObject) {
		var id = fn_createId();
	
		var width = toBeCheckedGameObject.displayWidth*0.75;
		var height = toBeCheckedGameObject.displayHeight * 0.75;		
		var canvasTexture = this.textures.createCanvas(id, width, height);
		var src = canvasTexture.getSourceImage();		    
		var context = src.getContext('2d');
    		    
		context.shadowBlur = width/20;	    
		context.shadowColor = "rgba(0,0,0,0.2)";//black with alpha 0.2	    
		context.shadowOffsetX = width/70;
    	context.shadowOffsetY = width/70;	    
    	context.strokeStyle = "#00FF00";
    	context.fillStyle = "#00FF00";
    	context.lineWidth = 12;
    
    	context.beginPath();	    	    
    	context.moveTo(width/6, height/2);
    	context.lineTo(width/2, height-10);
    	context.lineTo(width, 0);	    
    	context.stroke();
    
    	//Below is required only when running the game in WEBGL
    	canvasTexture.refresh();
		
    	return this.add.image(0,0,id);		
	}.bind(scene);
	/*
	scene.setUpGameStatusLabels = function() {

		//word matching progress bar, note that, a scene can have only one progress bar, otherwise we cannot use the following two functions we defined.
		fn_createProgressBar(this, 16, 56, 160, 30);
		fn_updateProgressBar(this,0.0);//1% as the starting point
		
		//display the list title label
		this.titleText = fn_createStatusLabel(this, this.sys.canvas.width, 16, ''); 
		
		//word count label
		this.wordCountText = fn_createStatusLabel(this, this.sys.canvas.width, 56, 'Word Count: 0');

		//creator label
		this.creatorText = fn_createStatusLabel(this, this.sys.canvas.width, 96, 'Created By: ');
	
		//stop button
		this.stopBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.navigateToGameOverScene);
		this.stopBtnBg.alpha = 0.5;
		fn_centerObject(this, this.stopBtnBg, -5);
		this.stopBtnBg.x = this.sys.canvas.width - this.stopBtnBg.getBounds().width - 10 + 70;
		this.stopBtn = fn_createBtn(this,"Stop", 24, this.navigateToGameOverScene);
		this.stopBtn.alpha = 0.7;
		fn_nestedInCenter(this.stopBtn,this.stopBtnBg);		

	}.bind(scene);
	*/
	
	
	scene.update = function() {
	}
		
	scene.getAsset = function(name) {
		return sentenceUnscrambler.getAsset(name);
	}

	scene.loadMusic = function(id, mp3) {
		this.load.audio(id, [this.getAsset(mp3)]);		
	}.bind(scene)
		
	scene.navigateToGameOverScene = function() {
		//do not submit time if the user clicked the Stop button to abort the game
		//if we have more Chinese words or have remaining words on the wheel, do not record time
		scene.scene.stop(sentenceUnscrambler.getGameSceneOneId());
		scene.scene.stop(sentenceUnscrambler.getGameGlassId());
		scene.scene.start(sentenceUnscrambler.getGameOverId());				
    }.bind(scene);
        
	return scene;
})();
