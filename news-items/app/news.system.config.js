System.config({
  packages: {
    'news-items/app': {
      format: 'register',
      defaultExtension: 'js'
    },
  },
  map: {
    'escape.pipe': 'shared-modules/escape.pipe.js',
    'request.service': 'shared-modules/request.service.js'
  }
});
System.appArray.push('news-items/app/appStart');

SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs('~sitecollection/_catalogs/masterpage/custom/news-items/app/news.system.config.js');