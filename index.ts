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
}:{
    fileCode:string
}){
    const dataFileName = await (await fetch("https://dropload.io/api/file/info?key="+process.env.DROPFILE_KEY+"&file_code="+fileCode)).json();
    const dataUrl = await (await fetch("https://dropload.io/api/file/direct_link?key="+process.env.DROPFILE_KEY+"&file_code="+fileCode)).json();
    DownloadFile({
        fileName: (dataFileName.result[0].file_title as string)+".mp4",
        fileUrl: dataUrl.result.versions[0].url as string
    });
}

async function InitateDownloadFile(){

}
async function main() {
    await ContructFileData({
        fileCode: "wosjgjwcjygw"
    });
    await ContructFileData({
        fileCode: "kua1tb3vecmf"
    });
    await ContructFileData({
        fileCode: "bwp8ie7oww8k"
    });
    await ContructFileData({
        fileCode: "ybsnuqzhrenm"
    });
    await ContructFileData({
        fileCode: "gzvbe57bu3ip"
    });
}
main().then(() => {});

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
        const totalSize = parseInt(response.headers['content-length'] as string, 10);
        let downloadedSize = 0;

        // response.on('data', (chunk) => {
        //     downloadedSize += chunk.length;
        //     const progress = (downloadedSize / totalSize) * 100;
        //     console.log(`Downloaded ${progress.toFixed(2)}%`);
        // });

        const fileStream = fs.createWriteStream(downloadingPath);
        response.pipe(fileStream);


        fileStream.on('finish', () => {
            const endTime = new Date();
            const duration = ((endTime as unknown as number) - (startTime as unknown as number)) / 1000; // Duration in seconds
            logMessage(`Download of ${fileName} completed successfully in ${duration.toFixed(2)} seconds.`);
            fs.renameSync(downloadingPath, downloadedPath);
        });


    }).on('error', (err) => {
        logMessage(`Error downloading ${fileName}: ${err.message}`);
    });
}
