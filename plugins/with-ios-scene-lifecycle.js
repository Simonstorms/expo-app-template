const { withInfoPlist, withAppDelegate } = require('expo/config-plugins');

const SCENE_DELEGATE = `
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else {
      return
    }
    guard
      let appDelegate = UIApplication.shared.delegate as? AppDelegate,
      let factory = appDelegate.reactNativeFactory
    else {
      return
    }

    let window = UIWindow(windowScene: windowScene)
    self.window = window
    appDelegate.window = window

    factory.startReactNative(withModuleName: "main", in: window, launchOptions: nil)
  }
}
`;

function withSceneManifest(config) {
  return withInfoPlist(config, (cfg) => {
    cfg.modResults.UIApplicationSceneManifest = {
      ...cfg.modResults.UIApplicationSceneManifest,
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [
          {
            UISceneConfigurationName: 'Default Configuration',
            UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
          },
        ],
      },
    };
    return cfg;
  });
}

function withSceneAppDelegate(config) {
  return withAppDelegate(config, (cfg) => {
    if (cfg.modResults.language !== 'swift') {
      return cfg;
    }
    let { contents } = cfg.modResults;

    if (contents.includes('class SceneDelegate')) {
      return cfg;
    }

    if (!/^import UIKit$/mu.test(contents)) {
      contents = contents.replace(/^import React$/mu, 'import React\nimport UIKit');
    }

    const legacyLifecycle = /\n[ \t]*#if os\(iOS\) \|\| os\(tvOS\)[\s\S]*?#endif\n/u;
    if (!legacyLifecycle.test(contents)) {
      throw new Error(
        'with-ios-scene-lifecycle: expected an "#if os(iOS) || os(tvOS)" block in AppDelegate.swift and found none. The Expo template changed; re-verify this plugin against the current SDK.',
      );
    }

    contents = contents.replace(legacyLifecycle, '\n');
    contents = `${contents.trimEnd()}\n${SCENE_DELEGATE}`;

    cfg.modResults.contents = contents;
    return cfg;
  });
}

module.exports = function withIosSceneLifecycle(config) {
  return withSceneAppDelegate(withSceneManifest(config));
};
