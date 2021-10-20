//the first play scene of this game. This scene runs after the title scene.
 dragAndMatch.gameScene1 = (function() {		
	var scene = fn_createScene(dragAndMatch.getGameSceneOneId());
	// NOTE, this init method will be called by the framework first.It is called
	// before preload, create and update.
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.pickupAudioId = fn_createId();
		this.checkMarkId = fn_createId();
		
		//list of the word containers. it is empty initially.
		this.liveWords = [];		
		
		//initial speed to push away each other. will reduced to zero after one or two seconds.
		this.pushAwaySpeed = 200;
		
		this.batchIndex = 0;
		//the following two variables are used to track progress. game will over when all the words are matched at least once.
		this.matchedChineseList = [];
		this.totalChineseCount = 0;//THIS VALUE SHOULD BE SET ONLY ONCE AFTER DATA IS RETRIEVED FROM THE SERVER. 
		//////////////////////
				
		//variable for total time
		this.totalTime = 0;
		
		this.currentMatchType = -1;// value should be from 0 to 5.
		//0: front chinese, back, pinyin
		//1: front pinyin, back, chinese		
		//2: front chinese, back, english
		//3: front english, back, chinese		
		//4: front pinyin, back, english
		//5: front english, back, pinyin							
	}
	
	scene.preload = function() {
		//load images
		var backgroundImageURL = dragAndMatch.getAsset("background.png");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);
			this.userBackgroundImageUsed = true;
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}								
		
		this.load.image(this.btnBackgroundImgId, this.getAsset("button-bg.png"));
		this.load.image(this.checkMarkId, this.getAsset("checkmark.png"));
		
		//load music
		this.loadMusic(this.pickupAudioId, "pickup.mp3");
	}
		
	scene.create = function() {
		//set to full screen. Only works on FireFox and Chrome.
		fn_setToFullScreen(this);		

		//set background image. User tile for default background, but single piece for user defined 		
		if (this.userBackgroundImageUsed) {
			fn_setBackground(this, this.backgroundImgId);	
		} else {
			fn_createTileSprite(this, this.backgroundImgId);
		}
                                     
        //start and play background music
        //no background music for this Drag and Match game.
			
        //pick up sound
        this.pickupSound = this.sound.add(this.pickupAudioId);
                
    	//set up game name, word count, created by
        //and time, progress, etc
        this.setUpGameStatusLabels();
			
		// /////////////////////////////
		// load game data from server for this scene
		//data is loaded after everything has been set.
		fn_loadGameVocabListsByUUID();
	}
	
	scene.update = function() {
	}
	
    ///////////////////////////////////////////////////////////////////////////
	
	scene.getAsset = function(name) {
		return dragAndMatch.getAsset(name);
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
		
		//create pause button at the screen bottom, MAKE SURE create the btn image first and then create the button label!!!
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
		scene.scene.pause(dragAndMatch.getGameSceneOneId());
		//scene.music.pause();// stop background music
		scene.scene.wake(dragAndMatch.getGameGlassId());		
		scene.scene.moveAbove(dragAndMatch.getGameSceneOneId(), dragAndMatch.getGameGlassId());	
	}.bind(scene);
	
	scene.enablePauseBtn = function() {
		scene.pauseBtn.setText("Pause");
		fn_nestedInCenter(scene.pauseBtn,scene.pauseBtnBg);
	}

	// handles returned word lists from server. This is called by game agent.
	scene.setGameVocabLists = function(displayName, chineseArrayStr, pinyinArrayStr,
			englishArrayStr, imgURLArrayStr) {
		// note "~" is the delimiter!!, cache the data lists on the scene object. 
		this.chineseArray = chineseArrayStr.split("~");
		this.pinyinArray = pinyinArrayStr.split("~");
		this.englishArray = englishArrayStr.split("~");		
		this.imgURLArray = imgURLArrayStr.split("~");
		//sometimes the list is too big, we need to breakdown multiple groups, 20 entries at a time
		//otherwise the screen would be too crowded.
		this.lastDataIndex = -1;//-1 means we have not run any sub-lists.
		//update the list title text
		this.updateListName(displayName);
		
		//set only once by this setGameVocabLists function. It is used to calculate progress percentage only!!
		this.totalChineseCount = this.chineseArray.length;
		
		//update the word count text
		this.wordCountText.setText("Word Count: " + this.chineseArray.length);
		this.wordCountText.x = this.sys.canvas.width - this.wordCountText.getBounds().width - 20;	
		
		//shuffle our raw data first.
		this.shuffleChinesePinyinEnglishImgArrays();
		//done randomizing
		
		// refresh the words on the screen
		this.refreshWithNewWords();				
	}.bind(scene);

	scene.createWordContainer = function(frontWord, backWord, helpWord) {
		var canvasWidth = fn_getCanvasWidth();
		var canvasHeight = fn_getCanvasHeight();
		var pinyinFontFamily = fn_getPinyinFont();
		var chineseFontFamily = fn_getChineseFont(); 
		var englishFontFamily = fn_getEnglishFont();
		
		var userFontSize = parseInt(fn_getGameTextSize());
		if (userFontSize < 42) {
			userFontSize = 42;
		}
		
		var frontFontSize = userFontSize;
		var frontFontFamily = chineseFontFamily;
		//0: front chinese, back, pinyin
		//1: front pinyin, back, chinese		
		//2: front chinese, back, english
		//3: front english, back, chinese		
		//4: front pinyin, back, english
		//5: front english, back, pinyin										
		switch(this.currentMatchType) {
			case 0://chinese
			case 2://chinese
				frontFontFamily = chineseFontFamily;
				frontFontSize = userFontSize + 8;
				break;
			case 1://pinyin
			case 4://pinyin
				frontFontFamily  = pinyinFontFamily;
				var convertedFronWord = fn_processPinyin(frontWord);//convert Pinyin from tone numbers to tone marks.
				frontWord = convertedFronWord;
				frontFontSize = userFontSize *0.95;
				break;
			case 3://english
			case 5://english	
				frontFontFamily  = englishFontFamily;
				frontFontSize = userFontSize *0.85;
				break;
		}
						
		var frontText = scene.add.text(0, 0, frontWord, {
			fontFamily : frontFontFamily,
			fontWeight : 'bold',
			fontSize : frontFontSize,
			//color : "#FF0000"
			color : fn_getGameTextColor()
		}).setOrigin(0.5);
		
		//////////////////
		frontText.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
		//frontText.setBackgroundColor("#CCCCCC");
		/////
		var container = scene.add.container(10,100, [ frontText ]);//one word per container
		container.setSize(container.getAt(0).getBounds().width,
				container.getAt(0).getBounds().height);//container has the same size as the text		
		///end front handling
		
		//process the back side value. They are invisibile intially until this word is matched
		var backFontFamily = chineseFontFamily;
		var backFontSize = userFontSize;
		//0: front chinese, back, pinyin
		//1: front pinyin, back, chinese		
		//2: front chinese, back, english
		//3: front english, back, chinese		
		//4: front pinyin, back, english
		//5: front english, back, pinyin												
		switch(this.currentMatchType) {
			//regular
			case 0://pinyin
			case 5://pinyin	
				backFontFamily  = pinyinFontFamily;
				backWord = fn_processPinyin(backWord);//convert Pinyin from tone numbers to tone marks.
				backFontSize = userFontSize*0.95;
				break;
			case 2://english
			case 4://english	
				backFontFamily  = englishFontFamily;
				backFontSize = userFontSize*0.85;
				break;
			case 1://chinese
			case 3://chinese
				backFontFamily  = chineseFontFamily;
				backFontSize = userFontSize + 8;
				break;
		}
				
		var backText = scene.add.text(0, 0, backWord, {
			fontFamily : backFontFamily,
			fontWeight : 'bold',
			fontSize : backFontSize,
			//color : "#FF0000"
			color : fn_getGameTextColor()
		}).setOrigin(0.5);
		backText.setVisible(false);
				
		backText.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
		container.backText = backText;//attach it to the container object. will be used when it is hit by the player
		/////////////////////attach Chinese and raw Pinyin to the container for playing native speaker audio
		//now attach the Chinese word and raw Pinyin to the container as well so that
		//we can load and play the audio of this word.
		switch (this.currentMatchType) {
			case 0://front chinese, back, pinyin
				container.chinese =  frontWord;
				container.pinyin = backWord; 
				break;
			case 1://front pinyin, back, chinese
				container.chinese =  backWord;
				container.pinyin = frontWord; 				
				break;
			case 2:// front chinese, back, english
				container.chinese =  frontWord;
				container.pinyin = helpWord;
				break;
			case 3:// front english, back, chinese
				container.pinyin = helpWord;
				container.chinese =  backWord;
				break;
			case 4:// front pinyin, back, english
				container.pinyin = frontWord;
				container.chinese = helpWord;
				break;
			case 5:// front english, back, pinyin
				container.pinyin = backWord;
				container.chinese = helpWord;
				break;			
		}			
		////////////////////
		
		return container;
	}.bind(scene);
	
	scene.setWordInteractive = function(container ) {
		//done creation of container
		container.setInteractive({useHandCursor: true, draggable: true})
		.on('dragstart', function (pointer, dragX, dragY) {
			//container.getAt(0).setStyle({fill : fn_getGameMatchedTextColor()});
			container.getAt(0).setStyle({fill : '#000000'});
			this.children.bringToTop(container);
			
			//timer won't start until the user started drag and drop
			if (!!!this.gameTimer) {
				//create the timer. Called only once after starting drag-n-drop
				this.gameTimer = this.time.addEvent({
						delay : 100,
						callback : this.updateTime,
						callbackScope : this,
						loop : true
				});			
			}
         }, this)		
		.on('drag', function (pointer, dragX, dragY) {
			container.setPosition(dragX, dragY);
         }).on('dragend', function (pointer, dragX, dragY) {
         })
         .on('pointerup', function(){  
        	
        	var collidedContainer = fn_findOverlap(this.liveWords, container);
 			if (collidedContainer != null) {
 				this.checkCorrect(container, collidedContainer);
 			}
         }, this)
        .on('pointerover', function(){
        	container.getAt(0).setStyle({fill : fn_getGameVisitedTextColor()});
        }, this)
		.on('pointerout', function(){
			container.getAt(0).setStyle({fill : fn_getGameTextColor()});
		}, this);		
	}.bind(scene);
		
	scene.shuffleChinesePinyinEnglishImgArrays = function() {
		var arrayOfArray = fn_syncShuffle([this.chineseArray, this.pinyinArray, this.englishArray, this.imgURLArray]);
		
		this.chineseArray = arrayOfArray[0];
		this.pinyinArray = arrayOfArray[1];
		this.englishArray = arrayOfArray[2];		
		this.imgURLArray = arrayOfArray[3];
	}.bind(scene);
	
	//this refresh will pull new words in and 
	//change the match type and prompt text. it is more destructive 
	//than refreshWithSamePromptAndMatchType, which is called much more frequently.
	scene.refreshWithNewWords = function() {
		if (this.gameTimer) {
			this.gameTimer.paused = true;
		}
		//update ship flying base speed		
		this.frontList = [];// clear the existing list
		this.backList = [];
		this.helpList = [];//store chinese or pinyin, depending on the match type, used for playing audio.
		
		this.liveWords = [];
						
		var newMatchType = fn_getGameMatchType();
		//console.log("match type: " + newMatchType);
		if (newMatchType == this.currentMatchType) {
			// try one more time to avoid playing the same type of match
			newMatchType = fn_getGameMatchType();
		}
		this.currentMatchType = newMatchType; // updated the cached match

		// set the front and back list based on a random matching type provided by
		// GWT code.
		// We may need to make this match type configurable by the teacher when
		// she/he sets up the game
		// note "~" is the delimiter!!
		var countPerBatch = fn_getBatchSize();		
		if (this.chineseArray.length < countPerBatch) {
			countPerBatch = this.chineseArray.length;
		}
		var chineseSubList = [];
		var pinyinSubList = [];
		var englishSubList = [];
		for(k = 0;  k < countPerBatch; k++) {
			this.lastDataIndex +=1;//increment the data pointer  of the cached lists
			if (this.lastDataIndex < this.chineseArray.length) {
				chineseSubList.push(this.chineseArray[this.lastDataIndex]);
				pinyinSubList.push(this.pinyinArray[this.lastDataIndex]);
				englishSubList.push(this.englishArray[this.lastDataIndex]);
			}
		}
		
		//0: front chinese, back, pinyin
		//1: front pinyin, back, chinese		
		//2: front chinese, back, english
		//3: front english, back, chinese		
		//4: front pinyin, back, english
		//5: front english, back, pinyin							
		switch (this.currentMatchType) {
		case 0://front chinese, back, pinyin 
			fn_copyList(this.frontList, chineseSubList);
			fn_copyList(this.backList, pinyinSubList);
			fn_copyList(this.helpList, englishSubList);
			break;
		case 1://front pinyin, back, chinese
			fn_copyList(this.frontList, pinyinSubList);
			fn_copyList(this.backList, chineseSubList);
			fn_copyList(this.helpList, englishSubList);			
			break;
		case 2:// front chinese, back, english
			fn_copyList(this.frontList, chineseSubList);
			fn_copyList(this.backList, englishSubList);
			fn_copyList(this.helpList, pinyinSubList);			
			break;
		case 3:// front english, back, chinese
			fn_copyList(this.frontList, englishSubList);
			fn_copyList(this.backList, chineseSubList);
			fn_copyList(this.helpList, pinyinSubList);
			break;
		case 4:// front pinyin, back, english
			fn_copyList(this.frontList, pinyinSubList);
			fn_copyList(this.backList, englishSubList);
			fn_copyList(this.helpList, chineseSubList);
			break;
		case 5:// front english, back, pinyin
			fn_copyList(this.frontList, englishSubList);
			fn_copyList(this.backList, pinyinSubList);
			fn_copyList(this.helpList, chineseSubList);
			break;			
		}
		
		////////////////////////////////Create word container based on the words////////////////////////		
		for ( var i = 0; i < this.frontList.length; i++) {
			//set the correct font family for the displayed word text(Chinese, Pinyin or English)
			//note that prompt text font needs to be match type sensitive as well
			var frontContainer = this.createWordContainer(this.frontList[i], this.backList[i], this.helpList[i]);//regular container
			this.setWordInteractive(frontContainer);
			this.liveWords.push(frontContainer);			
			
			var backContainer = this.createWordContainer(this.frontList[i], this.backList[i], this.helpList[i]);//front/back switched
			//remove the front and destroy it. we don't need it						
			backContainer.removeAll(true);
			
			var newFrontText = backContainer.backText;
			backContainer.backText = null;
			newFrontText.setVisible(true);//was invisible before.
			//newFrontText.setBackgroundColor("#CCCCCC");			
			backContainer.add(newFrontText);//we add backtext			
			backContainer.setSize(backContainer.getAt(0).getBounds().width,
					backContainer.getAt(0).getBounds().height);//container has the same size as the text
			//wire up event handlers
			this.setWordInteractive(backContainer);//must have this !!!!
			this.liveWords.push(backContainer);			
		}
		
		this.batchIndex += 1;//increase batch index. 
		//////////////////////////////////
		
		this.spreadWordsOnTheScreen();				
	}.bind(scene);
	
	scene.spreadWordsOnTheScreen = function() {		
		for (var i = 0; i < this.liveWords.length; i++) {
			var container = this.liveWords[i];
			
			this.physics.world.enableBody(container);			
			container.setVisible(true);
			container.getAt(0).setVisible(true);
			container.x = Math.random()*fn_getCanvasWidth();
			container.y = Math.random()*fn_getCanvasHeight();
			
			//initially set bouncing to both vertical and horizontal direction to remove overlaps
			container.body.setVelocity(fn_rand(-1*this.pushAwaySpeed,this.pushAwaySpeed), fn_rand(-1*this.pushAwaySpeed,this.pushAwaySpeed));			
			container.body.allowGravity = false;
			container.body.setBounce(1);
			
			//allows drag on the containers/body. Slows down after initial pushaway. Removes need for setting velocity to zero
			container.body.allowDrag = true;
			container.body.setDrag(40);
            
			container.body.setCollideWorldBounds(true);
		}
		this.physics.add.collider(this.liveWords, this.liveWords);// collide with each other to avoid overlapping
		this.physics.add.overlap(this.liveWords, this.liveWords, function(){
			//show overlap, visually.
		}, null, this);
		this.time.delayedCall(1000, this.settleDownWords, [], this);
		
	}.bind(scene);
	
	scene.checkCorrect = function(containerA, containerB) {
		
		if (containerA.chinese == containerB.chinese) {			
			fn_playSound(this.pickupSound, fn_getBackgroundMusicVolume(), false);
			
			containerA.removeInteractive();
			containerB.removeInteractive();
			//track the matched entries.
			if (this.matchedChineseList.indexOf(containerA.chinese) < 0) {
				this.matchedChineseList.push(containerA.chinese);
			}
			//add green check mark to the container, after the front text
			var greenCheckMark = this.add.image(0, 0, this.checkMarkId);
			greenCheckMark.scale = 0.8;
			containerA.add(greenCheckMark);
			containerA.getAt(1).y =  containerA.getAt(0).y - containerA.getAt(0).getBounds().height/2 ;
			containerA.getAt(1).x =  containerA.getAt(0).x + containerA.getAt(0).getBounds().width ;
			
			//set the front text to the matched color (white)
			containerA.getAt(0).setColor(fn_getGameMatchedTextColor());
			containerA.getAt(0).setBackgroundColor(null);//remove background
			
			//add the back text from container B to the front container as the 3rd element
			var containerBCopy = scene.add.text(0, 0, containerB.getAt(0).text, {
				fontFamily : containerB.getAt(0).style.fontFamily,
				fontWeight : 'bold',
				fontSize : containerB.getAt(0).style.fontSize,
				color :  fn_getGameMatchedTextColor()
			}).setOrigin(0.5);
			containerA.add(containerBCopy);
			
			//set the new backtext element at the top of the front text
			containerA.getAt(2).y =  containerA.getAt(0).y - containerA.getAt(0).getBounds().height;
			containerA.getAt(2).x =  containerA.getAt(0).x 
			
			fn_fadeOut(this,3000,containerA);
		

 			//remove both from the live words list.
			fn_removeElement(this.liveWords, containerA);
			fn_removeElement(this.liveWords, containerB);
			
			//destroy  B immediately. we don't need it any more.						
			containerB.destroy();
			
			//wait for 2 seconds to destroy containerA because the tween aniamtion is still in progress.
			this.time.delayedCall(2000, function() {containerA.destroy();}, [], this);
			
			this.updateProgress();
 		}  else {
 			//does not match, bounce away
 			containerA.body.setBounce(1);	 
 			containerB.body.setBounce(1);
 			
 			containerA.body.setVelocity(fn_rand(-1*this.pushAwaySpeed,this.pushAwaySpeed), fn_rand(-1*this.pushAwaySpeed,this.pushAwaySpeed));
 			containerB.body.setVelocity(fn_rand(-1*this.pushAwaySpeed,this.pushAwaySpeed), fn_rand(-1*this.pushAwaySpeed,this.pushAwaySpeed));
 		}
	}
	
	scene.settleDownWords = function() {
		for (var i = 0; i < this.liveWords.length; i++) {
			var container = this.liveWords[i];			
			container.body.setBounce(0)	
		}
		//now start our game timer
		if (this.gameTimer) {
			//timer has been created already.
			this.gameTimer.paused = false;
		} 
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
		if (this.totalChineseCount > 0) {
			var pct = this.matchedChineseList.length/this.totalChineseCount;
			fn_updateProgressBar(this,pct);//1% as the starting point
			
			//if we are 100 done, game over
			this.checkIfDone();
		}
	}.bind(scene);
	
	scene.checkIfDone = function() {
		if (this.matchedChineseList.length == this.totalChineseCount) {
			this.gameTimer.paused  = true;
			this.time.delayedCall(1000, this.navigateToGameOverScene,
					[], this);
		} else {
			//check if we are ready for a new batch
			if(this.liveWords.length == 0) {
				if (this.lastDataIndex < this.chineseArray.length - 1) {
					//we have more data to play for this level. Level should not be updated.
					
					// refresh the words on the screen
					this.refreshWithNewWords();				
				} else {					
					//shuffle our raw data first.
					//this.shuffleChinesePinyinEnglishImgArrays();
					//start it over
					//this.lastDataIndex = -1;
					//game over, we don't have more words 
					this.gameTimer.paused  = true;
					this.time.delayedCall(1000, this.navigateToGameOverScene,
							[], this);					
				}
			}
		}
	}.bind(scene);
	
	scene.navigateToGameOverScene = function() {
		//do not submit time if there are more than 1 to be done.
		if (this.totalChineseCount - this.matchedChineseList.length > 1) {//it appears we have a bug somewhere that prevent it from reaching to the exact number.
			this.totalTime = 0;
		}
		//calc score for display
		scene.scene.stop(dragAndMatch.getGameSceneOneId());
		scene.scene.stop(dragAndMatch.getGameGlassId());
		scene.scene.start(dragAndMatch.getGameOverId());
		//no background music				
    }.bind(scene);
        
	return scene;
})();
