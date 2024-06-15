import { type OnHomePageHandler, type OnUserInputHandler, type OnInstallHandler, UserInputEventType } from "@metamask/snaps-sdk";
import { SnapComponent, Box, Button, Image, Heading, Text, Italic, Row, Form, Dropdown, Option, Field, Divider, Copyable, GenericSnapElement, MaybeArray, SnapElement } from '@metamask/snaps-sdk/jsx';
/*
const svgTitle = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><style>.sign{text-anchor:middle;dominant-baseline:middle;font-size:64px;font-weight:bold}</style><defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#818181"/><stop offset=".24" stop-color="#b8b8b8"/><stop offset=".51" stop-color="#f3f3f3"/><stop offset=".86" stop-color="#b4b4b4"/><stop offset="1" stop-color="#666"/></linearGradient><filter id="c" x="-50%" y="-50%" width="200%" height="200%"><feComponentTransfer in="SourceAlpha"><feFuncA type="table" tableValues="1 0"/></feComponentTransfer><feGaussianBlur stdDeviation="4"/><feOffset dy="5" result="offsetblur"/><feFlood flood-color="#000" result="color"/><feComposite in2="offsetblur" operator="in"/><feComposite in2="SourceAlpha" operator="in"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode/></feMerge></filter><filter id="g" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8 8" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="glow"/><feMergeNode in="glow"/></feMerge></filter></defs><path fill="url(#a)" style="box-shadow:0 0 112px 168px inset rgba(0,0,0,.8)" d="M0 0h400v200H0z"/><rect fill="#334" filter="url(#c)" x="16" y="16" width="368" height="168"/><text x="200" y="62" class="sign" style="font-size:24px;font-weight:normal;font-family:'Comic Sans MS','Comic Sans',Charcoal,cursive" fill="white">Let's play...</text><text x="200" y="124" class="sign" fill="#ff8c00" filter="url(#g)">Slots</text><text x="200" y="124" class="sign" fill="white">Slots</text></svg>`; 

type SlotProps = { 
  one: string;
  two: string;
  three: string; 
}; 

const Slot: SnapComponent<SlotProps> = ({ one, two, three }) => {
  return (
    <Image src={svgArr[0]+one+svgArr[1]+two+svgArr[2]+three+svgArr[3]}/>
  );
};

const StaticSlot: SnapComponent<SlotProps> = ({ one, two, three }) => { 
  return ( 
    <Image src={svgStaticArr[0]+one+svgStaticArr[1]+two+svgStaticArr[2]+three+svgStaticArr[3]}/>
  );
}
*/

function shuffleArray(array:Array<Number|undefined>) {
  for (let i = array.length - 1; i > 0; i--) {
    // tslint:disable-next-line
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0]/4294967296 * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getEmoji(num:Number):string { 
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

function makeBoard():Array<Number> { 
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
  x: Number;
  y: Number; 
  val: Number;
}; 

const Cell: SnapComponent<CellProps> = ({x, y, val}) => { 
  if(val > 9) { 
    return <Button name={"space"+x+"-"+y}>{getEmoji(val)}</Button>; 
  }
  return <Text>{getEmoji(val)}</Text>; 
}

const Welcome: SnapComponent = () => { 
  return ( 
    <Box>
      <Heading>Welcome to Minesweeper!</Heading>
      <Text>Try to uncover the empty spaces on the board without tripping a mine.</Text>
      <Text>Ready to play?</Text>
      <Button name="start">Start</Button>
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
  if(event.name=="new") { 
    await snap.request({ 
      method: "snap_manageState",
      params: { operation: "clear" },
    }); 
    event.name = "start"; 
  }

  const playerState = await snap.request({method: "snap_manageState",
    params: { operation: "get" },
  })  || { board: [] };
  
  switch(event.name) { 
    case 'start': 
    default: 
      if(playerState.board.length < 1) { 
        // time to make a new board 
        playerState.board = makeBoard(); 
        await snap.request({method: "snap_manageState",
          params: { 
            operation: "update", 
            newState: playerState
          },
        }); 
      }
      const boardLength = Math.sqrt(playerState.board.length);
      // we should now have a proper board 
      // let's slice out boardLength at a time 
      const board2D = []; 
      for(let i = 0; i < playerState.board.length; i += boardLength) { 
        board2D.push( playerState.board.slice(i,i+boardLength) ); 
      }
      await snap.request({
        method: "snap_updateInterface",
        params: {
          id, 
          ui: (
            <Box>
              <Box>
                {board2D.map( (row,y) => { 
                  return ( 
                    <Box direction="horizontal" alignment="center">
                      {row.map( (cell,x) => <Cell x={x} y={y} val={cell}/> )}
                    </Box>
                  ); 
                })}
              </Box>
              <Button name={playerState.board.find((e) => e > 9) ? "confirmNew" : "new"}>New game</Button>
            </Box>
          ),
        },
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
  }
}; 
export const onInstall: OnInstallHandler = async () => {
  await snap.request({
    method: "snap_dialog",
    params: {
      type: "alert",
      content: (
        <Box>
          <Text>Thank you for installing Minesweeper!</Text>
          <Text><Italic>To play, open the MetaMask menu, then click "Snaps", then "Minesweeper".</Italic></Text>
        </Box>
      )
    },
  });
};