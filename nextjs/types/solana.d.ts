export {};

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: (options?: {
        onlyIfTrusted: boolean;
      }) => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey?: {
        toString: () => string;
      };
      signMessage: (
        message: Uint8Array,
        display?: "utf8" | "hex"
      ) => Promise<{
        publicKey: {
          toString: () => string;
        };
        signature: Uint8Array;
      }>;
    };
  }
}
