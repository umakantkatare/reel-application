
export interface ImageKitAuthParams {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
}

export const authenticator = async (): Promise<ImageKitAuthParams> => {
  try {
    const response = await fetch("/api/upload-auth");

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();

    return {
      signature: data.signature,
      expire: data.expire,
      token: data.token,
      publicKey: data.publicKey,
    };
  } catch (error) {
    console.error("Authentication error:", error);

    throw new Error("Authentication request failed");
  }
};
