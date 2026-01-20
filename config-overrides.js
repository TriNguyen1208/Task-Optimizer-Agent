module.exports = function override(config, env) {
  // Allow imports from outside src/
  const oneOf = config.module.rules.find(rule => rule.oneOf)
  if (oneOf) {
    oneOf.oneOf.forEach(rule => {
      if (rule.include && !Array.isArray(rule.include)) {
        rule.include = [rule.include]
      }
      if (Array.isArray(rule.include)) {
        rule.include = rule.include.concat([
          /src/,
          /app/,
          /components/,
          /hooks/,
          /lib/
        ])
      }
    })
  }

  return config
}
