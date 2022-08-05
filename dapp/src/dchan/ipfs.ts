import { SetStatus } from "components/Status";

export type IpfsUploadResult = {
    ipfs: {
        hash: string;
    };
    name: string
};

export async function upload(
    files: FileList,
    setStatus: SetStatus,
    ipfsEndpoint: string,
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
                    `${ipfsEndpoint}/add`,
                    { method: "POST", body: formData, referrer: "" }
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
                        name: ipfs.Name
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