wordEater.gameHelp = (function() {
/////////////////////////////////////////////////
	function handleReturnBtnDown() {
		scene.scene.stop(wordEater.getGameHelpId())
		scene.scene.start(wordEater.getGameTitleId())
	}
	
	// public accessible
	var scene = fn_createScene(wordEater.getGameHelpId());
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.frameImgId = fn_createId();
	};

	scene.preload = function() {
		//this.isMobile = fn_isMobile() || wordEater.isMobileControlOn();
		
		var backgroundImageURL = wordEater.getAsset("background.jpg");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);
			this.userBackgroundImageUsed = true;
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}								
		
		this.load.image(this.btnBackgroundImgId, wordEater.getAsset("button-bg.png"));
		this.load.image(this.frameImgId, wordEater.getAsset("frame.png"));
	};

	scene.create = function() {
		//style the game canvas
		wordEater.gameMaster.styleCanvas();
		//one piece background 			
		var bg = fn_setBackground(this, this.backgroundImgId);	
		bg.alpha = 0.7;

        //set the the help text
		this.helpTextBg = this.add.sprite(100, 200, this.frameImgId).setScale(1.25)
		fn_centerObject(this, this.helpTextBg, 1.5);					
		var instructions = "Welcome to Word Chomper!\n\nUse the arrow keys (or joystick if enabled) to control the chomper. Make sure the chomper bites the Chinese, English, or Pinyin matching it and avoids the incorrect matches or it'll be injured and lose a heart. You have a maximum of 3 hearts, but for each correct term you chomp, you'll regain a heart. The highest score wins!";
		
		this.helpText = this.add.text(400, 100, instructions , {
			fontFamily : fn_getEnglishFont(),
			fontSize : 36,
			color : '#FFFF00',
			align: "center",
			wordWrap: { width: 700, useAdvancedWrap: true }		
		});		
		fn_nestedInCenter(this.helpText,this.helpTextBg);

		
		this.creditText = this.add.text(400, 100, "Design: Jario Technologies \nMusic: Tenderness from Bensound.com" , {
			fontFamily : fn_getEnglishFont(),
			fontSize : 16,
			color : '#FFFFFF',			
			align: "center",
			wordWrap: { width: 700, useAdvancedWrap: true }		
		});		
		fn_nestedInCenter(this.creditText,this.helpTextBg);
		this.creditText.y += 250;
		
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
