import { mount } from 'enzyme';
import * as React from 'react';

import { FeatureConsumer } from './context';
import FeatureTracker, { IFeatureTrackerState } from './FeatureTracker';

describe('FeatureTracker', () => {
  it('should be able to check a features authorization', (done) => {
    const features = {
      DENIED: false,
      NAME: true,
    };
    const wrapper = mount(
      <FeatureTracker features={features}>
        <FeatureConsumer>
          {(f: IFeatureTrackerState) => {
            expect(f.hasFeature('DENIED')).toBeFalsy();
            expect(f.hasFeature('NAME')).toBeTruthy();
            done();
            return <div />;
          }}
        </FeatureConsumer>
       </FeatureTracker>
    );
  });

  it('should expose features', (done) => {
    const features = {
      DENIED: false,
      NAME: true,
    };
    const wrapper = mount(
      <FeatureTracker features={features}>
        <FeatureConsumer>
          {(f: IFeatureTrackerState) => {
            expect(f.enabledFeatures).toEqual(features);
            done();
            return <div />;
          }}
        </FeatureConsumer>
       </FeatureTracker>
    );
  });
});
