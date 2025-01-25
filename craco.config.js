// mti-portal/craco.config.js

const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  typescript: {
    enableTypeChecking: true
  },
  eslint: {
    enable: true,
    mode: 'extends'
  }
};