//the first scene of this game. 
wordHunter.gameTitle = (function() {
/////////////////////////////////////////////////
	// public accessible
	var scene = fn_createScene(wordHunter.getGameTitleId());
	scene.init = function() {
		// set the ids heres
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
	};

	scene.preload = function() {
		// A common approach is using a dedicated scene for loading
		// assets and animations that runs only once.
		// load all the resources only once in this game title page!
		var backgroundImageURL = wordHunter.getAsset("background.png"); 
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);	
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}						

		this.load.image(this.btnBackgroundImgId, wordHunter.getAsset("button-bg.png"));
	};

	function handleStartBtnDown() {
		//start glass pane, but make it sleep. so that no update and not visible.
		scene.scene.start(wordHunter.getGameGlassId());
		scene.scene.sleep(wordHunter.getGameGlassId());

		scene.scene.start(wordHunter.getGameSceneOneId());
		
		scene.scene.moveAbove(wordHunter.getGameTitleId(), wordHunter.getGameSceneOneId());
		scene.scene.moveAbove(wordHunter.getGameGlassId(), wordHunter.getGameSceneOneId());
	}
	
	// center a game object in our scene. This function takes two arguments, 
	//gameObject, the game object we want to center and offset, 
	//the amount we want to offset the game object vertically.
	 //Phaser.Display.Align.In.Center to do the centering. This method will center the first object within the second one. 
	//For the second object, we create a new zone, which is a game object that does not render in our scene.
	scene.centerButton = function(gameObject, offset) {
		fn_nestedInCenter(
		    gameObject,
		    scene.add.zone(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2 - offset * 100, fn_getCanvasWidth(), fn_getCanvasHeight())
		);
	};
	
	/**
 	 *used to center our text game objects within our UI game objects. This methods takes two arguments, gameText, a text game object and gameButton, a button game object. 
	 */
	scene.centerButtonText = function (gameText, gameButton) {
		fn_nestedInCenter(
	    gameText,
	    gameButton
	  );
	}

	function handleOptionsBtnDown() {
		scene.scene.start(wordHunter.getGameOptionsId())
		scene.scene.stop(wordHunter.getGameTitleId())
	}
	
	function handleHelpBtnDown() {
		scene.scene.start(wordHunter.getGameHelpId())
		scene.scene.stop(wordHunter.getGameTitleId())
	};

	scene.create = function() {
		// note: full screen can only be initiated by a user gesture. We
		// cannot automatically set to full page on this first scene.
		wordHunter.gameMaster.styleCanvas();

		fn_setBackground(this, this.backgroundImgId);
		
		//set start button
		this.startBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(1.15).setInteractive({useHandCursor: true}).on('pointerup', handleStartBtnDown);
		fn_centerObject(this, this.startBtnBg, 1.5);		
		fn_nestedInCenter(fn_createTitlePageBtn(this, "Start", handleStartBtnDown),this.startBtnBg);		
		
		//options button
		this.optionsBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(1.15).setInteractive({useHandCursor: true}).on('pointerup', handleOptionsBtnDown);
		fn_centerObject(this, this.optionsBtnBg, 0);		
		fn_nestedInCenter(fn_createTitlePageBtn(this, "Options", handleOptionsBtnDown),this.optionsBtnBg);		
		
		//set help button
		this.helpBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(1.15).setInteractive({useHandCursor: true}).on('pointerup', handleHelpBtnDown);
		fn_centerObject(this, this.helpBtnBg, -1.5);		
		fn_nestedInCenter(fn_createTitlePageBtn(this, "Help", handleHelpBtnDown),this.helpBtnBg);		


		//load a dummy pinyin text to trigger loading the Pinyin font in advance.
		//otherwise, Pinyin font won't be immediately available on the main scene screen.
		this.add.text(0, 0, '', {
			fontFamily : fn_getPinyinFont(),
			fontSize : 10,
		})
	};

	scene.update = function() {
	};

	return scene;

})();
