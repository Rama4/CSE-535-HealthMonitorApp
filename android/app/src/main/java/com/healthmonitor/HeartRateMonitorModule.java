package com.healthmonitor;

import java.util.ArrayList;
import java.util.List;
import java.lang.Math;
import java.io.File;

import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;

import android.graphics.Color;
import android.os.Environment;
import android.os.AsyncTask;
import android.util.Log;

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

    // The constants for heart rate calculation will be passed from the JS side, for faster testing of constant values.
    @ReactMethod
    public void calculateHeartRateFromVideo(int threshold, int videoDuration, int frameTime, int heightStart, int heightEnd, int widthStart, int widthEnd, final Callback callback) {
        this.callback = callback;
        try {
            HeartRateCalcFromVideoAsync task = new HeartRateCalcFromVideoAsync(threshold, videoDuration, frameTime, heightStart, heightEnd, widthStart, widthEnd);
            task.execute();
        } catch (Exception e) {
            if (callback != null) {
                callback.invoke(e.toString(), null);
            }
        }
    }

    // Background task for calculating heart rate from video path.
    // The video recorded by camera is stored in /storage/emulated/0/HeartRateTempVideo.mp4.
    // This video is then accessed by this task to calculate heart rate.
    private class HeartRateCalcFromVideoAsync extends AsyncTask<Void, Void, String> {
        private int Duration, Threshold, FrameTime, heightStart, heightEnd, widthStart, widthEnd;
        HeartRateCalcFromVideoAsync() {
            super();
            this.Duration = 15;
            this.Threshold = 1000;
            this.FrameTime = 1000;
            this.heightStart = 210;
            this.heightEnd = 510;
            this.widthStart = 140;
            this.widthEnd= 340;
        }

        HeartRateCalcFromVideoAsync(int threshold, int videoDuration, int frameTime, int heightStart, int heightEnd, int widthStart, int widthEnd) {
            super();
            this.Duration = videoDuration;
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
                MediaMetadataRetriever metadataRetriever = new MediaMetadataRetriever();

                File videoDirectory = new File(Environment.getExternalStorageDirectory().getPath());
                File videoFilePath = new File(videoDirectory, "HeartRateTempVideo.mp4");

                metadataRetriever.setDataSource(videoFilePath.getAbsolutePath());

                long videoDuration = Long.parseLong(metadataRetriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION));
                long videoTime = 0;

                WritableArray frames = Arguments.createArray();
                long pixelCount = 0;
                long redBucket = 0;
                List<Long> a = new ArrayList<>();

                for(long videoTime = 0; videoTime < videoDuration; videoTime += this.FrameTime)
                    Bitmap videoFrame = metadataRetriever.getFrameAtTime(videoTime * 1000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
                    redBucket = 0;

                    if (videoFrame != null) {
                        for (int x = this.widthStart; x < this.widthEnd; x++) {
                            for (int y = this.heightStart; y < this.heightEnd; y++) {
                                int pixelColor = videoFrame.getPixel(x, y);
                                pixelCount++;
                                redBucket += Color.red(pixelColor);
                            }
                        }
                        a.add(redBucket);
                    }

                }
                List<Long> b = new ArrayList<>();
                for (int i = 0; i < a.size() - 5; i++) {
                    long temp = (a.get(i) + a.get(i + 1) + a.get(i + 2) + a.get(i + 3) + a.get(i + 4)) / 5;
                    b.add(temp);
                }

                long x = b.get(0);
                int count = 0;

                for (int i = 1; i < b.size() - 1; i++) {
                    long p = b.get(i);
                    long dif = Math.abs(p-x);
                    if (Math.abs(p-x) > this.Threshold) {
                        count++;
                    }
                    x = b.get(i);
                }

                int heartRate = (int) ((count * 60) / this.Duration);

                return String.valueOf(heartRate);
            } catch (Exception e) {
                return e.toString();
            }
        }

        @Override
        protected void onPostExecute(String result) {
            if (callback != null) {
                if (result != null) {
                    callback.invoke("Success", result);
                } else {
                    callback.invoke("Error", null);
                }
            }
        }
    }
}
