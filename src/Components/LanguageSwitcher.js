import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

    useEffect(() => {
        localStorage.setItem('language', language);
        i18n.changeLanguage(language);
    }, [language, i18n]);

    const changeLanguage = (lng) => {
        setLanguage(lng);
    };

    return (
        <div style={{ marginRight: 10 }}>
            {language === 'en' ? (
                <img onClick={() => changeLanguage('no')} alt='United States Flag' src='/images/usa.png' style={{ height: 32, width: 32 }}/>
            ) : language === 'no' ? (
                <img onClick={() => changeLanguage('fr')} alt='Norwegian Flag' src='/images/norway.png' style={{ height: 32, width: 32 }}/>
            ) : language === 'fr' ? ( 
                <img onClick={() => changeLanguage('es')} alt='French Flag' src='/images/france.png' style={{ height: 32, width: 32 }}/>
            ) : (
                <img onClick={() => changeLanguage('en')} alt='Spanish Flag' src='/images/spain.png' style={{ height: 32, width: 32 }}/>
            
            )}
        </div>
    );
};

export default LanguageSwitcher;
