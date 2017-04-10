import AbstractCommand from './AbstractCommand';

class OptionsCommand extends AbstractCommand {
  /**
   * @param {ChildApp} childApp
   * @param {Object} options
   */
  handle = (childApp, options) => {

    if (typeof options !== 'object') { // todo handle this error
      return {};
    }

    if (Object.prototype.hasOwnProperty.call(options, 'onSettings')) {
      childApp.setOnSettingsHandler(options.onSettings);
    }

    if (Object.prototype.hasOwnProperty.call(options, 'onRefresh')) {
      childApp.setOnRefreshHandler(options.onRefresh);
    }

    if (Object.prototype.hasOwnProperty.call(options, 'onCollapse')) {
      childApp.setOnCollapseHandler(options.onCollapse);
    }

    return {};
  }
}

export default OptionsCommand;
