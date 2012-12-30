# programify

transform glsl files into a require'able JS module -- requires the resulting module
to have `programify` on path.

```
programify [-v|--vertex vertex file] [-f|--fragment fragment file] [-h|--help] file, file...

  turn a series of glsl files into a `require`-able JS module.

  outputs the program on stdout.

  arguments:

    --vertex path, -v path    consider the file a vertex shader, and include it
                              in the output. 

    --fragment path, -f path  consider the file a fragment shader, and include it
                              in the output.
```

# uniforms

when you `require` the resulting module, you'll get a function taking a WebGLContext as
an argument -- and when executed, will return a `Program` object with linked uniforms,
attributes, and a program handle.

all uniforms will be available on the program as `program.uniforms.<name>` as getter/setter
objects. supports structs, lists, and all builtin types. you can even set all of the uniforms
at once using an object literal!

# installation

`npm install -g programify`

# license

MIT
