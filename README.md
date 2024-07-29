## commands:
- `npm i`  # installs both apps
- `npm run build` # builds both apps
- `npm run start` # starts both apps

## individually
- `npm start --workspace=neutralino-app`
- `npm start --workspace=electron-app`

## passing arguments or input to the app
- `npm start --workspace=electron-app -- <<< "HELLO"`
- `npm start --workspace=neutralino-app -- <<< "HELLO"`


#### executable (the files I want to point my com.company.app.json to) note that I'm using an M2 mac, so the executable is for arm64, but there are other executables available.
**electron:**

`apps/electron-app/out/electron-app-darwin-arm64/electron-app.app/Contents/MacOS/electron-app`

**neutralino:**

`apps/neutralino-app/dist/neutralino-app/neutralino-app-mac_arm64`