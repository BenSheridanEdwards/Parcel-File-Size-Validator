const plugin = require('@parcel/plugin');
const Validator = plugin.Validator;
var path = require("path");

var package = require("./package.json");

function getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    getRequireWildcardCache = function() { return cache; };
    return cache;
}

function interopRequireWildcard(obj) {
    if (obj && obj.__esModule) { return obj; }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; }
    var cache = getRequireWildcardCache();
    if (cache && cache.has(obj)) { return cache.get(obj); }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } }
    newObj.default = obj;
    if (cache) { cache.set(obj, newObj); }
    return newObj;
}

// Plugin configuration importer.
let projectPackagePromise = null;

const getPluginConfig = projectRoot => {
    // Import only once.
    if (projectPackagePromise == null) {
        projectPackagePromise = Promise.resolve(`${(0, path.join)(projectRoot, 'package.json')}`).then(s => interopRequireWildcard(require(s))).then(pkgConfig => Object.entries(pkgConfig[package.name] || {}).map(([srcPattern, destPattern]) => [new RegExp(srcPattern, 'i'), destPattern]));
    }

    return projectPackagePromise;
}; // Exports.

const createFileLimitTableFromConfig = (limitTable, pluginConfig) => {
  let configFileType, configFileLimit;

  for (let i = 0; i < pluginConfig.length; i += 1) {
    configFileType = pluginConfig[i][0].toString().split('/').join('').slice(0, -1)
    configFileLimit = pluginConfig[i][1].toString()
    limitTable[configFileType] = configFileLimit
  }
}

const fileSizeValidator = new Validator({
    async validate({ asset, logger, options }) {
      const { projectRoot } = options;
      const pluginConfig = await getPluginConfig(projectRoot); // Walk through matchers until first hit, top to bottom.
      const limitTable = {};
      let sizeLimit, sizeUnit, fileSize;

      createFileLimitTableFromConfig(limitTable, pluginConfig);

      if (limitTable[asset.type] == undefined ) {
        return;
      } else { 
        let maxFileSize = limitTable[asset.type];
        let splitSizeAndUnit = maxFileSize.split(' ');
        [sizeLimit, sizeUnit] = splitSizeAndUnit;
      }

      switch(sizeUnit) {
        case 'KB':
          fileSize = asset.stats.size / 1024
          break;
        case 'MB':
          fileSize = (asset.stats.size / 1024) / 1024
          break;
        case 'GB':
          fileSize = ((asset.stats.size / 1024) / 1024 / 1024)
          break;
        default:
          console.log('Unsupported file unit!')
      }

      let filePath = asset.filePath.replace(`${projectRoot}`, "");
      let fileName = asset.filePath.replace(/^.*[\\\/]/, '')

      if (fileSize > sizeLimit) {
        logger.warn({
            name: "Exceeded maximum file size",
            message: `\n Warning: File has exceeded .${asset.type} ${sizeLimit} ${sizeUnit} size limit \n File name: ${fileName} \n File path: ${filePath} \n File size: ${fileSize.toFixed(2)} ${sizeUnit} \n`,
            filePath: filePath,
            language: asset.type,
        });
      }
    }
  });

exports.default = fileSizeValidator;
