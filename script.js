const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

// 游戏板块大小
const blockSize = 20;

// 游戏板块数量
const widthInBlocks = canvas.width / blockSize;
const heightInBlocks = canvas.height / blockSize;

// 分数变量
let score = 0;

// 绘制边框
const drawBorder = () => {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, 0, canvas.width, blockSize);
  ctx.fillRect(0, canvas.height - blockSize, canvas.width, blockSize);
  ctx.fillRect(0, 0, blockSize, canvas.height);
  ctx.fillRect(canvas.width - blockSize, 0, blockSize, canvas.height);
};

// 绘制分数
const drawScore = () => {
  ctx.font = "20px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`Score: ${score}`, blockSize, blockSize);
};

// 清空画布
const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// 绘制一个正方形
const drawSquare = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
};

// 检测坐标是否在游戏区域内
const inGameArea = (x, y) => {
  return x >= 0 && x <= widthInBlocks - 1 && y >= 0 && y <= heightInBlocks - 1;
};

// 定义蛇对象的构造函数
class Snake {
  constructor() {
    this.segments = [
      new Segment(7, 5),
      new Segment(6, 5),
      new Segment(5, 5)
    ];
    this.direction = "right";
    this.nextDirection = "right";
  }

  // 蛇移动函数
  move() {
    const head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
      newHead = new Segment(head.x + 1, head.y);
    } else if (this.direction === "down") {
      newHead = new Segment(head.x, head.y + 1);
    } else if (this.direction === "left") {
      newHead = new Segment(head.x - 1, head.y);
    } else if (this.direction === "up") {
      newHead = new Segment(head.x, head.y - 1);
    }

    if (this.checkCollision(newHead)) {
      gameOver();
      return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
      score++;
      apple.move();
    } else {
      this.segments.pop();
    }
  }

  // 检查蛇头与自身或游戏边界的碰撞
  checkCollision(head) {
    const leftCollision = head.x === -1;
    const rightCollision = head.x === widthInBlocks;
    const topCollision = head.y === -1;
    const bottomCollision = head.y === heightInBlocks;

    let wallCollision = leftCollision || rightCollision || topCollision || bottomCollision;

    let selfCollision = false;

    this.segments.forEach(segment => {
      if (head.equal(segment)) {
        selfCollision = true;
      }
    });

    return wallCollision || selfCollision;
  }

  // 改变方向
  setDirection(newDirection) {
    if (this.direction === "up" && newDirection === "down") {
      return;
    } else if (this.direction === "right" && newDirection === "left") {
      return;
    } else if (this.direction === "down" && newDirection === "up") {
      return;
    } else if (this.direction === "left" && newDirection === "right")    {
      return;
    } else {
      this.nextDirection = newDirection;
    }
  }

  // 绘制蛇
  draw() {
    this.segments.forEach(segment => segment.draw("Blue"));
    this.segments[0].draw("Red");
  }

}

// 定义方块对象的构造函数
class Segment {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // 判断两个方块是否相等
  equal(otherSegment) {
    return this.x === otherSegment.x && this.y === otherSegment.y;
  }

  // 绘制一个方块
  draw(color) {
    drawSquare(this.x, this.y, color);
  }
}

// 定义苹果对象的构造函数
class Apple {
  constructor() {
    this.position = new Segment(10, 10);
  }

  // 在随机位置生成苹果
  move() {
    const randomX = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    const randomY = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Segment(randomX, randomY);
  }

  // 绘制苹果
  draw() {
    drawSquare(this.position.x, this.position.y, "LimeGreen");
  }
}

// 初始化游戏对象
let snake = new Snake();
let apple = new Apple();

// 定义游戏结束函数
const gameOver = () => {
  clearInterval(intervalId);
  ctx.font = "60px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
};

// 处理键盘按下事件
const onKeyDown = event => {
  const key = event.keyCode;
  let newDirection;

  if (key === 37) {
    newDirection = "left";
  } else if (key === 38) {
    newDirection = "up";
  } else if (key === 39) {
    newDirection = "right";
  } else if (key === 40) {
    newDirection = "down";
  } else if (key === 32) {
    restart();
    return;
  } else {
    return;
  }

  snake.setDirection(newDirection);
};

// 开始游戏函数
const start = () => {
  intervalId = setInterval(() => {
    clearCanvas();
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
  }, 100);
};

// 重启游戏函数
const restart = () => {
  score = 0;
  snake = new Snake();
  apple = new Apple();
  clearInterval(intervalId);
  start();
}

// 开始游戏
let intervalId = 0;
drawBorder();
snake.draw();
apple.draw();
start();

// 监听键盘按下事件
document.addEventListener("keydown", onKeyDown);
