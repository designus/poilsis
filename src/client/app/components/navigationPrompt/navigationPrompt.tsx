import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { TransitionPromptHook } from 'history';

/**
 * A replacement component for the react-router `Prompt`.
 * Allows for more flexible dialogs.
 *
 * @example
 * <NavigationPrompt when={this.props.isDirty}>
 *   {(isOpen, onConfirm, onCancel) => (
 *     <Modal show={isOpen}>
 *       <div>
 *         <p>Do you really want to leave?</p>
 *         <button onClick={onCancel}>Cancel</button>
 *         <button onClick={onConfirm}>Ok</button>
 *       </div>
 *     </Modal>
 *   )}
 * </NavigationPrompt>
 */

interface INavigationPromptProps extends RouteComponentProps<any> {
  when: boolean;
  children: any;
}

class NavigationPromptComponent extends React.Component<INavigationPromptProps, any> {
  constructor(props) {
    super(props);
    this.state = { nextLocation: null, openModal: false };
  }

  unblock = null;

  componentDidMount() {
    this.unblock = this.props.history.block(this.shouldTransitionBeBlocked as TransitionPromptHook);
  }

  componentWillUnmount() {
    this.unblock();
  }

  shouldTransitionBeBlocked = (nextLocation) => {
    if (this.props.when) {
      this.setState({
        openModal: true,
        nextLocation,
      });
    }
    return !this.props.when;
  }

  onCancel = () => {
    this.setState({nextLocation: null, openModal: false});
  }

  onConfirm = () => {
    this.navigateToNextLocation();
  }

  navigateToNextLocation() {
    this.unblock();
    this.props.history.push(this.state.nextLocation.pathname);
  }

  render() {
    return (
      <div>
        {this.props.children(this.state.openModal, this.onConfirm, this.onCancel)}
      </div>
    );
  }
}

export const NavigationPrompt = withRouter(NavigationPromptComponent);
