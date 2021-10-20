//the first scene of this game. 
tarsiaPuzzle.gameTitle = (function() {
/////////////////////////////////////////////////	
	// public accessible
	var scene = fn_createScene(tarsiaPuzzle.getGameTitleId());
	
	function handleStartBtnDown() {
		//start glass pane, but make it sleep. so that no update and not visible.
		scene.scene.start(tarsiaPuzzle.getGameGlassId());
		scene.scene.sleep(tarsiaPuzzle.getGameGlassId());

		scene.scene.start(tarsiaPuzzle.getGameSceneOneId());
		
		scene.scene.moveAbove(tarsiaPuzzle.getGameTitleId(), tarsiaPuzzle.getGameSceneOneId());
		scene.scene.moveAbove(tarsiaPuzzle.getGameGlassId(), tarsiaPuzzle.getGameSceneOneId());		
	}
	
	function handleOptionsBtnDown() {
		scene.scene.start(tarsiaPuzzle.getGameOptionsId())
		scene.scene.stop(tarsiaPuzzle.getGameTitleId())
	}
	
	function handleHelpBtnDown() {
		scene.scene.start(tarsiaPuzzle.getGameHelpId())
		scene.scene.stop(tarsiaPuzzle.getGameTitleId())
	}
	
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();						
	};

	scene.preload = function() {
		var backgroundImageURL = tarsiaPuzzle.getAsset("background.jpg");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);
			this.userBackgroundImageUsed = true;
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}								
		
		this.load.image(this.btnBackgroundImgId, tarsiaPuzzle.getAsset("button-bg.png"));				
	};

	scene.create = function() {
		//style the game canvas
		tarsiaPuzzle.gameMaster.styleCanvas();
		
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
