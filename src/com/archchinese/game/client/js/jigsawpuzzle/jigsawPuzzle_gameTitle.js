//the first scene of this game. 
jigsawPuzzle.gameTitle = (function() {
/////////////////////////////////////////////////	
	// public accessible
	var scene = fn_createScene(jigsawPuzzle.getGameTitleId());
	
	function handleStartBtnDown() {
		//start glass pane, but make it sleep. so that no update and not visible.
		scene.scene.start(jigsawPuzzle.getGameGlassId());
		scene.scene.sleep(jigsawPuzzle.getGameGlassId());

		scene.scene.start(jigsawPuzzle.getGameSceneOneId());
		
		scene.scene.moveAbove(jigsawPuzzle.getGameTitleId(), jigsawPuzzle.getGameSceneOneId());
		scene.scene.moveAbove(jigsawPuzzle.getGameGlassId(), jigsawPuzzle.getGameSceneOneId());		
	}
	
	function handleOptionsBtnDown() {
		scene.scene.start(jigsawPuzzle.getGameOptionsId())
		scene.scene.stop(jigsawPuzzle.getGameTitleId())
	}
	
	function handleHelpBtnDown() {
		scene.scene.start(jigsawPuzzle.getGameHelpId())
		scene.scene.stop(jigsawPuzzle.getGameTitleId())
	}
	
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();						
	};

	scene.preload = function() {
		var backgroundImageURL = jigsawPuzzle.getAsset("background.png");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);
			this.userBackgroundImageUsed = true;
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}								
		
		this.load.image(this.btnBackgroundImgId, jigsawPuzzle.getAsset("button-bg.png"));				
	};

	scene.create = function() {
		//style the game canvas
		jigsawPuzzle.gameMaster.styleCanvas();
		
		//set background image. User tile for default background, but single piece for user defined 		
		if (this.userBackgroundImageUsed) {
			fn_setBackground(this, this.backgroundImgId);	
		} else {
			fn_createTileSprite(this, this.backgroundImgId);
		}
        
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
