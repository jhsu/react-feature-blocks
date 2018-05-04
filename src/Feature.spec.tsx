import { mount, shallow } from 'enzyme';
import * as React from 'react';

import { FeatureProvider } from './context';
import Feature from './Feature';
import FeatureOverlay from './FeatureOverlay';

jest.mock('react-dom', () => ({
  createPortal: jest.fn(() => null),
}));

describe('Feature', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should not render if a feature is not authorized', () => {
    const features = {
      hasFeature: () => false,
      showUnusedFeatures: false,
    };
    const wrapper = shallow(
      <div>
        <FeatureProvider value={features}>
          <Feature name='FEATURE_NAME'>
            NOT_SHOWN
          </Feature>
        </FeatureProvider>
      </div>
    );
    expect(wrapper.text()).not.toContain('NOT_SHOWN');
  });

  it('should render if a feature is authorized', () => {
    const features = {
      hasFeature: () => true,
      showUnusedFeatures: false,
    };
    const wrapper = mount(
      <div>
        <FeatureProvider value={features}>
          <Feature name='FEATURE_NAME'>
            <div>NOT_SHOWN</div>
          </Feature>
        </FeatureProvider>
      </div>
    );
    expect(wrapper.text()).toContain('NOT_SHOWN');
  });

  it('should render a placeholder when showing unused features', () => {
    const features = {
      hasFeature: () => false,
      showUnusedFeatures: true,
    };
    const wrapper = mount(
      <div>
        <FeatureProvider value={features}>
          <Feature name='UNUSED_FEATURE_NAME'>
            <div>NOT_SHOWN</div>
          </Feature>
        </FeatureProvider>
      </div>
    );
    expect(wrapper.find('[title="UNUSED_FEATURE_NAME"]')).toHaveLength(1);
  });

  it('should not render a placeholder when not showing unused features', () => {
    const features = {
      hasFeature: () => false,
      showUnusedFeatures: false,
    };
    const wrapper = mount(
      <div>
        <FeatureProvider value={features}>
          <Feature name='UNUSED_FEATURE_NAME'>
            <div>NOT_SHOWN</div>
          </Feature>
        </FeatureProvider>
      </div>
    );
    expect(wrapper.find('[title="UNUSED_FEATURE_NAME"]')).not.toHaveLength(1);
  });

  describe('portal', () => {
    it('renders an portal', () => {
      const features = {
        hasFeature: () => true,
        portal: true,
        showFeatures: true,
      };
      const portal = <span key='portal'>hello</span>;
      const ReactDOM = require('react-dom');
      ReactDOM.createPortal.mockImplementation(() => {
        return portal;
      });
      const wrapper = mount(
        <div>
          <FeatureProvider value={features}>
            <Feature name='OVERLAY_FEATURE'>
              <div>feature</div>
            </Feature>
          </FeatureProvider>
        </div>
      );
      expect(wrapper.contains(portal)).toBeTruthy();
    });

    it('renders a FeatureOverlay in the portal', (done) => {
      const features = {
        hasFeature: () => true,
        portal: true,
        showFeatures: true,
      };
      const FEATURE_NAME = 'OVERLAY_FEATURE';
      const portal = <span key='portal'>hello</span>;
      const ReactDOM = require('react-dom');
      ReactDOM.createPortal.mockImplementation((overlay) => {
        expect(overlay.type).toEqual(FeatureOverlay);
        expect(overlay.props.name).toEqual(FEATURE_NAME);
        expect(overlay).toBeTruthy();
        done();
        return portal;
      });
      mount(
        <div>
          <FeatureProvider value={features}>
            <Feature name={FEATURE_NAME}>
              <div>feature</div>
            </Feature>
          </FeatureProvider>
        </div>
      );
    });
  });
});
