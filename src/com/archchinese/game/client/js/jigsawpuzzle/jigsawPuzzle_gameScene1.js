//the first play scene of this game. This scene runs after the title scene.
 jigsawPuzzle.gameScene1 = (function() {		
	var scene = fn_createScene(jigsawPuzzle.getGameSceneOneId());
	// NOTE, this init method will be called by the framework first.It is called
	// before preload, create and update.
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.defaultBackgroundImgId = fn_createId();
		this.defaultPuzzleImgId = fn_createId();		
		this.btnBackgroundImgId = fn_createId();
		this.pickupAudioId = fn_createId();
		this.cheerAudioId = fn_createId();
		this.checkMarkId = fn_createId();
		
		//the following two variables are used to track progress.
		//this variable is used to track the finished/correct tile count 
		this.doneTileCount = 0; 
		this.totalTileCount = 0;
		this.tilesLastRound = [];//used to clear up the tiles so that a new word can be created.
		//////////////////////
		this.isSoundOn = jigsawPuzzle.isMusicOn();
		this.isPuzzleBackgroundOn = jigsawPuzzle.isPuzzleBgOn();
		
		//used to differentiate click and drag.
		this.clickDowntime = 0;
		
		//variable for total time
		this.totalTime = 0;	
				
		//tiles ready handled flag;
		this.tilesReadyHandled = true;
		
		//current Chinese and Pinyin. used to play the audio of this word.
		this.currentWord = "";
		this.currentPinyin = "";
		this.currentEnglish = "";
		this.currentImgURL = "";
		this.characterIndex = 0;//which character of the current word is currently on the board
	}
	
	scene.preload = function() {
		//load images
		var backgroundImageURL = jigsawPuzzle.getAsset("background.png");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);
			this.userBackgroundImageUsed = true;
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}		
		
		//note, unlike other games, this game scene1 always use the default background image as the desktop image
		this.load.image(this.defaultBackgroundImgId, backgroundImageURL);
				
		this.load.image(this.btnBackgroundImgId, this.getAsset("button-bg.png"));
		this.load.image(this.checkMarkId, this.getAsset("checkmark.png"));
		this.load.image(this.defaultPuzzleImgId, this.getAsset("flower.png"));
				
		//load music
		if (this.isSoundOn) {
			this.loadMusic(this.pickupAudioId, "pickup.mp3");
			this.loadMusic(this.cheerAudioId, "cheer.mp3");
		}
	}
		
	scene.create = function() {
		//delaying launching full screen until tiles are ready.!!

		//for this game, always use the default background image as the desktop background of the scene1.		
		fn_createTileSprite(this, this.defaultBackgroundImgId);//always use default.
                                     
		if (this.isSoundOn) {
			//pick up sound
	        this.pickupSound = this.sound.add(this.pickupAudioId);
	        //cheer sound
	        this.cheerSound = this.sound.add(this.cheerAudioId);
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
	}
	
    ///////////////////////////////////////////////////////////////////////////	
	scene.getAsset = function(name) {
		return jigsawPuzzle.getAsset(name);
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
		scene.scene.pause(jigsawPuzzle.getGameSceneOneId());
		scene.scene.wake(jigsawPuzzle.getGameGlassId());		
		scene.scene.moveAbove(jigsawPuzzle.getGameSceneOneId(), jigsawPuzzle.getGameGlassId());	
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
		
		//update the list title text
		this.updateListName(displayName);
		
		//set only once by this setGameVocabLists function. It is used to calculate progress percentage only!!
		this.totalTileCount = this.calcTotalTileCount();
		
		//update the word count text
		this.wordCountText.setText("Word Count: " + this.chineseArray.length);
		this.wordCountText.x = this.sys.canvas.width - this.wordCountText.getBounds().width - 20;	
		
		//shuffle our raw data first.
		this.shuffleChinesePinyinEnglishImgArrays();
		//done randomizing
		
		//present the puzzle and the user start to resolve it. The entire game finishes when all the jigsaw puzzles for each entry is done.
		if (this.gameTimer) {
			this.gameTimer.paused = true;
		}
		
	    //a new word, reset it the current and the character index points to the first charactrer of the word.
	    this.currentWord = this.chineseArray.shift();
	    this.currentPinyin = this.pinyinArray.shift();
	    this.currentEnglish = this.englishArray.shift();
	    this.currentImgURL = fn_getSecImgURL(this.imgURLArray.shift(), "480");
	    this.characterIndex = 0;
	    
		this.setAndPlayPuzzle();				
	}.bind(scene);

	scene.calcTotalTileCount = function() {
		var totalCount = 0;
		var colCount = this.getSquareCount();
		var tileCountPerChar = colCount*colCount;
		for(var i = 0; i < this.chineseArray.length; i++) {
			totalCount += tileCountPerChar * this.chineseArray[i].length;
		}
		return totalCount;		
	}.bind(scene);
	
	scene.shuffleChinesePinyinEnglishImgArrays = function() {
		var arrayOfArray = fn_syncShuffle([this.chineseArray, this.pinyinArray, this.englishArray, this.imgURLArray]);
		
		this.chineseArray = arrayOfArray[0];
		this.pinyinArray = arrayOfArray[1];
		this.englishArray = arrayOfArray[2];		
		this.imgURLArray = arrayOfArray[3];
	}.bind(scene);

	//note this method will be called multiple times. Once for each entry
	scene.setAndPlayPuzzle = function() {
		//clean up game objects created by last character
		var width = fn_getCanvasWidth();
		var height = fn_getCanvasHeight();
		var size = width > height ? height : width;
		var marginTop = size*0.01;
		var marginBottom = size*0.01;
		
		this.puzzleSize = size - marginTop - marginBottom;
		var colCount = this.getSquareCount();
		var rowCount = colCount;
		
		this.tileWidth = Math.floor(this.puzzleSize/colCount);
	    this.tileHeight = Math.floor(this.puzzleSize/rowCount);
	    
	    var offsetX = (fn_getCanvasWidth() - this.puzzleSize)/2; 
	    var offsetY = (fn_getCanvasHeight() - this.puzzleSize)/2;

	    
	    if (!!!this.graphics) {
	    	this.graphics = this.add.graphics(0, 0);//graphics instance
	    }	    
		this.graphics.clear();	    
		this.graphics.fillStyle = '#CCCCCC';		
		this.graphics.fillRect(offsetX, offsetY, this.puzzleSize, this.puzzleSize);
				
		//draw Chinese on top of the background image
		fn_destroy(this.chineseText);
		this.chineseText = this.add.text(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2, ""+ this.currentWord.charAt(this.characterIndex), {
			fontFamily : fn_getChineseFont(),
			fontSize : 480,//NOTE. THE FONT SIZE CANNOT BE TOO BIG. IT WILL CAUSE ISSUES FOR Safari browser (iOS devices)
			color : fn_getGameTextColor(),
			align: "center"
		}).setOrigin(0.5);					
		this.chineseText.scale = 0.95*this.puzzleSize/this.chineseText.getBounds().width; //resize the text to the puzzle size.
		
			
		//add the background image, if it is enabled, on the top of the texture drawing.
		if (this.isPuzzleBackgroundOn) {
			if (this.currentImgURL != null && this.currentImgURL.length > 10) {//img url from google cloud is very long. it has at least 10 characters.
				//we have character specific image, load it
			    //dynamically image l
			    //this.load.setPath(this.currentImgURL);
		        this.load.on('filecomplete', this.handleCharImgLoaded, this);
		        //  It needs _something_ in the queue, or `start` will just exit immediately.
		        this.load.image(fn_createId(), this.currentImgURL);//use chinese as the key
		        this.load.start();	  
			} else {			
				//the user did not specify a character specific image, 
				//1. try use the user provided game background image
				//2. if no user game background image either, use flower background
			    var puzzleImgId = this.defaultPuzzleImgId;
			    if (this.userBackgroundImageUsed) {
			    	puzzleImgId = this.backgroundImgId;
			    }
			    
			    if (this.puzzleBgImg) {
					this.children.bringToTop(this.puzzleBgImg);
					this.puzzleBgImg.alpha = 0.4;//make it visible again.
			    } else {
					this.puzzleBgImg = this.add.image(fn_getCanvasWidth() / 2, fn_getCanvasHeight() / 2, puzzleImgId);		
					this.puzzleBgImg.setAlpha(0.4);//lighten background image		
					this.puzzleBgImg.setDisplaySize(this.puzzleSize, this.puzzleSize);
			    }
			    
				this.handleCharacterBackgroundImageReady(puzzleImgId);
			}
		} else {
			//no puzzle background image
			this.handleCharacterBackgroundImageReady(null);
		}
	}.bind(scene);
		
	scene.handleCharImgLoaded = function(imageKey, type, texture) {
		//type here is image. user image is ready
    	fn_destroy(this.puzzleBgImg);//always clean the old character specific image first.
    	
		this.puzzleBgImg = this.add.image(fn_getCanvasWidth() / 2, fn_getCanvasHeight() / 2, imageKey);		
		this.puzzleBgImg.setAlpha(0.4);//lighten background image		
		this.puzzleBgImg.setDisplaySize(this.puzzleSize, this.puzzleSize);
		
		this.handleCharacterBackgroundImageReady(imageKey);			
	}.bind(scene);
	
	scene.handleCharacterBackgroundImageReady = function(puzzleImgId) {	    
		var colCount = this.getSquareCount();
		var rowCount = colCount;
		
	    var offsetX = (fn_getCanvasWidth() - this.puzzleSize)/2; 
	    var offsetY = (fn_getCanvasHeight() - this.puzzleSize)/2;
	    
		this.puzzlePieces = [];
		
		this.tileLocations = [];		
		//slice the game board and store the tile locations into an array
	    for (var i = 0; i < rowCount;i++) {
	        for (var j = 0; j < colCount;j++) {
	        	var x = offsetX+j*this.tileWidth;
	        	var y = offsetY+i*this.tileHeight;
	        	var location = fn_point(x,y);
	        	this.tileLocations.push(location);
	  		}
	  	}
	    
	    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
	    //create preview image, small Chinese characters, word detail display on the lower left corner of the screen
	    var sideSpaceWidth = (fn_getCanvasWidth() - this.puzzleSize)/2;
	    
	    //draw solid color background for the small hint character 
		this.graphics.fillStyle = '#CCCCCC';		
		this.graphics.fillRect(0, fn_getCanvasHeight()/2 - sideSpaceWidth/2, sideSpaceWidth, sideSpaceWidth);
	    //use the same background image of the big character
		if (this.isPuzzleBackgroundOn) {//character specific.
		    fn_destroy(this.previewImg);
		    this.previewImg = this.add.image(sideSpaceWidth/2, fn_getCanvasHeight() / 2, puzzleImgId);	    
		    this.previewImg.setAlpha(0.4);//lighten background image		
		    this.previewImg.setDisplaySize(sideSpaceWidth, sideSpaceWidth);
		}
	    //show small preview chinese character
	    if (this.previewChineseText) {
	    	this.children.bringToTop(this.previewChineseText);
	    	this.previewChineseText.text = this.currentWord.charAt(this.characterIndex);
	    } else {	    
		    this.previewChineseText = this.add.text(sideSpaceWidth/2, fn_getCanvasHeight() / 2, ""+ this.currentWord.charAt(this.characterIndex) , {
				fontFamily : fn_getChineseFont(),
				fontSize : 980*sideSpaceWidth/this.puzzleSize,
				color : fn_getGameTextColor,
				align: "center"
			}).setOrigin(0.5);
	    }
	    
	    if (!!!this.previewPinyinText) {//note that we are reusing the char pinyin, word pinyin, word, and english text objects.
	    	
	    	//show Pinyin on top of the hint character
		    var charPinyin = fn_processPinyin(fn_getCharPinyin(this.currentPinyin, this.characterIndex));
		    this.previewPinyinText = this.add.text(sideSpaceWidth/2, fn_getCanvasHeight() / 2 - sideSpaceWidth*.6, charPinyin, {
				fontFamily : fn_getPinyinFont(),
				fontSize : 68,
				color : fn_getGameTextColor(),
				align: "center"
			}).setOrigin(0.5);
		    this.previewPinyinText.setInteractive({useHandCursor: true}).on('pointerup', function() {
			    if (this.isSoundOn) {
					var chinese = this.currentWord.charAt(this.characterIndex);
					var pinyin = fn_getCharPinyin(this.currentPinyin, this.characterIndex);			
					fn_playWordSound(chinese,pinyin);//play mom's voice of this word
			    }
			}, this).on('pointerover', function(){this.previewPinyinText.setStyle({fill : fn_getGameVisitedTextColor()});}, this).on('pointerout', function(){this.previewPinyinText.setStyle({fill : fn_getGameTextColor()});}, this);
		    
		    //show Word Pinyin
		    var wordPinyin = fn_processPinyin(this.currentPinyin);
		    this.wordPinyinText = this.add.text(sideSpaceWidth/2, fn_getCanvasHeight() / 2 + sideSpaceWidth*.7, wordPinyin, {
				fontFamily : fn_getPinyinFont(),
				fontSize : 48,
				color : fn_getGameVisitedTextColor(),
				align: "center",
				wordWrap: { width: sideSpaceWidth, useAdvancedWrap: true }
			}).setOrigin(0.5);
		    this.wordPinyinText.setInteractive({useHandCursor: true}).on('pointerup', function() {
			    if (this.isSoundOn) {
					var chinese = this.currentWord;
					var pinyin = this.currentPinyin;			
					fn_playWordSound(chinese,pinyin);//play mom's voice of this word
			    }
			}, this).on('pointerover', function(){this.wordPinyinText.setStyle({fill : fn_getGameTextColor()});}, this).on('pointerout', function(){this.wordPinyinText.setStyle({fill : fn_getGameVisitedTextColor()});}, this);
		    
		    //show the Chinese word
		    this.wordChineseText = this.add.text(sideSpaceWidth/2, fn_getCanvasHeight() / 2 + sideSpaceWidth*0.9, this.currentWord, {
				fontFamily : fn_getChineseFont(),
				fontSize : 78,
				color : fn_getGameVisitedTextColor(),
				align: "center",
				wordWrap: { width: sideSpaceWidth, useAdvancedWrap: true }
			}).setOrigin(0.5);
	
		    //show the English of the Word
		    this.wordEnglishText = this.add.text(sideSpaceWidth/2, fn_getCanvasHeight() / 2 + sideSpaceWidth*1.05, this.currentEnglish, {
				fontFamily : fn_getEnglishFont(),
				fontSize : 32,
				color : fn_getGameVisitedTextColor(),
				align: "center",
				wordWrap: { width: sideSpaceWidth, useAdvancedWrap: true }
			}).setOrigin(0.5);
	    }
	    //one at a time, take a position from the beginning of the location array
	    //and create an image object for the tile. The operation is chained together
	    //because the snapshot taking (image extract) process is a sync process.
	    //when all tiles are ready, handleTilesReady function will be called.
	    
	    //make sure the Chinese character showing on the top on iOS devices.
		this.children.bringToTop(this.chineseText);
		
		//now we have finished handling a new tile. relesae the lock flag this.tilesReadyHandled
		//so next tile can use this method.
		this.tilesReadyHandled = false;
		this.createTiles();		
	}.bind(scene);
	
	
	scene.handleTilesReady = function() { 
		if (this.tilesReadyHandled) {//make sure this method is called only once for each character.
			return;
		}
		
		this.tilesReadyHandled = true;
		//draw hint grids
		var colCount = this.getSquareCount();
		var rowCount = colCount;
		
		//draw puzzle grid on top of Chinese character
	    var offsetX = (fn_getCanvasWidth() - this.puzzleSize)/2; 
	    var offsetY = (fn_getCanvasHeight() - this.puzzleSize)/2;
		this.graphics = this.add.graphics(0, 0);//graphics instance	    
		this.graphics.strokeStyle = '#ffffff';		
		for (var i = 0; i < rowCount;i++) {
	        for (var j = 0; j < colCount;j++) {
	        	var x = j*this.tileWidth;
	        	var y = i*this.tileHeight;
	        	this.graphics.strokeRect(offsetX+x, offsetY+y, this.tileWidth, this.tileHeight);
	  		}
	  	}
		
	    //start to hide the background image and Chinese character
		// use a yoyo animation for fun when the container is dropping to the
		// ground. Use 8 seconds duration. They will be destroyed when next character is ready
		//see handleCharacterBackgroundImageReady()		
		fn_phaseOut(this,this.chineseText, 7000);
		if (this.isPuzzleBackgroundOn) {
			fn_phaseOut(this,this.puzzleBgImg, 7000);
		}
	    		
		//build puzzle piece pile. We simulate peel the pieces from the board and 
		//stack them on the right side of the board.
	    var pieceCount = this.puzzlePieces.length;	    
	    //for 2X2, 3X3 and 4X4, the following same pileYStep works well. It is the gap of between puzzle pieces.
	    var pileYStep = this.tileWidth/8;
        var sideSpaceWidth = (fn_getCanvasWidth() - this.puzzleSize)/2;        
	    for(var i = 0; i < pieceCount; i++) {
	    	var piece = this.puzzlePieces[i];
	    	
	    	//initial location of the piece
	    	piece.x = piece.location.x + this.tileWidth;
	    	piece.y = piece.location.y + this.tileHeight;

	    	//make piece draggable and clickable
	    	this.setPieceInteractive(piece)	    		    	
	    	
	    	//move the piece
	    	piece.setVisible(true);
	    	var angle = fn_rand(0,360);//randomly rotate the piece	    	
            //puzzle pieces are placed on the left and right sides of the screen, not not overlapped with the center puzzle working area	                        
            var x = this.puzzleSize + sideSpaceWidth + sideSpaceWidth/2 + fn_rand(-20, 20);
            var y = 200 + this.tileWidth/2 + pileYStep*i;            
            fn_easeRotate(this, piece, x, y, angle, 3000);
            
            //color the piece into random color so that they can be easily see in the pile.
	    	piece.setTint(Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff, Math.random() * 0xffffff);
	    	
	    	//shuffle the pieces in the pile
			this.children.bringToTop(this.puzzlePieces[fn_rand(0,pieceCount-1)]);
	    }	    	    
	    //done building the puzzle piece pile. 
	    
	    //everything is ready now. we can start full screen
		//set to full screen. Only works on FireFox and Chrome.
	    scene.time.delayedCall(1000, fn_setToFullScreen, [this], this);
	}.bind(scene);
	

	scene.createTiles = function() {
		if (this.tileLocations.length > 0) {
			var location = this.tileLocations.shift();
			var textureManager = this.textures;
			jigsawPuzzle.gameMaster.game.renderer.snapshotArea(location.x, location.y, this.tileWidth, this.tileHeight, function(image){
	            //document.body.appendChild(image);
        		var textureKey = fn_createId();
        		//remove it if the texture key is in use
//	            if (textureManager.exists(textureKey)) {
//	                textureManager.remove(textureKey);
//	            }	            
	            textureManager.addImage(textureKey, image);	            	            
	            var puzzlePiece = scene.add.image(0, 0, textureKey);
	            puzzlePiece.setVisible(false);
	            puzzlePiece.location = location;
	            	            
	            scene.tilesLastRound.push(puzzlePiece);
	            scene.puzzlePieces.push(puzzlePiece);
	            	            
	            //Note Snapshots work by creating an Image object from the canvas data, 
	            //this is a blocking process, which gets more expensive the larger the canvas size gets
	            scene.time.delayedCall(50, scene.createTiles, [], scene);
	        });
		} else {
			this.handleTilesReady();
		}		 
	}.bind(scene);	
	
	scene.getSquareCount = function() {
		var difficultyLevel = parseInt(fn_getDifficultyLevel());
		switch(difficultyLevel) {
			case 0: //2 X 2
				return 2;
			case 1: //3 X 3
				return 3;
			case 2: //4 X 4
				return 4;						
		}
	}
	
	scene.checkCorrect = function(piece) {
		var offsetX = (fn_getCanvasWidth() - this.puzzleSize)/2; 
	    var offsetY = (fn_getCanvasHeight() - this.puzzleSize)/2;
	    
//	    console.log("center.x: " + (piece.x - this.tileWidth/2));
//	    console.log("center.y: " + (piece.y - this.tileHeight/2));
//	    
//	    console.log("location.x: " + piece.location.x);
//	    console.log("location.y: " + piece.location.y);
	    
	    var sideSpaceWidth = (fn_getCanvasWidth() - this.puzzleSize)/2;	    
	    var angleOK = true;
	    if (piece.angle) {
	    	angleOK = (piece.angle%360 == 0); 
	    }
	    var expectedCenterX = piece.location.x + this.tileWidth/2;
	    var expectedCenterY = piece.location.y + this.tileHeight/2;
	    var distanceOK = (Math.abs(piece.x - expectedCenterX) < this.tileWidth/4) 
	    	&& (Math.abs(piece.y - expectedCenterY) < this.tileHeight/4);

 		if (angleOK && distanceOK) {
 			//we have a match, set the tile in place and a
 			piece.removeInteractive();
 			fn_easeMove(this,piece,expectedCenterX, expectedCenterY, function(){});
 			
 			//remove the piece from the puzzle pieces arrray 
 			fn_removeElement(this.puzzlePieces, piece);
 			
 			//increment 1 for done tile count
 			this.doneTileCount += 1; 			
 			
			//update the progress
			this.updateProgress();

 			if (this.puzzlePieces.length == 0) {
 				//we finished this character, play cheer up sound
 				//play cheer music 			
 				if (this.isSoundOn) {
 					fn_playSound(this.cheerSound, fn_getBackgroundMusicVolume(), false);
 				}
 				
 				//stop timer between characters until the user start drag the puzzle piece again.
 				this.gameTimer.paused = true;
 				
 				//add a big green check mark on the center of the screen
 				if (this.greenCheckMark) {
 					this.greenCheckMark.setVisible(true);
 				} else {
	 				this.greenCheckMark = this.add.image(0, 0, this.checkMarkId);
	 				this.greenCheckMark.scale = 2;
	 				fn_centerObject(this, this.greenCheckMark, 0); 	
	 				this.greenCheckMark.x = this.puzzleSize + sideSpaceWidth + sideSpaceWidth/2;
 				}
 				//move onto the next word.
 				//proceed to the next word. If we have no more words, the system will navigate to the game over screen.
 				this.time.delayedCall(2000, this.refreshBoardWithNewChinese, [], this);
 			} else {
 				if (this.isSoundOn) {
 					fn_playSound(this.pickupSound, fn_getBackgroundMusicVolume(), false);
 				}
 			}
 		} 	
	}.bind(scene);
	
	scene.refreshBoardWithNewChinese = function() {
		//first check if we have remaining characters in  current word
		if (this.characterIndex == this.currentWord.length -1) {
			//we have finished the characters in the current word. 
			if (this.chineseArray.length == 0) {
				//game over
				this.navigateToGameOverScene();
				return;
			} else {
				//next word
				this.currentWord = this.chineseArray.shift();
				this.currentPinyin = this.pinyinArray.shift();
				this.currentEnglish = this.englishArray.shift();
				this.currentImgURL = fn_getSecImgURL(this.imgURLArray.shift(), "480");				
				this.characterIndex = 0;
			}
		} else {
			//more characters need to be done
			this.characterIndex += 1;			
		}
						
		//destroy tile/pieces first 
		for(var i = 0; i < this.tilesLastRound.length; i++) {
			this.tilesLastRound[i].destroy();
		}
		
		//hide green check mark
		this.greenCheckMark.setVisible(false);
	
		//reset preview character and the big character for create puzzle pieces.
		var newChineseCharacter = "" + this.currentWord.charAt(this.characterIndex);

		//reset preview char Pinyin 
	    this.previewPinyinText.text = fn_processPinyin(fn_getCharPinyin(this.currentPinyin, this.characterIndex));  		
	    //reset word Pinyin
	    this.wordPinyinText.text = fn_processPinyin(this.currentPinyin); 	    
	    this.wordChineseText.text = this.currentWord;
	    this.wordEnglishText.text = this.currentEnglish;
	    
	    //ready for load image of the character.
	    this.setAndPlayPuzzle();
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
		if (this.totalTileCount > 0) {
			var pct =  this.doneTileCount/this.totalTileCount;
			fn_updateProgressBar(this,pct);//1% as the starting point
		}
	}.bind(scene);
		
	
	scene.setPieceInteractive = function(piece) {
		piece.setInteractive({useHandCursor: true, draggable: true})
		.on('dragstart', function (pointer, dragX, dragY) {
			//piece.setTint("#FF00FF");
			piece.alpha = 0.8;
			this.children.bringToTop(piece);
			
			//timer won't start until the user started drag and drop
			if (!!!this.gameTimer) {
				//create the timer. Called only once after starting drag-n-drop
				this.gameTimer = this.time.addEvent({
						delay : 100,
						callback : this.updateTime,
						callbackScope : this,
						loop : true
				});			
			} else {
				this.gameTimer.paused = false;
			}
         }, this)		
		.on('drag', function (pointer, dragX, dragY) {
			piece.setTint("0xFF0000");
			piece.setPosition(dragX, dragY);
         }).on('dragend', function (pointer, dragX, dragY) {
        	 piece.clearTint();
        	 piece.alpha = 1;
    		 //drag released
        	 this.checkCorrect(piece);        		 
         },this)
         .on('pointerdown', function(){
        	 piece.clearTint();
        	 piece.alpha = 1;
             this.clickDowntime = new Date().getTime();
         }, this)
         .on('pointerup', function(){
        	 piece.clearTint();
        	 piece.alpha = 1;        	
        	 if (new Date().getTime() - this.clickDowntime < 350) {//just cicked
                 //handle double click here
                 piece.angle = 90 + Math.ceil(piece.angle/90)*90;        		 
        	 } else {
        	 }
         }, this)
        .on('pointerover', function(){
        	piece.alpha = 0.8;
        }, this)
		.on('pointerout', function(){
			piece.alpha = 1;
		}, this);		
	}.bind(scene);
	
	scene.navigateToGameOverScene = function() {
		//do not submit time if the user clicked the Stop button to abort the game
		if (this.doneTileCount < this.totalTileCount ) {
			this.totalTime = 0;
		}
		//calc score for display
		scene.scene.stop(jigsawPuzzle.getGameSceneOneId());
		scene.scene.stop(jigsawPuzzle.getGameGlassId());
		scene.scene.start(jigsawPuzzle.getGameOverId());
		//no background music				
    }.bind(scene);
        
	return scene;
})();
