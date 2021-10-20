//the first scene of this game. 
dragAndMatch.gameTitle = (function() {
/////////////////////////////////////////////////	
	// public accessible
	var scene = fn_createScene(dragAndMatch.getGameTitleId());
	
	function handleStartBtnDown() {
		//start glass pane, but make it sleep. so that no update and not visible.
		scene.scene.start(dragAndMatch.getGameGlassId());
		scene.scene.sleep(dragAndMatch.getGameGlassId());

		scene.scene.start(dragAndMatch.getGameSceneOneId());
		
		scene.scene.moveAbove(dragAndMatch.getGameTitleId(), dragAndMatch.getGameSceneOneId());
		scene.scene.moveAbove(dragAndMatch.getGameGlassId(), dragAndMatch.getGameSceneOneId());		
	}
	
	function handleHelpBtnDown() {
		scene.scene.start(dragAndMatch.getGameHelpId())
		scene.scene.stop(dragAndMatch.getGameTitleId())
	}
	
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();						
	};

	scene.preload = function() {
		var backgroundImageURL = dragAndMatch.getAsset("background.png");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);
			this.userBackgroundImageUsed = true;
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}								
		
		this.load.image(this.btnBackgroundImgId, dragAndMatch.getAsset("button-bg.png"));				
	};

	scene.create = function() {
		//style the game canvas
		dragAndMatch.gameMaster.styleCanvas();
		
		//set background image. User tile for default background, but single piece for user defined 		
		if (this.userBackgroundImageUsed) {
			fn_setBackground(this, this.backgroundImgId);	
		} else {
			fn_createTileSprite(this, this.backgroundImgId);
		}
                
		//set start button
		this.startBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(1.25).setInteractive({useHandCursor: true}).on('pointerup', handleStartBtnDown);
		fn_centerObject(this, this.startBtnBg, 1);		
		fn_nestedInCenter(fn_createTitlePageBtn(this, "Start", handleStartBtnDown),this.startBtnBg);		
		
		//set help button
		this.helpBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(1.25).setInteractive({useHandCursor: true}).on('pointerup', handleHelpBtnDown);
		fn_centerObject(this, this.helpBtnBg, -1);		
		fn_nestedInCenter(fn_createTitlePageBtn(this, "Help", handleHelpBtnDown),this.helpBtnBg);		
		
		
		//load a dummy pinyin text to trigger loading the Pinyin font in advance.
		//otherwise, Pinyin font won't be immediately available on the main scene screen.
		fn_initPinyinFont(this);
	};

	scene.update = function() {
	};

	return scene;

})();
