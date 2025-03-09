import { promises as fs } from "fs";

async function readImage(path) {
    try {
        const data = await fs.readFile(path);
        const byteArray = data.toJSON().data;

        return byteArray;
    } catch (error) {
        console.error(error);
    }
}

const splitIntoChunks = (byteArray, size) => {
    const chunks = [];
    let start = 0;
    const length = byteArray.length;

    while (start < length) {
        const chunk = byteArray.slice(start, start + size);
        chunks.push(chunk);
        start += size;
    }

    return chunks;
};

function deserializeImageChunkTransaction(buffer) {
    let offset = 0;

    // Anchor 프로그램을 사용한다면, 8바이트의 discriminator를 건너뛰어야 합니다.
    const DISCRIMINATOR_LENGTH = 8;
    offset += DISCRIMINATOR_LENGTH;

    // 1. vec<u8> chunkData
    // 배열 길이(u32, Little Endian)를 읽습니다.
    const chunkDataLength = buffer.readUInt32LE(offset);
    offset += 4;
    const chunkData = buffer.slice(offset, offset + chunkDataLength);
    offset += chunkDataLength;

    // 3. Option<string> childHash1
    let childHash1 = null;
    const hasChildHash1 = buffer.readUInt8(offset);
    offset += 1;
    if (hasChildHash1 === 1) {
        const strLength = buffer.readUInt32LE(offset);
        offset += 4;
        childHash1 = buffer.slice(offset, offset + strLength).toString('utf-8');
        offset += strLength;
    }

    // 4. Option<string> childHash2
    let childHash2 = null;
    const hasChildHash2 = buffer.readUInt8(offset);
    offset += 1;
    if (hasChildHash2 === 1) {
        const strLength = buffer.readUInt32LE(offset);
        offset += 4;
        childHash2 = buffer.slice(offset, offset + strLength).toString('utf-8');
        offset += strLength;
    }

    return {
        chunkData,
        childHash1,
        childHash2,
    };
}

async function saveImage(path, buffer) {
    await fs.writeFile(path, buffer);
    console.log(`${path} 저장 완료!`);
}

export { readImage, saveImage, deserializeImageChunkTransaction, splitIntoChunks };