<script>
    import {imageTypes} from "./statics"
    import {getContext} from "svelte";

    const { API } = getContext("sdk")
    export let files
    export let onRemove
    export let multiple

    let currentFileIndex = 0
    let file

    $: hasFiles = files.length > 0
    $: isShowingMax = currentFileIndex === (files.length - 1)
    $: isShowingFirst = currentFileIndex === 0
    $: file = files?.[currentFileIndex] || files?.[0]
    $: url = file?.url.includes("http") ? file?.url : (window?.location?.origin || "") + file?.url
    $: isImage = imageTypes.includes(file?.extension)

    const changeCurrentAsset = (idx) => currentFileIndex = idx

    const onDownload = (file) => {
      let link = document.createElement("a");
      link.download = file.url;
      link.href = file.url;
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
</script>

{#if hasFiles}
    <div>
        <div class="budi-dz-results spectrum-Form-itemField">
            <div class="dz-res-arrow">
                {#if multiple}
                    <button disabled={isShowingFirst} on:click={() => changeCurrentAsset(currentFileIndex - 1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="height: 14px; width: 14px;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                {/if}
            </div>

            <div style="flex: 1 1 auto; height: 100%; padding: 6px; ">
                <div style="height: 100%;">

                    <div style="display: flex; flex-direction: column; align-items: start;">
                        <h4 class="spectrum-Heading spectrum-Heading--sizeXXS">{file?.name || "Untitled File"}</h4>

                        <div style="display: flex; flex-direction: row; width: 100%;">
                            <p style="font-size: 10px; color: #B3B3B3; flex: 1 1 auto; margin: 0; padding: 0;">({(file?.size || 0) / 1000} kb)</p>

                            <div style="display: flex; flex-direction: row;">
                                <button on:click={() => onDownload(file)} style="cursor: pointer; margin: 3px;" class="spectrum-Link spectrum-Link--quiet">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="height: 20px; width: 20px;">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </button>
                                <button style="cursor: pointer;" on:click={() => onRemove(file)} class="spectrum-Link spectrum-Link--quiet">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="height: 20px; width: 20px;">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                        </div>
                    </div>

                    <div style="display: flex; align-items: center; flex: 1; max-height: 100px; padding: 4px;">
                        {#if isImage}
                            <img src={url} alt={file?.name || "file"} style="max-height: 100px; max-width: 100%; margin: 0 auto;" />
                        {/if}
                        {#if !isImage}
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                 viewBox="0 0 370.32 370.32" xml:space="preserve" style="max-height: 100px; max-width: 100%; margin: 0 auto;" >
                                <g>
                                    <path d="M 320.816 63.219 L 261.94 4.339 C 259.156 1.561 255.39 0 251.457 0 H 74.271 C 58.219 0 45.16 13.06 45.16 29.112 v 312.095 c 0 16.053 13.059 29.113 29.111 29.113 h 221.777 c 16.052 0 29.111 -13.06 29.111 -29.113 V 73.703 C 325.16 69.769 323.6 65.998 320.816 63.219 z M 286 350 H 68 V 16 h 154.088 v 43.577 c 0 10.554 8.554 19.106 36.139 17.009 h 43.58 V 350 z"/>
                                    <text x="110" y="220" style="font: normal 70px serif; font-weight: bold;">{file?.extension?.toUpperCase() || ""}</text>
                                </g>
                            </svg>
                        {/if}
                    </div>
                </div>
            </div>

            <div class="dz-res-arrow">
                {#if multiple}
                    <button disabled={isShowingMax} on:click={() => changeCurrentAsset(currentFileIndex + 1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="height: 14px; width: 14px;">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                {/if}
            </div>
        </div>
        <p>file {currentFileIndex + 1} of {files.length}</p>
    </div>
{/if}

<style>
    .budi-dz-results {
        display: flex;
        border: 2px solid #4A4A4A50;
        border-radius: 4px;
        padding: 8px;
        height: 200px;
        margin-bottom: 10px;
        gap: 4px;
    }
    .budi-dz-results > .dz-res-arrow {
        flex: none;
        display: flex;
        align-items: center;
        height: 100%;
        background: transparent;
    }
    .budi-dz-results  button {
        cursor: pointer;
        display: flex;
        align-items: center;
        background-color: transparent;
        color: inherit;
        border: none;
    }
</style>
