# Gitmojito

An electronjs app to have all gitmojie list in our tray bar

### Features

* Research by name or dsescription
* Copy

### How to use

Available commands:
* `npm start`: Runs the application with Electron in development mode. Hot reloading as well as the Vue devtools are enabled in this mode.
* `npm run make`: Builds distributable app packages using [Electron Forge](https://github.com/electron-userland/electron-forge), placing the results in the **out** directory. Note that this will only build packages compatible with the host system running the command; running the build on **macOS** won't produce **GNU/Linux** packages, for example.
* `npm run lint`: Runs `tslint` over all TypeScript files.

### Known issues/future work

* Add a keyboard shortcut with a different window for fullscreen search
* Highlight name and description when we search a gitmojie
* Replace SemanticUI by our CSS
* Replace TS by JS (maybe)
