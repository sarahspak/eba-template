import React, { useEffect } from 'react';
import { Shaders, Node, GLSL } from 'gl-react';
import MersenneTwister from 'mersenne-twister';
import { Surface } from 'gl-react-dom';

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

const shaders = Shaders.create({
  main: {
    frag: GLSL`
precision highp float;
varying vec2 uv;
uniform float mod1;
uniform float mod2;
uniform float seed;
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
  return a + b*cos( 6.28318*(c*t+d) );
}
float cell (vec2 p) {
  float m = 2. + floor(32.0 * mod1 * (0.2 + seed));
  return mod(mod(p.x * (p.x + 32. * p.y), m * floor(1.0 + 64.0 * seed) + 1.), m);
}
void main() {
  float unzoom = 32.;
  vec2 offset = vec2(-.25 * unzoom, -2.);
  vec3 c = palette(mod2 + .1 * cell(floor(uv * unzoom + offset)), vec3(.5), vec3(.5), vec3(1.), vec3(1.0, .3, .5));
  gl_FragColor = vec4(c, 1.0);
}
  `,
  },
});

const CustomStyle = ({ block, attributesRef, width, height, mod1, mod2 }) => {
  useAttributes(attributesRef);

  const { hash } = block;

  const rng = new MersenneTwister(parseInt(hash.slice(0, 16), 16));

  return (
    <Node
      shader={shaders.main}
      uniforms={{
        mod1,
        mod2,
        seed: rng.random(),
      }}
    />
  );
};

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