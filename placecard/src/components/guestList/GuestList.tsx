import { GuestListTable } from "./GuestListTable"

export function GuestList(){
	const title			= 'Add a Guest List For Your Event'
	const pageDescription	= 'Download our guest list template, fill it out, and drop it back here'

	const tableTitle		= 'Enter Guest List Manually'
	const tableDescription	= 'You only need to provide one method of contact for each guest'


	return(
		<>
			<section>
				<h1 className='title'>{title}</h1>
				<p className='subtitle'>{pageDescription}</p>
			</section>
			<section>
				<img alt="File Icon"></img>
				<p>Drag Your File Here</p>
				<p>or</p>
				<p><button>Click here to upload</button></p>
			</section>
			<section>
				OR
			</section>
			<section>
				<h3>{tableTitle}</h3>
				<p>{tableDescription}</p>
				<GuestListTable></GuestListTable>
			</section>

		</>
	);
}