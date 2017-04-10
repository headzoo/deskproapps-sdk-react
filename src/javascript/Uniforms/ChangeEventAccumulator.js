const emptyObject = {};
/**
 * An event listener that combines two successive onChange and onChangeModel events and then calls a handler
 *
 */
class ChangeEventAccumulator {
  constructor() {
    this.state = {
      action: 'waitForOnChange',
      changedKey: emptyObject,
      newValue: emptyObject,
      newModel: emptyObject
    };
  }

  onChange =(onChangeHandler, ...args) => {
    const { action } = this.state;

    // onChange
    if (args.length === 2 && action === 'waitForOnChange') {
      this.state.changedKey = args[0];
      this.state.newValue = args[1];
      this.state.action = 'waitForOnChangeModel';
    }

    // onChangeModel
    if (args.length === 1 && action === 'waitForOnChangeModel') {
      this.state.newModel = args[0];
      this.state.action = 'invokeOnChange';
    }

    if (this.state.action === 'invokeOnChange') {
      const { changedKey, newValue, newModel } = this.state;
      this.state = { action: 'waitForOnChange', changedKey: emptyObject, newValue: emptyObject, newModel: emptyObject };
      onChangeHandler(changedKey, newValue, newModel);
    }
  }
}

export default ChangeEventAccumulator;
