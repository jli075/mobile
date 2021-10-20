package com.archchinese.game.client;

public class Vocab implements Comparable<Vocab> {
	private String chinese;
	private String pinyin;
	private String english;
	private String imgURL;
	
	public String getChinese() {
		return chinese;
	}
	
	public Vocab(String chinese, String pinyin, String english, String imgURL) {
		super();
		this.chinese = chinese;
		this.pinyin = pinyin;
		this.english = english;
		this.imgURL = imgURL;
	}

	public void setChinese(String chinese) {
		this.chinese = chinese;
	}
	public String getPinyin() {
		return pinyin;
	}
	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}
	public String getEnglish() {
		return english;
	}
	public void setEnglish(String english) {
		this.english = english;
	}
	
	public String toString() {
		return chinese + '@' + pinyin + '@' + english;
	}

	@Override
	public int compareTo(Vocab o) {		
		return this.getPinyin().compareToIgnoreCase(o.getPinyin());
	}

	public String getImgURL() {
		return imgURL;
	}

	public void setImgURL(String imgURL) {
		this.imgURL = imgURL;
	}		
}
