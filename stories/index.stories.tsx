import * as React from 'react';

import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react';

import { Feature, FeatureConsumer } from '../src';

import FeatureCollector, { collectFeatures } from '../src/FeatureCollector';
import FeatureTracker, { IFeatureTrackerState } from '../src/FeatureTracker';


const FeatureFunction = ({ children  }) => {
  return <div>{children()}</div>;
}

const ToggleFeatures = () => {
  return <FeatureConsumer>
  {(f: IFeatureTrackerState) => {
    return <React.Fragment>
      <button onClick={f.toggleShowFeatures}>show features</button>
      <button onClick={f.toggleShowUnusedFeatures}>show unused features</button>
    </React.Fragment>;
  }}
  </FeatureConsumer>;
}

storiesOf('FeatureTracker', module)
  .add('show used features', () => {
    const features = {
      HELLO: true,
    };
    return <FeatureTracker features={features} showFeatures={true}>
      <ToggleFeatures />
      <Feature name='HELLO'>
        <h1>hello</h1>
      </Feature>
    </FeatureTracker>;
  })
  .add('show unused features', () => {
    const features = {
      HELLO: false,
    };
    return <FeatureTracker features={features} showUnusedFeatures={true}>
      <ToggleFeatures />
      <Feature name='HELLO'>
        <h1>hello</h1>
      </Feature>
    </FeatureTracker>;
  })
  .add('inspector', () => {
    const features = {
      GOOD_BYE: true,
      HELLO: true,
    };
    const rendered = <FeatureTracker features={features} showUnusedFeatures={true}>
    <FeatureCollector render={(children, featureTrees) => {
      return <React.Fragment>
        {children}
        <pre>{JSON.stringify(featureTrees)}</pre>
      </React.Fragment>;
    }}>
      <ToggleFeatures />
      <Feature name='HELLO'>
        <div>
          <h1>feature: HELLO</h1>
          <Feature name='GOOD_BYE'>
            <div>
              <h1>feature: GOOD_BYE</h1>
              <Feature name='SLEEPING'>
                <div>feature: SLEEPING</div>
              </Feature>
            </div>
          </Feature>

        <Feature name='NOPE' />
        <FeatureFunction>
          {() => <Feature name='HELLO'><span>YESSS</span></Feature>}
        </FeatureFunction>
        </div>
      </Feature>
      </FeatureCollector>
    </FeatureTracker>;
    console.log(collectFeatures(rendered));

    return rendered;
  })
  ;
