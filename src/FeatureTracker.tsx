import * as React from 'react';
import { FeatureProvider } from './context';

function isUndefined(val) {
  return (typeof val === 'undefined');
}

export interface IFeatures {
  [key: string]: boolean,
}

export interface IFeatureTracker {
  features: IFeatures;
  showFeatures?: boolean;
  showUnusedFeatures?: boolean;
}

export interface IFeatureTrackerState {
  features: IFeatures;
  featureTree: {};
  portal: any;
  showFeatures: boolean;
  showUnusedFeatures: boolean;

  hasFeature(featureName: string): boolean;
  toggleShowFeatures(): void;
  toggleShowUnusedFeatures(): void;
}

export default class FeatureTracker extends React.Component<IFeatureTracker, IFeatureTrackerState> {
  public static defaultProps = {
    features: [],
    showFeatures: false,
    showUnusedFeatures: false,
  };

  public static getDerivedStateFromProps(nextProps: IFeatureTracker, prevState: IFeatureTrackerState) {
    return {
      features: nextProps.features || prevState.features,
      showFeatures: isUndefined(nextProps.showFeatures) ? prevState.showFeatures : nextProps.showFeatures,
      showUnusedFeatures: isUndefined(nextProps.showUnusedFeatures) ? prevState.showUnusedFeatures : nextProps.showUnusedFeatures,
    };
  }

  public state = {
    features: this.props.features,
    featureTree: {},
    hasFeature: (featureName: string): boolean => {
      return !!this.state.features[featureName];
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
