//the first scene of this game. 
whackAMole.gameTitle = (function() {
/////////////////////////////////////////////////	
	// public accessible
	var scene = fn_createScene(whackAMole.getGameTitleId());
	
	function handleStartBtnDown() {
		//start glass pane, but make it sleep. so that no update and not visible.
		scene.scene.start(whackAMole.getGameGlassId());
		scene.scene.sleep(whackAMole.getGameGlassId());

		scene.scene.start(whackAMole.getGameSceneOneId());
		
		scene.scene.moveAbove(whackAMole.getGameTitleId(), whackAMole.getGameSceneOneId());
		scene.scene.moveAbove(whackAMole.getGameGlassId(), whackAMole.getGameSceneOneId());		
	}
	
	function handleHelpBtnDown() {
		scene.scene.start(whackAMole.getGameHelpId())
		scene.scene.stop(whackAMole.getGameTitleId())
	}
	
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();						
	};

	scene.preload = function() {
		var backgroundImageURL = whackAMole.getAsset("background.png");
		//no user background cannot be used
		this.load.image(this.backgroundImgId, backgroundImageURL);		
		this.load.image(this.btnBackgroundImgId, whackAMole.getAsset("button-bg.png"));				
	};

	scene.create = function() {
		//style the game canvas
		whackAMole.gameMaster.styleCanvas();
		
		//set background image		
        this.background = fn_createTileSprite(this, this.backgroundImgId);  
        
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
