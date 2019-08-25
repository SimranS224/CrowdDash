package com.android.grafika;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

public class ProfileActivity extends Activity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.profile);

    }

    public void moveToRecord(View view)
    {
        Intent intent = new Intent(ProfileActivity.this, ContinuousCaptureActivity.class);
        startActivity(intent);
    }


}
