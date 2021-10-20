//the first play scene of this game. This scene runs after the title scene.
 wheelOfWords.gameScene1 = (function() {		    
	var scene = fn_createScene(wheelOfWords.getGameSceneOneId());
	
	// NOTE, this init method will be called by the framework first.It is called
	// before preload, create and update.
	scene.init = function() {
		this.btnBackgroundImgId = fn_createId();
		
		this.pickupAudioId = fn_createId();
		this.cheerAudioId = fn_createId();
		this.musicId = fn_createId();
		
		this.totalTime = 0;
		
		this.pushBtnId = fn_createId();
		
		this.xAndCheckBtns = [];
		this.isMusicOn = wheelOfWords.isMusicOn();
		this.isSoundOn = wheelOfWords.isSoundOn();
		this.isAutoSpinOn = wheelOfWords.isAutoSpinOn();
		this.isZoomInOn = wheelOfWords.isZoomInOn();
		
	    //the match type of the first round. The second round will use the alternative match type.
	    this.currentMatchType = fn_getGameMatchType();
		//0: front chinese, back, pinyin
		//1: front pinyin, back, chinese		
		//2: front chinese, back, english
		//3: front english, back, chinese		
		//4: front pinyin, back, english
		//5: front english, back, pinyin	    
	    
	}
	
	scene.preload = function() {
		//button background image
		this.load.image(this.btnBackgroundImgId, this.getAsset("button-bg.png"));
				 
		//load music
		if (this.isMusicOn) {
			this.loadMusic(this.pickupAudioId, "pickup.mp3");
			this.loadMusic(this.cheerAudioId, "cheer.mp3");
			this.loadMusic(this.musicId, "clearday.mp3");
		}
	};
	
	scene.create = function() {
		//set to full screen. Only works on FireFox and Chrome.
		fn_setToFullScreen(this);		

		if (this.isMusicOn) {
			//pick up sound
	        this.pickupSound = this.sound.add(this.pickupAudioId);
	        //cheer sound
	        this.cheerSound = this.sound.add(this.cheerAudioId);
	        	        
	        this.music = fn_loopPlayMusic(this, this.musicId, fn_getBackgroundMusicVolume()*0.65);
		}
        
    	//set up game name, word count, created by
        //and time, progress, etc
        this.setUpGameStatusLabels();
			
		// /////////////////////////////
		// load game data from server for this scene
		//data is loaded after everything has been set.
		fn_loadGameVocabListsByUUID();				
		/////////////////////////////	
	}
	
	
	scene.update = function() {
	}
		
	//
	scene.createFrontText = function() {
		  var chinese = this.chineseArray.shift();
		  var pinyin = this.pinyinArray.shift();
		  var english = this.englishArray.shift();
		  
		  return fn_createFrontText(this, chinese, pinyin, english,78,this.currentMatchType);
	}.bind(scene);
		
    ///////////////////////////////////////////////////////////////////////////	
	scene.getAsset = function(name) {
		return wheelOfWords.getAsset(name);
	}

	scene.loadMusic = function(id, mp3) {
		this.load.audio(id, [this.getAsset(mp3)]);		
	}.bind(scene)
		
	
	scene.setUpGameStatusLabels = function() {
		// The time label
		this.timerText = fn_createStatusLabel(this, 16,16, "Time: 0");
		
		//word matching progress bar, note that, a scene can have only one progress bar, otherwise we cannot use the following two functions we defined.
		fn_createProgressBar(this, 16, 56, 160, 30);
		fn_updateProgressBar(this,0.0);//1% as the starting point
		
		//display the list title label
		this.titleText = fn_createStatusLabel(this, this.sys.canvas.width, 16, ''); 
		
		//word count label
		this.wordCountText = fn_createStatusLabel(this, this.sys.canvas.width, 56, 'Word Count: 0');

		//creator label
		this.creatorText = fn_createStatusLabel(this, this.sys.canvas.width, 96, 'Created By: ');
		
		//create pause button at the screen bottom, MAKE SURE create the button image first and then create the button label!!!
		this.pauseBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.pauseGame);
		this.pauseBtnBg.alpha = 0.5;
		fn_centerObject(this, this.pauseBtnBg, -5);
		this.pauseBtnBg.x = this.sys.canvas.width - 2 * this.pauseBtnBg.getBounds().width -20 + 70;
		this.pauseBtn = fn_createBtn(this,"Pause", 24, this.pauseGame);
		this.pauseBtn.alpha = 0.7;
		fn_nestedInCenter(this.pauseBtn,this.pauseBtnBg);
		
		//stop button
		this.stopBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.navigateToGameOverScene);
		this.stopBtnBg.alpha = 0.5;
		fn_centerObject(this, this.stopBtnBg, -5);
		this.stopBtnBg.x = this.sys.canvas.width - this.stopBtnBg.getBounds().width - 10 + 70;
		this.stopBtn = fn_createBtn(this,"Stop", 24, this.navigateToGameOverScene);
		this.stopBtn.alpha = 0.7;
		fn_nestedInCenter(this.stopBtn,this.stopBtnBg);		

	}.bind(scene);
	
	scene.pauseGame = function() {		
		scene.scene.pause(wheelOfWords.getGameSceneOneId());
		scene.scene.wake(wheelOfWords.getGameGlassId());		
		scene.scene.moveAbove(wheelOfWords.getGameSceneOneId(), wheelOfWords.getGameGlassId());
		if (this.isMusicOn) {
			scene.music.pause();// stop background music
		}
	}.bind(scene);
	
	scene.enablePauseBtn = function() {
		scene.pauseBtn.setText("Pause");
		fn_nestedInCenter(scene.pauseBtn,scene.pauseBtnBg);
		if (this.isMusicOn) {
			scene.music.resume();//resume music
		}
	}

	scene.populateDataArray = function() {
		this.chineseArray = this.chineseArrayStr.split("~");
		this.pinyinArray = this.pinyinArrayStr.split("~");
		this.englishArray = this.englishArrayStr.split("~");		
		this.imgURLArray = this.imgURLArrayStr.split("~");
	}.bind(scene);

	// handles returned word lists from server. This is called by game agent.
	scene.setGameVocabLists = function(displayName, chineseArrayStr, pinyinArrayStr,
			englishArrayStr, imgURLArrayStr) {
		// note "~" is the delimiter!!, cache the data lists on the scene object.
		this.chineseArrayStr = chineseArrayStr;
		this.pinyinArrayStr = pinyinArrayStr;
		this.englishArrayStr = englishArrayStr;
		this.imgURLArrayStr = imgURLArrayStr;
		
		this.populateDataArray();
		
		//set the total match count, including both regular and alternative match
		this.totalCount = this.chineseArray.length;
		this.correctedAnswer = 0;
		//update the list title text
		this.updateListName(displayName);
		
		//update the word count text
		this.wordCountText.setText("Word Count: " + this.chineseArray.length);
		this.wordCountText.x = this.sys.canvas.width - this.wordCountText.getBounds().width - 20;	
		
		//shuffle our raw data first.
		this.shuffleChinesePinyinEnglishImgArrays();
		//done randomizing
		
		//create word pool. 
		this.wordPool = [];
		this.createWordPool();
		
		//draw Wheel and add words to the wheel.
		this.wheel = this.drawWheel();
	}.bind(scene);

	scene.createWordPool = function() {
		var  poolSize = this.chineseArray.length;
		for(var i = 0; i < poolSize; i++) {
			var chinese = this.chineseArray[i];
			var pinyin = this.pinyinArray[i];
			var english = this.englishArray[i];
			
			var word = fn_createFrontText(this, chinese, pinyin, english,78,this.currentMatchType);
			word.setBackgroundColor(null);			
			word.setVisible(false);
			this.wordPool.push(word);
		}		
	}.bind(scene);

	
	scene.createPushBtn = function() {
		return fn_createRadientBtn(this,120,"#FFFFFF","#881111");
	}.bind(scene);
	
	scene.createRing = function(size, ringColor) {
		return fn_createRing(this, size, ringColor);
	}.bind(scene);
	
	scene.getTextBoxWidth = function() {
		return this.wheelWidth/2 - this.wheelWidth/8*Math.cos(fn_deg2Rad(this.degreePerWord/2));
	}.bind(scene);

	scene.getTextBoxHeight = function() {	
		return 2*(this.wheelWidth/8*Math.sin(fn_deg2Rad(this.degreePerWord/2)));
	}.bind(scene);

	scene.refreshWheel = function() {
		this.wheel.removeAt(0, true);
		
        var graphics = this.make.graphics({
            add: false
        });

        var countPerBatch = this.wordsOnWheel.length;
                
        this.degreePerWord = 360/countPerBatch;
        if (countPerBatch == 1) {
        	this.degreePerWord = 180;
        }
        for(var i = 0; i < countPerBatch; i++) {
			var startDegree =  i*this.degreePerWord;
			var endDegree = startDegree + this.degreePerWord;
	        // setting fill style		
	        graphics.fillStyle(fn_rand(0, 0xFFFFFF), 1);
			//x, y, radius, startAngle, endAngle [, anticlockwise] [, overshoot
	        graphics.slice(this.wheelWidth/2, this.wheelWidth/2, this.wheelWidth/2, fn_deg2Rad(startDegree), fn_deg2Rad(endDegree), false);
	        // filling the slice
	        graphics.fillPath();	        
		}  
        
		var wheelId = fn_createId();
        graphics.generateTexture(wheelId, this.wheelWidth, this.wheelWidth);
        // creating a sprite with wheel image as if it was a preloaded image
        var wheel = this.add.sprite(0, 0, wheelId);        
        this.wheel.addAt(wheel, 0);
        
        this.wordArrayForAdjustSize = [];
        
        for(var i = 0; i < countPerBatch; i++) {
        	var frontText = this.wordsOnWheel[i];
        	this.wordArrayForAdjustSize.push(frontText);        	
        	frontText.alpha = 0;        	
        	var angle = this.degreePerWord *(i+0.5);        	
        	frontText.x = this.wheelWidth/2 *0.6 * Math.cos(angle*Math.PI*2/360.0)-20; 
        	frontText.y = this.wheelWidth/2 *0.6 * Math.sin(angle*Math.PI*2/360.0);        	
        	frontText.angle = angle;
		}
        
        var textBoxHeight = this.getTextBoxHeight();
        var textBoxWidth = this.getTextBoxWidth()*5/6;               
        this.autoSizeTextTimer = this.time.addEvent({
			delay : 50,
			callback : this.autoAdjustText,
			args: [78, textBoxWidth, textBoxHeight],
			callbackScope : this,
			loop : true
		});	         
	}.bind(scene);
	
	scene.drawWheel = function() {
		this.wheelWidth = fn_getCanvasHeight()*0.9;
		// making a graphic object without adding it to the game
        var graphics = this.make.graphics({
            add: false
        });
        
        //calc the box size that word can fit into in each slice
        
        var masterContainer = this.add.container(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2);
        masterContainer.setSize(this.wheelWidth, this.wheelWidth);
        //the master container containers the wheel, the spin button and the ring. Note that only the wheel is spinnable!
        //spin button and ring are static with shadows.
        
        // adding a container to group wheel slices and text drawn on them
        var wheelContainer = this.add.container(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2);
        masterContainer.add(wheelContainer);//add wheel container to the master container.
        wheelContainer.setPosition(0,0);        
        
        //create word slices and add them to wheel container
		var countPerBatch = fn_getBatchSize();		
		if (this.chineseArray.length < countPerBatch) {
			countPerBatch = this.chineseArray.length;
		}
		if (countPerBatch < 2) {
			countPerBatch = 2;
		}		
		
		this.degreePerWord = 360/countPerBatch;
		
		for(var i = 0; i < countPerBatch; i++) {
			var startDegree =  i*this.degreePerWord;
			var endDegree = startDegree + this.degreePerWord;
	        // setting fill style		
	        graphics.fillStyle(fn_rand(0, 0xFFFFFF), 1);
			//x, y, radius, startAngle, endAngle [, anticlockwise] [, overshoot
	        graphics.slice(this.wheelWidth/2, this.wheelWidth/2, this.wheelWidth/2, fn_deg2Rad(startDegree), fn_deg2Rad(endDegree), false);
	        // filling the slice
	        graphics.fillPath();	        
		}        
        // generate a texture called "wheel" from graphics data
		var wheelId = fn_createId();
        graphics.generateTexture(wheelId, this.wheelWidth, this.wheelWidth);
        // creating a sprite with wheel image as if it was a preloaded image
        var wheel = this.add.sprite(0, 0, wheelId);
        // adding the wheel to the container
        wheelContainer.add(wheel);    

        //add text objects
        this.wordsOnWheel = [];
        this.wordArrayForAdjustSize = [];
        
        for(var i = 0; i < countPerBatch && this.chineseArray.length > 0; i++) {
        	var frontText = this.createFrontText();
        	frontText.setBackgroundColor(null);
        	frontText.setOrigin(0.5);
        	wheelContainer.add(frontText);
        	
        	this.wordsOnWheel.push(frontText);
        	this.wordArrayForAdjustSize.push(frontText);
        	
        	frontText.alpha = 0;//invisible initially until the size is calculated.
        	
        	var angle = this.degreePerWord *(i+0.5);
        	
        	frontText.x = this.wheelWidth/2 *0.618 * Math.cos(angle*Math.PI*2/360.0); 
        	frontText.y = this.wheelWidth/2 *0.618 * Math.sin(angle*Math.PI*2/360.0);        	
        	frontText.angle = angle;
		}
        
        //add a push button in the center of the wheel
        this.pushSpinBtn = this.createPushBtn();
        this.enablePushBtn(wheelContainer, this.pushSpinBtn);
        
        var pushBtnRing = this.createRing(124, "#000000"); 
        masterContainer.add(pushBtnRing); 
        
        masterContainer.add(this.pushSpinBtn);
        
        //add spin label to the spin button
        this.spinBtnText = this.add.text(0,0, "Spin", {
            font: "bold 24px Arial",
            align: "center",
            color: "white"
        }).setOrigin(0.5);                        
        masterContainer.add(this.spinBtnText);

        this.wheelRing = this.createRing(this.wheelWidth, "#881111"); 
        masterContainer.add(this.wheelRing);        

        wheelContainer.isSpinning = false;
                
        //draw decorative balls on the rings
        this.drawLittleBalls();
        
        //adjust the word text sizes to make sure they fit into their slices.
        var textBoxHeight = this.getTextBoxHeight();
        var textBoxWidth = this.getTextBoxWidth();               
        this.autoSizeTextTimer = this.time.addEvent({
			delay : 50,
			callback : this.autoAdjustText,
			args: [78, textBoxWidth, textBoxHeight],
			callbackScope : this,
			loop : true
		});	 
        
        //draw winning slice pointer
        var pointerWidth = this.wheelWidth/2/2; //half of the radius
        var pointerHeight = pointerWidth/3;
        this.pointer = this.drawWinningPointer(this, pointerWidth, pointerHeight);
        this.pointer.x = fn_getCanvasWidth()/2 + this.wheelWidth/2 + this.pointer.displayWidth/4;//one third of the pointer overlaps with the wheel.         
        this.pointer.y = fn_getCanvasHeight()/2;
        
        //draw the nail to fix the pointer.
		var pointerNail = fn_createRadientBtn(this,pointerHeight/4,"#FF5555","#FF5555");
		pointerNail.x = this.pointer.x + pointerWidth/2 -pointerHeight/2-pointerNail.displayWidth/2;
		pointerNail.y = this.pointer.y - pointerNail.displayHeight/3;

		//draw the choice trays
		this.choiceBtns = [];
		var btnCount = 4;
		var trayColors = ["#8B0000", "#B8860B","#556B2F","#2F4F4F","#008B8B", "#B97A57","#00CCCC","#4B0082"];
		fn_shuffle(trayColors);
		for(var i = 0; i < btnCount; i++) {			
			var btn = this.createChoiceBtn(trayColors.shift());
			btn.x = btn.displayWidth*0.6;			
			var startY = (fn_getCanvasHeight() - btnCount * (btn.displayHeight + 20))/2;			
			btn.y = startY + i*(btn.displayHeight + 20) + btn.displayHeight/2;
			
			this.choiceBtns.push(btn);	
		}
		
		//buttons are disabled initially until the first spin
		for(var jj = 0; jj < this.choiceBtns.length; jj++) {
			this.input.disable(this.choiceBtns[jj]);			
		}
		
		return wheelContainer;
	}.bind(scene);
	
	scene.createChoiceBtn = function(buttonColor) {
		var wheelWidth = fn_getCanvasHeight()*0.9;
		var id = fn_createId();
		var width =  (fn_getCanvasWidth()/2 - wheelWidth/2)*0.8;//80% of available width on the left side
		var height = fn_getCanvasHeight()*0.8/6; //use 70% of height;
				
		var btn = fn_roundRect(this, width, height, buttonColor);
	    btn.setInteractive({useHandCursor: true}).on('pointerup', function() {
        	this.checkCorrect(btn);
		}, this).on('pointerover', function(){btn.scale=1.05; btn.setTint("0xFF0000");}, this).on('pointerout', function(){btn.scale=1; btn.clearTint();}, this);
			
	    return btn;
	}.bind(scene);
	
	scene.drawWinningPointer = function(scene, width, height) {
		return fn_drawRedPointer(this, width, height, "#FF0000");		
	}.bind(scene);
	
	scene.drawLittleBalls = function() {
		//place a ball on the ring for every 15 degrees. That is 24 balls 
		var wheelWidth = fn_getCanvasHeight()*0.9;
		var radius = wheelWidth/2;
				
		var count = 360/15;
		var littleBalls = [];
		for(var i = 0; i < count; i++) {
			var degree = i*15;
			var x = radius * Math.cos(fn_deg2Rad(degree));
			var y = radius * Math.sin(fn_deg2Rad(degree));
			var ballRadius = 0.02*wheelWidth;
			var littleBalll = fn_createRadientBtn(this,ballRadius,"#FFFF00","#00FF00");
			littleBalll.x = fn_getCanvasWidth()/2 + x;
			littleBalll.y = fn_getCanvasHeight()/2 + y;
			littleBalll.alpha = 0.1;
			littleBalll.scale = 0.8;
			littleBalls.push(littleBalll);
		}
		
		 this.tweens.add({
             targets: littleBalls,
             duration: 2000,
             alpha: 1,
             scale: 1,
             ease: "Elastic",
             yoyo: true,
		     repeat: -1,
             onStart: function(){
             },             
             callbackScope: this,
             onComplete: function(){
             }
         });        
	}.bind(scene);
	
	scene.enablePushBtn = function(wheelContainer, pushSpinBtn) {
		pushSpinBtn.setInteractive({useHandCursor: true}).on('pointerup', function() {
        	//spin the wheel
			pushSpinBtn.scale=1;
        	this.spinWheel(wheelContainer, this.wheelRing, pushSpinBtn);
        	
			//timer won't start until the user spinned the wheel
			if (!!!this.gameTimer) {
				//create the timer. Called only once after starting drag-n-drop
				this.gameTimer = this.time.addEvent({
						delay : 100,
						callback : this.updateTime,
						callbackScope : this,
						loop : true
				});			
			}				    	
		}, this).on('pointerover', function(){pushSpinBtn.scale=1.005;}, this).on('pointerout', function(){pushSpinBtn.scale=1;}, this);
	}.bind(scene);
	
	scene.autoAdjustText = function(initFontSize, width, height) {
		
		if (this.wordArrayForAdjustSize.length > 0) {
    		var frontText = this.wordArrayForAdjustSize.shift();	
    		var fontFamily = frontText.style.fontFamily;
    		var ratio = 0.8;
			if (fn_hasChineseText(frontText.text)) {//boost chinese text size
				ratio = 1.2;
			}
    		var fontSize = ratio*fn_findMaxFontInBox(this, frontText.text, fontFamily,initFontSize, width*0.9, height*0.95);
    		if (this.wordsOnWheel.leongth < 5) {//we don't want the font too big.
    			fontSize = fontSize* 0.85;
    		}
    		
    		frontText.setWordWrapWidth(width, true);
    		frontText.setAlign("center");
    		frontText.setFontSize(fontSize);
    		frontText.setFontFamily(fontFamily);
    		frontText.alpha = 1;
		} else {
			//done, destroy the timer
			this.autoSizeTextTimer.destroy();
			
	        //delay one second to call if auto spin is enabled
			if (this.isAutoSpinOn) {
				this.time.delayedCall(500, function() {
					this.spinWheel(this.wheel, this.wheelRing, this.pushSpinBtn);	
				},[], this);	    			
			}		
		}		
	}.bind(scene);
	
	scene.showChoiceItems = function() {
		//set the old text invisible if any
		for(var m = 0; m < this.choiceBtns.length; m++) {
			if (this.choiceBtns[m].word) {
				this.choiceBtns[m].word.backText.setVisible(false);
			}
		}
 
		var indexArray = [0, 1, 2, 3];
		fn_shuffle(indexArray);
		
		//add the correct one using a random button index
		this.choiceBtns[indexArray.shift()].word = this.prizeSlice; 
		
		//find 3 choices from the word pool 
		var choiceWords = [];
		var attempt = 0;
		while(choiceWords.length < 3 && attempt < 50) {
			var index = fn_rand(0, this.wordPool.length-1);//Note: max inclusive!!
			var aWord = this.wordPool[index];			
			if (aWord.chinese != this.prizeSlice.chinese && choiceWords.indexOf(aWord) < 0) {
				choiceWords.push(aWord);
			}
			attempt++;
		}
		
		//add the 3 selected choices
		for(var j = 0; j < choiceWords.length; j++) {
			this.choiceBtns[indexArray.shift()].word = choiceWords[j];
		}
		
		//adjust size of the 4 choices and display them
		var width = this.choiceBtns[0].displayWidth;
		var height = this.choiceBtns[0].displayHeight;
		
		for(var k = 0; k < this.choiceBtns.length; k++) {
			var backText = this.choiceBtns[k].word.backText;
			var fontFamily = backText.style.fontFamily;
			var ratio = 0.8;
			if (fn_hasChineseText(backText.text)) {//boost chinese text size
				ratio = 1.1;
			}
			var fontSize = ratio*fn_findMaxFontInBox(this, backText.text, fontFamily,78, width, height);
			backText.setWordWrapWidth(0.9*width, true);
			backText.setAlign("center");
			backText.setFontSize(fontSize);
			backText.setFontFamily(fontFamily);
			
			backText.setVisible(true);
			this.children.bringToTop(backText);
			fn_nestedInCenter(backText,this.choiceBtns[k]);		
		}
		
	}.bind(scene);
	
	scene.spinWheel = function(container, wheelRing, pushSpinBtn) {		
		//clear Xs on the choice buttons
		for(var i = 0; i < this.xAndCheckBtns.length; i++) {
			this.xAndCheckBtns[i].destroy();
		}
		this.xAndCheckBtns = [];
		
		//
		if(this.flashTimer){
			this.flashTimer.destroy();			
		}
		
        if (!container.isSpinning) {
        	container.isSpinning = true;
        	var degrees = fn_rand(0, 360);
        	if (this.wordsOnWheel.length == 1) {//only one word left
        		degrees = 360-fn_rand(45, 135);
        	}
        	var prize = this.wordsOnWheel.length - 1 - Math.floor((degrees)/(360/this.wordsOnWheel.length));
        	this.prizeSlice = this.wordsOnWheel[prize];
        	this.showChoiceItems();
            this.tweens.add({
                targets: [container],
                angle: 360 * fn_rand(8, 12) + degrees,
                duration: fn_rand(3000, 6000),
                ease: "Cubic.easeOut",
                onStart: function(){
                	pushSpinBtn.removeInteractive();//user cannot hit the spin button again
                	this.spinBtnText.alpha = 0.1;
                },
                callbackScope: this,
                onComplete: function(){                	                
            		for(var jj = 0; jj < this.choiceBtns.length; jj++) {
            			this.input.enable(this.choiceBtns[jj]);			
            		}
            		
                	this.flashTimer = this.time.addEvent({
						delay : 400,
						callback : this.flashText,
						args: [this.wordsOnWheel[prize]],
						callbackScope : this,
						loop : true
                	});
                	
                	container.isSpinning = false;
                	this.enablePushBtn(container, pushSpinBtn);
                	this.spinBtnText.alpha = 1;
                	
        			if (this.isSoundOn && this.prizeSlice) {
        				fn_playWordSound(this.prizeSlice.chinese,this.prizeSlice.pinyin);
        				console.log("Play Mom's Voice");
        			}

        			if (this.isZoomInOn) { 
	        			//zoom in 
	        			var cam = this.cameras.main;
	        			//x, y [, duration] [, ease] [, force] [, callback] [, context]
	                    cam.pan(fn_getCanvasWidth()/2 + fn_getCanvasWidth()/5, fn_getCanvasHeight()/2, 2000, 'Power2');
	                    //zoom [, duration] [, ease] [, force] [, callback] [, context])
	                    cam.zoomTo(2, 2000);
	                    
	                    //after 1 second, zoom out, back to normal state
		    			this.time.delayedCall(3000, function() {
		                    cam.pan(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2, 2000);
		                    cam.zoomTo(1, 2000);	
		    			},[], this);	    
        			}

                	/*
                    // another tween to rotate a bit in the opposite direction
                    this.tweens.add({
                        targets: [container],
                        angle: container.angle - fn_rand(30, 40),
                        duration: fn_rand(2000, 4000),
                        ease: "Cubic.easeIn",
                        callbackScope: this,
                        onComplete: function(){
                        	this.prizeText.setText(this.wordsOnWheel[prize].text)
                        	container.isSpinning = false;
                        	this.enablePushBtn(container, pushSpinBtn);
                        	this.spinBtnText.alpha = 1;
                        }
                    
                    })
                    */
                }
            });        
        }
	}.bind(scene);
	
	scene.flashText = function(textObject) {
		var colorString = fn_rgb2Str(Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255));
		textObject.setColor(colorString);
	}.bind(scene);
		
	scene.shuffleChinesePinyinEnglishImgArrays = function() {
		var arrayOfArray = fn_syncShuffle([this.chineseArray, this.pinyinArray, this.englishArray, this.imgURLArray]);
		
		this.chineseArray = arrayOfArray[0];
		this.pinyinArray = arrayOfArray[1];
		this.englishArray = arrayOfArray[2];		
		this.imgURLArray = arrayOfArray[3];
	}.bind(scene);

	scene.checkCorrect = function(btn) {
		
		//we have a match!!
		if(this.prizeSlice.chinese == btn.word.chinese){
			
			var checkMarkBtn = this.drawCheckMark(btn)
			checkMarkBtn.alpha = 1;
			this.xAndCheckBtns.push(checkMarkBtn);
			fn_nestedInCenter(checkMarkBtn,btn);
			
			//disable all choice buttons after the user selected an answer
			for(var jj = 0; jj < this.choiceBtns.length; jj++) {
				this.input.disable(this.choiceBtns[jj]);			
			}
			
			if(this.flashTimer){
				this.flashTimer.destroy();			
			}
			if (this.isMusicOn) {
				fn_playSound(this.pickupSound, fn_getBackgroundMusicVolume(), false);
			}			
			
			this.correctedAnswer +=1;
    		this.updateProgress();
			//because we only show the words on the wheel by batches. We need to check if we have more words to add
			if (this.chineseArray.length > 0) {
				//grab one and put at the same spot of the matched/removed one				
				//we need to use the x, y position and angle
				var x = this.prizeSlice.x;
				var y = this.prizeSlice.y;
				var angle = this.prizeSlice.angle;
				
				//assign the new word to the old spot.
				var newWord = this.createFrontText()
				this.wheel.add(newWord);//add to the wheel container (not an array)
				
				//replace the old word with the new one at the exact same location
				var matchIndex = this.wordsOnWheel.indexOf(this.prizeSlice);
				this.wordsOnWheel.splice(matchIndex, 1, newWord);//add to the this.wordsOnWheel
				
				//destroy the old object
				this.prizeSlice.backText.destroy();				
				this.wheel.remove(this.prizeSlice, true);
				
				newWord.x = x;
				newWord.y = y;
				newWord.angle = angle;
				newWord.setBackgroundColor(null);
				
				//recalc font size because the text is different now.
		        var textBoxHeight = this.getTextBoxHeight();
		        var textBoxWidth = this.getTextBoxWidth();               
	    		var fontFamily = newWord.style.fontFamily;
	    		var ratio = 0.8;
				if (fn_hasChineseText(newWord.text)) {//boost chinese text size
					ratio = 1.2;
				}
	    		var fontSize = ratio*fn_findMaxFontInBox(this, newWord.text, fontFamily, 88, textBoxWidth*0.9, textBoxHeight*0.95);
	    		newWord.setWordWrapWidth(textBoxWidth, true);
	    		newWord.setAlign("center");
	    		newWord.setFontSize(fontSize);
	    		newWord.setFontFamily(fontFamily);	 
	    		

	    		if (this.isAutoSpinOn) {
	    			this.time.delayedCall(500, function() {
	    				this.spinWheel(this.wheel, this.wheelRing, this.pushSpinBtn);	
	    			},[], this);	    			
	    		}
			}  else {
				//no new words to add. We need to redraw the wheel
				//remove this word (text object) from wheel container and destroy it
				fn_removeElement(this.wordsOnWheel, this.prizeSlice);				
				//this.prizeSlice.backText.destroy();
				this.wheel.remove(this.prizeSlice, true);
				
				if (this.wordsOnWheel.length == 0) {
					//cheer sound!!!
					
					//game over
	        		this.time.delayedCall(500, this.navigateToGameOverScene,[], this);
				} else {
					//redraw the wheel slices and re-position the remaining words.
					this.refreshWheel();
				}
			}			
		} else {
			//user clicked a wrong answer,
			var backText = btn.word.backText;			
			
			//draw a red cross on the incorrect one
			var xBtn = this.drawX(btn)
			xBtn.alpha = 0.6;
			this.xAndCheckBtns.push(xBtn);
			
			fn_nestedInCenter(xBtn,btn);			
		}
	}.bind(scene);

	scene.drawX = function(btn) {
		return fn_drawX(this,btn,"#FF0000");
	}.bind(scene);

	scene.drawCheckMark = function(btn) {
		return fn_drawCheckMark(this,btn,"#00FF00");
	}.bind(scene);
	
	scene.updateTime = function() {
		this.totalTime += 1;//mill sec.  add one second to the total time
		//format the time display 		
		this.timerText.setText("Time: " + fn_formatSeconds(Math.floor(this.totalTime/10)) + ':'+ this.totalTime%10);
	}.bind(scene);
	
	scene.updateListName = function(displayName) {
		this.titleText.setText(displayName);
		this.titleText.x = this.sys.canvas.width - this.titleText.getBounds().width
		- 16;	
		
		this.creatorText.setText("Created By: " + fn_getCreator()); 
		this.creatorText.x = this.sys.canvas.width - this.creatorText.getBounds().width
		- 16;	
	}.bind(scene);
	
	scene.updateProgress = function() {
		//show progress				
		if (this.totalCount > 0) {
			var pct =  this.correctedAnswer/this.totalCount;
			fn_updateProgressBar(this,pct);//1% as the starting point
		}
	}.bind(scene);
		
	

	scene.navigateToGameOverScene = function() {
		//do not submit time if the user clicked the Stop button to abort the game
		//if we have more Chinese words or have remaining words on the wheel, do not record time.
		if (this.chineseArray.length > 0 || this.wordsOnWheel.length > 0) {
			this.totalTime = 0;
		} else {
			if (this.isMusicOn) {
				fn_playSound(this.cheerSound, fn_getBackgroundMusicVolume(), false);
			}
		}
		if (this.isMusicOn) {
			scene.music.pause();// stop background music
		}
		scene.scene.stop(wheelOfWords.getGameSceneOneId());
		scene.scene.stop(wheelOfWords.getGameGlassId());
		scene.scene.start(wheelOfWords.getGameOverId());				
    }.bind(scene);
        
	return scene;
})();
