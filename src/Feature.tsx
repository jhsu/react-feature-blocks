import * as React from 'react';
import { createPortal } from 'react-dom';

import { FeatureConsumer } from './context';
import FeatureOverlay from './FeatureOverlay';
import { IFeatureTrackerState } from './FeatureTracker';

export interface IFeatureProps {
  name: string;
}

export interface IFeatureState {
  featureContent: Element;
}
export default class Feature extends React.Component<IFeatureProps, IFeatureState> {
  public state = {
    featureContent: null
  };

  public mountedFeatureContent = el => {
    this.setState({ featureContent: el });
  };

  public render() {
    return (
      <FeatureConsumer>
        {(f: IFeatureTrackerState) => {
          if (!f.hasFeature(this.props.name)) {
            return f.showUnusedFeatures ? (
              <div
                style={{ opacity: 0.2, backgroundColor: "yellow" }}
                title={this.props.name}
              >
                {this.props.name}
              </div>
            ) : null;
          }
          const element = React.Children.only(this.props.children);
          const child = React.cloneElement(element, {
            key: "feature-element",
            ref: this.mountedFeatureContent,
          });
          const featureInfo = f.portal
            ? createPortal(
                <FeatureOverlay
                  name={this.props.name}
                  target={this.state.featureContent}
                />,
                f.portal
              )
            : null;
          return f.showFeatures ? [featureInfo, child] : [child];
        }}
      </FeatureConsumer>
    );
  }
}
