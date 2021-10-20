balloonPop.gameHelp = (function() {
/////////////////////////////////////////////////
	function handleReturnBtnDown() {
		scene.scene.stop(balloonPop.getGameHelpId())
		scene.scene.start(balloonPop.getGameTitleId())
	}
	
	// public accessible
	var scene = fn_createScene(balloonPop.getGameHelpId());
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.frameImgId = fn_createId();
	};

	scene.preload = function() {
		var backgroundImageURL = balloonPop.getAsset("background.jpg");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);
			this.userBackgroundImageUsed = true;
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}								
		
		this.load.image(this.btnBackgroundImgId, balloonPop.getAsset("button-bg.png"));
		this.load.image(this.frameImgId, balloonPop.getAsset("frame.png"));
	};

	scene.create = function() {
		//style the game canvas
		balloonPop.gameMaster.styleCanvas();
		
		//one piece background 		
		fn_setBackground(this, this.backgroundImgId);	

        //set the the help text
		this.helpTextBg = this.add.sprite(100, 200, this.frameImgId).setScale(1.25)
		fn_centerObject(this, this.helpTextBg, 1.5);					
		var instructions = "Welcome to Balloon Pop!\n\nPop the balloon matching the given terms. You can use the arrow keys to adjust your view position. The fastest time wins!\n\n\n\n";
		
		this.helpText = this.add.text(400, 100, instructions , {
			fontFamily : fn_getEnglishFont(),
			fontSize : 36,
			color : '#FFFF00',
			align: "center",
			wordWrap: { width: 700, useAdvancedWrap: true }		
		});		
		fn_nestedInCenter(this.helpText,this.helpTextBg);

		this.creditText = this.add.text(400, 100, "Design: Jario Technologies \nMusic: Clear Day from Bensound.com" , {
			fontFamily : fn_getEnglishFont(),
			fontSize : 18,
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
