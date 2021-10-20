//the first play scene of this game. This scene runs after the title scene.
 whackAMole.gameScene1 = (function() {		
	var scene = fn_createScene(whackAMole.getGameSceneOneId());
	// NOTE, this init method will be called by the framework first.It is called
	// before preload, create and update.
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.plantImgId = fn_createId();
		this.broadLeafPlantImgId = fn_createId();
		this.moleImgId = fn_createId();
		this.moleMaskId = fn_createId();
		this.pickupAudioId = fn_createId();
		this.punchAudioId = fn_createId();
		this.checkMarkId = fn_createId();
		
		//list of the word containers. it is empty initially.
		this.liveWords = [];
		
		//mole and pop coordination related.
		this.moles = [];
		this.recentMoleIds = [];//use to avoid certain moles pop too often
		this.recentMoleTextList = [];//use to avoid same text show too often
		
		
		this.batchIndex = 0;
		
		//the following two variables are used to track progress. game will over when all the words are matched at least once.
		this.matchedChineseList = [];
		this.totalChineseCount = 0;//THIS VALUE SHOULD BE SET ONLY ONCE AFTER DATA IS RETRIEVED FROM THE SERVER. 
		//////////////////////
		
		//variable for score/stats
		this.matchedCount = 0;		
		this.finalScore = 0;
		this.score = 0;
		this.totalHits = 0;
		this.accuracy = 0;
		
		//add level
		this.musicId = fn_createId();
						
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
		//Note the user cannot change the background image of Whack-a-mole.
		this.load.image(this.backgroundImgId, this.getAsset("background.png"));
		this.load.image(this.btnBackgroundImgId, this.getAsset("button-bg.png"));
		this.load.image(this.plantImgId, this.getAsset("best_plant.png"));
		this.load.image(this.broadLeafPlantImgId, this.getAsset("broad_leaf_plant.png"));		
		this.load.image(this.moleImgId, this.getAsset("mole.png"));
		this.load.image(this.checkMarkId, this.getAsset("checkmark.png"));
				
		this.load.image(this.moleMaskId, this.getAsset("mole_mask.png"));
		
		
		//load music
		this.loadMusic(this.musicId, "squirrel.mp3");
		this.loadMusic(this.pickupAudioId, "pickup.mp3");
		this.loadMusic(this.punchAudioId, "punch.mp3");		
	}
		
	scene.create = function() {
		//set to full screen. Only works on FireFox and Chrome.
		fn_setToFullScreen(this);		

		//Note a tile sprite is used for this game. The background png image is very small. 
        this.background = fn_createTileSprite(this, this.backgroundImgId);  
                                     
        //divide the screen with grids. each square is 250 by 250. 
        //and spread plants and mole holes on the screen
        this.createMolesAndPlants();
        
        //start and play background music
        this.music = this.sound.add(this.musicId);
        this.time.addEvent({
            delay: 30000 + 30000* Math.random(),//play the mole sound once
            callback: this.playMoleSound,
            callbackScope: this,
            loop: false
        });
			
        //pick up sound
        this.pickupSound = this.sound.add(this.pickupAudioId);
        this.punchSound = this.sound.add(this.punchAudioId);
                
    	//set up game name, word count, created by
        //and score, accuracy and life(heart count)
        this.setUpGameStatusLabels();
			
        //set up prompt text label. It is placed top-center of the screen. No plants will be planted on the prompt text area.
        this.setUpPromptTextLabel();
        
		// /////////////////////////////
		// load game data from server for this scene
		//data is loaded after everything has been set.
		fn_loadGameVocabListsByUUID();
	}
	
	scene.update = function() {
	}
	
    ///////////////////////////////////////////////////////////////////////////
	
	scene.getAsset = function(name) {
		return whackAMole.getAsset(name);
	}

	scene.loadMusic = function(id, mp3) {
		this.load.audio(id, [this.getAsset(mp3)]);		
	}.bind(scene)
	
	scene.createMole = function(x, y) {
        //1. draw mole hole
        var ellipse = this.drawMoleHole(x, y, 250, 160, 38);        
        //2. draw mole
        var mole = this.add.image(x, y+180, this.moleImgId);
        mole.uniqueId = "" + x + "-" + y;
        
        //3. draw mole mask
        var moleMask = this.add.image(x, y+200, this.moleMaskId);
        
        //4. draw half ellipse above the mole
        var graphics = this.add.graphics();
	    graphics.lineStyle(38, 0xB97A57, 1.0);
        var curve = fn_createEllipseCurve(x, y, 125, 80, 0, 180, false); 
        curve.draw(graphics, 64);
        
        return mole;
	}.bind(scene);
	
	scene.createMolesAndPlants = function() {
	  	var maxMoleCount = 6;                
        var unitSize = 250;
        var colCount = Math.floor(fn_getCanvasWidth()/unitSize);        
        var rowCount = Math.floor(fn_getCanvasHeight()/unitSize);                
        var cellArray = [];
        var xOffset = 100;
        var yOffset = 40;
        
        for(var i = 0; i < rowCount; i++) {
        	cellArray.push([]);
        	for(var j = 0; j < colCount; j++) {
        		//special handling.
        		if ((i ==0 && (j==0 || j == 3 || j == 4 || j == colCount -1))
        			|| (i == rowCount - 1 && j == colCount -1)){
        			//reserve space for prompt word(top center), game stats(top left), vocab info (top right) and bottom right button area
        			cellArray[i].push(false);
        			continue;
        		}
        		
        		var option = Math.floor(Math.random() * 5);//0, 1, 2, 3, 4
        		var plantSize = Math.random();
        		if (plantSize < 0.4) {
        			plantSize = 0.4;
        		}        		
        		
        		switch(option) {
        			case 0: //empty cell
        				if ((i > 1 && this.moles.length < 2) ||(i > 2 && this.moles.length < 5)) {//need catchup, give one more chance.
        					if ((i > 0 && j == 0) || i > 0 &&  j > 0 && !!!cellArray[i][j-1] && this.moles.length < maxMoleCount) {
	        					var mole = this.createMole(xOffset + j*unitSize+unitSize/2, yOffset+i*unitSize+unitSize/2);
	        					this.moles.push(mole);
	        					cellArray[i].push(true);   
        					} else {
        						cellArray[i].push(false);
        					}
        				} else {        			
        					if (Math.random() > 0.5) {
                				var plant2 = this.add.image(xOffset + j*unitSize+Math.random()*unitSize/2, yOffset+i*unitSize+Math.random()*unitSize/2, this.broadLeafPlantImgId);
                				plant2.scale = plantSize;
                				cellArray[i].push(false);
        					} else {
        						cellArray[i].push(false);
        					}
        				}
        				break;
        			case 1: //plant 1
        				if ((i > 1 && this.moles.length < 2) ||(i > 2 && this.moles.length < 5)) {//need catchup, give one more chance.
        					if ((i > 0 && j == 0) || i > 0 &&  j > 0 && !!!cellArray[i][j-1] && this.moles.length < maxMoleCount) {
	        					var mole = this.createMole(xOffset + j*unitSize+unitSize/2, yOffset+i*unitSize+unitSize/2);
	        					this.moles.push(mole);
	        					cellArray[i].push(true);   
        					} else {
    	        				cellArray[i].push(false);
    	        				var plant1 = this.add.image(xOffset + j*unitSize+Math.random()*unitSize/2, yOffset+i*unitSize+Math.random()*unitSize/2, this.plantImgId);
    	        				plant1.scale = plantSize;
        					}
        				}  else {
	        				cellArray[i].push(false);
	        				var plant1 = this.add.image(xOffset + j*unitSize+Math.random()*unitSize/2, yOffset+i*unitSize+Math.random()*unitSize/2, this.plantImgId);
	        				plant1.scale = plantSize;
        				}
        				break;
        			case 2:
        				if ((i > 1 && this.moles.length < 2) ||(i > 2 && this.moles.length < 5)) {//need catchup, give one more chance.
        					if ((i > 0 && j == 0) || i > 0 &&  j > 0 && !!!cellArray[i][j-1] && this.moles.length < maxMoleCount) {
	        					var mole = this.createMole(xOffset + j*unitSize+unitSize/2, yOffset+i*unitSize+unitSize/2);
	        					this.moles.push(mole);
	        					cellArray[i].push(true);   
        					} else {
    	        				cellArray[i].push(false);
    	        				var plant2 = this.add.image(xOffset + j*unitSize+Math.random()*unitSize/2, yOffset+i*unitSize+Math.random()*unitSize/2, this.broadLeafPlantImgId);
    	        				plant2.scale = plantSize;        						
        					}
        				} else {
	        				cellArray[i].push(false);
	        				var plant2 = this.add.image(xOffset + j*unitSize+Math.random()*unitSize/2, yOffset+i*unitSize+Math.random()*unitSize/2, this.broadLeafPlantImgId);
	        				plant2.scale = plantSize;
        				}
        				break;
        			case 3:        				
        				if ((i > 0 && j == 0) || i > 0 &&  j > 0 && !!!cellArray[i][j-1] && this.moles.length < maxMoleCount) {
        					var mole = this.createMole(xOffset + j*unitSize+unitSize/2, yOffset+i*unitSize+unitSize/2);
        					this.moles.push(mole);
        					cellArray[i].push(true);
        				} else {
            				var plant1 = this.add.image(xOffset + j*unitSize+Math.random()*unitSize/2, yOffset+i*unitSize+Math.random()*unitSize/2, this.plantImgId);
            				plant1.scale = plantSize;
            				cellArray[i].push(false);
        				}
        				break;        				
        			case 4: //empty cell         				
        				if ((i > 0 && j == 0) || i > 0 && j > 0 && !!!cellArray[i][j-1] && this.moles.length < maxMoleCount) {
        					var mole = this.createMole(xOffset + j*unitSize+unitSize/2, yOffset+i*unitSize+unitSize/2);
        					this.moles.push(mole);
        					cellArray[i].push(true);
        				} else {
            				var plant2 = this.add.image(xOffset + j*unitSize+Math.random()*unitSize/2, yOffset+i*unitSize+Math.random()*unitSize/2, this.broadLeafPlantImgId);
            				plant2.scale = plantSize;
            				cellArray[i].push(false);
        				} 
        				break;
        		}        		
        	}        	
        }                
	}	
	
	scene.setUpPromptTextLabel = function() {
		// next word label (prompt text)
		this.nextWord = this.add.text(0, 0, " ", {
			fontFamily : fn_getChineseFont(),
			fontWeight : 'bold',
			fontSize : 48 * 1.3,
			color : fn_getGameVisitedTextColor()
		});	
		this.nextWord.setInteractive({useHandCursor: true}).on('pointerup', function() {
			var chinese = this.liveWords[this.toMatchIndex].chinese;
			var pinyin = this.liveWords[this.toMatchIndex].pinyin;			
			fn_playWordSound(chinese,pinyin);//play mom's voice of this word			
		}, this).on('pointerover', function(){this.nextWord.setStyle({fill : fn_getGameTextColor()});this.nextWord.scale=1.2;}, this).on('pointerout', function(){this.nextWord.setStyle({fill : fn_getGameVisitedTextColor()});this.nextWord.scale=1;}, this);		
	}.bind(scene);
	
	
	scene.playMoleSound = function() {
		if (Math.random() > 0.5) {//50% chance of play the mole sound.
			fn_playSound(this.music, fn_getBackgroundMusicVolume()/2, false);		
		}
	}.bind(scene);
	
	scene.drawMoleHole = function(x, y,w,h,thickness) {
		var graphics = this.add.graphics();
	    graphics.lineStyle(thickness, 0xB97A57, 1.0);
	    graphics.fillStyle(0x000000, 0.8);

	    var ellipse = fn_createEllipse(x, y, w, h);
	   // graphics.clear();
        graphics.fillEllipseShape(ellipse);
        graphics.strokeEllipseShape(ellipse, 128);
        
	    return ellipse;
	}.bind(scene);
	
	scene.setUpGameStatusLabels = function() {
		// The score label
		this.scoreText = fn_createStatusLabel(this, 16,16, "Score: 0");
		
		//Accuracy label
		this.accuracyText = fn_createStatusLabel(this, 16,56, "Accuracy: 0%");

		//word matching progress bar, note that, a scene can have only one progress bar, otherwise we cannot use the following two functions we defined.
		fn_createProgressBar(this, 16, 96, 160, 30);
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
		scene.scene.pause(whackAMole.getGameSceneOneId());
		scene.music.pause();// stop background music
		scene.scene.wake(whackAMole.getGameGlassId());		
		scene.scene.moveAbove(whackAMole.getGameSceneOneId(), whackAMole.getGameGlassId());
		this.popMoleTimer.paused = true;	
	}.bind(scene);
	
	scene.enablePauseBtn = function() {
		scene.pauseBtn.setText("Pause");
		fn_nestedInCenter(scene.pauseBtn,scene.pauseBtnBg);
		this.popMoleTimer.paused = false;
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
		//word list name
		//update the list title text
		this.updateListName(displayName);
		
		//set only once  by this setGameVocabLists function. It used to calc progress pct only!!
		this.totalChineseCount = this.chineseArray.length;
		
		//update the word count text
		this.wordCountText.setText("Word Count: " + this.chineseArray.length);
		this.wordCountText.x = this.sys.canvas.width - this.wordCountText.getBounds().width - 20;	
		
		// refresh the words on the screen
		this.refreshWithNewWords();				
	}.bind(scene);

	scene.cleanUpMoles = function() {
		for(var mm = 0; mm < this.moles.length; mm++) {
			var mole = this.moles[mm];
			if (mole.container) {				
				// remove the word object in the container and set the destroy flag to true
				// to destroy the text.
				mole.container.removeAll(true);
				// remove the container game object from the scene
				mole.container.destroy();
				mole.container = null;
			}
		}		
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
				frontFontSize = userFontSize + 5;
				break;
			case 1://pinyin
			case 4://pinyin
				frontFontFamily  = pinyinFontFamily;
				var convertedFronWord = fn_processPinyin(frontWord);//convert Pinyin from tone numbers to tone marks.
				frontWord = convertedFronWord;							
				break;
			case 3://english
			case 5://english	
				frontFontFamily  = englishFontFamily;
				frontFontSize = userFontSize *0.75;
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
		var container = scene.add.container(10,100, [ frontText ]);//one word per container
		container.setSize(frontText.getBounds().width,
				frontText.getBounds().height);//container has the same size as the text
		container.setVisible(false);
		///end front handling
		
		//process the back side value. They are invisibile intially until this word is matched
		container.answer = backWord;//original value, used to do the match check.			
		var backFontFamily = chineseFontFamily;
		var backFontSize = userFontSize;
		//0: front chinese, back, pinyin
		//1: front pinyin, back, chinese		
		//2: front chinese, back, english
		//3: front english, back, chinese		
		//4: front pinyin, back, english
		//5: front english, back, pinyin										
		switch(this.currentMatchType) {
			case 0://pinyin
			case 5://pinyin	
				backFontFamily  = pinyinFontFamily;
				backWord = fn_processPinyin(backWord);//convert Pinyin from tone numbers to tone marks.						
				break;
			case 2://english
			case 4://english	
				backFontFamily  = englishFontFamily;
				backFontSize = userFontSize*0.75;
				break;
			case 1://chinese
			case 3://chinese
				backFontFamily  = chineseFontFamily;
				backFontSize = userFontSize + 5;
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
		//done creation of container
		return container;
	}.bind(scene);
	
	scene.shuffleChinesePinyinEnglishImgArrays = function() {		
		//randomize our word list
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
		//clean up all moles
		this.cleanUpMoles();
		
		//update ship flying base speed		
		this.frontList = [];// clear the existing list
		this.backList = [];
		this.helpList = [];//store chinese or pinyin, depending on the match type, used for playing audio.
		
		this.liveWords = [];
		
		//shuffle our raw data first.
		this.shuffleChinesePinyinEnglishImgArrays();
		//done randomizing
				
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
		var countPerBatch = this.moles.length;//this game is different, batch size is based on the mole count, not user-defined fn_getBatchSize()
		
		if (this.chineseArray.length < countPerBatch) {
			countPerBatch = this.chineseArray.length;
		}
		var chineseSubList = [];
		var pinyinSubList = [];
		var englishSubList = [];
		for(k = 0;  k < countPerBatch; k++) {
			this.lastDataIndex +=1;//increment the data pointe  of the cached lists
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
		
		////////////////////////////////Create ships based on the words////////////////////////		
		for ( var i = 0; i < this.frontList.length; i++) {
			//set the correct font family for the displayed word text(Chinese, Pinyin or English)
			//note that prompt text font needs to be match type sensitive as well
			var container = this.createWordContainer(this.frontList[i], this.backList[i], this.helpList[i]);			
			/////////////////////			
			this.moles[i].container = container;
			container.mole = this.moles[i]; 
			//done adding mole to the container												
			this.liveWords.push(container);			
		}
		
		this.batchIndex += 1;//increase batch index. It is used to incease the diffculty.
		//////////////////////////////////		
		this.showPromptText();				
	}.bind(scene);

	scene.shufflFrontBackHelpLists = function() {
		//shuffle front list, back list and help list first
		var randomIndexArray = fn_generateShuffledIndexes("" + this.frontList.length).split("~");
		
		var tempFrontArray = this.frontList;
		var tempBackArray = this.backList;
		var tempHelpArray = this.helpList;
		
		this.frontList = [];
		this.backList = [];
		this.helpList = [];	
		
		for(var j = 0; j < randomIndexArray.length; j++) {
			var index = parseInt(randomIndexArray[j]);
			
			this.frontList.push(tempFrontArray[index]);
			this.backList.push(tempBackArray[index]);
			this.helpList.push(tempHelpArray[index]);			
		}
		//console.log("after shuffle, first front: " + this.frontList[0]);
	}.bind(scene);
	
	//this is used by mole pop timer, it is called frequently to rebuild the containers for the
	//moles. No prompt text or match type will be changed.
	//note that this method is different from the RefreshWithNewWords method, which will cause match type changge,
	//prompt text change and new words will be pulled in!!!!!!
	scene.refreshWithSamePromptAndMatchType = function() {
		//synchonizingly randomize the entries in front, back and help list
		this.shufflFrontBackHelpLists();
		
		//clean up all moles
		this.cleanUpMoles();
		
		//reset live words, but front list and back list remain the same
		this.liveWords = [];
		
		////////////////////////////////Create ships based on the words////////////////////////		
		var randomIndexArray = fn_generateShuffledIndexes("" + this.frontList.length).split("~");
		
		for ( var i = 0; i < this.frontList.length; i++) {
			//set the correct font family for the displayed word text(Chinese, Pinyin or English)
			//note that prompt text font needs to be match type sensitive as well
			var container = this.createWordContainer(this.frontList[i], this.backList[i],this.helpList[i]);
						
			//done processing back side text
			if (container.backText.text == this.nextWord.text) {//current container is showing on the prompt label
				this.toMatchIndex = this.liveWords.length;
			}					
			/////////////////////
			var moleIndex = parseInt(randomIndexArray[i]);//randomly assign a container to a mole.						
			this.moles[moleIndex].container = container;
			container.mole = this.moles[moleIndex];

			//console.log("mole id: " + container.mole.uniqueId + " => "  + container.chinese);
			//done adding mole to the container												
			this.liveWords.push(container);			
		}
	}.bind(scene);
	
	
	scene.resetMoles = function() {
		for(var m = 0; m < this.moles.length; m++) {
			//shuffle the container
			var mole = this.moles[m];
			mole.disableInteractive();
			mole.clearTint();
			mole.scaleY = 1.0;
			if (mole.container) {//some moles may have not a word associated with it when the list is shorter than the mole count.
				mole.container.setVisible(false);
				mole.container.getAt(0).scale=0;
				if (mole.container.initY) {
					mole.y = mole.container.initY;//the initY was set when starting the tween.	
				}
			}
		}		
	}.bind(scene);
	
	scene.popAMole = function() {
		this.popMoleTimer.paused = true;

		//no words, nothing to pop
		if (this.liveWords.length == 0) {
			return;
		}
		//do not pop a mole when no prompt text
		if (this.nextWord.text.length == 0) {
			return;
		}
		
		//clean up resources of the last timeline.
		if (this.timeline) {
			this.timeline.destroy();
		}

		//reset all moles back to the original state first.
		this.resetMoles();

		//each mole use a different data
		this.rebuildMoleContainerBinding();
									
		//pick a mole to pop
		var moleIndex = this.pickAMole();
		
		//find the mole to pop
		var selectedMole = this.liveWords[moleIndex].mole;
		
		//pop the mole
		this.animateMole(selectedMole);		
	}.bind(scene);
	
	scene.animateMole = function(selectedMole) {
		this.timeline = this.tweens.timeline({
	        ease: 'Power2',
	        duration: this.getMolePopUpInterval()/2,
	        tweens: [{
	            targets: selectedMole,
	            y: selectedMole.y-200,
	            offset: 50,
	            yoyo:true,
	            onStart: scene.onMoleStartHandler,
	            onStartParams: [selectedMole],
	            onUpdate: function(tween, target){
	            	target.container.x = target.x;
	            	target.container.getAt(0).scale = 1.4*Math.abs(target.y - target.container.initY)/200;	            	
	            	target.container.y = target.y-target.getBounds().height/2-target.container.getAt(0).getBounds().height/2;
	            },
	            onComplete: scene.onMoleCompleteHandler,
	            onCompleteParams: [selectedMole]
	        }]
	    });				
	}.bind(scene);
	
	scene.pickAMole = function() {
		//find a mole to pop
		var moleCount = this.liveWords.length;
		var moleIndex = Math.floor(Math.random() * moleCount);		
		
		//find the matched mole index:
		var correctIndex = 0;
		for(var d = 0; d < this.liveWords.length; d++) {
			if (this.liveWords[d].backText.text == this.nextWord.text) {
				correctIndex = d;
				break;
			}
		}
		//increase the chance of correct match by:
		//1. assigning  33% chance
		var randomIndex = Math.floor(Math.random()*3);//0 to 2
		if (randomIndex == 1) {
			//use correct one
			moleIndex = correctIndex;
		} else {
			//randomly pick one
			moleIndex = Math.floor(Math.random() * moleCount);
		}
		
		//avoid popping a mole with same text (but different positions)
		if (this.recentMoleTextList.length > 0) {			
			attempt = 0;
			while (attempt < 10 && moleCount > 1 && this.recentMoleTextList.indexOf(this.liveWords[moleIndex].backText.text) >=0 ) {
				moleIndex = Math.floor(Math.random() * moleCount);
				attempt ++;
			}			
		}				
		
		//don't pick the one last time we used
		//we don't want the same mole pop twice in a row
		var attempt = 0;
		if (this.recentMoleIds.length > 0) {	
			while (attempt < 20 && moleCount > 1 && this.recentMoleIds.indexOf(this.liveWords[moleIndex].mole.uniqueId) >= 0) {
				moleIndex = Math.floor(Math.random() * moleCount);
				attempt ++;
			}			
		}
				
		//remember the display text of this pop.
		this.recentMoleIds.push(this.liveWords[moleIndex].mole.uniqueId);
		if (this.recentMoleIds.length > 3) {
			this.recentMoleIds.shift();
		}
		
		this.recentMoleTextList.push(this.liveWords[moleIndex].backText.text);
		if (this.recentMoleTextList.length > 3) {
			this.recentMoleTextList.shift();
		}
		
		return moleIndex;
	}
	
	scene.rebuildMoleContainerBinding = function() {
		/////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////
		//rebuild the mole data		
		//rebuid live words and the mole containers. Note that we won't update the front or back list.
		//shuffle the front list, back list and help list first
		var randomIndexArray = fn_generateShuffledIndexes("" + this.frontList.length).split("~");			
		var tempFrontArray = this.frontList;
		var tempBackArray = this.backList;
		var tempHelpArray = this.helpList;
		this.frontList = [];
		this.backList = [];
		this.helpList = [];		
		for(var j = 0; j < randomIndexArray.length; j++) {
			var index = parseInt(randomIndexArray[j]);
			this.frontList.push(tempFrontArray[index]);
			this.backList.push(tempBackArray[index]);
			this.helpList.push(tempHelpArray[index]);			
		}
		//done shuffle and we can rebuild the data for the moles now using the front, back and help list.
		//note that we are NOT change prompt text or match type. 
		this.refreshWithSamePromptAndMatchType();			
		
		//done rebuilding the mole data
		////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////
	}.bind(scene);
	
	scene.getMolePopUpInterval = function() {
		var difficultyLevel = parseInt(fn_getDifficultyLevel());
		var molePopDelay = 1000;
		var speedAdjustment = 0;
		switch(difficultyLevel) {
			case 0:
				molePopDelay = 2000;
				//batch index updated by refreshWithNewWords only, not by internal frequent refresh by refreshWithSamePromptAndMatchType
				speedAdjustment = this.batchIndex * 20;
				break;
			case 1:
				speedAdjustment = this.batchIndex * 30;
				molePopDelay = 1500;
				break;
			case 2:
				speedAdjustment = this.batchIndex * 40;
				molePopDelay = 1000;
				break;						
		}
						 
		molePopDelay -= speedAdjustment;		
		if (molePopDelay < 700) {//minium, very fast to cath.
			molePopDelay = 700;
		}

		return molePopDelay;
	}.bind(scene);
	
	//disableInteractive
	scene.onMoleStartHandler = function(tween, targets, mole) {
		mole.setInteractive({useHandCursor: true}).on('pointerup', function(){this.hitMole(mole);}, this);
		mole.container.setVisible(true);
		if (!!!mole.container.initY) {
			mole.container.initY = mole.y;
		}
		mole.container.getAt(0).scale=0;
	}.bind(scene);
	
	scene.onMoleCompleteHandler = function(tween, targets, mole) {
		mole.removeInteractive();
		mole.scaleY = 1.0;
		this.timeline.destroy();
		//done mole pop handling, ready for the next run
		this.popMoleTimer.paused = false;
	}.bind(scene);
	
	scene.showPromptText = function() {
		//if all words are matched, navigate to game over screen		
		if (this.matchedChineseList.length == this.totalChineseCount) {
			this.checkIfDone();//game over after delaying 1 second
			return;
		}
		//done if all words have been matched.
		
		if (this.liveWords.length > 0) {
			
			this.toMatchIndex = Math.floor(Math.random() * this.liveWords.length);
			
			//attempt to try the words that we have not practiced.
			var attempt = 0;
			while(attempt < 20 && this.matchedChineseList.indexOf(this.liveWords[this.toMatchIndex].chinese) >=0 ) {
				attempt ++;
				this.toMatchIndex = Math.floor(Math.random() * this.liveWords.length);
			}
			
			var backText = this.liveWords[this.toMatchIndex].backText
						
			//how often we pop our mole
			var molePopUpInterval = this.getMolePopUpInterval();
						
			this.nextWord.setText(backText.text);
			this.nextWord.setFontFamily(backText.style.fontFamily);
			
			// center align the prompt text.
			fn_centerText(this.nextWord);
			this.nextWord.y = this.nextWord.getBounds().height/2;

			
			if (this.popMoleTimer) {
				this.popMoleTimer.paused = false;	
			} else {			
				//start to pop up moles. only the following two cases can pause the timer (pause=true)
				//1. The user clicks the Pause button to pause the game
				//2. In the middle of processing of repeat event of "popAMole";
				//when to resume the timer?
				//1. new prompt text displayed
				//2. pop animation is done;
				
		        this.popMoleTimer = this.time.addEvent({
		            delay: molePopUpInterval,
		            callback: this.popAMole,
		            callbackScope: this,
		            loop: true
		        });
			}
		} else {// empty list, not thing to prompt.
			this.nextWord.setText("");
		}				
	}.bind(scene);
		
	scene.updateListName = function(displayName) {
		this.titleText.setText(displayName);
		this.titleText.x = this.sys.canvas.width - this.titleText.getBounds().width
		- 16;	
		
		this.creatorText.setText("Created By: " + fn_getCreator()); 
		this.creatorText.x = this.sys.canvas.width - this.creatorText.getBounds().width
		- 16;	
	}.bind(scene);
	
    scene.handleWordMatch = function (mole) {    	    	
    	var theContainer = mole.container;
    	// make the hidden back text visible
    	theContainer.backText.setVisible(true);
    	
		// and add it into the container.
		theContainer.add(theContainer.backText);
	
		// front
		this.nextWord.setText('');// clear the prompt text
		theContainer.getAt(0).setColor(fn_getGameMatchedTextColor());// matched words become white
		theContainer.getAt(0).setOrigin(0.5);
	
		if (fn_hasChineseText(theContainer.getAt(0).text)) {
			theContainer.getAt(0).setFontSize(48 * 2);// enlarge the matched words
		} else {
			theContainer.getAt(0).setFontSize(32 * 2);// english or Pinyin
		}
	
		// back
		theContainer.getAt(1).setOrigin(0.5);
		theContainer.getAt(1).setColor(fn_getGameMatchedTextColor());// back side
		if (fn_hasChineseText(theContainer.getAt(1).text)) {
			theContainer.getAt(1).setFontSize(48 * 2);// enlarge the matched words
		} else {
			theContainer.getAt(1).setFontSize(32 * 2);// english or Pinyin
		}
	
		//hide the front text. We are going to add a copy of front text as the 4 element in the container
		//0: front, 1. back, 2, green mark, 3: copy of front text to display along with back text 
		//the container and its content will be destroyed seconds later after tween effect is done.
		theContainer.getAt(0).alpha = 0;
		// use the width of the first text as the x offset for the second text.
		theContainer.getAt(1).y =  theContainer.getAt(1).getBounds().height/2; 
	
		//push in a green check mark
		var greenCheckMark = this.add.image(0, 0, this.checkMarkId);
		theContainer.add(greenCheckMark);
		theContainer.getAt(2).y =  theContainer.getAt(1).y - theContainer.getAt(1).getBounds().height/2 ;
		theContainer.getAt(2).x =  theContainer.getAt(1).x + theContainer.getAt(1).getBounds().width ;
		
		var frontTextCopy = scene.add.text(0, 0, theContainer.getAt(0).text, {
			fontFamily : theContainer.getAt(0).style.fontFamily,
			fontWeight : 'bold',
			fontSize : theContainer.getAt(0).style.fontSize,
			color :  theContainer.getAt(0).style.color
		}).setOrigin(0.5);
		theContainer.add(frontTextCopy);
		theContainer.getAt(3).y =  theContainer.getAt(0).y - theContainer.getAt(3).getBounds().height/2;
		theContainer.getAt(3).x =  theContainer.getAt(0).x 
		
		// use a yoyo animation for fun when the container is dropping to the
		// ground.
		this.tweens.add({
			targets : theContainer,
			alpha : 0,
			duration : 4000,
			yoyo : false,
			repeat : 0
		});
	
		// remove the word container element from the live word list
		var wordIndex = this.liveWords.indexOf(theContainer);
		if (wordIndex >= 0) {
			this.liveWords.splice(wordIndex, 1);
		}
		
		//remove the the pair from the front and back list
		 //indexOf, and then remove that index with splice, key on the chinese
		var chinese = theContainer.chinese;
		var pinyin = theContainer.pinyin;
		
		//remove the entries for front list and back list.
		//these two lists are used by refreshWithSamePromptAndMatchType to 
		//rebuild the mole containers frequently so that 
		//mole containers are different for each pop.
		var toRemoveIndex = -1;		
		switch (this.currentMatchType) {
		case 0://front chinese, back, pinyin			
			toRemoveIndex = this.frontList.indexOf(chinese); 
			break;
		case 1://front pinyin, back, chinese
			toRemoveIndex = this.backList.indexOf(chinese);
			break;
		case 2:// front chinese, back, english
			toRemoveIndex = this.frontList.indexOf(chinese);
			break;
		case 3:// front english, back, chinese
			toRemoveIndex = this.backList.indexOf(chinese);
			break;
		case 4:// front pinyin, back, english
			toRemoveIndex = this.frontList.indexOf(pinyin);
			break;
		case 5:// front english, back, pinyin
			toRemoveIndex = this.backList.indexOf(pinyin);
			break;			
		}
		if (toRemoveIndex >= 0) {
			this.frontList.splice(toRemoveIndex, 1);
			this.backList.splice(toRemoveIndex, 1);
			this.helpList.splice(toRemoveIndex, 1);
		}
		
		// remove the word object in the container and set the destroy flag to true
		// to destroy the text.
		this.time.delayedCall(2000, this.removeMatchedWord, [ theContainer ], this);
	
		var wordColor = fn_getGameTextColor();
		for (j = 0; j < this.liveWords.length; j++) {
			this.liveWords[j].first.setColor(wordColor);// reset the remaining words
			// color to green.
		}	
    }.bind(scene);
    
	scene.removeMatchedWord = function(theMatchWord) {
		if (this.liveWords.length < this.moles.length) {//rebuild the whole working list once we have empty hole/mole available for new words.		
			this.lastDataIndex = -1;
			// reload the word list and play the next around
			this.refreshWithNewWords();			
		} else {		
			if (this.totalChineseCount <= this.moles.length) {
				//increase the mole pop speed quickly if we have only a few words. 
				this.batchIndex += 1;				
			}
			// if we have more words, prompt the next word
			this.showPromptText();
		}
	}.bind(scene);
	
	scene.showScore = function() {
		if (this.totalHits == 0) {
			this.accuracyText.setText('Accuracy: 0%');
			this.accuracy = 0;
		} else {
			this.accuracy = Math.floor(100.0*this.matchedCount/this.totalHits);
		}   
		if (this.score < 0) {
			this.score = 0;
		}
		this.scoreText.setText('Score: ' + this.score);
		this.accuracyText.setText('Accuracy: ' + this.accuracy + "%");
		
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
			this.time.delayedCall(1000, this.navigateToGameOverScene,
					[], this);
		}
	}.bind(scene);
	
    scene.hitMole = function(mole) {    	
		if (mole.container && mole.container.getAt(0).scale < 0.5){
			//hit too early.
			return;
		} 
		mole.removeInteractive();//mole hit only once!
		//already paused by pick a mole
    	//this.popMoleTimer.paused = true; //pause mole pop timer. waiter until the hit mole is done!
    	
    	this.totalHits +=1;
    	
        if (this.nextWord.text.length > 0) {
        	
            if (this.nextWord.text != mole.container.backText.text) {//wrong answer
            	fn_playSound(this.punchSound, fn_getBackgroundMusicVolume(), false);
            	//mark visited
            	this.score -= 1
            	mole.setTint("0xFF0000");
            	mole.scaleY = 0.9
            	mole.container.first.setColor(fn_getGameVisitedTextColor());      
            	this.showScore();
    		} else {
    			mole.setTint("0x00FF00");
    			//correct answer
    			fn_playSound(this.pickupSound, fn_getBackgroundMusicVolume(), false);
    			this.matchedCount +=1;
    			this.score += 15;
                this.handleWordMatch(mole);
                
                //if this word has not been added to the this.matchedChineseList, add it
                if (this.matchedChineseList.indexOf(mole.container.chinese) < 0) {
                	this.matchedChineseList.push(mole.container.chinese);
                }
                
        		var wordColor = fn_getGameTextColor();
        		for (j = 0; j < this.liveWords.length; j++) {
        			this.liveWords[j].first.setColor(wordColor);// reset the remaining words
        		}
        		this.showScore();
    		}        	
		}
    }.bind(scene);
    
	scene.navigateToGameOverScene = function() {
		//remove mole pop timer, no more mole pops
		this.popMoleTimer.remove();//game over

		//calc score for display
		this.finalScore = Math.ceil(this.score*0.8 + this.score*0.2 * this.accuracy/100);
				
		scene.scene.stop(whackAMole.getGameSceneOneId());
		scene.scene.stop(whackAMole.getGameGlassId());
		scene.scene.start(whackAMole.getGameOverId());
		scene.scene.get(whackAMole.getGameSceneOneId()).music.stop();//resume music		
		
    }.bind(scene);
        
	return scene;
})();
