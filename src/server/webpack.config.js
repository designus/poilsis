module.exports = (env) => {
  return require(`./webpack/${env}.config.js`)
}