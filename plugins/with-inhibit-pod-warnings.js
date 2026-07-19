const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withInhibitPodWarnings(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfile = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfile, 'utf8');
      if (!contents.includes('inhibit_all_warnings!')) {
        contents = contents.replace(
          /(target\s+['"][^'"]+['"]\s+do\r?\n)/,
          '$1  inhibit_all_warnings!\n',
        );
        fs.writeFileSync(podfile, contents);
      }
      return cfg;
    },
  ]);
};
