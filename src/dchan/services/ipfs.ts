import { SetStatus } from "dchan/components/Status";

export type IpfsUploadResult = {
    ipfs: {
        hash: string;
    };
};

export async function upload(
    files: FileList,
    setStatus: SetStatus
): Promise<IpfsUploadResult | undefined> {
    if (!!files) {
        const file = files[0];
        if (!!file) {
            setStatus({
                progress: "Uploading image...",
            });

            try {
                const ipfsResponse = await fetch(
                    "https://ipfs.4dchan.org/ipfs/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/octet-stream",
                        },
                        body: new Uint8Array(await file.arrayBuffer())
                    }
                );

                console.log("ipfs.upload", { ipfsResponse });

                const hash = ipfsResponse.headers.get('ipfs-hash');
                if (!!hash) {
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