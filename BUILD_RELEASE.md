Build unsigned release APK (local)

This project cannot build release APKs inside the current environment because Java (JDK) is not available here.

Follow these steps on a machine with JDK 11+ installed and ANDROID_HOME/Java configured.

1. Install prerequisites
   - Java JDK 11 or newer
   - Android SDK & command-line tools
   - ANDROID_HOME and PATH configured

2. From project root, run:

   cd android
   ./gradlew assembleRelease

3. The unsigned release APK will be created at:

   android/app/build/outputs/apk/release/app-release-unsigned.apk

4. To sign the APK for testing, either:
   - Use jarsigner and zipalign locally, or
   - Follow the signing guide and generate a keystore, then add signingConfig to android/app/build.gradle (we can help add a template if you want).

Helper npm script (added to package.json):

  npm run build:android:release

This runs the assembleRelease Gradle task from the project android directory.

If you want me to also add a signing config and generate a keystore (keystore will be kept uncommitted and a sample gradle.properties will be added), tell me and I'll prepare that on a feature branch.