import './Grid.css';
import {useState} from "react"; // Assume you have some basic styling defined here

const Grid = () => {
    const [grid, setGrid] = useState(initializeGrid());
    const [mode, setMode] = useState('wall'); // Default mode

    // Function to initialize the grid state
    function initializeGrid() {
        const rows = 10; // Example row count
        const cols = 10; // Example column count
        const newGrid = new Array(rows).fill(null).map(() => new Array(cols).fill(null).map(() => ({
            type: 'empty', // 'wall', 'start', 'end'
            visited: false,
            isStart: false,
            isEnd: false,
            parent: null
        })));
        // Set start and end for demonstration
        newGrid[0][0].isStart = true;
        newGrid[rows - 1][cols - 1].isEnd = true;
        return newGrid;
    }

    const startBFS = () => {
        // Find start and end positions in the grid
        let startNode = null;
        let endNode = null;
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col].isStart) {
                    startNode = [row, col]; // Construct startPos as [row, col]
                }
                if (grid[row][col].isEnd) {
                    endNode = [row, col]; // Construct endPos as [row, col]
                }
            }
        }

        if (!startNode || !endNode) {
            console.error("Start or end node not set.");
            return;
        }

        console.log("Starting BFS Search...");
        bfs(startNode, endNode); // Pass startPos and endPos to bfs function
    };


    // const bfs = (startPos, endPos) => {
    //     const queue = [startPos];
    //     while (queue.length > 0) {
    //         const [row, col] = queue.shift();
    //         const cell = grid[row][col];
    //         if (cell.isEnd) break; // End found
    //
    //         // Directions: Up, Right, Down, Left
    //         const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    //         for (let [dRow, dCol] of directions) {
    //             const newRow = row + dRow;
    //             const newCol = col + dCol;
    //             if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
    //                 const neighbor = grid[newRow][newCol];
    //                 if (!neighbor.visited && neighbor.type !== 'wall') {
    //                     neighbor.visited = true;
    //                     neighbor.parent = [row, col];
    //                     queue.push([newRow, newCol]);
    //                     // Add visualization logic here
    //                 }
    //             }
    //         }
    //     }
    // };

    const bfs = async (startPos, endPos) => {
        const [startRow, startCol] = startPos;
        const [endRow, endCol] = endPos;
        let queue = [[startRow, startCol]];
        let visited = grid.map(row => row.map(cell => false));
        visited[startRow][startCol] = true;

        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // Down, Up, Right, Left

        while (queue.length > 0) {
            const [row, col] = queue.shift();

            // Visualization delay
            await new Promise(resolve => setTimeout(resolve, 50)); // Adjust delay as needed

            // Process current cell
            if (row === endRow && col === endCol) {
                console.log("End found");
                break; // End found
            }

            for (let [dRow, dCol] of directions) {
                const newRow = row + dRow;
                const newCol = col + dCol;
                if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length && !visited[newRow][newCol] && grid[newRow][newCol].type !== 'wall') {
                    queue.push([newRow, newCol]);
                    visited[newRow][newCol] = true;

                    // Update grid for visualization
                    let newGrid = grid.slice(); // Create a shallow copy of the grid
                    newGrid[newRow][newCol] = {...newGrid[newRow][newCol], visited: true}; // Mark as visited
                    setGrid(newGrid); // Update state to trigger re-render
                }
            }
        }
    };


// Function to handle cell click

    function handleCellClick(row, col) {
        console.log(`Cell clicked: row ${row}, col ${col}, current mode: ${mode}`);

        const newGrid = [...grid];
        if (mode === 'start') {
            console.log('Setting start point');

            // Clear previous start, set new start
            newGrid.forEach(r => r.forEach(cell => {
                if (cell.isStart) cell.isStart = false;
            }));
            newGrid[row][col].isStart = true;
        } else if (mode === 'end') {
            console.log('Setting end point');

            // Clear previous end, set new end
            newGrid.forEach(r => r.forEach(cell => {
                if (cell.isEnd) cell.isEnd = false;
            }));
            newGrid[row][col].isEnd = true;
        } else if (mode === 'wall') {
            console.log('Toggling wall');

            // Toggle wall state
            newGrid[row][col].type = newGrid[row][col].type === 'wall' ? 'empty' : 'wall';
            console.log('New wall state:', newGrid[row][col].type);
        }
        setGrid(newGrid);
    }




    return (
        <div>
            <div>
                <button onClick={() => setMode('wall')}>Place Walls</button>
                <button onClick={() => setMode('start')}>Set Start Point</button>
                <button onClick={() => setMode('end')}>Set End Point</button>
                <button onClick={startBFS}>Start BFS Search</button>
            </div>
            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid-row">
                        {row.map((cell, colIndex) => (
                            <div
                                key={colIndex}
                                className={`cell ${cell.isStart ? 'start' : ''} ${cell.isEnd ? 'end' : ''} ${cell.type === 'wall' ? 'wall' : ''}`}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Grid;