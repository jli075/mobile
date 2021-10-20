//the last scene of this game
wheelOfWords.gameOver = (function() {
	var scene = fn_createScene(wheelOfWords.getGameOverId());
	
	scene.init = function() {
		//set the ids heres
		this.btnBackgroundImgId = fn_createId();
	}

	scene.preload = function() {
		this.load.image(this.btnBackgroundImgId, wheelOfWords.getAsset("button-bg.png"));
	}

	scene.create = function() {
		fn_stopFullScreen(this);
		
		//use the same background as the game title and game title is created before this scene is created
		//so we are safe here.
		var newId = fn_createId();
		fn_createGradient(this, newId,'#000000', '#000000');//black background
		fn_setBackground(this, newId);
		
		//game over text
		fn_centerObject(this, fn_createGameOverLabel(this), 3);

		//final score
		var totalTime = wheelOfWords.gameScene1.totalTime;
		if (totalTime > 0) {//only show time if it is not aborted by clicking the stop button.
			this.finalTime = fn_formatMilliSeconds(wheelOfWords.gameScene1.totalTime);		
			fn_centerObject(this, fn_createFinalTimeLabel(this, this.finalTime), 2);
		}
		
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
		fn_showTimeLeaderboard(this, leaderboard, wheelOfWords.gameScene1.totalTime, document);
	}.bind(scene);

	///////////////////////
	return scene;
})();





