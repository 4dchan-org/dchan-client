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
                let formData = new FormData();
                formData.append("file", file);
                const ipfsResponse = await fetch(
                    "https://ipfs.dchan.network/ipfs",
                    { method: "POST", body: formData }
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