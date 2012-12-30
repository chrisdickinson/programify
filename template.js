var Program = require('programify/program')

module.exports = function(gl) {
  return new Program(
    gl
  , TPL_STRUCTS
  , TPL_UNIFORMS
  , TPL_SOURCE
  , TPL_ATTRIBUTES
  ) 
}
