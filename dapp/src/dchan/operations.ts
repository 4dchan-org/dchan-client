import { SetStatus } from "components/Status";
import { sendMessage } from "dchan";
import { DateTime } from "luxon";
import { IpfsUploadResult, upload } from "./ipfs";

type PostCreateInput = {
    board?: string;
    thread?: string;
    file: FileList;
    is_nsfw: boolean;
    is_spoiler: boolean;
    name: string;
    subject: string;
    comment: string;
};

type BoardCreateInput = {
    title: string;
    name: string;
};

type PostCreateData = {
    board?: string;
    thread?: string;
    comment: string;
    file?: {
        byte_size: number;
        ipfs: {
            hash: string;
        };
        name: string;
        is_nsfw: boolean;
        is_spoiler: boolean;
    };
    from: {
        name: string;
    };
    subject: string;
};

export async function postMessage(
    input: PostCreateInput,
    accounts: any,
    setStatus: SetStatus
) {
    const { board, thread, comment, name, subject } = input;

    let file: IpfsUploadResult | undefined;
    if (input.file.length > 0) {
        file = await upload(input.file, setStatus);
        if (!file) {
            return;
        }
    }

    const data: PostCreateData = {
        comment,
        from: {
            name,
        },
        subject,
    };

    if (!!file) {
        data.file = {
            ...file,
            is_nsfw: input.is_nsfw,
            is_spoiler: input.is_spoiler,
        };
    }
    if (!!thread) {
        data.thread = thread;
    }
    if (!!board) {
        data.board = board;
    }

    try {
        setStatus({
            progress: "Sending...",
        });

        const result = await sendMessage("post:create", data, accounts[0]);

        setStatus({
            success: "Sent ;)",
        });

        return result
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function removePost(id: string, accounts: any, setStatus: SetStatus) {
    try {
        setStatus({
            progress: "Removing..."
        });

        await sendMessage("post:remove", { id }, accounts[0]);

        setStatus({
            success: "Removed"
        });
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function reportPost(id: string, accounts: any, setStatus: SetStatus) {
    try {
        setStatus({
            progress: "Reporting..."
        });

        await sendMessage("post:report", { id }, accounts[0]);

        setStatus({
            success: "Reported"
        });
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function createBoard(
    data: BoardCreateInput,
    accounts: any,
    setStatus: SetStatus
) {
    try {
        setStatus({
            progress: "Creating..."
        });

        const result = await sendMessage("board:create", data, accounts[0]);

        setStatus({
            success: "Created"
        });

        return result
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function removeBoard(id: string, accounts: any, setStatus: SetStatus) {
    try {
        setStatus({
            progress: "Removing..."
        });

        await sendMessage("board:remove", { id }, accounts[0]);

        setStatus({
            success: "Removed"
        });
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function lockBoard(id: string, accounts: any, setStatus: SetStatus) {
    try {
        setStatus({
            progress: "Locking..."
        });

        await sendMessage("board:lock", { id }, accounts[0]);

        setStatus({
            success: "Locked"
        });
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function unlockBoard(id: string, accounts: any, setStatus: SetStatus) {
    try {
        setStatus({
            progress: "Unlocking..."
        });

        await sendMessage("board:unlock", { id }, accounts[0]);

        setStatus({
            success: "Unlocked"
        });
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function lockThread(id: string, accounts: any, setStatus: SetStatus) {
    try {
        setStatus({
            progress: "Locking..."
        });

        await sendMessage("thread:lock", { id }, accounts[0]);

        setStatus({
            success: "Locked"
        });
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function unlockThread(id: string, accounts: any, setStatus: SetStatus) {
    try {
        setStatus({
            progress: "Unlocking..."
        });

        await sendMessage("thread:unlock", { id }, accounts[0]);

        setStatus({
            success: "Unlocked"
        });
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function pinThread(id: string, accounts: any, setStatus: SetStatus) {
    try {
        setStatus({
            progress: "Pinning..."
        });

        await sendMessage("thread:pin", { id }, accounts[0]);

        setStatus({
            success: "Pinned"
        });
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function unpinThread(id: string, accounts: any, setStatus: SetStatus) {
    try {
        setStatus({
            progress: "Unpinning..."
        });

        await sendMessage("thread:unpin", { id }, accounts[0]);

        setStatus({
            success: "Unpinned"
        });
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function banPost(id: string, accounts: any, setStatus: SetStatus) {
    try {
        setStatus({
            progress: "Banning..."
        });

        const secondsStr = window.prompt("How many seconds?")
        const seconds = parseInt(secondsStr || "")
        if (seconds == NaN) {
            setStatus({
                error: `Not a number: ${secondsStr}`
            })
            return
        }

        const reason = window.prompt("Reason?")

        const until = DateTime.fromSeconds(DateTime.now().toSeconds() + seconds)
        if (window.confirm(`Banning until ${until.toISO()}`)) {
            await sendMessage("post:ban", { id, seconds, reason }, accounts[0]);

            setStatus({
                success: "Banned"
            });
        } else {
            setStatus("Canceled")
        }
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}

export async function unbanUser(id: string, accounts: any, setStatus: SetStatus) {
    try {
        setStatus({
            progress: "Unbanning..."
        });

        await sendMessage("user:unban", { id }, accounts[0]);

        setStatus({
            success: "Unbanned"
        });
    } catch (error) {
        setStatus({ error });

        console.error({ error });
    }
}