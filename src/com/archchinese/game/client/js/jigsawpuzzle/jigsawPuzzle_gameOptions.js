jigsawPuzzle.gameOptions = (function() {
/////////////////////////////////////////////////
	function handleReturnBtnDown() {
		scene.scene.stop(jigsawPuzzle.getGameOptionsId())
		scene.scene.start(jigsawPuzzle.getGameTitleId())
	}
	
	// public accessible
	var scene = fn_createScene(jigsawPuzzle.getGameOptionsId());
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.checkedCheckboxId = fn_createId();
		this.uncheckedCheckboxId = fn_createId();
		
        this.musicOn = jigsawPuzzle.isMusicOn();        
        this.puzzleBgOn = jigsawPuzzle.isPuzzleBgOn();
	};

	scene.preload = function() {		
		//initialize this based on last time setting		
		var backgroundImageURL = jigsawPuzzle.getAsset("background.png");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);
			this.userBackgroundImageUsed = true;
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}						

		this.load.image(this.btnBackgroundImgId, jigsawPuzzle.getAsset("button-bg.png"));
		
		this.load.image(this.checkedCheckboxId, jigsawPuzzle.getAsset("checkedCheckbox.png"));
		this.load.image(this.uncheckedCheckboxId, jigsawPuzzle.getAsset("uncheckedCheckbox.png"));
	};

	scene.create = function() {
		jigsawPuzzle.gameMaster.styleCanvas();

		//set background image. User tile for default background, but single piece for user defined 		
		if (this.userBackgroundImageUsed) {
			fn_setBackground(this, this.backgroundImgId);	
		} else {
			fn_createTileSprite(this, this.backgroundImgId);
		}
		
        //set options.
        this.musicButton = this.add.image(0, 0, this.checkedCheckboxId);
        this.musicButtonText = this.createLabel("Enable sound");
        
        fn_centerObject(this, this.musicButton, 0.5);
        this.musicButton.x = this.musicButton.x - (this.musicButton.getBounds().width + this.musicButtonText.getBounds().width)/2
        this.musicButtonText.y = this.musicButton.y - this.musicButton.getBounds().height/2;
        this.musicButtonText.x = this.musicButton.x + this.musicButton.getBounds().width + 3;//3 is a little space between the checkbox and label text
        
        
        this.puzzleBgButton = this.add.image(0, 0, this.checkedCheckboxId);
        this.puzzleBgButtonText = this.createLabel("Enable puzzle background");
        fn_centerObject(this, this.puzzleBgButton, -0.5);
        this.puzzleBgButton.x = this.musicButton.x;//align with the first button
        this.puzzleBgButtonText.y = this.puzzleBgButton.y - this.puzzleBgButton.getBounds().height/2;
        this.puzzleBgButtonText.x = this.puzzleBgButton.x + this.puzzleBgButton.getBounds().width + 3; //3 is a little space between the checkbox and label text
        
        //add input event handlers
        this.musicButton.setInteractive({useHandCursor: true}).on('pointerup', function(){
            this.musicOn = !this.musicOn;            	
            this.updateOptions();
          }, this);
        
        this.puzzleBgButton.setInteractive({useHandCursor: true}).on('pointerup', function(){
          this.puzzleBgOn = !this.puzzleBgOn;
          this.updateOptions();
        }, this);
		
        //set check boxes based on the initial values
        this.updateOptions();
        //////////////done setting the options//////////////////
       
		this.returnBtnBg = this.add.sprite(100, 200, this.btnBackgroundImgId).setScale(1.15).setInteractive({useHandCursor: true}).on('pointerup', handleReturnBtnDown);
		fn_centerObject(this, this.returnBtnBg, -4);		
		fn_nestedInCenter(fn_createTitlePageBtn(this, "Return", handleReturnBtnDown),this.returnBtnBg);			
	};

	scene.createLabel = function(text) {
		return this.add.text(0, 0, text, {
			fontFamily : fn_getEnglishFont(),
			fontSize : 32,
			color : '#000000',
			align: "left",
		});        
	}.bind(scene);
	
	scene.updateOptions = function() {
	    if (this.musicOn) {
	    	this.musicButton.setTexture(this.checkedCheckboxId);
	    } else {
		    this.musicButton.setTexture(this.uncheckedCheckboxId);
	    }	    
	    jigsawPuzzle.setMusicOn(this.musicOn);
	    this.musicButton.scale = 1.8;
	    	    
	    if (this.puzzleBgOn) {
	    	this.puzzleBgButton.setTexture(this.checkedCheckboxId);
	    } else {
		    this.puzzleBgButton.setTexture(this.uncheckedCheckboxId);
	    }
    	jigsawPuzzle.setPuzzleBgOn(this.puzzleBgOn);
	    this.puzzleBgButton.scale = 1.8;
	    
	}.bind(scene);
	
	scene.update = function() {
	};
	
	return scene;
////////////////////////////////////////////
})();
