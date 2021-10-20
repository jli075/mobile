tarsiaPuzzle.gameHelp = (function() {
/////////////////////////////////////////////////
	function handleReturnBtnDown() {
		scene.scene.stop(tarsiaPuzzle.getGameHelpId())
		scene.scene.start(tarsiaPuzzle.getGameTitleId())
	}
	
	// public accessible
	var scene = fn_createScene(tarsiaPuzzle.getGameHelpId());
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.frameImgId = fn_createId();
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
		this.load.image(this.frameImgId, tarsiaPuzzle.getAsset("frame.png"));
	};
	
	scene.create = function() {
		//style the game canvas
		tarsiaPuzzle.gameMaster.styleCanvas();
		
		//one piece background 		
		fn_setBackgroundAlpha(this, this.backgroundImgId, 0.2);	
		
        //set the the help text
		this.helpTextBg = this.add.sprite(100, 200, this.frameImgId).setScale(1.25)
		fn_centerObject(this, this.helpTextBg, 1.5);					
		var instructions = "Wheel of Words\n\nPress the red SPIN button to spin the wheel. After the spinning ends, click the English, Pinyin, or Chinese button on the left matching the the wheel slice pointed to. If you don't like your current spin, feel free to spin again. There is no penalty for incorrect answers, but the fastest time wins.";
		
		//draw a background of the frame
		fn_drawFrameBackground(this,this.helpTextBg, "#B97A57");
		
		this.helpText = this.add.text(400, 100, instructions , {
			fontFamily : fn_getEnglishFont(),
			fontSize : 32,
			color : '#FFFF00',
			align: "center",
			wordWrap: { width: 700, useAdvancedWrap: true }		
		});		
		fn_nestedInCenter(this.helpText,this.helpTextBg);

		/*
		this.creditText = this.add.text(400, 100, "Design: Jario Technologies \nMusic: Clear Day from Bensound.com" , {
			fontFamily : fn_getEnglishFont(),
			fontSize : 18,
			color : '#FFFFFF',			
			align: "center",
			wordWrap: { width: 700, useAdvancedWrap: true }		
		});		
		fn_nestedInCenter(this.creditText,this.helpTextBg);
		this.creditText.y += 250;
		*/
		
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
