import EnableCommand from './EnableCommand';
import OptionsCommand from './OptionsCommand';

function commandChain(executor)
{
  const chainLink = function (command, options) {
    executor(command, options);
    return { and: chainLink } ;
  };

  return chainLink;
}


/**
 * @param commandName
 * @return {AbstractCommand|null}
 */
function fromString(commandName) {
  switch (commandName) {
    case 'options':
      return new OptionsCommand();
    case 'enable':
      return new EnableCommand();
    default:
      return null;
  }
}

export { EnableCommand, OptionsCommand, fromString, commandChain };
