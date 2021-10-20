wordStrike.gameHelp = (function() {
/////////////////////////////////////////////////
	function handleReturnBtnDown() {
		scene.scene.stop(wordStrike.getGameHelpId())
		scene.scene.start(wordStrike.getGameTitleId())
	}
	
	// public accessible
	var scene = fn_createScene(wordStrike.getGameHelpId());
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.frameImgId = fn_createId();
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
		this.load.image(this.frameImgId, wordStrike.getAsset("frame.png"));
	};

	scene.create = function() {
		//style the game canvas
		wordStrike.gameMaster.styleCanvas();
		
		//set background image
		//fn_setBackground(this, this.backgroundImgId);
        this.background = fn_createTileSprite(this, this.backgroundImgId);  
        this.background.scale = 2;
        this.background.alpha = 0.1;

        //set the the help text
		this.helpTextBg = this.add.sprite(100, 200, this.frameImgId).setScale(1.25)
		fn_centerObject(this, this.helpTextBg, 1.5);					
		var instructions = "Use the arrow keys to move in the respective directions and dodge the enemy spaceships. If you collide with an enemy spaceship, you will lose one of your five lives, but you can always earn them back by collecting the floating power ups. Press SPACE to shoot down the matching spaceship. For each correct match, you gain 15 points. Remember to control your shooting, as your final score is calculated by both accuracy and your in-game score. Test your knowledge and reaction speed by earning the highest final score!";		
		this.helpText = this.add.text(400, 100, instructions , {
			fontFamily : fn_getEnglishFont(),
			fontSize : 36,
			color : '#000000',
			align: "center",
			wordWrap: { width: 700, useAdvancedWrap: true }		
		});		
		fn_nestedInCenter(this.helpText,this.helpTextBg);
		
		//set return button
		this.returnBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(1.25).setInteractive({useHandCursor: true}).on('pointerup', handleReturnBtnDown);
		fn_centerObject(this, this.returnBtnBg, -4);		
		fn_nestedInCenter(fn_createTitlePageBtn(this, "Return", handleReturnBtnDown),this.returnBtnBg);			
	};

	scene.update = function() {
	};
	
	return scene;
////////////////////////////////////////////
})();
