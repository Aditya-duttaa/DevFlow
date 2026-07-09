import { Readable } from "node:stream";

import cloudinary from "../config/cloudinary.js";
import AppError from "../utils/AppError.js";

const uploadBuffer = (file, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto",
                use_filename: true,
                unique_filename: true
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }
        );

        Readable.from(file.buffer).pipe(stream);
    });
};

export const uploadFileToCloudinary = async (file, folder) => {
    if (!file) {
        throw new AppError("File is required", 400);
    }

    try {
        return uploadBuffer(file, folder);
    } catch {
        throw new AppError("Failed to upload file", 502);
    }
};

export const deleteFileFromCloudinary = async (publicId) => {
    if (!publicId) return;

    try {
        await Promise.allSettled([
            cloudinary.uploader.destroy(publicId, {
                resource_type: "image"
            }),
            cloudinary.uploader.destroy(publicId, {
                resource_type: "raw"
            }),
            cloudinary.uploader.destroy(publicId, {
                resource_type: "video"
            })
        ]);
    } catch {
        throw new AppError("Failed to delete uploaded file", 502);
    }
};
