import { type OnHomePageHandler, type OnUserInputHandler, type OnInstallHandler, UserInputEventType } from "@metamask/snaps-sdk";
import { SnapComponent, Box, Button, Image, Heading, Text, Italic, Row, Form, Dropdown, Option, Field, Divider, Bold } from '@metamask/snaps-sdk/jsx';

const svgTitle = '<svg xmlns="http://www.w3.org/2000/svg" width="760" height="500" viewBox="0 0 760 500" fill="#fff"><style>.emoji{text-anchor:middle;dominant-baseline:middle;font-size:248px}.emoj{font-size:96px}</style><text class="emoji" x="200" y="182">💣</text><text class="emoji" x="560" y="182">1️⃣</text><text class="emoji" x="200" y="528">1️⃣</text><text class="emoji" x="560" y="528">1️⃣</text><path d="m189 205 22 8 144 144 6 22h-64v20l10 6 16 32v32h-32l-32-64h-16l-32 32-21 5z"/><path d="M355 357h16v32h-64v16h-16v-32h64zm0 0v-16h-16v16zm-16-16v-16h-16v16zm-16-16v-16h-16v16zm-16-16v-16h-16v16zm-16-16v-16h-16v16zm-16-16v-16h-16v16zm-16-16v-16h-16v16zm-16-16v-16h-16v16zm-16-16v-16h-16v16zm-32-16h16v-16h-16v-16h-16v272h32v-16h-16zm48 176v16h16v-16zm-16 32h16v-16h-16zm-16 16h16v-16h-16zm48-32v32h16v-32zm16 32v32h16v-32zm64 32v-32h-16v32zm-16-32v-32h-16v32zm-32 48h32v-16h-32z" fill="#000"/><text class="emoj" x="308" y="250">😭</text><text class="emoj" x="20" y="396">😵</text></svg>';

function shuffleArray(array:Array<number|undefined>) {
  for (let i = array.length - 1; i > 0; i--) {
    // tslint:disable-next-line
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0]/4294967296 * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function sweep(board:Array<number|undefined>, x:number, y:number) { 
  const boardLength = Math.sqrt(board.length); 
  const index = y*boardLength + x; 
  if(index >= 0 && index < board.length) { 
    // valid space 
    if(board[index] > 9) { 
      // valid space to sweep 
      board[index] -= 10; 
      if(0==board[index]) { // empty space, keep sweeping 
        if(x>0) { 
          sweep(board, x-1, y-1); 
          sweep(board, x-1, y  ); 
          sweep(board, x-1, y+1); 
        }
        sweep(board, x  , y-1); 
        sweep(board, x  , y+1); 
        if(x<(boardLength-1)) { 
          sweep(board, x+1, y-1); 
          sweep(board, x+1, y  ); 
          sweep(board, x+1, y+1); 
        }
      }
    }
  }
}

function reveal(board:Array<number|undefined>) {
  for(let i=0; i < board.length; i++) { 
    if(19==board[i]) { 
      board[i] = 9; 
    }
  }
}

function getEmoji(num:number):string { 
  /* 
   * 9 = bomb
   * 0 = empty space 
   * 1-8 = adjacent # of bombs
   * 10+ = hidden space 
   */
  switch(num) { 
    case 0: 
      return '⬜'; 
    case 1: 
      return '1️⃣'; 
    case 2: 
      return '2️⃣'; 
    case 3: 
      return '3️⃣'; 
    case 4: 
      return '4️⃣'; 
    case 5: 
      return '5️⃣'; 
    case 6: 
      return '6️⃣'; 
    case 7: 
      return '7️⃣'; 
    case 8: 
      return '8️⃣'; 
    case 9: 
      return '💣'; 
    default: 
      return '🔳'; 
  }
}

function makeBoard():Array<number> { 
  const board = [...new Array(10).fill(9),...new Array(71).fill(0)]; 
  shuffleArray(board); 
  // count spaces around bombs 
  const boardLength = Math.sqrt(board.length); // must be a square number... 
  for(let x = 0; x < boardLength; x++) { 
    for(let y = 0; y < boardLength; y++) { 
      // walk array 
      const index = y*boardLength+x; 
      if(board[index]==9) { 
        // we are at a bomb
        // let's try to add 1 to every square around this bomb 
        // we have to do 8 iterations 
        let tmpIndex; 
        if(x > 0) { 
          tmpIndex = (y-1)*boardLength+(x-1); // iteration 1
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
          tmpIndex = y*boardLength+(x-1); // iteration 2 
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
          tmpIndex = (y+1)*boardLength+(x-1); // iteration 3
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
        }
        tmpIndex = (y-1)*boardLength+x; // iteration 4
        if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
          board[tmpIndex] += 1; 
        }
        tmpIndex = (y+1)*boardLength+x; // iteration 5
        if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
          board[tmpIndex] += 1; 
        }
        if(x < (boardLength-1)) { 
          tmpIndex = (y-1)*boardLength+(x+1); // iteration 6
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
          tmpIndex = y*boardLength+(x+1); // iteration 7
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
          tmpIndex = (y+1)*boardLength+(x+1); // iteration 8
          if(tmpIndex >= 0 && tmpIndex < board.length && board[tmpIndex] < 9) { 
            board[tmpIndex] += 1; 
          }
        }
      }
    }
  }
  // finally, increment every space by 10 
  for(let i = 0; i < board.length; i++) { 
    board[i] += 10; 
  }
  return board; 
}

type CellProps = { 
  x: number;
  y: number; 
  val: number;
  marks: Array<string>; 
}; 

const Cell: SnapComponent<CellProps> = ({x, y, val, marks=[]}) => { 
  if(val > 9) { 
    if(-1!=marks.indexOf(`${x}-${y}`)) { 
      return <Button name={"sweep"+x+"-"+y}>🚩</Button>;
    }
    return <Button name={"sweep"+x+"-"+y}>{getEmoji(val)}</Button>; 
  }
  return <Button name="start">{getEmoji(val)}</Button>; 
}

const MarkCell: SnapComponent<CellProps> = ({x, y, val, marks=[]}) => { 
  if(val > 9) { 
    if(-1!=marks.indexOf(`${x}-${y}`)) { 
      return <Button name={"marked"+x+"-"+y}>🚩</Button>;
    }
    return <Button name={"marked"+x+"-"+y}>{getEmoji(val)}</Button>; 
  }
  return <Button name="mark">{getEmoji(val)}</Button>; 
}

type BoardProps = { 
  board: Array<number>; 
  state: string; 
  marks: Array<number>; 
}

const Board: SnapComponent<BoardProps> = ({board, state, marks}) => { 
  const boardLength = Math.sqrt(board.length);
  // we should now have a proper board 
  // let's slice out boardLength at a time 
  const board2D = []; 
  for(let i = 0; i < board.length; i += boardLength) { 
    board2D.push( board.slice(i,i+boardLength) ); 
  }
  if(state=="lose") { 
    return ( 
      <Box>
        {board2D.map( row => { 
          return ( 
            <Box direction="horizontal" alignment="center">
              {row.map( cell => <Button name="lose">{getEmoji(cell)}</Button> )}
            </Box>
          ); 
        })}
      </Box>
    ); 
  }
  else if(state=="win") { 
    return ( 
      <Box>
        {board2D.map( row => { 
          return ( 
            <Box direction="horizontal" alignment="center">
              {row.map( cell => <Button name="win">{(cell==19) ? '🚩' : getEmoji(cell)}</Button> )}
            </Box>
          ); 
        })}
      </Box>
    ); 
  }
  else if(state=="mark") { 
    return ( 
      <Box>
        {board2D.map( (row,y) => { 
          return ( 
            <Box direction="horizontal" alignment="center">
              {row.map( (cell,x) => <MarkCell x={x} y={y} val={cell} marks={marks}/> )}
            </Box>
          ); 
        })}
      </Box>
    ); 
  }
  return ( 
    <Box>
      {board2D.map( (row,y) => { 
        return ( 
          <Box direction="horizontal" alignment="center">
            {row.map( (cell,x) => <Cell x={x} y={y} val={cell} marks={marks}/> )}
          </Box>
        ); 
      })}
    </Box>
  ); 
}

const Welcome: SnapComponent = () => { 
  return ( 
    <Box>
      <Image src={svgTitle}/>
      <Divider/>
      <Heading>Welcome to Minesweeper!</Heading>
      <Text>Try to uncover the empty spaces on the board without tripping a mine.</Text>
      <Text>Ready to play?</Text>
      <Button name="fresh">Start</Button>
    </Box>
  ); 
}

export const onHomePage: OnHomePageHandler = async () => {
  const interfaceId = await snap.request({ 
    method: "snap_createInterface",
    params: {
      ui: <Welcome/>
    }
  }); 
  return { 
    id: interfaceId
  }
};

export const onUserInput: OnUserInputHandler = async ({id, event}) => { 
  const playerState = await snap.request({method: "snap_manageState",
    params: { operation: "get" },
  })  || { board: [], marks: [], stats: { 
    games: 0, wins: 0
  } };

  if(event.name=="new") { 
    playerState.board = []; 
    playerState.marks = []; 
    await snap.request({method: "snap_manageState", 
      params: { 
        operation: "update",
        newState: playerState
      }
    }); 
    event.name = "start"; 
  } 

  if(event.name=="fresh") { 
    // new session, check if in a win or lose state 
    if(playerState.board.length > 0) { 
      if(playerState.board.indexOf(19)==-1) { // must have lost 
        event.name = "lose"; 
      }
      else if(playerState.board.filter(el => el > 9).length < 11) { // must have won? 
        event.name = "win";
      } 
      else { 
        event.name = "start"; 
      }
    }
    else { 
      event.name = "start"; 
    }
  }

  if(event.name?.startsWith("sweep")) { 
    const coordinateString = event.name.slice(5); 
    if(-1!=playerState.marks.indexOf(coordinateString)) { 
      // this is a flagged square, remove the flag 
      playerState.marks.splice(playerState.marks.indexOf(coordinateString), 1);
      // and don't sweep 
    }
    else { 
      const coordinates = coordinateString.split('-')
      const x = parseInt(''+coordinates[0]); 
      const y = parseInt(''+coordinates[1]); 
      sweep(playerState.board, x, y); 
      const index = y*Math.sqrt(playerState.board.length) + x; 
      if(playerState.board[index]==9) { // tripped a bomb
        reveal(playerState.board); 
        event.name = "lose"; 
      }
      else { 
        // have we won? 
        if(playerState.board.filter(el => el > 9).length < 11) { 
          // there are only bombs left, the player has won 
          playerState.stats.wins += 1; 
          event.name = "win"; 
        }
      }
    }
    await snap.request({method: "snap_manageState", 
      params: { 
        operation: "update",
        newState: playerState
      }
    }); 
  }
  else if(event.name?.startsWith("marked")) { 
    const markingString = event.name.slice(6); 
    const markedIndex = playerState.marks.indexOf(markingString); 
    if(-1==markedIndex) { 
      playerState.marks.push(markingString); 
    }
    else { 
      playerState.marks.splice(markedIndex, 1);
    }
    await snap.request({method: "snap_manageState", 
      params: { 
        operation: "update",
        newState: playerState
      }
    }); 
    event.name = "mark"; 
  }
  
  switch(event.name) { 
    case 'stats': 
      await snap.request({
        method: "snap_updateInterface",
        params: {
          id, 
          ui: (
            <Box>
              <Heading>Stats</Heading>
              <Row label="Games played"><Text>{''+playerState.stats.games}</Text></Row>
              <Row label="Games won"><Text>{''+playerState.stats.wins}</Text></Row>
              <Row label="Success rate"><Text>{(Math.round(playerState.stats.wins * 100) / playerState.stats.games).toFixed(2)+'%'}</Text></Row>
              <Divider/>
              <Box direction="horizontal" alignment="space-around">
                <Button name="fresh">Go back</Button>
              </Box>
            </Box>
          ),
        }
      }); 
      break; 
    case 'confirmNew': 
      await snap.request({
        method: "snap_updateInterface",
        params: {
          id, 
          ui: (
            <Box>
              <Heading>Are you sure?</Heading>
              <Text>You have a game in progress. If you continue, you will lose your progress and start a new game.</Text>
              <Box direction="horizontal" alignment="space-around">
                <Button name="start">Go back</Button>
                <Button name="new" variant="destructive">Continue</Button>
              </Box>
            </Box>
          ),
        }
      }); 
      break; 
    case 'mark': 
      await snap.request({
        method: "snap_updateInterface",
        params: {
          id, 
          ui: (
            <Box>
              <Board board={playerState.board} state={event.name} marks={playerState.marks}/>
              <Box direction="horizontal" alignment="space-between">
                <Text>Click on a 🔳 to mark it</Text>
                <Button name="start">Back</Button>
              </Box>
              <Button name="new">New game</Button>
            </Box>
          ),
        },
      });
      break; 
    case 'lose': 
    case 'win': 
      await snap.request({
        method: "snap_updateInterface",
        params: {
          id, 
          ui: (
            <Box>
              <Board board={playerState.board} state={event.name}/>
              <Text><Bold>{event.name=="win" ? "😎 You won! Want to play again?" : "😵 Sorry, you lost. Try again?"}</Bold></Text>
              <Box direction="horizontal" alignment="space-around">
                <Button name="new">New game</Button>
                <Button name="stats">📊</Button>
              </Box>
            </Box>
          ),
        },
      });
      break; 
    case 'start': 
    default: 
      if(playerState.board.length < 1) { 
        // time to make a new board 
        playerState.board = makeBoard(); 
        playerState.stats.games += 1; 
        await snap.request({method: "snap_manageState",
          params: { 
            operation: "update", 
            newState: playerState
          },
        }); 
      }
      // get cleared % 
      const swept = playerState.board.filter(el => el < 9).length; 
      const clear = Math.floor((swept/71)*100); 
      await snap.request({
        method: "snap_updateInterface",
        params: {
          id, 
          ui: (
            <Box>
              <Board board={playerState.board} state="play" marks={playerState.marks}/>
              <Box direction="horizontal" alignment="space-between">
                <Text>{"Cleared: "+clear+"%"}</Text>
                <Button name="mark">Mark 🚩</Button>
              </Box>
              <Box direction="horizontal" alignment="space-around">
                <Button name="confirmNew">New game</Button>
                <Button name="stats">📊</Button>
              </Box>
            </Box>
          ),
        },
      });
      break; 
  }
}; 
export const onInstall: OnInstallHandler = async () => {
  await snap.request({
    method: "snap_dialog",
    params: {
      type: "alert",
      content: (
        <Box>
          <Image src={svgTitle}/>
          <Divider/>
          <Heading>Thanks for installing Minesweeper!</Heading>
          <Text>To play, open the MetaMask menu, then click "Snaps", then "Minesweeper".</Text>
        </Box>
      )
    },
  });
};