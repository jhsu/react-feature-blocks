import * as React from 'react';
import { FeatureConsumer } from './context';
import Feature from './Feature';
import { IFeatureTrackerState } from './FeatureTracker';

export interface IFeatureTree {
  [key: string]: any;
}

export function collectFeatures(el: React.ReactElement<any>): IFeatureTree[] {
  if (!el || !el.props) {
    return [];
  };

  let childFeatures = [];
  React.Children.forEach(el.props.children, (child: React.ReactElement<any>) => {
    childFeatures = childFeatures.concat(collectFeatures(child));
  });
  if ( el.type !== Feature ) {
    return childFeatures;
  }
  return [{ [el.props.name]: childFeatures }];
}

export interface IFeatureCollectorChildArgs extends IFeatureTrackerState {
  featureTrees: IFeatureTree[];
}

export interface IFeatureCollectorProps {
  children: any;
  render(children: any, featureTrees: Array<{}>): any;
}


export default class FeatureCollector extends React.Component<IFeatureCollectorProps> {
  public render() {
    let featureTrees = [];
    React.Children.forEach(this.props.children, (child: React.ReactElement<any>) => {
      featureTrees = featureTrees.concat(collectFeatures(child));
    });
    return <FeatureConsumer>{(f: IFeatureTrackerState) => {
      return this.props.render(this.props.children, featureTrees);
    }}</FeatureConsumer>;
  }
}
