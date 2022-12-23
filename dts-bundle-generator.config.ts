const packageJson = require('./package.json');

const getPackageName = () => {
    return packageJson.name;
};

const config = {
    entries: [
        {
            filePath: './src/index.ts',
            outFile: `./dist/${getPackageName()}.d.ts`,
            noCheck: false,
        },
    ],
};

module.exports = config;
