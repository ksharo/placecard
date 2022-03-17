import { Card, CardHeader, CircularProgress, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useLayoutEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {uuid} from "uuidv4";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";

// create unique ids
const dislikedID = uuid();
const likedID = uuid();
const lovedID = uuid();
const othersID = uuid();

export function EditSurveyResponses() {
    const perTable = window.activeEvent == undefined ? 0 : window.activeEvent.perTable;
    let ourSize = window.curGuest == undefined ? 0 : window.curGuest.groupSize == undefined ? 1 : window.curGuest.groupSize;

    let unusedInvitees = window.inviteesState.filter( (x) => {
        return !(window.lovedInvitees.map(y => y.id).includes(x.id) 
        || window.likedInvitees.map(z => z.id).includes(x.id) 
        || window.dislikedInvitees.map(t => t.id).includes(x.id)
        || (window.curGuest == undefined || window.curGuest.id == x.id) 
        || (window.curGuest.groupID != undefined && window.curGuest.groupID != '' && window.curGuest.groupID == x.groupID));
    });

    const origSearches = {
        [dislikedID]: '',
        [likedID]: '',
        [lovedID]: '',
        [othersID]: '',
    };

    let disliked = [...window.dislikedInvitees];
    let liked = window.likedInvitees.filter( (x) => {
        return !window.lovedInvitees.map(y => y.id).includes(x.id);
    });
    let loved = [...window.lovedInvitees];
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

    const [spaceUsed, setSpace] = React.useState(perTable-ourSize-loved.length);

    // put the columns in a state so changes stick
    const [columns, setColumns] = React.useState(origColumns);
    const [shownColumns, setShown] = React.useState(JSON.parse(JSON.stringify(origColumns)));
    const [searchTerms, setSearch] = React.useState(origSearches);

    useLayoutEffect( () => {
        ourSize = window.curGuest == undefined ? 0 : window.curGuest.groupSize == undefined ? 1 : window.curGuest.groupSize;
        setSpace(perTable-ourSize-loved.length);
    }, [window.curGuest])

    useLayoutEffect(() => {   
        search(null);
    }, [columns]);

    useEffect(() => {
        unusedInvitees = window.inviteesState.filter( (x) => {
            return !(window.lovedInvitees.map(y => y.id).includes(x.id) 
            || window.likedInvitees.map(z => z.id).includes(x.id) 
            || window.dislikedInvitees.map(t => t.id).includes(x.id)
            || (window.curGuest == undefined || window.curGuest.id == x.id) 
            || (window.curGuest.groupID != undefined && window.curGuest.groupID != '' && window.curGuest.groupID == x.groupID));
        });
        disliked = [...window.dislikedInvitees];
        liked = window.likedInvitees.filter( (x) => {
            return !window.lovedInvitees.map(y => y.id).includes(x.id);
        });
        loved = [...window.lovedInvitees];
        const newColumns = {
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
        setColumns(newColumns);
        search(null);
    }, [window.inviteesState])

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
                    count += 1;
                }
                // party is too big!! don't do anything
                if (count + 1 + ourSize > perTable) {
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
                    setSpace(spaceUsed+1);
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
                    setSpace(spaceUsed-1);
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

    const search = (event: any) => {
        if (event != null) {
            const searchTerm = event.target.value.toLowerCase().trim();
            const id = event.target.id.substring(6);
            searchTerms[id] = searchTerm;
            const newSearches = {
                ...searchTerms,
                [id]: searchTerm
            }
            setSearch(newSearches);
        }
        const newColumns: any = {};
        for (let x of Object.keys(columns)) {
            const newItems = columns[x].items.filter( (y: Invitee) => {
                return (y.name.toLowerCase()).includes(searchTerms[x]) || (y.groupName != undefined ? y.groupName.toLowerCase().includes(searchTerms[x]) : false);
            })
            newColumns[x] = {
                name: columns[x].name,
                items: newItems
            }
        }
        setShown(newColumns);
    };

    const clearSearch = (event: any) => {
        let id = event.target.parentElement.id.substring(5);
        // in case they click on the line in the x, then there is an extra layer
        if (id=='') {
            id = event.target.parentElement.parentElement.id.substring(5);
        }
        const e = document.getElementById('search' + id);
        if (e != null) {
            (e as HTMLInputElement).value='';
        }
        searchTerms[id] = '';
        const newSearches = {
            ...searchTerms,
            [id]: ''
        }
        setSearch(newSearches);
        search(null);
    };


      return (
        <>
            <h1 className='title'>Review Your Responses</h1>
            <p className='bigHiddenError' id='tooBigError'>Your table is full.<br/>Please rearrange your responses so that your table can fit your best friends.</p>
            <section className='columnGroupStyle'>
                <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
                    {Object.entries(shownColumns).map(([columnId, column]:[any, any]) => {
                    return (
                        <Card className='wholeColumnStyle' key={columnId}>
                            <CardHeader title={column['name']} subheader={column.name=='Ideal Table' ? <p className='unstyledSubheader'>Space Left: {spaceUsed}</p> : <p className='emptySpace unstyledSubheader'></p>} className='cardHeader smallHeader'></CardHeader>
                            <section className='stickySearch'>
                                <TextField
                                placeholder='Search Guests'
                                className='searchBar' 
                                size='small' 
                                id={'search'+columnId}
                                onChange={search}
                                InputProps={{startAdornment:
                                    <InputAdornment position="start">  
                                        <FaSearch/>
                                    </InputAdornment>,
                                    endAdornment:
                                    searchTerms[columnId].trim() != ''  && <InputAdornment position="end">  
                                        <IconButton className='smallClose' id={'close'+columnId} onClick={clearSearch}>
                                            <IoIosClose/>
                                        </IconButton>
                                    </InputAdornment>
                                    }}>
                                </TextField>
                            </section>
                            {!((window.dislikedInvitees.length == 1 && window.dislikedInvitees[0].id == 'none') || (window.likedInvitees.length == 1 && window.likedInvitees[0].id == 'none') || (window.lovedInvitees.length == 1 && window.lovedInvitees[0].id == 'none')) ?
                            <Droppable droppableId={columnId} key={columnId}>
                            {(provided, snapshot) => {
                                return (
                                <section
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`columnBackground ${snapshot.isDraggingOver ? "activeBackgroundColumn" : ""}`}
                                >
                                    {shownColumns[columnId].items.length == 0 ? columns[columnId].items.length == 0 ? <p className='wrappedP smallP'>Drag guest names to add them to this section.</p> : <p className='wrappedP smallP'>No guests found for search term {searchTerms[columnId]}</p> : 
                                    <>
                                    {column.items.map((guest: any, index: any) => {
                                    return (
                                        <Draggable key={guest.id} draggableId={guest.id} index={index}>
                                        {(provided, snapshot) => {
                                            return (
                                                <section className={`guestName ${snapshot.isDragging ? "draggingGuest" : "placedGuest"}`} ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}>
                                                    <span className='cornerText'>{(guest.groupName==undefined ? 'No Group' : guest.groupName)}</span>
                                                        <br/>
                                                        {guest.name}
                                                </section>
                                            );
                                        }}
                                        </Draggable>
                                    );
                                    })}</>}
                                    {provided.placeholder}
                                </section>
                                );
                            }}
                            </Droppable> :
                            <section className='loadingCircle'>
                                {window.curGuest != undefined ? <p>No Guests</p> : 
                                <>
                                    <p>Loading...</p>
                                    <CircularProgress size={24} />
                                </>
                                }
                            </section>
                        }
                        </Card>
                    );
                    })}
                </DragDropContext>
            </section>
        </>
      );
}