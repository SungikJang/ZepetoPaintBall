import {AudioClip, AudioSource, GameObject, Resources, Sprite} from 'UnityEngine';


export interface InterSoundManager {
    Play(soundName: string, pitch: number): void

    Stop(soundName: string): void

    Volume(soundName: string): void

    Init(): void;
}

export default class SoundManager implements InterSoundManager{
    // property
    private _audioSources: Map<string, AudioSource> = new Map<string, AudioSource>();
    public audioClip: AudioClip;

    // method
    public Play(soundName: string, pitch: number = 1): void {
        this.audioClip = Resources.Load<AudioClip>(`Sounds\\${soundName}`);
        if (this.audioClip == null) {
            console.log('오디오 클립이 없습니다');
            return;
        }
        const audioSource: AudioSource = this._audioSources.get(soundName);
        audioSource.pitch = pitch;
        audioSource.clip = this.audioClip;
        if (!audioSource.isPlaying) {
            audioSource.Play();
        }
    }
    public Stop(soundName: string): void {
        const audioSource: AudioSource = this._audioSources.get(soundName);
        audioSource.clip = null;
        if (audioSource.isPlaying) {
            audioSource.Stop();
        }
    }
    public Volume(soundName: string): void {
        const audioSource: AudioSource = this._audioSources.get(soundName);
        //audioSource.volume
    }

    // life cycle
    public Init(): void {
        const rootSound: GameObject = GameObject.Find('RootSound');
        if (!rootSound) {
            console.log('Sound는 씬에 없습니다');
        }
        const soundNames: string[] = ['BGM1'];
        for (let i = 0; i < soundNames.length; i++) {
            const soundName = soundNames[i];
            const go: GameObject = new GameObject(soundName);
            const audioSource = go.AddComponent<AudioSource>();
            audioSource.loop = true;
            audioSource.volume = 0.45;
            this._audioSources.set(soundName, audioSource);
            go.transform.parent = rootSound.transform;
        }

        this.Play('BGM1');
    }
}
