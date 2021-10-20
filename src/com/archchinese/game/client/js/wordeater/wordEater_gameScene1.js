//the first play scene of this game. This scene runs after the title scene.
 wordEater.gameScene1 = (function() {		    
	var scene = fn_createScene(wordEater.getGameSceneOneId());
	
	// NOTE, this init method will be called by the framework first.It is called
	// before preload, create and p.
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.dynamicFramesId =  fn_createId();
		
		this.pickupAudioId = fn_createId();
		this.dyingAudioId = fn_createId();
		this.musicId = fn_createId();
		
		this.heartId = fn_createId();
		this.life = [];
		
		this.isSoundOn = wordEater.isMusicOn();
		this.isMobile = fn_isMobile() || wordEater.isMobileControlOn();		
		if (this.isMobile) {
			this.joyStickBaseImgId = fn_createId();
			this.joyStickThumbImgId = fn_createId();
		}
		
		this.lastBatchAnchorRow = -1;
		this.wordPool = [];
		this.activeWords = [];
		this.matchedWords = [];//track the words that have been prompted at least once and matched!
		
		//prompt word ellipse shrink/expand step
		this.promptBoxExpand = false; 
		this.promptBoxScaleFactor = 1;
		
		//variable for total time
		this.finalScore = 0;
		this.score = 0;
						
		//user click arrow keys to control the eater.
		//if not touched, the eater is rotate around the center of the screen
		this.eaterTouched = false;
		
		this.gameSpeed = -100;//initial word moving speed		
		var difficultyLevel = parseInt(fn_getDifficultyLevel());		
		switch(difficultyLevel) {		
			case 0:
				this.gameSpeed = -80;
				break;
			case 1:
				this.gameSpeed = -100;
				break;
			case 2:
				 this.gameSpeed = -150;
				break;						
		}

	    //the match type of the first round. The second round will use the alternative match type.
	    this.currentMatchType = fn_getGameMatchType();
		//0: front chinese, back, pinyin
		//1: front pinyin, back, chinese		
		//2: front chinese, back, english
		//3: front english, back, chinese		
		//4: front pinyin, back, english
		//5: front english, back, pinyin
	    
	    //current prompt text, used to play mom's recording when the user clicks the prompt text.
	    this.promptChinese = "";
	    this.promptPinyin = "";
	}
	
	scene.preload = function() {
		if (this.isMobile) {
			//load virtual joystick
			fn_loadJoyStick(this);
		}

		//load background. User's background can be used. Note that we should use a single piece background, not tiled images here. 
		var backgroundImageURL = wordEater.getAsset("background.jpg");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);
			this.userBackgroundImageUsed = true;
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}		
		
		//button background image
		this.load.image(this.btnBackgroundImgId, this.getAsset("button-bg.png"));
		
		if (this.isMobile) {//mobile only
			this.load.image(this.joyStickBaseImgId, this.getAsset("joystick.png"));
			this.load.image(this.joyStickThumbImgId, this.getAsset("joystickthumb.png"));
		}
		 
		//load music
		if (this.isSoundOn) {
			this.loadMusic(this.pickupAudioId, "pickup.mp3");
			this.loadMusic(this.dyingAudioId, "dying.mp3");
			this.loadMusic(this.musicId, "tenderness.mp3");
		}
		
		this.load.image(this.heartId, this.getAsset("heart.png"));
	};
	
	scene.create = function() {
		fn_drawSandWave(this);
		
		//set to full screen. Only works on FireFox and Chrome.
		fn_setToFullScreen(this);		

		var oceanBackground = this.add.image(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2, this.backgroundImgId);
		oceanBackground.setDisplaySize(this.sys.canvas.width,
				this.sys.canvas.height);
		oceanBackground.alpha = 0.5;
		//oceanBackground.setDepth(-99999);	
				
	    //allows the user to control view position
		this.cursors = this.input.keyboard.createCursorKeys();		
		
		if (this.isSoundOn) {
			//pick up sound
	        this.pickupSound = this.sound.add(this.pickupAudioId);
	        //dying sound
	        this.dyingSound = this.sound.add(this.dyingAudioId);
	        	        
	        this.music = fn_loopPlayMusic(this, this.musicId, fn_getBackgroundMusicVolume()*0.75);
		}
        		
    	//set up game name, word count, created by
        //and time, progress, etc
        this.setUpGameStatusLabels();
			
        this.liveWords = this.physics.add.group();
		// /////////////////////////////
		// load game data from server for this scene
		//data is loaded after everything has been set.
		fn_loadGameVocabListsByUUID();

		//at last, we add this graphics so that the monster will be drawn on the top of the fish tank.
		this.graphics = this.add.graphics(0, 0);//graphics instance
		this.graphics.lineStyle(1, 0xB97A57, 1.0);
		this.graphics.fillStyle(0xFFFF00, 1.0);		
		
		for(var i = 0; i < 3; i++) {
			var heart = this.add.image(16 + 32*i, 56, this.heartId);
			heart.setOrigin(0,0);
			this.life.push(heart);
		}
        this.tweens.add({
			targets : this.life,
			alpha : 1,
			scale : 0.8,
			ease: 'Linear',
			duration : 1000,
			yoyo : true,
			repeat : -1
		});

		
		if (this.isMobile) {
			//create virtual joystick instance
			fn_createJoyStick(this, this.joyStickBaseImgId, this.joyStickThumbImgId);//this.joystick can be referenced later.
		}
	}
	
	scene.update = function() {	
			if (!this.eater) {//this eater won't be ready until the data from server is received and processed.  
				return;
			}
	 	   var left = this.cursors.left.isDown;
		   var right = this.cursors.right.isDown;
		   var up = this.cursors.up.isDown;
		   var down = this.cursors.down.isDown;
		   
		   if (this.isMobile) {
			   left = this.cursors.left.isDown || this.joystick.left;
			   right = this.cursors.right.isDown || this.joystick.right;
			   up = this.cursors.up.isDown || this.joystick.up;
			   down = this.cursors.down.isDown || this.joystick.down;
		   }

		if (left || right || up || down) {
			this.eaterTouched = true;
		}
		
		if (!this.eaterTouched) {//user has not hit the control keys since the game starts, play rotating around the center of the screen.
			//items, point, angle, distance. 0.02 is angle and 200 is distance.			
			fn_rotateAroundDistance([this.eater], { x: fn_getCanvasWidth()/2, y: fn_getCanvasHeight()/2}, 0.02, fn_getCanvasHeight()/4);
		}
		//update words on the screen
		var maxX = -1;		
		var count = this.liveWords.getLength();		
        for(var j=0; j<count; j++){        	
        	var word = this.liveWords.getChildren()[j];
        	//if we have words moved out of the left side of the screen, remove it
        	//from the physics update list, but keep in the in the scene and memory. They will be reused.
        	if (word) {
	    		if (word.x + word.getBounds().width/2 > maxX) {
	    			maxX = word.x + word.getBounds().width/2; 
	    		}
	    		
	    		if(word.x + word.getBounds().width/2 < -1 * fn_getCanvasWidth()){
	    			word.setVisible(false);
	    			this.liveWords.remove(word, false, false);//remove from the group, but do not remove the scene nor destroy it.
	    			fn_removeElement(this.activeWords, word);
	        	}
        	}
        }
        //if we have enough right side space, place another column of words.
        if (maxX < fn_getCanvasWidth()*0.8) {//20% space, release second one
        	this.setUpAPipe();
        }  
        
        //check the controls
	   var step = 5;
	   var eaterWidth = this.eater.getBounds().width;
	   var eaterHeight = this.eater.getBounds().height;
	   
	   if (this.eater) {
		   if (left){
			   this.eater.x -= step;
			   if (this.eater.x < eaterWidth*2 + this.promptLabel.displayWidth) {//make it stay on the screen
				   this.eater.x = eaterWidth*2 + this.promptLabel.displayWidth;
			   }
		    } else if (right){
			   this.eater.x += step;
			   if (this.eater.x > fn_getCanvasWidth()- eaterWidth/2) {//make it stay on the screen
				   this.eater.x = fn_getCanvasWidth() - eaterWidth/2;
			   }		    	
		    }		   
		    if (up) {
				   this.eater.y -= step;
				   if (this.eater.y < eaterHeight/2) {//make it stay on the screen
					   this.eater.y = eaterHeight/2;
				   }		    	
		    } else if (down) {
				   this.eater.y += step;
				   if (this.eater.y > fn_getCanvasHeight() - 150) {//minus the foundation wall height
					   this.eater.y = fn_getCanvasHeight() - 150;
				   }		    			    	
		    }
	   }
	   
	    //set prompt label position. prompt label is after the eater.
		if (this.promptLabel) {
			this.promptLabel.y = this.eater.y;
			this.promptLabel.x = this.eater.x  - this.promptLabel.displayWidth-this.eater.displayWidth/2;//The displayed width of this Game Object. This value takes into account the scale factor.
		}
		
		//animate the little monster.
		this.graphics.clear();
	    //this.graphics.arc(this.eater.x, this.eater.y, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(360), true, false);
		var fillColor = this.eater.isTinted? 0x000000 : fn_getGameTextColorInt();
	    //this.graphics.lineStyle(2, 0xB97A57, 1.0);
		this.graphics.lineStyle(8, fillColor, 1.0);
	    this.graphics.fillStyle(fillColor, 0.2);	    
	    if (this.promptBoxExpand) {
	    	this.promptBoxScaleFactor += 0.005;
	    } else {
	    	this.promptBoxScaleFactor -= 0.005;
	    } 
		var tailShake = true;
	    if (this.promptBoxScaleFactor < 0.9) {
	    	this.promptBoxScaleFactor = 0.9;
	    	this.promptBoxExpand = true;
	    	tailShake = true;
	    } else if (this.promptBoxScaleFactor > 1.1) {
	    	this.promptBoxScaleFactor = 1.1;
	    	this.promptBoxExpand = false;
	    	tailShake = false;
	    }
	    
	    //the belly.
	    var width = this.promptLabel.displayWidth*1.45*this.promptBoxScaleFactor;
	    var height = this.promptLabel.displayHeight*1.45*this.promptBoxScaleFactor;
	    if (height < eaterHeight) {
	    	height = eaterHeight;
	    }
	    
	    var ellipse = fn_createEllipse(this.promptLabel.x, this.promptLabel.y, width, height);
        this.graphics.fillEllipseShape(ellipse);
        this.graphics.strokeEllipseShape(ellipse, 128);
        
        //the neck         
        this.graphics.fillStyle(fillColor, 1);
        var neckThickness = 20*this.promptBoxScaleFactor;
        var neckWidth = this.eater.x-this.eater.displayWidth/2-this.promptLabel.x-width/2;
        var neck = fn_createEllipse(this.promptLabel.x+width/2+neckWidth/2, this.promptLabel.y, neckWidth, neckThickness);
        this.graphics.fillEllipseShape(neck);
        this.graphics.strokeEllipseShape(neck, 32);
        //this.graphics.fillRect(this.promptLabel.x+width/2, this.promptLabel.y- neckThickness/2, this.eater.x-this.eater.displayWidth/2-this.promptLabel.x-width/2, neckThickness);
        
        //little tails
        this.graphics.lineStyle(1, fillColor, 1.0);
        var tailWidth = 20 + (1-this.promptBoxScaleFactor)*40;
        var tailAdjustment = 0;        
        if (tailShake) {
        	tailAdjustment = 6;
        	tailShake = false;
        }
        
	    var tail1 = fn_createEllipse(this.promptLabel.x-width/2-tailWidth/2, this.promptLabel.y - tailAdjustment , tailWidth, tailWidth/2);
        this.graphics.fillEllipseShape(tail1);
        this.graphics.strokeEllipseShape(tail1, 32);
	    var tail2 = fn_createEllipse(this.promptLabel.x-width/2-tailWidth/2, this.promptLabel.y + tailAdjustment, tailWidth, tailWidth/2);
        this.graphics.fillEllipseShape(tail2);
        this.graphics.strokeEllipseShape(tail2, 32);
        
        //done animation
        
	}
		
	//
	scene.createFrontText = function() {
		  var randomIndex = Math.floor(Math.random()* this.chineseArray.length); 
		  var chinese = this.chineseArray[randomIndex];
		  var pinyin = this.pinyinArray[randomIndex];
		  var english = this.englishArray[randomIndex];
		  
		  return fn_createFrontText_generic(this, chinese, pinyin, english,42, 1.3, this.currentMatchType);
	}.bind(scene);
		
    ///////////////////////////////////////////////////////////////////////////	
	scene.getAsset = function(name) {
		return wordEater.getAsset(name);
	}

	scene.loadMusic = function(id, mp3) {
		this.load.audio(id, [this.getAsset(mp3)]);		
	}.bind(scene)
		
	
	scene.showScore = function() {
		if (this.score < 0) {
			this.score = 0;
		}
		this.scoreText.setText('Score: ' + this.score);
	}.bind(scene);
	
	scene.setUpGameStatusLabels = function() {
		// The score label
		this.scoreText = fn_createStatusLabel(this, 16,16, "Score: 0");

		
		//display the list title label
		this.titleText = fn_createStatusLabel(this, this.sys.canvas.width, 16, ''); 
		
		//word count label
		this.wordCountText = fn_createStatusLabel(this, this.sys.canvas.width, 56, 'Word Count: 0');

		//creator label
		this.creatorText = fn_createStatusLabel(this, this.sys.canvas.width, 96, 'Created By: ');
		
		//create pause button at the screen bottom, MAKE SURE create the button image first and then create the button label!!!
		this.pauseBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.pauseGame);
		this.pauseBtnBg.alpha = 0.5;
		fn_centerObject(this, this.pauseBtnBg, -5.0);
		this.pauseBtnBg.x = this.sys.canvas.width - 2 * this.pauseBtnBg.getBounds().width -20 + 70;
		this.pauseBtn = fn_createBtn(this,"Pause", 24, this.pauseGame);
		this.pauseBtn.alpha = 0.7;
		fn_nestedInCenter(this.pauseBtn,this.pauseBtnBg);
		
		//stop button
		this.stopBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(0.5).setInteractive({useHandCursor: true}).on('pointerup', this.navigateToGameOverScene);
		this.stopBtnBg.alpha = 0.5;
		fn_centerObject(this, this.stopBtnBg, -5.0);
		this.stopBtnBg.x = this.sys.canvas.width - this.stopBtnBg.getBounds().width - 10 + 70;
		this.stopBtn = fn_createBtn(this,"Stop", 24, this.navigateToGameOverScene);
		this.stopBtn.alpha = 0.7;
		fn_nestedInCenter(this.stopBtn,this.stopBtnBg);		

	}.bind(scene);
	
	scene.pauseGame = function() {		
		scene.scene.pause(wordEater.getGameSceneOneId());
		scene.scene.wake(wordEater.getGameGlassId());		
		scene.scene.moveAbove(wordEater.getGameSceneOneId(), wordEater.getGameGlassId());
		if (this.isSoundOn) {
			scene.music.pause();// stop background music
		}
	}.bind(scene);
	
	scene.enablePauseBtn = function() {
		scene.pauseBtn.setText("Pause");
		fn_nestedInCenter(scene.pauseBtn,scene.pauseBtnBg);
		if (this.isSoundOn) {
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
		
		//update the list title text
		this.updateListName(displayName);
		
		//update the word count text
		this.wordCountText.setText("Word Count: " + this.chineseArray.length);
		this.wordCountText.x = this.sys.canvas.width - this.wordCountText.getBounds().width - 20;	
		
		this.bottomReservedHeight = fn_getCanvasHeight() * 0.15;
		
		//create word grid
		this.rowCount = 6;
		this.colCount = 8;
		
		this.unitHeight = (fn_getCanvasHeight()-this.bottomReservedHeight)/this.rowCount;//6 available rows. 3 words take 3 of them and each separated by one row		
		this.unitWidth = fn_getCanvasWidth()/this.colCount;

		this.createWordPool();
		
		this.setUpAPipe();
		
		this.eater = this.createEater();		                
        this.physics.add.overlap(this.eater, this.activeWords, this.checkCorrect, null, this);
        
        //prompt next word
        this.promptNextWord();
	}.bind(scene);

	scene.refreshWordGrid = function() {
		this.unitHeight = (fn_getCanvasHeight()-this.bottomReservedHeight)/this.rowCount;//6 available rows. 3 words take 3 of them and each separated by one row		
		this.unitWidth = fn_getCanvasWidth()/this.colCount;
		
	}.bind(scene);
	
	scene.createEater = function() {
		 	var framesPerRow = 8;
		    var frameTotal = 8;

		    //  Create a CanvasTexture that is 512 x 64 in size.
		    //  The frames will be 64 x 64, which means we'll fit in 8 x 1 of them to our texture size, for a total of 8 frames.
		    var canvasFrame = this.textures.createCanvas(this.dynamicFramesId, 768, 96);

		    var radius = 48;
		    var angleStep = Math.PI/(4*frameTotal);//total 120, 8 frames *15 degree/frame = 120 degree

		    var x = 0;
		    var y = 0;
		    var ctx = canvasFrame.context;
		    		    		    		    		    
		    for (var i = 1; i <= frameTotal; i++)
		    {
		        //  Draw an arc to the CanvasTexture
		    	ctx.save();	
		    	ctx.moveTo(x + 48, y + 48);
		    	ctx.fillStyle = '#ffffff';
		        ctx.arc(x + 48, y + 48, radius, (i-1)*angleStep, Math.PI * 2 - (i-1)*angleStep, false);//anti-clock-wise, from 60 to 300 degree arc.
		        ctx.fill();
		        ctx.restore();
		        
		        ctx.save();		        
		        ctx.fillStyle = '#00FF00';
		        ctx.moveTo(x + 48+17, y + 48-25);
		        ctx.arc(x + 48+17-i*1, y + 48-25-i*1, radius/4, 0, Math.PI *2, true);//anti-clock-wise, from 60 to 300 degree arc.
		        ctx.fill();
		        ctx.restore();

		        ctx.save();		        
		        ctx.fillStyle = fn_getGameTextColor();//fn_getGameVisitedTextColor();
		        ctx.moveTo(x + 48+17, y + 48-25);
		        ctx.arc(x + 48+17-i*1 + i*0.5, y + 48-25-i*1, radius/9, 0, Math.PI *2, true);//anti-clock-wise, from 60 to 300 degree arc.
		        ctx.fill();
		        ctx.restore();

		        //  Now we add a frame to the CanvasTexture.
		        canvasFrame.add(i, 0, x, y, 96, 96);
		        //i: (integer|string), The name of this Frame. The name is unique within the Texture.
		        //0, The index of the TextureSource that this Frame is a part of.
		        //x: The x coordinate of the top-left of this Frame.
		        //y: The y coordinate of the top-left of this Frame.
		        //64: The width of this Frame.
		        //64: The height of this Frame.

		        x += 96;

		        //  Hit the end of the row? Wrap it around.
		        if (i % framesPerRow === 0)
		        {
		            x = 0;
		            y += 96;
		        }
		    }

		    //  Call this if running under WebGL, or you'll see nothing change
		    canvasFrame.refresh();

		    //  Let's create an animation from the new frames
		    this.anims.create({
		        key: 'bite',
		        frames: this.anims.generateFrameNumbers(this.dynamicFramesId, { start: 1, end: frameTotal }),
		        frameRate: 20,
		        repeat: -1,
		        yoyo: true
		    });
		    
		    //  Add a sprite using the base texture and animation
		    var eater = this.physics.add.sprite(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2, this.dynamicFramesId).play('bite');		    
		    eater.setCollideWorldBounds(true);	
	        eater.body.allowGravity = false;
	        eater.alpha = 1;
	        
	        //Per Jerry, we disable drag and drop. Otherwise the game becomes too simple.
	        //can be dragged
	        eater.setInteractive({useHandCursor: true, draggable: true})
			.on('dragstart', function (pointer, dragX, dragY) {
				this.eaterTouched = true;
	         }, this)		
			.on('drag', function (pointer, dragX, dragY) {
				eater.setPosition(dragX, dragY);
	         },this).on('dragend', function (pointer, dragX, dragY) {
	        	 //fn_loadAndPlay(this, fn_createId(), "assets/wordeater/cheer.mp3", 0.4);
	         }, this);

		    return eater;
	}.bind(scene);
	
		
	scene.createWordPool = function() {
		var  poolSize = this.chineseArray.length * 2;
		if (poolSize > 100) {//avoid too many game objects
			poolSize = 100;
		}
		if (poolSize < 50) {//avoid too small word pool
			poolSize = 50;
		}		
		for(var i = 0; i < poolSize; i++) {
			var word = this.createFrontText();						
			word.setBackgroundColor(null);			
			word.setVisible(false);
			this.wordPool.push(word);
		}		
	}.bind(scene);
	
	
	scene.setUpAPipe = function() {
		this.lastBatchAnchorRow += 1;
		
		var halfRowCount = this.rowCount/2;
		
		var pipeWords = [];
		
		var useMatched = Math.random() > 0.8? true : false;
		var matchedIndexToUse = fn_rand(0,halfRowCount);		
		for(var i = 0; i < halfRowCount; i++) {
			
			//normal flow
			var word = this.wordPool[Math.floor(Math.random()*this.wordPool.length)];
			if (useMatched && i == matchedIndexToUse) {
					for (var k = 0; k< this.wordPool.length; k++) {
						if (this.promptChinese == this.wordPool[k].chinese && !this.liveWords.contains(this.wordPool[k])) {
							word = this.wordPool[k];							
							break;
						}	
					}
			}

			var attempt = 0;
			//1. no duplicate words in the same pipe 
			//2. and the word must not be already on the screen!!
			while((pipeWords.indexOf(word.chinese) >= 0 || this.liveWords.contains(word)) && attempt < 50) {
				word = this.wordPool[Math.floor(Math.random()*this.wordPool.length)];
				attempt++;
			}
			if(attempt == 50) {
				//we have issues found unused word, skip this pipe
				return;
			}
			
			word.setVisible(true);
			this.liveWords.add(word);//add to physics group
			this.activeWords.push(word);
			var rowOffsetNumber = this.lastBatchAnchorRow + i*2 < this.rowCount? this.lastBatchAnchorRow + i*2 :(this.lastBatchAnchorRow + i*2)%this.rowCount;
			word.y = this.unitHeight * rowOffsetNumber + word.getBounds().height;
			word.y += fn_rand(-2, 2)*this.unitHeight*0.1;//randomize Y spaces
			
			//randomize and adjust Y positions.
			if (word.y + word.getBounds().height/2 > fn_getCanvasHeight() - this.bottomReservedHeight) {
				word.y -= word.getBounds().height/2;
			}
			if (word.y - word.getBounds().height < 10) {
				word.y += word.getBounds().height;
			}
			
			//set the x position
			var wordWidth = word.getBounds().width;
			word.x = fn_getCanvasWidth() + wordWidth/2 + fn_rand(-2, 2)*wordWidth*0.3;//place them out side of the view port,with little random x offsets.
			
			word.body.enable = true;//become alive.
			word.body.setVelocityX(this.gameSpeed);
			word.body.allowGravity = false;//no gravity
			
			pipeWords.push(word.chinese);
		}
	}.bind(scene);
	

	scene.promptNextWord = function() {
		var word = this.activeWords[Math.floor(Math.random()*this.activeWords.length)];
		
		var attempt = 0;			
		while(this.matchedWords.indexOf(word.chinese) >=0 && attempt < 20) {//prompted before, we should try a new one
			word = this.wordPool[Math.floor(Math.random()*this.wordPool.length)];
			attempt++;
		}
		
		//do not duplicate the last word
		if (word.chinese == this.matchedWords[this.matchedWords.length-1]) {
			word = this.wordPool[Math.floor(Math.random()*this.wordPool.length)];
		}
		
		this.promptChinese = word.chinese;
		this.promptPinyin = word.pinyin;
		
		var backText = word.backText;
		if (backText.input && backText.input.enabled) {
			//already have event handlers.
		} else {
			backText.setInteractive({useHandCursor: true}).on('pointerup', function() {
				if (this.isSoundOn) {
					fn_playWordSound(this.promptChinese,this.promptPinyin );
				}
			}, this);
		}
		//backText.setDepth(-999);
		fn_centerObject(this, backText, -3);
		backText.setVisible(true);
		backText.scale = 0.1;
		backText.alpha = 0.1;			
        this.tweens.add({
			targets : backText,
			alpha : 1,
			scale : 1,
			duration : 1000,
			yoyo : false,
			repeat : 0,
			onComplete: function() {
				if (this.isSoundOn) {
					fn_playWordSound(this.promptChinese,this.promptPinyin );
				}
			}.bind(this)
		});
        
        this.promptLabel = backText;        
	}.bind(scene);
	
	
	scene.checkCorrect = function(eater, word) {
		if(!this.eaterTouched){
			return;
		}
		var eaterWidth = eater.getBounds().width;
		var wordInFrontEater = (word.x < eater.x + eaterWidth/2 && word.x >= eater.x + eaterWidth/3);
		var wordEaterYClose = Math.abs(word.y - eater.y) <  eater.getBounds().height*0.5;
			
		if (!(wordInFrontEater && wordEaterYClose)) {
			if (Math.random()> 0.5) {
				this.tweens.add({
	 				targets : word,
	 				//onStart: function () {},
	 				//y: word.y + Math.random() > 0.5? -20: 20,
	 				angle: fn_rand(-30, 30),
	 				duration : 500,
	 				ease: 'Linear',
	 				yoyo : true,
	 				repeat : 0,
	 				onComplete: function() {
	 					word.angle = 0;
	 				}.bind(this)
	 			});
			}
			return;//does nothing
		}

		var matched = word.chinese == this.promptChinese;			 
		if (matched) {
			if (this.isSoundOn) {
				fn_playSound(this.pickupSound, fn_getBackgroundMusicVolume(), false);
			}

			fn_removeElement(this.activeWords, word);			
			this.liveWords.remove(word, false, false);//remove from the group, but do not remove the scene nor destroy it.

			this.tweens.add({
 				targets : word,
 				//onStart: function () {},
 				//y: word.y + Math.random() > 0.5? -20: 20,
 				angle: 360,
 				alpha: 0,
 				duration : 1000,
 				ease: 'Elastic',
 				yoyo : false,
 				repeat : 0,
 				onComplete: function() {
 					word.setVisible(false);
 					word.alpha = 1;
 				}.bind(this)
 			});
			
			//update score
	        this.score += 15;
	        this.showScore();

	        //adjust word density
	        if (this.score > 200 && this.score < 400) {
	        	if (Math.random() > 0.5) {
	        		this.rowCount = 6;		
	        	} else {
	        		this.rowCount = 8;
	        	}
	        } else if (this.score > 400 && this.score < 600) {
	        	this.rowCount = 8;
	        } else if (this.score > 600) {
	        	this.rowCount = 10;
	        }
	        this.refreshWordGrid(); 	
	        
	        //track the words that have been matched.
	        this.matchedWords.push(this.promptChinese);	
	        if (this.matchedWords.length > 24) {
	        	this.matchedWords.shift();//remove the oldest one
	        }	  
	        
		  	//reset 
		  	this.promptChinese = "";
		  	this.promptPinyin = "";

		  	//hide the old prompt label
		  	this.promptLabel.setVisible(false);
		  	
		  	//adjust game speed
			var difficultyLevel = parseInt(fn_getDifficultyLevel());		
			switch(difficultyLevel) {		
				case 0:
					this.gameSpeed -= 2;
					break;
				case 1:
					this.gameSpeed -= 4;
					break;
				case 2:
					 this.gameSpeed -= 6;
					break;						
			}
			
			//if we have any invisible(dead) heart, restore the first one
			for(var i = 0; i < this.life.length; i++) {
				if (!this.life[i].visible) {
					this.life[i].visible = true;
				  	//back to blue state after 3 correct answers in a row. 
				  	eater.clearTint();			  	
					break;
				}
			}
			
			//prompt next word
			this.promptNextWord();
		} else {		
			fn_removeElement(this.activeWords, word);
			word.setVisible(false);
			this.liveWords.remove(word, false, false);//remove from the group, but do not remove the scene nor destroy it.
			
			eater.setTint(0xFF0000);
			
			//dying sound
			if (this.isSoundOn) {
				fn_playSound(this.dyingSound, fn_getBackgroundMusicVolume()*0.8, false);
			}

			//from the right to the left, mark a visible heart invisible
			for(var i = this.life.length - 1; i >= 0; i--) {
				if (this.life[i].visible) {
					this.life[i].visible = false;
					break;
				}
			}
			
			//check if we have any more visible heart remaining
			var hasVisibleHeart = false;
			for(var k = 0; k < this.life.length; k++) {
				if (this.life[k].visible) {
					hasVisibleHeart = true;
					break;
				}
			}
            if (!hasVisibleHeart) {//no more life
        		// navigate to the game over screen after 1000 milliseconds delay
        		this.time.delayedCall(1000, this.navigateToGameOverScene,
        				[], this);
            }			
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
	
	scene.navigateToGameOverScene = function() {
		this.finalScore = this.score;
		
		if (this.isSoundOn) {
			scene.music.pause();// stop background music
		}		
		scene.scene.stop(wordEater.getGameSceneOneId());
		scene.scene.stop(wordEater.getGameGlassId());
		scene.scene.start(wordEater.getGameOverId());				
    }.bind(scene);
        
	return scene;
})();
