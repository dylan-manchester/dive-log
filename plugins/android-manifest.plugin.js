// Source: https://chafikgharbi.com/expo-android-manifest/

const { withAndroidManifest } = require("@expo/config-plugins")

module.exports = function androiManifestPlugin(config) {
    return withAndroidManifest(config, async config => {
        let androidManifest = config.modResults.manifest

        // add the tools to apply permission remove
        androidManifest.$ = {
            ...androidManifest.$,
            "xmlns:tools": "http://schemas.android.com/tools",
        }

        // add remove property to the audio record permission
        androidManifest["uses-permission"] = androidManifest["uses-permission"].map(
            perm => {
                if (perm.$["android:name"] === "android.permission.ACCESS_NETWORK_STATE") {
                    perm.$["tools:node"] = "remove"
                }
                if (perm.$["android:name"] === "android.permission.INTERNET") {
                    perm.$["tools:node"] = "remove"
                }
                if (perm.$["android:name"] === "com.google.android.gms.permission.ACTIVITY_RECOGNITION") {
                    perm.$["tools:node"] = "remove"
                }
                if (perm.$["android:name"] === "com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE") {
                    perm.$["tools:node"] = "remove"
                }
                if (perm.$["android:name"] === "com.google.android.providers.gsf.permission.READ_GSERVICES") {
                    perm.$["tools:node"] = "remove"
                }
                return perm
            }
        )

        return config
    })
}