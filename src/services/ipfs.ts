import { SetStatus } from "src/components/Status";

export type IpfsUploadResult = {
    ipfs: {
        hash: string;
    };
};

export async function upload(
    files: FileList,
    setStatus: SetStatus
): Promise<IpfsUploadResult | undefined> {
    if (files) {
        const file = files[0];
        if (file) {
            setStatus({
                progress: "Uploading image...",
            });

            try {
                const formData = new FormData();
                formData.append("file", file);
                const ipfsResponse = await fetch(
                    `https://ipfs.4dchan.org/api/v0/add`,
                    { method: "POST", body: formData }
                );

                const ipfs = await ipfsResponse.json();

                console.log("ipfs.upload", { ipfsResponse });

                const hash = ipfs.Hash;
                if (hash) {
                    setStatus({
                        success: "File uploaded",
                    });
                    return {
                        ipfs: {
                            hash,
                        }
                    };
                } else {
                    setStatus({
                        error: "File upload failed!",
                    });
                }
            } catch (error) {
                console.error({ ipfsUpload: error })
                setStatus({
                    error: "File upload failed!",
                });
                return;
            }
        }
    }
};

export function getIPFSImgSrcs(hash: string) {
    return [
        `https://ipfs.4dchan.org/ipfs/${hash}`,
        `https://dweb.link/ipfs/${hash}`,
        `https://ipfs.io/ipfs/${hash}`,
        `ipfs://${hash}`
    ]
}