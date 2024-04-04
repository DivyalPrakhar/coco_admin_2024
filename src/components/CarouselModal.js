import {Modal, Image, Carousel} from 'antd'
import _ from 'lodash'

export const CarouselModal = ({data, visible, closeModal}) => {

	const contentStyle = {textAlign: 'center'};

	return(
		<Modal title='Images' visible={visible} onCancel={() => closeModal()} footer={null}>
			<Carousel autoplay>
			    {_.map(data, (d, i) => {
			    	return(
						<div key={i} style={{textAlign:'center', border:'1px solid black'}}>
					    	<Image src={d} style={{width:'200px'}}/>
						</div>
			    	)}
			    )}
			</Carousel>
		</Modal>
	)
}