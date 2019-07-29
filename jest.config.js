
module.exports = {
  verbose: true,
  testEnvironment: "node",
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/(__tests__|test)/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}