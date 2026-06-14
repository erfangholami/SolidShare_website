# assetlinks.json — Android App Links for `solidshare.app`

Host the sibling `assetlinks.json` at exactly:

```
https://solidshare.app/.well-known/assetlinks.json
```

Serving requirements (all mandatory for Android verification):
- HTTP `200`, `Content-Type: application/json`
- **No redirects** (not even `http→https` or `solidshare.app→www`)
- Publicly reachable, valid HTTPS certificate

Once live, share links of the form `https://solidshare.app/s?resource=…&owner=…` open SolidShare
directly. The app manifest already declares the matching `autoVerify` filter
(`scheme=https host=solidshare.app pathPrefix=/s`).

---

## ⚠️ One fingerprint per signing key — across EVERY distribution channel

`sha256_cert_fingerprints` must contain the certificate of **every APK that can be installed**.
Each store signs differently, so you publishing through three channels means up to four signers:

| Channel | Who signs the installed APK | SHA-256 to add |
|---|---|---|
| **GitHub releases / direct APK** | You — release keystore in `keystore.properties` | `69:15:B7:42:…:6F:F4:D6` ✅ already in the file |
| **Google Play** | **Google** — Play App Signing **re-signs** your upload | Play Console → your app → **Test and release → App integrity → App signing** → copy **"App signing key certificate" → SHA-256** |
| **F-Droid** | **F-Droid** build server (unless you join Reproducible Builds and they ship *your* signature) | Get it from the F-Droid-built APK after publishing (see below) |
| **Local debug build** | Android debug keystore | `F6:35:2D:28:…:B0:27:FD` ✅ already in the file — *optional, remove for production if you prefer* |

> The file as written contains only your **debug** and **local release/upload** keys.
> **Google Play and F-Droid installs will NOT verify until you append their fingerprints.**
> Just add more strings to the `sha256_cert_fingerprints` array (order is irrelevant).

---

## How to get each fingerprint

- **Local debug + release** (already extracted): `./gradlew :app:signingReport`
- **From any APK** (e.g. the F-Droid build, or a downloaded release):
  ```
  apksigner verify --print-certs app.apk        # look for "SHA-256 digest"
  # or
  keytool -printcert -jarfile app.apk | grep SHA256
  ```
- **Google Play app-signing key**: Play Console → App signing. Use the **app-signing key**
  certificate (NOT the upload key) — that is what end users actually receive.

## Verify after hosting

```bash
adb shell pm verify-app-links --re-verify com.erfangholami.solidshare
adb shell pm get-app-links com.erfangholami.solidshare       # expect: solidshare.app  ->  verified
```

Check the published statement file directly with Google's tester:

```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://solidshare.app&relation=delegate_permission/common.handle_all_urls
```

## Final shape, once all channels are filled in

```jsonc
// real assetlinks.json must be pure JSON — the // notes below are illustrative only
"sha256_cert_fingerprints": [
  "69:15:B7:42:…:6F:F4:D6",   // your release/upload key  → GitHub releases / direct APK
  "AA:BB:CC:…:00",            // Google Play app-signing key
  "CC:DD:EE:…:11"             // F-Droid signing key
]
```

> Tip: the legacy `solidshare://share?resource=…` custom-scheme link needs **no** hosting and always
> opens the app — handy for testing the in-app flow before `assetlinks.json` is live.
