import { _decorator, AudioClip, AudioSource, Component, director, isValid, Node } from 'cc';
const { ccclass, property ,executionOrder} = _decorator;

const MUSIC_KEY = 'Audio.music';
const SOUND_KEY = 'Audio.sound';

@ccclass('BlackJackAudiosManager')
@executionOrder(-100)
export class BlackJackAudiosManager extends Component {
    @property(AudioSource)
    private musicAudioSource: AudioSource = null;

    @property(AudioSource)
    protected soundAudioSources: AudioSource[] = [];
    @property(AudioClip)
    musicClip : AudioClip;
    
    private playingClips: Map<AudioClip, AudioSource> = new Map();


    public get isMuteMusic() {
        return this.musicAudioSource.volume === 0 || localStorage.getItem(MUSIC_KEY) === '0';
    }
    public set isMuteMusic(value) {
        if (value) {
            this.musicAudioSource.volume = 0;
            localStorage.setItem(MUSIC_KEY, '0');
        }
        else {
            this.musicAudioSource.volume = 1;
            localStorage.setItem(MUSIC_KEY, '1');
        }
    }

    public get isMuteSound() {
        return this.soundAudioSources.length > 0 && 
               (this.soundAudioSources[0].volume === 0 || localStorage.getItem(SOUND_KEY) === '0');
    }

    public set isMuteSound(value) {
        if (value) {
            localStorage.setItem(SOUND_KEY, '0');

            for (const audioSource of this.soundAudioSources) {
                audioSource.volume = 0;
            }
        }
        else {
            localStorage.setItem(SOUND_KEY, '1');

            for (const audioSource of this.soundAudioSources) {
                audioSource.volume = 1;
            }
        }
    }

    private static _ins: BlackJackAudiosManager = undefined;
    public static get ins() {
        return this._ins;
    }

    protected onLoad(): void {
     
        /*
        BlackJackAudiosManager._ins = this;
        if (localStorage.getItem(MUSIC_KEY) === '0') {
            this.musicAudioSource.volume = 0;
        }

        if (localStorage.getItem(SOUND_KEY) === '0') {
            for (const audioSource of this.soundAudioSources) {
                audioSource.volume = 0;
            }
        }
        */
    }

    public playMusic(clip: AudioClip) {
        if (!clip) return;
        this.musicAudioSource.clip = clip;
        this.musicAudioSource.play();
    }

    public playSound(clip: AudioClip) {
        if (!clip ) return;

        if(document.hidden){
            //Skipped playing ${clip.name} because page is hidden.
            return;
        }
    
        for (const audioSource of this.soundAudioSources) {
            if (!audioSource.playing) {
                audioSource.stop(); // safety: stop anything lingering
    
                audioSource.clip = clip;
                audioSource.play();
    
                this.playingClips.set(clip, audioSource);
    
                // Attach listener directly and clean up
                const onEnd = () => {
                    this.playingClips.delete(clip);
                    audioSource.node.off(AudioSource.EventType.ENDED, onEnd); // cleanup
                };
    
                audioSource.node.on(AudioSource.EventType.ENDED, onEnd);
    
                break;
            }
        }
    }

    public isPlaying(clip: AudioClip): boolean {
        const source = this.playingClips.get(clip);
        return source ? source.playing : false;
    }

    public stopSound(clip: AudioClip) {
        const source = this.playingClips.get(clip);
        if (source && source.playing) {
            source.stop(); // <-- this force stops the sound
            this.playingClips.delete(clip);
    
            //cleanup: remove ALL listeners if needed
            source.node.off(AudioSource.EventType.ENDED);
        }
    }

    public stopAllSounds() {
        for (const [clip, source] of this.playingClips.entries()) {
            source.stop();
        }
        this.playingClips.clear();
    }

}
