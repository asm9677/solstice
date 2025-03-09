// const { saveImageFromSignature } = require("./saveImage.js");
import { createCardPDA, getCardPDA, getImageChunks, saveImage, saveImageFromSignature, updateCardPDA } from "./saveImage.js";

const pendingQueue = [];
let isProcessing = false;

const sendEvent = async (event) => {
    pendingQueue.push(event);

    if (!isProcessing) {
        isProcessing = true;
        processPendingQueue().finally(() => {
            isProcessing = false;
        });
    }
}

const processPendingQueue = async () => {
    while (pendingQueue.length > 0) {
        const event = pendingQueue.shift();
        const signature = await saveImageFromSignature(`public/${event.path}`)

        let cardPDA = await getCardPDA(event.owner)
        if (cardPDA) {
            await updateCardPDA(event.owner, signature, event.fileExt)
        } else {
            await createCardPDA(event.owner, signature, event.fileExt)
        }
        // cardPDA = await getCardPDA(event.owner)
        // setTimeout(async () => {
        //     const buffer = await getImageChunks(cardPDA.latestImageTx)
        //     saveImage(`public/test.${event.fileExt}`, buffer)
        // }, 10000)
    }
}

const getCard = async (owner) => {
    let cardPDA = await getCardPDA(owner)
    if (cardPDA) {
        const buffer = await getImageChunks(cardPDA.latestImageTx)
        await saveImage(`public/test.${cardPDA.fileExt}`, buffer)
        return `public/test.${cardPDA.fileExt}`
    } else {
        return null
    }
}

const getPda = async (owner) => {
    let cardPDA = await getCardPDA(owner)
    return cardPDA
}
export { sendEvent, getCard, getPda }

// 3XVgztcLFUZ9HZJJiiYfdXYG4wMwNrh49FSYhivpgBGRdCLDuvh8mu4JX5BcAPwTePYEhs26QVeYZfmPyDGM1pDF
// createCard: 5jj4bTeXXBdXGNEF9QRmhBYgWJPemz7uKMfMgsPRQV7prVHhhtpqbRBAmXvFdNZuALE7uT9F1SL33jscUUhri5bC