import React, { useRef } from 'react';
import Sketch from 'react-p5';
import MersenneTwister from 'mersenne-twister';

/*
Create your Custom style to be turned into a EthBlock.art Mother NFT
Basic rules:
 - use a minimum of 1 and a maximum of 4 "modifiers", modifiers are values between 0 and 1,
 - use a minimum of 1 and a maximum of 3 colors, the color "background" will be set at the canvas root
 - Use the block as source of entropy, no Math.random() allowed!
 - You can use a "shuffle bag" using data from the block as seed, a MersenneTwister library is provided
 Arguments:
  - block: the blockData, in this example template you are given 3 different blocks to experiment with variations, check App.js to learn more
  - mod[1-3]: template modifier arguments with arbitrary defaults to get your started
  - color: template color argument with arbitrary default to get you started
Getting started:
 - Write p5.js code, comsuming the block data and modifier arguments,
   make it cool and use no random() internally, component must be pure, output deterministic
 - Customize the list of arguments as you wish, given the rules listed below
 - Provide a set of initial /default values for the implemented arguments, your preset.
 - Think about easter eggs / rare attributes, display something different every 100 blocks? display something unique with 1% chance?
 - check out p5.js documentation for examples!
*/

let DEFAULT_SIZE = 500;
const Y_AXIS = 1;
const X_AXIS = 2;
let b1, b2, c1, c2;

const CustomStyle = ({
  block,
  canvasRef,
  attributesRef,
  width,
  height,
  handleResize,
  mod1 = 0.75, // Example: replace any number in the code with mod1, mod2, or color values
  mod2 = 0.25,
  color1 = '#4f83f1',
  background = '#ccc',
}) => {
  const shuffleBag = useRef();
  const hoistedValue = useRef();

  const { hash } = block;

  // setup() initializes p5 and the canvas element, can be mostly ignored in our case (check draw())
  const setup = (p5, canvasParentRef) => {
    // Keep reference of canvas element for snapshots
    p5.createCanvas(width, height).parent(canvasParentRef);
    // Define colors
    b1 = p5.color(255);
    b2 = p5.color(0);
    c1 = p5.color(204, 102, 0);
    c2 = p5.color(0, 102, 153);
    p5.noLoop();
    
    
    canvasRef.current = p5;
    attributesRef.current = () => {
      return {
        // This is called when the final image is generated, when creator opens the Mint NFT modal.
        // should return an object structured following opensea/enjin metadata spec for attributes/properties
        // https://docs.opensea.io/docs/metadata-standards
        // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md#erc-1155-metadata-uri-json-schema

        attributes: [
          {
            display_type: 'number',
            trait_type: 'your trait here number',
            value: hoistedValue.current, // using the hoisted value from within the draw() method, stored in the ref.
          },

          {
            trait_type: 'your trait here text',
            value: 'replace me',
          },
        ],
      };
    };
  };
  
  
  // draw() is called right after setup and in a loop
  // disabling the loop prevents controls from working correctly
  // code must be deterministic so every loop instance results in the same output

  // Basic example of a drawing something using:
  // a) the block hash as initial seed (shuffleBag)
  // b) individual transactions in a block (seed)
  // c) custom parameters creators can customize (mod1, color1)
  // d) final drawing reacting to screen resizing (M)
  const draw = (p5) => {
    let WIDTH = width;
    let HEIGHT = height;
    let DIM = Math.min(WIDTH, HEIGHT);
    let M = DIM / DEFAULT_SIZE;

    p5.background(background);

    // reset shuffle bag
    let seed = parseInt(hash.slice(0, 16), 16);
    shuffleBag.current = new MersenneTwister(seed);
    let objs = block.transactions.map((t) => {
      let seed = parseInt(t.hash.slice(0, 16), 16);
      return {
        y: shuffleBag.current.random(),
        x: shuffleBag.current.random(),
        radius: seed / 1000000000000000,
      };
    });

    // example assignment of hoisted value to be used as NFT attribute later
    hoistedValue.current = 42;

    p5.fill(255, 255, 255);
    p5.stroke(255, 255, 255);
    objs.forEach((vals, index) => {
        var i = vals.radius * mod1;
        var w = vals.radius;
        var from = p5.map(vals.x, 0, .25, 0, width)
        console.log("from is ")
        console.log(from);
        var to = p5.map(vals.y, 0, .25, 0, height)



        var weight = p5.map(vals.radius, 0, 100, 0, 2);
        p5.strokeWeight(weight/2);
        
        p5.ellipse(from, to, from/10 + vals.x + w, i);
        p5.strokeWeight(weight);

        p5.line(from, vals.radius*10, from + vals.x + w, i);

    
    }
    )
    
    // // Background
    // setGradient(0, 0, WIDTH / 2, HEIGHT, b1, b2, X_AXIS);
    // setGradient(WIDTH / 2, 0, WIDTH / 2, HEIGHT, b2, b1, X_AXIS);
    // // Foreground
    // setGradient(50, 90, 540, 80, c1, c2, Y_AXIS);
    // setGradient(50, 190, 540, 80, c2, c1, X_AXIS);

    // function setGradient(x, y, w, h, c1, c2, axis) {
    //     p5.noFill();
      
    //     if (axis === Y_AXIS) {
    //       // Top to bottom gradient
    //       for (let i = y; i <= y + h; i++) {
    //         let inter = p5.map(i, y, y + h, 0, 1);
    //         let c = p5.lerpColor(color1, background, inter);
    //         p5.stroke(c);
    //         p5.line(x, i, x + w, i);
    //       }
    //     } else if (axis === X_AXIS) {
    //       // Left to right gradient
    //       for (let i = x; i <= x + w; i++) {
    //         let inter = p5.map(i, x, x + w, 0, 1);
    //         let c = p5.lerpColor(color1, background, inter);
    //         p5.stroke(c);
    //         p5.line(i, y, i, y + h);
    //       }
    //     }
    //   }

  };

  return <Sketch setup={setup} draw={draw} windowResized={handleResize} />;
};

export default CustomStyle;

const styleMetadata = {
  name: '',
  description: '',
  image: '',
  creator_name: '',
  options: {
    mod1: 0.4,
    mod2: 0.1,
    color1: '#fff000',
    background: '#000000',
  },
};

export { styleMetadata };
