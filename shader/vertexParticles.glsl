uniform float time;
uniform vec2 uMouse;

varying vec2 vUv;
varying float vAlpha;

attribute float angle;
attribute float life;
attribute float offset;

void main() {
  vUv = uv;

  float current = mod(offset + time / 2., life);
  float percent = current / life;

  vec3 newPos = position;

  vAlpha = smoothstep(0., 0.25, percent) - smoothstep(0.75, 1., percent);

  float dir = angle + sin(time / 10.);

  newPos.x += cos(dir) * current * 0.15;
  newPos.y += sin(dir) * current * 0.15;

  vec3 curPos = newPos;
  float mouseRadius = 0.15;
  float strength = 1. - smoothstep(0., 1., distance(curPos.xy, uMouse) / mouseRadius);
  float dx = uMouse.x - curPos.x;
  float dy = uMouse.y - curPos.y;
  float theta = atan(dy, dx);

  newPos.x += cos(theta) * strength * 0.5;
  newPos.y += sin(theta) * strength * 0.5;

  vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.);
  gl_PointSize = 10. * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}
