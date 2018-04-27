import * as React from 'react';
import { FeatureProvider } from './context';

export interface IFeatures {
  [key: string]: boolean,
}

export interface IFeatureTracker {
  features: IFeatures;
}

export interface IFeatureTrackerState {
  enabledFeatures: IFeatures;
  showFeatures: boolean;
  showUnusedFeatures: boolean;
  portal: any;
  hasFeature(featureName: string): boolean;
  toggleShowFeatures(): void;
  toggleShowUnusedFeatures(): void;
}

export default class FeatureTracker extends React.Component<IFeatureTracker, IFeatureTrackerState> {
  public state = {
    enabledFeatures: this.props.features || {},
    hasFeature: (featureName: string): boolean => {
      return !!this.state.enabledFeatures[featureName];
    },
    portal: null,
    showFeatures: false,
    showUnusedFeatures: false,
    toggleShowFeatures: () => {
      this.setState(prevState => ({ showFeatures: !prevState.showFeatures }));
    },
    toggleShowUnusedFeatures: () => {
      this.setState(prevState => ({
        showUnusedFeatures: !prevState.showUnusedFeatures
      }));
    },
  };

  public componentWillReceiveProps(nextProps) {
    if (nextProps.features !== this.props.features) {
      this.setState({ enabledFeatures: nextProps.features });
    }
  }

  public setupPortal = el => {
    this.setState({ portal: el });
  };

  public render() {
    return (
      <FeatureProvider value={this.state}>
        <div ref={this.setupPortal} />
        {this.props.children}
      </FeatureProvider>
    );
  }
}
