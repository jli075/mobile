package com.archchinese.game.client;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.http.client.URL;

public class VocabManager {
	private void showLoadedVocabList(final String data, final String listName,final String imageURLs) {
		String[] entries = data.split("&");
		List<String> cList = new ArrayList<String>();
		List<String> eList = new ArrayList<String>();
		List<String> pList = new ArrayList<String>();
		List<String> imgList = new ArrayList<String>();
		
		boolean hasImages = imageURLs.trim().length() > 0;
		String[] imgEntries = imageURLs.split("&");
		int imgCount = imgEntries.length;
		int i = 0;
		for(String entry : entries) {
			String[] fields = entry.split("@");
			if (fields.length == 3) {
				cList.add(fields[0]);
				pList.add(fields[1]);
				eList.add(fields[2]);
			} else if (fields.length == 2){
				//安徽@an1 hui1@, Note trailing empty string is not included in the final array
				//the fields contains [安徽,an1 hui1]				
				if('@' == entry.trim().charAt(entry.trim().length()-1)) {
					cList.add(fields[0]);
					pList.add(fields[1]);
					eList.add(" ");
				}
			} else if (fields.length == 1) {
				//安徽@@
				if(entry.indexOf("@@") == entry.length()-2) {
					cList.add(fields[0]);
					pList.add(" ");
					eList.add(" ");
				}
			}
			
			if (hasImages && i < imgCount) {
				imgList.add(imgEntries[i]);
			} else {
				imgList.add(" ");
			}
			i++;
		}
		
		//shorten too long English definitions
		for(int m = 0; m < eList.size(); m++) {
			eList.set(m, Utils.cleanAndShortenEnglish(eList.get(m)));
		}
		
		//set the data to the main game scene to start the game.
		String displayName = listName;
		if (GameConfig.getGameName().trim().length() > 0) {
			displayName = GameConfig.getGameName();
		}
		Utils.setGameVocabLists(displayName, Utils.convertWordListToString(cList.toArray(new String[0])), 
				Utils.convertWordListToString(pList.toArray(new String[0])), 
				Utils.convertWordListToString(eList.toArray(new String[0])), 
				Utils.convertWordListToString(imgList.toArray(new String[0])));		
	}
	
	
	public void loadVocabListByUUID(String uuid) {
		String url = "https://www.archchinese.com/loadUserWordWorksheetByUUID";				
		String paramList = "uuid="+URL.encodeQueryString(uuid);
		try {
			RequestBuilder builder = new RequestBuilder(RequestBuilder.POST, url);			
			builder.setHeader("content-type","application/x-www-form-urlencoded");
			builder.sendRequest(paramList, new RequestCallback() {
		    public void onError(Request request, Throwable exception) {
		    }
		    public void onResponseReceived(Request request, Response response) {
		      if (200 == response.getStatusCode()) {		    		    	  
		    		String result = response.getText();	
		    		if (result.trim().length() > 2) {
			    	  	String data = "";
			    	  	String imageURLs = "";
			    	  	String title = "";
			    		String[] fList = result.split("\\^");
						if (fList != null) {
							if (fList.length == 3) {
								data = fList[0];
								imageURLs = fList[1].trim();
								title = fList[2].trim();
							}
							if (fList.length == 2) {
								data = fList[0];
								imageURLs = fList[1].trim();							
							}
							if (fList.length == 1) {
								data = fList[0];
							}					
						}											
						showLoadedVocabList(data,title,imageURLs);	
					} else {
						//silently ignore 
					}
		      } else {
		      }
		    }			
		  });
		 
		} catch (RequestException e) {			     
		}		
	}				
}
