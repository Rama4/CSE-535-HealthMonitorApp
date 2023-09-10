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
    public void calculateHeartRateFromVideo(int threshold, int videoDuration, int frameTime, int heightStart, int heightEnd, int widthStart, int widthEnd, String videoFileName, final Callback callback) {
        try {
            this.callback = callback;
            HeartRateCalcFromVideoAsync task = new HeartRateCalcFromVideoAsync(threshold, videoDuration, frameTime, heightStart, heightEnd, widthStart, widthEnd, videoFileName);
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
        private String videoFileName;
        HeartRateCalcFromVideoAsync() {
            super();
            this.Duration = 15;
            this.Threshold = 1000;
            this.FrameTime = 1000;
            this.heightStart = 210;
            this.heightEnd = 510;
            this.widthStart = 140;
            this.widthEnd= 340;
            this.videoFileName= "";
        }

        HeartRateCalcFromVideoAsync(int threshold, int videoDuration, int frameTime, int heightStart, int heightEnd, int widthStart, int widthEnd, String videoFileName) {
            super();
            this.Duration = videoDuration;
            this.Threshold = threshold;
            this.FrameTime = frameTime;
            this.heightStart = heightStart;
            this.heightEnd = heightEnd;
            this.widthStart = widthStart;
            this.widthEnd = widthEnd;
            this.videoFileName = videoFileName;
        }

        @Override
        protected String doInBackground(Void... params) {
            try {
                MediaMetadataRetriever metadataRetriever = new MediaMetadataRetriever();

//                File videoDirectory = new File(Environment.getExternalStorageDirectory().getPath());
//                File videoFilePath = new File(videoDirectory, "HeartRateTempVideo.mp4");

                File cacheDirectory = reactContext.getCacheDir();
                String cachePath = cacheDirectory.getAbsolutePath();

                // Now, you can use 'cachePath' to access and manipulate files in the cache directory
                Log.d("HeartRateMonitorModule", "check : video path:" + this.videoFileName);
                String videoPathString = cachePath + "/Camera/"+ this.videoFileName;
                Log.d("HeartRateMonitorModule", "full path:" + videoPathString);
                File videoFilePath = new File(videoPathString);
                Log.d("HeartRateMonitorModule", "video path exists :" + videoFilePath.exists());



                metadataRetriever.setDataSource(videoFilePath.getAbsolutePath());

                long videoDuration = Long.parseLong(metadataRetriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION));
                Log.d("HeartRateMonitorModule", "videoDuration="+videoDuration);

                WritableArray frames = Arguments.createArray();
                long pixelCount = 0;
                long redBucket = 0;
                List<Long> a = new ArrayList<>();
                Log.d("HeartRateMonitorModule", "just outside for loop");
                for(long videoTime = 0; videoTime < videoDuration; videoTime += this.FrameTime) {
                    Log.d("HeartRateMonitorModule", "video time:"+videoTime);
                    Bitmap videoFrame = metadataRetriever.getFrameAtTime(videoTime * 1000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
                    Log.d("HeartRateMonitorModule", " videoFrame:"+videoFrame);
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
                Log.d("HeartRateMonitorModule", "aaaaa ");
                List<Long> b = new ArrayList<>();
                for (int i = 0; i < a.size() - 5; i++) {
                    long temp = (a.get(i) + a.get(i + 1) + a.get(i + 2) + a.get(i + 3) + a.get(i + 4)) / 5;
                    b.add(temp);
                }

                long x = b.get(0);
                int count = 0;
                Log.d("HeartRateMonitorModule", "bbbbbb ");

                for (int i = 1; i < b.size() - 1; i++) {
                    long p = b.get(i);
                    long dif = Math.abs(p-x);
                    if (Math.abs(p-x) > this.Threshold) {
                        count++;
                    }
                    x = b.get(i);
                }
                Log.d("HeartRateMonitorModule", "ccccc");

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
