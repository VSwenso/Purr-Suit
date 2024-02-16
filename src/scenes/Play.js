class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        this.load.spritesheet('cat', './assets/spritesheets/CatSprite3.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.image('sidewalk', './assets/images/floorMac.png');
        this.load.image('background', './assets/images/Background ER.png');
        this.load.image('Dude', './assets/images/Joel.png');
        this.load.spritesheet('bird', './assets/spritesheets/pigeon.png', {
            frameWidth: 67,
            frameHeight: 48
        });
        this.load.audio('backgroundMusic2', 'assets/sfx/DrippyMusic.mp3');
        this.load.audio('JumpNoise', 'assets/sfx/jump.mp3');
        this.load.audio('DownNoise', 'assets/sfx/Jump2.mp3');
        this.load.audio('DeathNoise', 'assets/sfx/death.mp3');
    }

    create() {
        this.backgroundMusic2 = this.sound.add('backgroundMusic2');
        this.JumpNoise = this.sound.add('JumpNoise');
        this.DownNoise = this.sound.add('DownNoise');
        this.DeathNoise = this.sound.add('DeathNoise');
        this.backgroundMusic2.play({ loop: true });
        this.backgroundMusic2.setVolume(0.25);
        // Create the background and set its scrolling speed
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);
        this.backgroundSpeed = 7; // Adjust the speed 

        // Create the street sprite and a corresponding physics body
        this.ground = this.add.tileSprite(0, this.scale.height - 33, this.scale.width, 30, 'sidewalk').setOrigin(0);
        this.physics.world.enable(this.ground);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;

        // Create the cat sprite and add it to physics system
        this.player = this.physics.add.sprite(100, this.scale.height / 1.2, 'cat').setScale(2);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setSize(25, 30).setOffset(10, 10);
        this.player.body.setGravityY(300);

        // Set up cat jump configuration
        this.PLAYER_VELOCITY = 350;
        this.PLAYER_JUMP_VELOCITY = -600;
        this.isPlayerJumping = false;
        this.isPlayerRolling = false;

        cursors = this.input.keyboard.createCursorKeys();

        // Enable collisions between the player and street
        this.physics.add.collider(this.player, this.ground);

        this.anims.create({
            key: 'walk-right',
            frameRate: 13,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('cat', {
                start: 0,
                end: 7
            })
        });

        this.anims.create({
            key: 'bird-animation',
            frameRate: 2,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('bird', {
                start: 0,
                end: 1
            })
        });

        this.Dude = this.physics.add.group();

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.Dude, this.ground);
        
        this.physics.add.overlap(this.player, this.Dude, this.DudeCollision, null, this);

        this.spawnObstacleTimer = this.time.addEvent({
            delay: Phaser.Math.Between(1000, 2500), // Adjust the delay
            loop: true,
            callback: this.spawnObstacle,
            callbackScope: this
        })
        if(!this.highScore)
        {
            this.highScore = 0;
        }
        this.score = 0;
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#A18594',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        let scoreTextConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }
        this.scoreLeft = this.add.text(125, 10, this.p1Score, scoreConfig);
        this.scoreHigh = this.add.text(width-200, 10, this.highScore, scoreConfig);
        this.scoreTextHigh = this.add.text(width-400, 10, "High Score:", scoreTextConfig);
        this.scoreText = this.add.text(-75, 10, "Score:", scoreTextConfig);
        this.time.addEvent({
            delay: 75,
            repeat: -1, // Repeat inf
            callback: () => {
                this.score++; // Increment the score
                this.scoreLeft.setText(this.score); // Update the displayed score
                if(this.highScore < this.score)
                {
                    this.highScore = this.score;
                    this.scoreHigh.setText(this.highScore);
                }
            }
        });
        this.obstacleDelayMin = 800;
        this.obstacleDelayMax = 2500;
    }
    

    spawnObstacle() {
        const x = this.scale.width;
        const y = this.scale.height - 75; // Position the obstacle on top of the ground
        let obstacle;

        if (Phaser.Math.Between(0, 1) === 0) {
            obstacle = this.Dude.create(x, y, 'Dude').setScale(0.19);
            obstacle.body.setSize(width / 4, height + 50, 30,0);
        } else {
            // Spawn bird 
            var yVal = Phaser.Math.Between(30, 80);
            obstacle = this.Dude.create(x, y-yVal, 'bird').setScale(2); // Adjust scale as needed
            obstacle.body.setSize(obstacle.width/2.5, obstacle.height/2.7).setOffset(20,8); // Set collision size 
            obstacle.anims.play('bird-animation');
        }

        obstacle.body.allowGravity = false; // Disable gravity for the obstacle

        // Set a random delay for the next obstacle spawn
        const randomDelay = Phaser.Math.Between(this.obstacleDelayMin, this.obstacleDelayMax); // Adjust the delay range 
        this.spawnObstacleTimer.delay = randomDelay;

        if (this.score > 0 && this.score % 150 === 0 && this.obstacleDelayMin >= 300) {
            this.obstacleDelayMin -= 30; // Decrease the minimum delay
            this.obstacleDelayMax -= 100; // Decrease the maximum delay
        }

        obstacle.setVelocityX(this.backgroundSpeed * -60); // Make the obstacle scroll along with the ground
        obstacle.setImmovable(true);
    }

    DudeCollision(player, Dude) {
        this.backgroundMusic2.stop();
        this.DeathNoise.play();
        this.scene.start('menuScene');
    }

    update() {
        //this.isPlayerRolling = false;
        this.player.body.setGravityY(300);
        // Move the background layer for parallax scrolling
        this.ground.tilePositionX += this.backgroundSpeed;
        this.background.tilePositionX += this.backgroundSpeed/2;
        if (this.score > 0 && this.score % 100 === 0) {
            this.backgroundSpeed+=0.12
        }
        // Update the player's movement
        let playerVector = new Phaser.Math.Vector2(0, 0);
        playerDirection = 'right';
    
        if (cursors.up.isDown && !this.isPlayerJumping) {
            // Player is pressing up and not already jumping
            this.isPlayerJumping = true;
            this.player.setVelocityY(this.PLAYER_JUMP_VELOCITY); // Apply jump velocity
            this.JumpNoise.play();
        }
        if (cursors.down.isDown && !this.isPlayerRolling) {
            // Player is pressing down and not already falling
            this.DownNoise.play();
            this.player.body.setGravityY(6000); // Apply higher gravity when falling
            this.player.body.setSize(25, 15).setOffset(10, 25);
            
            
        } else {
            this.player.anims.play('walk-right', true);
            this.player.body.setSize(20, 30).setOffset(15, 10);
        }

            

    
        playerVector.normalize();
    
        // Reset the jump state if the player is on the ground
        if (this.player.body.onFloor()) {
            this.isPlayerJumping = false;
        }
    }
}