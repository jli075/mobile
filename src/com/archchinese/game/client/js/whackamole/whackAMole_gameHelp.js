whackAMole.gameHelp = (function() {
/////////////////////////////////////////////////
	function handleReturnBtnDown() {
		scene.scene.stop(whackAMole.getGameHelpId())
		scene.scene.start(whackAMole.getGameTitleId())
	}
	
	// public accessible
	var scene = fn_createScene(whackAMole.getGameHelpId());
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.frameImgId = fn_createId();
	};

	scene.preload = function() {
		//user image cannot be used here.
		var backgroundImageURL = whackAMole.getAsset("background.png");
		this.load.image(this.backgroundImgId, backgroundImageURL);
		
		this.load.image(this.btnBackgroundImgId, whackAMole.getAsset("button-bg.png"));
		this.load.image(this.frameImgId, whackAMole.getAsset("frame.png"));
	};

	scene.create = function() {
		//style the game canvas
		whackAMole.gameMaster.styleCanvas();
		
		//set background image
		//fn_setBackground(this, this.backgroundImgId);
        this.background = fn_createTileSprite(this, this.backgroundImgId);  

        //set the the help text
		this.helpTextBg = this.add.sprite(100, 200, this.frameImgId).setScale(1.25)
		fn_centerObject(this, this.helpTextBg, 1.5);					
		var instructions = "Welcome to Whack-a-mole!\n\nClick the moles with the matching Chinese, English, or Pinyin before they go back into their holes. For each correct answer, you will gain 15 points, while for each incorrect answer, you will lose 2 points. Your final score is calculated by both accuracy and your in-game score. Use the mouse cursor or your finger to target the moles. As the game progresses, mole speed will increase. Click Pause button to pause the game.";		
		this.helpText = this.add.text(400, 100, instructions , {
			fontFamily : fn_getEnglishFont(),
			fontSize : 36,
			color : '#000000',
			align: "center",
			wordWrap: { width: 700, useAdvancedWrap: true }		
		});		
		fn_nestedInCenter(this.helpText,this.helpTextBg);
		
		//set start button
		this.returnBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(1.25).setInteractive({useHandCursor: true}).on('pointerup', handleReturnBtnDown);
		fn_centerObject(this, this.returnBtnBg, -4);		
		fn_nestedInCenter(fn_createTitlePageBtn(this, "Return", handleReturnBtnDown),this.returnBtnBg);			
	};

	scene.update = function() {
	};
	
	return scene;
////////////////////////////////////////////
})();
