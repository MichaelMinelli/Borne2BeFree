const purgecss = require('@fullhuman/postcss-purgecss').purgeCSSPlugin({
  content: ['./src/**/*.js', './src/**/*.jsx', './public/**/*.html'],
  defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
});

module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
