import React from 'react'
import { HiMenuAlt4, HiX } from 'react-icons/hi';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";

import { images } from '../../constants';
import './Navbar.scss';

const Navbar = () => {
const [toggle, setToggle] = useState(false);
const { t } = useTranslation();

  return (
    <nav className="app__navbar">
        <div className="app__navbar-logo">
            {t('nav_home')}
        </div>
        <ul className="app__navbar-links">
          {[t('nav_home'), t('nav_about'), t('nav_work'), t('nav_testimonials'), t('nav_skills'), t('nav_contact')].map((item) => (
            <li className="app__flex p-text" key={`link-${item}`}>
              <div />
              <a href={3}>{item}</a>
            </li>
          ))}
        </ul>

        <div className="app__navbar-menu">
            <HiMenuAlt4 onClick={() => setToggle(true)}/>
            {
              toggle && (
                
                <motion.div
                  initial={{ x: -600 }}
                  animate={{ x: [300, 0]}}
                >
                  <HiX onClick={() => setToggle(false)}/>
                  <ul>
                    {['home', 'about', 'work', 'testimonials', 'skills', 'contact'].map((item) => (
                      <li key={item}>
                        <a href={`#${item}`} onClick={() => setToggle(false)}>{item}</a>
                      </li>
                    ))}
                  </ul>
                      
                </motion.div>
                
              )
            }
        </div>
    </nav>
  )
}

export default Navbar