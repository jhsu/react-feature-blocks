import * as React from 'react';
import { FeatureConsumer } from './context';
import Feature from './Feature';
import { IFeatureTrackerState } from './FeatureTracker';

export interface IFeatureTree {
  [key: string]: {};
}

export function collectFeatures(el: React.ReactElement<any>): IFeatureTree {
  if (!el || !el.props) {
    return {};
  };
  let collected = {};

  React.Children.forEach(el.props.children, (child: React.ReactElement<any>) => {
    if (!child.type) {
      return;
    }
    if (child.type === Feature) {
      collected = {
        ...collected,
        [child.props.name]: collectFeatures(child),
      };
    } else {
      collected = {
        ...collected,
        ...collectFeatures(child),
      };
    }
  });
  return collected;
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
    const featureTrees = React.Children.map(this.props.children, (child: React.ReactElement<any>) => collectFeatures(child));
    return <FeatureConsumer>{(f: IFeatureTrackerState) => {
      return this.props.render(this.props.children, featureTrees);
    }}</FeatureConsumer>;
  }
}
