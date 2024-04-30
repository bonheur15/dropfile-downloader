import fs from 'fs';
import http from 'http';
import url from 'url';
import path from 'path';


// 


fetch("https://dropload.io/api/file/direct_link?key="+process.env.DROPFILE_KEY+"&file_code=lvlfdypel8xt")
.then(response => response.json())
.then(async (data)=>{
    await DownloadFile({
        fileName:"thebeekeper.mp4",
        fileUrl:data.results.versions[0].url
    })
});


DownloadFile({
    fileName: "test4.zip",
    fileUrl: "http://ipv4.download.thinkbroadband.com/5MB.zip"
});
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

    const logMessage = (message) => {
        const log = `${new Date().toISOString()} - ${message}\n`;
        fs.appendFileSync(logFilePath, log);
        console.log(log);
    };

    logMessage(`Starting download of ${fileName}`);
    const startTime = new Date();
    http.get(fileUrl, (response) => {
        const totalSize = parseInt(response.headers['content-length'], 10);
        let downloadedSize = 0;

        response.on('data', (chunk) => {
            downloadedSize += chunk.length;
            const progress = (downloadedSize / totalSize) * 100;
            console.log(`Downloaded ${progress.toFixed(2)}%`);
        });

        const fileStream = fs.createWriteStream(downloadingPath);
        response.pipe(fileStream);


        fileStream.on('finish', () => {
            const endTime = new Date();
            const duration = (endTime - startTime) / 1000; // Duration in seconds
            logMessage(`Download of ${fileName} completed successfully in ${duration.toFixed(2)} seconds.`);
            fs.renameSync(downloadingPath, downloadedPath);
        });


    }).on('error', (err) => {
        logMessage(`Error downloading ${fileName}: ${err.message}`);
    });
}
