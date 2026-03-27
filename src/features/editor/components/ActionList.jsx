// MODIFIED
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from 'react-hot-toast';

import { ActionRow } from './ActionRow';
import { reorderActions, updateData, setLinking } from '../editorSlice';
export const ActionList = ({ onOpenPicker }) => {
  const dispatch = useDispatch();
  
  // Connect directly to Redux Store
  const actions = useSelector(state => state.editor.actions);
  const linking = useSelector(state => state.editor.linking);

  let currentDepth = 0;

  const handleReorder = (result) => {
    if (!result.destination) return;
    dispatch(reorderActions({ startIndex: result.source.index, endIndex: result.destination.index }));
  };

  const handleActionClick = (targetId) => {
    if (linking) {
      dispatch(updateData({
        id: linking.sourceId,
        data: { [linking.field]: targetId }
      }));
      dispatch(setLinking(null));
      toast.success(`Target locked: ${targetId.slice(0, 5)}...`);
    }
  };

  return (
    <DragDropContext onDragEnd={handleReorder}>
      <Droppable droppableId="script-list">
        {(provided) => (
          <main {...provided.droppableProps} ref={provided.innerRef} className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
            <div className="max-w-3xl mx-auto space-y-4 pb-40">
              {actions.map((action, index) => {
                const depth = currentDepth;
                if (action.type === 'group_start') currentDepth++;
                if (action.type === 'group_end') currentDepth--;

                return (
                  <Draggable key={action.id} draggableId={String(action.id)} index={index} isDragDisabled={!!linking}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => handleActionClick(action.id)}
                        className={`
                          relative transition-all duration-200 rounded-xl
                          ${snapshot.isDragging ? "z-50 scale-[1.02] shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "z-10"}
                          ${linking ? "cursor-crosshair hover:ring-2 hover:ring-yellow-500" : ""}
                        `}
                      >
                        {linking && <div className="absolute inset-0 z-20" />}
                        <ActionRow
                          action={action}
                          index={index}
                          depth={depth}
                          onOpenPicker={onOpenPicker}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          </main>
        )}
      </Droppable>
    </DragDropContext>
  );
};