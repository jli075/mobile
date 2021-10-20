//the first play scene of this game. This scene runs after the title scene.
 balloonPop.gameScene1 = (function() {		    
	var scene = fn_createScene(balloonPop.getGameSceneOneId());
	
	// NOTE, this init method will be called by the framework first.It is called
	// before preload, create and update.
	scene.init = function() {
		this.sceneBackgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		
		this.balloonRImgId = fn_createId();
		this.balloonYImgId = fn_createId();
		
		this.balloonAudioId = fn_createId();
		this.pickupAudioId = fn_createId();
		this.cheerAudioId = fn_createId();
		this.musicId = fn_createId();
		
		this.isSoundOn = balloonPop.isMusicOn();
		this.isMobile = fn_isMobile() || balloonPop.isMobileControlOn();		
		if (this.isMobile) {
			this.joyStickBaseImgId = fn_createId();
			this.joyStickThumbImgId = fn_createId();
		}
		
		//variable for total time
		this.totalTime = 0;	
		
		//variables for calculating progress bar percentage
		this.totalCount = 0;
		this.collectedCount = 0;//done count
		
		//unlike other games, we will run two rounds, front->back and back->front, before we call the game is over
		this.firstRound = true;
		this.readyHandleNextClick = true;
				
		//balloon speed. It becomes faster and faster and the base speed varies, depending on the game difficulty level.
		this.speed = 10;
		var difficultyLevel = parseInt(fn_getDifficultyLevel());		
		switch(difficultyLevel) {		
			case 0:
				this.speed = 10;
				break;
			case 1:
				this.speed = 15;
				break;
			case 2:
				 this.speed = 20;
				break;						
		}

		//balloon starting position
	    this.balloons = [];
	    this.unitWidth = fn_getCanvasWidth()/8;
	    
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
		var backgroundImageURL = balloonPop.getAsset("background.jpg");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.sceneBackgroundImgId, userBackgroundImageURL);
			this.userBackgroundImageUsed = true;
		} else {
			this.load.image(this.sceneBackgroundImgId, backgroundImageURL);
		}		
		
		//button background image
		this.load.image(this.btnBackgroundImgId, this.getAsset("button-bg.png"));
		
		if (this.isMobile) {//mobile only
			this.load.image(this.joyStickBaseImgId, this.getAsset("joystick.png"));
			this.load.image(this.joyStickThumbImgId, this.getAsset("joystickthumb.png"));
		}

		//load 3D camera
		this.load.scenePlugin('Cam3', 'camera.js', 'c3', 'cameras3d');
		 
		//load music
		if (this.isSoundOn) {
			this.loadMusic(this.pickupAudioId, "pickup.mp3");
			this.loadMusic(this.cheerAudioId, "cheer.mp3");
			this.loadMusic(this.balloonAudioId, "balloon.mp3");
			this.loadMusic(this.musicId, "clearday.mp3");
		}
		//load balloon images, one yellow and one red
		this.load.image(this.balloonRImgId, this.getAsset("balloonr.png"));
		this.load.image(this.balloonYImgId, this.getAsset("balloony.png"));
	};
	
	scene.create = function() {
		if (this.isMobile) {
			//create virtual joystick instance
			fn_createJoyStick(this, this.joyStickBaseImgId, this.joyStickThumbImgId);//this.joystick can be referenced later.
		}
		
		//set to full screen. Only works on FireFox and Chrome.
		fn_setToFullScreen(this);		

		var grassBackground = this.add.image(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2, this.sceneBackgroundImgId);
		grassBackground.setDisplaySize(this.sys.canvas.width,
				this.sys.canvas.height);
		grassBackground.setDepth(-99999);	
		
		//best camera y position is 700
	    //this.camera = this.cameras3d.add(80).setPosition(0, -40, 6800).setPixelScale(200);
		this.camera = this.cameras3d.add(80).setPosition(0, 680, 6800).setPixelScale(200);
		
		//fine tune camera position
	    this.camera.y += 180;
	    this.camera.x -= 40;
	    //////////////////////////
	    //allows the user to control view position
		this.cursors = this.input.keyboard.createCursorKeys();		
		                                         
		if (this.isSoundOn) {
			//pick up sound
	        this.pickupSound = this.sound.add(this.pickupAudioId);
	        //cheer sound
	        this.cheerSound = this.sound.add(this.cheerAudioId);
	        
	        //balloon deflat sound
	        this.balloonSound = this.sound.add(this.balloonAudioId);	
	        
	        this.music = fn_loopPlayMusic(this, this.musicId, fn_getBackgroundMusicVolume()*0.75);
		}
        
    	//set up game name, word count, created by
        //and time, progress, etc
        this.setUpGameStatusLabels();
			
		// /////////////////////////////
		// load game data from server for this scene
		//data is loaded after everything has been set.
		fn_loadGameVocabListsByUUID();
	}
	
	scene.update = function() {				
	   //control camera
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
	    
	   if (left){
		   if (this.camera.x > -4000) {
	        this.camera.x -= 36;
		   }
	       //console.log("camera x: " + this.camera.x);
	    } else if (right){
	    	if (this.camera.x < 4000) {
	        	this.camera.x += 36;
	    	}
	        //console.log("camera x: " + this.camera.x);
	    }
	   
	    if (up) {
	    	if (this.camera.y > -2000) {
	    		this.camera.y -= 36;
	    	}
	    	//console.log("camera y: " + this.camera.y);
	    } else if (down) {
	    	if (this.camera.y < 2300) {
	    		this.camera.y += 36;
	    	}
	    	//console.log("camera y: " + this.camera.y);
	    }

		//control balloon move
	    for (var i = 0; i < this.balloons.length; i++)
	    {
	        var balloon = this.balloons[i];

	        balloon.z += this.speed;
	        
	        //a little animation for the popped balloon.
	        if (balloon.poppped) {
	        	balloon.gameObject.angle += Math.random() > 0.5? 15 : -15;
	        	balloon.y -= 100;
	        	if (balloon.gameObject.alpha > 0.1) {
	        		balloon.gameObject.alpha -= 0.02;	
	        	}	        	
	        }
	        
	        if (balloon.z > this.camera.z - 2){
	        	this.resetBalloon(balloon);
	        }
	    }
	    	    
	    this.camera.update();
	}
		
	//
	scene.createFrontText = function() {
		  var chinese = this.chineseArray.shift();
		  var pinyin = this.pinyinArray.shift();
		  var english = this.englishArray.shift();
		  
		  return fn_createFrontText(this, chinese, pinyin, english,78,this.currentMatchType);
	}.bind(scene);
	
	
	scene.createBalloon = function() {
		  var batchSize = fn_getBatchSize();		  
		  //if we don't have more words or the first batch is done, we don't need 
		  //need the balloon release timer anymore. A balloon will be added when a balloon is popped. 
		  if (this.chineseArray.length == 0 || this.balloons.length == batchSize) {
			  this.balloonReleaseTimer.paused = true;
		  }
		  
	  	  //check if we are done
	  	  if (this.chineseArray.length == 0 && this.balloons.length == 0 && !this.firstRound) {
			 //hooray, go to game over
			 this.time.delayedCall(1000, this.navigateToGameOverScene,
					[], this);
			 return;
		  }
	  	  
	  	 //check if it is ready to set the data for the second round
	  	 if (this.firstRound && this.chineseArray.length == 0 && this.balloons.length == 0) {
	  		 //use alternative match type and re-populate the array data
	  		 this.currentMatchType = fn_getAlternativeMatchType(this.currentMatchType);
	  		 this.firstRound = false;
	  		 this.populateDataArray();
	  		 this.balloonReleaseTimer.paused = false;//let time create and release balloons.
	  		 
	  		 return;
		  } 
	  	
	  	  if (this.chineseArray.length > 0) {
			  var frontText = this.createFrontText();
			  var id = fn_createId();		  
			  var textWidth = frontText.getBounds().width;
			  var textHeight = frontText.getBounds().height;
			  		 
			  
			  var balloon = null;
			  if (Math.random() > 0.5) {
				  balloon = this.add.image(0, 0, this.balloonRImgId);
				  var colors = [0x0000FF,0x00FF00, 0xFF0000];
				  if (Math.random() > 0.5) {
					  balloon.setTint(colors[Math.floor(Math.random()*colors.length)]);
				  }
			  } else {
				  balloon = this.add.image(0, 0, this.balloonYImgId);
				  var colors = [0x0000FF,0x00FF00,0x00FFFF,0xFFFF00];
				  if (Math.random() > 0.5) {
					  balloon.setTint(colors[Math.floor(Math.random()*colors.length)]);
				  }				  
			  }
			  
			  var balloonWidth = balloon.getBounds().width ;
			  var balloonHeight = balloon.getBounds().height;
			  
			  var totalWidth = textWidth > balloonWidth? textWidth : balloonWidth;
			  var totalHeight = balloonHeight + textHeight;
				  
			  var renderTexture = this.add.renderTexture(0, 0, totalWidth*1.2, totalHeight*1.2);
			  //draw Balloon first
			  renderTexture.draw(balloon, totalWidth/2, balloonHeight/2);
			  
			  //renderTexture.draw(frontText, totalWidth/2, balloonHeight-textHeight/2);
			  renderTexture.draw(frontText, totalWidth/2, balloonHeight + textHeight/2- 40);
			  
			  renderTexture.saveTexture(id);
			  
			  balloon.destroy();
			  renderTexture.destroy();
				  
			  var xPosition = this.getBalloonX();
			 
			  var yPosition = -60;//fixed;
			 
			  var zPosition = this.getBalloonZ();
			  
			  var balloonText = this.camera.create(xPosition, yPosition, zPosition, id);
			
			  balloonText.gameObject.setInteractive({useHandCursor: true}).on('pointerover', function(){
				 balloonText.gameObject.setTint("0xFF0000");
			   }, this);
		
			  balloonText.gameObject.on('pointerout', function(){
				 balloonText.gameObject.clearTint();
			  }, this);
		
			  balloonText.gameObject.on('pointerup', function(){
				    //only effective after the system is ready to handle next click
				    if(this.readyHandleNextClick) {
				    	this.readyHandleNextClick = false;
					 	this.checkCorrect(balloonText);
					 	
						//timer won't start until the user started click a ballon
						if (!!!this.gameTimer) {
							//create the timer. Called only once after starting drag-n-drop
							this.gameTimer = this.time.addEvent({
									delay : 100,
									callback : this.updateTime,
									callbackScope : this,
									loop : true
							});			
						}				    	
				    }
			   }, this);
		
			   balloonText.chinese = frontText.chinese;
			   balloonText.pinyin = frontText.pinyin;
			   balloonText.backText = frontText.backText;		   
			   frontText.destroy();
			   
			   //add to the list
			   this.balloons.push(balloonText);	
			   
			   //show the balloon with effect
			   this.resetBalloon(balloonText);
	  	  }
		  
	  	  
	  	 if (this.promptChinese.length == 0) {
	  	  	 this.promptNextWord();
	  	  }
	}.bind(scene);
	

	scene.resetBalloon = function(balloon) {
	  	balloon.x = this.getBalloonX();
        balloon.z = this.getBalloonZ();	            
        balloon.gameObject.alpha = 0.1;	            
        this.tweens.add({
			targets : balloon.gameObject,
			alpha : 1,
			duration : 1000,
			yoyo : false,
			repeat : 0
		});					
	}.bind(scene);
	
	scene.getBalloonX = function() {
		return Math.random() > 0.5? fn_rand(-16, -6)*this.unitWidth: fn_rand(6, 16)*this.unitWidth;;
	}.bind(scene);
	
	scene.getBalloonZ = function() {
		return -6000 - Math.random()*4000; 
	}.bind(scene);

    ///////////////////////////////////////////////////////////////////////////	
	scene.getAsset = function(name) {
		return balloonPop.getAsset(name);
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
		scene.scene.pause(balloonPop.getGameSceneOneId());
		scene.scene.wake(balloonPop.getGameGlassId());		
		scene.scene.moveAbove(balloonPop.getGameSceneOneId(), balloonPop.getGameGlassId());
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
		
		//set the total match count, including both regular and alternative match
		this.totalCount = this.chineseArray.length + this.chineseArray.length;
		
		//update the list title text
		this.updateListName(displayName);
		
		//update the word count text
		this.wordCountText.setText("Word Count: " + this.chineseArray.length);
		this.wordCountText.x = this.sys.canvas.width - this.wordCountText.getBounds().width - 20;	
		
		//shuffle our raw data first.
		this.shuffleChinesePinyinEnglishImgArrays();
		//done randomizing
		
		//create the timer. Called only once
		var releseInterval = 1000;
		var difficultyLevel = parseInt(fn_getDifficultyLevel());		
		switch(difficultyLevel) {		
			case 0:
				releseInterval = 3000;
				break;
			case 1:
				releseInterval = 1500;
				break;
			case 2:
				releseInterval = 1000;
				break;						
		}
		
		this.balloonReleaseTimer = this.time.addEvent({
				delay : releseInterval,
				callback : this.createBalloon,
				callbackScope : this,
				loop : true
		});				    
	}.bind(scene);

	scene.promptNextWord = function() {		
		//check if we are done.
		if (this.chineseArray.length == 0 && this.balloons.length == 0 && !this.firstRound) {
			//hooray, go to game over
			this.time.delayedCall(1000, this.navigateToGameOverScene,
					[], this);
			return;
		}
		if (this.balloons.length == 0) {//no word to prompt.
			return;
		}
		
		//we have balloons. Randomly pick one of the flying ballons
		var balloonIndex = Math.floor(Math.random()*this.balloons.length);

		var balloon = this.balloons[balloonIndex];
				
		this.promptChinese = balloon.chinese;
		
		//console.log("ballooln chinese: " + balloon.chinese);		
		var backText = balloon.backText;		
		backText.setInteractive({useHandCursor: true}).on('pointerup', function() {
			if (this.isSoundOn) {
				fn_playWordSound(this.promptChinese,this.promptPinyin );
			}
		}, this).on('pointerover', function(){backText.setStyle({fill : fn_getGameTextColor()});backText.scale=1.05;}, this).on('pointerout', function(){backText.setStyle({fill : fn_getGameVisitedTextColor()});backText.scale=1;}, this);		
				
		//show the prompt text						
		backText.setDepth(-66666);
		fn_centerObject(this, backText, -4);
		
		backText.setVisible(true);
		backText.alpha = 0.1;	            
        this.tweens.add({
			targets : backText,
			alpha : 1,
			duration : 1000,
			yoyo : false,
			repeat : 0
		});					
		this.promptLabel = backText;		
	}.bind(scene);
	
	scene.shuffleChinesePinyinEnglishImgArrays = function() {
		var arrayOfArray = fn_syncShuffle([this.chineseArray, this.pinyinArray, this.englishArray, this.imgURLArray]);
		
		this.chineseArray = arrayOfArray[0];
		this.pinyinArray = arrayOfArray[1];
		this.englishArray = arrayOfArray[2];		
		this.imgURLArray = arrayOfArray[3];
	}.bind(scene);

	scene.proessMatch = function(balloonText) {
		//we have match! remove this ballon and clean it up from memeory
	  	fn_removeElement(this.balloons, balloonText);
	  	this.camera.remove(balloonText);			  	
	  	balloonText.gameObject.destroy();
	  	balloonText.destroy();
	
	  	//reset 
	  	this.promptChinese = "";
	  	this.promptPinyin = "";
	  	
	  	//remove the old prompt label
	  	fn_destroy(this.promptLabel);
	  		  	
		//update progess			
		this.collectedCount += 1;
		this.updateProgress();
		
		
		var difficultyLevel = parseInt(fn_getDifficultyLevel());
		switch(difficultyLevel) {
			case 0:
				if (this.speed < 15) {this.speed += 0.1;}
				break;
			case 1:
				if (this.speed < 20) {this.speed += 0.2;}
				break;
			case 2:
				if (this.speed < 30) {this.speed += 0.25;}
				break;
		}
		//adjust the speed too
		
		this.readyHandleNextClick = true;
		
		//check if we have more Chinese words and prompt the next word.
		this.createBalloon();		
	}.bind(scene);
	
	scene.checkCorrect = function(balloonText) {
		if (this.promptChinese == balloonText.chinese) {
		  	//play balloon air out sound
			if (this.isSoundOn) {
				fn_playSound(this.balloonSound, fn_getBackgroundMusicVolume(), false);
			}

			balloonText.poppped = true;
			
			this.time.delayedCall(1500, this.proessMatch,
						[balloonText], this);
		} else {
			if (this.isSoundOn) {
				fn_playSound(this.pickupSound, fn_getBackgroundMusicVolume(), false);
			}
			this.readyHandleNextClick = true;
			this.tweens.add({
 				targets : balloonText,
 				//onStart: function () {},
 				x: balloonText.x + Math.random() > 0.5? 10: -10,
 				y: balloonText.y + Math.random() > 0.5? 10: -10,
 				//angle: angle,
 				duration : 2000,
 				ease: 'Linear',
 				yoyo : true,
 				repeat : 0,
 				onComplete: function() {
 					
 				}.bind(this)
 			});
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
		if (this.totalCount > 0) {
			var pct =  this.collectedCount/this.totalCount;
			fn_updateProgressBar(this,pct);//1% as the starting point
		}
	}.bind(scene);
		
	

	scene.navigateToGameOverScene = function() {
		//do not submit time if the user clicked the Stop button to abort the game
		//if we have more Chinese words or balloons, do not record time.
		if (this.chineseArray.length > 0 || this.balloons.length > 0) {
			this.totalTime = 0;
		} else {
			if (this.isSoundOn) {
				fn_playSound(this.cheerSound, fn_getBackgroundMusicVolume(), false);
			}
		}
		if (this.isSoundOn) {
			scene.music.pause();// stop background music
		}
		scene.scene.stop(balloonPop.getGameSceneOneId());
		scene.scene.stop(balloonPop.getGameGlassId());
		scene.scene.start(balloonPop.getGameOverId());				
    }.bind(scene);
        
	return scene;
})();
