jigsawPuzzle.gameHelp = (function() {
/////////////////////////////////////////////////
	function handleReturnBtnDown() {
		scene.scene.stop(jigsawPuzzle.getGameHelpId())
		scene.scene.start(jigsawPuzzle.getGameTitleId())
	}
	
	// public accessible
	var scene = fn_createScene(jigsawPuzzle.getGameHelpId());
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.frameImgId = fn_createId();
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
		this.load.image(this.frameImgId, jigsawPuzzle.getAsset("frame.png"));
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

        //set the the help text
		this.helpTextBg = this.add.sprite(100, 200, this.frameImgId).setScale(1.25)
		fn_centerObject(this, this.helpTextBg, 1.5);					
		var instructions = "Welcome to Jigsaw Puzzle!\n\nClick to rotate the pieces and drag them into place. How fast can you solve the puzzles? Have fun!";		
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
