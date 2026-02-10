const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * Custom Expo config plugin to add Firebase Crashlytics meta-data
 * to the AndroidManifest.xml.
 *
 * The @react-native-firebase/crashlytics plugin only adds the Gradle
 * classpath and apply plugin, but does NOT add the required meta-data
 * entries in the AndroidManifest.
 */
function withCrashlyticsConfig(config) {
  return withAndroidManifest(config, (config) => {
    const mainApplication = config.modResults.manifest.application[0];

    // Add xmlns:tools if not present
    if (!config.modResults.manifest.$["xmlns:tools"]) {
      config.modResults.manifest.$["xmlns:tools"] =
        "http://schemas.android.com/tools";
    }

    // Add crashlytics meta-data
    if (!mainApplication["meta-data"]) {
      mainApplication["meta-data"] = [];
    }

    const metaData = mainApplication["meta-data"];

    // firebase_crashlytics_collection_enabled
    if (
      !metaData.find(
        (m) => m.$["android:name"] === "firebase_crashlytics_collection_enabled",
      )
    ) {
      metaData.push({
        $: {
          "android:name": "firebase_crashlytics_collection_enabled",
          "android:value": "true",
          "tools:replace": "android:value",
        },
      });
    }

    return config;
  });
}

module.exports = withCrashlyticsConfig;
