import React, { Component, useEffect } from "react";
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";
import JSON2D from "react-json2d";

// shaders are from gl-react
// const shaders = Shaders.create({
//   funky: {
//     frag: GLSL`
// precision highp float;
// varying vec2 uv;
// uniform sampler2D t;
// void main() {
//   // this is for colors
//   gl_FragColor = texture2D(t, uv) * vec4(
//     0.5 + 0.5 * cos(uv.x * 30.0),
//     0.5 + 0.5 * sin(uv.y * 20.0),
//     0.1 + 0.3 * sin(uv.y * 8.0),
//     1.0);
//     // fract(sin(uv.x)*1.0));
// }
// ` }
// });
const shaders = Shaders.create({
  funky: {
    frag: GLSL`
precision highp float;
uniform float u_time; 
vec4 red(){
  return vec4(1.0,0.0,0.0,1.0);
}
void main() {
  // make it Green
  gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
  `}
});

const Funky = ({children: t}) => <Node shader={shaders.funky} uniforms={{t}} />;

class CustomStyle extends Component {
  render() {
    return (
        <Funky>

        </Funky>
    );
  }
};

// const CustomStyle = ({ block, attributesRef, width, height, mod1, mod2 }) => {
//   useAttributes(attributesRef);

//   const { hash } = block;

//   const rng = new MersenneTwister(parseInt(hash.slice(0, 16), 16));

//   return (
//     <Node
//       shader={shaders.main}
//       uniforms={{
//         mod1,
//         mod2,
//         seed: rng.random(),
//       }}
//     />
//   );
// };

function useAttributes(ref) {
  // Update custom attributes related to style when the modifiers change
  useEffect(() => {
    ref.current = () => {
      return {
        // This is called when the final image is generated, when creator opens the Mint NFT modal.
        // should return an object structured following opensea/enjin metadata spec for attributes/properties
        // https://docs.opensea.io/docs/metadata-standards
        // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema

        attributes: [
          {
            trait_type: 'your trait here text',
            value: 'replace me',
          },
        ],
      };
    };
  }, [ref]);
}

const Outer = function ({ width, height, innerCanvasRef, ...props }) {
  return (
    <Surface width={width} height={height} ref={innerCanvasRef}>
      <CustomStyle width={width} height={height} {...props} />
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
    mod1: 0.5,
    mod2: 0.5,
    color1: '#fff000',
  },
};
