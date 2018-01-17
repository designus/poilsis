import * as React from 'react';
// import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import { IndexLink, Link } from 'react-router';

import { MainMenu } from '../../../components';
import {
  // initialDataProps,
  adminRoutes,
} from '../../../client-utils';
import { IAppState } from '../../../reducers';

// @asyncConnect([initialDataProps])
class ClientLayoutPageComponent extends React.Component<any, any> {

  render() {
    return (
      <div className="app-container">
        <div className="header">
          This is header
        </div>
        <div className="top-menu">
          {/* <IndexLink to="/" activeClassName="active">Home</IndexLink>&nbsp; */}
          <Link to="/pasiskelbti">Pasiskelbkite</Link>&nbsp;
          <Link to={adminRoutes.items.getLink()}>Admin</Link>
        </div>
        <div className="content">
          <MainMenu {...this.props} showSubmenu={true} />
          {React.cloneElement(this.props.children, {...this.props})}
        </div>
        <div className="footer">
          This is footer
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    citiesMap: state.cities.dataMap,
    typesMap: state.types.dataMap,
  };
};

export const ClientLayoutPage = connect(mapStateToProps)(ClientLayoutPageComponent);
