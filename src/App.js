import "./App.css";
import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";

const inicialItems = [
  { id: "1", content: "Conteúdo 1" },
  { id: "2", content: "Conteúdo 2" },
  { id: "3", content: "Conteúdo 3" },
];

const inicialColumns = [
  {
    name: "To do",
    id: "123",
    items: inicialItems,
  },
  {
    name: "Doing",
    id: "456",
    items: [],
  },
  {
    name: "Done",
    id: "789",
    items: [],
  },
];

function App() {
  const [columns, setColumns] = useState(inicialColumns);

  // Ao terminar de soltar o item, executa a função 'onDragEnd' (da lib)
  const onDragEnd = (result) => {
    console.log(result)
    let sourceColumnItems = [] // Puxa os itens da coluna
    let destinationColumnItems = [] // Itens da coluna de destino
    let draggedItem = {} // Item arrastado

    let sourceColumnId = 0
    let destinationColumnId = 0

    // Percorre colunas (identifica coluna origem)
    // Se id da coluna de origem do componente for igual ao id da coluna
    for (let i in columns) {
      if (result.source.droppableId === columns[i].id) {
        sourceColumnItems = columns[i].items // Insere os itens da coluna em 'sourceColumnItems'
        sourceColumnId = i
      } else if (result.destination.droppableId === columns[i].id) { 
        // Percorre colunas (identifica coluna destino)           
        // Se id da coluna de destino do componente for igual ao id da coluna
        destinationColumnItems = columns[i].items // Insere os itens da coluna em 'destinationColumnItems'
        destinationColumnId = i
      }
    }

    // Percorre itens da coluna (identifica item arrastado)
    // Se id do item for igual ao id do componente (é o item arrastado)    
    for (let i in sourceColumnItems) {
      if (sourceColumnItems[i].id === result.draggableId) {
        draggedItem = sourceColumnItems[i] // Insere este item arrastado para 'draggedItem'
      }
    }

    // Exclui o item arrastado
    let filteredSourceColumnItems = sourceColumnItems.filter((item) =>     
    item.id !== result.draggableId) // Fica somente os itens que NÃO mudarem de lugar (ids diferentes entre si) (o que muda de lugar fica com ambos ids iguais e será excluído pelo filter)
    
    // Adicionar o item excluído (item arrastado) na nova posição
    if (result.source.droppableId === result.destination.droppableId) { // Se igual então o item está sendo arrastado na mesma coluna
      filteredSourceColumnItems.splice(result.destination.index, 0, draggedItem)
      // splice(índice de início, quantos excluir, o que inserir)      

      // Mudar o state
      let columnsCopy = JSON.parse(JSON.stringify(columns)) 
      // Transforma 'columns' em string, depois em objeto novamente
      // Obs: só com [...columns] faria a cópia, mas somente em array simples
      columnsCopy[sourceColumnId].items = filteredSourceColumnItems // Insiro na cópia do 'inicialItems' a nova lista de itens já com a nova ordem (coluna origem)
      setColumns(columnsCopy) // Insere no estado a cópia do 'inicialItems' já com a nova ordem
    } else { // Senão então o item está sendo arrastado em colunas diferentes
      destinationColumnItems.splice(result.destination.index, 0, draggedItem) // Insere item na coluna de destino
      // splice(índice de início, quantos excluir, o que inserir)
        
      let columnsCopy = JSON.parse(JSON.stringify(columns)) 
      // Transforma 'columns' em string, depois em objeto novamente
      // Obs: só com [...columns] faria a cópia, mas somente em array simples

      columnsCopy[sourceColumnId].items = filteredSourceColumnItems // Insiro na cópia do 'inicialItems' da coluna 1, a nova lista de itens já com a nova ordem
      columnsCopy[destinationColumnId].items = destinationColumnItems // Insiro na cópia do 'inicialItems' da coluna 2, a lista de itens de destino
      setColumns(columnsCopy) // Insere no estado a cópia do 'inicialItems' já com a nova ordem
    }

  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>

      <DragDropContext onDragEnd={onDragEnd}>

        {columns.map((column) => (  // Para cada coluna do 'columns', renderiza...        
          <div style={{ display: "flex", flexDirection:"column", alignItems:"center" }}>

            {/* Nome da coluna */}
            <h1>{column.name}</h1>

            {/* Possibilita mudar itens dentro da coluna */}
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  style={{ backgroundColor: "lightblue", width: 250, height: 500, padding: 10, margin: 10 }}
                >
                  {column.items.map((item, index) => ( // Para cada item do 'inicialItems', renderiza...

                    // Possibilita mudar itens para colunas diferentes
                    <Draggable draggableId={item.id} index={index} key={item.id}>
                      {(provided) => (
                        <div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          style={{
                            backgroundColor: "gray",
                            height: 40,
                            marginBottom: 10,
                            ...provided.draggableProps.style,
                          }}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>

                  ))}

                  {provided.placeholder}
                </div>

              )}
            </Droppable>

          </div>
        ))}

      </DragDropContext>
      
    </div>
  );
}

export default App;
