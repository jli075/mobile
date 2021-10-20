// the central place to define the shared functions specific to this game. 
var tarsiaPuzzle = (function(){
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
		return fn_getLocal("tarsiaPuzzle_musicOn") != "0";
	};

	moduleReturn.setMusicOn = function(musicOn) {
		var isOn = musicOn? "1" : "0";
		fn_saveLocal("tarsiaPuzzle_musicOn", isOn);
	};
	
	moduleReturn.isSoundOn = function() {
		return fn_getLocal("tarsiaPuzzle_soundOn") != "0";
	};

	moduleReturn.setSoundOn = function(soundOn) {
		var isOn = soundOn? "1" : "0";
		fn_saveLocal("tarsiaPuzzle_soundOn", isOn);
	};
	
	moduleReturn.isAutoSpinOn = function() {
		return fn_getLocal("tarsiaPuzzle_autoSpinOn") == "1"
	};
	
	moduleReturn.setAutoSpinOn = function(controlOn) {
		var isOn = controlOn? "1" : "0";
		fn_saveLocal("tarsiaPuzzle_autoSpinOn", isOn);
	};

	moduleReturn.isZoomInOn = function() {
		return fn_getLocal("tarsiaPuzzle_zoomInOn") == "1"
	};
	
	moduleReturn.setZoomInOn = function(controlOn) {
		var isOn = controlOn? "1" : "0";
		fn_saveLocal("tarsiaPuzzle_zoomInOn", isOn);
	};
		
	//options related ends.
	moduleReturn.getAsset = function(name) {
		return fn_getAsset("tarsiaPuzzle", name);
	};
	
    return moduleReturn;
})();
