# Budibase Object Store Field

A Budibase component that allows uploading files to an object store service and attaches the payload to field - using any datasource.

Find out more about [Budibase](https://github.com/Budibase/budibase).

![Main Img](./assets/Screen%20Shot%202022-12-27%20at%2010.58.19%20AM.png)

---

## Config

![Config Image](./assets/Screen%20Shot%202022-12-27%20at%201.31.01%20PM.png)

Note: ```* = required field```
- Label: text label value for the field.
- *Field: any "long text" field in the form component schema.
- Default Value: select any field or binding that already has data.
- File Types: type of file; 
  - options:
    - Any
    - Image
    - Audio
    - Video
    - Custom
  - Custom Type (visible when the option "Custom" is selected for "File Type" setting)
    - e.g. image/png, text/csv etc.
- Multiple Files: setting to allow multiple uploads or single
- *Store As: select file storage; 
  - options:
    - AWS S3 Object - stores to AWS S3
      - fields
        - *S3 Data Source: select a s3 datasource user created in budibase
          - Note: must be true AWS s3 datasource
        - *Bucket Name: bucket name for s3 datasource
    - Budibase Minio Object - stores data to local budibase minio instance through api


___

## Instructions

To build your new  plugin run the following in your Budibase CLI:
```
budi plugins --build
```

You can also re-build everytime you make a change to your plugin with the command:
```
budi plugins --watch
```

---

## Requirements
- Must be placed within form element and/or field group
- LongTextField is required to link this field component
- If using AWS S3
  - create s3 datasource in budibase - no query needed
  - setup access permission and cors policy for bucket
    - Cors
      - ```
          [
            {
              "AllowedHeaders": ["*"],
              "AllowedMethods": [
                "GET",
                "PUT",
                "POST",
                "DELETE"
              ],
              "AllowedOrigins": [
                < origins >
              ],
              "ExposeHeaders": []
            }
          ]
        ```
    - Policy
      - ```
        {
          "Version": "2012-10-17",
           "Statement": [
              {
                "Sid": "AddPerm",
                "Effect": "Allow",
                "Principal": "*",
                "Action": [
                  "s3:PutObject",
                  "s3:GetObject"
                ],
                "Resource": "arn:aws:s3:::<bucket-name>/*"
              }
           ]
         }
        ```

___

