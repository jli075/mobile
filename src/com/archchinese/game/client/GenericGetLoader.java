package com.archchinese.game.client;

import java.util.HashMap;
import java.util.Map;

import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;

public class GenericGetLoader {
	static Map<String, String> cache = new HashMap<String, String>();
	
	public void load(final String getURL, final Callback callback) {
		if (cache.get(getURL) != null) {
			callback.execute(cache.get(getURL));
			return;
		} 
		try {
			new RequestBuilder(RequestBuilder.GET, getURL).sendRequest(null, new RequestCallback() {
		    public void onError(Request request, Throwable exception) {
		    }
		    public void onResponseReceived(Request request, Response response) {		    
		      if (200 == response.getStatusCode()) {
		    	    cache.put(getURL, response.getText());
					callback.execute(response.getText());
		      } else {
		      }
		    }			
		  });
		} catch (RequestException e) {
		}
	}
}
 