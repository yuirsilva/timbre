function forceDownload(blob: string, filename: string) {
    var a = document.createElement("a");
    a.download = filename;
    a.href = blob;
    // For Firefox https://stackoverflow.com/a/32226068
    document.body.appendChild(a);
    a.click();
    a.remove();
}

export const downloadResource = async (
    url: string,
    filename: string,
    button: HTMLButtonElement
) => {
    const { gsap } = await import("@/lib/gsap");

    const download = button.querySelector(".download-button-download");
    const spinner = button.querySelector(".download-button-spinner");

    gsap.to(download, {
        scale: 0,
        opacity: 0,
    });
    gsap.to(spinner, {
        scale: 1,
        opacity: 1,
    });

    try {
        const response = await fetch(url, {
            headers: new Headers({ Origin: location.origin }),
            mode: "cors",
        });

        if (!response.ok) {
            throw new Error(
                `Download failed: ${response.status} ${response.statusText}`
            );
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);

        setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (e) {
        console.error(e);
    } finally {
        gsap.to(download, {
            scale: 1,
            opacity: 1,
        });
        gsap.to(spinner, {
            scale: 0,
            opacity: 0,
        });
    }
};

// https://utfs.io/f/<FILE_KEY>
export function formatFile(key: string) {
    return `https://utfs.io/f/${key}`;
}
