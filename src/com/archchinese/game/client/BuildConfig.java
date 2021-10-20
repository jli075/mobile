package com.archchinese.game.client;

public class BuildConfig {
	//if target build is Word Hunter game, the first one we created!!
	public static boolean isWordHunter() {//game 1, word hunter
		return GameTypes.WORD_HUNTER.equals(getCurrentGameType());
	}
	
	public static boolean isWordStrike() {//game 2
		return GameTypes.WORD_STRIKE.equals(getCurrentGameType());
	}

	public static boolean isVirtualBingo() {//game 3
		return GameTypes.VIRTUAL_BINGO.equals(getCurrentGameType());
	}

	public static boolean isWhackAMole() {//game 4
		return GameTypes.WHACK_A_MOLE.equals(getCurrentGameType());
	}

	public static boolean isDragAndMatch() {//game 5
		return GameTypes.DRAG_AND_MATCH.equals(getCurrentGameType());
	}

	public static boolean isJigsawPuzzle() {//game 6
		return GameTypes.JIGSAW_PUZZLE.equals(getCurrentGameType());
	}

	public static boolean isBalloonPop() {//game 7
		return GameTypes.BALLOON_POP.equals(getCurrentGameType());
	}

	public static boolean isWordEater() {//game 8
		return GameTypes.WORD_EATER.equals(getCurrentGameType());
	}

	public static boolean isWheelOfWords() {//game 9
		return GameTypes.WHEEL_OF_WORDS.equals(getCurrentGameType());
	}
	
	public static boolean isSentenceUnscrambler() {//game 10
		return GameTypes.SENTENCE_UNSCRAMBLER.equals(getCurrentGameType());
	}

	public static boolean isTarsiaPuzzle() {//game 11
		return GameTypes.TARSIA_PUZZLE.equals(getCurrentGameType());
	}

	//this is the master switch to control which game to build!!!
	public static String getCurrentGameType() {
		//return GameTypes.WORD_HUNTER;//0
		//return GameTypes.WORD_STRIKE;//1
		//return GameTypes.VIRTUAL_BINGO;//2
		//return GameTypes.WHACK_A_MOLE;//3
		//return GameTypes.DRAG_AND_MATCH;//4
		//return GameTypes.JIGSAW_PUZZLE;//5
		//return GameTypes.BALLOON_POP;//6
		//return GameTypes.WORD_EATER;//7
		//return GameTypes.WHEEL_OF_WORDS;//8
		//return GameTypes.SENTENCE_UNSCRAMBLER;//9
		return GameTypes.TARSIA_PUZZLE;//10
	}
	
	public static String getScriptFile(String gameType) {
		String file = "UnknownGame.html";
    	if (GameTypes.WORD_HUNTER.equals(gameType)) {
    		file = "" + Math.abs("wordHunterArchChinese".hashCode()) + ".html";
    	} else if (GameTypes.WORD_STRIKE.equals(gameType)) {
    		file = "" + Math.abs("wordStrikeArchChinese".hashCode()) + ".html";
    	} else if (GameTypes.VIRTUAL_BINGO.equals(gameType)) {
    		file = "vb" + Math.abs("virtualBingoArchChinese".hashCode()) + ".html";
    	} else if (GameTypes.WHACK_A_MOLE.equals(gameType)) {
    		file = "wam" + Math.abs("whackAMoleArchChinese".hashCode()) + ".html";//add game name initials to avoid confusion.
    	} else if (GameTypes.DRAG_AND_MATCH.equals(gameType)) {
    		file = "dam" + Math.abs("dragAndMatchArchChinese".hashCode()) + ".html";//add game name initials to avoid confusion.
    	} else if (GameTypes.JIGSAW_PUZZLE.equals(gameType)) {
    		file = "jsp" + Math.abs("jigsawPuzzleArchChinese".hashCode()) + ".html";//add game name initials to avoid confusion.
    	} else if (GameTypes.BALLOON_POP.equals(gameType)) {
    		file = "bpop" + Math.abs("balloonPopArchChinese".hashCode()) + ".html";//add game name initials to avoid confusion.
    	} else if (GameTypes.WORD_EATER.equals(gameType)) {
    		file = "wetr" + Math.abs("wordEaterArchChinese".hashCode()) + ".html";//add game name initials to avoid confusion.
    	} else if (GameTypes.WHEEL_OF_WORDS.equals(gameType)) {
    		file = "wow" + Math.abs("wheelOfWordsArchChinese".hashCode()) + ".html";//add game name initials to avoid confusion.
    	} else if (GameTypes.TARSIA_PUZZLE.equals(gameType)) {
    		file = "wow" + Math.abs("tarsiaPuzzleArchChinese".hashCode()) + ".html";//add game name initials to avoid confusion.
    	}
    	return file;		
	}
}
