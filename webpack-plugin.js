// Custom webpack plugin to patch the problematic module
class PatchRadixPlugin {
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap("PatchRadixPlugin", (factory) => {
      factory.hooks.afterResolve.tap("PatchRadixPlugin", (result) => {
        // Check if this is the problematic module
        if (result.resource && result.resource.includes("@radix-ui/react-use-effect-event")) {
          // Replace the module with our patched version
          result.resource = require.resolve("./components/radix-patched/use-effect-event.tsx")
        }
        return result
      })
    })
  }
}

module.exports = PatchRadixPlugin
