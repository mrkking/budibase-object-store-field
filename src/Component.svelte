<script>
  import {getContext, onDestroy, onMount} from "svelte"
  import FileViewer from "./FileViewer.svelte";
  import FileInput from "./FileInput.svelte";
  import {fileTypes, createAttachments, removeAttachment} from "./statics";

  export let customFileType
  export let field
  export let label
  export let fileType
  export let multiple
  export let saveAsUrl
  export let store
  export let s3DataSource
  export let s3Bucket
  export let value

  const { styleable, API } = getContext("sdk")
  const component = getContext("component")
  const formContext = getContext("form")
  const fieldGroupContext = getContext("field-group");
  const formStepContext = getContext("form-step");

  let fieldApi
  let fieldState
  $: labelPlacement = (fieldGroupContext?.labelPosition || "above") === "above" ?
          "" : `spectrum-FieldLabel--${fieldGroupContext?.labelPosition}`;

  const formApi = formContext?.formApi
  $: formStep = formStepContext ? $formStepContext || 1 : 1;
  $: formField = formApi?.registerField(
      field,
      "text",
      0,
      false,
      null,
      formStep
  );
  $: unsubscribe = formField?.subscribe((value) => {
    fieldState = value?.fieldState;
    fieldApi = value?.fieldApi;
  });
  fileType = customFileType ? customFileType : fileTypes[fileType]

  let files = []
  let isInBuilder = window.location.href.includes("app/preview")

  const getOptions = () => ({
    API,
    type: store && store.replace(/ /g, "-").toLowerCase(),
    s3Options: {
      source: s3DataSource,
      bucket: s3Bucket
    }
  })

  async function handleUpload(e)  {
    const { acceptedFiles } = e.detail

    if (!multiple && files.length > 0) await Promise.all(files.map(f => handleRemoveFile(f)))

    createAttachments(multiple ? acceptedFiles : [acceptedFiles[0]], getOptions()).then(uFiles => {
      files = multiple ? [
        ...files,
        ...uFiles
      ] : uFiles;
      // dehydrate files and set as value context
      fieldApi.setValue(JSON.stringify(files));
    })
  }

  function handleRemoveFile(file) {
    files = files.filter(f => f.key !== file.key);
    fieldApi.setValue(JSON.stringify(files));
    removeAttachment(file, getOptions())
            .catch(console.log);
  }

  onMount(function() {
    // rehydrate json string
    if (value || fieldState?.value) {
      try {
        let val = fieldState?.value
        // TODO: monitor - issue before on pg where brackets were removed
        val = value || (val[0] === "[" ? fieldState.value : `[${fieldState.value}]`);
        files = JSON.parse(val);
        files = files[0] === 0 ? [] : files;
      } catch (e) {
        files = []
      }
    }
  })

  onDestroy(function() {
    fieldApi?.deregister()
    unsubscribe?.()
  })
</script>

<div class="spectrum-Form-item" use:styleable={$component.styles}>
  {#if !!formContext}
    {#if !!fieldState}
      <label for="inp" class={`spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-Form-itemLabel ${labelPlacement}`}>
        {label || " "}
      </label>
      <div id="inp" class="spectrum-Form-itemField">
        <FileViewer multiple="{multiple}" onRemove={handleRemoveFile} files={files} />
        <FileInput disabled={isInBuilder} fileType={fileType} handleUpload={handleUpload} />
      </div>
    {:else}
      <p>Select form field.</p>
    {/if}
  {:else}
    <p>This component needs to be within a form.</p>
  {/if}
</div>
