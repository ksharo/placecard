import './Forms.css'
export function CreateEvent(){
    return (
    <>
        <h1 className='title'>Create a New Event</h1>
        <p className='subtitle'>To get started, we just need some of the basics.
        <br/>Don't worry, these can always be edited later.</p>

        <form className='vertical-form'>
            <label>Event Name
            <input type="text"/>
            </label>
            <label>Event Date
            <input type="date"/>
            </label>
            <label>Location (optional)
            <input type="text"/>
            </label>
            <label>Expected Number of Attendees
            <input type="number" value="100"/>
            </label>
            <label>Attendees Per Table
            <input type="number" value="10"/>
            </label>
        </form>
        <button className='rectangleButton smallerButton'>Create!</button>
    </>
    );
}