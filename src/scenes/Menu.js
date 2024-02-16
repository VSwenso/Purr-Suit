class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() {
        // load audio
        this.load.image('Menu', './assets/images/MenuER.png');
        this.load.audio('backgroundMusic', 'assets/sfx/DrippyMusic.mp3');
        this.load.audio('blip', 'assets/sfx/blip_select12.wav');
      }

    create() {
        this.backgroundMusic = this.sound.add('backgroundMusic');
        this.blip = this.sound.add('blip');
        this.backgroundMusic.play({ loop: true });
        this.backgroundMusic.setVolume(0.3);
        this.add.image(200, height/6, 'Menu').setOrigin(.3,.17);
        cursors = this.input.keyboard.createCursorKeys();
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '18px',
            color: '#F4A900',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        let creditConfig = {
            fontFamily: 'Courier',
            fontSize: '12px',
            color: 'black',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.text(this.scale.width/2, this.scale.height/1.85, 'You are a stray cat, running the streets', menuConfig).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height/1.68, 'But watch out for the pedestrians and birds.', menuConfig).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height/1.5, 'Use UP ARROW to jump and hold DOWN ARROW to lunge/roll', menuConfig).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height/1.4, 'Press SPACE to play', menuConfig).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height/1.2, 'Credits:', creditConfig).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height/1.15, 'Sound effects and music by Pixabay & Lesiakower: https://pixabay.com/sound-effects/', creditConfig).setOrigin(0.5);
        this.add.text(this.scale.width/2, this.scale.height/1.1, 'Assets made by: Tory Swenson', creditConfig).setOrigin(0.5);

    }

    update() {
        if (cursors.space.isDown) {
          this.backgroundMusic.stop();
          this.blip.play();
          this.scene.start('playScene');
          
        }
    }


}
