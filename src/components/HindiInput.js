import { Input } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';

export const HindiInput = ({onChange, placeholder, required, value, componentType, rows}) => {
    const [inputValue, setInputValue] = useState()
	const [language, changeLanguage]= useState('pramukhime:english')

    useEffect(() => {
        setInputValue(value)

        let lang = language.split(':')
	    window.pramukhIME.setLanguage(lang[1], lang[0]);
	    window.pramukhIME.addKeyboard("PramukhIndic");
	    window.pramukhIME.enable();

        return () => {
            window.pramukhIME.disable()
        };
      }, []);

    const changeValue = (e) => {
        document.getElementById('input').focus = null
        onChange(e)
        setInputValue(e.target.value)
    }

    const handleLanguageChange = (value) => {
        let lang = value.split(':')
        window.pramukhIME.setLanguage(lang[1], lang[0]);
        changeLanguage(value)
    }

    return( componentType == 'textarea' ?
            <TextArea placeholder={placeholder} id='input' rows={rows}
                onFocus={() => handleLanguageChange('pramukhindic:hindi')} 
                defaultValue={inputValue} 
                value={inputValue}
                onBlur={(e) => (changeValue(e), handleLanguageChange('pramukhime:english'))} 
                onChange={changeValue}
                required={required}
            />
            :
            <Input placeholder={placeholder} id='input' 
                onFocus={() => handleLanguageChange('pramukhindic:hindi')} 
                defaultValue={inputValue} 
                value={inputValue}
                onBlur={(e) => (changeValue(e), handleLanguageChange('pramukhime:english'))} 
                onChange={changeValue}
                required={required}
            />
    )
}