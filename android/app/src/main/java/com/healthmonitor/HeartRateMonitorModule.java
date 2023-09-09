package com.healthmonitor;

import androidx.annotation.NonNull;

import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Promise;

import android.graphics.Color;
import android.graphics.BitmapFactory;
import android.os.Environment;
import android.util.Base64;

import com.facebook.react.bridge.Arguments;

import android.net.Uri;
import android.content.ContentResolver;
import android.database.Cursor;
import android.os.AsyncTask;
import android.provider.MediaStore;
import android.util.Log;

import java.util.ArrayList;
import java.util.List;
import java.lang.Math;


import android.content.Context;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

import android.content.res.AssetManager;

public class HeartRateMonitorModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private static final String ASSET_PREFIX = "asset:///";
    private Callback callback;

    HeartRateMonitorModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "HeartRateMonitorModule";
    }

    @ReactMethod
    public void extractFrames(int threshold, int duration, int frameTime, int heightStart, int heightEnd, int widthStart, int widthEnd, final Callback callback) {
        this.callback = callback;
        try {
            ExtractFramesTask task = new ExtractFramesTask(threshold, duration, frameTime, heightStart, heightEnd, widthStart, widthEnd);
            task.execute();
        } catch (Exception e) {
            handleExtractionError(e.toString());
        }
    }

    // Helper method to handle errors and invoke the callback
    private void handleExtractionError(String errorMessage) {
        if (callback != null) {
            callback.invoke(errorMessage, null);
        }
    }

    @ReactMethod
    public void foo() {
        String nana = Environment.getExternalStorageDirectory().getPath();
        Log.d("HeartRateMonitorModule", "nana="+nana);
    }


    private class ExtractFramesTask extends AsyncTask<Void, Void, String> {
        private int Duration, Threshold, FrameTime, heightStart, heightEnd, widthStart, widthEnd;
        ExtractFramesTask() {
            super();
            this.Duration = 15;
            this.Threshold = 1000;
            this.FrameTime = 1000;
            this.heightStart = 210;
            this.heightEnd = 510;
            this.widthStart = 140;
            this.widthEnd= 340;
        }


        ExtractFramesTask(int threshold, int duration, int frameTime, int heightStart, int heightEnd, int widthStart, int widthEnd) {
            super();
            this.Duration = duration;
            this.Threshold = threshold;
            this.FrameTime = frameTime;
            this.heightStart = heightStart;
            this.heightEnd = heightEnd;
            this.widthStart = widthStart;
            this.widthEnd = widthEnd;
        }

        @Override
        protected String doInBackground(Void... params) {
            try {
                // Move your existing code for frame extraction here
                // ...
                MediaMetadataRetriever retriever = new MediaMetadataRetriever();

                
                File destinationDir = new File(Environment.getExternalStorageDirectory().getPath());
                // if (!destinationDir.exists()) {
                //     destinationDir.mkdirs();
                // }
                Log.d("HeartRateMonitorModule","video directory exists");
                Log.d("HeartRateMonitorModule","threshold="+this.Threshold);
                Log.d("HeartRateMonitorModule","duration="+this.Duration);

                // Specify the destination path for the copied video
                File destinationFile = new File(destinationDir, "HeartRateTempVideo.mp4");
                Log.d("HeartRateMonitorModule","video file exists");

                // // Copy the video from assets to the local directory
                // AssetManager assetManager = reactContext.getAssets();
                // InputStream inputStream = assetManager.open("HeartRateTempVideo.mp4");
                // FileOutputStream outputStream = new FileOutputStream(destinationFile);
                // byte[] buffer = new byte[1024];
                // int read;
                // while ((read = inputStream.read(buffer)) != -1) {
                //     outputStream.write(buffer, 0, read);
                // }
                // inputStream.close();
                // outputStream.close();



                retriever.setDataSource(destinationFile.getAbsolutePath());

                Log.d("HeartRateMonitorModule","I reached here");
                long duration = Long.parseLong(retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION));
                long currentTime = 0;
                Log.d("HeartRateMonitorModule","Total duration of the video extracted in the helper code is = " + duration);

                WritableArray frames = Arguments.createArray();
//            List<Bitmap> frameList = new ArrayList<>();
                long redBucket = 0;
                long pixelCount = 0;
                List<Long> a = new ArrayList<>();

                while (currentTime < duration) {
                    Bitmap frame = retriever.getFrameAtTime(currentTime * 1000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
//                frameList.add(bitmap);
                    redBucket = 0;

                    if (frame != null) {
                        //WritableMap frameInfo = Arguments.createMap();
                        //frameInfo.putInt("width", frame.getWidth());
                        //frameInfo.putInt("height", frame.getHeight());
                        Log.d("HeartRateMonitorModule","I reached the frameInfo");
                        Log.d("HeartRateMonitorModule","frame dimensions : width = " + frame.getWidth() + " and height = " + +frame.getHeight());
                        // Iterate through each pixel in the frame and get its value
                        //WritableArray pixels = Arguments.createArray();
                        for (int x = this.widthStart; x < this.widthEnd; x++) {
                            for (int y = this.heightStart; y < this.heightEnd; y++) {
                                int pixelColor = frame.getPixel(x, y);
                                //pixels.pushInt(pixelColor);
                                pixelCount++;
                                redBucket += Color.red(pixelColor);
                            }
                        }

                        //frameInfo.putArray("pixels", pixels);
                        //frames.pushMap(frameInfo);
                        a.add(redBucket);
                    }

                    currentTime += this.FrameTime;
                }
                Log.d("HeartRateMonitorModule","I reached the end - part 1");
                List<Long> b = new ArrayList<>();
                for (int i = 0; i < a.size() - 5; i++) {
                    long temp = (a.get(i) + a.get(i + 1) + a.get(i + 2) + a.get(i + 3) + a.get(i + 4)) / 5;
                    b.add(temp);
                    Log.d("HeartRateMonitorModule","adding temp :"+ temp +" to b");
                }

                long x = b.get(0);
                int count = 0;
                Log.d("HeartRateMonitorModule","x="+x);
                Log.d("HeartRateMonitorModule","b.size()="+b.size());

                for (int i = 1; i < b.size() - 1; i++) {
                    long p = b.get(i);
                    long dif = Math.abs(p-x);
                    Log.d("HeartRateMonitorModule","p-x=" + dif);
                    Log.d("HeartRateMonitorModule","threshold=" + this.Threshold);
                    if (Math.abs(p-x) > this.Threshold) {
                        count++;
                    }
                    x = b.get(i);
                }

                int rate = (int) ((count * 60) / this.Duration);

                Log.d("HeartRateMonitorModule","I reached the end - part 2");
                return String.valueOf(rate); // Replace 'result' with the actual result
            } catch (Exception e) {
                return e.toString();
            }
        }

        @Override
        protected void onPostExecute(String result) {
            handleExtractionResult(result);
        }

        // Helper method to handle the extraction result and invoke the callback
        private void handleExtractionResult(String result) {
            if (callback != null) {
                if (result != null) {
                    callback.invoke(null, result);
                } else {
                    callback.invoke("Error", null);
                }
            }
        }
    }


}
