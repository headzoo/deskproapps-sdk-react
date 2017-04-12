class AbstractCommand {
  /**
   * @param {ChildApp} childApp
   * @param {Object} options
   */
  handle = (childApp, options) => {
    throw new Error('handle must be overriden in a subclass');
  }
}

export default AbstractCommand;
