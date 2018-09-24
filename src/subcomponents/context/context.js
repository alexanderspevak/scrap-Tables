import React, { Component } from 'react';
import SizeCell from '../sizecell';

const LastVisitedContext = React.createContext();

export class LastVisitedProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      message: 'hello munchmallow',
    };
  }

  openSnackbar = message => {
    this.setState({
      message,
      isOpen: true,
    });
  };

  closeSnackbar = () => {
    this.setState({
      message: '',
      isOpen: false,
    });
  };

  render() {
    const { children } = this.props;

    return (
      <LastVisitedContext.Provider
        value={{
          openSnackbar: this.openSnackbar,
          closeSnackbar: this.closeSnackbar,
          snackbarIsOpen: this.state.isOpen,
          message: this.state.message,
        }}
      >
        <SizeCell/>
      
        {children}
      </LastVisitedContext.Provider>
    );
  }
}

export const LastVisitedConsumer = LastVisitedContext.Consumer;