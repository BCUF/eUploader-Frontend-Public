/*
* Copyright (c) BCU Fribourg
*
* This file is part of eUploader-Frontend.
* eUploader-Frontend is free software: you can redistribute it and/or modify 
* it under the terms of the GNU General Public License as published by the 
* Free Software Foundation, either version 3 of the License, or (at your option) any later version.
* eUploader-Frontend is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
* without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
* See the GNU General Public License for more details.
* You should have received a copy of the GNU General Public License along with eUploader-Frontend. 
* If not, see <https://www.gnu.org/licenses/>.
*/

import CryptoES from 'crypto-es';

export class Utils {

    static formatBytes(bytes: any, decimals = 2) {
        if (!+bytes) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }
}

export class FileToSha256 {
    
    async sha256(file: File): Promise<string> {
        let sha256 = CryptoES.algo.SHA256.create();
        const sliceSize = 10_485_760; // 10 MiB
        let start = 0;

        while (start < file.size) {
            const slice: Uint8Array = await this.readSlice(file, start, sliceSize);
            const wordArray = CryptoES.lib.WordArray.create(slice);
            sha256 = sha256.update(wordArray);
            start += sliceSize;
        }

        sha256.finalize();

        return (sha256 as any)._hash.toString();
    }

    private async readSlice(file: File, start: number, size: number): Promise<Uint8Array> {
        return new Promise<Uint8Array>((resolve, reject) => {
            const fileReader = new FileReader();
            const slice = file.slice(start, start + size);

            fileReader.onload = () => resolve(new Uint8Array(fileReader.result as any));
            fileReader.onerror = reject;
            fileReader.readAsArrayBuffer(slice);
        });
    }

}
