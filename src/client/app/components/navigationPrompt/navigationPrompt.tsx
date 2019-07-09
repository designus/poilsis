import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { TransitionPromptHook } from 'history';
import { SaveModal } from '../modals/saveModal';

interface INavigationPromptProps extends RouteComponentProps<any> {
  when: boolean;
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
        nextLocation
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
      <SaveModal
        isModalOpen={this.state.openModal}
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
      />
    );
  }
}

export const NavigationPrompt = withRouter(NavigationPromptComponent);
