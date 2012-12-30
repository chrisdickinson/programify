module.exports = programify

var tokenizer = require('glsl-tokenizer')
  , parser = require('glsl-parser')
  , deparser = require('glsl-deparser')
  , concat_stream = require('concat-stream')
  , lang = require('cssauron-glsl')

var Path = require('path')
  , fs = require('fs')
  , Stream = require('stream').Stream

var check_storage = lang(':root > stmt > decl')
  , is_struct = lang(':root > stmt > decl > struct > ident')

var template = fs.readFileSync(Path.join(__dirname, 'template.js'), 'utf8')

function programify(inputs, output) {
  var source_code = concat_stream(output_all)
    , uniforms = []
    , attributes = []
    , structs = {}
    , idx = 0
    , current

  output = output || make_stream()
  current = inputs[0]

  iter()

  return output

  function iter() {
    if(idx === inputs.length) return
    if(current.vertex) { source_code.write('\n#ifdef VERTEX\n') }
    if(current.fragment) { source_code.write('\n#ifdef FRAGMENT\n') }

    current
      .pipe(tokenizer())
      .pipe(parser())
        .on('data', collect_storages)
      .pipe(deparser())
        .on('end', function() {
          if(current.vertex || current.fragment) { source_code.write('\n#endif\n') }

          current = inputs[++idx]
          process.nextTick(iter)
        })
      .pipe(source_code, {end: idx === inputs.length - 1})

    current.resume()
  }

  function collect_storages(node) {
    if(is_struct(node)) {
      structs[node.token.data] = node.parent
    }
    if(!check_storage(node)) return
    if(node.children[1].token.data === 'uniform') return uniforms.push(node)
    if(node.children[1].token.data === 'attribute') return attributes.push(node)
  }

  function output_all(err, data) {
    if(err) throw err

    var instance = template.replace(/TPL_SOURCE/, JSON.stringify(data))

    instance = instance.replace(/TPL_STRUCTS/, JSON.stringify(serialize_structs(structs)))
    instance = instance.replace(/TPL_UNIFORMS/, JSON.stringify(serialize(uniforms)))
    instance = instance.replace(/TPL_ATTRIBUTES/, create_attributes(attributes))

    output.write(instance)
  }

  return stream
}

function make_stream() {
  var stream = new Stream
  stream.readable = true
  stream.resume = function(){}
  return stream
}

function create_attributes(attrs) {
  return '""'
}

function serialize(any) {
  return iter({children: any})

  function iter(node) {
    var out = {type: node.type}

    if(node.type !== 'quantifier' && node.children.length) out.children = node.children.map(iter)
    if(node.data) out.data = node.data
    if(node.type === 'keyword') out.data = node.token.data
    if(node.type === 'placeholder') return null

    return out 
  }
}

function serialize_structs(structs) {
  var out = {}

  for(var key in structs) {
    out[key] = serialize(structs[key].children)
  }
  return out
}
