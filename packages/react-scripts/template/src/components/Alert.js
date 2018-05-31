import React from 'react';
import gluAlert from 'glu/alert';

import ViewWrapper from './ViewWrapper';

export default props => {
  const alertProps = {
    title: 'title',
    message: 'message',
    canDismiss: true,
    animate: false,
  };
  return <ViewWrapper {...props} view={gluAlert.danger('blah', alertProps)} />;
};
