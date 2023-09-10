import React from 'react';
import './dash.css'
import { Typography } from 'antd';
import {FacebookLogo, InstagramLogo, WhatsappLogo} from 'phosphor-react'

function Footer() {
    const iconStyle = {
        fontSize: '30px',
        fontWeight: 'bold',
    };

    return (
        <div className='Footer'>
            <Typography.Link href='tel:+2349134228578'>Contact us: 09134228578</Typography.Link>
            <Typography.Link href='mailto:nifemiojinni22@gmail.com'>Send an Email</Typography.Link>
            <div className="social-icons">
                <a
                    href="https://www.facebook.com/your-facebook-page-url"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                >
                    <FacebookLogo style={{ ...iconStyle, color: '#1877F2' }} weight='fill'/>
                </a>
                <a
                    href="https://api.whatsapp.com/send?phone=your-phone-number"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                >
                    <WhatsappLogo style={{ ...iconStyle, color: '#25D366' }} weight='fill'/>
                </a>
                <a
                    href="https://www.instagram.com/your-instagram-profile-url"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                >
                    <InstagramLogo style={{ ...iconStyle, color: '#E4405F' }} weight='fill'/>
                </a>
                </div>
        </div>
    )
}

export default Footer;