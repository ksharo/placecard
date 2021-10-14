import { IoIosMail } from 'react-icons/io';
import { FaAddressBook, FaMagic } from 'react-icons/fa';

export function Card(props: {num: string; title: string; txt: string; img: string}) {

    const icons = new Map([
        ["mail", <IoIosMail/>],
        ["guests", <FaAddressBook/>],
        ["magic", <FaMagic/>],
        ["none", <></>]
    ]);
    return (
    <section className='card-section'>
        <h1>{props.num}</h1>
        <h2 className='left'>{props.title}</h2>
        <p className='left'>{props.txt}</p>
        { icons.get(props.img) }
    </section>
    );
  }