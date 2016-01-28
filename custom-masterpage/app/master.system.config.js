System.config({
  baseURL: _spPageContextInfo.siteAbsoluteUrl + '/_catalogs/masterpage/custom',
  packages: {
    'custom-masterpage/app': {
      format: 'register',
      defaultExtension: 'js'
    }
  },
  map: {
    'jquery': 'node_modules/jquery/dist/jquery.min.js'
  }
});

System.appArray = ['custom-masterpage/app/app'];

SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs('~sitecollection/_catalogs/masterpage/custom/custom-masterpage/app/master.system.config.js');