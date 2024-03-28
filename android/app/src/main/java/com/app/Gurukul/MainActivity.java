package com.app.Gurukul;

import android.os.Bundle;
import android.view.WindowManager;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

     @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Disable screenshot functionality
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
    }
    
}