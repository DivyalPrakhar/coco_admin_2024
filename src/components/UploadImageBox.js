import React from 'react'
import { Upload, message, Button, Alert } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseURL } from '../BaseUrl';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/webp';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG/WEBP file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

export class UploadImageBox extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount = () => {
    if(this.props.defaultImg)
      this.setState({imageUrl:this.props.defaultImg})
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      if(this.props.getImage) 
        this.props.getImage(info)

      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  }

  removeImg = () => {
      this.setState({imageUrl:null})
      
      if(this.props.onRemove)
        this.props.onRemove()
  }

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>{loading ? 'Uploading...' : 'Upload'}</div>
      </div>
    );

    // let defaultImg = this.props.defaultImg ? [{
    //   uid: '-1',
    //   name: 'image.png',
    //   status: 'done',
    //   url: this.props.defaultImg,
    // }] : null

    return (
      <div> 
        {this.props.disableAlert ? null :
          <div>
            <Alert message={"Recommended Image Ratio: " + (this.props.ratio || '16:9')} showIcon style={{background: '#e6f7fe', border: '1px solid #92d4fb'}}/>
            <br/>
          </div>     
        }
        <Upload
          name="file"
          listType="picture-card"
          className={this.props.size == 'small'?  "" :this.props.size == 'large' ? 'avatar-uploader-large' :this.props.size == 'medium' ? 'avatar-uploader' : 'avatar-uploader'}
          showUploadList={false}
          action={BaseURL+"app/image"}
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          {imageUrl && !loading ? 
            <div>
              <img src={imageUrl} alt="avatar" style={{width:'100%', maxHeight:this.props.size == 'small' ? '100px' : '120px', objectFit:'cover'}} /> 
            </div>
            : 
            uploadButton
          }<br/>
        </Upload>
        {imageUrl ? <Button size='small' onClick={this.removeImg}>Remove</Button> : null}
      </div>
    );
  }
}