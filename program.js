module.exports = Program

var uniforms = require('./uniforms')

function Program(gl, structs, uniforms, source, attributes) {
  this.gl = gl

  this._handle =
  this._vertex =
  this._fragment = null

  this._structs = structs
  this._uniforms = uniforms
  this._source = source
  this._attributes = attributes

  this._cache = {}

  this.transpose = false

  this._compile()
}

var cons = Program
  , proto = cons.prototype

proto._compile = function() {
  var self = this
    , gl = self.gl

  self._handle = gl.createProgram()
  self._vertex = gl.createShader(gl.VERTEX_SHADER)
  self._fragment = gl.createShader(gl.FRAGMENT_SHADER)

  gl.shaderSource(self._vertex, '#define VERTEX\n'+self._source)
  gl.shaderSource(self._fragment, '#define FRAGMENT\n'+self._source)

  gl.compileShader(self._vertex)
  gl.compileShader(self._fragment)

  gl.attachShader(self._handle, self._vertex)
  gl.attachShader(self._handle, self._fragment)

  gl.linkProgram(self._handle)

  // deal with the uniforms and structs...

  declstruct(self, {children: [null].concat(self._uniforms.children)}, [], 'uniforms', true)

  function declare(output, name, decls) {
    var type
      , decl
      , list

    for(var i = 0, len = decls.length; i < len; ++i) {
      decl = decls[i]
      type = decl.children[4].type === 'ident' ? structs[decl.children[4].data] : decl.children[4]
      list = decl.children[5].children

      entries()
    }

    function entries() {
      for(var i = 0, len = list.length; i < len; ++i) {
        if(list[i + 1] && list[i + 1].type === 'quantifier') {
          decllist(output, type, name, list[i].data, type.type === 'keyword' ? declbuiltin : declstruct)
          i += 1
        } else if(type.type === 'keyword') {
          declbuiltin(output, type, name, list[i].data)
        } else {
          declstruct(output, type, name, list[i].data)
        }
      } 
    }
  }

  function decllist(output, type, name, property, decl) {
    var length = find_length()
      , values = {} 
    
    name = name.slice().concat([property])
    values.length = length

    for(var i = 0, len = values.length; i < len; ++i) {
      decl(values, type, name, i)
    }

    Object.defineProperty(output, property, {
        get: get
      , set: set
      , enumerable: true
    })

    function get() {
      return values
    }

    function set(v) {
      for(var i = 0, len = length; i < len; ++i) {
        values[i] = v[i]
      }
      return values
    }

    function find_length() {
      var i = 0
      while(gl.getUniformLocation(self._program, (name.concat(['.', property]).join('')+'['+(i++)+']').slice(1)) !== null);
      return i 
    }
  }

  function declbuiltin(output, type, name, property) {
    if(isNaN(property)) {
      name = name.concat(['.', property]).join('')
    } else {
      name = name.concat(['['+property+']']).join('')  
    }

    console.log(setter+'', name)
    var loc = gl.getUniformLocation(self._handle, name.replace(/^\./, ''))
      , value = null
      , setter

    setter = Function('gl', 'return '+uniforms[type.data])(gl)

    return Object.defineProperty(output, property, {
      enumerable: true
    , get: function() { return value }
    , set: function(v) {
        value = v

        setter(loc, v)
        return value
      }
    })
  }

  function declstruct(output, type, name, property, omit) {
    var value = {}

    declare(value, omit ? name : name.concat(['.', property]), type.children.slice(1))

    return Object.defineProperty(output, property, {
      enumerable: true
    , get: get
    , set: set
    })

    function get() {
      return value
    }

    function set(v) {
      for(var key in v) {
        value[key] = v[key]
      }
      return v
    }
  }
}

proto.get_uniform = function(name) {
  if(this._cache[name]) return this._cache[name]

  return this._cache[name] = gl.getUniformLocation(name)
}
