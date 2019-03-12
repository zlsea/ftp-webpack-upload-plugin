'use strict';
const PromiseFtp = require('promise-ftp');
const ftp = new PromiseFtp();
class FtpWebpackUploadPlugin {
    constructor(options) {
        this.init(options);
        this.ftpConfig = options.ftpConfig;
        this.uploadPath = options.uploadPath;
    }
    init(options) {
        if (!this.isObject(options)) {
            console.log('FTP:参数传入异常！');
            return false;
        }
        if (options.ftpConfig) {
            this.init(options.ftpConfig);
        }
        if (options.uploadPath) {
            this.init(options.uploadPath);
        }
    }
    isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    getFileType(filename) {
        if (/\.(css)(\?.*)?$/.test(filename)) {
            return this.uploadPath.css;
        }
        if (/\.(js)(\?.*)?$/.test(filename)) {
            return this.uploadPath.js;
        }
        if (/\.(png|jpe?g|gif|webp)(\?.*)?$/.test(filename)) {
            return this.uploadPath.img;
        }
        if (/\.(svg)(\?.*)?$/.test(filename)) {
            return this.uploadPath.font;
        }
        if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(filename)) {
            return this.uploadPath.font;
        }
        return false;
    }
    apply(compiler) {
        compiler.hooks.afterEmit.tap('FtpWebpackUploadPlugin', async compliation => {
            let assets = compliation.assets;
            let assetsKey = Object.keys(assets);
            try {
                await ftp.connect(this.ftpConfig);
            } catch (err) {
                console.log('ftp：连接错误');
                return;
            }
            for (var i = 0; i < assetsKey.length; i++) {
                let filename = assetsKey[i].split('/').pop();
                let path = this.getFileType(filename);
                if (path) {
                    console.log(path);
                    try {
                        await ftp.cwd(path);
                    } catch (e) {
                        try {
                            await ftp.mkdir(path);
                            await ftp.cwd(path);
                        } catch (e) {
                            console.log('ftp：目录新建失败');
                            return;
                        }
                    }
                    try {
                        await ftp.put(assets[assetsKey[i]].source(), filename);
                        console.log(filename, '上传成功！');
                    } catch (e) {
                        console.log(filename, '文件上传失败');
                    }
                }
            }
            ftp.end();
        });
    }
}
module.exports = FtpWebpackUploadPlugin;
