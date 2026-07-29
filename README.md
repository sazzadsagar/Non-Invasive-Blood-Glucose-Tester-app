# Blood Sugar Tracker — build an Android APK

I can't compile a real .apk inside this chat (that needs Node.js + the
Android SDK/Gradle running on an actual computer), but here is a complete,
ready-to-build project. Follow these steps on your own PC.

## 1. Install requirements (one time)
- Node.js 18+ → https://nodejs.org
- Android Studio (includes the Android SDK) → https://developer.android.com/studio

## 2. Install project dependencies
```
npm install
```

## 3. Build the web app
```
npm run build
```
This creates a `dist/` folder — the finished web app.

## 4. Turn it into an Android project (Capacitor)
```
npx cap init "Blood Sugar Tracker" "com.yourname.bloodsugar" --web-dir dist
npx cap add android
npx cap copy
```

## 5. Open in Android Studio and build the APK
```
npx cap open android
```
Android Studio will open the `android/` folder.
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- Wait for it to finish, then click "locate" in the popup notification —
  your `app-debug.apk` is right there. Copy it to your phone and install
  (you may need to allow "install unknown apps" in phone settings).

For a signed, Play-Store-ready release APK, use
Build → Generate Signed Bundle / APK instead, and follow Android Studio's
signing wizard (you'll create a keystore the first time).

## Notes
- Data is stored on-device with `localStorage` — nothing is sent anywhere.
- The History → "Export PDF" button uses the browser/WebView print dialog
  ("Save as PDF"), which works the same inside the installed app.
- If you'd rather skip Android Studio entirely, you can instead deploy the
  `dist/` folder to any static host (Netlify, GitHub Pages, Vercel) and run
  it through https://www.pwabuilder.com — paste your URL and it will
  generate a downloadable APK for you with no coding required.
