import { SetStatus } from "components/Status";
import Config from "config";

export type IpfsUploadResult = {
    ipfs: {
        hash: string;
    };
    name: string;
    byte_size: number;
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

            let formData = new FormData();
            formData.append("file", file);

            const ipfsResponse = await fetch(
                Config.ipfs.endpoint,
                { method: "POST", body: formData }
            );

            const ipfs = await ipfsResponse.json();
            console.log({ ipfs });
            if (!!ipfs.Hash) {
                setStatus({
                    success: "File uploaded",
                });
                return {
                    ipfs: {
                        hash: ipfs.Hash,
                    },
                    name: ipfs.Name,
                    byte_size: parseInt(ipfs.Size),
                };
            } else {
                if (ipfs.error) {
                    setStatus({
                        error: ipfs.error,
                    });
                } else {
                    setStatus({
                        error: "File upload failed!",
                    });
                }
            }
        }
    }
};