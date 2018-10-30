/* eslint-disable react/forbid-prop-types */

import PropTypes from 'prop-types';
import React from 'react';
import { Region } from 'backbone.marionette';

/**
 * Copied from https://stash.us-bottomline.root.bottomline.com/projects/PXLAB/
 * Replace when the component is moved to a shared repo.
 */

class ViewWrapper extends React.PureComponent {
  componentDidMount() {
    this.viewRegion = new Region({ el: this.wrapper });
    this.viewRegion.show(this.props.view);

    if (this.props.onMount) {
      this.props.onMount(this.props.view);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.view.cid === prevProps.view.cid) {
      return;
    }

    if (this.props.onBeforeUnmount) {
      this.props.onBeforeUnmount(prevProps.view);
    }

    this.viewRegion.show(this.props.view);

    if (this.props.onMount) {
      this.props.onMount(this.props.view);
    }
  }

  componentWillUnmount() {
    if (this.props.onBeforeUnmount) {
      this.props.onBeforeUnmount(this.props.view);
    }

    this.viewRegion.reset();
    this.viewRegion.close();
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={wrapper => {
          this.wrapper = wrapper;
        }}
      />
    );
  }
}

ViewWrapper.propTypes = {
  view: PropTypes.object.isRequired,
  className: PropTypes.string,
  onMount: PropTypes.func,
  onBeforeUnmount: PropTypes.func
};

ViewWrapper.defaultProps = {
  className: '',
  onMount: null,
  onBeforeUnmount: null
};

export default ViewWrapper;
