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
    Radio
} from 'antd'

import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STATUS } from '../Constants'
import {addProductAction, updateProductAction, resetProductStatusAction, getAllProductsAction} from '../redux/reducers/products'
import { useAuthUser } from "../App/Context";
import {  UploadOutlined } from '@ant-design/icons'
import { BaseURL } from '../BaseUrl'
import { getPackagesAction } from '../redux/reducers/packages'
import { addCouponAction } from '../redux/reducers/coupons'




const { Option } = Select;


export const AddCouponsDrawer = ({ visible, closeDrawer, defaultSelected, selectedProduct }) => {
    const [form] = Form.useForm()
    const [typeSelected,setTypeSelected] = useState(defaultSelected);
    const dispatch = useDispatch()

    function _closeDrawer() {
        closeDrawer()
        form.resetFields()
    }


    const productTypes = [{value:"BOOK",lable:"Book"},{value:"DRIVE",lable:"Media Drive"},{value:"MAGAZINE",lable:"Magazine"}]

    return (
        <Drawer placement='right' onClose={_closeDrawer} visible={visible} width='50%' title='Create Coupon'>
            <CouponsCreateForm form={form} type={typeSelected} allTypes={productTypes} selectedProduct={selectedProduct} closeDrawer={_closeDrawer}/>
        </Drawer>
    )
}



const CouponsCreateForm = ({type,form,selectedProduct,closeDrawer}) => {

    const dispatch = useDispatch()

    const {packages, coupon} = useSelector((state) => ({
        packages:state.packages,
        coupon: state.coupon
    }))

    useEffect(() => {
        dispatch(getPackagesAction())
    }, [dispatch])

    useEffect(() => {
        if(coupon.addCouponStatus === STATUS.SUCCESS){
            closeDrawer()
        }
    }, [coupon?.addCouponStatus])

    const _addCoupon = (data) => {
        dispatch(addCouponAction(data))
        return 0
    }
  
    return(
        <Form
            onFinish={_addCoupon}
            form={form}
            wrapperCol={{ span: 14 }}
            labelCol={{ span: 4 }}
            layout='vertical'
        >
       
            <Card title="Coupon Details" loading={packages.packagesList.length ? false : false}>
                {
                    packages.packagesList.length?
                    <Form.Item name='packages' label='Select Packages' required>
                        <Select  placeholder="Select Packages" mode="multiple" required >
                            {
                                packages.packagesList.map((pack)=>(
                                    <Option value={pack._id}>{pack.name?.en}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>:<span>Loading Packages...</span>
                }
                <Form.Item name='amount' label='Amount' required >
                    <Input  placeholder='Enter Price of the Coupon' type='number' addonAfter="₹" required />
                </Form.Item>
                <Form.Item name='totalCoupons' label='No. of Coupons' required >
                    <Input  placeholder='Total Numbers of Coupons'  type='number' required />
                </Form.Item>
             
                <Form.Item>
                    <Button type="primary" htmlType="submit" shape='round'  loading={false}>
                        Create Coupon
                    </Button>
                </Form.Item>
            </Card>
         
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




