//the first scene of this game. 
sentenceUnscrambler.gameTitle = (function() {
/////////////////////////////////////////////////	
	// public accessible
	var scene = fn_createScene(sentenceUnscrambler.getGameTitleId());
	
	function handleStartBtnDown() {
		//start glass pane, but make it sleep. so that no update and not visible.
		scene.scene.start(sentenceUnscrambler.getGameGlassId());
		scene.scene.sleep(sentenceUnscrambler.getGameGlassId());

		scene.scene.start(sentenceUnscrambler.getGameSceneOneId());
		
		scene.scene.moveAbove(sentenceUnscrambler.getGameTitleId(), sentenceUnscrambler.getGameSceneOneId());
		scene.scene.moveAbove(sentenceUnscrambler.getGameGlassId(), sentenceUnscrambler.getGameSceneOneId());		
	}
	
	function handleOptionsBtnDown() {
		scene.scene.start(sentenceUnscrambler.getGameOptionsId())
		scene.scene.stop(sentenceUnscrambler.getGameTitleId())
	}
	
	function handleHelpBtnDown() {
		scene.scene.start(sentenceUnscrambler.getGameHelpId())
		scene.scene.stop(sentenceUnscrambler.getGameTitleId())
	}
	
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();						
	};

	scene.preload = function() {
		var backgroundImageURL = sentenceUnscrambler.getAsset("background.jpg");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);
			this.userBackgroundImageUsed = true;
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}								
		
		this.load.image(this.btnBackgroundImgId, sentenceUnscrambler.getAsset("button-bg.png"));				
	};

	scene.create = function() {
		//style the game canvas
		sentenceUnscrambler.gameMaster.styleCanvas();
		
		//one piece background 		
		fn_setBackgroundAlpha(this, this.backgroundImgId, 0.2);		
        
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
