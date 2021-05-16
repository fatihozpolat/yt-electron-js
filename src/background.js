'use strict'

import {app, protocol, BrowserWindow, ipcMain, Notification} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'

const fs = require('fs');
const path = require('path');
const slug = require('slug');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');

const DOWNLOAD_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'downloads/yt-electron-js/');
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
]);


let win;

async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        //if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }

    if (!fs.existsSync(DOWNLOAD_DIR)) {
        fs.mkdirSync(DOWNLOAD_DIR);
    }

    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}


ipcMain.on('yt:videoAra', async (e, aramaTerimi) => {
    const filters = await ytsr.getFilters(aramaTerimi);
    const filter = filters.get('Type').get('Video');
    const aramaSonuclari = await ytsr(filter.url, {
        pages: 1
    });
    win.webContents.send('sonuc:videoAra', aramaSonuclari)
});


ipcMain.on('yt:videoGetir', async (e, videoId) => {
    let url = 'http://www.youtube.com/watch?v=' + videoId;
    let info = await ytdl.getInfo(url);
    let formats = ytdl.filterFormats(info.formats, 'audioandvideo');
    let thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
    let title = info.videoDetails.title;
    let related_videos = info.related_videos;
    let mapped = formats.map(function (item) {
        return {
            src: item.url,
            resolution: item.qualityLabel
        }
    });
    win.webContents.send('sonuc:videoGetir', {videoSource: mapped, thumbnail, title, related_videos})
});


ipcMain.on('yt:videoKaynakGetir', async (e, videoUrl) => {
    let info = await ytdl.getInfo(videoUrl);
    let formats = ytdl.filterFormats(info.formats, 'audioandvideo');
    let thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
    let title = info.videoDetails.title;
    let mapped = formats.map(function (item) {
        return {
            src: item.url,
            resolution: item.qualityLabel,
            title: item.qualityLabel + ' - ' + title,
            thumbnail: thumbnail,
            itag: item.itag,
            percent: 0,
            isDownloading: false,
        }
    });
    win.webContents.send('sonuc:videoKaynakGetir', {videoSource: mapped, videoUrl})
});

ipcMain.on('yt:infodanIndir', async (e, data) => {
    let info = await ytdl.getInfo(data.info);

    let videoid = ytdl.getVideoID(data.info);
    let file_name = slug(info.videoDetails.title) + ' - ' + data.itag + '.mp4';
    let file_path = path.join(DOWNLOAD_DIR, file_name);

    const video = ytdl(data.info, {filter: format => format.itag === data.itag});
    video.pipe(fs.createWriteStream(file_path));

    video.once('response', () => {
        new Notification({
            title: 'Video indirilmeye başlandı!',
            body: ' indiriliyor: ' + info.videoDetails.title
        }).show();
    });

    video.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        win.webContents.send('sonuc:downloadStatus', {
            videoid,
            percent,
            itag: data.itag
        })
    });

    video.on('end', () => {
        new Notification({
            title: 'Video İndirildi!',
            body: info.videoDetails.title + ' videosu başarıyla indirildi!',
        }).show();
    });
});
