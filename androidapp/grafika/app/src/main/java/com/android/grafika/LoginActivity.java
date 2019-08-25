package com.android.grafika;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

public class LoginActivity extends Activity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_screen);

    }

    public void moveToRecord(View view)
    {
        Intent intent = new Intent(LoginActivity.this, ContinuousCaptureActivity.class);
        startActivity(intent);
    }


}
