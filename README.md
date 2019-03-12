# ftp-webpack-upload-plugin

>  support upload file to ftp server

## Install
```
npm i --save-dev ftp-webpack-upload-plugin
```

## Usage

```javascript
const FtpWebpackUploadPlugin = require('ftp-webpack-upload-plugin')

new FtpWebpackUploadPlugin({
       ftpConfig: {
           user: 'username',
           host: 'host',
           password: 'password'
       },
       uploadPath: {
            js: 'js path',
            css: 'css path',
            img: 'images path',
            font: 'font path'
       }
})
```

#### options

> uploadPath: accept String(Unified Path Upload) or Object(Subpath Upload)

          
