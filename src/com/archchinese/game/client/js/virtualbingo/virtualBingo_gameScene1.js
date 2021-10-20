//the first play scene of this game. This scene runs after the title scene.
 virtualBingo.gameScene1 = (function() {		
	var scene = fn_createScene(virtualBingo.getGameSceneOneId());
	// NOTE, this init method will be called by the framework first.It is called
	// before preload, create and update.
	scene.init = function() {
		this.backgroundImgId = fn_createId();	
		this.btnBackgroundImgId = fn_createId();
		this.pickupAudioId = fn_createId();
	};
	
	scene.getAsset = function(name) {
		return virtualBingo.getAsset(name);
	}

	scene.preload = function() {
		//load images		
//		var backgroundImageURL = this.getAsset("background.jpg");
//		var userBackgroundImageURL = fn_getUserBackgroundImageURL();		
//		if (userBackgroundImageURL.length > 0) {
//			this.load.image(this.backgroundImgId, userBackgroundImageURL);	
//		} else {
//			this.load.image(this.backgroundImgId, backgroundImageURL);
//		}
//		
//		this.load.image(this.btnBackgroundImgId, virtualBingo.getAsset("button-bg.png"));
		
		this.loadMusic(this.pickupAudioId, "pickup.ogg", "pickup.mp3");
	}
	

	scene.loadMusic = function(id, ogg, mp3) {
		this.load.audio(id, [this.getAsset(ogg), this.getAsset(mp3)]);		
	}.bind(scene)

	scene.create = function() {
		//set to full screen. Only works on FireFox and Chrome.
		//fn_setToFullScreen(this);	//delayed at the end of this method	
		//set background
		//fn_setBackground(this, this.backgroundImgId);
		
		this.pickupSound = this.sound.add(this.pickupAudioId);
		
		//next call button, for caller (teacher) only.
//		this.callBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.6).setInteractive();
//		fn_centerObject(this, this.callBtnBg, -5);
		var nextCallBtn = fn_createBtn(this, "Next Call", 34, function(){});
		fn_centerObject(this, nextCallBtn, -5);
		//fn_nestedInCenter(nextCallBtn,this.callBtnBg);
		
		
//		var initFontSize = 56;
//		console.log("initial font size: " + initFontSize)
//		var fontSize = fn_findMaxFontInBox(this, "Next Call Jason Li Is a good", fn_getEnglishFont(),initFontSize, 300, 150);
//		console.log("adjusted font size: " + fontSize)
		
	
		//check winner button for caller (teacher) only 
		
		
		//reset button for player only
		
		//bingo button for player only.
		
		// load game data from server for this scene
		// make sure data is loaded after everything has been set.
		fn_loadGameVocabListsByUUID();
		
		//delay to set full screen.
		this.time.delayedCall(2000, function(){fn_setToFullScreen(this);}, [], this);
	}
	
	//text = this.add.bitmapText(32, 100, 'hyper', 'Arkanoid\nRevenge of Doh', 96);
	//graphics = this.add.graphics(0, 0);
    //bounds = text.getTextBounds();
    //graphics.lineStyle(1, 0x00FF00, 1.0);
    //graphics.strokeRect(bounds.global.x, bounds.global.y, bounds.global.width, bounds.global.height); 

	scene.setGameVocabLists = function(displayName, chineseArrayStr, pinyinArrayStr,
			englishArrayStr, imgURLArrayStr) {
		// note "~" is the delimiter!!, cache the data lists on the scene object. 
		this.chineseArray = chineseArrayStr.split("~");
		this.pinyinArray = pinyinArrayStr.split("~");
		this.englishArray = englishArrayStr.split("~");		
		this.imgURLArray = imgURLArrayStr.split("~");
		// refresh the words on the screen
		this.buildBingoCard();		
	}.bind(scene);
    
	scene.buildBingoCard = function() {
		var width = fn_getCanvasWidth();
		var height = fn_getCanvasHeight();
		var size = width > height ? height : width;
		var marginTop = size/10;
		var topGap = marginTop/4; 
		var marginBottom = size/10;
		var graphics = this.add.graphics(0, 0);//graphics instance
		graphics.clear();
	    graphics.lineStyle(1, 0xB97A57, 1.0);
	    graphics.fillStyle(0xFFFF00, 1.0);
	    var cardSize = size - marginTop - marginBottom;
	    var unitSize = cardSize/5;
	    
	    var startX = (width - cardSize)/2;
	    var startY = marginTop;
	    
	    //fill the background with gray 
	    graphics.fillStyle(0xCCCCCC, 1.0);
	    graphics.fillRect(startX, startY, cardSize, cardSize);

	    graphics.fillStyle(0xFFFF00, 1.0);
	    //big box, with thick lines
	    graphics.lineStyle(20, 0xFFFF00, 1.0);
	    graphics.strokeRect(startX-10, startY-10, cardSize+20, cardSize+20);

	    //back to thin lines
	    graphics.lineStyle(1, 0xB97A57, 1.0);
	    
	    //fill header with yellow background
	    graphics.fillRect(startX+unitSize/2, startY - unitSize/2, cardSize-unitSize, unitSize/2);	    
	    //graphics.fillCircleShape(new Phaser.Geom.Circle(startX+unitSize/2, marginTop, unitSize/2));	    
	    graphics.beginPath();
	    graphics.moveTo(startX+unitSize/2, marginTop);
	    graphics.arc(startX+unitSize/2, marginTop, unitSize/2, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), true, false);
	    graphics.closePath();
	    graphics.fillPath();
	    
	    //graphics.fillCircleShape(new Phaser.Geom.Circle(startX+cardSize-unitSize/2, marginTop, unitSize/2));
	    graphics.beginPath();
	    graphics.moveTo(startX+unitSize/2, marginTop);
	    graphics.arc(startX+cardSize-unitSize/2, marginTop, unitSize/2, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), true, false);
	    graphics.closePath();
	    graphics.fillPath();
	    
	    
	    //matched type
		this.currentMatchType = fn_getGameMatchType();
		
		var pinyinFontFamily = fn_getPinyinFont();
		var chineseFontFamily = fn_getChineseFont(); 
		var englishFontFamily = fn_getEnglishFont();
	    var textBackgroundColor = fn_getTextBackgroundColor();
	    var letters = "BINGO";
	    var count = 5;
	    
	    this.cellTextList = [];
	    var text
	    for(var i = 0; i < count; i++) {	    	
	    	
	    	var text = this.add.text(startX+i*unitSize + unitSize/2, topGap +3 , letters.substring(i,i+1), {
				fontFamily : fn_getEnglishFont(),
				fontSize : 68,
				color : '#FF0000',
				align: "center"
			});
	    	text.setShadow(2, 2, textBackgroundColor, 2, true, true);
	    	text.x = startX+i*unitSize + unitSize/2 - text.getBounds().width * 0.5;//center the text
	    	
	    	//draw grids
	    	for(var j = 0; j < count; j++) {
	    		graphics.strokeRect(startX+i*unitSize, startY + j*unitSize, unitSize, unitSize);	    		
	    		///write the cell texts
	    		var text = "";
	    		var index =  i*count + j;
	    		if (index < this.chineseArray.length) {
	    			text = this.chineseArray[index];
	    		}
	    		var fontSize = 20;
	    		
	    		//cell text content
	    		var frontText = fn_createStaticBtn(this,text,chineseFontFamily,fontSize,fn_getGameTextColor());	
	    		frontText.setOrigin(0.5);
//	    		frontText.setFontFamily(chineseFontFamily);
//	    		frontText.setColor(fn_getGameTextColor());
	    		frontText.setWordWrapWidth(unitSize, true);
	    		frontText.setAlign("center");	    		
	    		frontText.x = 0;
	    		frontText.y = 0;
	    		
	    		var container = this.add.container(10,100, [ frontText ]);//one word per container
				container.setSize(unitSize, unitSize);//container has the same size as the text
				container.setInteractive({useHandCursor: true});
				container.x = startX+j*unitSize + unitSize/2//center the text
				container.y = startY + i*unitSize + unitSize/2;
				
	    		//check mark
	    		var check = fn_createStaticBtn(this, "X", englishFontFamily, 150, fn_getGameMatchedTextColor());	    	
	    		check.setOrigin(0.5);
//	    		check.setFontFamily(chineseFontFamily);
//	    		check.setColor(fn_getGameMatchedTextColor());
	    		check.setWordWrapWidth(unitSize, true);
	    		check.setAlign("center");	    		
	    		check.x = 0;
	    		check.y = 0;
	    		check.setVisible(false);
	    		container.add(check);
	    		
	    		this.cellTextList.push(container);	    		
	    	}	    		    	
	    }
	    
	    this.autoSizeTextTimer = this.time.addEvent({
			delay : 100,
			callback : this.autoAdjustText,
			args: [chineseFontFamily, 68, unitSize],
			callbackScope : this,
			loop : true
		});	    	    
	}.bind(scene);
	
	scene.autoAdjustText = function(fontFamily, initFontSize, size) {
		if (this.cellTextList.length > 0) {
    		var container = this.cellTextList.shift();
			//note that we use event handler on the container, not the text object!!!
    		container.on('pointerup', function(){
				if (container.getAt(1).visible) {
					container.getAt(1).setVisible(false);	
				} else {
					container.getAt(1).setVisible(true);
					container.getAt(1).setAlpha(0.9);
				}
				scene.pickupSound.play();
			})
			.on('pointerover', function(){container.getAt(0).setColor(fn_getGameVisitedTextColor());container.getAt(1).setAlpha(0.4);container.getAt(0).setScale(1.2);})
			.on('pointerout', function(){container.getAt(0).setColor(fn_getGameTextColor());container.getAt(1).setAlpha(0.9);container.getAt(0).setScale(1.0);});
			
    		var fontSize = fn_findMaxFontInBox(this, container.first.text, fontFamily,initFontSize, size, size);
    		
    		container.first.setFontSize(fontSize);
    		container.first.setFontFamily(fontFamily);
		} else {
			//done, destroy the timer
			this.autoSizeTextTimer.destroy();
		}		
	}.bind(scene);
	
	scene.update = function() {
	}
	
	/*	
	scene.autoResizeToFit = function(text,fontFamily,initFontSize, w, h) {
		var font = initFontSize;
		
		 var helpText = this.add.text(0, 0, text , {
				fontFamily : fontFamily,
				fontSize : font,
				align: "center",
				wordWrap: { width: w, useAdvancedWrap: true }		
			});		
		helpText.setVisible(false);
		while(helpText.getBounds().width > w || helpText.getBounds().height > h) {
			font -= 3;
			helpText.destroy();
			helpText = this.add.text(0, 0, text , {
				fontFamily : fontFamily,
				fontSize : font,
				align: "center",
				wordWrap: { width: w, useAdvancedWrap: true }		
			});			
			helpText.setVisible(false);
			
			console.log("bounds w: " + helpText.getBounds().width);
	    	console.log("bounds h: " + helpText.getBounds().height);
	    	console.log("font size: " + font);
		}
		helpText.setVisible(true); 
		console.log("bounds w: " + helpText.getBounds().width);
    	console.log("bounds h: " + helpText.getBounds().height);
    	console.log("font size: " + font);		
	}.bind(scene);
	*/
	
	return scene;
})();
