wordHunter.gameHelp = (function() {
	
	function handleReturnBtnDown() {
		scene.scene.stop(wordHunter.getGameHelpId())
		scene.scene.start(wordHunter.getGameTitleId())
	}
	
/////////////////////////////////////////////////
	// public accessible
	var scene = fn_createScene(wordHunter.getGameHelpId());
	scene.init = function() {
		// set the ids heres
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.frameImgId = fn_createId();
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
		this.load.image(this.frameImgId, wordHunter.getAsset("frame.png"));
	};

	scene.create = function() {
		// note: full screen can only be initiated by a user gesture. We
		// cannot automatically set to full page on this first scene.
		wordHunter.gameMaster.styleCanvas();

		fn_setBackground(this, this.backgroundImgId);

		this.helpTextBg = this.add.sprite(100, 200, this.frameImgId).setScale(1.25)
		fn_nestedInCenter(
				this.helpTextBg,
			    this.add.zone(fn_getCanvasWidth()/2, fn_getCanvasHeight()/2 -1.5 * 100, fn_getCanvasWidth(), fn_getCanvasHeight())
			);			
		
		var instructions = "Move the astronaut through each level using the arrow keys. Navigate around the platforms and collect the matching Chinese/English/Pinyin along the way, but watch out for asteroids! Use the arrow keys to jump and dodge past the asteroids as they fly by.";		
		this.helpText = this.add.text(400, 100, instructions , {
			fontFamily : fn_getEnglishFont(),
			fontSize : 42,
			color : '#000000',
			align: "left",
			wordWrap: { width: 700, useAdvancedWrap: true }		
		});		
		fn_nestedInCenter(
				this.helpText,
				this.helpTextBg
			  );		
		
		
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
