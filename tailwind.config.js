module.exports = {
    purge: {
      enabled: true, // true,
      content: ['./**/*.tsx'],
    },
    darkMode: 'media', // or 'media' or 'class'
    theme: {
      extend: {},
    },
    variants: {
      extend: {
        maxHeight: ['hover', 'responsive'],
        ringWidth: ['group-hover'],
        opacity: ['hover']
      },
    },
    plugins: [],
  }
  