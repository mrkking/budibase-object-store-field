/*******************************/
//        BUDIBASE
/*******************************/

const BudibaseStore = {
  // any table id works fine but user table always exists
  async upload(file, { API }) {
    const body = new FormData();
    body.append('file', file, file.name);
    const tableId = await API.getTables()
      .then(res => res.filter(t => t.name === "Users")[0]["_id"])
    return API.uploadAttachment({
      data: body,
      tableId,
    }).then(res => res?.[0])
  },
  async remove(file, { API }) {
    // any table id works fine but user table always exists
    const tableId = await API.getTables()
      .then(res => res.filter(t => t.name === "Users")[0]["_id"])
    return API.deleteAttachments({
      keys: [file.key],
      tableId
    })
  }
}

/*******************************/
//        AWS S3 FUNCTIONS
/*******************************/

const AWSS3Store = {
  upload(file, { API, s3Options }) {
    const { source, bucket } = s3Options
    return API.externalUpload({
      datasourceId: source,
      bucket: bucket,
      key: file.name,
      data: file
    }).then(({ publicUrl }) => ({
      extension: file.name.split(".")[1],
      url: publicUrl,
      name: file.name,
      key: publicUrl.split("/").at(-1),
      size: file.size
    }))
  },
  // unable to find appropriate function
  remove(file, { API, s3Options }) {
    // const { source, bucket } = s3Options
    // console.log(API);
    return Promise.resolve()
  }
}

export const StoreTypes = {
  "budibase-minio-object": BudibaseStore,
  "aws-s3-object": AWSS3Store
}

export async function createAttachments(files = [], options) {
  const { type } = options;
  const upload = StoreTypes[type]?.upload;
  return upload && Promise
    .all(files.map(file => upload(file, options)))
    // remove failed files
    .then(res => res.filter(r => !!r))
    // attach attachment type for rehydration
    .then(res => res.map(res => ({...res, attachmentType: type})))
}


export async function removeAttachment(fileInfo, options) {
  const { attachmentType } = fileInfo;
  const remove = StoreTypes[attachmentType]?.remove;
  return remove && remove(fileInfo, options)
}

export const fileTypes = {
  "Any": undefined,
  "Image": "image/*",
  "Audio": "audio/*",
  "Video": "video/*",
  "Other": ""
}

export const imageTypes = [
  "png",
  "jpg",
  "jpeg",
  "svg"
]

export function uuid() {
  let d = new Date().getTime();//Timestamp
  let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16;//random number between 0 and 16
    if(d > 0){//Use timestamp until depleted
      r = (d + r)%16 | 0;
      d = Math.floor(d/16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r)%16 | 0;
      d2 = Math.floor(d2/16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
