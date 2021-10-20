//the first scene of this game. 
wordStrike.gameTitle = (function() {
/////////////////////////////////////////////////	
	// public accessible
	var scene = fn_createScene(wordStrike.getGameTitleId());
	
	function handleStartBtnDown() {
		//start glass pane, but make it sleep. so that no update and not visible.
		scene.scene.start(wordStrike.getGameGlassId());
		scene.scene.sleep(wordStrike.getGameGlassId());

		scene.scene.start(wordStrike.getGameSceneOneId());
		
		scene.scene.moveAbove(wordStrike.getGameTitleId(), wordStrike.getGameSceneOneId());
		scene.scene.moveAbove(wordStrike.getGameGlassId(), wordStrike.getGameSceneOneId());		
	}
	
	function handleOptionsBtnDown() {
		scene.scene.start(wordStrike.getGameOptionsId())
		scene.scene.stop(wordStrike.getGameTitleId())
	}
	
	function handleHelpBtnDown() {
		scene.scene.start(wordStrike.getGameHelpId())
		scene.scene.stop(wordStrike.getGameTitleId())
	}
	
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
	};

	scene.preload = function() {
		var backgroundImageURL = wordStrike.getAsset("background.jpg");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);	
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}								
		
		this.load.image(this.btnBackgroundImgId, wordStrike.getAsset("button-bg.png"));				
	};

	scene.create = function() {
		//style the game canvas
		wordStrike.gameMaster.styleCanvas();
		
		//set background image		
        this.background = fn_createTileSprite(this, this.backgroundImgId);  
        this.background.scale = 2;
        this.background.alpha = 0.1;

        
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
		fn_initPinyinFont(this);
	};

	scene.update = function() {
	};

	return scene;

})();
