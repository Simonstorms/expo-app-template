const { withInfoPlist, withAppDelegate } = require('@expo/config-plugins');

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
    let contents = cfg.modResults.contents;

    if (!/^import UIKit$/m.test(contents)) {
      contents = contents.replace(/^import React$/m, 'import React\nimport UIKit');
    }

    contents = contents.replace(
      /\n[ \t]*#if os\(iOS\) \|\| os\(tvOS\)[\s\S]*?#endif\n/,
      '\n',
    );

    if (!contents.includes('class SceneDelegate')) {
      contents = `${contents.trimEnd()}\n${SCENE_DELEGATE}`;
    }

    cfg.modResults.contents = contents;
    return cfg;
  });
}

module.exports = function withIosSceneLifecycle(config) {
  config = withSceneManifest(config);
  config = withSceneAppDelegate(config);
  return config;
};
