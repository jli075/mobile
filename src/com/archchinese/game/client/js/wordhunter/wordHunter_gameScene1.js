//the first play scene of this game. This scene runs after the titlte scene.
 wordHunter.gameScene1 = (function() {		
	var scene = fn_createScene(wordHunter.getGameSceneOneId());
	// NOTE, this init method will be called by the framework first.It is called
	// before preload, create and update.
	scene.init = function() {
		this.btnBackgroundImgId = fn_createId();
		
		// set the ids heres
		this.musicId = fn_createId();// prefix all the audio files with A. The
		// actual value doesn't matter, but it must
		// be unique
		this.pickUpAudioId = fn_createId();
		this.explosionAudioId = fn_createId();
		this.rockId = fn_createId();
		this.leftBtnId = fn_createId();
		this.backgroundImgId = fn_createId();
		this.bombImgId = fn_createId();
		this.dudeImgId = fn_createId();
		this.platformImgId = fn_createId();
		this.brickImgId = fn_createId();
	
		this.spriteLeftId = fn_createId();
		this.spriteRightId = fn_createId();
		this.spriteTurnId = fn_createId();
		// declare the variables in this scope and provide the initial values
		this.score = 0;
		this.level = 1;
		/**
		 * Level 1: no bomb with visited color hint
		 * Level 2: one bomb without visited color hint
		 * Level 3: one bomb with choices are rotating between -180 to 180 degrees
		 * Level 4: two bombs with choices are rotating between -360 to 360 degrees
		 * Level 5: three bombs with choices are rotating between -360 to 360 degrees
		 * Level x: each level add one more bomb.
		 */
		this.gameScene1Done = false;
		this.leftButtonDown = false;
		this.rightButtonDown = false;
		this.upButtonDown = false;
	
		this.currentMatchType = -1;// value should be from 0 to 5
		//0: front chinese, back, pinyin
		//1: front pinyin, back, chinese		
		//2: front chinese, back, english
		//3: front english, back, chinese		
		//4: front pinyin, back, english
		//5: front english, back, pinyin
		
		this.showFrontSide = true;// toggle the front/back
		this.jumpable = false;
	
		//is mobile or use explicitly enabled joystick
		this.isMobile = fn_isMobile() || wordHunter.isMobileControlOn();
		this.isMusicOn = wordHunter.isMusicOn();

		// game data list. They will be set by the game agent after it receives the
		// data.
		this.frontList = [];
		this.backList = [];
	
		// game time elapsed
		this.totalTime = 300;//30 seconds for each word. Default value is set to 300.
	}
	
	scene.preload = function() {
		this.load.image(this.btnBackgroundImgId, wordHunter.getAsset("button-bg.png"));
		this.load.image(this.bombImgId, wordHunter.getAsset("asteroid.png"));
	
		// Loads music for certain actions
		if (this.isMusicOn) {
			this.load.audio(this.explosionAudioId, [wordHunter.getAsset("explosion.mp3")]);
			this.load.audio(this.pickUpAudioId, [wordHunter.getAsset("pickup.mp3")]);		
			this.load.audio(this.musicId, [ wordHunter.getAsset("sci-fi.mp3")]);
		}
		
		this.load.image(this.rockId, wordHunter.getAsset("rock.png"));
		this.load.image(this.leftBtnId, wordHunter.getAsset("arrow.png"));

		var backgroundImageURL = wordHunter.getAsset("background.png");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);	
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}		

		
			
		this.load.spritesheet(this.dudeImgId, wordHunter.getAsset("dude.png"), {
			frameWidth : 32,
			frameHeight : 48
		});
	
		this.load.image(this.platformImgId, wordHunter.getAsset('platform.png'));
		this.load.image(this.brickImgId, wordHunter.getAsset("brick.png"));
	}
	
	scene.create = function() {
		fn_setToFullScreen(this);
			
		//fn_createGradient(this, this.backgroundImgId,"#FAE100", '#900DFF');
		fn_setBackground(this, this.backgroundImgId);
		
		// The platforms group contains the ground and the 2 ledges we can jump on
		this.platforms = this.physics.add.staticGroup();
	
		// Here we create the ground.
		// Scale it to fit the width of the game (the original sprite is 400x32 in
		// size)
		// raise the invisible brick wall to make the little guy walking above the
		// ground of the background image
		
		//when the user's background image is used, do not add the this floor
		var floorYOffSet = 100;//100 for default;
		var floorAlpha = 0.0;
		if (fn_isUserBackgroundImgUsed()) {
			floorYOffSet = 0;
			floorAlpha = 0.1;
		}
		this.platforms.create(fn_getCanvasWidth() / 2, fn_getCanvasHeight() - floorYOffSet,
				this.brickImgId).setAlpha(floorAlpha).setScale(2).refreshBody();// floor
		
	
		// left top
		this.platforms.create(-40, fn_getCanvasHeight() * 0.35, this.platformImgId)
		.setAlpha(0.5).setScale(2).refreshBody(); // middle
		
		//left bottom
		this.platforms.create(180, fn_getCanvasHeight() * 0.7, this.platformImgId)
				.setAlpha(0.5).setScale(2).refreshBody(); // middle
	
		
		// Now let's create some ledges, right side
		this.platforms.create(fn_getCanvasWidth() - 120,
				fn_getCanvasHeight() * 0.25, this.platformImgId).setAlpha(0.5)
				.setScale(2).refreshBody(); // top
		// one
		this.platforms.create(fn_getCanvasWidth() - 320,
				fn_getCanvasHeight() * 0.6, this.platformImgId).setAlpha(0.5)
				.setScale(2).refreshBody(); // the
		// bottom
		// one
	
		// The player and its settings
		this.player = this.physics.add.sprite(220, 150, this.dudeImgId);
	
		// make the little guy clickable an draggable, do not remove me!
		this.player.setInteractive({
			useHandCursor : true
		}).on('pointerup', this.upDown);
		/*
		 * .on('pointerover', function(){this.setTint('#00FF00');}, this)
		 * .on('pointerout', function(){this.clearTint();}, this);
		 */
		/*
		 * //this is a good reference for DnD support.
		 * this.input.setDraggable(this.player); //set up the drag and drop support
		 * on this scene this.input.on('dragstart', function (pointer, gameObject)
		 * {gameObject.setTint('#FF0000);}); this.input.on('drag', function
		 * (pointer, gameObject, dragX, dragY) { //gameObject.setPosition(dragX,
		 * dragY); gameObject.x = dragX;//can horizontally drag the player });
		 * this.input.on('dragend', function (pointer, gameObject) {
		 * gameObject.clearTint(); });
		 */
		// end drag and drop setup.
	
		// Player physics properties. Give the little guy a slight bounce.
		// this.player.setBounce(0.25);
		this.player.setCollideWorldBounds(true);
		this.player.scaleX = 2;// resize the little guy.
		this.player.scaleY = 2;// resize the little guy.
		this.player.setGravityY(2000);
			
		if(this.isMusicOn) {
			// Adds music for certain actions		
			this.explosionSound = this.sound.add(this.explosionAudioId);
			this.pickupSound = this.sound.add(this.pickUpAudioId);
			
			// Sets up and play background music				
			this.music = fn_setUpAndPlayMusic(this, this.musicId);
		}
	
		// Our player animations, turning, walking left, walking right, and
		// exploding.
		this.createPlayerAnimations();
	
		// Input Events
		this.cursors = this.input.keyboard.createCursorKeys();
	
		// quick way to end, used for testing only. Will be disabled in production.
		this.spacebar = this.input.keyboard
				.addKey(fn_spaceKey());
	
		// next word label ([prompt text)
		this.nextWord = this.add.text(0, 0, " ", {
			fontFamily : fn_getChineseFont(),
			fontWeight : 'bold',
			fontSize : 48 * 1.3,
			color : fn_getGameMatchedTextColor()
		});
		this.nextWord.setShadow(1, 1, "#CCCCCC", 1, true, true);
		this.nextWord.setInteractive({useHandCursor: true}).on('pointerup', function() {
			var chinese = this.liveWords[this.toMatchIndex].chinese;
			var pinyin = this.liveWords[this.toMatchIndex].pinyin;			
			fn_playWordSound(chinese,pinyin);//play mom's voice of this word
		}, this).on('pointerover', function(){this.nextWord.setStyle({fill : fn_getGameVisitedTextColor()});}, this).on('pointerout', function(){this.nextWord.setStyle({fill : fn_getGameMatchedTextColor()});}, this);
		// /////////////////////////////
		//list of the word containers on the screen.
		this.liveWords = [];
		///////
		this.bombs = this.physics.add.group();
		
		//show time, score, list name and round number.
		this.setUpGameStatusLabels();
		
		// Collide the player and the words with the platforms
		this.physics.add.collider(this.player, this.platforms, this.makeJumpable);
		this.physics.add.collider(this.bombs, this.platforms);
		this.physics.add
				.collider(this.player, this.bombs, this.hitBomb, null, this);
	
		wordHunter.gameMaster.styleCanvas();
	
		//add left, right and up butons for mobile touch devices. 
		this.setUpPlayBtnsForMobile();
			
		// load game data from server for this scene
		// make sure data is loaded after everything has been set.
		fn_loadGameVocabListsByUUID();
	
		// start the timer. Update the time text every second
		this.gameBatchTimer = this.time.addEvent({
			delay : 1000,
			callback : this.updateTime,
			callbackScope : this,
			loop : true
		});
	}
	
	scene.setUpGameStatusLabels = function() {
		// The level
		this.levelText = this.add.text(16, 16, 'Level: 1', {
			fontSize : '30px',
			fontFamily : fn_getChineseFont(),
			fill : fn_getGameMatchedTextColor()
		});
	
		// Display the timer
		this.timerText = this.add.text(16, 56, 'Time: ', {
			fontSize : '30px',
			fontFamily : fn_getChineseFont(),
			fill : fn_getGameMatchedTextColor()
		});
	
		// The score
		this.scoreText = this.add.text(16, 96, 'Score: 0', {
			fontSize : '30px',
			fontFamily : fn_getChineseFont(),
			fill : fn_getGameMatchedTextColor()
		});
	
		//display the list title,
		this.titleText = this.add.text(this.sys.canvas.width, 16, '' , {
			fontSize : '30px',
			fontFamily : fn_getChineseFont(),
			fill : fn_getGameMatchedTextColor()
		});	
		
		this.wordCountText = this.add.text(this.sys.canvas.width, 56, 'Word Count: 0', {
			fontSize : '24px',
			fontFamily : fn_getChineseFont(),
			fill : fn_getGameMatchedTextColor()
		});
		
		this.creatorText = this.add.text(this.sys.canvas.width, 96, 'Created By: ', {
			fontSize : '24px',
			fontFamily : fn_getChineseFont(),
			fill : fn_getGameMatchedTextColor()
		});
		
		//create pause button at the screen bottom, MAKE SURE create the btn image first and then create the button label!!!
		this.pauseBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.pauseGame);
		this.pauseBtnBg.alpha = 0.5;
		fn_centerObject(this, this.pauseBtnBg, -5);
		this.pauseBtnBg.x -= this.pauseBtnBg.getBounds().width/2 + 10;
		this.pauseBtn = fn_createBtn(this,"Pause", 24, this.pauseGame);
		this.pauseBtn.alpha = 0.7;
		fn_nestedInCenter(this.pauseBtn,this.pauseBtnBg);
		
		//stop button
		this.stopBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.navigateToGameOverScene);
		this.stopBtnBg.alpha = 0.5;
		fn_centerObject(this, this.stopBtnBg, -5);
		this.stopBtnBg.x += this.stopBtnBg.getBounds().width/2 + 10;		
		this.stopBtn = fn_createBtn(this,"Stop", 24, this.navigateToGameOverScene);
		this.stopBtn.alpha = 0.7;
		fn_nestedInCenter(this.stopBtn,this.stopBtnBg);		
	}.bind(scene);
	
	scene.pauseGame = function() {
		scene.scene.pause(wordHunter.getGameSceneOneId());
		if(this.isMusicOn) {
			scene.music.pause();// stop background music
		}
		scene.scene.wake(wordHunter.getGameGlassId());
		
		scene.scene.moveAbove(wordHunter.getGameSceneOneId(), wordHunter.getGameGlassId());
	}.bind(scene);
	
	scene.enablePauseBtn = function() {
		scene.pauseBtn.setText("Pause");
		fn_nestedInCenter(scene.pauseBtn,scene.pauseBtnBg);
		if (this.isMusicOn) {
			scene.music.resume();//resume music
		}
	}
	
	scene.setUpPlayBtnsForMobile = function() {
		if(this.isMobile){
			var leftButton = this.add.image(32, 568, this.leftBtnId);
			leftButton.setInteractive().on('pointerdown', this.leftDown).on(
					'pointerup', this.leftUp).on('pointerout', this.leftUp);
			leftButton.x = 150;
			leftButton.y = fn_getCanvasHeight() - 80;
			leftButton.scaleX = 2.5;
			leftButton.scaleY = 2.5;
		
			var rightButton = this.add.image(160, 568, this.leftBtnId);
			rightButton.angle = 180; 
			rightButton.setInteractive().on('pointerdown', this.rightDown).on(
					'pointerup', this.rightUp).on('pointerout', this.rightUp);
			rightButton.x = 450;
			rightButton.y = leftButton.y;
			rightButton.scaleX = 2.5;
			rightButton.scaleY = 2.5;
		
			var upButton = this.add.image(768, 568, this.leftBtnId);
			upButton.angle = 90;//rotate the left arrow to make up arrow
			upButton.setInteractive().on('pointerdown', this.upDown);
			upButton.x = fn_getCanvasWidth() - 150;
			upButton.y = leftButton.y;
			upButton.scaleX = 2.5;
			upButton.scaleY = 2.5;
		}	
	}.bind(scene);
	
	scene.createPlayerAnimations = function() {
		// Our player animations, turning, walking left, walking right, and
		// exploding.
		this.anims.create({
			key : this.spriteLeftId,
			frames : this.anims.generateFrameNumbers(this.dudeImgId, {
				start : 0,
				end : 3
			}),
			frameRate : 13,
			repeat : -1
		});
	
		this.anims.create({
			key : this.spriteTurnId,
			frames : [ {
				key : this.dudeImgId,
				frame : 4
			} ],
			frameRate : 20
		});
	
		this.anims.create({
			key : this.spriteRightId,
			frames : this.anims.generateFrameNumbers(this.dudeImgId, {
				start : 5,
				end : 8
			}),
			frameRate : 13,
			repeat : -1
		});
	}.bind(scene);
	
	scene.getBombInitialX = function() {
		return (this.player.x < fn_getCanvasWidth() / 2) ? fn_rand(
				fn_getCanvasWidth() / 2, fn_getCanvasWidth()) : fn_rand(0, fn_getCanvasWidth() / 2);
	}.bind(scene);
	
	scene.updateTime = function() {
		if (this.liveWords.length != 0 && this.totalTime > 0) {
			this.totalTime -= 1;// minus one second to the total time
		}
		/*
		 * //format the time display var minutes = Math.floor(this.totalTime/60);
		 * var minutesText =""; if (minutes < 10) { minutesText ="0"; } minutesText +=
		 * minutes; // Seconds var partInSeconds = this.totalTime%60; // adds left
		 * zeros to seconds var secondsText = partInSeconds < 10? "0" +
		 * partInSeconds : "" + partInSeconds;
		 */
	
		// formated time
		this.timerText.setText("Time: " + this.totalTime);
	}.bind(scene);
	
	scene.addTimeToScore = function() {
		if (this.liveWords.length === 0) {
			if (this.totalTime > 0) {
				this.totalTime -= 1; // add a second to the score
				this.score += 1;
				this.timerText.setText("Time: " + this.totalTime);
				this.scoreText.setText("Score: " + this.score);
			} else {
				// done with the addTimeToScore timer and destroy it. Otherwise it
				// will run forever.
				if (this.addTimeToScoreTimer) {
					this.addTimeToScoreTimer.destroy();
				}
	
				if(this.level==100){//stop the game if you hit level 100 :)
					//game should never ends unless the player is bombed.
	
					this.gameScene1Done = true;
					if(this.isMusicOn) {
						this.explosionSound.play();
					}
					scene.player.anims.play(this.spriteTurnId);
	
					// make the bomb disappear
					this.bombs.clear(true);
					if(this.isMusicOn) {
						this.music.stop();// stop background music
					}
	
					// navigate to the game over screen after 1000 milliseconds delay
					var timedEvent = this.time.delayedCall(1000, this.navigateToGameOverScene,
							[], this);
				} else {
					// finished converting time to scores, move on to the next round
					if (this.lastDataIndex < this.chineseArray.length - 1) {
						//we have more data to play for this level. Level should not be updated.
					} else {
						//finished all the words in the list, ready for the next level.
						this.level += 1;
						this.levelText.setText('Level: ' + this.level);
						//data pointer reset to -1 position
						this.lastDataIndex = -1;
					}
	
					// reload the word list and play the next around
					this.refreshWordPairs();
	
					// reset time. This is a new batch.
					this.totalTime = this.liveWords.length * 30;//new batch, reset time total time.
					if (this.totalTime < 60) {
						this.totalTime = 60;
					}
					// resume the game time timer
					if (this.gameBatchTimer) {
						this.gameBatchTimer.paused = false;
					}
					
					//for level 3 and above, the words will be rotating....
					if (this.level > 2) {
						for (j = 0; j < this.liveWords.length; j++) {
							this.tweens.add({
								targets : this.liveWords[j],
								angle : fn_rand(-20, 20),//Phaser.Math.Between(-20, 20),
								duration : 3000,
								yoyo : true,
								loop : -1
							});
						}
					}
								
					// create bombs
					/**
					 * Level 1: no bomb with visited color hint
					 * Level 2: one bomb without visited color hint
					 * Level 3: one bomb with choices are rotating between -180 to 180 degrees
					 * Level 4: two bombs with choices are rotating between -180 to 180 degrees
					 * Level 5: two bombs with choices are rotating between -180 to 180 degrees
					 * Level 6: three bombs..
					 * ....
					 */
					//based on the difficulty level, set different count of bombs.
					var bombCount = this.level/2;
					
					var difficultyLevel = parseInt(fn_getDifficultyLevel());
					switch(difficultyLevel) {
						case 0:
							bombCount = Math.floor(this.level/3);//a new bomb every 3 games
							break;
						case 1:
							bombCount = Math.floor(this.level/2);//a new bomb every 2 games
							break;
						case 2:
							bombCount = this.level;
							break;						
					}
	
					for (i = 0; i < bombCount; i++) {
						var bomb = this.bombs.create(this.getBombInitialX(), 16, this.bombImgId);
						bomb.setBounce(1);
						bomb.setCollideWorldBounds(true);
						bomb.setVelocity(fn_rand(-200, 200), 20);
						bomb.allowGravity = false;
					}
				}
			}
		}
	}.bind(scene);
	
	scene.makeJumpable = function() {
		if (this.player.body.touching.down) {
			this.jumpable = true;
		}
	}.bind(scene);
	
	scene.leftDown = function() {
		this.leftButtonDown = true;
	}.bind(scene);
	
	scene.leftUp = function() {
		this.leftButtonDown = false;
	}.bind(scene);
	
	scene.rightDown = function() {
		this.rightButtonDown = true;
	}.bind(scene);
	
	scene.rightUp = function() {
		this.rightButtonDown = false;
	}.bind(scene);
	
	// handled return word lists from server. set by game agent.
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
		
		this.totalTime = this.liveWords.length * 30;//allocate 30 seconds to each word
		if (this.totalTime < 60) {
			this.totalTime = 60;
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
	
	scene.addToList = function(targetList, sourceList) {
		for (i = 0; i < sourceList.length; i++) {
			targetList.push(sourceList[i])
		}
	}
	
	scene.refreshWordPairs = function() {
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
			this.currentMatchType = newMatchType; // updated the cached match
			// type.
		}
		// set the front and back list based on a random matching type provided by
		// GWT code.
		// We may need to make this match type configurable by the teacher when
		// she/he sets up the game
		// note "~" is the delimiter!!
		//var countPerBatch = 12;//12 words at a time
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
		switch (newMatchType) {
		case 0://front chinese, back, pinyin
			scene.addToList(this.frontList, chineseSubList);
			scene.addToList(this.backList, pinyinSubList);
			break;
		case 1:// front pinyin, back, chinese
			scene.addToList(this.frontList, pinyinSubList);
			scene.addToList(this.backList, chineseSubList);
			break;
		case 2:// front chinese, back, english
			scene.addToList(this.frontList, chineseSubList);
			scene.addToList(this.backList, englishSubList);
			break;
		case 3:// front english, back, chinese
			scene.addToList(this.frontList, englishSubList);
			scene.addToList(this.backList, chineseSubList);
			break;
		case 4:// front pinyin, back, english
			scene.addToList(this.frontList, pinyinSubList);
			scene.addToList(this.backList, englishSubList);
			break;
		case 5:// front english, back, pinyin
			scene.addToList(this.frontList, englishSubList);
			scene.addToList(this.backList, pinyinSubList);
			break;			
		}
	
		fn_createWordTextObjects(chineseSubList, pinyinSubList, this.level, newMatchType, this.frontList, this.backList, this,
				this.liveWords);
	
		this.physics.add.collider(this.liveWords, this.platforms);
		this.physics.add.collider(this.liveWords, this.liveWords);// collide with
		// each other to
		// avoid
		// overlapping
		// Checks to see if the player overlaps with any of the words.
		// call the collectWord function
		this.physics.add.overlap(this.player, this.liveWords, this.collectWord,
				null, this);
	
		//console.log("liveWords: " + this.liveWords.length);
		this.showPromptText();
	}.bind(scene);
	
	scene.showPromptText = function() {
		if (this.liveWords.length > 0) {
			this.toMatchIndex = Math.floor(Math.random() * this.liveWords.length);
			var backText = this.liveWords[this.toMatchIndex].backText
			
			////
			//play the native speaker recorcding of this word.
			var chinese = this.liveWords[this.toMatchIndex].chinese;
			var pinyin = this.liveWords[this.toMatchIndex].pinyin;
			
			if (chinese.length < 5) {
				//audio is now based on the new option of "wordAudio"
				if(this.isMusicOn) {
					if (fn_getGameWordAudio()) {
						this.music.pause();//pause background music		
						fn_playWordSound(chinese,pinyin);//play mom's voice of this word
						//wait for 1 per character  before resuming the background music
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
		this.nextWord.y = this.nextWord.getBounds().height;	
	}.bind(scene);
	
	scene.upDown = function() {
		if (this.player.body.touching.down) {
			this.upButtonDown = true;
		}
	}.bind(scene);
	
	scene.resetCursors = function() {
		this.cursors.left.isDown =  false;
		this.cursors.right.isDown =  false;
		this.cursors.up.isDown =  false;
	}.bind(scene);
	
	scene.update = function() {
		if (this.gameScene1Done) {
			return;
		}
		if (this.cursors.left.isDown || this.leftButtonDown) {
			this.player.setVelocityX(-400);
			this.player.anims.play(this.spriteLeftId, true);
		} else if (this.cursors.right.isDown || this.rightButtonDown) {
			this.player.setVelocityX(400);
			this.player.anims.play(this.spriteRightId, true);
		} else {
			this.player.setVelocityX(0);
			this.player.anims.play(this.spriteTurnId);
		}
	
		if ((this.cursors.up.isDown || this.upButtonDown)
				&& this.player.body.touching.down && this.jumpable) {
	
			this.jumpable = false;
			this.player.setVelocityY(-1600);
	
			this.upButtonDown = false;
		}	
	}
	
	scene.collectWord = function(thePlayer, theContainer) {
		if (this.nextWord.text.length < 1) {// do not change color if no prompt word
			// is showing
			return;
		}
	
		if (this.nextWord.text != theContainer.backText.text) {// overlap with a unmatched
			// word, change the color to
			// blue
			if (this.level <= 2) {//for level 1 only.
				//theContainer.first.setColor('#0000FF');			
				theContainer.first.setColor(fn_getGameVisitedTextColor());
			}
			// indicate this word was
			// visited.
			return;
		}
		// Bingo, we have a match!
	
		// matched text to white and start to fall to the ground.
		// theContainer.first.setText(theContainer.first.text + ' - ' +
		// this.nextWord.text);
		theContainer.backText.setVisible(true);// make the hidden back text visible
		// and add it into the container.
		theContainer.add(theContainer.backText);// now both prompt and answer in the
		// same container.
	
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
		
		theContainer.body.setGravityY(10);// drop the matched word, using a
		// smaller gravity. Game level is set to
		// 300.
		theContainer.body.allowGravity = true;
	
		// use a yoyo animation for fun when the container is dropping to the
		// ground.
		if (this.level < 3) {
			//level 1 and level 2 do not have the effect, add it when the word is dropping.
			//other levels already have this effect even before they are matched.
			this.tweens.add({
				targets : theContainer,
				angle : fn_rand(-120, 120),
				duration : 5000,
				yoyo : true,
				repeat : -1
			});
		}
		// /////////done handling the matched word.
	
		// remove the word container element from the live word list
		var wordIndex = this.liveWords.indexOf(theContainer);
		if (wordIndex >= 0) {
			this.liveWords.splice(wordIndex, 1);
		}
		// remove the word object in the container and set the destroy flag to true
		// to destroy the text.
		this.time.delayedCall(1500, this.removeMatchedWord, [ theContainer ], this);
	
		var wordColor = fn_getGameTextColor();
		for (j = 0; j < this.liveWords.length; j++) {
			this.liveWords[j].first.setColor(wordColor);// reset the remaining words
			// color to green.
		}
	
		this.score += 10;
		this.scoreText.setText('Score: ' + this.score);
		if(this.isMusicOn) {
			this.pickupSound.play();
		}
	}.bind(scene);
	
	scene.removeMatchedWord = function(theMatchWord) {
		// remove the word object in the container and set the destroy flag to true
		// to destroy the text.
		theMatchWord.removeAll(true);
		// remove the container game object from the scene
		theMatchWord.destroy();
	
		// if no more words to play, convert the remaining seconds to the total
		// score
		if (this.liveWords.length === 0) {		
			// for each batch we create a new addTimeToScore timer. The last used
			// one was destroyed once the score conversion was done.
			// first we pause the update time timer so that is no more time elapse.
			if (this.gameBatchTimer) {
				this.gameBatchTimer.paused = true;
			}
			//destroy the bombs for this batch. new bombs will be created for the next batch.
			this.bombs.clear(true);
			/////////
			
			// start the conversion of time.
			this.addTimeToScoreTimer = this.time.addEvent({
				delay : 5,
				callback : this.addTimeToScore,
				callbackScope : this,
				loop : true
			});
		} else {
			// if we have more words, prompt the next word
			this.showPromptText();
		}
	}.bind(scene);
	
	scene.hitBomb = function(thePlayer, theBomb) {
		// this.physics.pause();
		this.gameScene1Done = true;
	
		if(this.isMusicOn) {
			var explosionSoundConfig = {
					mute : false,
					volume : 0.4,
					rate : 1,
					detune : 0,
					seek : 0,
					loop : false,
					delay : 0
			}
			this.explosionSound.play(explosionSoundConfig);
		}

		//thePlayer.setTint("#FF0000");
	
		thePlayer.anims.play(this.spriteTurnId);
	
		// make the bomb and player disappear
		theBomb.disableBody(true, true);
		thePlayer.disableBody(true, true);
		if(this.isMusicOn) {
			this.music.stop();// stop background music
		}
		fn_createAndExplodParticles(this, theBomb.x, theBomb.y, this.rockId);
	
		// navigate to the game over screen after 1000 milliseconds delay
		var timedEvent = this.time.delayedCall(1000, this.navigateToGameOverScene,
				[], this);
	}.bind(scene);
	
	scene.navigateToGameOverScene = function() {
		scene.scene.stop(wordHunter.getGameSceneOneId());
		scene.scene.stop(wordHunter.getGameGlassId());
		scene.scene.start(wordHunter.getGameOverId());
		if(this.isMusicOn) {
			this.music.stop();// stop background music
		}
	}.bind(scene);

	return scene;
})();
