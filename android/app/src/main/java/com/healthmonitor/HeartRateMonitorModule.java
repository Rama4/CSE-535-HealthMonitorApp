package com.healthmonitor;
import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.util.Log;
import android.provider.MediaStore;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.graphics.Bitmap;
import android.graphics.Color;
import android.media.MediaMetadataRetriever;
import android.os.AsyncTask;
import com.facebook.react.bridge.*;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import android.app.Service;
import android.content.ContentResolver;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.os.IBinder;
import android.provider.MediaStore;
import android.content.Context;
import android.util.Log;

import android.content.Context;
import android.os.Environment;

import androidx.annotation.Nullable;
import androidx.core.content.FileProvider;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;


public class HeartRateMonitorModule extends ReactContextBaseJavaModule {
   HeartRateMonitorModule(ReactApplicationContext context) {
       super(context);
   }

    @Override
    public String getName() {
        return "HeartRateMonitorModule";
    }

    @ReactMethod
    public void foo() {
        Log.d("HeartRateMonitorModule", "Hi da");
    }

    // @ReactMethod
    // public void processVideo(String uri) {
    //     Log.d("HeartRateMonitorModule", "processVideo(), uri="+ uri);
    //     try {
    //         MediaMetadataRetriever retriever = new MediaMetadataRetriever();
    //         File path = new File(getExternalFilesDir(null), "HR_recording1.mp4");
    //         Context context = getApplicationContext();
    //         Log.d("HeartRateMonitorModule", "path="+ path);
    //         Uri fileUri = FileProvider.getUriForFile(getApplicationContext(), getApplicationContext().getApplicationContext().getPackageName()+".provider", path);
    //         Log.d("HeartRateMonitorModule", "fileUri="+ fileUri);
    //         retriever.setDataSource(uri);
    //         String duration = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_VIDEO_FRAME_COUNT);
    //         int aduration = Integer.parseInt(duration);

    //         int i = 10;
    //         List<Bitmap> frameList = new ArrayList<>();

    //         while (i < aduration) {
    //             Bitmap bitmap = retriever.getFrameAtTime(i * 1000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
    //             frameList.add(bitmap);
    //             i += 5;
    //         }

    //         retriever.release();

    //         long redBucket = 0;
    //         long pixelCount = 0;
    //         List<Long> a = new ArrayList<>();

    //         Log.d("HeartRateMonitorModule", "doInBackground 2");
    //         for (Bitmap frame : frameList) {
    //             redBucket = 0;
    //             for (int y = 550; y < 650; y++) {
    //                 for (int x = 550; x < 650; x++) {
    //                     int c = frame.getPixel(x, y);
    //                     pixelCount++;
    //                     redBucket += Color.red(c) + Color.blue(c) + Color.green(c);
    //                 }
    //             }
    //             a.add(redBucket);
    //         }
    //         Log.d("HeartRateMonitorModule", "doInBackground 3");

    //         List<Long> b = new ArrayList<>();
    //         for (int j = 0; j < a.size() - 5; j++) {
    //             long temp = (a.get(j) + a.get(j + 1) + a.get(j + 2) + a.get(j + 3) + a.get(j + 4)) / 4;
    //             b.add(temp);
    //         }

    //         Log.d("HeartRateMonitorModule", "doInBackground 4");

    //         long x = b.get(0);
    //         int count = 0;
    //         for (int j = 1; j < b.size(); j++) {
    //             long p = b.get(j);
    //             if ((p - x) > 3500) {
    //                 count++;
    //             }
    //             x = b.get(j);
    //         }

    //         int rate = (int) ((count * 60.0f) / 90.0f);
    //         Log.d("HeartRateMonitorModule", "rate="+rate);

    //     } catch (Exception e) {
    //         Log.d("HeartRateMonitorModule",  Log.getStackTraceString(e));
    //     }
    // }


}