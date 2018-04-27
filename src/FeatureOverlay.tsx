import * as React from 'react';

export interface IFeatureOverlayProps {
  name: string;
  target: HTMLElement;
}

export default class FeatureOverlay extends React.Component<IFeatureOverlayProps> {
  private overlay: HTMLElement;
  public setPosition = target => {
    if (!this.overlay) {
      return;
    }
    const { left, top, width, height } = target.getBoundingClientRect();
    const {
      left: bodyLeft,
      top: bodyTop
    } = document.body.getBoundingClientRect();
    // NOTE: this has to happen on componentDidUpdate in order to calculate after
    // initial layout computation and positioning.
    this.overlay.style.height = `${height}px`;
    this.overlay.style.width = `${width}px`;
    this.overlay.style.top = `${top - bodyTop}px`;
    this.overlay.style.left = `${left - bodyLeft}px`;
  };

  public componentDidUpdate() {
    const { target } = this.props;
    if (target) {
      this.setPosition(target);
    }
  }

  public setupRef = el => {
    this.overlay = el;
    const { target } = this.props;
    if (target) {
      this.setPosition(target);
    }
  };

  public render() {
    const { name } = this.props;
    return (
      <div
        style={{
          backgroundColor: "#efefef",
          border: "1px dotted green",
          boxSizing: "border-box",
          color: "#888",
          fontSize: 10,
          fontWeight: "bold",
          overflow: "visible",
          position: "absolute",
          textAlign: "center",
          zIndex: 666,
        }}
        ref={this.setupRef}
      >
        {name}
      </div>
    );
  }
}
