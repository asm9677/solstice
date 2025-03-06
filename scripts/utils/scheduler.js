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
        console.log(event)
        const signature = await saveImageFromSignature(`public/${event.path}`)
        console.log(signature)

        let cardPDA = await getCardPDA(event.owner)
        if (cardPDA) {
            await updateCardPDA(event.owner, signature, event.fileExt)
        } else {
            await createCardPDA(event.owner, signature, event.fileExt)
        }
        cardPDA = await getCardPDA(event.owner)
        // console.log(cardPDA.latestImageTx)
        setTimeout(async () => {
            const buffer = await getImageChunks(cardPDA.latestImageTx)
            saveImage(`public/test.${event.fileExt}`, buffer)
        }, 1000)

    }
}

export { sendEvent }

// 3XVgztcLFUZ9HZJJiiYfdXYG4wMwNrh49FSYhivpgBGRdCLDuvh8mu4JX5BcAPwTePYEhs26QVeYZfmPyDGM1pDF
// createCard: 5jj4bTeXXBdXGNEF9QRmhBYgWJPemz7uKMfMgsPRQV7prVHhhtpqbRBAmXvFdNZuALE7uT9F1SL33jscUUhri5bC