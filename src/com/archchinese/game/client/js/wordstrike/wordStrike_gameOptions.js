wordStrike.gameOptions = (function() {
/////////////////////////////////////////////////
	function handleReturnBtnDown() {
		scene.scene.stop(wordStrike.getGameOptionsId())
		scene.scene.start(wordStrike.getGameTitleId())
	}
	
	// public accessible
	var scene = fn_createScene(wordStrike.getGameOptionsId());
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.checkedCheckboxId = fn_createId();
		this.uncheckedCheckboxId = fn_createId();
		
        this.musicOn = wordStrike.isMusicOn();        
        this.controlOn = wordStrike.isMobileControlOn();
	};

	scene.preload = function() {		
		//initialize this based on last time setting		
		var backgroundImageURL = wordStrike.getAsset("background.jpg");
		var userBackgroundImageURL = fn_getUserBackgroundImageURL();
		if (userBackgroundImageURL.length > 0) {
			this.load.image(this.backgroundImgId, userBackgroundImageURL);	
		} else {
			this.load.image(this.backgroundImgId, backgroundImageURL);
		}								
		
		this.load.image(this.btnBackgroundImgId, wordStrike.getAsset("button-bg.png"));
		
		this.load.image(this.checkedCheckboxId, wordStrike.getAsset("checkedCheckbox.png"));
		this.load.image(this.uncheckedCheckboxId, wordStrike.getAsset("uncheckedCheckbox.png"));
	};

	scene.create = function() {
		//style the game canvas
		wordStrike.gameMaster.styleCanvas();
		
		//set background image
        this.background = fn_createTileSprite(this, this.backgroundImgId);  
        this.background.scale = 2;
        this.background.alpha = 0.1;

        //set options.
        this.musicButton = this.add.image(0, 0, this.checkedCheckboxId);
        this.musicButtonText = this.createLabel("Enable sound");
        
        fn_centerObject(this, this.musicButton, 0.5);
        this.musicButton.x = this.musicButton.x - (this.musicButton.getBounds().width + this.musicButtonText.getBounds().width)/2
        this.musicButtonText.y = this.musicButton.y - this.musicButton.getBounds().height/2;
        this.musicButtonText.x = this.musicButton.x + this.musicButton.getBounds().width + 3;//3 is a little space between the checkbox and label text
        
        
        this.controlButton = this.add.image(0, 0, this.checkedCheckboxId);
        this.controlButtonText = this.createLabel("Enable joystick for mobile devices");
        fn_centerObject(this, this.controlButton, -0.5);
        this.controlButton.x = this.musicButton.x;//align with the first button
        this.controlButtonText.y = this.controlButton.y - this.controlButton.getBounds().height/2;
        this.controlButtonText.x = this.controlButton.x + this.controlButton.getBounds().width + 3; //3 is a little space between the checkbox and label text
        
        //add input event handlers
        this.musicButton.setInteractive({useHandCursor: true}).on('pointerup', function(){
            this.musicOn = !this.musicOn;            	
            this.updateOptions();
          }, this);
        
        this.controlButton.setInteractive({useHandCursor: true}).on('pointerup', function(){
          this.controlOn = !this.controlOn;
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
	    wordStrike.setMusicOn(this.musicOn);
	    this.musicButton.scale = 1.8;
	    	    
	    if (this.controlOn) {
	    	this.controlButton.setTexture(this.checkedCheckboxId);
	    } else {
		    this.controlButton.setTexture(this.uncheckedCheckboxId);
	    }
    	wordStrike.setMobileControlOn(this.controlOn);
	    this.controlButton.scale = 1.8;
	    
	}.bind(scene);
	
	scene.update = function() {
	};
	
	return scene;
////////////////////////////////////////////
})();
