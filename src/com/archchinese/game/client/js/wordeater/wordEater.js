// the central place to define the shared functions specific to this game. 
var wordEater = (function(){
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
		return fn_getLocal("wordEater_musicOn") != "0";
	};

	moduleReturn.setMusicOn = function(musicOn) {
		var isOn = musicOn? "1" : "0";
		fn_saveLocal("wordEater_musicOn", isOn);
	};
	
	moduleReturn.isMobileControlOn = function() {
		return fn_getLocal("wordEater_controlOn") == "1"
	};
	
	moduleReturn.setMobileControlOn = function(controlOn) {
		var isOn = controlOn? "1" : "0";
		fn_saveLocal("wordEater_controlOn", isOn);
	};
	//options related ends.
	moduleReturn.getAsset = function(name) {
		return fn_getAsset("wordeater", name);
	};
	
    return moduleReturn;
})();
