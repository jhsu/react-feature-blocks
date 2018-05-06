import * as React from 'react';

import Feature from './Feature';

import {
  collectFeatures
} from './FeatureCollector';

describe('FeatureCollector', () => {
  describe('collectFeatures', () => {
    it('should get the root feature', () => {
      const el = <Feature name='hello' />;
      const featureTree = collectFeatures(el);
      expect(featureTree).toEqual([{ hello: [] }]);
    });

    it('should get a nested feature', () => {
      const el = <div><Feature name='hello' /></div>;
      const featureTree = collectFeatures(el);
      expect(featureTree).toEqual([{ hello: [] }]);
    });
    it('should get a nested features', () => {
      const el = <Feature name='hello'>
<Feature name='bye' />
      </Feature>;
      const featureTree = collectFeatures(el);
      expect(featureTree).toEqual([{ hello: [{ bye: [] }] }]);
    });
  });
});
