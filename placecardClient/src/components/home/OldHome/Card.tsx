import { IoIosMail } from 'react-icons/io';
import { FaAddressBook, FaMagic } from 'react-icons/fa';
import './Card.css';

export function Card(props: {num: string; title: string; txt: string; img: string}) {

    const icons = new Map([
        ["mail", <IoIosMail className="graphic"/>],
        ["guests", <FaAddressBook className="graphic"/>],
        ["magic", <FaMagic className="graphic"/>],
        ["none", <></>]
    ]);
    return (
    <section className='card-section'>
        <h1>{props.num}</h1>
        <h2>{props.title}</h2>
        <p>{props.txt}</p>
        { icons.get(props.img) }
    </section>
    );
  }