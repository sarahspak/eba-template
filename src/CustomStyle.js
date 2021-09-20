import React, { PureComponent, Component } from "react";
import { Shaders, Node, GLSL, LinearCopy } from "gl-react";
import { Surface } from "gl-react-dom";
import JSON2D from "react-json2d";
import timeLoop from "../src/HOC/timeLoop";

const shaders = Shaders.create({
  animated: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t;
uniform float time, amp, freq, colorSeparation, moving;
vec2 lookup (vec2 offset) {
  return mod(
    uv + amp * vec2(
        cos(freq*(uv.x+offset.x)+time/1000.0),
        sin(freq*(uv.y+offset.x)+time/1000.0))
      + vec2( moving * time/10000.0, 0.0),
    vec2(1.0));
}
void main() {
  vec3 col =  mix(vec3(
    texture2D(t, lookup(vec2(colorSeparation))).r,
    texture2D(t, lookup(vec2(-colorSeparation))).g,
    texture2D(t, lookup(vec2(0.0))).b),  vec3(1.0), 0.1);
  gl_FragColor = vec4(col * vec3(
    0.5 + 0.5 * cos(uv.y + uv.x * 49.0),
    0.6 * uv.x + 0.2 * sin(uv.y * 30.0),
    1.0 - uv.x + 0.5 * cos(uv.y * 2.0)
  ), 1.0);
}
`
  }
});

const Funky = ({children: t}) => <Node shader={shaders.funky} uniforms={{t}} />;

class CustomStyle extends Component {
  render() {
    return (
        <Funky>
          <JSON2D width={1024} height={1024}>
          {{
            background: "#000",
            size: [ 400, 200 ],
            draws: [
              {
                textAlign: "center",
                fillStyle: "#fff",
                font: "48px bold Arial",
              },
              [ "fillText",
                "Hello World\n2d canvas text\ninjected as texture",
                200,
                60,
                56 ],
            ],
          }}
          </JSON2D>
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