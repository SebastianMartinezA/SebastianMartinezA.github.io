import React from 'react';
import { BsLinkedin, BsGithub, BsDownload } from 'react-icons/bs';
import resume from '../assets/ResumeSebastian.pdf';


const SocialMedia = () => {
  return (
    <div className='app__social'>
        <a href="https://www.linkedin.com/in/smartinezamaray/" target="_blank" rel="noopener noreferrer">
          <div>
              <BsLinkedin />
          </div>
        </a>
        <a href="https://github.com/SebastianMartinezA" target="_blank" rel="noopener noreferrer">
          <div>
              <BsGithub />
          </div>
        </a>
        <a href={resume} download="CV Sebastian Martinez Amaray.pdf">
          <div>
              <BsDownload/>
          </div>
        </a>
    </div>
  )
}

export default SocialMedia;