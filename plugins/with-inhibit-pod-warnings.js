const { withDangerousMod } = require('expo/config-plugins');
const fs = require('node:fs');
const path = require('node:path');

module.exports = function withInhibitPodWarnings(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfile = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfile, 'utf-8');
      if (!contents.includes('inhibit_all_warnings!')) {
        contents = contents.replace(
          /(?<targetLine>target\s+['"][^'"]+['"]\s+do\r?\n)/u,
          '$<targetLine>  inhibit_all_warnings!\n',
        );
        fs.writeFileSync(podfile, contents);
      }
      return cfg;
    },
  ]);
};
