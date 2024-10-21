const cells = document.querySelectorAll('.cell');
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'O'; // 플레이어1은 'O', AI 또는 플레이어2는 'X'
let gameActive = true;
let isTwoPlayerMode = false; // 기본적으로 AI 대결 모드

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', () => playerMove(cell));
});

document.getElementById('mode-toggle').addEventListener('change', toggleMode);

function playerMove(cell) {
    const index = cell.getAttribute('data-index');
    
    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    updateCell(cell, currentPlayer);

    const winner = currentPlayer; // 현재 플레이어를 저장

    checkResult(winner);

    if (gameActive) {
        if (isTwoPlayerMode) {
            currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
        } else {
            currentPlayer = 'X';
            setTimeout(aiMove, 500); // AI의 움직임을 살짝 지연시킴
        }
    }
}

function aiMove() {
    let bestMove = findBestMove();
    if (bestMove !== -1) {
        board[bestMove] = currentPlayer;
        const aiCell = document.querySelector(`[data-index='${bestMove}']`);
        updateCell(aiCell, currentPlayer);

        const winner = currentPlayer; // 현재 플레이어를 저장

        checkResult(winner);
        currentPlayer = 'O';
    }
}

function findBestMove() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = currentPlayer;
            if (checkWin(currentPlayer)) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWin('O')) {
                board[i] = '';
                return i;
            }
            board[i] = '';
        }
    }

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') return i;
    }

    return -1; // 더 이상 빈 칸이 없음
}

function updateCell(cell, player) {
    cell.classList.add(player.toLowerCase());
    cell.innerHTML = `<span>${player}</span>`;
}

document.addEventListener('DOMContentLoaded', function () {
    const modeToggle = document.getElementById('mode-toggle');
    const isTwoPlayerMode = localStorage.getItem('isTwoPlayerMode') === 'true'; // 로컬 스토리지에서 값 불러오기

    modeToggle.checked = isTwoPlayerMode; // 슬라이드 버튼 상태 설정
    updateGameMode(isTwoPlayerMode);

    modeToggle.addEventListener('change', function () {
        const isTwoPlayerMode = modeToggle.checked;
        localStorage.setItem('isTwoPlayerMode', isTwoPlayerMode); // 로컬 스토리지에 현재 상태 저장
        updateGameMode(isTwoPlayerMode);
    });
});

function updateGameMode(isTwoPlayerMode) {
    if (isTwoPlayerMode) {
        currentPlayer = 'O'; // 플레이어 1이 'O'
        alert('2인용 모드로 전환되었습니다.');
    } else {
        currentPlayer = 'O'; // 플레이어가 먼저 시작
        alert('AI 모드로 전환되었습니다.');
    }
    resetGame(); // 게임 초기화
}

function checkResult(winner) {
    if (checkWin(winner)) {
        setTimeout(() => {
            if (!isTwoPlayerMode) {
                if (winner === 'X') {
                    alert(`AI가 승리했습니다! 게임을 다시 시작합니다.`);
                } else if (winner === 'O') {
                    alert(`플레이어가 승리했습니다! 게임을 다시 시작합니다.`);
                }
            } else {
                alert(`${winner}가 승리했습니다! 게임을 다시 시작합니다.`);
            }
            location.reload(); // 게임을 새로 고침하여 초기화
        }, 100); // X 또는 O가 그려진 후 확인
    } else if (!board.includes('')) {
        setTimeout(() => {
            alert('공간이 없습니다. 게임을 다시 시작합니다.');
            location.reload(); // 게임을 새로 고침하여 초기화
        }, 100);
    }
}




function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function resetGame() {
    board.fill(''); // 보드 데이터를 초기화
    cells.forEach(cell => {
        cell.textContent = ''; // 셀의 텍스트를 초기화
        cell.className = 'cell'; // 셀의 클래스를 'cell'로 초기화하여 'x'나 'o' 클래스를 제거
    });
    currentPlayer = 'O'; // 초기 플레이어 설정
    gameActive = true; // 게임 상태를 활성화로 설정
}


function toggleMode() {
    isTwoPlayerMode = !isTwoPlayerMode;
    resetGame(); // 모드를 전환할 때 게임을 초기화
}
