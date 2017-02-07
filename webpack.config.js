module.exports = {
  //file to start with
  entry: [
    './index.ts', 
  ],

  //where compiled code should go
  output: {
    filename: "bundle.js", //combine it into this file
    path: __dirname + '/dist' //in this folder (`__dirname`)

  },

  //which files should be considered (add in `.ts`)
  //https://webpack.github.io/docs/configuration.html#resolve-extensions
  resolve: {
    // Add '.ts' as resolvable extensions.
    extensions: ["*", ".webpack.js", ".web.js", ".js", ".ts"]
  },  

  module: {
    loaders: [
      // send `.ts` files through the loader
      { 
        test: /\.ts$/, 
        loader: "awesome-typescript-loader" 
      },
      //send output `.js` files through source-map loader
      //(to reprocess source maps for debugging)
      { 
        test: /\.js$/, 
        loader: "source-map-loader",
        enforce: 'pre'
      }
    ]
  },  

  // Enable sourcemaps for debugging webpack's output
  devtool: "source-map",
}