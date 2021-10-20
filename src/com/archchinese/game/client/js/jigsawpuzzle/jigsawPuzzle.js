// the central place to define the shared functions specific to this game. 
var jigsawPuzzle = (function(){
	////////////////////////////////////
	//publicly accessible, but not globally
	var moduleReturn = {};
	
	moduleReturn.getGameOverId = function() {
		return "gameOver";
	};

	moduleReturn.getGameTitleId = function() {
		return "gameTitle";
	};
	
	moduleReturn.getGameOptionsId = function() {
		return "gameOptions";
	};
	
	moduleReturn.getGameSceneOneId = function() {
		return "gameScene1";
	};

	moduleReturn.getGameHelpId = function() {
		return "gameHelp";
	};
	
	moduleReturn.getGameGlassId = function() {
		return "gameGlass";
	};

	moduleReturn.isMusicOn = function() {
		return fn_getLocal("jigsaw_musicOn") != "0";
	};

	moduleReturn.setMusicOn = function(musicOn) {
		var isOn = musicOn? "1" : "0";
		fn_saveLocal("jigsaw_musicOn", isOn);
	};

	moduleReturn.isPuzzleBgOn = function() {
		return fn_getLocal("jigsaw_puzzleBgOn") != "0"
	};
	
	moduleReturn.setPuzzleBgOn = function(puzzleBgOn) {
		var isOn = puzzleBgOn? "1" : "0";
		fn_saveLocal("jigsaw_puzzleBgOn", isOn);
	};
	//options related ends.
	
	moduleReturn.getAsset = function(name) {
		return fn_getAsset("jigsawpuzzle", name);
	};
	
    return moduleReturn;
})();
