/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import S3 from "aws-sdk/clients/s3"

const s3 = new S3({region: "us-east-1", credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!
}})

export default class ServerFunctions {
    public static uploadFile = async (file: string, content: any) => {
        const upload = await s3.upload({Body: content, Key: file, Bucket: "cuteanime"}).promise()
        return upload.Location
    }

    public static deleteFile = async (file: string) => {
        await s3.deleteObject({Key: file, Bucket: "cuteanime"}).promise()
    }
}