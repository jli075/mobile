// the central place to define the shared functions specific to this game. 
var sentenceUnscrambler = (function(){
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
		return fn_getLocal("sentenceUnscrambler_musicOn") != "0";
	};

	moduleReturn.setMusicOn = function(musicOn) {
		var isOn = musicOn? "1" : "0";
		fn_saveLocal("sentenceUnscrambler_musicOn", isOn);
	};
	
	moduleReturn.isSoundOn = function() {
		return fn_getLocal("sentenceUnscrambler_soundOn") != "0";
	};

	moduleReturn.setSoundOn = function(soundOn) {
		var isOn = soundOn? "1" : "0";
		fn_saveLocal("sentenceUnscrambler_soundOn", isOn);
	};
	
	moduleReturn.isAutoSpinOn = function() {
		return fn_getLocal("sentenceUnscrambler_autoSpinOn") == "1"
	};
	
	moduleReturn.setAutoSpinOn = function(controlOn) {
		var isOn = controlOn? "1" : "0";
		fn_saveLocal("sentenceUnscrambler_autoSpinOn", isOn);
	};

	moduleReturn.isZoomInOn = function() {
		return fn_getLocal("sentenceUnscrambler_zoomInOn") == "1"
	};
	
	moduleReturn.setZoomInOn = function(controlOn) {
		var isOn = controlOn? "1" : "0";
		fn_saveLocal("sentenceUnscrambler_zoomInOn", isOn);
	};
		
	//options related ends.
	moduleReturn.getAsset = function(name) {
		return fn_getAsset("sentenceUnscrambler", name);
	};
	
    return moduleReturn;
})();
