var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var score = 0;
var scoreText;
var game = new Phaser.Game(config);

function preload() {
    // завантажимо асети
    this.load.image('sky', 'assets/sky.png');
    this.load.image('fon', 'assets/fon.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('sk', 'assets/sk.png');

    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );

}
var platforms;

function create() {
    //додамо ігровий світ
    this.add.image(400, 300, 'sky');
    
   
    

// додамо платформи
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(200, 300, 'ground').setScale(0.5).refreshBody();
    platforms.create(700, 400, 'ground').setScale(0.5).refreshBody();
    platforms.create(100, 150, 'ground').setScale(0.5).refreshBody();
    platforms.create(700, 220, 'ground').setScale(0.5).refreshBody();
    platforms.create(400, 1000, 'ground').setScale(0.5).refreshBody();
    platforms.create(500, 700, 'ground').setScale(0.5).refreshBody();
    platforms.create(475, 450, 'ground').setScale(0.5).refreshBody();
    platforms.create(650, 320, 'ground').setScale(0.5).refreshBody();
    platforms.create(550, 120, 'ground').setScale(0.5).refreshBody();
    
    platforms.create(1400, 520, 'fon').setScale(5).refreshBody();

    this.add.image(909, 200, 'sk');
   

    player = this.physics.add.sprite(100, 450, 'dude');
    
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
// створимо анімації
this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
});

this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
});

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
});
// додамо курсор
cursors = this.input.keyboard.createCursorKeys();


    // Додали фізику зіркам
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });
    

   // Текс рахунку що додає бомби
   scoreText = this.add.text(825, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
playerName = this.add.text(825, -4, 'Діма Найк', { fontSize: '32px', fill: '#000' });
   this.physics.add.collider(player, platforms);
   this.physics.add.collider(stars, platforms);

   this.physics.add.overlap(player, stars, collectStar, null, this);

   bombs = this.physics.add.group();

this.physics.add.collider(bombs, platforms);

this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
    cursors = this.input.keyboard.createCursorKeys();

// керування кнопками
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
        
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}
// збір зірочок
function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 10);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 10);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 10);

    }
}


// бомби
function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
