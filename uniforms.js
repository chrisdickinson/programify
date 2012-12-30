module.exports = {
  'bool': iv1
, 'bvec2': iv2
, 'bvec3': iv3
, 'bvec4': iv4
, 'int': iv1
, 'ivec2': iv2
, 'ivec3': iv3
, 'ivec4': iv4
, 'float': fv1
, 'vec2': fv2
, 'vec3': fv3
, 'vec4': fv4
, 'mat2': mf2
, 'mat3': mf3
, 'mat4': mf4
, 'sampler1D': iv1
, 'sampler2D': iv1
, 'sampler3D': iv1
, 'samplerCube': iv1
, 'sampler1DShadow': iv1
, 'sampler2DShadow': iv1
}


function iv1(location, value) {
  gl.uniform1i(location, value)
}

function iv2(location, value) {
  gl.uniform2iv(location, value)
}

function iv3(location, value) {
  gl.uniform3iv(location, value)
}

function iv4(location, value) {
  gl.uniform4iv(location, value)
}

function fv1(location, value) {
  gl.uniform1f(location, value)
}

function fv2(location, value) {
  gl.uniform2fv(location, value)
}

function fv3(location, value) {
  gl.uniform3fv(location, value)
}

function fv4(location, value) {
  gl.uniform4fv(location, value)
}

function mf2(location, value) {
  gl.uniformMatrix2fv(location, self.transpose, value)
}

function mf3(location, value) {
  gl.uniformMatrix3fv(location, self.transpose, value)
}

function mf4(location, value) {
  gl.uniformMatrix4fv(location, self.transpose, value)
}
