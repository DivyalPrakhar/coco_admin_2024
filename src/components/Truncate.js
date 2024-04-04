import Text from 'antd/lib/typography/Text'
import React, { useState } from 'react'

export const Truncate = ({children, length = 200}) => {
    const [show, changeShow] = useState(false)
    const showPara = () => {
        changeShow(!show)
    }

    return <div>
            {!children ?
                <Text>-</Text>
                :
                children.length > parseInt(length) && !show ?
                    <div>
                        <Text style={{display:'inline'}}>{children.substring(1, length)}...</Text>&nbsp;
                        <Text style={{display:'inline', cursor:'pointer', color:'#3498DB'}} onClick={showPara}>view more</Text>
                    </div>
                    :
                    <div>
                        <Text>{children}</Text>&nbsp;
                        {children.length > parseInt(length) ? <Text style={{display:'inline', cursor:'pointer', color:'#3498DB'}} onClick={showPara}>view less</Text> : null }
                    </div>
            }
        </div>
    }