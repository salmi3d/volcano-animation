varying float vAlpha;

void main() {
  float a = 1. - smoothstep(0., .5, length(gl_PointCoord - vec2(.5, .5)));
  gl_FragColor = vec4(1., 0., 0., a * vAlpha);
}
