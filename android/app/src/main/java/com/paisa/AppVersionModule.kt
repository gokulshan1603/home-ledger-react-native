package com.paisa

import android.content.pm.PackageManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AppVersionModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "AppVersion"

  @Suppress("DEPRECATION")
  @ReactMethod
  fun getVersion(promise: Promise) {
    try {
      val packageInfo = reactApplicationContext.packageManager.getPackageInfo(
        reactApplicationContext.packageName,
        0,
      )
      promise.resolve(packageInfo.versionName ?: BuildConfig.VERSION_NAME)
    } catch (error: Exception) {
      promise.reject("APP_VERSION_ERROR", "Could not read the app version.", error)
    }
  }
}
