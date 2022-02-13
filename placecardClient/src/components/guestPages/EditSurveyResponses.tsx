import { Button } from "@mui/material";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {uuid} from "uuidv4";
import { useHistory } from "react-router-dom";

// create unique ids
const dislikedID = uuid();
const likedID = uuid();
const lovedID = uuid();
const othersID = uuid();

export function EditSurveyResponses() {
    const history = useHistory();
    const perTable = 10; // TODO change to global
    const ourSize = 6; // TODO change to global

    const unusedInvitees = window.inviteesState.filter( (x) => {
        return !(window.lovedInvitees.map(y => y.id).includes(x.id) || window.likedInvitees.map(z => z.id).includes(x.id) || window.dislikedInvitees.map(t => t.id).includes(x.id));
    });

    const disliked = [...window.dislikedInvitees];
    const liked = window.likedInvitees.filter( (x) => {
        return !window.lovedInvitees.map(y => y.id).includes(x.id);
    });
    const loved = [...window.lovedInvitees];
    // create columns with headers and unique ids
    const origColumns = {
        [dislikedID]: {
            name: 'Avoid Sitting With',
            items: disliked
        },
        [likedID]: {
            name: 'Comfortable Sitting With',
            items: liked
        },
        [lovedID]: {
            name: 'Ideal Table',
            items: loved
        },
        [othersID]: {
            name: 'Others',
            items: unusedInvitees
        }
    }

    // put the columns in a state so changes stick
    const [columns, setColumns] = React.useState(origColumns);

    const onDragEnd = (result: any, columns: any, setColumns: any) => {
        // make sure that result is in the right format
        if (!result.destination) return;
        const { source, destination } = result;
        // do stuff if the name was moved from one column to another
        if (source.droppableId !== destination.droppableId) {
            // find the data at the to/from columns
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            // get the items from each column in a copied list
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            // take the item that was removed from the source list
            const [removed] = sourceItems.splice(source.index, 1);
            // put it into the destination list. 
            // Don't delete anything, just put it in the right position (index)
            destItems.splice(destination.index, 0, removed);
            // check that, if moving to idealTable column, the party is not too big
            if (destination.droppableId == lovedID) {
                let count = 0;
                for (let x of window.lovedInvitees) {
                    count += x.size;
                }
                // party is too big!! don't do anything
                if (count + removed.size + ourSize > perTable) {
                    // show the error (shows and then hides with animation in class)
                    const errorEl = document.getElementById('tooBigError');
                    if (errorEl != null) {
                        // do this so animation plays
                        errorEl.classList.remove('slowGradualError');
                        window.requestAnimationFrame(function() {
                            errorEl.classList.add('slowGradualError');
                        });
                        window.scrollTo({top: 0, behavior: 'smooth'});
                    }
                    return;
                }
            }
            // set the new column data based off of the above
            const newColumns = {
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            }
            setColumns(newColumns);
            // set the global variables based on source id
            // (remove the moved item from the source's corresponding list)
            switch (source.droppableId) {
                case dislikedID:
                    const tmpDis = [...window.dislikedInvitees];
                    const disInd = tmpDis.indexOf(removed);
                    tmpDis.splice(disInd, 1);
                    window.setDisliked(tmpDis);
                    break;
                case likedID:
                    // don't remove from liked if we're just moving to loved
                    if (destination.droppableId != lovedID) {
                        const tmpLike = [...window.likedInvitees];
                        const likeInd = tmpLike.indexOf(removed);
                        tmpLike.splice(likeInd, 1);
                        window.setLiked(tmpLike);        
                    }          
                    break;
                case lovedID:
                    const tmpLove = [...window.lovedInvitees];
                    const loveInd = tmpLove.indexOf(removed);
                    tmpLove.splice(loveInd, 1);
                    window.setLoved(tmpLove);
                    // check if we need to remove it from liked as well
                    if (destination.droppableId != likedID) {
                        const updateLikes = [...window.likedInvitees];
                        const likeIndForUpdate = updateLikes.indexOf(removed);
                        updateLikes.splice(likeIndForUpdate, 1);
                        window.setLiked(updateLikes);
                    }           
                    break;
                default:
                    break;
            }
            // set the global variables based on dest id
            // (add the removed item to the destination's corresponding list)
            switch (destination.droppableId) {
                case dislikedID:
                    const tmpDis = [...window.dislikedInvitees];
                    tmpDis.push(removed);
                    window.setDisliked(tmpDis);
                    break;
                case likedID:
                    const tmpLike = [...window.likedInvitees];
                    // make sure no duplicates (could happen if moving from loved to liked)
                    if (tmpLike.indexOf(removed) == -1) {
                        tmpLike.push(removed);
                        window.setLiked(tmpLike);       
                    }           
                    break;
                case lovedID:
                    const tmpLove = [...window.lovedInvitees];
                    tmpLove.push(removed);
                    window.setLoved(tmpLove);    
                    // update likes if someone is moved to love
                    const updateLikes = [...window.likedInvitees];
                    if (updateLikes.indexOf(removed) == -1) {
                        updateLikes.push(removed);
                        window.setLiked(updateLikes);   
                    }           
                    break;
                default:
                    break;
            }
        } 
        // name is moved within column. Just change the order.
        else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            // set the new column data based off of the above
            const newColumns = {
                ...columns,
                [destination.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            }
            setColumns(newColumns);
        }
    }
    const prevPage = () => {
        history.push('/surveyIdealTable');
    }
    const nextPage = () => {
        history.push('/doneSurvey');
    }
      return (
        <>
            <h1 className='title'>Review Your Responses</h1>
            <p className='bigHiddenError' id='tooBigError'>The party is too big for the table.<br/>Please note the size of the party and the space left at your ideal table.</p>
            <section className='columnGroupStyle'>
                <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
                    {Object.entries(columns).map(([columnId, column]) => {
                    return (
                        <section className='wholeColumnStyle' key={columnId}>
                            <h2>{column.name}</h2>
                            <section className='columnCenterStyle'>
                                <Droppable droppableId={columnId} key={columnId}>
                                {(provided, snapshot) => {
                                    return (
                                    <section
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`columnBackground ${snapshot.isDraggingOver ? "activeBackgroundColumn" : ""}`}
                                    >
                                        {column.items.map((item, index) => {
                                        return (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => {
                                                return (
                                                <section
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`partyBox ${snapshot.isDragging ? "activeBackgroundPartyBox" : ""}`}
                                                >
                                                    {item.name}
                                                    <br/>
                                                    <hr/>
                                                    <span className='smallerText'>(Size: {item.size})</span>
                                                </section>
                                                );
                                            }}
                                            </Draggable>
                                        );
                                        })}
                                        {provided.placeholder}
                                    </section>
                                    );
                                }}
                                </Droppable>
                            </section>
                        </section>
                    );
                    })}
                </DragDropContext>
            </section>
            <Button variant='outlined' className='generalButton' onClick={prevPage}>
                Go Back
            </Button>
            <Button variant='outlined' className='generalButton' onClick={nextPage}>
                Finish!
            </Button>
        </>
      );
}