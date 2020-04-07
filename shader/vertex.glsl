uniform float time;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 pixels;
uniform vec2 uvRate1;

varying vec2 vUv;
varying vec4 vPosition;

void main() {
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mvPosition;
}
