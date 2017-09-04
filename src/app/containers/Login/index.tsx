import * as React from 'react';
import { Helmet } from 'react-helmet';
import {setURL} from 'modules/url';
import { bindActionCreators } from 'redux';
import {Auth0Lock} from 'components/Auth0Lock';
const { connect } = require('react-redux');

interface IProps {
  setURL: Redux.ActionCreator<any>;
}

@connect(undefined, (dispatch) => ({
  setURL: bindActionCreators(setURL, dispatch),
}))
class Login extends React.Component<IProps, {}> {

  constructor(props) {
    super(props);
    this.loggedIn = this.loggedIn.bind(this);
  }

  private loggedIn() {
    this.props.setURL('');
  }

  public render() {
    return (
      <div>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <Auth0Lock onAuthenticated={this.loggedIn} />
      </div>
    );
  }
}

export { Login }
