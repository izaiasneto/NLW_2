import React from 'react'

import whatsappicon from '../../assets/images/icons/whatsapp.svg'

import './style.css'

function TeacherItem() {
    return (
        <article className="teacher-item">
        <header>
            <img src="https://pbs.twimg.com/profile_images/1278439428101472257/Hnu-UOZu_400x400.jpg" alt="Izaias Neto"/>
            <div>
                <strong>Izaias Neto</strong>
                <span>Quimica</span>
            </div>
        </header>

        <p>
            Entusiasta das melhores tecnologias de química avançada.
            <br/><br/>
            Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.
        </p>

        <footer>
            <p>
                Preço/hora
                <strong>R$ 80,00</strong>
            </p>
            <button type="button">
                <img src={whatsappicon} alt="whatsapp"/>
                Entrar em contato
            </button>
            
        </footer>
    </article>
    )
}

export default TeacherItem;