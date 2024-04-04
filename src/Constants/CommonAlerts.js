import { ExclamationCircleOutlined } from "@ant-design/icons"
import { message, Modal } from "antd"

export const SuccessMessage = (msg) => {
    message.destroy('message')
    return message.success({content: msg || 'Success', key: 'message'})
}

export const ErrorMessage = (msg, duration) => {
    message.destroy('message')
    return message.warning({content: msg || 'Something went wrong!', key: 'message', duration})
}

export const FetchingMessage = (msg) => {
    message.destroy('message')
    return message.loading({content: msg || 'Fetching...', key: 'message'})
}

export const ConfirmAlert = (callback, msg, content, loading, okText) => {
    const {confirm} = Modal

    return confirm({
        title:msg || 'Are you sure?',
        icon: <ExclamationCircleOutlined />,
        content:content || null,
        onOk:callback || null,
        confirmLoading: loading,
        okText: okText || 'Yes',
    })
}