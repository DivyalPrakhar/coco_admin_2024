import React, { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { BaseURL } from '../BaseUrl';
 
export const BlogEditor = props => {
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
          console.log(editorRef.current.getContent());
        }
      }

    return (
        <>
         <Editor
         onEditorChange={e => props.onChange(e)}
         apiKey="hsdgovmvcu3phq504k9927nncuz5i767ls33ps7v26xnn0pp"
         onInit={(evt, editor) => editorRef.current = editor}
         value={props.value}
         init={{
           height: 400,
           images_upload_url: BaseURL +`/blog/image/tinymce`,
           automatic_uploads: true,
           //menubar: false,
           plugins: [
             'advlist autolink lists link quickimage image charmap print preview anchor',
             'searchreplace visualblocks advcode fullscreen',
             'insertdatetime media table advtable paste code help wordcount'
           ],
    
           toolbar: 'undo redo | code formatselect | font | fontselect fontsizeselect forecolor |' +
           'blockquote |bold italic underline strikethrough backcolor  | alignleft aligncenter ' +
           'alignright alignjustify | bullist numlist outdent indent | ' +
           'removeformat |visualaid help  ',
           content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
         }}
       />
       {/* <button onClick={log}>Log editor content</button> */}
     </>
    )
}
