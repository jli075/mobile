package com.archchinese.game.client;

public class GameConfig {
	private static String gameName ="";
	private static String gameId ="";
	private static String listId ="";
	private static String gameType ="";
	
	private static String backgroundMusic ="";
	private static String fontSize ="";
	private static String batchSize ="12";
	private static String textColor ="";
	private static String visitedTextColor ="";
	private static String matchedTextColor ="";	
	private static String difficultyLevel ="";
	private static String creator ="";
	private static String imageURL ="";
	
	//new entries. Existing games may not have those. use the default values.
	private static String wordAudio ="true";
	private static String matchType ="0";
	private static String gameTextBackgroundColor ="CCCCCC";
	
	public static String getGameName() {
		return gameName;
	}
	public static void setGameName(String gameName) {
		GameConfig.gameName = gameName;
	}
	public static String getGameId() {
		return gameId;
	}
	public static void setGameId(String gameId) {
		GameConfig.gameId = gameId;
	}
	public static String getListId() {
		return listId;
	}
	public static void setListId(String listId) {
		GameConfig.listId = listId;
	}
	public static String getGameType() {
		return gameType;
	}
	public static void setGameType(String gameType) {
		GameConfig.gameType = gameType;
	}
	public static String getBackgroundMusic() {
		return backgroundMusic;
	}
	public static void setBackgroundMusic(String backgroundMusic) {
		GameConfig.backgroundMusic = backgroundMusic;
	}
	public static String getFontSize() {
		return fontSize;
	}
	public static void setFontSize(String fontSize) {
		GameConfig.fontSize = fontSize;
	}
	public static String getBatchSize() {
		return batchSize;
	}
	public static void setBatchSize(String batchSize) {
		GameConfig.batchSize = batchSize;
	}
	public static String getTextColor() {
		return textColor;
	}
	public static void setTextColor(String textColor) {
		GameConfig.textColor = textColor;
	}
	public static String getVisitedTextColor() {
		return visitedTextColor;
	}
	public static void setVisitedTextColor(String visitedTextColor) {
		GameConfig.visitedTextColor = visitedTextColor;
	}
	public static String getDifficultyLevel() {
		return difficultyLevel;
	}
	public static void setDifficultyLevel(String difficultyLevel) {
		GameConfig.difficultyLevel = difficultyLevel;
	}
	public static String getCreator() {
		return creator;
	}
	public static void setCreator(String creator) {
		GameConfig.creator = creator;
	}
	public static String getImageURL() {
		return imageURL;
	}
		
	public static String getMatchedTextColor() {
		return matchedTextColor;
	}
	public static void setMatchedTextColor(String matchedTextColor) {
		GameConfig.matchedTextColor = matchedTextColor;
	}
		
	public static String getWordAudio() {
		return wordAudio;
	}
	public static void setWordAudio(String wordAudio) {
		GameConfig.wordAudio = wordAudio;
	}
	public static String getMatchType() {
		return matchType;
	}
	public static void setMatchType(String matchType) {
		GameConfig.matchType = matchType;
	}
	public static String getGameTextBackgroundColor() {
		return gameTextBackgroundColor;
	}
	public static void setGameTextBackgroundColor(String textBackgroundColor) {
		GameConfig.gameTextBackgroundColor = textBackgroundColor;
	}
	public static void setImageURL(String imageURL) {
		if (imageURL.trim().length() > 10) {
			GameConfig.imageURL = Utils.normalizeImageURL(imageURL, 1920);
		}
	}
}
