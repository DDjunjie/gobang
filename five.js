// 初始化游戏状态
let currentPlayer = 'black'; // 当前玩家,'black'或'white'
let gameBoard = Array(4).fill().map(() => Array(9).fill(null)); // 4个区块,每个区块9个格子
let needRotation = false; // 是否需要选择旋转
let selectedBlock = null; // 当前选中的区块
let gameOver = false; // 游戏是否结束

// 检查是否获胜
function checkWin() {
    // 将四个区块合并成一个6x6的棋盘
    let fullBoard = Array(6).fill().map(() => Array(6).fill(null));
    
    // 填充棋盘
    // 左上区块(block 0)
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            fullBoard[i][j] = gameBoard[0][i*3 + j];
        }
    }
    // 右上区块(block 1)
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            fullBoard[i][j+3] = gameBoard[1][i*3 + j];
        }
    }
    // 左下区块(block 2)
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            fullBoard[i+3][j] = gameBoard[2][i*3 + j];
        }
    }
    // 右下区块(block 3)
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            fullBoard[i+3][j+3] = gameBoard[3][i*3 + j];
        }
    }

    // 检查行
    for(let i = 0; i < 6; i++) {
        for(let j = 0; j <= 1; j++) {
            if(fullBoard[i][j] &&
               fullBoard[i][j] === fullBoard[i][j+1] &&
               fullBoard[i][j] === fullBoard[i][j+2] &&
               fullBoard[i][j] === fullBoard[i][j+3] &&
               fullBoard[i][j] === fullBoard[i][j+4]) {
                return fullBoard[i][j];
            }
        }
    }

    // 检查列
    for(let j = 0; j < 6; j++) {
        for(let i = 0; i <= 1; i++) {
            if(fullBoard[i][j] &&
               fullBoard[i][j] === fullBoard[i+1][j] &&
               fullBoard[i][j] === fullBoard[i+2][j] &&
               fullBoard[i][j] === fullBoard[i+3][j] &&
               fullBoard[i][j] === fullBoard[i+4][j]) {
                return fullBoard[i][j];
            }
        }
    }

    // 检查对角线
    for(let i = 0; i <= 1; i++) {
        for(let j = 0; j <= 1; j++) {
            // 检查右下对角线
            if(fullBoard[i][j] &&
               fullBoard[i][j] === fullBoard[i+1][j+1] &&
               fullBoard[i][j] === fullBoard[i+2][j+2] &&
               fullBoard[i][j] === fullBoard[i+3][j+3] &&
               fullBoard[i][j] === fullBoard[i+4][j+4]) {
                return fullBoard[i][j];
            }
            // 检查左下对角线
            if(fullBoard[i][j+4] &&
               fullBoard[i][j+4] === fullBoard[i+1][j+3] &&
               fullBoard[i][j+4] === fullBoard[i+2][j+2] &&
               fullBoard[i][j+4] === fullBoard[i+3][j+1] &&
               fullBoard[i][j+4] === fullBoard[i+4][j]) {
                return fullBoard[i][j+4];
            }
        }
    }
    
    return null;
}

// 创建棋盘格子
function createBoard() {
    for (let blockId = 1; blockId <= 4; blockId++) {
        const block = document.getElementById(`block${blockId}`);
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.block = blockId - 1;
            cell.dataset.cell = i;
            cell.addEventListener('click', handleCellClick);
            block.appendChild(cell);
        }
        // 为每个区块添加点击事件
        block.addEventListener('click', handleBlockClick);
    }
    
    // 创建旋转控制界面
    const rotationControls = document.querySelector('.rotation-controls');
    const clockwiseBtn = document.createElement('button');
    clockwiseBtn.textContent = '顺时针旋转';
    clockwiseBtn.className = 'rotate-btn';
    clockwiseBtn.style.display = 'none';
    clockwiseBtn.onclick = () => rotate('clockwise');
    
    const counterClockwiseBtn = document.createElement('button');
    counterClockwiseBtn.textContent = '逆时针旋转';
    counterClockwiseBtn.className = 'rotate-btn';
    counterClockwiseBtn.style.display = 'none';
    counterClockwiseBtn.onclick = () => rotate('counterclockwise');
    
    rotationControls.appendChild(clockwiseBtn);
    rotationControls.appendChild(counterClockwiseBtn);
}

// 处理格子点击事件
function handleCellClick(event) {
    if (needRotation || gameOver) return; // 如果需要旋转或游戏结束,禁止落子
    
    const block = parseInt(event.target.dataset.block);
    const cell = parseInt(event.target.dataset.cell);
    
    // 如果格子已经有棋子,返回
    if (gameBoard[block][cell]) return;
    
    // 放置棋子
    gameBoard[block][cell] = currentPlayer;
    const piece = document.createElement('div');
    piece.className = currentPlayer;
    event.target.appendChild(piece);
 
    // 提示需要旋转
    needRotation = true;
    const playerTurn = document.querySelector('.player-turn');
    playerTurn.innerHTML += '<div class="rotation-hint" style="color: red; margin-top: 10px;">请选择一个区块进行旋转</div>';
   
    // 切换玩家
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    document.getElementById('current-player').textContent = 
        currentPlayer === 'black' ? '黑子' : '白子';
}

// 处理区块点击事件
function handleBlockClick(event) {
    if (!needRotation || gameOver) return;
    
    // 获取被点击的区块ID
    let blockId;
    if (event.target.className === 'cell') {
        blockId = parseInt(event.target.parentElement.id.replace('block', ''));
    } else {
        blockId = parseInt(event.currentTarget.id.replace('block', ''));
    }
    
    selectedBlock = blockId;
    
    // 显示旋转按钮
    const buttons = document.querySelectorAll('.rotate-btn');
    buttons.forEach(btn => btn.style.display = 'inline-block');
    
    // 定位旋转按钮到玩家信息区域下方
    const rotationControls = document.querySelector('.rotation-controls');
    rotationControls.style.position = 'static';
    rotationControls.style.marginTop = '10px';
    
    // 高亮选中的区块
    document.querySelectorAll('.block').forEach(block => {
        block.style.border = '3px solid #333';
    });
    document.getElementById(`block${blockId}`).style.border = '3px solid red';
}

// 旋转区块
function rotate(direction) {
    if (!selectedBlock || gameOver) return;
    
    const block = selectedBlock - 1;
    const blockElement = document.getElementById(`block${selectedBlock}`);
    const cells = document.querySelectorAll(`#block${selectedBlock} .cell`);
    const newBoard = [...gameBoard[block]];
    
    // 添加旋转动画类
    if (direction === 'clockwise') {
        blockElement.classList.add('rotating-clockwise');
    } else {
        blockElement.classList.add('rotating-counterclockwise');
    }
    
    // 等待动画完成后更新棋盘
    setTimeout(() => {
        // 更新游戏状态数组
        if (direction === 'clockwise') {
            gameBoard[block] = [
                newBoard[6], newBoard[3], newBoard[0],
                newBoard[7], newBoard[4], newBoard[1],
                newBoard[8], newBoard[5], newBoard[2]
            ];
        } else {
            gameBoard[block] = [
                newBoard[2], newBoard[5], newBoard[8],
                newBoard[1], newBoard[4], newBoard[7],
                newBoard[0], newBoard[3], newBoard[6]
            ];
        }
        
        // 更新视图
        cells.forEach((cell, index) => {
            cell.innerHTML = '';
            if (gameBoard[block][index]) {
                const piece = document.createElement('div');
                piece.className = gameBoard[block][index];
                cell.appendChild(piece);
            }
        });

        // 移除动画类
        blockElement.classList.remove('rotating-clockwise', 'rotating-counterclockwise');

        // 检查是否获胜
        const winner = checkWin();
        if (winner) {
            gameOver = true;
            const playerTurn = document.querySelector('.player-turn');
            playerTurn.innerHTML = `<div style="color: red; font-size: 24px; margin-top: 20px;">${winner === 'black' ? '黑子获胜！' : '白子获胜！'}</div>`;
            return;
        }
        
        // 重置旋转状态并切换玩家
        needRotation = false;
        selectedBlock = null;
        document.querySelector('.rotation-controls').style.backgroundColor = '';
        document.querySelector('.rotation-controls p').textContent = '';
        document.querySelectorAll('.rotate-btn').forEach(btn => btn.style.display = 'none');
        document.querySelector('.rotation-hint')?.remove();
        document.getElementById(`block${selectedBlock}`).style.border = '3px solid #333';
    }, 500); // 动画持续时间为500ms
}

// 初始化游戏
createBoard();
