import React, { PureComponent } from "react";
import raf from "raf";
import hoistNonReactStatics from "hoist-non-react-statics";

// NB this is only an utility for the examples
export default (
  C,
  { refreshRate = 60 } = {}
) => {
  class TL extends PureComponent {
    static displayName = `timeLoop(${C.displayName || C.name || ""})`;
    state = {
      time: 0,
      tick: 0,
    };
    _r;
    componentDidMount() {
      let startTime, lastTime;
      let interval = 1000 / refreshRate;
      lastTime = -interval;
      const loop = (t) => {
        this._r = raf(loop);
        if (!startTime) startTime = t;
        if (t - lastTime > interval) {
          lastTime = t;
          this.setState({
            time: t - startTime,
            tick: this.state.tick + 1,
          });
        }
      };
      this._r = raf(loop);
    }
    componentWillUnmount() {
      raf.cancel(this._r);
    }
    render() {
      return <C {...this.props} {...this.state} />;
    }
  }

  hoistNonReactStatics(TL, C);

  return TL;
};
