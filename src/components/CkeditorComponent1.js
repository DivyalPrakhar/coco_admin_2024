import React, { useEffect, useRef } from 'react'
import CKEditor from 'ckeditor4-react';
import { BaseURL } from '../BaseUrl';

export const CkeditorComponent = ({onChange, defaultValue}) => {

    const editor =useRef()

    useEffect(() => {
    }, [])

    return(
            <CKEditor
                data={defaultValue}
                name="thiseditor"
                onChange={onChange}
                onNamespaceLoaded={ CKEDITOR => {
                   editor.current = CKEDITOR
                }}
                config={{
                    mathJaxClass:'mathTex',
                    mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
                    extraPlugins:'mathjax,codesnippet,tableresize,font,format',
                    // font_names:'Hindi/Kruti;',
                    extraAllowedContent:'p{font-family,font-size,line-height}',
                    imageUploadUrl: BaseURL + "/question-bank/image",
                }}

                onBeforeLoad={ CKEDITOR => {
                    // console.log('ckeditor', CKEDITOR.editorConfig)
                    CKEDITOR.plugins.addExternal( 'pramukhime', '/js/ckeditor/plugins/pramukhime', 'plugin.js' )
                }}
            />
    )
}