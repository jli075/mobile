//the first play scene of this game. This scene runs after the title scene.
 wordStrike.gameScene1 = (function() {		
	var scene = fn_createScene(wordStrike.getGameSceneOneId());
	// NOTE, this init method will be called by the framework first.It is called
	// before preload, create and update.
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		
		this.matchedCount = 0;
		//list of the word containers. it is empty initially.
		this.liveWords = [];
		this.life = [];//hearts
		this.baseSpeed = 10;
		this.finalScore = 0;
		this.score = 0;
		this.totalShots = 0;
		this.accuracy = 0;
		
		this.heartId = fn_createId();
		this.shipId = fn_createId();
		this.ship2Id = fn_createId();
		this.ship3Id = fn_createId();
		this.explosionId = fn_createId();
		this.powerUpId = fn_createId();
		this.playerId = fn_createId();
		this.beamId = fn_createId();
		
		this.beamAudioId = fn_createId();
		this.explosionAudioId = fn_createId();
		this.pickupAudioId = fn_createId();
		this.musicId = fn_createId();
		
		//animations
		this.aniShipId= fn_createId();
		this.aniShip2Id= fn_createId();
		this.aniShip3Id= fn_createId();
		this.aniExplosionId= fn_createId();
		this.anipowerUpRedId = fn_createId();
		this.anipowerUpGrayId = fn_createId();
		this.aniPlayerId = fn_createId();
		this.aniBeamId = fn_createId();
		
		//is mobile or use explicitly enabled joystick
		this.isMobile = fn_isMobile() || wordStrike.isMobileControlOn();
		this.isMusicOn = wordStrike.isMusicOn();
		
		if (this.isMobile) {
			this.mobileShootImgId = fn_createId();
			this.joyStickBaseImgId = fn_createId();
			this.joyStickThumbImgId = fn_createId();
		}
		
		//particles
		this.sparkGId = fn_createId();
		
		this.currentMatchType = -1;// value should be from 0 to 5.
		//0: front chinese, back, pinyin
		//1: front pinyin, back, chinese		
		//2: front chinese, back, english
		//3: front english, back, chinese		
		//4: front pinyin, back, english
		//5: front english, back, pinyin							
	}
	
	scene.getAsset = function(name) {
		return wordStrike.getAsset(name);
	}

	scene.loadSprite = function(id, img, w, h) {
        this.load.spritesheet(id, this.getAsset(img), {
            frameWidth: w,
            frameHeight: h
        });		
	}.bind(scene)
	
	scene.loadMusic = function(id, mp3) {
		if (this.isMusicOn) {
			this.load.audio(id, [this.getAsset(mp3)]);
		}
	}.bind(scene)

	scene.preload = function() {
		if (this.isMobile) {
			//load virtual joystick
			fn_loadJoyStick(this);
		}
		
		//load images		
		var backgroundImageURL = this.getAsset("background.jpg");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();		
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);	
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}
		
		this.load.image(this.btnBackgroundImgId, wordStrike.getAsset("button-bg.png"));
		
		if (this.isMobile) {//mobile only
			this.load.image(this.mobileShootImgId, wordStrike.getAsset("fire.png"));
			this.load.image(this.joyStickBaseImgId, wordStrike.getAsset("joystick.png"));
			this.load.image(this.joyStickThumbImgId, wordStrike.getAsset("joystickthumb.png"));
		}
		
		var imgIds = [this.heartId, this.sparkGId];
		var imgs = ["heart.png", "green.png"];
		for(var i = 0; i < imgs.length; i++) {
			this.load.image(imgIds[i], this.getAsset(imgs[i]));	
		}
		
        //load sprites        
		this.loadSprite(this.shipId, "ship.png", 16, 16);
		this.loadSprite(this.ship2Id, "ship2.png", 32, 16);
		this.loadSprite(this.ship3Id, "ship3.png", 32, 32);
		this.loadSprite(this.explosionId, "explosion.png", 16, 16);
		this.loadSprite(this.powerUpId, "power-up.png", 16, 16);
		this.loadSprite(this.playerId, "player.png", 16, 24);
		this.loadSprite(this.beamId, "beam.png", 16, 16);
		
		//load music
		if (this.isMusicOn) {
			this.loadMusic(this.beamAudioId, "beam.mp3");
			this.loadMusic(this.explosionAudioId,"explosion.mp3");
			this.loadMusic(this.pickupAudioId, "pickup.mp3");
			this.loadMusic(this.musicId, "sci-fi_platformer12.mp3");
		}
	}
	
	scene.create = function() {
		if (this.isMobile) {
			//create virtual joystick instance
			fn_createJoyStick(this, this.joyStickBaseImgId, this.joyStickThumbImgId);//this.joystick can be referenced later.
		}
					    
		//set to full screen. Only works on FireFox and Chrome.
		fn_setToFullScreen(this);		
		//set background
		//fn_setBackground(this, this.backgroundImgId);
        this.background = fn_createTileSprite(this, this.backgroundImgId);  
        this.background.scale = 2;
        this.background.alpha = 0.1;
                
        //create animations
        var aniKeys  = [this.aniShipId, this.aniShip2Id, this.aniShip3Id, this.aniPlayerId, this.aniBeamId, this.anipowerUpRedId, this.anipowerUpGrayId];
        var aniFrmIds = [this.shipId, this.ship2Id, this.ship3Id, this.playerId, this.beamId, this.powerUpId,this.powerUpId]
        for(var i = 0; i < aniKeys.length; i++) {
        	if (aniKeys[i] === this.anipowerUpGrayId) {
        		fn_createRepeatAni(this, aniKeys[i], aniFrmIds[i], 2, 3);
        	} else {
        		fn_createRepeatAni(this, aniKeys[i], aniFrmIds[i], 0, 1);
        	}
        }
        
        //explosion animation is different. it needs to hide after complete and it will not repeat.
        fn_createNonRepeatAni(this, this.aniExplosionId, this.explosionId);
       
        //start and play background music
        if (this.isMusicOn) {
        	this.music = fn_setUpAndPlayMusic(this, this.musicId);
		}
        
    	//set up game name, word count, created by
        //and score, accuracy and life(heart count)
        this.setUpGameStatusLabels();
		
		// next word label (prompt text)
		this.nextWord = this.add.text(0, 0, " ", {
			fontFamily : fn_getChineseFont(),
			fontWeight : 'bold',
			fontSize : 48 * 1.2,
			color : fn_getGameVisitedTextColor()
		});	
		this.nextWord.setInteractive({useHandCursor: true}).on('pointerup', function() {
			var chinese = this.liveWords[this.toMatchIndex].chinese;
			var pinyin = this.liveWords[this.toMatchIndex].pinyin;			
			fn_playWordSound(chinese,pinyin);//play mom's voice of this word
		}, this).on('pointerover', function(){this.nextWord.setStyle({fill : fn_getGameTextColor()});}, this).on('pointerout', function(){this.nextWord.setStyle({fill : fn_getGameVisitedTextColor()});}, this);
		
		//prompt text effect done.

		// /////////////////////////////
        //spawn powers up every 15 seconds. max 3 ready to pick up.
		this.setUpPowerUps();

        //set up player
		this.setUpPlayer();
        //done player set up

        //spacebar for shooting beams
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //bullets
        this.projectiles = this.add.group();
        this.physics.add.collider(this.projectiles, this.powerUps, function (projectile, powerUp) {
            projectile.destroy();
            scene.showScore();
        });
        
        //pick up the powerup when player hits the a powerup.
        this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);

        if (this.isMusicOn) {
	        this.beamSound = this.sound.add(this.beamAudioId);
	        this.explosionSound = this.sound.add(this.explosionAudioId);
	        this.pickupSound = this.sound.add(this.pickupAudioId);
        }
        if (this.isMobile) {
	        //set up the mobile fire button. for mobile only
	        var fireBtn = this.add.image(fn_getCanvasWidth()-180, fn_getCanvasHeight()-200, this.mobileShootImgId);
	        fireBtn.setInteractive({useHandCursor: true}).on('pointerdown', function(){
	            if (this.player.active) {
	                this.shootBeam();
	                this.totalShots += 1;
	            }
	        }, this);
	        fireBtn.scaleX = 0.8;
	        fireBtn.scaleY = 0.8;
        }
		// load game data from server for this scene
		// make sure data is loaded after everything has been set.
		fn_loadGameVocabListsByUUID();
	}
	
	//create and set up the player (shooter)
	scene.setUpPlayer = function() {
		this.player = this.physics.add.sprite(fn_getCanvasWidth()/ 2, fn_getCanvasHeight()- 64, this.playerId);
        this.player.scale = 2;
        this.player.play(this.aniPlayerId);
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);
        this.player.alpha = 0.5;
        this.tweens.add({
            targets: this.player,
            y: fn_getCanvasHeight() - 50,
            ease: 'Power1',
            duration: 2000,
            repeat: 0,
            onComplete: function () {
                this.player.alpha = 1;
            },
            callbackScope: this
        });
	}.bind(scene);
	
	//set up powerups
	scene.setUpPowerUps = function() {
	    this.powerUps = this.physics.add.group();
        this.time.addEvent({
            delay: 5000,
            callback: function () {
            	if (this.powerUps.getLength() + this.life.length < 5) {//create power ups only when needed 
            		//max 3 power ups
                    var powerUp = this.physics.add.sprite(16, 16, this.powerUpId);
                    powerUp.scale=2;
                    this.powerUps.add(powerUp);
                    powerUp.setRandomPosition(0, 0, fn_getCanvasWidth(), fn_getCanvasHeight());
                    if (Math.random() > 0.5) {//random red or gray power ups.
                        powerUp.play(this.anipowerUpRedId);
                    } else {
                        powerUp.play(this.anipowerUpGrayId);
                    }
                    powerUp.setVelocity(wordStrike.gameSettings.powerUpVel, wordStrike.gameSettings.powerUpVel);
                    powerUp.setCollideWorldBounds(true);
                    powerUp.setBounce(1);            		
            	}
            },
            callbackScope: this,
            loop: true
        });
	}.bind(scene);
	
	scene.setUpGameStatusLabels = function() {
		//5 hearts
		for(var i = 0; i < 5; i++) {
			var heart = this.add.image(16 + 32*i, 16, this.heartId);
			heart.scale = 2;
			heart.setOrigin(0,0);
			this.life.push(heart);
		}
		
		// The score label
		this.scoreText = fn_createStatusLabel(this, 16,56, "Score: 0");
		
		//Accuracy label
		this.accuracyText = fn_createStatusLabel(this, 16,96, "Accuracy: 0%");
		
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
		scene.scene.pause(wordStrike.getGameSceneOneId());
		if (this.isMusicOn) {
			scene.music.pause();// stop background music
		}
		scene.scene.wake(wordStrike.getGameGlassId());

		scene.scene.moveAbove(wordStrike.getGameSceneOneId(), wordStrike.getGameGlassId());
	}.bind(scene);
	
	scene.enablePauseBtn = function() {
		scene.pauseBtn.setText("Pause");
		fn_nestedInCenter(scene.pauseBtn,scene.pauseBtnBg);
		if (this.isMusicOn) {
			scene.music.resume();//resume music
		}
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
	
		//update the word count text
		this.wordCountText.setText("Word Count: " + this.chineseArray.length);
		this.wordCountText.x = this.sys.canvas.width - this.wordCountText.getBounds().width - 20;	
		
		// refresh the words on the screen
		this.refreshWordPairs();				
	}.bind(scene);

	scene.refreshWordPairs = function() {
		//update ship flying base speed
		if (this.lastDataIndex  < 0 ) {//a new batch
			var difficultyLevel = parseInt(fn_getDifficultyLevel());
			switch(difficultyLevel) {
				case 0:
					this.baseSpeed += 5; 
					break;
				case 1:
					this.baseSpeed += 10;
					break;
				case 2:
					this.baseSpeed += 20;
					break;						
			}
		}
		
		this.frontList = [];// clear the existing list
		this.backList = [];
		this.liveWords = [];
		
		//randomize our word list
		var randomIndexArray = fn_generateShuffledIndexes("" + this.chineseArray.length).split("~");
		var tempChineseArray = this.chineseArray;
		var tempPinyinArray = this.pinyinArray;
		var tempEnglishArray = this.englishArray;
		var tempImgURLArray = this.imgURLArray;
		this.chineseArray = [];
		this.pinyinArray = [];
		this.englishArray = [];		
		this.imgURLArray = [];
		for(var j = 0; j < randomIndexArray.length; j++) {
			var index = parseInt(randomIndexArray[j]);
			this.chineseArray.push(tempChineseArray[index]);
			this.pinyinArray.push(tempPinyinArray[index]);
			this.englishArray.push(tempEnglishArray[index]);	
			this.imgURLArray.push(tempImgURLArray[index]);		
		}
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
		var countPerBatch = fn_getBatchSize();
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
			break;
		case 1://front pinyin, back, chinese
			fn_copyList(this.frontList, pinyinSubList);
			fn_copyList(this.backList, chineseSubList);
			break;
		case 2:// front chinese, back, english
			fn_copyList(this.frontList, chineseSubList);
			fn_copyList(this.backList, englishSubList);
			break;
		case 3:// front english, back, chinese
			fn_copyList(this.frontList, englishSubList);
			fn_copyList(this.backList, chineseSubList);
			break;
		case 4:// front pinyin, back, english
			fn_copyList(this.frontList, pinyinSubList);
			fn_copyList(this.backList, englishSubList);
			break;
		case 5:// front english, back, pinyin
			fn_copyList(this.frontList, englishSubList);
			fn_copyList(this.backList, pinyinSubList);
			break;			
		}
		
		////////////////////////////////Create ships based on the words////////////////////////
		var canvasWidth = fn_getCanvasWidth();
		var canvasHeight = fn_getCanvasHeight();
		var pinyinFontFamily = fn_getPinyinFont();
		var chineseFontFamily = fn_getChineseFont(); 
		var englishFontFamily = fn_getEnglishFont();
		
		var count = this.frontList.length;
		var userFontSize = parseInt(fn_getGameTextSize());
		if (userFontSize < 38) {
			userFontSize = 38;
		}
		
		for ( var i = 0; i < this.frontList.length; i++) {
			//set the correct font family for the displayed word text(Chinese, Pinyin or English)
			//note that prompt text font needs to be match type sensitive as well
			var frontWord = this.frontList[i];
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
			
			
			var container = scene.add.container(10,100, [ frontText ]);//one word per container
			container.setSize(frontText.getBounds().width,
					frontText.getBounds().height);//container has the same size as the text
			scene.physics.world.enableBody(container);
			
			var randomShipType = Math.floor(Math.random() * 3);//0, 1, 2
			var shipId = this.ship3Id;
			var shipAniId = this.aniShip3Id;
			var gap = 0;
			switch (randomShipType) {
				case 0:
					shipId = this.shipId;
					shipAniId = this.aniShipId;
					gap = 10;
					break;
				case 1:
					shipId = this.ship2Id;
					shipAniId = this.aniShip2Id;
					gap = 8;
					break;
				case 2:
					shipId = this.ship3Id;
					shipAniId = this.aniShip3Id;
					gap = -2;
					break;					
			}
			var ship = this.add.sprite(0, fn_getCanvasHeight(), shipId);
			ship.scale=2;
			ship.play(shipAniId);
			
			container.add(ship);//index 1 in the container
			container.getAt(1).y =  -container.getAt(0).getBounds().height + gap;//reduce the gap between the word and ship a little bit.
			
			var startX = container.getAt(0).getBounds().width;
			var endX = canvasWidth-startX <= 0? startX : canvasWidth-50;
			container.x = Phaser.Math.Between(startX,endX);
			container.y = Phaser.Math.Between(10,20);	
			
			//flying velocity is based on the ship type, from fastest to slowest, ship3 > ship2 > ship
			
			container.speed = this.baseSpeed + (1+randomShipType)*25; //normal flying speed.
			//initially it is bouncing and has X speed. later will be set to have Y speed only using the value of container.speed.
			container.body.setVelocity(Phaser.Math.Between(-200,200), Phaser.Math.Between(10,50));			
			container.body.allowGravity = false;
			container.body.setBounce(1);
			container.body.setCollideWorldBounds(true);
			//done setting up the front text container.
			
			//process the back side value. They are invisibile intially until this word is matched
			var backWord = this.backList[i];
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
			//done processing back side text
			
			//now attach the Chinese word and raw Pinyin to the container as well so that
			//we can load and play the audio of this word.
			container.chinese =  chineseSubList[i];
			container.pinyin = pinyinSubList[i];
			/////////////////////
												
			this.liveWords.push(container);
		}
		
		//////////////////////////////////		
		this.physics.add.collider(this.liveWords, this.liveWords);// collide with each other to avoid overlapping
        this.physics.add.overlap(this.player, this.liveWords, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.projectiles, this.liveWords, this.hitEnemy, null, this);
	
		this.showPromptText();
	}.bind(scene);
	
	scene.showPromptText = function() {
		if (this.liveWords.length > 0) {
			this.toMatchIndex = Math.floor(Math.random() * this.liveWords.length);
			var backText = this.liveWords[this.toMatchIndex].backText
			
			//play the native speaker recorcding of this word.
			var chinese = this.liveWords[this.toMatchIndex].chinese;
			var pinyin = this.liveWords[this.toMatchIndex].pinyin;
			
			if (chinese.length < 5) {
				if (this.isMusicOn) {
					if (fn_getGameWordAudio()) {
						this.music.pause();//pause background music		
						fn_playWordSound(chinese,pinyin);//play mom's voice of this word
						//wait for 1 per character before resuming the background music
						this.time.delayedCall(chinese.length * 1000, function(){this.music.resume();}, [], this);
					}
				}
			}
			////
			
			this.nextWord.setText(backText.text);
			this.nextWord.setFontFamily(backText.style.fontFamily);				
		} else {// empty list, not thing to prompt.
			this.nextWord.setText("");
		}
		// center align the prompt text.
		fn_centerText(this.nextWord);
		this.nextWord.y = this.nextWord.getBounds().height/2;	
	}.bind(scene);
		
	scene.updateListName = function(displayName) {
		this.titleText.setText(displayName);
		this.titleText.x = this.sys.canvas.width - this.titleText.getBounds().width
		- 16;	
		
		this.creatorText.setText("Created By: " + fn_getCreator()); 
		this.creatorText.x = this.sys.canvas.width - this.creatorText.getBounds().width
		- 16;	
	}.bind(scene);
	
	scene.emitSparkles = function(sparkleId, x, y) {
		  var emitterr = this.add.particles(sparkleId).createEmitter({
              speed: { min: -800, max: 800 },
              angle: { min: 0, max: 360 },
              scale: { start: 0.5, end: 0 },
              blendMode: 'SCREEN',
              //active: false,
              lifespan: 600,
              gravityY: 800
          });
          emitterr.setPosition(x, y);
          for (var i = 0; i < 25; i++) {
              emitterr.explode();
          }
	}
	
	scene.pickPowerUp = function(player, powerUp) {
		var heartCount = this.life.length;
		if (heartCount < 5) {
			//add a heart.
			var heart = this.add.image(16 + 32*heartCount, 16, this.heartId);
			heart.scale = 2;
			heart.setOrigin(0,0);
			this.life.push(heart);
		}
		
        this.emitSparkles(this.sparkGId, powerUp.x, powerUp.y);
        
        //housekeeping
        this.powerUps.remove(powerUp);
        powerUp.destroy();
        
        if (this.isMusicOn) {
        	this.pickupSound.play();
        }
    }.bind(scene);
	    
    scene.handleWordMatch = function (theContainer) {
    	//remove the ship object from the container and destroy it. the index of the ship is 1.    	
    	theContainer.removeAt(1, true);
    	
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
	
		// use the width of the first text as the x offset for the second text.
		theContainer.getAt(1).y = theContainer.getAt(0).getBounds().height + 10; 
		
		theContainer.body.setGravityY(10);// drop the matched word		
		theContainer.body.allowGravity = true;
	
		// use a yoyo animation for fun when the container is dropping to the
		// ground.
		this.tweens.add({
			targets : theContainer,
			angle : Phaser.Math.Between(-120, 120),
			duration : 3000,
			yoyo : true,
			repeat : -1
		});
	
		// remove the word container element from the live word list
		var wordIndex = this.liveWords.indexOf(theContainer);
		if (wordIndex >= 0) {
			this.liveWords.splice(wordIndex, 1);
		}
		// remove the word object in the container and set the destroy flag to true
		// to destroy the text.
		this.time.delayedCall(2000, this.removeMatchedWord, [ theContainer ], this);
	
		var wordColor = fn_getGameTextColor();
		for (j = 0; j < this.liveWords.length; j++) {
			this.liveWords[j].first.setColor(wordColor);// reset the remaining words
			// color to green.
		}
	
		if (this.isMusicOn) {
			this.pickupSound.play();
		}
    }.bind(scene);
    
	scene.removeMatchedWord = function(theMatchWord) {
		// remove the word object in the container and set the destroy flag to true
		// to destroy the text.
		theMatchWord.removeAll(true);
		// remove the container game object from the scene
		theMatchWord.destroy();
	
		// if no more words to play, convert the remainining seconds to the total
		// score
		if (this.liveWords.length === 0) {		
			if (this.lastDataIndex < this.chineseArray.length - 1) {
				//we have more data to play for this level. Level should not be updated.
			} else {
				//data pointer reset to -1 position
				this.lastDataIndex = -1;
			}
			// reload the word list and play the next around
			this.refreshWordPairs();			
		} else {		
			// if we have more words, prompt the next word
			this.showPromptText();
		}
	}.bind(scene);
	
	scene.showScore = function() {
		if (this.totalShots == 0) {
			this.accuracyText.setText('Accuracy: 0%');
			this.accuracy = 0;
		} else {
			this.accuracy = Math.floor(100.0*this.matchedCount/this.totalShots);
		}   
		if (this.score < 0) {
			this.score = 0;
		}
		this.scoreText.setText('Score: ' + this.score);
		this.accuracyText.setText('Accuracy: ' + this.accuracy + "%");
	}.bind(scene);
	
    scene.hurtPlayer = function(player, container) {
        // don't hurt the player if it is invincible
        if (this.player.alpha < 1) {
            return;
        }
    	
        if (this.isMusicOn) {
	        var explosionSoundConfig = {
					mute : false,
					volume : 0.5,
					rate : 1,
					detune : 0,
					seek : 0,
					loop : false,
					delay : 0
			};
	        this.explosionSound.play(explosionSoundConfig);
        }
        //reduce 5 points if the player wrecks a ship that does not have the correct match.
        if (this.nextWord.text != container.backText.text) {
        	this.score -=1;
        } else {
        	//matched
	        this.score += 15;
	        this.handleWordMatch(container);
        }
        this.showScore();
                
        if (this.life.length > 0) {
        	var lastHeart = this.life.pop(); //remove the last heart
            lastHeart.destroy();  
            if (this.life.length == 0) {//no more life
        		// navigate to the game over screen after 1000 milliseconds delay
        		this.time.delayedCall(1000, this.navigateToGameOverScene,
        				[], this);
            }
        }

        // 2.2 spawn a explosion animation
        var explosion = this.physics.add.sprite(player.x, player.y, this.explosionId);
        explosion.scale = 4;
        explosion.play(this.aniExplosionId);            

        // 2.3 disable the player and hide it
        player.disableBody(true, true);

        // 3.1 after a time enable the player again
        this.time.addEvent({
            delay: 1000,
            callback: this.resetPlayer,
            callbackScope: this,
            loop: false
        });

    }.bind(scene);

    scene.resetPlayer = function() {
        // 3.2 enable the player again
        var x = fn_getCanvasWidth() / 2;
        var y = fn_getCanvasHeight() + 64;
        this.player.enableBody(true, x, y, true, true);

        // 4.1 make the player transparent to indicate invulnerability
        this.player.alpha = 0.5;
        
        // 4.2 move the ship from outside the screen to its original position
        this.tweens.add({
            targets: this.player,
            y: fn_getCanvasHeight() - 50,
            ease: 'Power1',
            duration: 1000,
            repeat: 0,
            onComplete: function () {
                this.player.alpha = 1;
            },
            callbackScope: this
        });
    }.bind(scene);

    scene.hitEnemy = function(projectile, theContainer) {
        var explosion = this.physics.add.sprite(theContainer.x, theContainer.y - theContainer.displayHeight/4, this.explosionId);
        explosion.scale=4;
        explosion.play(this.aniExplosionId);            

        if (this.isMusicOn) {
	        var explosionSoundConfig = {
					mute : false,
					volume : 0.5,
					rate : 1,
					detune : 0,
					seek : 0,
					loop : false,
					delay : 0
			};
	        this.explosionSound.play(explosionSoundConfig);
        }
        
        this.projectiles.remove(projectile);
        projectile.destroy();
       
        if (this.nextWord.text.length > 0) {
            if (this.nextWord.text != theContainer.backText.text) {// overlap with a unmatched
            	//mark visited
            	this.score -= 1;
            	theContainer.first.setColor(fn_getGameVisitedTextColor());      
            	//after 3 seconds, change it back to the original color
            	this.time.delayedCall(1000, function() {theContainer.first.setColor(fn_getGameTextColor());}, [], this);
            	this.showScore();
    		} else {
    			this.matchedCount +=1;
    			this.score += 15;
                this.handleWordMatch(theContainer);
                
        		var wordColor = fn_getGameTextColor();
        		for (j = 0; j < this.liveWords.length; j++) {
        			this.liveWords[j].first.setColor(wordColor);// reset the remaining words
        		}
        		this.showScore();
    		}        	
		}
        
        
    }.bind(scene);
    
	scene.navigateToGameOverScene = function() {		
		this.finalScore = Math.ceil(this.score*0.8 + this.score*0.2 * this.accuracy/100);
		
		scene.scene.stop(wordStrike.getGameSceneOneId());
		scene.scene.stop(wordStrike.getGameGlassId());
		scene.scene.start(wordStrike.getGameOverId());
		
    }.bind(scene);

    
    scene.createBeam = function(velocityX, velocityY) {
        var beam = this.physics.add.sprite(this.player.x, this.player.y-16, this.beamId);
        beam.scale = 2;
        beam.play(this.aniBeamId);  
        this.physics.world.enableBody(beam);
        beam.body.velocity.x = velocityX;
        beam.body.velocity.y = velocityY;
        this.projectiles.add(beam);    	
    }.bind(scene);
    
	scene.shootBeam = function() {
		this.createBeam(0, -450);
		if (this.isMusicOn) {
			this.beamSound.play();
		}
    }.bind(scene);


    scene.resetCursors = function() {
		this.cursorKeys.left.isDown =  false;
		this.cursorKeys.right.isDown =  false;
		this.cursorKeys.up.isDown =  false;
		this.cursorKeys.down.isDown =  false;
		if (this.isMobile) {
			this.joystick.left = false;
			this.joystick.right = false;
			this.joystick.up = false;
			this.joystick.down = false;
		}
	}.bind(scene);
    
	scene.movePlayerManager = function() {
        this.player.setVelocity(0);
        var leftKey = this.cursorKeys.left.isDown;
        var rightKey = this.cursorKeys.right.isDown;
        var upKey = this.cursorKeys.up.isDown;
        var downKey = this.cursorKeys.down.isDown;
        
        if (this.isMobile) {//touch devices, virtual joystick is used
        	leftKey = leftKey || this.joystick.left;
        	rightKey = rightKey || this.joystick.right;
        	upKey = upKey || this.joystick.up;
        	downKey = downKey || this.joystick.down;        	
        }
        
        if (leftKey) {
            this.player.setVelocityX(-wordStrike.gameSettings.playerSpeed);
        } else if (rightKey) {
            this.player.setVelocityX(wordStrike.gameSettings.playerSpeed);
        }

        if (upKey) {
            this.player.setVelocityY(-wordStrike.gameSettings.playerSpeed);
        } else if (downKey) {
            this.player.setVelocityY(wordStrike.gameSettings.playerSpeed);
        } 
    }.bind(scene);


	scene.resetShipPos = function(container) {
		container.y = 0;//move the ship to the top
        container.x = Phaser.Math.Between(0 + container.getBounds().width, fn_getCanvasWidth()-container.getBounds().width);
    }.bind(scene);
    
	scene.update = function() {
		var totalHeight = fn_getCanvasHeight();
		var totalWidth =  fn_getCanvasWidth();
		var launchAreaHeight = totalHeight*0.2;
		for(var i = 0; i < this.liveWords.length; i++) {
			//bouncing initially to separate each other and fly straight downward after 20% distance from the top.
			var container = this.liveWords[i];
			if (container.y > launchAreaHeight) {//flying straight now
				container.body.setBounce(0);
				container.body.setCollideWorldBounds(false);
				container.body.setVelocity(Phaser.Math.Between(-20,20), container.speed);
			}
			
			//put it back to the top and fly again.
			if (container.y > totalHeight) {				
				container.y  = 0;
				var startX = container.getAt(0).getBounds().width;
				var endX = totalWidth - startX;
				container.x  = Phaser.Math.Between(startX, endX);
				if (container.x < 0) {
					container.x = totalWidth/2; 
				}
				container.body.setVelocity(Phaser.Math.Between(-200,200), Phaser.Math.Between(10,50));			
				container.body.setBounce(1);
				container.body.setCollideWorldBounds(true);
			}
		}			
       this.background.tilePositionY -= 0.5;

        //handle user keyboard actions
        this.movePlayerManager();
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.player.active) {
                this.shootBeam();
                this.totalShots += 1;
            }
        }
        
        //beam housekeeping
        for (var i = 0; i < this.projectiles.getChildren().length; i++) {
           var beam = this.projectiles.getChildren()[i];
           if (beam.y < 10) {
              beam.destroy();
              this.showScore();
           }
        }        
	}
	
	return scene;
})();
