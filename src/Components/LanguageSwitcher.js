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
        <div>
            {language === 'en'
                ? <img onClick={() => changeLanguage('no')} alt='United States Flag' src='/images/usa.png' style={{ height: 32, width: 32 }}/>
                : <img onClick={() => changeLanguage('en')} alt='Norwegian Flag' src='/images/norway.png' style={{ height: 32, width: 32 }}/>
            }
        </div>
    );
};

export default LanguageSwitcher;
