import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  return (
    <SessionProvider>
      <ImageKitProvider urlEndpoint={urlEndpoint}>{children}</ImageKitProvider>
    </SessionProvider>
  );
};

export default Providers;
