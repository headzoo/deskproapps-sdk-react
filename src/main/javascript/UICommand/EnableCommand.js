import AbstractCommand from './AbstractCommand';

class EnableCommand extends AbstractCommand {
  /**
   * @param {ChildApp} childApp
   * @param {Object} options
   */
  handle = (childApp, options) => {

    if (typeof options !== 'object') { // todo handle this error
      return {};
    }

    const state = {};

    if (typeof options.options === 'boolean') {
      state.options = { visible: options.options };
    }

    if (typeof options.loader === 'boolean') {
      state.loader = { visible: options.loader };
    }

    return state;
  }
}

export default EnableCommand;
