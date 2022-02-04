import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";

export function SurveyInstructions() {
    const history = useHistory();
    const handleClick = () => {
        history.push('/surveyPt1');
    };
    return (
        <>
            <h1 className='title'>Survey Instructions</h1>
            <p className='subtitle'>Please read the following carefully before continuing:</p>
            <section className='centeredBox'>
                <ol type='1' className='instructionList'>
                    <li>First, you will be asked to enter the names of everyone in your party who was invited.</li>
                    <li>Next, you will be shown the names of everyone invited and asked to mark the ones with whom you would like to avoid sitting.</li>
                    <li>Then, you will be asked which individuals you would feel comfortable sitting with.</li>
                    <li>After that, you will be asked to create your ideal table: who do you <i>really</i> want at your table?</li>
                    <li>Finally, you will be asked to review your selection and submit.</li>
                </ol>
            </section>
            <Button variant='outlined' className='generalButton' onClick={handleClick}>
                        Continue
            </Button>
        </>
    )
}