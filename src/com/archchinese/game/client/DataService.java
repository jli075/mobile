package com.archchinese.game.client;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.http.client.URL;


public class DataService {
	public void loadVocabListByUUID(String wordListUUID) {
		if (!Utils.isProduction()) {//test data
			String[] chineseList = new String[]{"樱桃", "猕猴~桃", "蓝莓", "桃子", "西瓜", "香蕉", "菠萝", "草莓", "柠檬"};
			String[] pinyinList = new String[]{"ying1 tao2","mi2 hou2 tao2", "lan2 mei2","tao2 zi5", "xi1 gua1","xiang1 jiao1", "bo1 luo2", "cao3 mei2", "ning2 meng2"};
			String[] englishList = new String[]{"Cherry", "Kiwi", "Blueberry", "Peach", "Watermelon", "Banana", "Pineapple", "Strawberry", "Lemon"};
			
//			String[] chineseList = new String[]{"樱桃"};
//			String[] pinyinList = new String[]{"ying1 tao2",};
//			String[] englishList = new String[]{"Cherry"};				
//			String[] imgURLList = new String[]{""};
			//String[] imgURLList = new String[]{"https://127.0.0.1:8080/archlearninggame/assets/whackamole/mole.png"};
			String[] imgURLList = new String[]{" "," "," "," "," "," "," "," "," "};
			
			
			GameConfig.setCreator("Ms. Wilson");
			
			Utils.setGameVocabLists("Sample Vocab List", Utils.convertWordListToString(chineseList), 
					Utils.convertWordListToString(pinyinList), 
					Utils.convertWordListToString(englishList), 
					Utils.convertWordListToString(imgURLList));
			
		} else {
			new VocabManager().loadVocabListByUUID(wordListUUID);			
		}
	}
	
	static class NameScore implements Comparable<NameScore> {
		private String name;
		private int score;
		public NameScore(String name, int score) {
			super();
			this.name = name;
			this.score = score;
		}
		public String getName() {
			return name;
		}
		public int getScore() {
			return score;
		}
		@Override
		public int compareTo(NameScore other) {
			return other.getScore() - getScore();
		}		
	}
	
	public void saveScore(final String myName, final String myScore) {
		if (Utils.isProduction()) {
			final String gameId = GameConfig.getGameId();
			
			doLoadLeaderboard(gameId, new Callback() {
				@Override
				public void execute(String data) {
					
					List<NameScore> newScores = new ArrayList<NameScore>();
					newScores.add(new NameScore(myName,Integer.valueOf(myScore)));
					
					if (data.trim().length() > 0) {
						String[] entries = data.split("~");					
						for(int i = 0; i < entries.length; i++) {
							String[] fields = entries[i].split("@");
							String name = fields[0];
							int score = Integer.valueOf(fields[1]);
							newScores.add(new NameScore(name,score));
						}
					}
					
					if (newScores.size() > 1) {
						Collections.sort(newScores);
					}
					
					int count = newScores.size() < 5? newScores.size() : 5;
					String dataToSave = "";
					for(int j = 0; j < count; j++) {
						if (j > 0) {
							dataToSave += "~";
						}
						dataToSave += newScores.get(j).getName() + "@" + newScores.get(j).getScore(); 
					}
					
					//now save to the server
					String host = "https://www.archchinese.com/";
					String action = "ugldb20ById";
					String url = host + action;				
					String paramList = "gameid="+URL.encodeQueryString(gameId) + "&scores=" +URL.encodeQueryString(dataToSave); 
					try {
						RequestBuilder builder = new RequestBuilder(RequestBuilder.POST, url);			
						builder.setHeader("content-type","application/x-www-form-urlencoded");
						builder.sendRequest(paramList, new RequestCallback() {
					    public void onError(Request request, Throwable exception) {
					    }
					    public void onResponseReceived(Request request, Response response) {
					      if (200 == response.getStatusCode()) {		    		    	  
					      }
					    }			
					  });					 
					} catch (RequestException e) {			     
					}		
				}
			});
		} else {
			//dev env, does nothing.
		}
	}
	public void loadLeaderboard(String gameId) {
		if (!Utils.isProduction()) {
			//dev env
			Utils.setGameLeaderboard("Jerry@87878~Jason@188");
		} else {
			doLoadLeaderboard(gameId, new Callback() {
				@Override
				public void execute(String data) {
					Utils.setGameLeaderboard(data);
				}
			});
		}
	}
	
	private void doLoadLeaderboard(String gameId, final Callback callback) {
		String url = "https://www.archchinese.com/ggldb20ById";				
		String paramList = "gameid="+URL.encodeQueryString(gameId);
		try {
			RequestBuilder builder = new RequestBuilder(RequestBuilder.POST, url);			
			builder.setHeader("content-type","application/x-www-form-urlencoded");
			builder.sendRequest(paramList, new RequestCallback() {
		    public void onError(Request request, Throwable exception) {
		    }
		    public void onResponseReceived(Request request, Response response) {
		      if (200 == response.getStatusCode()) {
		    	  String result = response.getText();//could be "None" if no result found 
		    	  if (result.indexOf("@") < 0) {
		    		  result = "";
		    	  }		    	  
		    	  callback.execute(result);
		      }
		    }			
		  });		 
		} catch (RequestException e) {			     
		}				
	}
}
