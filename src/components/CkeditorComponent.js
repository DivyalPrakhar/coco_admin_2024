import React, { useEffect, useState } from "react";
import { BaseURL } from "../BaseUrl";
// import {useAppContext} from '../App/Context'
export const CkeditorComponent = (props) => {
    const elementName = "editor_" + (props.id || 1);
    let [state, setState] = useState({ editor: "", data: "" })

    const start = () => {
        window.CKEDITOR.replace(elementName, {
            width: "",
            height: props.height || 100,
            defaultLanguage: "",
            katexClass: 'my-math',
            extraPlugins: "katex,codesnippet,tableresize,language,autogrow,uploadimage,image2",
            autoGrow_minHeight: 100,
            katexLibCss: 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css',
            katexLibJs: 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js',
            imageUploadUrl: BaseURL + "question-bank/image",
            filebrowserUploadUrl: BaseURL + "question-bank/image",
            filebrowserWindowWidth: "1000",
            filebrowserWindowHeight: "700",
            extraAllowedContent: "p{font-family,font-size,line-height}",
            removePlugins: "elementspath,autosave,autocorrect",
        });

        window.CKEDITOR.instances[elementName].on("change", () => {
            let data = window.CKEDITOR.instances[elementName].getData();
            onChange(data);
            setState({ ...state, data: data });
        });

        window.CKEDITOR.instances[elementName].on("fileUploadRequest", (evt) => {
            var xhr = evt.data.fileLoader.xhr;
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("@login/alumni"));
        });

        /*window.CKEDITOR.instances[elementName].ui.addButton("SuperButton", {
                // add new button and bind our command
                label: "Click me",
                command: "mySimpleCommand",
                toolbar: "about",
                icon: "/imgs/info.png",
            });
        */
        if (props.handleBlur)
            window.CKEDITOR.instances[elementName].on("blur", () => {
                props.handleBlur(state.data);
            });

        window.CKEDITOR.instances[elementName].on("fileUploadResponse", (evt) => {
            var data = evt.data,
                xhr = data.fileLoader.xhr,
                response = xhr.responseText.split("|");

            let file = {};

            if (response[1]) {
                data.message = response[1];
                evt.cancel();
            } else {
                file = JSON.parse(response[0]);
            }
        });

        setState({ ...state, data: "" });

        let language = props.language || "pramukhime:english";

        window.CKEDITOR.instances[elementName].on("pluginsLoaded", function (evt) {
            evt.editor.filter.addTransformations([
                [
                    {
                        element: "p",
                        left: function (el) {
                            return el.name == "p";
                        },
                        right: function (el, tools) {
                            if (el.styles && !el.styles["font-family"])
                                el.styles["font-family"] = language == "pramukhime:english" ? "Roboto" : "Kruti";

                            if (el.styles && !el.styles["font-size"])
                                el.styles["font-size"] = "14px";

                            if (el.styles && !el.styles["line-height"])
                                el.styles["line-height"] = "1.4";
                        },
                    },
                ],
            ]);
        });
    }

    useEffect(() => {
        start();
    }, [])

    useEffect(() => {
        if (window.CKEDITOR.instances[elementName].getData() != props.defaultData)
            window.CKEDITOR.instances[elementName].setData(props.defaultData || "");
    }, [props.defaultData])

    const onChange = (data) => {
        if (data == "") {
            window.CKEDITOR.instances[elementName].destroy();
            start();
        }

        if (props.onChangeData && props.defaultData != data) {
            props.onChangeData({ data, name: props.name });
            setState({ ...state, data: data });
        }
    }

    useEffect(() => {
        if (props.defaultData === '' || props.defaultData === undefined) {
            window.CKEDITOR.instances[elementName].destroy();
            start();
        }
    }, [props.defaultData])

    // const submitForm = (e) => {
    //     e.preventDefault();
    // }

    return (
        <div>
            <textarea id={elementName}></textarea>
            <br />
        </div>
    );
}