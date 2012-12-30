module.exports = cli

var nopt = require('nopt')
  , tty = require('tty')
  , fs = require('fs')
  , Path = require('path')
  , programify = require('./index')
  , options
  , shorthand

options = {
  'help': Boolean
, 'vertex': Array
, 'fragment': Array
} 

shorthand = {
  '-v': '--vertex'
, '-f': '--fragment'
, '-h': '--help'
}

function help() {
/*

*/

  var str = help+''

  process.stdout.write(str.slice(str.indexOf('/*')+3, str.indexOf('*/')))
}

function cli() {
  var parsed = nopt(options, shorthand)
    , stdintty = tty.isatty(process.stdin)

  if(parsed.help || (!parsed.argv.remain.length && stdintty)) {
    return help(), process.exit(1)
  }

  var inputs = !stdintty ? [process.stdin] : parsed.argv.remain.map(to_stream)
    , fragments = !stdintty ? [] : (parsed.vertex || []).map(to_fragment_stream)
    , vertexes = !stdintty ? [] : (parsed.fragment || []).map(to_vertex_stream)

  inputs = inputs.concat(fragments).concat(vertexes)

  return programify(inputs, process.stdout)
}

function to_stream(p) {
  var stream = fs.createReadStream(Path.resolve(p))
  stream.filename = p
  stream.pause()
  return stream
}

function to_vertex_stream(p) {
  var out = to_stream(p)
  out.vertex = true
  return out
}

function to_fragment_stream(p) {
  var out = to_stream(p)
  out.fragment = true
  return out
}
