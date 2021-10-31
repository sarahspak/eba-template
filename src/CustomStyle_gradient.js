import React, { Component, useEffect } from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";
import JSON2D from "react-json2d";
import timeLoop from "./HOC/timeLoop";

const shaders = Shaders.create({
  helloBlue: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform vec3 fromColor, toColor;
uniform float blue;
void main() {
  // gl_FragColor = vec4(uv.x, uv.y, blue, 1.0);
  float d = 2.0 * distance(uv, vec2(0.5));
  gl_FragColor = mix(
    vec4(mix(fromColor, toColor, d), 1.0),
    vec4(0.0),
    step(1.0, d)
  );
}`
}
});


class CustomStyle extends Component {
    render() {
      // const { time } = this.props;
      const { block, attributesRef, width, height, mod1, mod2 } = this.props;
      const { blue } = this.props;
      const { fromColor, toColor } = this.props;

      // an example to show we can grab info from blocks
      // const text = block.transactions[0].s;
      // console.log(text);
      return (
        <Node shader={shaders.helloBlue} uniforms={{ fromColor, toColor }} />);
    }
    static defaultProps = {
      fromColor: [ 0.5, 0, 1 ],
      toColor: [ 1, 0.5, 0 ],
    };
  };


// function useAttributes(ref) {
//   // Update custom attributes related to style when the modifiers change
//   useEffect(() => {
//     ref.current = () => {
//       return {
//         // This is called when the final image is generated, when creator opens the Mint NFT modal.
//         // should return an object structured following opensea/enjin metadata spec for attributes/properties
//         // https://docs.opensea.io/docs/metadata-standards
//         // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema

//         attributes: [
//           {
//             trait_type: 'your trait here text',
//             value: 'replace me',
//           },
//         ],
//       };
//     };
//   }, [ref]);
// }

const Outer = function ({ fromColor, toColor, width, height, innerCanvasRef, ...props }) {
  return (
    // look into surface - required for a "node",probs just a canvas but look into
    <Surface width={width} height={height} ref={innerCanvasRef}>
      <CustomStyle width={width} height={height} blue={0.5} {...props} fromColor={fromColor} toColor={toColor} />
    </Surface>
  );
};

export default Outer;

export const styleMetadata = {
  name: '',
  description: '',
  image: '',
  creator_name: '',
  options: {
    // mod1: 0.5,
    // mod2: 0.5,
    // color1: '#fff000',
  },
};
