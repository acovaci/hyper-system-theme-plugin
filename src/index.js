const electron = require('electron');

const DEBOUNCE_DELAY = 250;

let debounce = undefined;

const updateTheme = () => {
    console.log("updating theme");
    electron.BrowserWindow.getAllWindows().forEach((window) => {
        window.reload();
    });
};

const getSystemTheme = () => {
    return electron.nativeTheme.shouldUseDarkColors ? 'dark' : 'light';
};

module.exports.decorateConfig = (config) => {
    const darkConfig = config.darkConfigOverrides || {};
    const lightConfig = config.lightConfigOverrides || {};

    console.log("decorating config");

    electron.nativeTheme.on('updated', () => {
        console.log("native theme updated");

        if (debounce) {
            console.log("clearing debounce");
            clearTimeout(debounce);
        }

        debounce = setTimeout(() => {
            updateTheme();
        }, DEBOUNCE_DELAY);
    });

    return {
        ...config,
        ...getSystemTheme() === 'dark' ? darkConfig : lightConfig
    }
};
