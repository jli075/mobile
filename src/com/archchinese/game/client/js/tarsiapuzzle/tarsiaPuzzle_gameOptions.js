tarsiaPuzzle.gameOptions = (function() {
/////////////////////////////////////////////////
	function handleReturnBtnDown() {
		scene.scene.stop(tarsiaPuzzle.getGameOptionsId())
		scene.scene.start(tarsiaPuzzle.getGameTitleId())
	}
	
	// public accessible
	var scene = fn_createScene(tarsiaPuzzle.getGameOptionsId());
	scene.init = function() {
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
		this.checkedCheckboxId = fn_createId();
		this.uncheckedCheckboxId = fn_createId();
		this.frameImgId = fn_createId();
        this.musicOn = tarsiaPuzzle.isMusicOn();
        this.soundOn = tarsiaPuzzle.isSoundOn();
        this.controlOn = tarsiaPuzzle.isAutoSpinOn();
        this.zoomInOn = tarsiaPuzzle.isZoomInOn();
	};

	scene.preload = function() {		
		//initialize this based on last time setting		
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
		this.load.image(this.checkedCheckboxId, tarsiaPuzzle.getAsset("checkedCheckbox.png"));
		this.load.image(this.uncheckedCheckboxId, tarsiaPuzzle.getAsset("uncheckedCheckbox.png"));
	};

	scene.create = function() {
		tarsiaPuzzle.gameMaster.styleCanvas();

		fn_setBackgroundAlpha(this, this.backgroundImgId, 0.2);	
		
        //set the the help text
		var frame = this.add.sprite(100, 200, this.frameImgId).setScale(1.25)
		fn_centerObject(this, frame, 1);					
		
		//draw a background of the frame
		fn_drawFrameBackground(this,frame, "#B97A57");
		
        //set options.
        this.musicButton = this.add.image(0, 0, this.checkedCheckboxId);
        this.musicButtonText = this.createLabel("Enable music");
        
        fn_centerObject(this, this.musicButton, 3);
        this.musicButton.x = this.musicButton.x - (this.musicButton.getBounds().width + this.musicButtonText.getBounds().width)/2 - 180;
        this.musicButtonText.y = this.musicButton.y - this.musicButton.getBounds().height/2;
        this.musicButtonText.x = this.musicButton.x + this.musicButton.getBounds().width + 3;//3 is a little space between the checkbox and label text
                       
        //add input event handlers
        this.musicButton.setInteractive({useHandCursor: true}).on('pointerup', function(){
            this.musicOn = !this.musicOn;            	
            this.updateOptions();
          }, this);
        
        ///////////////
        this.soundButton = this.add.image(0, 0, this.checkedCheckboxId);
        this.soundButtonText = this.createLabel("Enable sound");
        fn_centerObject(this, this.soundButton, 2);
        this.soundButton.x = this.musicButton.x;//align with the first button
        this.soundButtonText.y = this.soundButton.y - this.soundButton.getBounds().height/2;
        this.soundButtonText.x = this.soundButton.x + this.soundButton.getBounds().width + 3; //3 is a little space between the checkbox and label text
        
        this.soundButton.setInteractive({useHandCursor: true}).on('pointerup', function(){
          this.soundOn = !this.soundOn;
          this.updateOptions();
        }, this);        
        //////////////
        
        
        ///////////////
        this.controlButton = this.add.image(0, 0, this.checkedCheckboxId);
        this.controlButtonText = this.createLabel("Auto spin after selecting the correct answer");
        fn_centerObject(this, this.controlButton, 1);
        this.controlButton.x = this.musicButton.x;//align with the first button
        this.controlButtonText.y = this.controlButton.y - this.controlButton.getBounds().height/2;
        this.controlButtonText.x = this.controlButton.x + this.controlButton.getBounds().width + 3; //3 is a little space between the checkbox and label text
        
        this.controlButton.setInteractive({useHandCursor: true}).on('pointerup', function(){
          this.controlOn = !this.controlOn;
          this.updateOptions();
        }, this);        
        //////////////
        
        ///////////////
        this.zoomInButton = this.add.image(0, 0, this.checkedCheckboxId);
        this.zoomInButtonText = this.createLabel("Zoom in on the pointed slice");
        fn_centerObject(this, this.zoomInButton, 0);
        this.zoomInButton.x = this.musicButton.x;//align with the first button
        this.zoomInButtonText.y = this.zoomInButton.y - this.zoomInButton.getBounds().height/2;
        this.zoomInButtonText.x = this.zoomInButton.x + this.zoomInButton.getBounds().width + 3; //3 is a little space between the checkbox and label text
        
        this.zoomInButton.setInteractive({useHandCursor: true}).on('pointerup', function(){
          this.zoomInOn = !this.zoomInOn;
          this.updateOptions();
        }, this);        
        //////////////
        
        
        
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
			fontSize : 28,
			color : '#FFFF00',
			align: "left",
		});        
	}.bind(scene);
	
	scene.updateOptions = function() {
	    if (this.musicOn) {
	    	this.musicButton.setTexture(this.checkedCheckboxId);
	    } else {
		    this.musicButton.setTexture(this.uncheckedCheckboxId);
	    }	    
	    tarsiaPuzzle.setMusicOn(this.musicOn);
	    this.musicButton.scale = 1.8;
	    
	    if (this.soundOn) {
	    	this.soundButton.setTexture(this.checkedCheckboxId);
	    } else {
		    this.soundButton.setTexture(this.uncheckedCheckboxId);
	    }	    
	    tarsiaPuzzle.setSoundOn(this.soundOn);
	    this.soundButton.scale = 1.8;
	    
	    if (this.controlOn) {
	    	this.controlButton.setTexture(this.checkedCheckboxId);
	    } else {
		    this.controlButton.setTexture(this.uncheckedCheckboxId);
	    }
    	tarsiaPuzzle.setAutoSpinOn(this.controlOn);
	    this.controlButton.scale = 1.8;
	    

	    if (this.zoomInOn) {
	    	this.zoomInButton.setTexture(this.checkedCheckboxId);
	    } else {
		    this.zoomInButton.setTexture(this.uncheckedCheckboxId);
	    }
    	tarsiaPuzzle.setZoomInOn(this.zoomInOn);
	    this.zoomInButton.scale = 1.8;
	    
	}.bind(scene);
	
	scene.update = function() {
	};
	
	return scene;
////////////////////////////////////////////
})();
