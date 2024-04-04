import { 
    Button,
    Drawer,
    Form,
    Input,
    Select,
    Card,
    Divider,
    Upload,
    message, 
    Radio, 
    Alert
} from 'antd'

import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../Constants'
import {addProductAction, updateProductAction, resetProductStatusAction, getAllProductsAction} from '../redux/reducers/products'
import { useAuthUser } from "../App/Context";
import {  UploadOutlined } from '@ant-design/icons'
import { BaseURL } from '../BaseUrl'
import { UploadImageBox } from './UploadImageBox'



const { Option } = Select;


export const AddProductDrawer = ({ visible, closeDrawer, defaultSelected, selectedProduct }) => {
    const [form] = Form.useForm()
    const [typeSelected,setTypeSelected] = useState(defaultSelected);

    function _closeDrawer() {
        closeDrawer()
        form.resetFields()
    }

    const onSelectChange = (e) => {
        setTypeSelected(e.target.value)
        form.resetFields()
    }
      

      const productTypes = [{value:"BOOK",lable:"Book"},{value:"DRIVE",lable:"Media Drive"},{value:"MAGAZINE",lable:"Magazine"}]

      
    return (
        <Drawer placement='right' onClose={_closeDrawer} visible={visible} width='50%' title={selectedProduct ? 'Update Product' : 'Add Product'}>
            {_.size(selectedProduct) ? null : 
                <div>
                    <label >Select Product Type : </label>
                    {/* <Select
                        style={{ width: "100%" }}
                        placeholder="Select a Product Type"
                        optionFilterProp="children"
                        onChange={onSelectChange}
                        defaultValue = {defaultSelected}
                        // filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >   
                        {productTypes.map((type,index)=>(<Option value={type.value} key={index}>{type.lable}</Option>))}
                    </Select> */}
                    <Radio.Group onChange={onSelectChange} value={typeSelected} style={{marginTop : '15px'}}>
                        {productTypes.map((type,index)=>(<Radio value={type.value} key={index}>{type.lable}</Radio>))}
                    </Radio.Group>
                    <Divider />
                </div>
            }
            {typeSelected ? <ProductTypeForm form={form} type={typeSelected} allTypes={productTypes} selectedProduct={selectedProduct} closeDrawer={_closeDrawer}/> : null}
        </Drawer>
    )
}



const ProductTypeForm = ({type,form,selectedProduct,closeDrawer}) => {
    const dispatch = useDispatch()
    const auth = useAuthUser()
    const [examData, setExamData] = useState({exams: []})
    const [isUpdating, setIsUpdating] = useState(false);
    const [modeData, setModaData] = useState(selectedProduct?.mode || 'offline')
    const [coverImg, changeCoverImg] = useState()

    const {configData} = useSelector(s => ({
        configData: s.lmsConfig
    }))
    const {product} = useSelector(s=>({
        product : s.product
    }))

    useEffect(()=>{
        if(selectedProduct){
            changeCoverImg(selectedProduct.media?.[0])
        }

        if(!(Object.keys(selectedProduct).length === 0 && selectedProduct.constructor === Object)){
            setIsUpdating(true)
        }else{
            setIsUpdating(false)
        }
    },[selectedProduct])
    
    // useEffect(() => {
    //     dispatch(getDefaultDataAction())
    //     dispatch(getInstituteDefaultAction({instituteId: auth.staff.institute._id, platform: 'examstudent', key: "syllabus",}))
    // }, [auth.staff.institute._id,dispatch])


    useEffect(() => {
        let examDefaultData = configData.defaultData?.exams
        // changeCoverImg()
        setExamData({ 
            exams: examDefaultData
        })
    }, [configData.defaultData?.exams])
      
    const _addProduct = (data) => {
        const payload = {}
        payload.name = {en : data.name}
        payload.description = {en : data.description}
        payload.productId = selectedProduct._id
        payload.media =  coverImg ? [
            {
              label: coverImg.fileName,
              url: coverImg.url,
              mimetype: coverImg.type,
            }
          ] : []

        payload.code = data.code
        payload.type = type

        if(type === 'MAGAZINE'){
            payload.mode = modeData
            if(modeData === 'online'){
                payload.content =  data.content && [
                    {
                        label: data.content[0].response.fileName,
                        url: data.content[0].response.url,
                        mimetype: data.content[0].response.type,
                    }
                ]
            }
        }

        payload.exams = data.tags && data.tags.map((tag)=>{
            return tag
        })
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key])

        

        // Add Product API Calls
        if(isUpdating){
            dispatch(updateProductAction(payload))
        }else{
            dispatch(addProductAction(payload))
        }
    }
  
    const normFile = (e) => {
        if (Array.isArray(e)) {
          return e.file.response;
        }
        return e.file.response && e.fileList;
    };

    useEffect(()=>{
        const key = 'updatable'
        let prd = type.charAt(0).toUpperCase() + type.toLowerCase().slice(1)
        if(product.productStatus === STATUS.FETCHING){
            
            message.loading({ content: isUpdating ? 'Updating...':'Adding...', key });
        }else if(product.productStatus === STATUS.SUCCESS){
            
            message.success({ content: isUpdating ? `${prd} Updated!` : `${prd} Added!`, key, duration: 4 });
            closeDrawer()
            dispatch(resetProductStatusAction())
            dispatch(getAllProductsAction()) // API Action Call
        }else if(product.productStatus === STATUS.FAILED){
            
            message.error({ content: 'Error!', key, duration: 4 });
            dispatch(resetProductStatusAction())
        }
    },[product.productStatus, closeDrawer, dispatch, isUpdating, type])

    const onModeChange = (e) => {
        setModaData(e.target.value)
    }

    const changeCover = (e) => {
        changeCoverImg(e.file?.response)
    }

    return(
        <Form
            onFinish={_addProduct}
            form={form}
            wrapperCol={{ span: 14 }}
            labelCol={{ span: 4 }}
            layout="horizontal"
        >
       
            {type === "BOOK" ?
            <Card title="Book Details">
                    <Form.Item name='name' label='Name' required initialValue={selectedProduct?.name?.en}>
                    <Input  placeholder='Enter Name of the Book' required />
                </Form.Item>
                <Form.Item name='code' label='Book ID' required initialValue={selectedProduct?.code}>
                    <Input  placeholder='Code'   required />
                </Form.Item>
                <Form.Item name='description' label='Description' initialValue={selectedProduct?.description?.en}>
                    <Input.TextArea  placeholder='Enter Description for the Book' type='textarea' rows={4} />
                </Form.Item>
                <Form.Item label="Cover Image" key={coverImg?.url}>
                    <Form.Item name="media" valuePropName="fileList" noStyle>
                        <UploadImageBox getImage={changeCover} defaultImg={coverImg?.url}/>
                        {/* <Upload multiple={false} action={BaseURL+"app/image"} accept="image/png, image/jpeg">  
                            <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
                        </Upload> */}
                    </Form.Item>
                    {/* <br/>
                    <Alert message="Recommended Image Ratio: 16:9" showIcon style={{background: '#e6f7fe', border: '1px solid #92d4fb'}}/> */}
                </Form.Item>
                
                {
                    examData.exams ?
                    <Form.Item name='tags' label='Exams' initialValue={selectedProduct?.exams?selectedProduct?.exams.map((exam)=>(exam?._id)):[]}>
                        <Select mode="tags"  placeholder="Choose Exam Tags">
                            {
                                examData.exams.map((exam,i)=>{
                                    return(<Option value={exam._id} key={i}>{exam.name.en}</Option>)
                                })
                            }
                        </Select>
                    </Form.Item>
                    :<div>loading</div>
                }
                
            </Card>:null}


            {type === "DRIVE" ?
            <Card title="Drive Details">

                <Form.Item name='name' label='Name' required initialValue={selectedProduct?.name?.en}>
                    <Input  placeholder='Enter Name of the Drive' required />
                </Form.Item>

                <Form.Item name='code' label='Drive ID' required initialValue={selectedProduct?.code}>
                    <Input  placeholder='Code'   required />
                </Form.Item>

                <Form.Item name='description' label='Description' initialValue={selectedProduct?.description?.en}>
                    <Input.TextArea  placeholder='Enter Description for the Drive' type='textarea' rows={4} />
                </Form.Item>

                <Form.Item label="Cover Image" key={coverImg?.url}>
                    <Form.Item name="media" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                        <UploadImageBox getImage={changeCover} defaultImg={coverImg?.url}/>
                        {/* <Upload name="file" action={BaseURL+"app/image"} accept="image/png, image/jpeg">  
                            <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
                        </Upload> */}
                    </Form.Item>
                    {/* <br/>
                    <Alert message="Recommended Image Ratio: 16:9" showIcon style={{background: '#e6f7fe', border: '1px solid #92d4fb'}}/> */}
                </Form.Item>

                
                {
                    examData.exams
                    ?
                    <Form.Item name='tags' label='Exams' initialValue={selectedProduct?.exams?selectedProduct?.exams.map((exam)=>(exam?._id)):[]}>
                        <Select mode="tags"  placeholder="Choose Exam Tags">
                            {
                                examData.exams.map((exam,i)=>{
                                    return(
                                        <Option value={exam._id} key={i}>{exam.name.en}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    :
                    <div>loading</div>
                }
                
            </Card>:null}


            
            {type === "MAGAZINE" ?
            <Card title="Magazine Details">

                <Form.Item name='name' label='Name' required initialValue={selectedProduct?.name?.en}>
                    <Input  placeholder='Enter Name of the Magazine' required />
                </Form.Item>

                <Form.Item name='code' label='Magazine ID' required initialValue={selectedProduct?.code}>
                    <Input  placeholder='Code'   required />
                </Form.Item>

                <Form.Item name='description' label='Description' initialValue={selectedProduct?.description?.en}>
                    <Input.TextArea  placeholder='Enter Description for the Magazine' type='textarea' rows={4} />
                </Form.Item>
                <Form.Item name='mode' label='Mode' required>
                    <Radio.Group onChange={onModeChange} defaultValue={selectedProduct?.mode} value={selectedProduct?.mode}>
                        <Radio value='online'>Online</Radio>
                        <Radio value='offline'>Offline</Radio>
                    </Radio.Group>
                </Form.Item>
                {modeData === 'online' ? 
                    <Form.Item label="Online Magazine">
                        <Form.Item name="content" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                            <Upload name="file" action={BaseURL+"app/file"} accept="application/pdf">  
                                <Button icon={<UploadOutlined />}>Upload Online Magazine</Button>
                            </Upload>
                        </Form.Item>
                    </Form.Item>
                : null}
                <Form.Item label="Cover Image" key={coverImg?.url}>
                    <Form.Item name="media" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                        <UploadImageBox getImage={changeCover} defaultImg={coverImg?.url}/>
                        
                        {/* <Upload name="file" action={BaseURL+"app/image"} accept="image/png, image/jpeg">  
                            <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
                        </Upload> */}
                    </Form.Item>
                    {/* <br/>
                    <Alert message="Recommended Image Ratio: 16:9" showIcon style={{background: '#e6f7fe', border: '1px solid #92d4fb'}}/> */}
                </Form.Item>
                
                {
                    examData.exams
                    ?
                    <Form.Item name='tags' label='Exams' initialValue={selectedProduct?.exams?selectedProduct?.exams.map((exam)=>(exam?._id)):[]}>
                        <Select mode="tags"  placeholder="Choose Exam Tags">
                            {
                                examData.exams.map((exam,i)=>{
                                    return(
                                        <Option value={exam._id} key={i}>{exam.name.en}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    :
                    <div>loading</div>
                }
                
            </Card>
            :
            null}


            <Divider />


            <Form.Item wrapperCol={{ offset: 4 }}>
                <Button type="primary" htmlType="submit" loading={product.productStatus === STATUS.FETCHING}>
                    {/* {
                    isUpdating 
                    ? product.productStatus === STATUS.FETCHING ? 'Updating...' : 'Update'
                    : product.productStatus === STATUS.FETCHING ? 'Adding...' : 'Add'
                    } */}
                        {
                    isUpdating 
                    ? 'Update'
                    : 'Add'
                    }
                </Button>
            </Form.Item>
        </Form>
    )
}


// const FormFields = ({fieldsName,type,selectedProduct,examData}) =>{

    
//     const show = (field) =>{
//         return fieldsName.includes(field)
//     }

//     return(
//         <Card title={`${type} Details`}>

//         {show('name')?<Form.Item name='name' label='Name' required initialValue={selectedProduct?.name?.en}>
//             <Input  placeholder={`Enter Name of the ${type}`} required />
//         </Form.Item>:null}

//         {show('code')?<Form.Item name='code' label={`${type} ID`} required initialValue={selectedProduct?.code}>
//             <Input  placeholder='code'   required />
//         </Form.Item>:null}

//         {show('description')?<Form.Item name='description' label='Description' initialValue={selectedProduct?.description?.en}>
//             <Input.TextArea  placeholder={`Enter Description for the ${type}`} type='textarea' rows={4} />
//         </Form.Item>:null}

//         {show('media')?<Form.Item label="Cover Image">
//             <Form.Item name="media" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
//                 <Upload name="file" action={BaseURL+"app/image"} accept="image/png, image/jpeg">  
//                     <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
//                 </Upload>
//             </Form.Item>
//         </Form.Item>:null}
        
//         {show('tags')?
//             (examData.exams
//             ?
//             <Form.Item name='tags' label='Exams' initialValue={selectedProduct?.exams?selectedProduct?.exams.map((exam)=>(exam._id)):[]}>
//                 <Select mode="tags"  placeholder="Choose Exam Tags">
//                     {
//                         examData.exams.map((exam,i)=>{
//                             return(
//                                 <Option value={exam._id} key={i}>{exam.name.en}</Option>
//                             )
//                         })
//                     }
//                 </Select>
//             </Form.Item>
//             :
//             <div>loading</div>)
//         :null}
        
//     </Card>
//     )
// }




