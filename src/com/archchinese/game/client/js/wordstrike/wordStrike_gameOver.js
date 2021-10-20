//the last scene of this game
wordStrike.gameOver = (function() {
	var scene = fn_createScene(wordStrike.getGameOverId());
	
	scene.init = function() {
		//set the ids heres
		this.backgroundImgId = fn_createId();
		this.btnBackgroundImgId = fn_createId();
	}

	scene.preload = function() {
		this.load.image(this.btnBackgroundImgId, wordStrike.getAsset("button-bg.png"));
	}

	scene.create = function() {
		fn_stopFullScreen(this);
		
		//use the same background as the game title and game title is created before this scene is created
		//so we are safe here.
		fn_createGradient(this, this.backgroundImgId,'#000000', '#000000');//black background
		fn_setBackground(this, this.backgroundImgId);
		
		//game over text
		fn_centerObject(this, fn_createGameOverLabel(this), 3);

		//final score
		fn_centerObject(this, fn_createFinalScoreLabel(this, wordStrike.gameScene1.finalScore), 2);
		
		fn_createPlayAgainBtn(this,this.btnBackgroundImgId);
		
		//get leaderboard info from server. the callback is handled by setGameLeaderboard in this file.
		if (fn_isInternetExplorer()) {
			//IE does not work well for leaderboard. ignore it.
		} else {						
			fn_loadGameLeaderboard();
		}
	}

	scene.update = function() {
	}
	
	//handled returned leaderboard info from server. set by game agent.
	scene.setGameLeaderboard = function(leaderboard) {		
		fn_showLeaderboard(this, leaderboard, wordStrike.gameScene1.finalScore, document);
	}.bind(scene);

	///////////////////////
	return scene;
})();





