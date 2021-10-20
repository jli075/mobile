package com.archchinese.game.client;

import com.google.gwt.core.client.GWT;
import com.google.gwt.resources.client.ClientBundle;
import com.google.gwt.resources.client.TextResource;

public interface EngineResource extends ClientBundle {
    final EngineResource INSTANCE = GWT.create(EngineResource.class);

    @Source("js/phaser/phaser3.js")
    TextResource engineScript();
}