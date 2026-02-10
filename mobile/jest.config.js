/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@shopify/flash-list|@tanstack/react-query|zustand|yup|zod)',
  ],
  collectCoverageFrom: [
    'utils/**/*.ts',
    'schemas/**/*.ts',
    'store/**/*.ts',
    'services/**/*.ts',
    'repositories/**/*.ts',
    'hooks/**/*.ts',
    'components/**/*.{ts,tsx}',
    '!**/*.styles.ts',
    '!**/index.ts',
  ],
};
