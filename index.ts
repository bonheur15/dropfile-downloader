import fs from 'fs';
import http from 'http';
import url from 'url';
import path from 'path';


// DownloadFile({
//     fileName: "test4.zip",
//     fileUrl: "http://ipv4.download.thinkbroadband.com/5MB.zip"
// });


async function ContructFileData({
    fileCode
}: {
    fileCode: string
}) {
    const dataFileName = await (await fetch("https://dropload.io/api/file/info?key=" + process.env.DROPFILE_KEY + "&file_code=" + fileCode)).json();
    const dataUrl = await (await fetch("https://dropload.io/api/file/direct_link?key=" + process.env.DROPFILE_KEY + "&file_code=" + fileCode)).json();
    DownloadFile({
        fileName: (dataFileName.result[0].file_title as string) + ".mp4",
        fileUrl: dataUrl.result.versions[0].url as string
    });
}
let Queque: string[] = [];

async function InitiateDownloadFile() {
    console.log(Queque);
    if (Queque.length > 0) {
        const fileCode = Queque.shift();
        await ContructFileData({
            fileCode: fileCode as string
        });
    }
}
async function main() {
    const dataFileList = await (await fetch("https://dropload.io/api/file/list?key=" + process.env.DROPFILE_KEY + "&fld_id=13673&page=4")).json();
    for (let i = 0; i < dataFileList.result.files.length; i++) {
        Queque.push(dataFileList.result.files[i].file_code as string);
    }
    await InitiateDownloadFile();
    await InitiateDownloadFile();

    await InitiateDownloadFile();

    await InitiateDownloadFile();

    await InitiateDownloadFile();

}
main().then(() => { });

async function DownloadFile({
    fileName,
    fileUrl
}: {
    fileName: string,
    fileUrl: string
}) {
    const downloadingPath = path.join(__dirname, 'downloading', fileName);
    const downloadedPath = path.join(__dirname, 'downloaded', fileName);
    const logFilePath = path.join(__dirname, 'download.log');

    const logMessage = (message: string) => {
        const log = `${new Date().toISOString()} - ${message}\n`;
        fs.appendFileSync(logFilePath, log);
        console.log(log);
    };

    logMessage(`Starting download of ${fileName}`);
    const startTime = new Date();
    http.get(fileUrl, (response) => {
        const fileStream = fs.createWriteStream(downloadingPath);
        response.pipe(fileStream);
        fileStream.on('finish', async () => {
            const endTime = new Date();
            const duration = ((endTime as unknown as number) - (startTime as unknown as number)) / 1000; // Duration in seconds
            logMessage(`Download of ${fileName} completed successfully in ${duration.toFixed(2)} seconds.`);
            fs.renameSync(downloadingPath, downloadedPath);
            await InitiateDownloadFile();
        });

    }).on('error', async (err) => {
        logMessage(`Error downloading ${fileName}: ${err.message}`);
        await InitiateDownloadFile();
    });
}
