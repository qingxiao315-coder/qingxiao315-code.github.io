export default {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'iOS >= 10',
        'Android >= 5',
        'Chrome >= 60',
        'Safari >= 10',
        'Firefox >= 60',
        'Edge >= 15'
      ]
    }
  }
}
